# Invoice Splitter

A web application that accepts a single combined invoice and automatically generates separate invoices for each client or project, streamlining billing and minimizing errors.

## Overview
Invoice Splitter lets you upload or input a combined invoice, select the clients or projects to split it into, validates the input, and instantly creates individual invoices that can be exported as PDFs. The system stores combined invoices with total amount and a list of client allocations, each containing a client identifier and split amount.

## Features
- **Instant invoice generation** – split a combined invoice in seconds.
- **Client/project selection** – choose which recipients receive which portion.
- **PDF export** – download each split invoice as a PDF file.
- **Input validation & error handling** – robust checks ensure data integrity.

## Architecture
- **Modular Monolith** – separate concerns for frontend, backend, and data layer.
- **Backend** – Node.js (Express) with TypeScript.
- **Database** – PostgreSQL accessed via Knex.
- **Frontend** – React (Vite) with TypeScript.

## Setup

### Prerequisites
- Node.js (>= 18)
- npm or yarn
- PostgreSQL server

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/invoice-splitter.git
   cd invoice-splitter
   ```

2. Install dependencies (root and frontend):
   ```bash
   npm install
   cd frontend
   npm install
   cd ..
   ```

3. Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port number for the backend server | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:password@localhost:5432/invoice_db` |
| `JWT_SECRET` | Secret key for JWT authentication (if needed) | `supersecretkey` |

## Running the Application
### Development
- **Backend**:  
  ```bash
  npm run backend:dev
  ```
- **Frontend**:  
  ```bash
  npm run frontend
  ```

### Production Build
1. Build the TypeScript code:
   ```bash
   npm run backend:build
   ```
2. Start the server:
   ```bash
   npm run backend:start
   ```

## API Endpoints (Backend)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/invoices` | Create a new combined invoice and return split invoice data. |
| `GET`  | `/api/invoices/:id` | Retrieve a combined invoice with its splits. |

*Full API documentation will be available at `/api/docs` when the server runs.*

## Testing
Run unit tests for the backend:
```bash
npm test
```

## Contributing
Feel free to open issues or submit pull requests. Please follow the code of conduct and keep the project's modular structure.

## Built by

**Irfan N** — [@mynameisirfan93](https://www.instagram.com/mynameisirfan93/)

From **Tekzbyte**