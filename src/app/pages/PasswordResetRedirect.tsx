import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export function PasswordResetRedirect() {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      navigate(`/auth/confirm-password-reset?token=${token}`);
    } else {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <p className="text-white">Redirecionando...</p>
    </div>
  );
}
