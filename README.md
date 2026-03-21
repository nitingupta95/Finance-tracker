# Finance Tracker Application

A comprehensive personal finance manager with powerful visualization tools for tracking budgets and expenses. This application incorporates strict security guidelines, input validations, and robust Error handling.

## Key Features

### Security & Error Handling
- ✅ **Secure Authentication**: End-to-end authentication via Clerk.
- ✅ **Authorization**: Stringent checks ensure users can only access their own data.
- ✅ **Validation**: Full Zod schema configurations validating payloads prior to DB interactions.
- ✅ **Robust API Error Handling**: Global `ApiError` class safely propagating environment-aware errors.

### Dashboard
- 📊 Real-time spending analytics
- 📈 Interactive monthly trend charts
- 💰 Budget vs actual comparison

### Transactions
- 🛒 Smart transaction categorization
- 🔍 Advanced search and filtering
- 📅 Date-range reporting
- 🧾 Receipt image capture support

### Budgets
- 🗓️ Flexible budgeting periods
- 🔔 Overspending alerts
- 🔄 Recurring budget templates

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | App framework (App Router) |
| React 18 | UI components |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Clerk | Authentication |

### Backend
| Technology | Purpose |
|------------|---------|
| Next.js API | API Routes |
| MongoDB | Database |
| Mongoose | ODM (Optimized with Connection Caching) |
| Zod | Input Validation |

## Project Structure

```text
Finance-tracker/
├── app/ 
│   ├── dashboard/           # Dashboard analytics & tools
│   ├── transaction/         # Transaction management forms and list
│   ├── budget/              # Budget goals and creations
│   ├── (auth)/              # Clerk Auth Pages
│   └── api/                 # Secure API routes for operations
├── components/              # UI Component Library (Forms, charts, etc.)
├── hooks/                   # Business logic encapsulations (useBudgets, useTransactions)
├── lib/                     # Database connectivities, schema validations, utilities
└── types/                   # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Git (optional)
- Active MongoDB instance
- Active Clerk account for API keys

### Installation
 
```bash
# Clone repository
git clone https://github.com/nitingupta95/Finance-tracker.git
cd Finance-tracker

# Install dependencies
npm install

# Set up environment variables locally
cp .env.example .env.local

# Run the development server
npm run dev
```

### Configuration

Edit your local `.env.local` referencing the provided `.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
# Other necessary application variables as noted in .env.example...
```

## API Documentation

The `api/` directory encapsulates secure operations verified by authorization schemas:

### General Format
All API errors return consistently format as:
```json
{
  "error": "Message summarizing the error",
  "details": [] // Only generated in dev environments or field schema violations
}
```

### Endpoints
- **GET /api/budget** - Fetch all budgets linked to the authenticated user.
- **POST /api/budget** - Define a new budget (Zod Validated).
- **PUT /api/budget/[id]** - Update specifics of an existing budget using its ID (Authorized).
- **DELETE /api/budget/[id]** - Hard-delete a specific budget (Authorized).

- **GET /api/transaction** - Fetch all transactions associated with the user payload.
- **POST /api/transaction** - Store a new transaction (Zod Validated).
- **PUT /api/transaction/[id]** - Modify a transaction's information (Authorized).
- **DELETE /api/transaction/[id]** - Erase a registered transaction (Authorized).

## Contributing to the project
We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License
Distributed under the MIT License. See LICENSE for more information.

## Contact
Nitin Gupta - @nitingupta95 - ng61315@gmail.com
Project Link: https://github.com/nitingupta95/Finance-tracker