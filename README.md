# Restaurant ERP – Warehouse & Cashier Dashboard

An Arabic (RTL) admin dashboard for running a restaurant's back office: stock, purchasing, recipes, the cashier and reporting. It's the front end of a Laravel API, built with React and Ant Design.

## Modules

- **Cashier:** create orders, add products to open orders, track opened tables, send kitchen and warehouse requests, and print orders.
- **Warehouse:** departments and the products in each one, units, categories and sub-categories, and low-stock (under-limit) items.
- **Recipes:** recipe groups and recipes built from warehouse products.
- **Invoices:** incoming, outgoing and returned invoices, damaged-stock invoices, and printable invoice pages.
- **Clients and suppliers:** clients, client types, payment methods, discount reasons, suppliers and payables.
- **Reports:** stock totals, per-department and per-recipe reports, and supplier invoice reports.
- **Admin:** users, roles and permissions, with an unauthorized page for blocked routes.

## Stack

React 18, Vite, Ant Design, Axios, React Router, Sass, with i18next for the language switch.

## Running it locally

```bash
npm install
npm run dev
```

Set the API address in `config.js` (`API_ENDPOINT`) to point at the Laravel back end.
