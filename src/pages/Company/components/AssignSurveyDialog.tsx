import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WorkerTableData } from "@/models";
import { DatePicker } from "@/components/DatePicker";
import { useForm } from "react-hook-form";
import { assignUsersToSurvey } from "../services/userCompany.service";

interface AssignSurveyDialogProps {
  companyId: string;
  open: boolean;
  onClose: () => void;
  workers: WorkerTableData[];
}

interface FormValues {
  loadDate: string;
  loadTime: string;
}

export const AssignSurveyDialog = ({
  companyId,
  open,
  onClose,
  workers,
}: AssignSurveyDialogProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      loadDate: "",
      loadTime: "",
    },
  });

  const { watch, control } = form;

  const loadDate = watch("loadDate");
  const loadTime = watch("loadTime");

  const deadline =
    loadDate && loadTime
      ? new Date(
          parseInt(loadDate.split("-")[0]),
          parseInt(loadDate.split("-")[1]) - 1,
          parseInt(loadDate.split("-")[2]),
          parseInt(loadTime.split(":")[0]),
          parseInt(loadTime.split(":")[1])
        )
      : loadDate
      ? new Date(loadDate)
      : undefined;

  // calcular tiempo restante
  const getTimeRemaining = (target: Date) => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return "⏰ La fecha ya pasó";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} día${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`);

    return `Faltan ${parts.join(", ")}`;
  };

  const handleCreateAssignment = async () => {
    if (!deadline) return;

    try {
      setLoading(true);

      const formattedDeadline = deadline.toISOString().split("T")[0];

      await assignUsersToSurvey(companyId, {
        users: workers.map((w) => ({ id: w.id })),
        deadline: formattedDeadline,
      });

      onClose();
    } catch (error) {
      console.error("Error creando la asignación:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => {
          if (
            e.target instanceof Element &&
            e.target.closest("[data-calendar]")
          ) {
            e.preventDefault();
            e.stopPropagation();
          } else {
            onClose();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Asignar encuesta</DialogTitle>
          <DialogDescription>
            {workers.length === 1
              ? `Asignar encuesta al trabajador con documento: ${workers[0].numberDoc}`
              : `Asignar encuesta a ${workers.length} trabajadores seleccionados.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mt-4">
          <DatePicker
            name="loadDate"
            label="Fecha Cargue"
            labelHour="Hora"
            control={control}
            readOnly={false}
          />
        </div>

        {deadline && (
          <div className="mt-3 px-1 space-y-1">
            <p className="text-sm text-muted-foreground">
              📅 Seleccionaste:{" "}
              <span className="font-medium">
                {deadline.toLocaleString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
            <p className="text-sm text-emerald-600 font-medium">
              ⏳ {getTimeRemaining(deadline)}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateAssignment}
            disabled={!deadline || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
