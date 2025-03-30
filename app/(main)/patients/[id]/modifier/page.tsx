"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const patientFormSchema = z.object({
  firstname: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères",
  }),
  lastname: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
  birthdate: z.string().min(1, {
    message: "La date de naissance est requise",
  }),
  sex: z.string().min(1, {
    message: "Le sexe est requis",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide",
  }),
  phone: z.string().min(1, {
    message: "Le numéro de téléphone est requis",
  }),
  address: z.string().min(1, {
    message: "L'adresse est requise",
  }),
  stage: z.string().min(1, {
    message: "Le stade MRC est requis",
  }),
  dfg: z.string().min(1, {
    message: "Le DFG est requis",
  }),
  proteinurie: z.string(),
  medecin: z.string().min(1, {
    message: "Le médecin référent est requis",
  }),
  notes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;
type Params = Promise<{ id: string }>;

export default function EditPatientPage(props: { params: Params }) {
  const params = use(props.params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      birthdate: "",
      sex: "",
      email: "",
      phone: "",
      address: "",
      stage: "",
      dfg: "",
      proteinurie: "",
      medecin: "",
      notes: "",
    },
  });

  useEffect(() => {
    // Simulate fetching patient data
    const fetchPatient = async () => {
      try {
        // In a real app, you would fetch the patient data from your API
        // For now, we'll use mock data based on the ID
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data for Sophie Laurent (ID 2)
        if (params.id === "2") {
          form.reset({
            firstname: "Sophie",
            lastname: "Laurent",
            birthdate: "1951-06-15",
            sex: "F",
            email: "sophie.laurent@email.com",
            phone: "01 23 45 67 89",
            address: "45 Rue des Lilas, 75013 Paris",
            stage: "4",
            dfg: "25",
            proteinurie: "2.5",
            medecin: "Dr. Martin Lefèvre",
            notes:
              "Patiente suivie depuis 2020. Hypertension artérielle et diabète de type 2.",
          });
        }
        // Mock data for Philippe Moreau (ID 5)
        else if (params.id === "5") {
          form.reset({
            firstname: "Philippe",
            lastname: "Moreau",
            birthdate: "1948-03-22",
            sex: "M",
            email: "philippe.moreau@email.com",
            phone: "01 98 76 54 32",
            address: "12 Avenue Victor Hugo, 75016 Paris",
            stage: "5",
            dfg: "15",
            proteinurie: "3.2",
            medecin: "Dr. Martin Lefèvre",
            notes: "Patient en préparation pour la dialyse. Anémie sévère.",
          });
        }
        // Default mock data for other IDs
        else {
          form.reset({
            firstname: "Patient",
            lastname: `ID: ${params.id}`,
            birthdate: "1960-01-01",
            sex: "M",
            email: "patient@example.com",
            phone: "01 00 00 00 00",
            address: "1 Rue Example, 75000 Paris",
            stage: "3",
            dfg: "40",
            proteinurie: "1.0",
            medecin: "Dr. Martin Lefèvre",
            notes: "",
          });
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        toast.error("Erreur lors du chargement des données du patient");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [params.id, form]);

  async function onSubmit(data: PatientFormValues) {
    setIsSubmitting(true);

    try {
      // Here you would normally send the data to your API
      console.log("Updated patient data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Patient mis à jour avec succès");
      router.push(`/patients/${params.id}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du patient");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Link href={`/patients/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Modifier le patient
          </h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href={`/patients/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier le patient
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Informations de base du patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexe</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Masculin</SelectItem>
                          <SelectItem value="F">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="01 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse complète" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations médicales</CardTitle>
              <CardDescription>Données médicales du patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stade MRC</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Stade 1</SelectItem>
                          <SelectItem value="2">Stade 2</SelectItem>
                          <SelectItem value="3">Stade 3</SelectItem>
                          <SelectItem value="4">Stade 4</SelectItem>
                          <SelectItem value="5">Stade 5</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dfg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DFG (ml/min)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Débit de filtration glomérulaire
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proteinurie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protéinurie (g/24h)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medecin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Médecin référent</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informations complémentaires"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href={`/patients/${params.id}`}>Annuler</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Enregistrement..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
