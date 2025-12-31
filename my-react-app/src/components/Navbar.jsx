import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/clients':
        return 'Client Management'
      case '/transactions':
        return 'Transaction Entry'
      case '/ledger':
        return 'Client Statement'
      default:
        return 'Client Ledger System'
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Admin User</span>
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </nav>
  )
}
