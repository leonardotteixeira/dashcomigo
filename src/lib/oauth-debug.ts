/**
 * OAuth Configuration Debugger
 * Run this in browser console to diagnose OAuth setup issues
 */

import { pb } from "./pocketbase";

export async function debugOAuthConfig() {
  console.group("🔍 OAuth Configuration Debug");

  // 1. PocketBase URL
  console.log("📍 PocketBase URL:", pb.baseUrl);

  // 2. Collection exists
  try {
    const collections = await fetch(`${pb.baseUrl}/api/collections/profiles`);
    if (collections.ok) {
      console.log("✅ profiles collection exists");
    } else {
      console.error("❌ profiles collection not found");
    }
  } catch (err) {
    console.error("❌ Cannot reach PocketBase:", err);
  }

  // 3. Google OAuth provider enabled
  try {
    const response = await fetch(`${pb.baseUrl}/api/settings`);
    if (response.ok) {
      const settings = await response.json();
      const googleOAuth = settings.oauth2 ?.google;
      if (googleOAuth?.enabled) {
        console.log("✅ Google OAuth is ENABLED");
        console.log("   Client ID (masked):", googleOAuth.clientId?.slice(0, 20) + "...");
      } else {
        console.warn("⚠️  Google OAuth is DISABLED - Enable it in PocketBase Settings");
      }
    }
  } catch (err) {
    console.error("❌ Cannot fetch settings:", err);
  }

  // 4. Current window origin
  console.log("🌐 Current Origin:", window.location.origin);

  // 5. Callback URL expected by PocketBase
  const callbackUrl = `${pb.baseUrl}/api/oauth2-redirect`;
  console.log("🔗 OAuth Callback URL (must be in Google Console):", callbackUrl);

  console.log("\n📋 CHECKLIST:");
  console.log("1. ✅ Go to Google Cloud Console > Credentials");
  console.log("2. ✅ Open your OAuth 2.0 Client (Web application)");
  console.log("3. ✅ Add these Authorized redirect URIs:");
  console.log(`   - http://localhost:5173/`);
  console.log(`   - ${pb.baseUrl}/api/oauth2-redirect`);
  console.log("4. ✅ Add these Authorized JavaScript origins:");
  console.log(`   - http://localhost:5173`);
  console.log(`   - ${pb.baseUrl}`);
  console.log("5. ✅ Go to PocketBase Admin > Settings > OAuth2 Providers");
  console.log("6. ✅ Enable Google provider");
  console.log("7. ✅ Paste Client ID and Client Secret");
  console.log("8. ✅ SAVE");

  console.groupEnd();
}

// Auto-run on import if in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    console.log("💡 Tip: Run 'debugOAuthConfig()' in console for OAuth diagnostics");
  }, 2000);
}
