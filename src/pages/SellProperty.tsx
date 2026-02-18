import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, CheckCircle2, ImagePlus, X, Plus, Loader2, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WB_DISTRICTS } from "@/hooks/useProperties";
import { z } from "zod";

const sellSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(200),
  type: z.enum(["Land", "Residential", "Commercial"], { required_error: "Please select a property type" }),
  location: z.string().trim().min(3, "Location is required").max(300),
  district: z.string().trim().min(1, "Please select a district"),
  price: z.number({ invalid_type_error: "Enter a valid price" }).positive("Price must be positive"),
  area: z.string().trim().min(1, "Area is required").max(50),
  area_unit: z.string().min(1),
  description: z.string().trim().min(20, "Please describe your property in at least 20 characters").max(2000),
  seller_name: z.string().trim().min(2, "Your name is required").max(100),
  seller_phone: z.string().trim().regex(/^[+\d\s\-()]{7,20}$/, "Enter a valid phone number"),
  seller_email: z.string().trim().email("Enter a valid email address").max(255),
});

const SellProperty = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [urlInput, setUrlInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    type: "",
    location: "",
    district: "",
    price: "",
    area: "",
    area_unit: "sqft",
    description: "",
    seller_name: user?.name || "",
    seller_phone: "",
    seller_email: user?.email || "",
  });

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const set = (key: string, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || images.length >= 5) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      if (images.length + uploaded.length >= 5) break;
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10MB`); continue; }
      const ext = file.name.split(".").pop();
      const path = `user-submissions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("property-images").upload(path, file);
      if (error) { toast.error(`Failed to upload ${file.name}`); }
      else {
        const { data } = supabase.storage.from("property-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!/^https?:\/\/.+/i.test(trimmed)) {
      toast.error("Please enter a valid image URL starting with http:// or https://");
      return;
    }
    if (images.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setUrlInput("");
  };

  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i));
  const addFeature = () => { if (features.length < 8) setFeatures([...features, ""]); };
  const updateFeature = (i: number, val: string) => {
    const u = [...features]; u[i] = val; setFeatures(u);
  };
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = sellSchema.safeParse({
      ...form,
      price: parseFloat(form.price),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors below before submitting.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("properties").insert([{
      title: parsed.data.title,
      type: parsed.data.type,
      location: parsed.data.location,
      district: parsed.data.district,
      price: parsed.data.price,
      area: parsed.data.area,
      area_unit: parsed.data.area_unit,
      description: parsed.data.description,
      seller_name: parsed.data.seller_name,
      seller_phone: parsed.data.seller_phone,
      seller_email: parsed.data.seller_email,
      images,
      features: features.filter(Boolean),
      status: "pending",
    }]);
    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit. Please try again.");
      console.error(error);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Submitted for Review!</h1>
            <p className="text-muted-foreground mb-2">
              Your property listing has been submitted and is now <strong>pending admin review</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Once approved, it will appear live on the listings page. We'll contact you at <strong>{form.seller_email}</strong>.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="accent" onClick={() => navigate("/listings")}>Browse Listings</Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>My Dashboard</Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const err = (key: string) => errors[key] ? (
    <p className="text-xs text-destructive mt-1">{errors[key]}</p>
  ) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Sell Your Property</h1>
          <p className="text-muted-foreground">
            Fill in the details and our team will review and list your property within 24–48 hours.
          </p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-primary">
          <strong>How it works:</strong> Submit your property → Admin reviews → Gets listed publicly once approved.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card p-6 rounded-xl border space-y-4">
            <h2 className="font-display text-lg font-semibold">Property Details</h2>
            <div>
              <Label>Property Title *</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 2 Bigha Land Near Highway" />
              {err("title")}
            </div>
            <div>
              <Label>Property Type *</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              {err("type")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Location / Address *</Label>
                <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Rajarhat, Kolkata" />
                {err("location")}
              </div>
              <div>
                <Label>District *</Label>
                <Select value={form.district} onValueChange={(v) => set("district", v)}>
                  <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                  <SelectContent>
                    {WB_DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {err("district")}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Asking Price (₹) *</Label>
                <Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. 4500000" />
                {err("price")}
              </div>
              <div>
                <Label>Area *</Label>
                <div className="flex gap-2">
                  <Input value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. 3" className="flex-1" />
                  <Select value={form.area_unit} onValueChange={(v) => set("area_unit", v)}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">Sq Ft</SelectItem>
                      <SelectItem value="sqm">Sq M</SelectItem>
                      <SelectItem value="bigha">Bigha</SelectItem>
                      <SelectItem value="katha">Katha</SelectItem>
                      <SelectItem value="acres">Acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {err("area")}
              </div>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe your property — location benefits, road access, utilities, nearby landmarks, etc."
                rows={5}
              />
              <div className="flex justify-between">
                {err("description")}
                <span className="text-xs text-muted-foreground ml-auto mt-1">{form.description.length}/2000</span>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-card p-6 rounded-xl border space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Property Photos</h2>
              <p className="text-sm text-muted-foreground">Upload up to 5 photos or paste image URLs. Clear photos get 3× more inquiries.</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border group">
                  <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Cover</span>}
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="h-7 w-7 text-muted-foreground animate-spin" /> : <ImagePlus className="h-7 w-7 text-muted-foreground" />}
                  <span className="text-xs text-muted-foreground">{uploading ? "Uploading…" : "Upload Photo"}</span>
                </button>
              )}
            </div>
            {images.length < 5 && (
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Link className="h-3.5 w-3.5" /> Or paste an image URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 text-sm"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddUrl} disabled={!urlInput.trim()}>
                    Add URL
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-card p-6 rounded-xl border space-y-4">
            <h2 className="font-display text-lg font-semibold">Key Features <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2>
            <div className="space-y-2">
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={f} onChange={(e) => updateFeature(i, e.target.value)} placeholder={`e.g. ${["Highway Facing", "Clear Title", "Water Supply", "Gated Area"][i % 4]}`} maxLength={80} />
                  {features.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(i)} className="shrink-0 text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {features.length < 8 && (
                <Button type="button" variant="outline" size="sm" onClick={addFeature} className="gap-1">
                  <Plus className="h-3 w-3" /> Add Feature
                </Button>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card p-6 rounded-xl border space-y-4">
            <h2 className="font-display text-lg font-semibold">Your Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input value={form.seller_name} onChange={(e) => set("seller_name", e.target.value)} placeholder="Your full name" />
                {err("seller_name")}
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input value={form.seller_phone} onChange={(e) => set("seller_phone", e.target.value)} placeholder="+91 98765 43210" />
                {err("seller_phone")}
              </div>
              <div className="sm:col-span-2">
                <Label>Email *</Label>
                <Input type="email" value={form.seller_email} onChange={(e) => set("seller_email", e.target.value)} placeholder="you@example.com" />
                {err("seller_email")}
              </div>
            </div>
          </div>

          <Button type="submit" variant="accent" size="lg" className="w-full gap-2" disabled={submitting || uploading}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {submitting ? "Submitting…" : "Submit for Review"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By submitting, you confirm this property is genuine and you are authorized to sell it.
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SellProperty;
