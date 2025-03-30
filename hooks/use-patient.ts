"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Patient {
  id: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  sex: string;
  phone: string;
  address: string;
  medicalInfo: {
    stade: number;
    status: string;
    medecin: string;
    dfg: number;
    proteinurie: number;
    previousDfg: number;
    previousProteinurie: number;
    lastvisite: string;
    nextvisite: string;
  };
}

async function fetchPatients(): Promise<Patient[]> {
  const response = await fetch(`/api/patients`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch patients");
  }

  return response.json();
}

async function fetchPatientById(id: string): Promise<Patient> {
  const response = await fetch(`/api/patients/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch patient");
  }

  return response.json();
}

async function createPatient(patientData: any): Promise<Patient> {
  const response = await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create patient");
  }

  return response.json();
}

async function updatePatient(id: string, patientData: any): Promise<Patient> {
  const response = await fetch(`/api/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update patient");
  }

  return response.json();
}

async function deletePatient(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/patients/${id}`, { method: "DELETE" });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete patient");
  }

  return response.json();
}

export function usePatient() {
  const queryClient = useQueryClient();

  const {
    data: patients,
    isLoading: isLoadingPatients,
    error: errorPatients,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: () => fetchPatients(),
    staleTime: 1000 * 60 * 5,
  });

  const createPatientMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      toast.success("Patient créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const updatePatientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updatePatient(id, data),
    onSuccess: () => {
      toast.success("Patient mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const deletePatientMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      toast.success("Patient supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    patients,
    isLoadingPatients,
    errorPatients,
    createPatient: createPatientMutation.mutate,
    updatePatient: updatePatientMutation.mutate,
    deletePatient: deletePatientMutation.mutate,
  };
}

export function usePatientById(id: string) {
  const queryClient = useQueryClient();

  const {
    data: patient,
    isLoading: isLoadingPatient,
    error: errorPatient,
  } = useQuery({
    queryKey: ["patients", id],
    queryFn: () => fetchPatientById(id),
    staleTime: 1000 * 60 * 5,
  });

  const updatePatientMutation = useMutation({
    mutationFn: ({ data }: { data: any }) => updatePatient(id, data),
    onSuccess: () => {
      toast.success("Patient mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["patients", id] });
    },
    onError: (error) => toast.error(error.message),
  });

  const deletePatientMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      toast.success("Patient supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["patients", id] });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    patient,
    isLoadingPatient,
    errorPatient,
    updatePatient: updatePatientMutation.mutate,
    deletePatient: deletePatientMutation.mutate,
  };
}

