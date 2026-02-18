import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="AR Land & Reality Partner" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display font-bold text-lg">AR Land & Reality</span>
          </div>
          <p className="text-sm opacity-80 leading-relaxed mb-5">
            Your trusted partner in land & property investment across West Bengal. We help you find the perfect property with transparency and trust.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm opacity-80">
            <Link to="/" className="block hover:opacity-100 hover:underline transition-opacity">Home</Link>
            <Link to="/listings" className="block hover:opacity-100 hover:underline transition-opacity">Properties</Link>
            <Link to="/sell" className="block hover:opacity-100 hover:underline transition-opacity">Sell Property</Link>
            <Link to="/about" className="block hover:opacity-100 hover:underline transition-opacity">About Us</Link>
            <Link to="/contact" className="block hover:opacity-100 hover:underline transition-opacity">Contact Us</Link>
            <Link to="/login" className="block hover:opacity-100 hover:underline transition-opacity">Login</Link>
          </div>
        </div>

        {/* Property Types */}
        <div>
          <h4 className="font-display font-semibold mb-4">Property Types</h4>
          <div className="space-y-2 text-sm opacity-80">
            <Link to="/listings?type=Residential+Land" className="block hover:opacity-100 hover:underline transition-opacity">Residential Land</Link>
            <Link to="/listings?type=Commercial" className="block hover:opacity-100 hover:underline transition-opacity">Commercial Buildings</Link>
            <Link to="/listings?type=Agricultural" className="block hover:opacity-100 hover:underline transition-opacity">Agricultural Land</Link>
            <Link to="/listings?type=Villa" className="block hover:opacity-100 hover:underline transition-opacity">Luxury Villas</Link>
            <Link to="/listings?type=Apartment" className="block hover:opacity-100 hover:underline transition-opacity">Apartments</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-semibold mb-4">Contact Us</h4>
          <div className="space-y-3 text-sm opacity-80">
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              Salt Lake, Sector V, Kolkata, West Bengal 700091
            </p>
            <a href="tel:+919876543210" className="flex items-center gap-2 hover:opacity-100 hover:underline transition-opacity">
              <Phone className="h-4 w-4 shrink-0" /> +91 98765 43210
            </a>
            <a href="mailto:info@arlandreality.com" className="flex items-center gap-2 hover:opacity-100 hover:underline transition-opacity">
              <Mail className="h-4 w-4 shrink-0" /> info@arlandreality.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm opacity-60">
        <p>© 2026 AR Land and Reality Partner. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy-policy" className="hover:opacity-100 hover:underline transition-opacity">Privacy Policy</Link>
          <Link to="/terms" className="hover:opacity-100 hover:underline transition-opacity">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
