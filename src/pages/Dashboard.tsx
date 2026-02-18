import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { useProperties, useMySubmissions, formatPrice } from "@/hooks/useProperties";
import { useMyTransactions } from "@/hooks/useTransactions";
import {
  LayoutDashboard, ShoppingCart, Tag, Heart, CreditCard, Settings,
  Home, Building2, Clock, CheckCircle2, XCircle, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  active:   { label: "Active",   className: "bg-primary/10 text-primary",       icon: CheckCircle2 },
  pending:  { label: "Pending",  className: "bg-accent/10 text-accent",          icon: Clock },
  sold:     { label: "Sold",     className: "bg-muted text-muted-foreground",    icon: CheckCircle2 },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive", icon: XCircle },
  draft:    { label: "Draft",    className: "bg-muted text-muted-foreground",    icon: Clock },
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { data: properties = [] } = useProperties();
  const { data: transactions = [] } = useMyTransactions();
  const { data: submissions = [], isLoading: subsLoading } = useMySubmissions(user?.id);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const stats = [
    { label: "Properties Viewed", value: "12", icon: Home },
    { label: "My Submissions", value: String(submissions.length), icon: Building2 },
    { label: "Transactions", value: String(transactions.length), icon: CreditCard },
    { label: "Active Listings", value: String(submissions.filter(s => s.status === "active").length), icon: CheckCircle2 },
  ];

  const sideLinks = [
    { label: "Dashboard",        icon: LayoutDashboard, to: "/dashboard" },
    { label: "Buy Properties",   icon: ShoppingCart,    to: "/listings" },
    { label: "Sell Property",    icon: Tag,             to: "/sell" },
    { label: "Saved Listings",   icon: Heart,           to: "/dashboard" },
    { label: "Payment History",  icon: CreditCard,      to: "/payments" },
    { label: "Profile Settings", icon: Settings,        to: "/profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64 shrink-0">
            <div className="bg-card rounded-xl border p-4 sticky top-20">
              <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                <p className="font-display font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <nav className="space-y-1">
                {sideLinks.map((l) => (
                  <Link key={l.label} to={l.to} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <l.icon className="h-4 w-4" /> {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 space-y-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Welcome, {user?.name}!</h1>
              <p className="text-muted-foreground">Here's an overview of your activity</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-card border rounded-xl p-4">
                  <s.icon className="h-5 w-5 text-accent mb-2" />
                  <p className="font-display text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* My Submissions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold">My Submissions</h2>
                <Link to="/sell">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Tag className="h-3.5 w-3.5" /> Submit New
                  </Button>
                </Link>
              </div>

              {subsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
              ) : submissions.length === 0 ? (
                <div className="bg-card border rounded-xl p-8 text-center">
                  <Building2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm mb-3">You haven't submitted any properties yet.</p>
                  <Link to="/sell">
                    <Button variant="accent" size="sm">List Your Property</Button>
                  </Link>
                </div>
              ) : (
                <div className="bg-card border rounded-xl divide-y overflow-hidden">
                  {submissions.map((p) => {
                    const sc = statusConfig[p.status] ?? statusConfig.pending;
                    const Icon = sc.icon;
                    return (
                      <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.title} className="w-16 h-14 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-16 h-14 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-muted-foreground/50" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.type} · {p.location}</p>
                          <p className="text-sm font-semibold text-primary mt-0.5">{formatPrice(p.price)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${sc.className}`}>
                            <Icon className="h-3 w-3" /> {sc.label}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {new Date(p.created_at).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Recent Transactions</h2>
              <div className="bg-card border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-medium">Property</th>
                        <th className="text-left p-3 font-medium">Amount</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr><td colSpan={4} className="p-6 text-center text-muted-foreground text-sm">No transactions yet.</td></tr>
                      ) : transactions.slice(0, 3).map((t) => (
                        <tr key={t.id} className="border-t">
                          <td className="p-3">{t.property_title}</td>
                          <td className="p-3 font-medium">{formatPrice(t.amount)}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${t.status === "completed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground">{new Date(t.created_at).toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {transactions.length > 0 && (
                  <div className="border-t p-3 text-center">
                    <Link to="/payments" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
                      View all transactions <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Recommended For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.slice(0, 2).map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
