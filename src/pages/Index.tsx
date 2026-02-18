import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Shield, Users, TrendingUp, ArrowRight, Star, Quote, Building2, Landmark, Home } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ScrollReveal from "@/components/ScrollReveal";
import { useProperties } from "@/hooks/useProperties";
import heroBg from "@/assets/hero-bg.jpg";

const testimonials = [
  {
    name: "Anita Banerjee",
    role: "Property Buyer, Kolkata",
    text: "AR Land & Reality made my first property purchase in Rajarhat incredibly smooth. Their team guided me through every legal step and I felt completely secure throughout.",
    rating: 5,
  },
  {
    name: "Rahul Chatterjee",
    role: "Investor, Howrah",
    text: "I've invested in 3 properties across West Bengal through AR Land & Reality. Their market insights and verified listings gave me confidence to invest without worry.",
    rating: 5,
  },
  {
    name: "Moumita Das",
    role: "Seller, Siliguri",
    text: "Selling my commercial property in Siliguri was hassle-free. They found genuine buyers quickly and handled all the paperwork. Highly recommended!",
    rating: 5,
  },
];

const partners = [
  { name: "State Bank of India", icon: Landmark },
  { name: "HDFC Bank", icon: Building2 },
  { name: "LIC Housing", icon: Home },
  { name: "ICICI Bank", icon: Landmark },
  { name: "Axis Bank", icon: Building2 },
  { name: "Bajaj Finserv", icon: Home },
];

const Index = () => {
  const { data: properties = [] } = useProperties();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Premium real estate" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight"
          >
            Your Trusted Partner in Land & Property Investment
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-primary-foreground/80 text-lg md:text-xl mb-8 font-sans"
          >
            Secure and transparent property deals across West Bengal. Discover premium land, residential, and commercial properties.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild variant="hero">
              <Link to="/listings">Explore Properties</Link>
            </Button>
            <Button asChild variant="hero-outline">
              <Link to="/sell">Sell Your Property</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <ScrollReveal>
          <div className="bg-card rounded-xl shadow-xl p-6 border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                <Input placeholder="Enter city or area" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Property Type</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Price Range</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Any Price" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Price</SelectItem>
                    <SelectItem value="0-25l">Under ₹25 Lakh</SelectItem>
                    <SelectItem value="25l-1cr">₹25 L – ₹1 Cr</SelectItem>
                    <SelectItem value="1cr+">Above ₹1 Cr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Area</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Any Area" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Area</SelectItem>
                    <SelectItem value="small">Under 1000 sq ft</SelectItem>
                    <SelectItem value="medium">1000 – 5000 sq ft</SelectItem>
                    <SelectItem value="large">5000+ sq ft / Acres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full gap-2" variant="accent">
                  <Search className="h-4 w-4" /> Search
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-16">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Featured Listings</h2>
            <p className="text-muted-foreground">Handpicked premium properties for you</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
        <ScrollReveal>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/listings">View All Properties <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      {/* Trust Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold mb-2">Why Choose AR Land & Reality?</h2>
              <p className="text-muted-foreground">Trusted by thousands of property buyers and sellers</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Properties", desc: "Every listing is thoroughly verified for clear titles and legal compliance." },
              { icon: Users, title: "Expert Guidance", desc: "Our team of real estate experts guide you through every step of the process." },
              { icon: TrendingUp, title: "Best Investment Returns", desc: "We help you find properties with the highest growth potential in emerging markets." },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.15)" }}
                  transition={{ duration: 0.3 }}
                  className="text-center p-6 rounded-xl bg-card border"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold mb-2">What Our Clients Say</h2>
              <p className="text-muted-foreground">Real stories from real property owners</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-xl border p-6 space-y-4 h-full"
                >
                  <Quote className="h-8 w-8 text-accent/40" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <div>
                    <p className="font-display font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold mb-1">Our Banking & Finance Partners</h2>
              <p className="text-sm text-muted-foreground">Trusted financial institutions for your property investment</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {partners.map((p) => (
                <motion.div
                  key={p.name}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card rounded-lg border p-4 flex flex-col items-center justify-center gap-2 h-24"
                >
                  <p.icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground text-center">{p.name}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Find Your Dream Property?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join thousands of satisfied customers across West Bengal who found their perfect property through AR Land & Reality Partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="hero">
                  <Link to="/listings">Browse Properties</Link>
                </Button>
                <Button asChild variant="hero-outline">
                  <Link to="/signup">Create Free Account</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
