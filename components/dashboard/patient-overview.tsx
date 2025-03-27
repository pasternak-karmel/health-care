"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

const patients = [
  {
    id: "1",
    name: "Martin Dupont",
    age: 67,
    stage: 3,
    lastVisit: "Aujourd'hui",
    critical: false,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MD",
  },
  {
    id: "2",
    name: "Sophie Laurent",
    age: 72,
    stage: 4,
    lastVisit: "Hier",
    critical: true,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SL",
  },
  {
    id: "3",
    name: "Jean Petit",
    age: 58,
    stage: 2,
    lastVisit: "Il y a 3 jours",
    critical: false,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JP",
  },
  {
    id: "4",
    name: "Marie Leroy",
    age: 63,
    stage: 3,
    lastVisit: "Il y a 5 jours",
    critical: false,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ML",
  },
  {
    id: "5",
    name: "Philippe Moreau",
    age: 75,
    stage: 5,
    lastVisit: "Il y a 1 semaine",
    critical: true,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "PM",
  },
];

export function PatientOverview() {
  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div
          key={patient.id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback>{patient.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{patient.name}</p>
                {patient.critical && (
                  <Badge variant="destructive" className="text-xs">
                    Critique
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{patient.age} ans</span>
                <span>•</span>
                <span>Stade {patient.stage}</span>
                <span>•</span>
                <span>Vu: {patient.lastVisit}</span>
              </div>
            </div>
          </div>
          <Link href={`/patients/${patient.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
