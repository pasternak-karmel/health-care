"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatientById } from "@/hooks/use-patient";
import { Activity, Minus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

interface DetailsPatientProps {
  id: string;
}

const DetailsPatient = ({ id }: DetailsPatientProps) => {
  const { patient, isLoadingPatient } = usePatientById(id);

  if (isLoadingPatient) {
    return (
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20 mt-1" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-48 mb-2" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-48 mb-2" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-48 mb-2" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            <div className="pt-2">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!patient) return null;

  const dfgTrend =
    patient.medicalInfo.dfg > patient.medicalInfo.previousDfg
      ? "up"
      : patient.medicalInfo.dfg < patient.medicalInfo.previousDfg
      ? "down"
      : "stable";

  const proteinurieTrend =
    patient.medicalInfo.proteinurie > patient.medicalInfo.previousProteinurie
      ? "up"
      : patient.medicalInfo.proteinurie <
        patient.medicalInfo.previousProteinurie
      ? "down"
      : "stable";

  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback>
            {patient.firstname[0]}
            {patient.lastname[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {patient.firstname} {patient.lastname}
          </CardTitle>
          <CardDescription>
            {new Date().getFullYear() -
              new Date(patient.birthdate).getFullYear()}{" "}
            ans • {patient.sex}
          </CardDescription>
          <div className="mt-1">
            {patient.medicalInfo.status === "critical" && (
              <Badge variant="destructive">Critique</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-[1fr_auto] gap-1 text-sm">
              <div className="font-medium">Date de naissance</div>
              <div>{patient.birthdate}</div>
              <div className="font-medium">Adresse</div>
              <div>{patient.address}</div>
              <div className="font-medium">Téléphone</div>
              <div>{patient.phone}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Informations médicales
            </h3>
            <div className="grid grid-cols-[1fr_auto] gap-1 text-sm">
              <div className="font-medium">Stade MRC</div>
              <div>Stade {patient.medicalInfo.stade}</div>
              <div className="font-medium">DFG</div>
              <div className="flex items-center">
                {patient.medicalInfo.dfg} ml/min
                {dfgTrend === "down" && (
                  <TrendingDown className="ml-1 h-4 w-4 text-destructive" />
                )}
                {dfgTrend === "up" && (
                  <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                )}
                {dfgTrend === "stable" && (
                  <Minus className="ml-1 h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="font-medium">Protéinurie</div>
              <div className="flex items-center">
                {patient.medicalInfo.proteinurie} g/24h
                {proteinurieTrend === "up" && (
                  <TrendingUp className="ml-1 h-4 w-4 text-destructive" />
                )}
                {proteinurieTrend === "down" && (
                  <TrendingDown className="ml-1 h-4 w-4 text-green-500" />
                )}
                {proteinurieTrend === "stable" && (
                  <Minus className="ml-1 h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="font-medium">Médecin référent</div>
              <div>{patient.medicalInfo.medecin}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Rendez-vous
            </h3>
            <div className="grid grid-cols-[1fr_auto] gap-1 text-sm">
              <div className="font-medium">Dernière visite</div>
              <div>{patient.medicalInfo.lastvisite}</div>
              <div className="font-medium">Prochain rendez-vous</div>
              <div>{patient.medicalInfo.nextvisite}</div>
            </div>
          </div>

          <div className="pt-2">
            <Link href={`/workflows/patient/${id}`}>
              <Button variant="outline" className="w-full">
                <Activity className="mr-2 h-4 w-4" />
                Workflow de suivi
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsPatient;
