import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";

export function AvatarUpload() {
  const { user, uploadAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
      setError(null);
      setSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview || !fileInputRef.current?.files?.[0]) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const file = fileInputRef.current.files[0];
      await uploadAvatar(file);
      setSuccess(true);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        {/* Avatar Display */}
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-2 border-[#28A263]/30"
            />
          ) : user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-2 border-[#28A263]/30"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#28A263] to-[#1B1B1B] flex items-center justify-center border-2 border-[#28A263]/30">
              <span className="text-3xl font-bold text-white">
                {getInitials(user?.name || "U")}
              </span>
            </div>
          )}
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Button */}
        {!preview ? (
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#28A263] hover:bg-[#2DDB81] text-white flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Escolher Foto
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="bg-[#28A263] hover:bg-[#2DDB81] text-white"
            >
              {loading ? "Enviando..." : "Confirmar"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="text-[#A1A1A1]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-[#28A263]/10 border border-[#28A263]/30 rounded-lg">
          <p className="text-sm text-[#28A263]">Foto atualizada com sucesso!</p>
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-[#686F6F] text-center">
        JPG, PNG ou WebP. Máximo 5MB.
      </p>
    </div>
  );
}
