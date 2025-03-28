// components/ExcelPreviewModal.tsx
import { useState } from "react";
import { toast } from "sonner";
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
import { assignUsersToCompany } from "../services";

interface ExcelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, string>[];
  headers: string[];
  companyId: string;
}

const ExcelPreviewModal: React.FC<ExcelPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  headers,
  companyId,
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const formattedData = data.map((row) => ({
        email: row["CORREO ELECTRÓNICO"]?.trim() || "",
        names: row["NOMBRES"]?.trim() || "",
        surNames: row["APELLIDOS"]?.trim() || "",
        numberDoc: String(row["N° de IDENTIFICACIÓN"] || "").trim(),
        dependency: row["DEPENDENCIA"]?.trim() || "",
        phone: row["TELEFONO"]?.trim() || "",
        positionCompany: row["CARGO"]?.trim() || "",
        contractType: row["TIPO DE VINCULACIÓN"]?.trim() || "",
        hierarchyOfEmployment: row["NIVEL JERARQUICO DEL EMPLEO"]?.trim() || "",
      }));

      // Filtrar filas vacías
      const filteredData = formattedData.filter((row) =>
        Object.values(row).some((value) => value?.trim() !== "")
      );

      if (filteredData.length === 0) {
        toast.error("No hay datos válidos para asignar.");
        setLoading(false);
        return;
      }

      console.log("Datos a enviar:", filteredData);

      await assignUsersToCompany(companyId, {
        users: filteredData,
      });
      toast.success(`Usuarios asignados a la empresa correctamente.`);
      setConfirmDialogOpen(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al asignar los usuarios.");
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
