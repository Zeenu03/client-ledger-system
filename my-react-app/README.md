# Client Ledger System - Frontend

This is the React frontend for the Client Ledger System.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout.jsx   # Main layout wrapper
│   ├── Navbar.jsx   # Top navigation
│   └── Sidebar.jsx  # Side navigation
├── pages/           # Page components
│   ├── Dashboard.jsx
│   ├── Clients.jsx
│   ├── Transactions.jsx
│   └── LedgerStatement.jsx
├── services/        # API service layer
│   ├── apiClient.js
│   ├── clientService.js
│   ├── transactionService.js
│   └── reportService.js
├── utils/          # Utility functions
│   └── helpers.js
├── App.jsx         # Main app component
├── main.jsx        # Entry point
└── index.css       # Global styles (Tailwind)
```

## Features

- ✅ Client management (CRUD)
- ✅ Transaction entry
- ✅ Ledger statement view
- ✅ Export to Excel/PDF (backend integration needed)
- ✅ Running balance calculation
- ✅ Date range filtering

## Getting Started

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Development Server
\`\`\`bash
npm run dev
\`\`\`

Opens at: http://localhost:5173

### Build for Production
\`\`\`bash
npm run build
\`\`\`

## Environment Variables

Create a \`.env.local\` file:

\`\`\`
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Client Ledger System
\`\`\`

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **XLSX** - Excel export
- **jsPDF** - PDF export

## Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Dashboard | Overview & quick stats |
| `/clients` | Clients | Manage clients |
| `/transactions` | Transactions | Add/view transactions |
| `/ledger` | Ledger Statement | View full ledger with export |

## Next Steps

1. **Set up Backend** (Node.js + Express + PostgreSQL)
2. **Create Database Schema** (Clients, Transactions tables)
3. **Build Backend APIs** (CRUD for clients & transactions)
4. **Connect Frontend to APIs** (Replace mock data with real API calls)
5. **Add Export Functionality** (Excel & PDF generation)
6. **Deploy** (Frontend to Vercel/Netlify, Backend to Heroku/Railway)

## Support

For issues or questions, check the backend repository.
