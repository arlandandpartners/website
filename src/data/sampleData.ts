import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

export interface Property {
  id: string;
  title: string;
  type: "Land" | "Residential" | "Commercial";
  location: string;
  price: number;
  area: string;
  description: string;
  image: string;
  images: string[];
  features: string[];
  listed: string;
  seller: string;
}

export interface Transaction {
  id: string;
  propertyName: string;
  type: string;
  amount: number;
  status: "Completed" | "Pending";
  date: string;
}

export interface SampleUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  listings: number;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "3 Bigha Highway Facing Land",
    type: "Land",
    location: "Rajarhat, Kolkata",
    price: 4500000,
    area: "3 Bigha",
    description: "Prime highway-facing land near Rajarhat New Town, ideal for commercial development. Excellent connectivity to NH-12 with clear titles and all approvals in place.",
    image: property1,
    images: [property1, property3],
    features: ["Highway Facing", "Clear Title", "Boundary Wall", "Water Supply", "Electricity Available"],
    listed: "2026-01-15",
    seller: "Subhash Mondal",
  },
  {
    id: "2",
    title: "Residential Plot Near EM Bypass",
    type: "Land",
    location: "Garia, Kolkata",
    price: 2800000,
    area: "3 Katha",
    description: "Well-located residential plot near EM Bypass with all modern amenities. Perfect for building your dream home in a rapidly developing area of South Kolkata.",
    image: property2,
    images: [property2, property1],
    features: ["Near EM Bypass", "Gated Community", "Park Nearby", "School Nearby", "Market Access"],
    listed: "2026-01-20",
    seller: "Amit Ghosh",
  },
  {
    id: "3",
    title: "Premium Agricultural Land",
    type: "Land",
    location: "Singur, Hooghly",
    price: 8500000,
    area: "5 Bigha",
    description: "Fertile agricultural land in Singur with excellent soil quality. Ideal for farming or future residential development near the industrial belt.",
    image: property3,
    images: [property3, property1],
    features: ["Fertile Soil", "Irrigation Facility", "Road Access", "Near Railway", "Fenced Property"],
    listed: "2026-02-01",
    seller: "Tapan Das",
  },
  {
    id: "4",
    title: "Commercial Building – Park Street",
    type: "Commercial",
    location: "Park Street, Kolkata",
    price: 35000000,
    area: "8000 sq ft",
    description: "Premium commercial building in the heart of Park Street with modern facade. Ideal for corporate offices, retail showrooms, or hospitality ventures.",
    image: property4,
    images: [property4, property5],
    features: ["Prime Location", "Parking Space", "24/7 Security", "Power Backup", "Lift Access"],
    listed: "2026-01-10",
    seller: "Debashis Roy",
  },
  {
    id: "5",
    title: "Modern IT Office Space",
    type: "Commercial",
    location: "Salt Lake, Sector V, Kolkata",
    price: 22000000,
    area: "6000 sq ft",
    description: "State-of-the-art office space in Kolkata's IT hub at Salt Lake Sector V. Modern interiors with conference rooms, cafeteria, and high-speed connectivity.",
    image: property5,
    images: [property5, property4],
    features: ["IT Hub Location", "Furnished", "Conference Rooms", "Cafeteria", "High-speed Internet"],
    listed: "2026-02-05",
    seller: "Rina Banerjee",
  },
  {
    id: "6",
    title: "Luxury Villa with Garden",
    type: "Residential",
    location: "Santiniketan, Birbhum",
    price: 18000000,
    area: "4500 sq ft",
    description: "Stunning modern villa with landscaped gardens in serene Santiniketan. Perfect for luxury living surrounded by the cultural heritage of Rabindranath Tagore's land.",
    image: property6,
    images: [property6, property5],
    features: ["Garden", "4 Bedrooms", "Modular Kitchen", "Terrace", "Cultural Heritage Area"],
    listed: "2026-01-25",
    seller: "Kaushik Sen",
  },
];

export const sampleTransactions: Transaction[] = [
  { id: "1", propertyName: "3 Bigha Highway Facing Land", type: "Land", amount: 4500000, status: "Completed", date: "2026-01-20" },
  { id: "2", propertyName: "Luxury Villa with Garden", type: "Residential", amount: 18000000, status: "Pending", date: "2026-02-10" },
  { id: "3", propertyName: "Modern IT Office Space", type: "Commercial", amount: 22000000, status: "Completed", date: "2025-12-15" },
  { id: "4", propertyName: "Residential Plot Near EM Bypass", type: "Land", amount: 2800000, status: "Pending", date: "2026-02-12" },
  { id: "5", propertyName: "Commercial Building – Park Street", type: "Commercial", amount: 35000000, status: "Completed", date: "2025-11-30" },
];

export const sampleUsers: SampleUser[] = [
  { id: "1", name: "Subhash Mondal", email: "subhash@example.com", phone: "+91 98765 43210", joined: "2025-06-15", listings: 3 },
  { id: "2", name: "Tapan Das", email: "tapan@example.com", phone: "+91 87654 32109", joined: "2025-08-20", listings: 2 },
  { id: "3", name: "Debashis Roy", email: "debashis@example.com", phone: "+91 76543 21098", joined: "2025-09-10", listings: 5 },
  { id: "4", name: "Rina Banerjee", email: "rina@example.com", phone: "+91 65432 10987", joined: "2025-10-05", listings: 1 },
  { id: "5", name: "Amit Ghosh", email: "amit@example.com", phone: "+91 54321 09876", joined: "2025-11-15", listings: 4 },
];

export const formatPrice = (price: number): string => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
};
