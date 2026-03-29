import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { CashFlowProvider } from "./contexts/CashFlowContext";
import { PayablesProvider } from "./contexts/PayablesContext";

export default function App() {
  return (
    <AuthProvider>
      <CashFlowProvider>
        <PayablesProvider>
          <RouterProvider router={router} />
        </PayablesProvider>
      </CashFlowProvider>
    </AuthProvider>
  );
}