import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks"; 
import { updateRoleState, deleteRole } from "../service";
import { RoleTableData } from "@/models";
import { ToastAction } from "@/components/ui/toast";

const ActionsCell = ({ 
    role, 
    onRoleDeleted, 
    onRoleUpdated 
  }: { 
    role: RoleTableData; 
    onRoleDeleted: (id: string) => void;
    onRoleUpdated: (updatedRole: RoleTableData) => void; 
  }) => { 
  
  const { toast } = useToast();

  const handleDelete = async () => {
    toast({
      title: `¿Eliminar el rol "${role.name}"?`,
      description: "Esta acción no se puede deshacer.",
      action: (
        <ToastAction
          altText="Aceptar"
          onClick={async () => {
            try {
              await deleteRole(role.id);
              toast({
                title: "Rol eliminado",
                description: `El rol "${role.name}" ha sido eliminado.`,
                variant: "destructive",
              });
              onRoleDeleted(role.id);
            } catch (error) {
              let errorMessage = "Ocurrió un error al eliminar el rol.";
              if (error instanceof Error) {
                errorMessage = error.message;
              }
              toast({
                title: "Error al eliminar",
                description: errorMessage,
                variant: "destructive",
              });
            }
          }}
        >
          Aceptar
        </ToastAction>
      ),
    });
  };

  const handleToggleState = async () => {
    try {
      const updatedRole = { ...role, state: !role.state };
      await updateRoleState(role.id, updatedRole.state);
      
      toast({
        title: "Estado actualizado",
        description: `El rol ahora está ${updatedRole.state ? "Activo" : "Inactivo"}.`,
      });

      // Actualizar la tabla
      onRoleUpdated(updatedRole);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el estado.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir Menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleToggleState}>
          {role.state ? "Desactivar" : "Activar"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;
