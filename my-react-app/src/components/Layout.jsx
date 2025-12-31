import React from 'react'

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="container-main py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
