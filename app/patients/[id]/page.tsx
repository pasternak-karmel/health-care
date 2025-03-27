import { PatientLabs } from "@/components/patients/patient-labs";
import { PatientMedications } from "@/components/patients/patient-medications";
import { PatientTimeline } from "@/components/patients/patient-timeline";
import { PatientVitals } from "@/components/patients/patient-vitals";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Edit,
  FileText,
  Minus,
  Pill,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { use } from "react";

type Params = Promise<{ id: string }>;

export default function PatientDetailsPage(props: { params: Params }) {
  const params = use(props.params);
  const id = params.id;
  const patient = {
    id: id,
    name: "Sophie Laurent",
    age: 72,
    sexe: "F",
    dateNaissance: "15/06/1951",
    adresse: "45 Rue des Lilas, 75013 Paris",
    telephone: "01 23 45 67 89",
    email: "sophie.laurent@email.com",
    stage: 4,
    lastVisit: "05/04/2023",
    nextVisit: "19/04/2023",
    status: "critical",
    dfg: 25,
    dfgTrend: "down",
    proteinurie: "2.5 g/24h",
    proteinurieTrend: "up",
    medecin: "Dr. Martin Lefèvre",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "SL",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href="/patients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Dossier patient</h1>
        <div className="ml-auto">
          <Link href={`/patients/${params.id}/modifier`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback>{patient.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{patient.name}</CardTitle>
              <CardDescription>
                {patient.age} ans • {patient.sexe}
              </CardDescription>
              <div className="mt-1">
                {patient.status === "critical" && (
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
                  <div>{patient.dateNaissance}</div>
                  <div className="font-medium">Adresse</div>
                  <div>{patient.adresse}</div>
                  <div className="font-medium">Téléphone</div>
                  <div>{patient.telephone}</div>
                  <div className="font-medium">Email</div>
                  <div>{patient.email}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Informations médicales
                </h3>
                <div className="grid grid-cols-[1fr_auto] gap-1 text-sm">
                  <div className="font-medium">Stade MRC</div>
                  <div>Stade {patient.stage}</div>
                  <div className="font-medium">DFG</div>
                  <div className="flex items-center">
                    {patient.dfg} ml/min
                    {patient.dfgTrend === "down" && (
                      <TrendingDown className="ml-1 h-4 w-4 text-destructive" />
                    )}
                    {patient.dfgTrend === "up" && (
                      <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                    )}
                    {patient.dfgTrend === "stable" && (
                      <Minus className="ml-1 h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="font-medium">Protéinurie</div>
                  <div className="flex items-center">
                    {patient.proteinurie}
                    {patient.proteinurieTrend === "up" && (
                      <TrendingUp className="ml-1 h-4 w-4 text-destructive" />
                    )}
                    {patient.proteinurieTrend === "down" && (
                      <TrendingDown className="ml-1 h-4 w-4 text-green-500" />
                    )}
                    {patient.proteinurieTrend === "stable" && (
                      <Minus className="ml-1 h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="font-medium">Médecin référent</div>
                  <div>{patient.medecin}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Rendez-vous
                </h3>
                <div className="grid grid-cols-[1fr_auto] gap-1 text-sm">
                  <div className="font-medium">Dernière visite</div>
                  <div>{patient.lastVisit}</div>
                  <div className="font-medium">Prochain rendez-vous</div>
                  <div>{patient.nextVisit}</div>
                </div>
              </div>

              <div className="pt-2">
                <Link href={`/workflows/patient/${params.id}`}>
                  <Button variant="outline" className="w-full">
                    <Activity className="mr-2 h-4 w-4" />
                    Workflow de suivi
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-5">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Historique</span>
              </TabsTrigger>
              <TabsTrigger value="vitals" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Constantes</span>
              </TabsTrigger>
              <TabsTrigger value="labs" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Analyses</span>
              </TabsTrigger>
              <TabsTrigger
                value="medications"
                className="flex items-center gap-2"
              >
                <Pill className="h-4 w-4" />
                <span className="hidden sm:inline">Traitements</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique du patient</CardTitle>
                  <CardDescription>
                    Consultations, examens et événements importants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientTimeline patientId={params.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vitals" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Constantes vitales</CardTitle>
                  <CardDescription>
                    Évolution des constantes vitales au fil du temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientVitals patientId={params.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="labs" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Résultats d&apos;analyses</CardTitle>
                  <CardDescription>
                    Analyses biologiques et examens complémentaires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientLabs patientId={params.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Traitements</CardTitle>
                  <CardDescription>
                    Médicaments prescrits et historique des prescriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientMedications patientId={params.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
