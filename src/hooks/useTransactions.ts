import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  user_id: string;
  property_id: string | null;
  property_title: string;
  property_type: string;
  amount: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // joined from profiles
  user_full_name?: string | null;
  user_phone?: string | null;
  // joined from properties
  property_location?: string | null;
  property_district?: string | null;
  property_price?: number | null;
}

// Fetch current user's transactions
export function useMyTransactions() {
  return useQuery({
    queryKey: ["my-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
  });
}

// Fetch all transactions with user + property details (admin only)
export function useAllTransactions() {
  return useQuery({
    queryKey: ["all-transactions"],
    queryFn: async () => {
      const { data: txns, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      if (!txns || txns.length === 0) return [] as Transaction[];

      // Collect unique user_ids and property_ids
      const userIds = [...new Set(txns.map((t) => t.user_id).filter(Boolean))];
      const propertyIds = [...new Set(txns.map((t) => t.property_id).filter(Boolean))];

      // Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone")
        .in("user_id", userIds);

      // Fetch properties
      const { data: props } = propertyIds.length
        ? await supabase
            .from("properties")
            .select("id, location, district, price")
            .in("id", propertyIds)
        : { data: [] };

      const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.user_id, p]));
      const propMap = Object.fromEntries((props ?? []).map((p) => [p.id, p]));

      return txns.map((t) => ({
        ...t,
        user_full_name: profileMap[t.user_id]?.full_name ?? null,
        user_phone: profileMap[t.user_id]?.phone ?? null,
        property_location: t.property_id ? propMap[t.property_id]?.location ?? null : null,
        property_district: t.property_id ? propMap[t.property_id]?.district ?? null : null,
        property_price: t.property_id ? propMap[t.property_id]?.price ?? null : null,
      })) as Transaction[];
    },
  });
}


// Insert a new transaction record
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      user_id: string;
      property_id: string;
      property_title: string;
      property_type: string;
      amount: number;
      razorpay_order_id?: string;
      status?: string;
    }) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...payload, status: payload.status ?? "pending" })
        .select()
        .single();
      if (error) throw error;
      return data as Transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
    },
  });
}

// Admin: Update transaction status manually
export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
    },
  });
}

// Update transaction with payment result
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      razorpay_payment_id,
      razorpay_signature,
      status,
    }: {
      id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      status: string;
    }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update({ razorpay_payment_id, razorpay_signature, status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
    },
  });
}
