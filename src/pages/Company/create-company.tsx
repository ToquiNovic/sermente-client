// src/pages/Company/create-company.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { CreateCompanyFormData } from "@/models";
import { createCompany } from "./services";
import { companySchema } from "./schemas/company.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { Building2, ChevronRight } from "lucide-react";

export const CreateCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.user?.id);

  const form = useForm<CreateCompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nameCompany: "",
      nitCompany: "",
      legalAgent: "",
      address: "",
      phone: "",
      email: "",
      urlLogo: "",
      specialistId: "",
      numberOfEmployees: 1,
    },
  });

  const onSubmit = async (data: CreateCompanyFormData) => {
    console.log("Submitting...");
    if (!userId) {
      toast.error("No se pudo identificar al usuario.");
      return;
    }

    const requestData: CreateCompanyFormData = {
      ...data,
      specialistId: userId,
    };

    setLoading(true);
    try {
      console.log("Datos antes de enviar:", requestData); 
      await createCompany(requestData);
      toast.success(`Empresa "${data.nameCompany}" creada con éxito.`);
      form.reset();
      navigate("/company");
    } catch {
      toast.error("Error al crear la empresa. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout title="Crear Empresa" icon={<Building2 />}>
    <Card className="w-full max-w-lg shadow-lg p-6">
      <CardHeader>
        <CardTitle> <ChevronRight  /> Crear Nueva Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nameCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Empresa</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Empresa de Servicios" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nitCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: 10122012334-5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero de Trabajadores</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                      placeholder="Ej: 10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legalAgent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del representante legal</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Juan Perez" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: Av. de la República, 123"
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
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Ej: 123456789"
                    />
                  </FormControl>
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
                      {...field}
                      placeholder="Ej: juanperez@gmail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urlLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del logo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: https://www.google.com/logo.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/company")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear Empresa"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
    </ContentLayout>
  );
};
