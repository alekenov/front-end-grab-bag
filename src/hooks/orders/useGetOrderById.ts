
import { useQuery } from "@tanstack/react-query";
import { getMockOrderById } from "./utils/ordersMockUtils";

/**
 * Hook for fetching a specific order by ID
 */
export const useGetOrderById = (orderId: string | null) => {
  return useQuery({
    queryKey: ['order', orderId],
    enabled: !!orderId && orderId !== "",
    queryFn: async () => {
      try {
        if (!orderId || orderId === "") {
          console.log("Empty order ID provided to getOrderById");
          return null;
        }
        
        console.log("Fetching order with ID:", orderId);
        const order = getMockOrderById(orderId);
        console.log("Order found:", order);
        return order;
      } catch (error) {
        console.error("Error fetching order by ID:", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
