/**
 * Plaid Routes Setup
 * Integration example for Express.js
 */

import express, { Router } from 'express';
import * as plaidController from '../plaid.ts';

export function setupPlaidRoutes(app: express.Application): void {
  const router = Router();

  // Create Link Token
  router.post('/create-link-token', async (req, res) => {
    await plaidController.createLinkToken(req, res);
  });

  // Exchange Token
  router.post('/exchange-token', async (req, res) => {
    await plaidController.exchangeToken(req, res);
  });

  // Sync Transactions
  router.post('/sync-transactions', async (req, res) => {
    await plaidController.syncTransactions(req, res);
  });

  // Get Accounts
  router.get('/accounts', async (req, res) => {
    await plaidController.getAccounts(req, res);
  });

  // Disconnect
  router.post('/disconnect', async (req, res) => {
    await plaidController.disconnect(req, res);
  });

  app.use('/api/plaid', router);
  console.log('✅ Plaid routes initialized');
}

/**
 * Usage in your Express app:
 *
 * import express from 'express';
 * import { setupPlaidRoutes } from './api/routes/plaid-routes';
 *
 * const app = express();
 * app.use(express.json());
 *
 * // Setup Plaid routes
 * setupPlaidRoutes(app);
 *
 * app.listen(3000, () => {
 *   console.log('Server running on port 3000');
 * });
 */
