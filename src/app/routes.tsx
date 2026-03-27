import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Pricing } from "./pages/Pricing";
import { Checkout } from "./pages/Checkout";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";
import { Dashboard } from "./pages/Dashboard";
import { FluxoCaixa } from "./pages/FluxoCaixa";
import { SimuladorMEI } from "./pages/SimuladorMEI";
import { SimuladorPreco } from "./pages/SimuladorPreco";
import { SimuladorLucro } from "./pages/SimuladorLucro";
import { GeradorPropostas } from "./pages/GeradorPropostas";
import { Onboarding } from "./pages/Onboarding";
import { AuthCallback } from "./pages/AuthCallback";
import { TermosDeUso } from "./pages/TermosDeUso";
import { Privacidade } from "./pages/Privacidade";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/pricing",
    Component: Pricing,
  },
  {
    path: "/checkout",
    Component: Checkout,
  },
  {
    path: "/checkout/success",
    Component: CheckoutSuccess,
  },
  {
    path: "/auth/callback",
    Component: AuthCallback,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/auth/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/termos-de-uso",
    Component: TermosDeUso,
  },
  {
    path: "/privacidade",
    Component: Privacidade,
  },
  {
    path: "/app",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: FluxoCaixa, // Fluxo de Caixa como página principal
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "mei-me",
        Component: SimuladorMEI,
      },
      {
        path: "preco",
        Component: SimuladorPreco,
      },
      {
        path: "lucro",
        Component: SimuladorLucro,
      },
      {
        path: "propostas",
        Component: GeradorPropostas,
      },
      {
        path: "onboarding",
        Component: Onboarding,
      },
    ],
  },
]);