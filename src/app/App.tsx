import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { CashFlowProvider } from "./contexts/CashFlowContext";
import { PayablesProvider } from "./contexts/PayablesContext";
import { ReportsProvider } from "./contexts/ReportsContext";
import { InventoryProvider } from "./contexts/InventoryContext";

export default function App() {
  return (
    <AuthProvider>
      <CashFlowProvider>
        <PayablesProvider>
          <InventoryProvider>
            <ReportsProvider>
              <RouterProvider router={router} />
            </ReportsProvider>
          </InventoryProvider>
        </PayablesProvider>
      </CashFlowProvider>
    </AuthProvider>
  );
}