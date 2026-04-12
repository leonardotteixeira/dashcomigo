import { RouterProvider } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
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
import { InvestmentsProvider } from "./contexts/InvestmentsContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";

export default function App() {
  const googleClientId = "567720000578-bmu0tusp9vdd2opqvev7m5l388oit3lh.apps.googleusercontent.com";

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
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
                                <RouterProvider router={router} />
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
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}
