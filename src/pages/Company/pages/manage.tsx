// pages/Company/pages/manage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkersTab, CompanyTab } from "../tabs";
import { getCompany, updateCompany } from "../services";
import { toast } from "sonner";
import { Company } from "@/models";

export const CompanyManage = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("empresa");

  // Cargar los datos de la empresa al montar el componente
  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;

      try {
        const companyData: Company = await getCompany(id);
        setCompany(companyData);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  // Función para manejar el guardado
  const handleSave = async (updatedCompany: Partial<Company>) => {
    if (!id) return;

    try {
      // Log para verificar los datos enviados
      console.log("Datos enviados a la API:", updatedCompany);

      // Actualizar la empresa a través de la API
      await updateCompany(id, updatedCompany);

      // Refetch para asegurarnos de que los datos están actualizados
      const companyData = await getCompany(id);
      setCompany(companyData);

      toast.success("Empresa actualizada correctamente");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (loading) return <div className="text-center p-6">Cargando...</div>;

  if (!company) return <div className="text-center p-6">No se encontraron datos de la empresa.</div>;

  return (
    <ContentLayout
      title={company?.name || "Empresa"}
      icon={
        <img
          src={company?.urlIcon || "/default-company-logo.png"}
          alt={company?.name}
          className="w-8 h-8 rounded-full"
        />
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex space-x-2 bg-transparent justify-start">
          <TabsTrigger
            value="empresa"
            className="relative py-2 px-4 text-gray-600 border border-transparent rounded-t-md rounded-b-none
            data-[state=active]:border-gray-300 data-[state=active]:border-b-white data-[state=active]:bg-white 
            data-[state=active]:text-black font-medium"
          >
            Empresa
          </TabsTrigger>
          <TabsTrigger
            value="trabajadores"
            className="relative py-2 px-4 text-gray-600 border border-transparent rounded-t-md rounded-b-none
            data-[state=active]:border-gray-300 data-[state=active]:border-b-white data-[state=active]:bg-white 
            data-[state=active]:text-black font-medium"
          >
            Trabajadores
          </TabsTrigger>
        </TabsList>

        <div className="border-b border-gray-300 w-full -mt-[1px]" />

        <TabsContent value="empresa">
          <CompanyTab company={company} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="trabajadores">
          {id && <WorkersTab companyId={id} />}
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
};