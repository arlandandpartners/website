import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Shield, Users, TrendingUp, Award, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const stats = [
  { label: "Properties Sold", value: "500+", icon: Award },
  { label: "Happy Clients", value: "1,200+", icon: Users },
  { label: "Locations Covered", value: "25+", icon: MapPin },
  { label: "Years Experience", value: "Since 2025", icon: Clock },
];

const values = [
  { icon: Shield, title: "Trust & Transparency", desc: "Every property listing is verified for clear titles, legal compliance, and accurate documentation before going live." },
  { icon: Users, title: "Customer First", desc: "Our dedicated team guides you through the entire buying or selling journey — from site visits to registration." },
  { icon: TrendingUp, title: "Growth Oriented", desc: "We identify emerging markets across West Bengal to help our clients make the best investment decisions." },
];

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <img src={logo} alt="AR Land & Reality Partner" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto mb-6 shadow-lg" />
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              About AR Land & Reality Partner
            </h1>
            <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Established in 2025, we are West Bengal's trusted real estate partner — helping families, investors, and businesses find the perfect property with complete transparency and legal assurance.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -4 }}
                className="bg-card rounded-xl border p-4 sm:p-6 text-center shadow-md"
              >
                <s.icon className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-2" />
                <p className="font-display text-xl sm:text-2xl font-bold">{s.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 text-center">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                AR Land & Reality Partner was founded with a simple mission — to make property buying and selling in West Bengal safe, simple, and transparent. We understand that purchasing land or a building is one of the biggest financial decisions of your life.
              </p>
              <p>
                That's why we go the extra mile to verify every listing, ensure clear legal titles, and provide end-to-end assistance from site visits to final registration. Our team of experienced real estate professionals covers major locations across West Bengal including Kolkata, Howrah, Hooghly, Siliguri, Durgapur, Asansol, Santiniketan, and beyond.
              </p>
              <p>
                Whether you're looking for residential plots in Rajarhat, commercial spaces in Salt Lake Sector V, agricultural land in Hooghly, or luxury villas in Santiniketan — we have you covered.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Values */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-card rounded-xl border p-6 text-center h-full"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <ScrollReveal>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-center">Areas We Serve</h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl mx-auto">
            {[
              "Kolkata", "Howrah", "Salt Lake", "Rajarhat", "New Town",
              "Hooghly", "Siliguri", "Durgapur", "Asansol", "Bardhaman",
              "Santiniketan", "Kharagpur", "Haldia", "Barasat", "Kalyani",
            ].map((area) => (
              <motion.span
                key={area}
                whileHover={{ scale: 1.05 }}
                className="bg-secondary text-secondary-foreground px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border"
              >
                {area}
              </motion.span>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
