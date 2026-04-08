import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { registerSW } from "virtual:pwa-register";

// Registra o service worker e recarrega automaticamente quando há nova versão
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(<App />);
