"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Check, X } from "lucide-react";
import { AddTraitement } from "./traitement";

interface PatientMedicationsProps {
  patientId: string;
}

export function PatientMedications({ patientId }: PatientMedicationsProps) {
  const medications = [
    {
      id: "1",
      name: "Furosémide",
      dosage: "40 mg",
      frequency: "1 fois par jour",
      startDate: "01/03/2023",
      endDate: null,
      status: "active",
      prescribedBy: "Dr. Martin Lefèvre",
      notes: "Augmentation de la dose le 05/04/2023 (précédemment 20mg)",
      interactions: false,
      category: "diurétique",
    },
    {
      id: "2",
      name: "Amlodipine",
      dosage: "5 mg",
      frequency: "1 fois par jour",
      startDate: "05/04/2023",
      endDate: null,
      status: "active",
      prescribedBy: "Dr. Martin Lefèvre",
      notes: "Ajouté pour contrôle tensionnel",
      interactions: false,
      category: "antihypertenseur",
    },
    {
      id: "3",
      name: "Sévélamer",
      dosage: "800 mg",
      frequency: "3 fois par jour",
      startDate: "01/03/2023",
      endDate: null,
      status: "active",
      prescribedBy: "Dr. Martin Lefèvre",
      notes: "À prendre pendant les repas",
      interactions: true,
      category: "chélateur du phosphore",
    },
    {
      id: "4",
      name: "Darbépoétine alfa",
      dosage: "40 μg",
      frequency: "1 fois par semaine",
      startDate: "01/03/2023",
      endDate: null,
      status: "active",
      prescribedBy: "Dr. Martin Lefèvre",
      notes: "Injection sous-cutanée",
      interactions: false,
      category: "agent stimulant l'érythropoïèse",
    },
    {
      id: "5",
      name: "Ramipril",
      dosage: "5 mg",
      frequency: "1 fois par jour",
      startDate: "15/01/2023",
      endDate: "05/04/2023",
      status: "discontinued",
      prescribedBy: "Dr. Martin Lefèvre",
      notes: "Arrêté en raison d'une toux persistante",
      interactions: false,
      category: "inhibiteur de l'enzyme de conversion",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Traitements en cours</h3>
        <AddTraitement patientId={patientId} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Médicament</TableHead>
              <TableHead>Posologie</TableHead>
              <TableHead>Fréquence</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Prescrit par</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell>
                  <div className="font-medium">{medication.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {medication.category}
                  </div>
                </TableCell>
                <TableCell>{medication.dosage}</TableCell>
                <TableCell>{medication.frequency}</TableCell>
                <TableCell>{medication.startDate}</TableCell>
                <TableCell>
                  {medication.status === "active" && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      <span>Actif</span>
                    </Badge>
                  )}
                  {medication.status === "discontinued" && (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      <span>Arrêté</span>
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{medication.prescribedBy}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {medication.notes}
                    {medication.interactions && (
                      <div
                        className="tooltip"
                        data-tip="Interactions médicamenteuses possibles"
                      >
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
