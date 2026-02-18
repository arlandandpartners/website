import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contactInfo = [
  { icon: MapPin, label: "Office Address", value: "Salt Lake, Sector V, Kolkata, West Bengal 700091" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: Mail, label: "Email", value: "info@arlandreality.com" },
  { icon: Clock, label: "Working Hours", value: "Mon – Sat, 10:00 AM – 7:00 PM" },
];

const faqs = [
  {
    q: "How do I list my property on AR Land & Reality?",
    a: "Simply sign up, go to 'Sell Property', fill in your property details and images, and submit. Our team will review and approve it within 24–48 hours.",
  },
  {
    q: "Is there any fee to list a property?",
    a: "Listing your property on our platform is completely free. We only charge a nominal commission upon successful sale, which will be discussed and agreed upon before listing.",
  },
  {
    q: "How long does the property verification process take?",
    a: "Our team typically verifies and publishes approved listings within 24–48 business hours of submission.",
  },
  {
    q: "Can I visit a property before purchasing?",
    a: "Absolutely. Contact us via the property detail page or reach out directly and we will arrange a site visit at your convenience.",
  },
  {
    q: "What areas does AR Land & Reality cover?",
    a: "We primarily serve West Bengal, with listings across Kolkata, Rajarhat, New Town, Howrah, and other key districts.",
  },
  {
    q: "How do I track my submitted listings?",
    a: "After signing in, navigate to your Dashboard → My Submissions to view the status of all your listings in real time.",
  },
];

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Get In Touch
              </h1>
              <p className="text-primary-foreground/80 text-base sm:text-lg max-w-xl mx-auto">
                Have a question about a property or need expert advice? We're here to help you every step of the way.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Form + Info + Map */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:items-stretch">
            {/* Contact Form — stretches to match the right column height */}
            <ScrollReveal className="flex flex-col">
              <div className="bg-card rounded-xl border p-6 sm:p-8 shadow-md flex flex-col flex-1">
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
                      <Input placeholder="Your name" required />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number</label>
                      <Input placeholder="+91 XXXXX XXXXX" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address</label>
                    <Input type="email" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Subject</label>
                    <Input placeholder="e.g. Inquiry about property in Rajarhat" required />
                  </div>
                  {/* Message fills remaining height */}
                  <div className="flex flex-col flex-1 min-h-0">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Message</label>
                    <Textarea
                      placeholder="Tell us about your requirements..."
                      required
                      className="flex-1 resize-none min-h-[140px]"
                    />
                  </div>
                  <Button type="submit" variant="accent" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            {/* Info Cards + Map — defines the right-column height */}
            <div className="flex flex-col gap-6">
              <ScrollReveal delay={0.1}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((c) => (
                    <motion.div
                      key={c.label}
                      whileHover={{ y: -4 }}
                      className="bg-card rounded-xl border p-4 sm:p-5"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <c.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-display font-semibold text-sm mb-1">{c.label}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{c.value}</p>
                    </motion.div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2} className="flex flex-col flex-1">
                <div className="bg-card rounded-xl border overflow-hidden shadow-md flex flex-col flex-1">
                  <div className="p-4 sm:p-5 border-b shrink-0">
                    <h3 className="font-display font-semibold">Our Location</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Salt Lake, Sector V, Kolkata</p>
                  </div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0247453498994!2d88.4271!3d22.5726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275b020703c0d%3A0xece6f8e0fc2e1613!2sSalt%20Lake%20Sector%20V%2C%20Kolkata!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    className="w-full flex-1 min-h-[220px] sm:min-h-[280px] border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="AR Land & Reality Partner Office Location"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-secondary/40 py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <ScrollReveal>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-center mb-8 text-sm sm:text-base">
                Quick answers to common questions about buying, selling, and listing properties.
              </p>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-card border rounded-xl px-5 shadow-sm"
                  >
                    <AccordionTrigger className="font-display font-semibold text-sm sm:text-base text-left hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
