"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchWorkflowPatients } from "@/hooks/patient/use-workflow";
import {
  AlertTriangle,
  Calendar,
  ClipboardList,
  Eye,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";

interface WorkflowPatientsProps {
  workflowId: string;
}

type Patient = {
  id: string;
  name: string;
  age: number;
  stage: number;
  lastVisit: string;
  critical: boolean;
  avatar: string;
  initials: string;
  status: string;
  alerts: number;
  tasks: number;
  nextVisit: string;
};

export function WorkflowPatients({ workflowId }: WorkflowPatientsProps) {
  const router = useRouter();

  const currentPage = window.location.pathname;
  const handleAddTaskClick = (patientId?: string) => {
    router.push(
      "/tasks/nouveau?redirectTo=" + currentPage + "&patientId=" + patientId
    );
  };

  const { data: patients } = useFetchWorkflowPatients(workflowId);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Stade MRC</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Prochain RDV</TableHead>
            <TableHead>Alertes</TableHead>
            <TableHead>Tâches</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients?.map((patient: Patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback>{patient.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {patient.age} ans
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>Stade {patient.stage}</TableCell>
              <TableCell>
                {patient.status === "stable" && (
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Stable
                  </Badge>
                )}
                {patient.status === "improving" && (
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    En amélioration
                  </Badge>
                )}
                {patient.status === "worsening" && (
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-200"
                  >
                    En détérioration
                  </Badge>
                )}
                {patient.status === "critical" && (
                  <Badge variant="destructive">Critique</Badge>
                )}
              </TableCell>
              <TableCell>{patient.nextVisit}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      patient.alerts > 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span>{patient.alerts}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.tasks}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/patients/${patient.id}`}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le dossier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        Planifier un RDV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleAddTaskClick(patient.id)}
                      >
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Ajouter une tâche
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive cursor-pointer">
                        Retirer du workflow
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
