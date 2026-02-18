import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "@/components/NavLink";
import { User, LogOut, LayoutDashboard, ShoppingCart, Tag, CreditCard, Settings, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Properties", to: "/listings" },
    { label: "Sell Property", to: "/sell" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
            <img src={logo} alt="AR Land & Reality Partner" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display font-bold text-lg text-foreground hidden sm:block">
              AR Land & Reality
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/"}
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md transition-colors hover:bg-muted/50"
                activeClassName="text-primary font-semibold bg-primary/8"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> My Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Buy History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/sell")}>
                    <Tag className="mr-2 h-4 w-4" /> Sell Listings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/payments")}>
                    <CreditCard className="mr-2 h-4 w-4" /> Payment History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <ShieldCheck className="mr-2 h-4 w-4" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="accent" size="sm" onClick={() => navigate("/login")} className="hidden sm:inline-flex">
                Login / Signup
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Side Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm md:hidden"
              onClick={closeMobile}
            />

            {/* Slide-in panel */}
            <motion.nav
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-4/5 max-w-xs bg-card shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="AR Land & Reality" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-display font-bold text-base">AR Land & Reality</span>
                </div>
                <Button variant="ghost" size="icon" onClick={closeMobile} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.2 }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === "/"}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                      onClick={closeMobile}
                    >
                      {l.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="px-5 py-5 border-t space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 pb-1">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    {isAdmin && (
                      <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate("/admin"); closeMobile(); }}>
                        <ShieldCheck className="mr-2 h-4 w-4" /> Admin Panel
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate("/dashboard"); closeMobile(); }}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> My Dashboard
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => { logout(); closeMobile(); }}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <Button variant="accent" className="w-full" onClick={() => { navigate("/login"); closeMobile(); }}>
                    Login / Signup
                  </Button>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
