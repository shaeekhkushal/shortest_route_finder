# Global Shortest Route Finder

A modern, browser-based interactive map application that calculates and visualizes the shortest route between any two locations globally using Dijkstra's Algorithm (via OSMnx and NetworkX). 

## 🌟 Features

- **Global Dynamic Routing:** Calculate the shortest route between any two points in any city and country around the world.
- **Interactive Map:** Powered by Leaflet, explore the globe, zoom in on your generated routes, and view detailed path mapping.
- **Dijkstra’s Algorithm:** Uses Python's `osmnx` and `networkx` to dynamically download real OpenStreetMap street networks and compute the most optimal path.
- **Smart Caching:** Map graphs are cached locally as JSON files. The first search in a new city might take a minute to download the street data, but all subsequent searches in that city will be lightning fast.
- **Modern UI:** Built with React, Vite, and TailwindCSS for a sleek, responsive, and beautiful user experience. Includes seamless Dark Mode and Light Mode switching.

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- TypeScript
- TailwindCSS
- React Router Dom
- React-Leaflet (Map visualization)
- Zustand (State management)

**Backend:**
- Python 3
- FastAPI (REST API)
- OSMnx & NetworkX (Graph generation & Shortest path computation)
- Uvicorn (ASGI Server)

---

## 🚀 Getting Started

The application is split into two parts: a backend API and a frontend UI. You will need to run both simultaneously in separate terminal windows.

### 1. Backend Setup (FastAPI)

Open a terminal window and navigate to the project root:

```bash
cd backend

# 1. Activate the virtual environment
source ../venv/bin/activate

# 2. Start the server using the virtual environment's Python
python -m uvicorn app:app --reload
```
*The backend API will start on `http://127.0.0.1:8000`*

### 2. Frontend Setup (React + Vite)

Open a **new** terminal window and navigate to the project root:

```bash
cd frontend

# Install dependencies (if you haven't already)
npm install

# Start the development server
npm run dev
```
*The frontend application will start on `http://localhost:5173`*

---

## 📖 How to Use

1. Navigate to `http://localhost:5173` in your browser.
2. Click on **Find Shortest Route**.
3. Enter the context of your search:
   - **Country:** e.g., `France`
   - **City:** e.g., `Paris`
4. Enter your exact start and end points:
   - **From Location:** e.g., `Eiffel Tower`
   - **To Location:** e.g., `Louvre Museum`
5. Click **Find Route**. 
   *(Note: The very first time you search a new city, it will take time to download the geographic graph data from OpenStreetMap. Please be patient!)*
6. View your route, total distance, and nodes traversed directly on the interactive map!

---

## 🏗️ Architecture Notes

- **Graph Caching:** When you query a new city, the backend downloads the street network and saves it to the `cache/` directory in the project root. This prevents rate-limiting from OpenStreetMap and massively speeds up future requests.
- **API Flow:** 
  - The frontend sends a POST request with the country, city, and location names.
  - The backend geocodes the start/end locations into precise `(lat, lon)` coordinates.
  - The backend loads (or downloads) the graph for the city.
  - The algorithm calculates the shortest path and returns the list of coordinates to the frontend to render the blue polyline path.
