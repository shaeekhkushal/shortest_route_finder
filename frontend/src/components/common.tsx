import type { ReactNode } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  className?: string
}) {
  const baseClass =
    'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:shadow-gray-900 ${className}`}
    >
      {children}
    </div>
  )
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
}: {
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${className}`}
    />
  )
}

export function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <span className="loader block drop-shadow-md"></span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  )
}

export function Header() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Route Finder</h1>
        <button
          onClick={toggleTheme}
          className="rounded-lg bg-gray-200 p-2 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          aria-label="Toggle theme"
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  )
}
