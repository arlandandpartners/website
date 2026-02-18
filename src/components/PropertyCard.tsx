import { Link } from "react-router-dom";
import { MapPin, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { DBProperty, formatPrice } from "@/hooks/useProperties";

interface PropertyCardProps {
  property: DBProperty;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
  const coverImage = property.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-shadow group border"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <MapPin className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">
          {property.type}
        </Badge>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-lg leading-tight line-clamp-1">{property.title}</h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {property.location}
        </p>
        {property.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
        )}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="font-display text-xl font-bold text-primary">{formatPrice(property.price)}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Maximize2 className="h-3 w-3" /> {property.area} {property.area_unit}
            </p>
          </div>
          <Button asChild variant="accent" size="sm">
            <Link to={`/property/${property.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
