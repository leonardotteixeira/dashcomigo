import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pbURL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';

export const pb = new PocketBase(pbURL);

export default pb;
