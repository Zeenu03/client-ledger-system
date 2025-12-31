import apiClient from './apiClient'

const transactionService = {
  // Get all transactions
  getAllTransactions: () => apiClient.get('/transactions'),

  // Get single transaction by ID
  getTransactionById: (id) => apiClient.get(`/transactions/${id}`),

  // Get transactions by client
  getTransactionsByClient: (clientId) => apiClient.get(`/transactions/client/${clientId}`),

  // Get ledger statement (with date range)
  getLedgerStatement: (clientId, startDate, endDate) =>
    apiClient.get(`/transactions/ledger/${clientId}`, {
      params: { startDate, endDate },
    }),

  // Get ledger with running balance
  getLedgerWithRunningBalance: (clientId, startDate, endDate) =>
    apiClient.get(`/transactions/ledger/${clientId}/running`, {
      params: { startDate, endDate },
    }),

  // Create transaction
  createTransaction: (transactionData) => apiClient.post('/transactions', transactionData),

  // Update transaction
  updateTransaction: (id, transactionData) => apiClient.put(`/transactions/${id}`, transactionData),

  // Delete transaction
  deleteTransaction: (id) => apiClient.delete(`/transactions/${id}`),

  // Get recent transactions
  getRecentTransactions: (limit = 10) =>
    apiClient.get('/transactions/recent', { params: { limit } }),

  // Get transactions summary by date range
  getSummaryByDateRange: (startDate, endDate) =>
    apiClient.get('/transactions/summary/date-range', {
      params: { startDate, endDate },
    }),

  // Get transactions summary by account
  getSummaryByAccount: () => apiClient.get('/transactions/summary/by-account'),

  // Get daily transactions summary
  getDailySummary: (startDate, endDate) =>
    apiClient.get('/transactions/summary/daily', {
      params: { startDate, endDate },
    }),

  // Get monthly transactions summary
  getMonthlySummary: (startDate, endDate) =>
    apiClient.get('/transactions/summary/monthly', {
      params: { startDate, endDate },
    }),

  // Recalculate balance for a client
  recalculateBalance: (clientId) =>
    apiClient.post(`/transactions/recalculate/${clientId}`),
}

export default transactionService
