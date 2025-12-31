# Client Ledger System

A full-stack accounting application for managing client accounts and transactions built with React, Node.js, Express, and PostgreSQL.

## Features

- **Client Management**: Add, edit, view, and delete client information
- **Transaction Tracking**: Record debits and credits for multiple account types (Cash, Bank, Net, No NET, Goods)
- **Ledger Statements**: View detailed transaction history with running balance calculations
- **Professional PDF Export**: Generate branded PDF statements with company logo and formatting
- **Account Types**: Support for Cash, Bank, Net, No NET, and Goods accounts
- **Date Range Filtering**: Filter transactions by custom date ranges
- **Searchable Dropdowns**: Quick client search and selection

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- jsPDF + html2canvas (for PDF generation)
- React Router

### Backend
- Node.js
- Express
- PostgreSQL
- pg (PostgreSQL client)
- dotenv

## Project Structure

```
parth/
├── my-react-app/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── LedgerStatement.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── clientService.js
│   │   │   ├── transactionService.js
│   │   │   └── pdfExport.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   └── App.jsx
│   ├── backend/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── routes/
│   │   │   ├── clientRoutes.js
│   │   │   └── transactionRoutes.js
│   │   ├── server.js
│   │   ├── queries.sql
│   │   └── update_schema.sql
│   └── public/
│       └── LOGO.png
├── database_schema.sql
├── .gitignore
├── GITHUB_SETUP_GUIDE.md
└── README.md
```

## Setup Instructions

See [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) for detailed setup instructions.

### Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/client-ledger-system.git
   cd client-ledger-system
   ```

2. **Setup Database**
   ```bash
   psql -U postgres -d accounting_db -f database_schema.sql
   ```

3. **Install Dependencies**
   ```bash
   # Frontend
   cd my-react-app
   npm install

   # Backend
   cd backend
   npm install
   ```

4. **Configure Environment**

   Create `my-react-app/backend/.env`:
   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=accounting_db
   DB_PASSWORD=your_password
   DB_PORT=5432
   PORT=5000
   ```

5. **Run Application**
   ```bash
   # Backend (in my-react-app/backend/)
   npm run dev

   # Frontend (in my-react-app/)
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Database Schema

### Clients Table
- `id` - Serial primary key
- `clientname` - Client/party name (required)
- `shopname` - Shop/business name
- `mobilenumber` - Contact number
- `city` - City location
- `openingbalance` - Starting balance
- `createdat` - Timestamp

### Transactions Table
- `id` - Serial primary key
- `date` - Transaction date (required)
- `clientid` - Foreign key to clients
- `account` - Account type (Cash/Bank/Net/No NET/Goods)
- `particulars` - Transaction description
- `dr` - Debit amount
- `cr` - Credit amount
- `balance` - Running balance
- `createdat` - Timestamp

## Account Types

- **Cash**: Regular cash transactions
- **Bank**: Bank account transactions
- **Net**: Debit-only transactions (credit not allowed)
- **No NET**: Special account with zero amounts
- **Goods**: Goods-related transactions

## PDF Export Features

- Company branding (Gayatri Lemon & Co.)
- Professional formatting with Arial font
- Company logo display (120px height)
- Contact information positioning
- Opening and closing balance calculations
- Date format: dd-Month Name-yyyy
- Filename format: clientname_date.pdf

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/transactions/client/:clientId` - Get transactions by client
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Company Information

**Gayatri Lemon & Co.**
SB lemoner
Kherva, Gujarat, 384001
Contact: Sachin B. Patel - 9904048755
