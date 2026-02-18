import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DBProperty {
  id: string;
  title: string;
  type: "Land" | "Residential" | "Commercial";
  location: string;
  district: string;
  price: number;
  area: string;
  area_unit: string;
  description: string | null;
  images: string[];
  features: string[];
  seller_name: string | null;
  seller_phone: string | null;
  seller_email: string | null;
  status: "active" | "pending" | "sold" | "draft";
  created_at: string;
  updated_at: string;
}

export const useProperties = (filters?: {
  type?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (filters?.type && filters.type !== "all") {
        query = query.eq("type", filters.type);
      }
      if (filters?.district && filters.district !== "all") {
        query = query.eq("district", filters.district);
      }
      if (filters?.minPrice) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte("price", filters.maxPrice);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as DBProperty[];
    },
  });
};

export const useAllPropertiesAdmin = () => {
  return useQuery({
    queryKey: ["properties-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as DBProperty[];
    },
  });
};

// Fetch only the current user's submitted properties
export const useMySubmissions = (userId?: string) => {
  return useQuery({
    queryKey: ["my-submissions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as DBProperty[];
    },
    enabled: !!userId,
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as DBProperty;
    },
    enabled: !!id,
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties-admin"] });
      toast.success("Property deleted successfully");
    },
    onError: () => toast.error("Failed to delete property"),
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<DBProperty, "id" | "created_at" | "updated_at">) => {
      const { error, data: created } = await supabase.from("properties").insert([data]).select().single();
      if (error) throw error;
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties-admin"] });
      toast.success("Property listing published successfully!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create property"),
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DBProperty> }) => {
      const { error } = await supabase.from("properties").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties-admin"] });
      toast.success("Property updated successfully!");
    },
    onError: () => toast.error("Failed to update property"),
  });
};

export const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("properties").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties-admin"] });
      const label = variables.status === "active" ? "approved" : "rejected";
      toast.success(`Property ${label} successfully!`);
    },
    onError: () => toast.error("Failed to update property status"),
  });
};

export const WB_DISTRICTS = [
  "Kolkata", "Howrah", "Hooghly", "North 24 Parganas", "South 24 Parganas",
  "Nadia", "Murshidabad", "Bardhaman", "Birbhum", "Bankura",
  "Purulia", "West Midnapore", "East Midnapore", "Jalpaiguri",
  "Darjeeling", "Cooch Behar", "Alipurduar", "Siliguri",
  "Malda", "Dinajpur", "Raiganj", "Durgapur", "Asansol",
];

export const formatPrice = (price: number): string => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
};
