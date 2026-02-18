import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
              Privacy Policy
            </h1>
            <p className="text-primary-foreground/80 text-sm sm:text-base">
              Last updated: February 2026
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-sm sm:prose max-w-none space-y-8 text-foreground">
          {[
            {
              title: "1. Information We Collect",
              body: "We collect information you provide directly, such as your name, phone number, email address, and property details when you register, submit a listing, or contact us. We also automatically collect usage data such as IP addresses, browser type, and pages visited.",
            },
            {
              title: "2. How We Use Your Information",
              body: "Your information is used to operate and improve our platform, process property listings and inquiries, send you relevant updates about your submissions, and respond to support requests. We do not sell your personal data to third parties.",
            },
            {
              title: "3. Data Sharing",
              body: "We may share your information with trusted service providers who assist us in operating our website (e.g., payment processors, cloud infrastructure). All third parties are bound by confidentiality obligations.",
            },
            {
              title: "4. Cookies",
              body: "We use cookies to maintain session state and improve user experience. You can disable cookies in your browser settings, though some features of the site may not function correctly.",
            },
            {
              title: "5. Data Security",
              body: "We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.",
            },
            {
              title: "6. Your Rights",
              body: "You have the right to access, correct, or delete your personal data held by us. To exercise these rights, please contact us at info@arlandreality.com.",
            },
            {
              title: "7. Changes to This Policy",
              body: "We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the date at the top of this page.",
            },
            {
              title: "8. Contact",
              body: "For any privacy-related queries, please reach out to us at info@arlandreality.com or visit our office at Salt Lake, Sector V, Kolkata, West Bengal 700091.",
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

export default PrivacyPolicy;
