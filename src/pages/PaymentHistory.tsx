import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMyTransactions } from "@/hooks/useTransactions";
import { formatPrice } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard } from "lucide-react";

const statusStyle: Record<string, string> = {
  completed: "bg-primary/10 text-primary",
  pending: "bg-accent/10 text-accent",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

const PaymentHistory = () => {
  const { isAuthenticated } = useAuth();
  const { data: transactions = [], isLoading } = useMyTransactions();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="font-display text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-muted-foreground mb-8">All your property transaction records</p>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <CreditCard className="h-14 w-14 text-muted-foreground/30" />
            <p className="text-muted-foreground">No transactions yet. Book a property to get started.</p>
          </div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden">
            {/* Mobile cards */}
            <div className="md:hidden divide-y">
              {transactions.map((t) => (
                <div key={t.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{t.property_title}</p>
                      <p className="text-xs text-muted-foreground">{t.property_type}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusStyle[t.status] ?? statusStyle.pending}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="font-semibold text-primary">{formatPrice(t.amount)}</p>
                  {t.razorpay_payment_id && (
                    <p className="text-xs text-muted-foreground font-mono truncate">ID: {t.razorpay_payment_id}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString("en-IN")}</p>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium">Property</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Transaction ID</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-t hover:bg-muted/30">
                      <td className="p-4 font-medium max-w-xs truncate">{t.property_title}</td>
                      <td className="p-4 text-muted-foreground">{t.property_type}</td>
                      <td className="p-4 font-semibold">{formatPrice(t.amount)}</td>
                      <td className="p-4">
                        {t.razorpay_payment_id ? (
                          <span className="font-mono text-xs text-muted-foreground">{t.razorpay_payment_id}</span>
                        ) : (
                          <span className="text-muted-foreground/50 text-xs">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[t.status] ?? statusStyle.pending}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{new Date(t.created_at).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentHistory;
