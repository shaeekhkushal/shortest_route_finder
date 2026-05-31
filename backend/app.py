from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Tuple, Optional
import osmnx as ox
import networkx as nx
import json
import hashlib
import os
from pathlib import Path

app = FastAPI(
    title="Shortest Route Finder API",
    description="API for finding shortest routes using Dijkstra's Algorithm",
    version="1.0.0"
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CACHE_DIR = Path(__file__).parent.parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)

NETWORK_TYPE = "drive"
graph_cache = {}

class RouteRequest(BaseModel):
    country: str
    city: str
    source: str
    target: str
    use_cache: bool = True

class RouteResponse(BaseModel):
    success: bool
    distance_km: float
    node_count: int
    coordinates: list
    source_coords: Tuple[float, float]
    target_coords: Tuple[float, float]
    error: Optional[str] = None

def get_cache_key(place: str) -> str:
    hash_str = hashlib.sha256(place.encode()).hexdigest()
    return str(CACHE_DIR / f"{hash_str}.json")

def load_graph_from_cache(cache_file: str) -> Optional[nx.Graph]:
    try:
        if os.path.exists(cache_file):
            with open(cache_file, 'r') as f:
                data = json.load(f)
            G = nx.node_link_graph(data)
            return G
    except Exception:
        pass
    return None

def save_graph_to_cache(G: nx.Graph, cache_file: str) -> None:
    try:
        data = nx.node_link_data(G)
        with open(cache_file, 'w') as f:
            json.dump(data, f)
    except Exception as e:
        print(f"Warning: Could not save cache: {e}")

def get_global_graph(city: str, country: str, cache: bool = True) -> nx.Graph:
    query = f"{city}, {country}"
    cache_file = get_cache_key(query)
    
    if cache:
        G = load_graph_from_cache(cache_file)
        if G is not None:
            return G
    
    try:
        G = ox.graph_from_place(query, network_type=NETWORK_TYPE, simplify=True)
        G = nx.Graph(G)
        
        if cache:
            save_graph_to_cache(G, cache_file)
        
        return G
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch map data for {query}: {str(e)}")

def parse_location_global(location: str, city: str, country: str) -> Tuple[float, float]:
    try:
        parts = location.split(",")
        if len(parts) == 2:
            lat = float(parts[0].strip())
            lon = float(parts[1].strip())
            return (lat, lon)
    except (ValueError, IndexError):
        pass
    
    query = f"{location}, {city}, {country}"
    try:
        lat, lon = ox.geocode(query)
        return (lat, lon)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid location or could not find: {query}")

def find_shortest_route(G: nx.Graph, source_coords: Tuple[float, float], 
                       target_coords: Tuple[float, float]) -> dict:
    try:
        source_node = ox.distance.nearest_nodes(G, source_coords[1], source_coords[0])
        target_node = ox.distance.nearest_nodes(G, target_coords[1], target_coords[0])
        
        route = nx.shortest_path(G, source=source_node, target=target_node, weight="length")
        
        route_distance = 0
        for i in range(len(route) - 1):
            try:
                edge_data = G.get_edge_data(route[i], route[i + 1])
                if isinstance(edge_data, dict):
                    route_distance += edge_data.get('length', 0)
                else:
                    for key, attrs in edge_data.items():
                        route_distance += attrs.get('length', 0)
                        break
            except Exception:
                pass
        
        route_coords = [
            (G.nodes[node]["y"], G.nodes[node]["x"])
            for node in route
        ]
        
        return {
            "success": True,
            "distance_km": route_distance / 1000,
            "node_count": len(route),
            "coordinates": route_coords,
            "source_coords": source_coords,
            "target_coords": target_coords,
        }
    
    except nx.NetworkXNoPath:
        raise HTTPException(status_code=400, detail="No path found between source and target")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error computing route: {str(e)}")


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Shortest Route Finder API"}


@app.post("/route", response_model=RouteResponse)
async def find_route(request: RouteRequest) -> RouteResponse:
    try:
        source_coords = parse_location_global(request.source, request.city, request.country)
        target_coords = parse_location_global(request.target, request.city, request.country)
        
        G = get_global_graph(request.city, request.country, cache=request.use_cache)
        
        result = find_shortest_route(G, source_coords, target_coords)
        
        return RouteResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        return RouteResponse(
            success=False,
            distance_km=0,
            node_count=0,
            coordinates=[],
            source_coords=(0, 0),
            target_coords=(0, 0),
            error=str(e)
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
