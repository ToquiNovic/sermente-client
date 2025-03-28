// components/UploadUsersDrawer.tsx
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Upload, File } from "lucide-react";
import { toast } from "sonner";
import ExcelPreviewModal from "./ExcelPreviewModal";

export const UploadUsersDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expectedHeaders, setExpectedHeaders] = useState<string[]>([]);

  useEffect(() => {
    const loadTemplateHeaders = async () => {
      try {
        const response = await fetch("/serMente_cargar_trabajadores.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        if (jsonData.length > 0) {
          setExpectedHeaders(jsonData[0].map((header) => header.trim()));
        }
      } catch (error) {
        console.error("Error al cargar la plantilla:", error);
        toast.error("Error al cargar la plantilla.");
      }      
    };

    loadTemplateHeaders();
  }, []);

  const validateHeaders = useCallback(
    (headers: string[]) => {
      return expectedHeaders.length > 0 && expectedHeaders.every((header) => headers.includes(header));
    },
    [expectedHeaders]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
  
        const reader = new FileReader();
        reader.readAsBinaryString(selectedFile);
  
        reader.onload = (event) => {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
  
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
          if (jsonData.length === 0) {
            toast.error("El archivo está vacío.");
            setFile(null);
            return;
          }
  
          const headers = jsonData[0].map((header) => header.trim());
          if (!validateHeaders(headers)) {
            toast.error("Los encabezados del archivo no coinciden con la plantilla.");
            setFile(null);
            return;
          }
  
          const formattedData = jsonData.slice(1).map((row) => {
            return headers.reduce((acc, key, index) => {
              acc[key] = row[index] || "";
              return acc;
            }, {} as Record<string, string>);
          });
  
          setPreviewData(formattedData);
          setIsModalOpen(true);
          setIsOpen(false);
        };
  
        reader.onerror = () => {
          toast.error("Error al leer el archivo.");
          setFile(null);
        };
      }
    },
    [validateHeaders]
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

      <ExcelPreviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={previewData} headers={expectedHeaders} />
    </>
  );
};
