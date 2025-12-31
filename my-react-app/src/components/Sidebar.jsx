import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ isOpen }) {
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Clients', path: '/clients', icon: '👥' },
    { label: 'Transactions', path: '/transactions', icon: '📝' },
    { label: 'Ledger Statement', path: '/ledger', icon: '📋' },
  ]

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white transition-all duration-300 ease-in-out shadow-lg`}
    >
      <div className="p-6 text-center border-b border-gray-700">
        <h2 className={`font-bold ${isOpen ? 'text-xl' : 'text-xs'}`}>
          {isOpen ? 'Ledger' : 'L'}
        </h2>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
