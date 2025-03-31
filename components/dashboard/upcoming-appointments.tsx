"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video } from "lucide-react";
import Link from "next/link";

type Appointment = {
  id: string;
  patient: string;
  patientId: string;
  date: string;
  time: string;
  type: string;
  virtual: boolean;
  avatar: string;
  initials: string;
};

const appointments = [
  {
    id: "1",
    patient: "Martin Dupont",
    patientId: "1",
    date: "Aujourd'hui",
    time: "14:30",
    type: "Consultation",
    virtual: false,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MD",
  },
  {
    id: "2",
    patient: "Sophie Laurent",
    patientId: "2",
    date: "Aujourd'hui",
    time: "16:00",
    type: "Suivi",
    virtual: true,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SL",
  },
  {
    id: "3",
    patient: "Jean Petit",
    patientId: "3",
    date: "Demain",
    time: "09:15",
    type: "Examen",
    virtual: false,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JP",
  },
  {
    id: "4",
    patient: "Marie Leroy",
    patientId: "4",
    date: "Demain",
    time: "11:30",
    type: "Consultation",
    virtual: false,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ML",
  },
  {
    id: "5",
    patient: "Philippe Moreau",
    patientId: "5",
    date: "Après-demain",
    time: "10:00",
    type: "Suivi",
    virtual: true,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "PM",
  },
];

export function UpcomingAppointments({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between p-3 rounded-lg border"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={appointment.avatar} alt={appointment.patient} />
              <AvatarFallback>{appointment.initials}</AvatarFallback>
            </Avatar>

            <div>
              <Link
                href={`/patients/${appointment.patientId}`}
                className="font-medium hover:underline"
              >
                {appointment.patient}
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{appointment.time}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {appointment.virtual && (
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"
              >
                <Video className="h-3 w-3" />
                <span>Virtuel</span>
              </Badge>
            )}
            <Badge variant="secondary">{appointment.type}</Badge>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/rendez-vous">Voir tous les rendez-vous</Link>
        </Button>
      </div>
    </div>
  );
}
