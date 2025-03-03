import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
            {/* Contenedor con scroll horizontal y vertical */}
            <ScrollArea>
              <div className="min-w-max">
                <Table className="border-collapse w-full">
                  {/* Encabezado fijo */}
                  <TableHeader className="bg-gray-200 sticky top-0 z-10">
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead key={index} className="px-4 py-2 text-left whitespace-nowrap">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  {/* Cuerpo de la tabla */}
                  <TableBody>
                    {data.map((row, rowIndex) => (
                      <TableRow key={rowIndex} className="odd:bg-white even:bg-gray-100">
                        {headers.map((header, colIndex) => (
                          <TableCell key={colIndex} className="px-4 py-2 text-left whitespace-nowrap">
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
  
          <div className="flex justify-end mt-4">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ExcelPreviewModal;
  