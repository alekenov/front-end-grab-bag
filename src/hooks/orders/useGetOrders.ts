
import { useQuery } from "@tanstack/react-query";
import { OrdersFilter } from "@/types/order";
import { getFilteredMockOrders } from "./utils/ordersMockUtils";

/**
 * Hook for fetching orders with optional filters
 */
export const useGetOrders = (filters?: OrdersFilter) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      try {
        console.log("Getting filtered orders with filters:", filters);
        const filtered = getFilteredMockOrders(filters);
        console.log("Filtered orders result:", filtered);
        return filtered;
      } catch (error) {
        console.error("Error getting filtered orders:", error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: false,
  });
};
