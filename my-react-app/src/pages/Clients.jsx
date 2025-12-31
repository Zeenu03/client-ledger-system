import React, { useState, useEffect } from 'react'
import clientService from '../services/clientService'
import { formatAmount } from '../utils/helpers'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ 
    clientname: '', 
    shopname: '', 
    mobilenumber: '', 
    city: '', 
    openingbalance: 0 
  })

  // Fetch all clients on component mount
  useEffect(() => {
    fetchClients()
  }, [])

  // Fetch clients from backend
  const fetchClients = async () => {
    console.log('Fetching clients...');
    setLoading(true)
    setError(null)
    try {
      const response = await clientService.getAllClients()
      setClients(response.data)
    } catch (err) {
      setError('Failed to fetch clients: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handle form submission (Create or Update)
  const handleAddClient = async (e) => {
    e.preventDefault()
    
    // Validation - Required fields
    if (!formData.clientname || !formData.shopname || !formData.mobilenumber || !formData.city) {
      setError('All fields are required')
      return
    }

    // Validation - Phone number (must be 10 digits)
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.mobilenumber)) {
      setError('Mobile number must be exactly 10 digits (e.g., 9876543210)')
      return
    }

    // Validation - Opening balance (must be a positive number)
    if (formData.openingbalance < 0) {
      setError('Opening balance cannot be negative')
      return
    }

    try {
      if (editingId) {
        // Update existing client
        await clientService.updateClient(editingId, formData)
        setError(null)
        alert('Client updated successfully')
      } else {
        // Create new client
        await clientService.createClient(formData)
        setError(null)
        alert('Client added successfully')
      }
      
      // Reset form and refresh list
      setFormData({ clientname: '', shopname: '', mobilenumber: '', city: '', openingbalance: 0 })
      setShowForm(false)
      setEditingId(null)
      fetchClients() // Refresh the list
    } catch (err) {
      setError('Error saving client: ' + err.message)
      console.error(err)
    }
  }

  // Handle edit
  const handleEdit = (client) => {
    setFormData({
      clientname: client.clientname,
      shopname: client.shopname,
      mobilenumber: client.mobilenumber,
      city: client.city,
      openingbalance: client.openingbalance
    })
    setEditingId(client.id)
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id)
        setError(null)
        alert('Client deleted successfully')
        fetchClients() // Refresh the list
      } catch (err) {
        setError('Error deleting client: ' + err.message)
        console.error(err)
      }
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ clientname: '', shopname: '', mobilenumber: '', city: '', openingbalance: 0 })
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add Client Button */}
      <button
        onClick={() => {
          setShowForm(!showForm)
          setEditingId(null)
          setFormData({ clientname: '', shopname: '', mobilenumber: '', city: '', openingbalance: 0 })
        }}
        className="btn-primary w-full text-center py-3 text-lg font-semibold"
      >
        Add Client
      </button>

      {/* Add/Edit Client Form */}
      {showForm && (
        <div className="card bg-blue-50 border border-blue-200">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Client' : 'Add New Client'}
          </h2>
          <form onSubmit={handleAddClient} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., ABC Trading Co."
                value={formData.clientname}
                onChange={(e) => setFormData({ ...formData, clientname: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., ABC Shop"
                value={formData.shopname}
                onChange={(e) => setFormData({ ...formData, shopname: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                className={`input-field ${formData.mobilenumber && !/^[0-9]{10}$/.test(formData.mobilenumber) ? 'border-red-500 bg-red-50' : ''}`}
                placeholder="e.g., 9876543210 (10 digits only)"
                value={formData.mobilenumber}
                onChange={(e) => setFormData({ ...formData, mobilenumber: e.target.value })}
                required
              />
              {formData.mobilenumber && !/^[0-9]{10}$/.test(formData.mobilenumber) && (
                <p className="text-red-500 text-xs mt-1">❌ Mobile number must be exactly 10 digits</p>
              )}
              {formData.mobilenumber && /^[0-9]{10}$/.test(formData.mobilenumber) && (
                <p className="text-green-600 text-xs mt-1">✓ Valid phone number</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
              <input
                type="number"
                className={`input-field ${formData.openingbalance < 0 ? 'border-red-500 bg-red-50' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.openingbalance}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value)
                  setFormData({ ...formData, openingbalance: isNaN(value) ? 0 : value })
                }}
              />
              {formData.openingbalance < 0 && (
                <p className="text-red-500 text-xs mt-1">Opening balance must be positive</p>
              )}
              {formData.openingbalance > 0 && (
                <p className="text-green-600 text-xs mt-1">✓ Valid balance: ₹{formatAmount(formData.openingbalance)}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Client' : 'Save Client'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients Table */}
      <div className="card overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">All Clients</h2>
        
        {loading && <p className="text-center py-6 text-gray-500">Loading clients...</p>}

        {!loading && clients.length === 0 && (
          <p className="text-center py-6 text-gray-500">No clients found. Add one to get started!</p>
        )}

        {!loading && clients.length > 0 && (
          <div className="table-container">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Client Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Shop Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mobile</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{client.clientname}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{client.shopname}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.mobilenumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.city}</td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      <button 
                        onClick={() => handleEdit(client)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
