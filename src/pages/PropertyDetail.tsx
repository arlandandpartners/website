import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProperty, formatPrice } from "@/hooks/useProperties";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useTransactions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Maximize2, Calendar, User, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Extend window to include Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: property, isLoading } = useProperty(id!);
  const [selectedImage, setSelectedImage] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const BOOKING_TOKEN_AMOUNT = 999; // ₹999 booking token fee

  const handleBook = async () => {
    if (!isAuthenticated || !user) {
      toast.info("Please login to book a property");
      navigate("/login");
      return;
    }
    if (!property) return;

    setPaymentLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setPaymentLoading(false);
        return;
      }

      // Create Razorpay order via edge function (token amount, NOT full price)
      const { data, error } = await supabase.functions.invoke("razorpay-order", {
        body: {
          amount: BOOKING_TOKEN_AMOUNT,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`.slice(0, 40),
          notes: { property_id: property.id, property_title: property.title },
        },
      });

      if (error || !data?.order) {
        toast.error(data?.error || "Failed to initiate payment. Please try again.");
        setPaymentLoading(false);
        return;
      }

      const { order, key_id } = data;

      // Save pending transaction in DB (token booking amount, full price stored separately)
      const txn = await createTransaction.mutateAsync({
        user_id: user.id,
        property_id: property.id,
        property_title: property.title,
        property_type: property.type,
        amount: BOOKING_TOKEN_AMOUNT,
        razorpay_order_id: order.id,
        status: "pending",
      });

      setPaymentLoading(false);

      const options: RazorpayOptions = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "AR Land & Reality",
        description: property.title,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify signature via edge function
            const { data: verifyData } = await supabase.functions.invoke("razorpay-verify", {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            const status = verifyData?.valid ? "completed" : "failed";

            await updateTransaction.mutateAsync({
              id: txn.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              status,
            });

            if (verifyData?.valid) {
              toast.success("Payment successful! Transaction ID: " + response.razorpay_payment_id);
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch {
            toast.error("Error recording payment. Please contact support.");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: { color: "#2d5a3d" },
        modal: {
          ondismiss: async () => {
            await updateTransaction.mutateAsync({
              id: txn.id,
              razorpay_payment_id: "",
              razorpay_signature: "",
              status: "cancelled",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setPaymentLoading(false);
    }
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent to the seller!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Property not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const images = property.images || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl overflow-hidden aspect-video bg-muted">
              {images[selectedImage] ? (
                <img src={images[selectedImage]} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-accent" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Badge className="bg-accent text-accent-foreground border-0">{property.type}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Listed {new Date(property.created_at).toLocaleDateString("en-IN")}
                </span>
                {property.district && (
                  <span className="text-sm text-muted-foreground">{property.district} district</span>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">{property.title}</h1>
              <p className="flex items-center gap-1 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" /> {property.location}
              </p>
              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-display text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="font-display text-xl font-semibold flex items-center gap-1">
                    <Maximize2 className="h-4 w-4" /> {property.area} {property.area_unit}
                  </p>
                </div>
                {property.seller_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Seller</p>
                    <p className="font-medium flex items-center gap-1">
                      <User className="h-4 w-4" /> {property.seller_name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {property.description && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>
            )}

            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-3">Key Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.features.map((f) => (
                    <p key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {f}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-3">Location</h2>
              <div className="rounded-xl overflow-hidden h-64 border">
                <iframe
                  title="Property Location"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.location}${property.district ? `, ${property.district}` : ""}, West Bengal, India`)}&output=embed&z=14`}
                  className="w-full h-full border-0"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {property.location}{property.district ? `, ${property.district}` : ""}
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border shadow-md sticky top-20">
              <p className="font-display text-2xl font-bold text-primary mb-1">{formatPrice(property.price)}</p>
              <p className="text-xs text-muted-foreground mb-4">Book your interest with a ₹999 token — full payment offline</p>
              <Button
                variant="accent"
                className="w-full mb-3 gap-2"
                size="lg"
                onClick={handleBook}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Preparing Payment…</>
                ) : (
                  "Book Now (₹999 token)"
                )}
              </Button>
              {property.seller_phone && (
                <a
                  href={`tel:${property.seller_phone}`}
                  className="block w-full text-center py-2 border rounded-md text-sm font-medium hover:bg-muted mb-4"
                >
                  📞 {property.seller_phone}
                </a>
              )}

              <h3 className="font-display font-semibold mb-3">Send a Message</h3>
              <form onSubmit={handleContact} className="space-y-3">
                <Input placeholder="Your Name" required />
                <Input type="email" placeholder="Your Email" required />
                <Input placeholder="Phone Number" />
                <Textarea placeholder="Your message…" rows={3} required />
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
