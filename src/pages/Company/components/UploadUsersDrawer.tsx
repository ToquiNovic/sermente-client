// components/UploadUsersDrawer.tsx
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Upload, File } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import ExcelPreviewModal from "./ExcelPreviewModal";
import { loadTemplateHeaders, processExcelFile } from "../utils/excelValidation";

interface UploadUsersDrawerProps {
  companyId: string;
}

export const UploadUsersDrawer: React.FC<UploadUsersDrawerProps> = ({ companyId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expectedHeaders, setExpectedHeaders] = useState<string[]>([]);

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
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);

        processExcelFile(
          selectedFile,
          expectedHeaders,
          (formattedData) => {
            setPreviewData(formattedData);
            setIsModalOpen(true);
            setIsOpen(false);
          },
          () => setFile(null)
        );
      }
    },
    [expectedHeaders]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
    maxFiles: 1,
  });

  if (fileRejections.length > 0) {
    toast.error("Solo se permiten archivos .xlsx.");
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost">
            <Upload className="h-4 w-4" />
            Cargar Usuarios (Excel)
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Subir Archivo de Usuarios</DrawerTitle>
            <DrawerDescription>
              Arrastra y suelta un archivo Excel o selecciónalo manualmente.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 text-center rounded-md cursor-pointer transition ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <p className="text-green-600 flex items-center justify-center">
                  <File className="mr-2 h-5 w-5" /> {file.name}
                </p>
              ) : (
                <p className="text-gray-500">Arrastra y suelta un archivo aquí o haz clic para seleccionarlo</p>
              )}
            </div>

            <Button
              onClick={() => {
                const fileInput = document.querySelector("input[type='file']") as HTMLInputElement | null;
                fileInput?.click();
              }}
              className="w-full mt-4"
            >
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar Archivo
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <ExcelPreviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={previewData} headers={expectedHeaders} companyId={companyId} />
    </>
  );
};
