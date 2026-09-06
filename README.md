# Budget Tracker

A simple budget tracking app built with React and Vite. Log income and expenses, browse and edit your transaction history, and see a breakdown of spending by category.

## Features

- **Dashboard** — view total income, expenses, and balance at a glance, and filter transactions by category or type
- **Add Transaction** — record a new income or expense with description, amount, and category
- **Transaction Detail** — view, edit, or delete an individual transaction
- **Summary** — see spending broken down by category with percentage share
- **Dark / Light mode** — theme preference is saved and respected across sessions
- All data is stored locally in the browser (`localStorage`) — nothing is sent to a server

## Tech Stack

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) for client-side routing
- [Tailwind CSS](https://tailwindcss.com/) v4 for styling
- [shadcn] for the base component styling/config
- [base-ui](https://base-ui.com/) + [class-variance-authority](https://cva.style/) for UI primitives

## Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Shared components (Layout, ThemeToggle, TransactionRow, ui/)
├── context/          # ThemeContext for dark/light mode
├── hooks/            # useTransactions — localStorage-backed transaction data
├── pages/            # Route pages (Dashboard, AddTransaction, TransactionDetail, Summary, About)
├── lib/              # Utility functions
├── App.jsx           # Route definitions
└── main.jsx          # App entry point
```