import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const menuItems = [
    {
      path: '/clients',
      title: 'Client Management',
      icon: '👥',
      description: 'Add, view, and manage client information',
      color: 'from-blue-500 to-blue-600',
    },
    {
      path: '/transactions',
      title: 'Transaction Management',
      icon: '📝',
      description: 'Record and track financial transactions',
      color: 'from-green-500 to-green-600',
    },
    {
      path: '/ledger',
      title: 'View Statement',
      icon: '📋',
      description: 'Generate and export client statements',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
      {menuItems.map((item, idx) => (
        <Link
          key={idx}
          to={item.path}
          className={`bg-gradient-to-r ${item.color} text-white rounded-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer block group`}
        >
          <div className="flex items-start gap-4">
            {/* Icon Container */}
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 group-hover:text-opacity-90">
                {item.title}
              </h2>
              <p className="text-white text-opacity-90 text-sm leading-relaxed">
                {item.description}
              </p>
              
              {/* Arrow Indicator */}
              <div className="mt-4 flex items-center gap-2 text-white text-opacity-75 group-hover:text-opacity-100 transition-all">
                <span className="text-sm font-medium">Click to proceed</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-30 group-hover:opacity-100 transition-opacity"></div>
        </Link>
      ))}
    </div>
  )
}
