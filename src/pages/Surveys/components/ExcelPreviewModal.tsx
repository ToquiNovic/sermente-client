import { useState } from "react";
import { toast } from "sonner";
import { postSurveyAssignment } from "../services"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ExcelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, string>[];
  headers: string[];
}

const ExcelPreviewModal: React.FC<ExcelPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  headers,
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const formattedData = data.map((row) => ({
        survey: row["Encuesta"] ?? "",
        names: row["Nombres"] ?? "",
        surNames: row["Apellidos"] ?? "",
        dependency: row["Dependencia"] ?? "",
        position: row["Cargo"] ?? "",
        email: row["Correo"] ?? "",
        phone: row["Teléfono"] ?? "",
        document: row["Documento"] ?? "",
        positionCompany: row["Puesto Empresa"] ?? "",  
        numberDoc: row["Número Documento"] ?? "", 
        contractType: row["Tipo Contrato"] ?? "", 
        hierarchyOfEmployment: row["Jerarquía Laboral"] ?? "", 
      }));

      console.log('Datos a enviar:', formattedData);
  
      await postSurveyAssignment(formattedData);
      toast.success(`Encuesta asignada a ${formattedData.length} trabajadores.`);
      setConfirmDialogOpen(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al asignar la encuesta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Vista Previa del Archivo</DialogTitle>
          <DialogDescription>
            Revisa los datos antes de continuar con la importación.
          </DialogDescription>
        </DialogHeader>

        <div className="border border-gray-300 rounded-md overflow-hidden flex flex-col">
          <ScrollArea>
            <div className="min-w-max">
              <Table className="border-collapse w-full">
                <TableHeader className="bg-gray-200 sticky top-0 z-10">
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead
                        key={index}
                        className="px-4 py-2 text-left whitespace-nowrap"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className="odd:bg-white even:bg-gray-100"
                    >
                      {headers.map((header, colIndex) => (
                        <TableCell
                          key={colIndex}
                          className="px-4 py-2 text-left whitespace-nowrap"
                        >
                          {row[header] ?? ""}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <DialogFooter className="flex justify-between mt-4">
          <Button
            variant="secondary"
            onClick={() => setConfirmDialogOpen(true)}
          >
            Cargar
          </Button>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>

      {/* Diálogo de Confirmación */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Asignación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de asignar la encuesta a {data.length} trabajadores?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? "Asignando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ExcelPreviewModal;
