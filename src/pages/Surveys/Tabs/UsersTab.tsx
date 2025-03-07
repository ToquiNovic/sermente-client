import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, UserPlus } from "lucide-react";
import { downloadFile } from "@/pages/Surveys/utils/downloadFile";
import UploadUsersDrawer from "@/pages/Surveys/components/UploadUsersDrawer";

const UsersTab = () => {
  const plantillaPath = "/serMente_cargar_trabajadores.xlsx";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hover:bg-gray-100">Opciones</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <UploadUsersDrawer />
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-gray-100 flex items-center gap-2"
              onClick={() => downloadFile(plantillaPath, "serMente_cargar_trabajadores.xlsx")}
            >
              <Download className="h-4 w-4" />
              Descargar Plantilla (Excel)
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Agregar Encuestado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-6">
        <p className="text-gray-500">Aquí aparecerá la tabla de usuarios.</p>
      </div>
    </div>
  );
};

export default UsersTab;
