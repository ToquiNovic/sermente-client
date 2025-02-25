// pages/User/DataTable/ActionsCell.tsx
import { MoreHorizontal, Check } from "lucide-react";
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
import { deleteUser } from "../service";
import { UserTableData, UserState } from "@/models";
import { ToastAction } from "@/components/ui/toast";

const STATES: { key: UserState; label: string }[] = [
  { key: UserState.ACTIVE, label: "Activo" },
  { key: UserState.INACTIVE, label: "Inactivo" },
  { key: UserState.SUSPENDED, label: "Suspendido" },
];

const ActionsCell = ({
  user,
  onUserDeleted,
  onUserStateChange,
}: {
  user: UserTableData;
  onUserDeleted: (id: string) => void;
  onUserStateChange: (userId: string, newState: UserState) => void;
}) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    toast({
      title: `¿Eliminar el usuario "${user.numberDoc}"?`,
      description: "Esta acción no se puede deshacer.",
      action: (
        <ToastAction
          altText="Aceptar"
          onClick={async () => {
            try {
              await deleteUser(user.id);
              toast({
                title: "Usuario eliminado",
                description: `El usuario "${user.numberDoc}" ha sido eliminado.`,
                variant: "destructive",
              });
              onUserDeleted(user.id);
            } catch (error) {
              toast({
                title: "Error al eliminar",
                description: error instanceof Error ? error.message : "Error desconocido.",
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

  const handleStateChange = async (newState: UserTableData["state"]) => {
    if (newState === user.state) return;
    try {
      await onUserStateChange(user.id, newState);
    } catch (error) {
      console.error("❌ Error al actualizar el estado:", error);
    }
  };   

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir Menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
        {STATES.map(({ key, label }) => (
          <DropdownMenuItem key={key} onClick={() => handleStateChange(key)}>
            {label}
            {user.state === key && <Check className="ml-auto h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;
