"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Calendar,
  FileCheck,
  FileText,
  FlaskRoundIcon as Flask,
  Pill,
  Stethoscope,
} from "lucide-react";

interface PatientTimelineProps {
  patientId: string;
}

export function PatientTimeline({ patientId }: PatientTimelineProps) {
  const events = [
    {
      id: "1",
      date: "05/04/2023",
      type: "consultation",
      title: "Consultation de suivi",
      description:
        "Examen clinique normal. Pression artérielle élevée (160/95 mmHg). Ajustement du traitement antihypertenseur.",
      doctor: "Dr. Martin Lefèvre",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ML",
    },
    {
      id: "2",
      date: "05/04/2023",
      type: "lab",
      title: "Analyses de sang",
      description:
        "Créatinine: 180 μmol/L, DFG: 25 ml/min, Potassium: 5.2 mmol/L, Hémoglobine: 10.5 g/dL",
      doctor: "Dr. Martin Lefèvre",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ML",
    },
    {
      id: "3",
      date: "05/04/2023",
      type: "medication",
      title: "Modification du traitement",
      description:
        "Augmentation de la dose de furosémide à 40mg/jour. Ajout d'amlodipine 5mg/jour.",
      doctor: "Dr. Martin Lefèvre",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ML",
    },
    {
      id: "4",
      date: "15/03/2023",
      type: "alert",
      title: "Alerte: Potassium élevé",
      description:
        "Potassium à 5.8 mmol/L. Patient contacté pour ajustement du traitement et contrôle dans 1 semaine.",
      doctor: "Dr. Sophie Moreau",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    {
      id: "5",
      date: "01/03/2023",
      type: "consultation",
      title: "Consultation de néphrologie",
      description:
        "Évaluation de la fonction rénale. Discussion sur la préparation à la dialyse si détérioration continue.",
      doctor: "Dr. Martin Lefèvre",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ML",
    },
    {
      id: "6",
      date: "01/03/2023",
      type: "document",
      title: "Compte-rendu d'échographie rénale",
      description:
        "Reins de taille réduite, hyperéchogènes. Pas d'obstacle sur les voies urinaires.",
      doctor: "Dr. Julie Dupont",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
  ];

  return (
    <div className="space-y-8">
      {events.map((event, index) => (
        <div key={event.id} className="relative pl-8 pb-8">
          {/* Ligne verticale */}
          {index < events.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
          )}

          {/* Icône d'événement */}
          <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
            {event.type === "consultation" && (
              <Stethoscope className="h-4 w-4 text-blue-500" />
            )}
            {event.type === "lab" && (
              <Flask className="h-4 w-4 text-amber-500" />
            )}
            {event.type === "medication" && (
              <Pill className="h-4 w-4 text-green-500" />
            )}
            {event.type === "alert" && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
            {event.type === "document" && (
              <FileCheck className="h-4 w-4 text-purple-500" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{event.date}</span>
              </div>

              {event.type === "consultation" && (
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  Consultation
                </Badge>
              )}
              {event.type === "lab" && (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-200"
                >
                  Analyses
                </Badge>
              )}
              {event.type === "medication" && (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  Traitement
                </Badge>
              )}
              {event.type === "alert" && (
                <Badge variant="destructive">Alerte</Badge>
              )}
              {event.type === "document" && (
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-800 border-purple-200"
                >
                  Document
                </Badge>
              )}
            </div>

            <div>
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Avatar className="h-6 w-6">
                <AvatarImage src={event.avatar} alt={event.doctor} />
                <AvatarFallback>{event.initials}</AvatarFallback>
              </Avatar>
              <span>{event.doctor}</span>
            </div>

            {event.type === "document" && (
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Voir le document
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
