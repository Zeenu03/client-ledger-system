import apiClient from './apiClient'

const clientService = {
  // Get all clients
  getAllClients: () => apiClient.get('/clients'),

  // Get single client
  getClientById: (id) => apiClient.get(`/clients/${id}`),

  // Create client
  createClient: (clientData) => apiClient.post('/clients', clientData),

  // Update client
  updateClient: (id, clientData) => apiClient.put(`/clients/${id}`, clientData),

  // Delete client
  deleteClient: (id) => apiClient.delete(`/clients/${id}`),

  // Get client with balance
  getClientWithBalance: (id) => apiClient.get(`/clients/${id}/balance`),

  // Get all clients with balances
  getAllClientsWithBalances: () => apiClient.get('/clients/with-balances'),

  // Search clients
  searchClients: (query) => apiClient.get('/clients/search', { params: { q: query } }),

  // Get debtors (clients who owe money)
  getDebtors: () => apiClient.get('/clients/debtors'),

  // Get creditors (clients we owe money to)
  getCreditors: () => apiClient.get('/clients/creditors'),

  // Get total client count
  getClientCount: () => apiClient.get('/clients/count'),
}

export default clientService
