// /pages/Company/dataTable/actionsCell.tsx
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
import { removeUserFromCompany } from "../services";
import { WorkerTableData } from "@/models";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { AssignSurveyDialog } from "../components";

interface ActionsCellProps {
  companyId: string;
  worker?: WorkerTableData;
  onWorkerDeleted: (id: string) => void;
  onWorkerDetails: (worker: WorkerTableData) => void;
  multipleSelection?: boolean;
  selectedWorkers?: WorkerTableData[];
}

export const ActionsCell = ({
  companyId,
  worker,
  onWorkerDeleted,
  onWorkerDetails,
  multipleSelection = false,
  selectedWorkers = [],
}: ActionsCellProps) => {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogWorkers, setDialogWorkers] = useState<WorkerTableData[]>([]);

  const handleDelete = async () => {
    if (!worker) return;

    toast({
      title: `¿Eliminar el usuario "${worker.numberDoc}"?`,
      description: "Esta acción no se puede deshacer.",
      action: (
        <ToastAction
          altText="Aceptar"
          onClick={async () => {
            try {
              await removeUserFromCompany(worker.id, worker.id);
              toast({
                title: "Usuario eliminado",
                description: `El usuario "${worker.numberDoc}" ha sido eliminado.`,
                variant: "destructive",
              });
              onWorkerDeleted(worker.id);
            } catch (error) {
              toast({
                title: "Error al eliminar",
                description:
                  error instanceof Error ? error.message : "Error desconocido.",
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

  const handleAssign = () => {
    setDialogWorkers(!multipleSelection && worker ? [worker] : selectedWorkers);
    setOpenDialog(true);
  };

  return (
    <>
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
          {!multipleSelection ? (
            <>
              <DropdownMenuItem onClick={() => onWorkerDetails(worker!)}>
                Detalle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAssign}>
                Asignar encuesta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                Eliminar
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={handleAssign}>
                Asignar encuesta
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const ids = selectedWorkers.map((w) => w.id);
                  console.log("Eliminar seleccionados:", ids);
                }}
                className="text-red-600"
              >
                Eliminar seleccionados
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AssignSurveyDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        workers={dialogWorkers}
        companyId={companyId}
      />
    </>
  );
};
