import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Filter, Eye, Edit, Trash } from 'lucide-react'
import Link from "next/link"

const patients = [
  {
    id: "1",
    name: "Martin Dupont",
    age: 67,
    sexe: "M",
    stage: 3,
    lastVisit: "12/03/2023",
    nextVisit: "15/06/2023",
    status: "stable"
  },
  {
    id: "2",
    name: "Sophie Laurent",
    age: 72,
    sexe: "F",
    stage: 4,
    lastVisit: "05/04/2023",
    nextVisit: "19/04/2023",
    status: "critical"
  },
  {
    id: "3",
    name: "Jean Petit",
    age: 58,
    sexe: "M",
    stage: 2,
    lastVisit: "22/02/2023",
    nextVisit: "22/05/2023",
    status: "stable"
  },
  {
    id: "4",
    name: "Marie Leroy",
    age: 63,
    sexe: "F",
    stage: 3,
    lastVisit: "18/03/2023",
    nextVisit: "18/06/2023",
    status: "stable"
  },
  {
    id: "5",
    name: "Philippe Moreau",
    age: 75,
    sexe: "M",
    stage: 5,
    lastVisit: "01/04/2023",
    nextVisit: "15/04/2023",
    status: "critical"
  },
  {
    id: "6",
    name: "Isabelle Dubois",
    age: 61,
    sexe: "F",
    stage: 3,
    lastVisit: "25/02/2023",
    nextVisit: "25/05/2023",
    status: "improving"
  },
  {
    id: "7",
    name: "Robert Lefebvre",
    age: 70,
    sexe: "M",
    stage: 4,
    lastVisit: "10/03/2023",
    nextVisit: "10/05/2023",
    status: "worsening"
  },
  {
    id: "8",
    name: "Nathalie Bernard",
    age: 55,
    sexe: "F",
    stage: 2,
    lastVisit: "15/03/2023",
    nextVisit: "15/06/2023",
    status: "stable"
  }
]

export default function PatientsPage() {
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
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un patient..."
              className="w-full pl-8"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Stade MRC</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les stades</SelectItem>
                <SelectItem value="1">Stade 1</SelectItem>
                <SelectItem value="2">Stade 2</SelectItem>
                <SelectItem value="3">Stade 3</SelectItem>
                <SelectItem value="4">Stade 4</SelectItem>
                <SelectItem value="5">Stade 5</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Statut</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="improving">En amélioration</SelectItem>
                <SelectItem value="worsening">En détérioration</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Âge</TableHead>
              <TableHead>Sexe</TableHead>
              <TableHead>Stade MRC</TableHead>
              <TableHead>Dernière visite</TableHead>
              <TableHead>Prochaine visite</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.age} ans</TableCell>
                <TableCell>{patient.sexe}</TableCell>
                <TableCell>Stade {patient.stage}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>{patient.nextVisit}</TableCell>
                <TableCell>
                  {patient.status === "stable" && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Stable
                    </Badge>
                  )}
                  {patient.status === "improving" && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      En amélioration
                    </Badge>
                  )}
                  {patient.status === "worsening" && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      En détérioration
                    </Badge>
                  )}
                  {patient.status === "critical" && (
                    <Badge variant="destructive">
                      Critique
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/patients/${patient.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
                    </Link>
                    <Link href={`/patients/${patient.id}/modifier`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
