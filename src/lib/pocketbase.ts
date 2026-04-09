import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pbURL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';

export const pb = new PocketBase(pbURL);

// Re-fetch the user's plan directly from PocketBase to prevent client-side state manipulation.
// Always use this in write operations that enforce plan-based limits.
export async function getVerifiedPlan(userId: string): Promise<string> {
  const profile = await pb.collection("profiles").getOne(userId, { requestKey: null });
  return (profile.plan as string) || "free";
}

export default pb;
