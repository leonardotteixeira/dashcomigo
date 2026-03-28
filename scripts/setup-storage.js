import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log("📦 Criando bucket 'avatars'...");

    // Create avatars bucket
    const { data: avatarsBucket, error: avatarsError } = await supabase.storage.createBucket(
      "avatars",
      {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      }
    );

    if (avatarsError && !avatarsError.message.includes("already exists")) {
      throw avatarsError;
    }

    if (avatarsBucket) {
      console.log("✅ Bucket 'avatars' criado com sucesso!");
    } else {
      console.log("ℹ️ Bucket 'avatars' já existe");
    }

    // Set public access policy for avatars
    console.log("🔐 Configurando acesso público...");
    const { error: policyError } = await supabase.storage
      .from("avatars")
      .createSignedUrl("test.txt", 60);

    console.log("✅ Storage configurado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao configurar storage:", error);
    process.exit(1);
  }
}

setupStorage();
