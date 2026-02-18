import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, ImagePlus, Loader2, Upload, Link } from "lucide-react";
import { useCreateProperty, useUpdateProperty, WB_DISTRICTS, DBProperty } from "@/hooks/useProperties";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminAddListingProps {
  editProperty?: DBProperty | null;
  onSuccess?: () => void;
}

const AdminAddListing = ({ editProperty, onSuccess }: AdminAddListingProps) => {
  const [images, setImages] = useState<string[]>(editProperty?.images || []);
  const [features, setFeatures] = useState<string[]>(editProperty?.features?.length ? editProperty.features : [""]);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: editProperty?.title || "",
    type: editProperty?.type || "",
    status: editProperty?.status || "active",
    location: editProperty?.location || "",
    district: editProperty?.district || "",
    price: editProperty?.price?.toString() || "",
    area: editProperty?.area || "",
    area_unit: editProperty?.area_unit || "sqft",
    description: editProperty?.description || "",
    seller_name: editProperty?.seller_name || "",
    seller_phone: editProperty?.seller_phone || "",
    seller_email: editProperty?.seller_email || "",
  });

  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || images.length >= 6) return;

    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      if (images.length + uploaded.length >= 6) break;
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("property-images").upload(path, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}`);
      } else {
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
    if (images.length >= 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setUrlInput("");
  };

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const addFeature = () => { if (features.length < 10) setFeatures([...features, ""]); };
  const updateFeature = (index: number, value: string) => {
    const updated = [...features]; updated[index] = value; setFeatures(updated);
  };
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      type: form.type as "Land" | "Residential" | "Commercial",
      status: form.status as "active" | "pending" | "sold" | "draft",
      location: form.location,
      district: form.district,
      price: parseInt(form.price),
      area: form.area,
      area_unit: form.area_unit,
      description: form.description,
      images,
      features: features.filter(Boolean),
      seller_name: form.seller_name,
      seller_phone: form.seller_phone,
      seller_email: form.seller_email,
    };

    if (editProperty) {
      await updateMutation.mutateAsync({ id: editProperty.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onSuccess?.();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">
          {editProperty ? "Edit Listing" : "Add New Listing"}
        </h1>
        <p className="text-sm text-muted-foreground">Fill in all details to create a property listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card p-6 rounded-xl border space-y-4">
          <h2 className="font-display text-lg font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Property Title *</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 2 Acre Highway Facing Land" required />
            </div>
            <div>
              <Label>Property Type *</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)} required>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Listing Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Location & Pricing */}
        <div className="bg-card p-6 rounded-xl border space-y-4">
          <h2 className="font-display text-lg font-semibold">Location & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Location / Address *</Label>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Rajarhat, Kolkata" required />
            </div>
            <div>
              <Label>District (West Bengal) *</Label>
              <Select value={form.district} onValueChange={(v) => set("district", v)} required>
                <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  {WB_DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price (₹) *</Label>
              <Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="Enter price in INR" required />
            </div>
            <div>
              <Label>Area *</Label>
              <div className="flex gap-2">
                <Input value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. 2" required className="flex-1" />
                <Select value={form.area_unit} onValueChange={(v) => set("area_unit", v)}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">Sq Ft</SelectItem>
                    <SelectItem value="sqm">Sq M</SelectItem>
                    <SelectItem value="bigha">Bigha</SelectItem>
                    <SelectItem value="katha">Katha</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="hectares">Hectares</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card p-6 rounded-xl border space-y-4">
          <h2 className="font-display text-lg font-semibold">Property Images</h2>
          <p className="text-sm text-muted-foreground">Upload up to 6 images or paste image URLs. First image will be the cover.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border group">
                <img src={img} alt={`Property ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
            {images.length < 6 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                ) : (
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">{uploading ? "Uploading…" : "Upload Image"}</span>
              </button>
            )}
          </div>
          {images.length < 6 && (
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Link className="h-3.5 w-3.5" /> Or paste an image URL
              </Label>
              <div className="flex gap-2">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddUrl} disabled={!urlInput.trim()}>
                  Add URL
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Description & Features */}
        <div className="bg-card p-6 rounded-xl border space-y-4">
          <h2 className="font-display text-lg font-semibold">Description & Features</h2>
          <div>
            <Label>Description *</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the property in detail…" rows={5} required />
          </div>
          <div>
            <Label>Key Features</Label>
            <div className="space-y-2 mt-2">
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={f}
                    onChange={(e) => updateFeature(i, e.target.value)}
                    placeholder={`Feature ${i + 1} (e.g. Highway Facing)`}
                  />
                  {features.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(i)} className="shrink-0 text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {features.length < 10 && (
                <Button type="button" variant="outline" size="sm" onClick={addFeature} className="gap-1">
                  <Plus className="h-3 w-3" /> Add Feature
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-card p-6 rounded-xl border space-y-4">
          <h2 className="font-display text-lg font-semibold">Seller Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Seller Name</Label>
              <Input value={form.seller_name} onChange={(e) => set("seller_name", e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input value={form.seller_phone} onChange={(e) => set("seller_phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.seller_email} onChange={(e) => set("seller_email", e.target.value)} placeholder="seller@example.com" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="accent" size="lg" className="gap-2" disabled={isSubmitting || uploading}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {editProperty ? "Save Changes" : "Publish Listing"}
          </Button>
          {onSuccess && (
            <Button type="button" variant="outline" size="lg" onClick={onSuccess}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminAddListing;
