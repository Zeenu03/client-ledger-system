import apiClient from './apiClient'

const reportService = {
  // Get ledger statement
  getLedgerStatement: (clientId, fromDate, toDate) =>
    apiClient.get(`/reports/ledger/${clientId}`, {
      params: { fromDate, toDate },
    }),

  // Export to Excel
  exportToExcel: (clientId, fromDate, toDate) =>
    apiClient.get(`/reports/export/excel/${clientId}`, {
      params: { fromDate, toDate },
      responseType: 'blob',
    }),

  // Export to PDF
  exportToPDF: (clientId, fromDate, toDate) =>
    apiClient.get(`/reports/export/pdf/${clientId}`, {
      params: { fromDate, toDate },
      responseType: 'blob',
    }),

  // Get balance summary
  getBalanceSummary: (clientId) => apiClient.get(`/reports/balance-summary/${clientId}`),

  // Get dashboard stats
  getDashboardStats: () => apiClient.get('/reports/dashboard-stats'),
}

export default reportService
