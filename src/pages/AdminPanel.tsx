import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, List, PlusCircle, Trash2, Users, CreditCard,
  Settings, LogOut, Building2, User, TrendingUp, ArrowLeft, Menu, Pencil, ShieldAlert,
  Eye, MapPin, Phone, Hash, Calendar, IndianRupee, CheckCircle2, XCircle, Clock,
} from "lucide-react";
import AdminAddListing from "@/components/admin/AdminAddListing";
import { useAllPropertiesAdmin, useDeleteProperty, formatPrice, DBProperty, useUpdatePropertyStatus } from "@/hooks/useProperties";
import { useAuth } from "@/contexts/AuthContext";
import { useAllTransactions, Transaction, useUpdateTransactionStatus } from "@/hooks/useTransactions";
import { sampleUsers } from "@/data/sampleData";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Tab = "overview" | "listings" | "add" | "users" | "transactions" | "settings" | "pending";

const statusStyle: Record<string, string> = {
  completed: "bg-primary/10 text-primary",
  pending: "bg-accent/10 text-accent",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

function TransactionDetailsDialog({ txn, onClose }: { txn: Transaction; onClose: () => void }) {
  const updateStatus = useUpdateTransactionStatus();
  const [status, setStatus] = useState(txn.status);

  const handleSave = () => {
    updateStatus.mutate({ id: txn.id, status });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 text-sm">
          {/* Status + Amount */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[txn.status] ?? statusStyle.pending}`}>
                {txn.status.toUpperCase()}
              </span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span className="font-display text-lg font-bold text-primary">₹{txn.amount.toLocaleString("en-IN")}</span>
          </div>

          {/* User Details */}
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="font-semibold text-foreground mb-1 flex items-center gap-2"><User className="h-4 w-4 text-accent" /> Buyer Details</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span>{txn.user_full_name || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{txn.user_phone ? txn.user_phone : <span className="text-destructive text-xs">Phone not linked to profile</span>}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
              <Hash className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">User ID: {txn.user_id}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="font-semibold text-foreground mb-1 flex items-center gap-2"><Building2 className="h-4 w-4 text-accent" /> Property Details</p>
            <div className="flex items-start gap-2 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{txn.property_title}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{txn.property_type}</span>
            </div>
            {txn.property_location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{txn.property_location}{txn.property_district ? `, ${txn.property_district}` : ""}</span>
              </div>
            )}
            {txn.property_price && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IndianRupee className="h-3.5 w-3.5 shrink-0" />
                <span>Listed at {formatPrice(txn.property_price)}</span>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="font-semibold text-foreground mb-1 flex items-center gap-2"><CreditCard className="h-4 w-4 text-accent" /> Payment Details</p>
            <div className="flex items-start gap-2 text-muted-foreground font-mono text-xs">
              <Hash className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <div>
                <p>Order ID: {txn.razorpay_order_id || "—"}</p>
                <p>Payment ID: {txn.razorpay_payment_id || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{new Date(txn.created_at).toLocaleString("en-IN")}</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
             <Button variant="outline" onClick={onClose}>Close</Button>
             <Button onClick={handleSave} disabled={status === txn.status || updateStatus.isPending}>
               {updateStatus.isPending ? "Updating..." : "Update Status"}
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const AdminPanel = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<DBProperty | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [rejectPropertyId, setRejectPropertyId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: properties = [], isLoading } = useAllPropertiesAdmin();
  const { data: transactions = [], isLoading: txnLoading } = useAllTransactions();
  const deleteMutation = useDeleteProperty();
  const updateStatus = useUpdatePropertyStatus();

  const pendingProperties = properties.filter((p) => p.status === "pending");

  const handleApprove = (id: string) => updateStatus.mutate({ id, status: "active" });
  const handleReject = (id: string) => { setRejectPropertyId(id); setRejectReason(""); };

  // txnStatusStyle is defined at module level as statusStyle

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h1 className="font-display text-2xl font-bold">Admin Access Required</h1>
        <p className="text-muted-foreground max-w-sm">
          You don't have admin privileges to access this panel. Please contact the site administrator.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">Go Home</Button>
      </div>
    );
  }

  const sideItems: { label: string; icon: React.ElementType; tab: Tab; badge?: number }[] = [
    { label: "Dashboard", icon: LayoutDashboard, tab: "overview" },
    { label: "Manage Listings", icon: List, tab: "listings" },
    { label: "Pending Approvals", icon: Clock, tab: "pending", badge: pendingProperties.length },
    { label: "Add Listing", icon: PlusCircle, tab: "add" },
    { label: "Manage Users", icon: Users, tab: "users" },
    { label: "Transactions", icon: CreditCard, tab: "transactions" },
    { label: "Settings", icon: Settings, tab: "settings" },
  ];

  const stats = [
    { label: "Total Listings", value: properties.length, icon: Building2 },
    { label: "Active", value: properties.filter(p => p.status === "active").length, icon: TrendingUp },
    { label: "Sold", value: properties.filter(p => p.status === "sold").length, icon: CreditCard },
    { label: "Pending", value: pendingProperties.length, icon: Clock },
  ];

  const handleEdit = (p: DBProperty) => {
    setEditProperty(p);
    setTab("add");
    setSidebarOpen(false);
  };

  const handleAddNew = () => {
    setEditProperty(null);
    setTab("add");
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground flex flex-col shrink-0 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-4 border-b border-primary-foreground/10">
          <h2 className="font-display font-bold text-lg">Admin Panel</h2>
          <p className="text-xs opacity-70">AR Land & Reality</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sideItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => { setTab(item.tab); setSidebarOpen(false); if (item.tab !== "add") setEditProperty(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${tab === item.tab ? "bg-primary-foreground/20 font-medium" : "opacity-70 hover:opacity-100 hover:bg-primary-foreground/10"}`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="bg-accent text-accent-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-primary-foreground/10 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm opacity-70 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> Back to Site
          </Link>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-3 py-2 text-sm opacity-70 hover:opacity-100 w-full"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
        {/* Mobile header */}
        <div className="md:hidden mb-4 flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="font-display font-bold text-lg">Admin Panel</h2>
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-6">
            <h1 className="font-display text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-card border rounded-xl p-5">
                  <s.icon className="h-6 w-6 text-accent mb-2" />
                  <p className="font-display text-2xl md:text-3xl font-bold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Recent Listings</h2>
              <div className="bg-card border rounded-xl divide-y">
                {properties.slice(0, 5).map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.type} · {p.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-sm">{formatPrice(p.price)}</p>
                      <span className={`text-xs ${p.status === "active" ? "text-primary" : "text-accent"}`}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LISTINGS */}
        {tab === "listings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="font-display text-2xl font-bold">Manage Listings</h1>
              <Button onClick={handleAddNew} variant="accent" size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" /> Add New
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p>No listings yet.</p>
                <Button onClick={handleAddNew} variant="outline" className="mt-4">Add First Listing</Button>
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {properties.map((p) => (
                    <div key={p.id} className="bg-card border rounded-xl p-4 flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.type} · {p.location}</p>
                        <p className="text-sm font-semibold text-primary mt-1">{formatPrice(p.price)}</p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(p.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block bg-card border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">Title</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">District</th>
                        <th className="text-left p-3">Price</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((p) => (
                        <tr key={p.id} className="border-t hover:bg-muted/30">
                          <td className="p-3 font-medium max-w-xs truncate">{p.title}</td>
                          <td className="p-3">{p.type}</td>
                          <td className="p-3 text-muted-foreground">{p.district || p.location}</td>
                          <td className="p-3">{formatPrice(p.price)}</td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              p.status === "active" ? "bg-primary/10 text-primary" :
                              p.status === "sold" ? "bg-muted text-muted-foreground" :
                              "bg-accent/10 text-accent"
                            }`}>{p.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => deleteMutation.mutate(p.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ADD / EDIT */}
        {tab === "add" && (
          <AdminAddListing
            editProperty={editProperty}
            onSuccess={() => { setEditProperty(null); setTab("listings"); }}
          />
        )}

        {/* USERS */}
        {tab === "users" && (
          <div className="space-y-4">
            <h1 className="font-display text-2xl font-bold">Manage Users</h1>
            <div className="md:hidden space-y-3">
              {sampleUsers.map((u) => (
                <div key={u.id} className="bg-card border rounded-xl p-4">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{u.phone}</span>
                    <span>{u.listings} listings</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block bg-card border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-left p-3">Joined</th>
                    <th className="text-left p-3">Listings</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleUsers.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.phone}</td>
                      <td className="p-3 text-muted-foreground">{u.joined}</td>
                      <td className="p-3">{u.listings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PENDING APPROVALS */}
        {tab === "pending" && (
          <div className="space-y-4">
            <h1 className="font-display text-2xl font-bold">Pending Approvals</h1>
            <p className="text-muted-foreground text-sm">Review and approve or reject property submissions from users.</p>

            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
            ) : pendingProperties.length === 0 ? (
              <div className="text-center py-20">
                <CheckCircle2 className="h-12 w-12 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No pending submissions. You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProperties.map((p) => (
                  <div key={p.id} className="bg-card border rounded-xl p-5 space-y-4">
                    <div className="flex items-start gap-4">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-24 h-20 rounded-lg object-cover shrink-0 border" />
                      ) : (
                        <div className="w-24 h-20 rounded-lg bg-muted shrink-0 flex items-center justify-center border">
                          <Building2 className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-display font-semibold text-base">{p.title}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">{p.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                          <MapPin className="h-3.5 w-3.5" /> {p.location}{p.district ? `, ${p.district}` : ""}
                        </p>
                        <p className="font-semibold text-primary">{formatPrice(p.price)}</p>
                        {p.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Seller info */}
                    {(p.seller_name || p.seller_phone) && (
                      <div className="bg-muted rounded-lg p-3 flex flex-wrap gap-3 text-sm">
                        {p.seller_name && <span className="flex items-center gap-1.5 text-muted-foreground"><User className="h-3.5 w-3.5" />{p.seller_name}</span>}
                        {p.seller_phone && <span className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{p.seller_phone}</span>}
                      </div>
                    )}

                    {/* Features */}
                    {p.features && p.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.features.map((f) => (
                          <span key={f} className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{f}</span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t">
                      <Button
                        size="sm"
                        className="gap-1.5 flex-1 sm:flex-none"
                        onClick={() => handleApprove(p.id)}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve & Publish
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-destructive hover:bg-destructive/10 flex-1 sm:flex-none"
                        onClick={() => handleReject(p.id)}
                        disabled={updateStatus.isPending}
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 flex-1 sm:flex-none"
                        onClick={() => handleEdit(p)}
                      >
                        <Pencil className="h-4 w-4" /> Edit Before Approving
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reject Reason Dialog */}
        {rejectPropertyId && (
          <Dialog open onOpenChange={(open) => { if (!open) setRejectPropertyId(null); }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Reject Property</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">This will mark the property as rejected. Optionally add a reason (visible to admin only for now).</p>
                <Textarea
                  placeholder="Rejection reason (optional)…"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => {
                      updateStatus.mutate({ id: rejectPropertyId, status: "rejected" });
                      setRejectPropertyId(null);
                    }}
                    disabled={updateStatus.isPending}
                  >
                    Confirm Reject
                  </Button>
                  <Button variant="outline" onClick={() => setRejectPropertyId(null)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* TRANSACTIONS */}
        {tab === "transactions" && (
          <div className="space-y-4">
            <h1 className="font-display text-2xl font-bold">Transactions</h1>
            {txnLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No transactions yet.</div>
            ) : (
              <>
                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  {transactions.map((t) => (
                    <div key={t.id} className="bg-card border rounded-xl p-4 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{t.property_title}</p>
                          <p className="text-xs text-muted-foreground">{t.property_type} · {new Date(t.created_at).toLocaleDateString("en-IN")}</p>
                          {t.user_full_name && <p className="text-xs text-muted-foreground">By: {t.user_full_name}</p>}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full shrink-0 font-medium ${statusStyle[t.status] ?? statusStyle.pending}`}>{t.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-primary">{formatPrice(t.amount)}</p>
                        <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={() => setSelectedTxn(t)}>
                          <Eye className="h-3 w-3" /> Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop */}
                <div className="hidden md:block bg-card border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">Property</th>
                        <th className="text-left p-3">Buyer</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Transaction ID</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-t hover:bg-muted/30">
                          <td className="p-3 font-medium max-w-[180px] truncate">{t.property_title}</td>
                          <td className="p-3 text-muted-foreground">{t.user_full_name || "—"}</td>
                          <td className="p-3">{formatPrice(t.amount)}</td>
                          <td className="p-3">
                            {t.razorpay_payment_id ? (
                              <span className="font-mono text-xs text-muted-foreground">{t.razorpay_payment_id}</span>
                            ) : (
                              <span className="text-muted-foreground/50 text-xs">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[t.status] ?? statusStyle.pending}`}>{t.status}</span>
                          </td>
                          <td className="p-3 text-muted-foreground">{new Date(t.created_at).toLocaleDateString("en-IN")}</td>
                          <td className="p-3">
                            <Button variant="outline" size="sm" className="gap-1 h-7" onClick={() => setSelectedTxn(t)}>
                              <Eye className="h-3.5 w-3.5" /> Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Transaction Details Dialog */}
        {selectedTxn && (
          <TransactionDetailsDialog txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div className="space-y-4 max-w-lg">
            <h1 className="font-display text-2xl font-bold">Settings</h1>
            <div className="bg-card p-6 rounded-xl border space-y-4">
              <Input placeholder="Site Name" defaultValue="AR Land and Reality Partner" />
              <Input placeholder="Contact Email" defaultValue="info@arlandreality.com" />
              <Input placeholder="Phone" defaultValue="+91 98765 43210" />
              <Button variant="accent">Save Settings</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
