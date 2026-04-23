/**
 * Express Server for Open Finance Integration
 * Supports: Plaid (fallback) + Belvo (primary for Brazil)
 * Run with: npx ts-node server.ts
 */

// Load environment variables FIRST - before any other imports
import dotenv from 'dotenv';
dotenv.config(); // Loads .env automatically

// Now import other modules
import express from 'express';
import cors from 'cors';
import { setupPluggyRoutes } from './src/api/routes/pluggy-routes.ts';
import { setupBelvoRoutes } from './src/api/routes/belvo-routes.ts';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Setup routes - Pluggy primary, Belvo fallback
setupPluggyRoutes(app);
setupBelvoRoutes(app);

// TODO: Re-enable Plaid once dependencies are sorted
// import { setupPlaidRoutes } from './api/routes/plaid-routes.ts';
// setupPlaidRoutes(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Plaid routes at http://localhost:${PORT}/api/plaid`);
  startPeriodicSync();
});

// Sync periódico: atualiza investimentos e transações a cada 6 horas
async function startPeriodicSync() {
  const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 horas

  async function runSync() {
    console.log('[Sync] Starting periodic sync...');
    try {
      const PocketBase = (await import('pocketbase')).default;
      const pb = new PocketBase('https://pocketbase-production-d5ae.up.railway.app');

      const connections = await pb
        .collection('pluggy_connections')
        .getList(1, 100, { filter: 'status = "active"' })
        .catch(() => null);

      if (!connections || connections.items.length === 0) {
        console.log('[Sync] No active connections to sync');
        return;
      }

      for (const conn of connections.items) {
        if (conn.item_id) {
          try {
            await fetch(`http://localhost:${PORT}/api/pluggy/sync-transactions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: conn.user_id, itemId: conn.item_id }),
            });

            await fetch(`http://localhost:${PORT}/api/pluggy/sync-investments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: conn.user_id, itemId: conn.item_id }),
            });

            console.log(`[Sync] Synced user ${conn.user_id}`);
          } catch (err) {
            console.warn(`[Sync] Error syncing user ${conn.user_id}:`, err);
          }
        }
      }

      console.log('[Sync] Periodic sync complete');
    } catch (err) {
      console.warn('[Sync] Error during periodic sync:', err);
    }
  }

  // Inicia sync periódico
  setInterval(runSync, SYNC_INTERVAL_MS);
  console.log(`🔄 Periodic sync enabled (every 6 hours)`);
}
