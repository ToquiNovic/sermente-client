import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { loadTemplateHeaders, processExcelFile } from "../utils/excelValidation";
import ExcelPreviewModal from "../components/ExcelPreviewModal";

export const PlaceholderWorkerList = ({ companyId }: { companyId: string }) => {
  const [expectedHeaders, setExpectedHeaders] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [excelData, setExcelData] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    const fetchHeaders = async () => {
      const headers = await loadTemplateHeaders();
      setExpectedHeaders(headers);
    };
    fetchHeaders();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        processExcelFile(
          file,
          expectedHeaders,
          (formattedData) => {
            console.log("Datos cargados:", formattedData);
            setExcelData(formattedData);
            setIsModalOpen(true);
            toast.success("Archivo cargado correctamente");
          },
          () => {
            toast.error("Error al procesar el archivo");
          }
        );
      }
    },
    [expectedHeaders]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
    maxFiles: 1,
  });

  return (
    <>
      {/* Dropzone */}
      <Card
        {...getRootProps()}
        className="h-[66vh] flex flex-col items-center justify-center border-dashed border-2 border-gray-300 cursor-pointer p-6 text-center"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Suelta los archivos aquí...</p>
        ) : (
          <p className="text-gray-500">Arrastra y suelta archivos aquí o haz clic para subir</p>
        )}
      </Card>

      {/* Modal de vista previa */}
      <ExcelPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={excelData}
        headers={expectedHeaders}
        companyId={companyId}
      />
    </>
  );
};
