import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password, phone);
    setLoading(false);
    if (result.success) {
      toast.success("Account created! Please check your email to verify your account.");
      navigate("/login");
    } else {
      toast.error(result.error || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold">AR</span>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join AR Land & Reality today</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl shadow-lg border space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
          </div>
          <Button type="submit" variant="accent" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
