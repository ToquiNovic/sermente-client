// utils/excelValidation.ts
import * as XLSX from "xlsx";
import { toast } from "sonner";

/**
 * Carga los encabezados de la plantilla desde un archivo de Excel.
 */
export const loadTemplateHeaders = async (): Promise<string[]> => {
  try {
    const response = await fetch("/serMente_cargar_trabajadores.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
    return jsonData.length > 0 ? jsonData[0].map((header) => header.trim()) : [];
  } catch (error) {
    console.error("Error al cargar la plantilla:", error);
    toast.error("Error al cargar la plantilla.");
    return [];
  }
};

/**
 * Valida si los encabezados del archivo coinciden con los esperados.
 */
export const validateHeaders = (headers: string[], expectedHeaders: string[]): boolean => {
  return expectedHeaders.length > 0 && expectedHeaders.every((header) => headers.includes(header));
};

/**
 * Procesa el archivo Excel y devuelve los datos formateados.
 */
export const processExcelFile = (
  file: File,
  expectedHeaders: string[],
  onSuccess: (data: Record<string, string>[]) => void,
  onError: () => void
) => {
  const reader = new FileReader();
  reader.readAsBinaryString(file);

  reader.onload = (event) => {
    const data = event.target?.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

    if (jsonData.length === 0) {
      toast.error("El archivo está vacío.");
      onError();
      return;
    }

    const headers = jsonData[0].map((header) => header.trim());
    if (!validateHeaders(headers, expectedHeaders)) {
      toast.error("Los encabezados del archivo no coinciden con la plantilla.");
      onError();
      return;
    }

    const formattedData = jsonData.slice(1).map((row) => {
      return headers.reduce((acc, key, index) => {
        acc[key] = row[index] || "";
        return acc;
      }, {} as Record<string, string>);
    });

    onSuccess(formattedData);
  };

  reader.onerror = () => {
    toast.error("Error al leer el archivo.");
    onError();
  };
};
