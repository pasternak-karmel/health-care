"use client";

import { useState } from "react";
import { toast } from "sonner";

interface DashboardStats {
  totalPatients: number;
  stageDistribution: Array<{ stage: number; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
  criticalPatients: number;
  upcomingAppointments: Array<{
    id: string;
    firstname: string;
    lastname: string;
    appointmentDate: string;
  }>;
}

interface UseDashboardOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useDashboard(options?: UseDashboardOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getDashboardStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard/stats");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch dashboard statistics"
        );
      }

      const data = await response.json();
      options?.onSuccess?.(data);
      return data as DashboardStats;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);
      options?.onError?.(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getDashboardStats,
  };
}
