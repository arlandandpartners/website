import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ScrollReveal from "@/components/ScrollReveal";
import { useProperties, WB_DISTRICTS } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_PRICE = 100000000; // 10 Cr

const Listings = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: properties = [], isLoading } = useProperties({
    type: typeFilter !== "all" ? typeFilter : undefined,
    district: districtFilter !== "all" ? districtFilter : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1] : undefined,
    search: search || undefined,
  });

  const sorted = [...properties].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const formatSliderPrice = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(0)}Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`;
    return `₹${(v / 1000).toFixed(0)}K`;
  };

  const hasActiveFilters =
    typeFilter !== "all" || districtFilter !== "all" || priceRange[0] > 0 || priceRange[1] < MAX_PRICE;

  const clearFilters = () => {
    setTypeFilter("all");
    setDistrictFilter("all");
    setPriceRange([0, MAX_PRICE]);
    setSearch("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <ScrollReveal>
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold">All Properties</h1>
            <p className="text-muted-foreground mt-1">Browse properties across West Bengal</p>
          </div>
        </ScrollReveal>

        {/* Search + Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="Search by title or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:max-w-xs"
          />
          <Button
            variant="outline"
            className="gap-2 sm:w-auto"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                !
              </span>
            )}
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-card border rounded-xl p-4 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filter Properties</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-destructive h-7">
                  <X className="h-3 w-3" /> Clear All
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Property Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">District (West Bengal)</label>
                <Select value={districtFilter} onValueChange={setDistrictFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {WB_DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="text-xs font-medium text-muted-foreground mb-3 block">
                  Price Range: {formatSliderPrice(priceRange[0])} – {formatSliderPrice(priceRange[1])}
                </label>
                <Slider
                  min={0}
                  max={MAX_PRICE}
                  step={500000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No properties found matching your criteria.</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">Clear Filters</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Listings;
