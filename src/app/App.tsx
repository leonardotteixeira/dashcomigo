import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { SupportProvider } from "./contexts/SupportContext";
import { CashFlowProvider } from "./contexts/CashFlowContext";
import { PayablesProvider } from "./contexts/PayablesContext";
import { ReportsProvider } from "./contexts/ReportsContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { ReceivablesProvider } from "./contexts/ReceivablesContext";
import { ContactsProvider } from "./contexts/ContactsContext";
import { BudgetsProvider } from "./contexts/BudgetsContext";
import { GoalsProvider } from "./contexts/GoalsContext";
import { PFPJProvider } from "./contexts/PFPJContext";
import { InvestmentsProvider } from "./contexts/InvestmentsContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
          <CashFlowProvider>
            <PFPJProvider>
              <InvestmentsProvider>
                <PayablesProvider>
                  <ReceivablesProvider>
                    <ContactsProvider>
                      <InventoryProvider>
                        <BudgetsProvider>
                          <GoalsProvider>
                            <ReportsProvider>
                              <NotificationsProvider>
                                <SupportProvider>
                                  <RouterProvider router={router} />
                                </SupportProvider>
                              </NotificationsProvider>
                            </ReportsProvider>
                          </GoalsProvider>
                        </BudgetsProvider>
                      </InventoryProvider>
                    </ContactsProvider>
                  </ReceivablesProvider>
                </PayablesProvider>
              </InvestmentsProvider>
            </PFPJProvider>
          </CashFlowProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
