import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const Terms = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
              Terms of Service
            </h1>
            <p className="text-primary-foreground/80 text-sm sm:text-base">
              Last updated: February 2026
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-6 text-foreground">
          {[
            {
              title: "1. Acceptance of Terms",
              body: "By accessing or using AR Land & Reality Partner, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the platform.",
            },
            {
              title: "2. Use of the Platform",
              body: "You agree to use the platform only for lawful purposes and in accordance with these terms. You must not misuse the platform, submit false property information, or engage in fraudulent activity.",
            },
            {
              title: "3. Property Listings",
              body: "Sellers are responsible for the accuracy of all information submitted. AR Land & Reality Partner reserves the right to remove any listing that violates our policies or contains misleading information.",
            },
            {
              title: "4. Payments",
              body: "All payments processed through our platform are handled securely via Razorpay. Transaction fees and commission structures will be communicated clearly before any purchase.",
            },
            {
              title: "5. Intellectual Property",
              body: "All content on this platform, including logos, text, and images, is the property of AR Land & Reality Partner unless otherwise stated. Unauthorized use is prohibited.",
            },
            {
              title: "6. Limitation of Liability",
              body: "AR Land & Reality Partner is not liable for any indirect, incidental, or consequential damages arising from your use of the platform or reliance on property listings.",
            },
            {
              title: "7. Termination",
              body: "We reserve the right to suspend or terminate accounts that violate these Terms of Service without prior notice.",
            },
            {
              title: "8. Governing Law",
              body: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Kolkata, West Bengal.",
            },
          ].map((section) => (
            <ScrollReveal key={section.title}>
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h2 className="font-display text-lg font-bold mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{section.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Terms;
