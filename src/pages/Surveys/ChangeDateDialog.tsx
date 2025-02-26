import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateSurvey } from "./services";
import { toast } from "sonner";
import { UpdateSurveyData } from "@/models";

interface ChangeDateDialogProps {
  open: boolean;
  onClose: () => void;
  surveyId: string;
  onDateUpdated: (newDate: string) => void;
}

const ChangeDateDialog: React.FC<ChangeDateDialogProps> = ({ open, onClose, surveyId, onDateUpdated }) => {
  const [newDate, setNewDate] = useState("");

  const handleConfirm = async () => {
    try {
      const updatedSurvey: UpdateSurveyData = { id: surveyId, deadline: newDate };
      await updateSurvey(updatedSurvey);
      toast.success("Fecha actualizada correctamente.");
      onDateUpdated(newDate);
      onClose();
    } catch {
      toast.error("Error al actualizar la fecha.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="change-date-description">
        <DialogHeader>
          <DialogTitle>Cambiar Fecha y Hora de la Encuesta</DialogTitle>
          <DialogDescription>
            Selecciona una nueva fecha y hora para la encuesta.
          </DialogDescription>
        </DialogHeader>
        <input
          type="datetime-local"
          className="border p-2 rounded w-full"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeDateDialog;
