import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ProfileSettings = () => {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // 1. Update public profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: name, phone })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // 2. Update auth metadata (keeps session in sync)
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: name, phone }
      });

      if (authError) throw authError;

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-lg">
        <h1 className="font-display text-3xl font-bold mb-6">Profile Settings</h1>
        <form onSubmit={handleSave} className="bg-card p-6 rounded-xl border shadow-md space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input 
              type="tel"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+91 98765 43210"
            />
          </div>
          <Button type="submit" variant="accent" className="w-full" disabled={loading}>
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileSettings;
