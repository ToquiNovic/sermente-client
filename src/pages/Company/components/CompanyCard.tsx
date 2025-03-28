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
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Trash2, Settings, BookOpenText , Contact, MapPinHouse, Phone, Mail, Building2, UsersRound } from "lucide-react";
import { Company } from "@/models";
// import { CompanySurveys } from "../CompanySurveys";

interface CompanyCardProps {
  company: Company;
  onDelete: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-lg rounded-lg relative flex flex-col justify-between h-full">
      <CardHeader className="relative flex flex-col items-center text-center space-y-2">
        <Avatar style={{ width: "5rem", height: "5rem" }} className="mx-auto">
          {company.urlIcon ? (
            <AvatarImage src={company.urlIcon} alt={company.name} />
          ) : (
            <AvatarFallback>{company.name.charAt(0).toUpperCase()}</AvatarFallback>
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
              onClick={() => onDelete(company)}
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="flex items-center gap-x-2 cursor-pointer">
                    <Building2 className="w-4 h-4" /> {company.nitCompany}
                  </p>
                </TooltipTrigger>
                <TooltipContent>NIT de la empresa</TooltipContent>
              </Tooltip>
          )}
          {company.numberOfEmployees && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="flex items-center gap-x-2 cursor-pointer">
                    <UsersRound className="w-4 h-4" /> {company.numberOfEmployees}
                  </p>
                </TooltipTrigger>
                <TooltipContent>Número de empleados</TooltipContent>
              </Tooltip>
          )}
        </div>

        {company.legalAgent && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs flex items-center gap-x-2 cursor-pointer">
                  <Contact className="w-4 h-4" /> {company.legalAgent.toUpperCase()}
                </p>
              </TooltipTrigger>
              <TooltipContent>Agente legal</TooltipContent>
            </Tooltip>
        )}
        {company.phone && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs flex items-center gap-x-2 cursor-pointer">
                  <Phone className="w-4 h-4" /> {company.phone}
                </p>
              </TooltipTrigger>
              <TooltipContent>Teléfono de contacto</TooltipContent>
            </Tooltip>
        )}
        {company.email && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs flex items-center gap-x-2 cursor-pointer">
                  <Mail className="w-4 h-4" /> {company.email}
                </p>
              </TooltipTrigger>
              <TooltipContent>Correo electrónico</TooltipContent>
            </Tooltip>
        )}

        {/* <CompanySurveys companyId={company.id} /> */}
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => navigate(`/company/manage/${company.companyId}`)}>
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Gestionar</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="sm" onClick={() => navigate(`/company/reports/${company.companyId}`)}>
              <BookOpenText  className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ver reportes</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};
