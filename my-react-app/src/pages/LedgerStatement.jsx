import React, { useState, useEffect } from 'react'
import { generateLedgerPDF } from '../services/pdfExport'
import { formatDate, formatAmount } from '../utils/helpers'
import transactionService from '../services/transactionService'
import clientService from '../services/clientService'

export default function LedgerStatement() {
  const [clients, setClients] = useState([])
  const [ledgerData, setLedgerData] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [clientSearch, setClientSearch] = useState(null)

  const [filters, setFilters] = useState({
    client: '',
    clientId: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
  })

  const [fullYearView, setFullYearView] = useState(false)

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    clientSearch === null || clientSearch === '' || client.clientname.toLowerCase().includes(clientSearch.toLowerCase())
  )

  // Fetch clients on mount
  useEffect(() => {
    fetchClients()
  }, [])

  // Fetch ledger data when filters change
  useEffect(() => {
    if (filters.clientId) {
      fetchLedgerData()
    } else {
      setLedgerData([])
    }
  }, [filters.clientId, filters.fromDate, filters.toDate])

  // Fetch all clients from backend
  const fetchClients = async () => {
    try {
      const response = await clientService.getAllClients()
      setClients(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError('Failed to load clients: ' + err.message)
    }
  }

  // Fetch ledger data from backend
  const fetchLedgerData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await transactionService.getLedgerWithRunningBalance(
        filters.clientId,
        filters.fromDate,
        filters.toDate
      )
      console.log('Ledger data:', response.data)
      setLedgerData(response.data)
    } catch (err) {
      console.error('Error fetching ledger:', err)
      setError('Failed to load ledger data: ' + err.message)
      setLedgerData([])
    } finally {
      setLoading(false)
    }
  }

  // Get client name by ID
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id == clientId)
    return client ? client.clientname : 'Select Client'
  }

  // Handle full year checkbox
  const handleFullYearChange = (e) => {
    setFullYearView(e.target.checked)
    if (e.target.checked) {
      // Set to very wide date range to show ALL transactions
      setFilters({
        ...filters,
        fromDate: '2000-01-01',
        toDate: '2099-12-31',
      })
    }
  }

  // Handle export
  const handleExport = (format) => {
    if (!filters.clientId) {
      setError('Please select a client first')
      return
    }

    const totalDr = ledgerData.reduce((sum, item) => sum + parseFloat(item.dr || 0), 0)
    const totalCr = ledgerData.reduce((sum, item) => sum + parseFloat(item.cr || 0), 0)
    const closingBalance = ledgerData.length > 0 ? parseFloat(ledgerData[ledgerData.length - 1].running_balance || 0) : 0

    if (format === 'xlsx') {
      alert('Excel export - integration needed')
    } else if (format === 'pdf') {
      generateLedgerPDF(
        getClientName(filters.clientId),
        filters.fromDate,
        filters.toDate,
        ledgerData,
        { totalDr, totalCr, closingBalance }
      )
    }
  }

  const totalDr = ledgerData.reduce((sum, item) => sum + parseFloat(item.dr || 0), 0)
  const totalCr = ledgerData.reduce((sum, item) => sum + parseFloat(item.cr || 0), 0)
  const closingBalance = ledgerData.length > 0 ? parseFloat(ledgerData[ledgerData.length - 1].running_balance || 0) : 0

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Filters */}
      <div className="card bg-blue-50">
        <h2 className="text-lg font-semibold mb-4">Client Statment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="🔍 Type to search and select client..."
              value={clientSearch !== null ? clientSearch : (filters.clientId ? clients.find(c => c.id == filters.clientId)?.clientname || '' : '')}
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
                        const client = clients.find(client => client.id == c.id)
                        setSelectedClient(client || null)
                        setFilters({
                          ...filters,
                          clientId: c.id,
                          client: c.clientname
                        })
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              className="input-field"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              disabled={fullYearView}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              className="input-field"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              disabled={fullYearView}
            />
          </div>
        </div>

        {/* Full Year Checkbox */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-300">
          <input
            type="checkbox"
            id="fullYear"
            className="w-5 h-5 cursor-pointer"
            checked={fullYearView}
            onChange={handleFullYearChange}
          />
          <label htmlFor="fullYear" className="text-sm font-medium text-gray-700 cursor-pointer">
            View All Transactions (Full Statement)
          </label>
        </div>
      </div>

      {/* Statement */}
      <div className="card overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Statement for {getClientName(filters.clientId)}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="btn-primary text-sm"
              disabled={!filters.clientId || loading}
            >
              Export PDF
            </button>
          </div>
        </div>

        {loading && <div className="text-center py-8 text-gray-600">Loading ledger data...</div>}

        {!loading && ledgerData.length === 0 && filters.clientId && (
          <div className="text-center py-8 text-gray-600">No transactions found for this client and date range</div>
        )}

        {!loading && ledgerData.length > 0 && (
          <>
            <div className="table-container">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Sr. No.</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Account</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Particulars</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Dr</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Cr</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerData.map((item, idx) => {
                    const dr = parseFloat(item.dr || 0)
                    const cr = parseFloat(item.cr || 0)
                    const balance = parseFloat(item.running_balance || 0)
                    
                    // All rows rendered the same way now (Add NET moved to Transactions page)
                    return (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-center text-gray-800">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-800">{formatDate(item.date)}</td>
                        <td className="px-4 py-3 text-gray-800">{item.account}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-pre-wrap">{item.particulars || '-'}</td>
                        <td className="px-4 py-3 text-right text-gray-800">{dr > 0 ? `₹${formatAmount(dr)}` : '-'}</td>
                        <td className="px-4 py-3 text-right text-gray-800">{cr > 0 ? `₹${formatAmount(cr)}` : '-'}</td>
                        <td className={`px-4 py-3 text-right font-semibold ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>₹{formatAmount(balance)}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                    <td colSpan="4" className="px-4 py-3 text-right">TOTALS:</td>
                    <td className="px-4 py-3 text-right text-blue-600">₹{formatAmount(totalDr)}</td>
                    <td className="px-4 py-3 text-right text-blue-600">₹{formatAmount(totalCr)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${closingBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>₹{formatAmount(closingBalance)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 space-y-4">
              {/* Row 1: Opening Balance */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Opening Balance</p>
                  <p className="text-2xl font-bold text-blue-600">₹{formatAmount(selectedClient?.openingbalance || 0)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Debited</p>
                  <p className="text-2xl font-bold text-blue-600">₹{formatAmount(totalDr)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Credited</p>
                  <p className="text-2xl font-bold text-blue-600">₹{formatAmount(totalCr)}</p>
                </div>
              </div>

              {/* Row 2: Closing Balance */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`col-start-2 col-span-1 p-4 bg-purple-50 rounded-lg`}>
                  <p className="text-gray-600 text-sm">Closing Balance</p>
                  <p className={`text-2xl font-bold ${closingBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>₹{formatAmount(closingBalance)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
