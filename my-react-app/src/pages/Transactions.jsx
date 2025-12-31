import React, { useState, useEffect } from 'react'
import transactionService from '../services/transactionService'
import clientService from '../services/clientService'
import { formatDate, formatAmount } from '../utils/helpers'

export default function Transactions() {
  const [clients, setClients] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [clientSearch, setClientSearch] = useState(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientid: '',
    account: 'Cash',
    particulars: '',
    dr: 0,
    cr: 0,
    balance: 0,
  })

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    clientSearch === null || clientSearch === '' || client.clientname.toLowerCase().includes(clientSearch.toLowerCase())
  )

  // Fetch clients and transactions on component mount
  useEffect(() => {
    fetchClients()
    fetchTransactions()
  }, [])

  // Fetch all clients from backend
  const fetchClients = async () => {
    try {
      const response = await clientService.getAllClients()
      console.log('Clients loaded:', response.data)
      setClients(response.data)
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError('Failed to load clients: ' + err.message)
    }
  }

  // Fetch all transactions from backend
  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await transactionService.getAllTransactions()
      console.log('Transactions loaded:', response.data)
      setTransactions(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Failed to load transactions: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get client name by ID
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id == clientId)
    return client ? client.clientname : 'Unknown Client'
  }

  // Handle form submission (Create or Update)
  const handleAddTransaction = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.date || !formData.clientid || !formData.account || !formData.particulars) {
      setError('Date, Client, Account, and Particulars are required')
      return
    }



    // Validation - Net or No NET account can only have Debit amount
    if ((formData.account === 'Net' || formData.account === 'No NET') && formData.cr > 0) {
      setError(`${formData.account} account can only have Debited amount, not Credit`)
      return
    }

    try {
      // Force dr and cr to 0 for 'No NET', cr to 0 for Net
      let drAmount = parseFloat(formData.dr) || 0;
      let crAmount = parseFloat(formData.cr) || 0;
      let accountValue = formData.account;
      if (formData.account === 'No NET') {
        drAmount = 0;
        crAmount = 0;
      } else if (formData.account === 'Net') {
        crAmount = 0;
      }
      const transactionData = {
        date: formData.date,
        clientid: parseInt(formData.clientid),
        account: accountValue,
        particulars: formData.particulars,
        dr: drAmount,
        cr: crAmount,
        balance: drAmount - crAmount,
      }

      if (editingId) {
        // Update existing transaction
        await transactionService.updateTransaction(editingId, transactionData)
        alert('Transaction updated successfully')
      } else {
        // Create new transaction
        await transactionService.createTransaction(transactionData)
        alert('Transaction added successfully')
      }

      setError(null)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        clientid: '',
        account: 'Cash',
        particulars: '',
        dr: 0,
        cr: 0,
        balance: 0,
      })
      setShowForm(false)
      setEditingId(null)
      fetchTransactions() // Refresh the list
    } catch (err) {
      setError('Error saving transaction: ' + err.message)
      console.error(err)
    }
  }

  // Handle edit
  const handleEdit = (transaction) => {
    setFormData({
      date: transaction.date,
      clientid: transaction.clientid,
      account: transaction.account,
      particulars: transaction.particulars,
      dr: transaction.dr || 0,
      cr: transaction.cr || 0,
      balance: transaction.balance || 0,
    })
    setEditingId(transaction.id)
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id)
        setError(null)
        alert('Transaction deleted successfully')
        fetchTransactions() // Refresh the list
      } catch (err) {
        setError('Error deleting transaction: ' + err.message)
        console.error(err)
      }
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      clientid: '',
      account: 'Cash',
      particulars: '',
      dr: 0,
      cr: 0,
      balance: 0,
    })
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <button
        onClick={() => {
          setShowForm(!showForm)
          setEditingId(null)
          setFormData({
            date: new Date().toISOString().split('T')[0],
            clientid: '',
            account: 'Cash',
            particulars: '',
            dr: 0,
            cr: 0,
            balance: 0,
          })
        }}
        className="btn-primary w-full text-center py-6 text-xl font-semibold"
      >
        Add Transaction
      </button>

      {showForm && (
        <div className="card bg-blue-50 border border-blue-200">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="🔍 Type to search and select client..."
                  value={clientSearch !== null ? clientSearch : (formData.clientid ? clients.find(c => c.id == formData.clientid)?.clientname || '' : '')}
                  onChange={(e) => setClientSearch(e.target.value)}
                  onFocus={() => {
                    setClientSearch('')
                  }}
                  onBlur={() => {
                    // Delay to allow click on select
                    setTimeout(() => {
                      if (clientSearch !== null) {
                        setClientSearch(null)
                      }
                    }, 200)
                  }}
                  required
                />
                {clientSearch !== null && (
                  <div
                    className="absolute z-10 bg-white border border-gray-300 rounded shadow-lg"
                    style={{
                      maxHeight: '280px',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '4px',
                      overflowY: 'auto'
                    }}
                  >
                    {filteredClients.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500">No clients found</div>
                    ) : (
                      filteredClients.map((c) => (
                        <div
                          key={c.id}
                          className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            setFormData({ ...formData, clientid: c.id })
                            setClientSearch(null)
                          }}
                        >
                          {c.clientname}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account *</label>
                <select
                  className="input-field"
                  value={formData.account}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'No NET') {
                      setFormData({ ...formData, account: value, dr: 0, cr: 0 });
                    } else {
                      setFormData({ ...formData, account: value });
                    }
                  }}
                  required
                >
                  <option>Cash</option>
                  <option>Bank</option>
                  <option>Net</option>
                  <option>No NET</option>
                  <option>Goods</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Particulars *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Opening Balance"
                  value={formData.particulars}
                  onChange={(e) => setFormData({ ...formData, particulars: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Debited Amount (Dr - Money they owe you)
                </label>
                <input
                  type="number"
                  className={`input-field ${formData.account === 'No NET' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="0.00"
                  min="0"
                  value={formData.account === 'No NET' ? '' : (formData.dr === 0 ? '' : formData.dr)}
                  onChange={(e) => {
                    if (formData.account !== 'No NET') {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value)
                      setFormData({ ...formData, dr: value, cr: 0 })
                    }
                  }}
                  disabled={formData.account === 'No NET'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credited Amount (Cr - You owe them)
                  {formData.account === 'Net' && <span className="text-red-500"> (Not allowed for Net)</span>}
                </label>
                <input
                  type="number"
                  className={`input-field ${(formData.account === 'Net' || formData.account === 'No NET') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="0.00"
                  min="0"
                  value={formData.account === 'No NET' ? '' : (formData.cr === 0 ? '' : formData.cr)}
                  onChange={(e) => {
                    // Only allow input if account is not Net or No NET
                    if (formData.account !== 'Net' && formData.account !== 'No NET') {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value)
                      setFormData({ ...formData, cr: value, dr: 0 })
                    }
                  }}
                  disabled={formData.account === 'Net' || formData.account === 'No NET'}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Transaction' : 'Save Transaction'}
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

      <div className="card overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        
        {loading && <p className="text-center py-6 text-gray-500">Loading transactions...</p>}

        {!loading && transactions.length === 0 && (
          <p className="text-center py-6 text-gray-500">No transactions found. Add one to get started!</p>
        )}

        {!loading && transactions.length > 0 && (
          <div className="table-container">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Client</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Account</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Particulars</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Debited (Dr)</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Credited (Cr)</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Balance</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trans) => {
                  // Convert to numbers to handle string values from database
                  const dr = parseFloat(trans.dr) || 0
                  const cr = parseFloat(trans.cr) || 0
                  const balance = parseFloat(trans.balance) || 0
                  
                  return (
                  <tr key={trans.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{formatDate(trans.date)}</td>
                    <td className="px-4 py-3 text-gray-800">{getClientName(trans.clientid)}</td>
                    <td className="px-4 py-3 text-gray-800">{trans.account}</td>
                    <td className="px-4 py-3 text-gray-600">{trans.particulars}</td>
                    <td className="px-4 py-3 text-center font-semibold text-green-600">
                      {dr > 0 ? '₹' + formatAmount(dr) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-red-600">
                      {cr > 0 ? '₹' + formatAmount(cr) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ₹{formatAmount(balance)}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button 
                        onClick={() => handleEdit(trans)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(trans.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
