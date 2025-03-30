"use client";

import { DataTablePatients } from "@/components/patients/table/data-table-patient";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/hooks/use-patient";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function PatientPage() {
  const { patients, isLoadingPatients, errorPatients } = usePatient();

  if (errorPatients) {
    // show skeleton loader after
    return <p className="text-red-500">Erreur: {errorPatients.message}</p>;
  }

  if (isLoadingPatients) {
    // show skeleton loader after
    return <p>Chargement des patients...</p>;
  }

  // return <div>{JSON.stringify(patients, null, 2)}</div>;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <Link href="/patients/nouveau">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau patient
          </Button>
        </Link>
      </div>
      <DataTablePatients data={patients!} />
    </div>
  );
}
