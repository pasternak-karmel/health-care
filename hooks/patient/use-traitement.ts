import { TraitementSchema } from "@/components/patients/traitement/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

interface PatientTraitement {
  id: string;
  patientId: string;
  medicament: string;
  category: string;
  posologie: string;
  frequence: string;
  date: string;
  type: string;
  medecin: string;
  status: string;
}

async function fetchPatientTraitements(
  id: string
): Promise<PatientTraitement[]> {
  const response = await fetch(`/api/patients/${id}/traitements`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch patient traitements");
  }

  return response.json();
}

async function createPatientTraitement(data: z.infer<typeof TraitementSchema>) {
  // const response = await fetch(`/api/patients/${id}/traitements`, {
  const response = await fetch(`/api/patients/traitements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create patient traitement");
  }

  return response.json();
}

async function updatePatientTraitement(data: z.infer<typeof TraitementSchema>) {
  const response = await fetch(`/api/patients/traitements`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update patient traitement");
  }

  return response.json();
}

export function usePatientTraitement(id: string) {
  const queryClient = useQueryClient();

  const {
    data: patientTraitements,
    isLoading: isLoadingPatientTraitements,
    error: errorPatientTraitements,
  } = useQuery({
    queryKey: ["patientTraitements"],
    queryFn: () => fetchPatientTraitements(id),
    staleTime: 1000 * 60 * 5,
  });

  const createPatientTraitementMutation = useMutation({
    mutationFn: createPatientTraitement,
    onSuccess: () => {
      toast.success("Traitement ajouté avec succès");
      queryClient.invalidateQueries({ queryKey: ["patientTraitements"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const updatePatientTraitementMutation = useMutation({
    mutationFn: ({ data }: { data: z.infer<typeof TraitementSchema> }) =>
      updatePatientTraitement(data),
    onSuccess: () => {
      toast.success("Traitement mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["patientTraitements"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    patientTraitements,
    isLoadingPatientTraitements,
    errorPatientTraitements,
    createPatientTraitement: createPatientTraitementMutation.mutate,
    updatePatientTraitement: updatePatientTraitementMutation.mutate,
  };
}
