import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Settings,
  BarChart3,
  Contact,
  MapPinHouse,
  Phone,
  Mail,
  Building2,
  UsersRound,
} from "lucide-react";
import { getCompanies, deleteCompany } from "./services";
import { useEffect, useState } from "react";
import { Company } from "@/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CompanySurveys } from "./CompanySurveys";
import { ContentLayout } from "@/components/app/sidebar/content-layout";

export const CompanyPage = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState<Company[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectCompany, setSelectCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setdata(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setdata([]);
      }
    };

    fetchCompanies();
  }, []);

  const handleDelete = (company: Company) => {
    setSelectCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectCompany) {
      try {
        await deleteCompany(selectCompany.companyId);
        toast.error(`Se eliminó la empresa "${selectCompany.name}".`);
        setdata((prevData) =>
          prevData.filter((c) => c.id !== selectCompany.id)
        );
      } catch (error) {
        toast.error("Hubo un error al eliminar la empresa.");
        console.error("Error deleting company:", error);
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <ContentLayout title="Empresas">
    <TooltipProvider>
      <div className="w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-x-2">
            <Building2 /> EMPRESAS
          </h1>
          <Button variant="outline" onClick={() => navigate("/company/new")}>
            <Plus className="mr-2 h-4 w-4" /> Nueva
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((company) => (
              <Card
                key={company.id}
                className="shadow-lg rounded-lg relative flex flex-col justify-between h-full"
              >
                <CardHeader className="relative flex flex-col items-center text-center space-y-2">
                  <Avatar
                    style={{ width: "5rem", height: "5rem" }}
                    className="mx-auto"
                  >
                    {company.urlIcon ? (
                      <AvatarImage src={company.urlIcon} alt={company.name} />
                    ) : (
                      <AvatarFallback>
                        {company.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <CardTitle>{company.name.toUpperCase()}</CardTitle>
                  {company.address && (
                    <CardDescription className="flex items-center gap-x-2">
                      <MapPinHouse className="w-4 h-4" />
                      {company.address.toUpperCase()}
                    </CardDescription>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:bg-red-100"
                        onClick={() => handleDelete(company)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Eliminar</TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent className="flex flex-col justify-end flex-grow space-y-2">
                  <div className="flex justify-between text-xs">
                    {company.nitCompany && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="flex items-center gap-x-2 cursor-pointer">
                              <Building2 className="w-4 h-4" />{" "}
                              {company.nitCompany}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>NIT de la empresa</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {company.numberOfEmployees && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="flex items-center gap-x-2 cursor-pointer">
                              <UsersRound className="w-4 h-4" />{" "}
                              {company.numberOfEmployees}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>Número de empleados</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {company.legalAgent && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs flex items-center gap-x-2 cursor-pointer">
                            <Contact className="w-4 h-4" />{" "}
                            {company.legalAgent.toUpperCase()}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>Agente legal</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {company.phone && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs flex items-center gap-x-2 cursor-pointer">
                            <Phone className="w-4 h-4" /> {company.phone}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>Teléfono de contacto</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {company.email && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs flex items-center gap-x-2 cursor-pointer">
                            <Mail className="w-4 h-4" /> {company.email}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>Correo electrónico</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {/* Lista de encuestas */}
                  <CompanySurveys companyId={company.id} />
                </CardContent>

                <CardFooter className="flex justify-between mt-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/company/manage/${company.id}`)
                        }
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Gestionar</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => navigate(`/company/stats/${company.id}`)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ver Estadísticas</TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No hay empresas registradas.</p>
          )}
        </div>
      </div>

      {/* 🔴 Diálogo de Confirmación para Eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará la emresa{" "}
              <b>{selectCompany?.name}</b> de forma permanente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
    </ContentLayout>
  );
};
