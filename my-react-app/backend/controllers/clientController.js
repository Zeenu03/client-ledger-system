import Client from '../models/Client.js';

const clientController = {
    // GET /api/clients - Get all clients
    getAllClients: async (req, res) => {
        try {
            const clients = await Client.getAll();
            res.json(clients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/clients/with-balances - Get all clients with their current balances
    getAllClientsWithBalances: async (req, res) => {
        try {
            const clients = await Client.getAllWithBalances();
            res.json(clients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/clients/:id - Get single client by ID
    getClientById: async (req, res) => {
        try {
            const client = await Client.getById(req.params.id);
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }
            res.json(client);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/clients/:id/balance - Get client with current balance
    getClientWithBalance: async (req, res) => {
        try {
            const client = await Client.getWithBalance(req.params.id);
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }
            res.json(client);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/clients - Create new client
    createClient: async (req, res) => {
        try {
            const { clientname, shopname, mobilenumber, city, openingbalance } = req.body;

            // Validation
            if (!clientname) {
                return res.status(400).json({ error: 'Client name is required' });
            }

            const newClient = await Client.create({
                clientname,
                shopname,
                mobilenumber,
                city,
                openingbalance: openingbalance || 0
            });

            res.status(201).json(newClient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /api/clients/:id - Update client
    updateClient: async (req, res) => {
        try {
            const { clientname, shopname, mobilenumber, city, openingbalance } = req.body;

            // Validation
            if (!clientname) {
                return res.status(400).json({ error: 'Client name is required' });
            }

            const updatedClient = await Client.update(req.params.id, {
                clientname,
                shopname,
                mobilenumber,
                city,
                openingbalance
            });

            if (!updatedClient) {
                return res.status(404).json({ error: 'Client not found' });
            }

            res.json(updatedClient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /api/clients/:id - Delete client
    deleteClient: async (req, res) => {
        try {
            await Client.delete(req.params.id);
            res.json({ message: 'Client deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/clients/search?q=searchTerm - Search clients
    searchClients: async (req, res) => {
        try {
            const searchTerm = req.query.q;
            
            if (!searchTerm) {
                return res.status(400).json({ error: 'Search term is required' });
            }

            const clients = await Client.search(searchTerm);
            res.json(clients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/clients/debtors - Get clients with positive balance
    getDebtors: async (req, res) => {
        try {
            const debtors = await Client.getDebtors();
            res.json(debtors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/clients/creditors - Get clients with negative balance
    getCreditors: async (req, res) => {
        try {
            const creditors = await Client.getCreditors();
            res.json(creditors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/clients/count - Get total client count
    getClientCount: async (req, res) => {
        try {
            const count = await Client.getCount();
            res.json({ count });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default clientController;
