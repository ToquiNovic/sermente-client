// @/pages/company/create-company.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CreateCompanyFormData } from "@/models";
import { createCompany } from "./services";
import { companySchema } from "./schemas/company.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CardContent, CardFooter } from "@/components/ui/card";
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
import { Building2 } from "lucide-react";
import InputUploadImage from "./components/inputUploadImage";
import { useImageUpload } from "@/hooks/useImageUpload";
import { v4 as uuidv4 } from "uuid";

export const CreateCompany = () => {
  const navigate = useNavigate();
  const [companyId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.user?.id);
  const { isUploading, uploadedUrl, setUploadedUrl } = useImageUpload();
  const [fileExtension, setFileExtension] = useState<string | null>(null);

  const form = useForm<CreateCompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      id: companyId,
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
    if (!userId) {
      toast.error("No se pudo identificar al usuario.");
      return;
    }

    const requestData: CreateCompanyFormData = {
      ...data,
      id: companyId || uuidv4(),
      specialistId: userId,
      urlLogo: uploadedUrl || "",
      extensionFile: fileExtension || "",
    };

    setLoading(true);
    try {
      await createCompany(requestData);

      toast.success(`Empresa "${data.nameCompany}" creada con éxito.`);
      form.reset();
      navigate("/company");
    } catch (error) {
      console.error("Error al crear la empresa:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout title="Crear Empresa" icon={<Building2 />}>
      <CardContent className="md:px-10 md:py-4">
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
              render={() => (
                <FormItem>
                  <FormLabel>Logo de la Empresa</FormLabel>
                  <InputUploadImage
                    tipo="companies"
                    id={companyId}
                    onUploadComplete={(url, extension) => {
                      setUploadedUrl(url ?? null);
                      setFileExtension(extension);
                    }}
                  />

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
              <Button type="submit" disabled={loading || isUploading}>
                {loading ? "Creando..." : "Crear Empresa"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </ContentLayout>
  );
};
