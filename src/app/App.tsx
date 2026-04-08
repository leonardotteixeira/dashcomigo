import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { CashFlowProvider } from "./contexts/CashFlowContext";
import { PayablesProvider } from "./contexts/PayablesContext";
import { ReportsProvider } from "./contexts/ReportsContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { ReceivablesProvider } from "./contexts/ReceivablesContext";
import { ContactsProvider } from "./contexts/ContactsContext";
import { BudgetsProvider } from "./contexts/BudgetsContext";
import { GoalsProvider } from "./contexts/GoalsContext";
import { PFPJProvider } from "./contexts/PFPJContext";

export default function App() {
  return (
    <AuthProvider>
      <CashFlowProvider>
        <PFPJProvider>
          <PayablesProvider>
          <ReceivablesProvider>
            <ContactsProvider>
              <InventoryProvider>
                <BudgetsProvider>
                  <GoalsProvider>
                    <ReportsProvider>
                      <RouterProvider router={router} />
                    </ReportsProvider>
                  </GoalsProvider>
                </BudgetsProvider>
              </InventoryProvider>
            </ContactsProvider>
          </ReceivablesProvider>
        </PayablesProvider>
        </PFPJProvider>
      </CashFlowProvider>
    </AuthProvider>
  );
}
