import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Pencil, Trash2 } from "lucide-react";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { tooltips } from "../utils/tooltips";
import { useEffect, useState } from "react";
import {  Option } from "../types";

interface MultipleChoiceOptionsProps {
  options: Option[];
  updateOption: (
    index: number,
    field: "name" | "value",
    weight: string | number
  ) => void;
  deleteOption: (index: number) => void;
  isMultipleChoice: boolean;
  inputsDisabled: boolean;
  isLoading: boolean;
  addOption: () => void;
}

export const MultipleChoiceOptions = ({
  options,
  updateOption,
  deleteOption,
  isMultipleChoice,
  inputsDisabled,
  isLoading,
  addOption,
}: MultipleChoiceOptionsProps) => {
  const [originalOptions, setOriginalOptions] = useState<Option[]>([]);

  useEffect(() => {
    // Solo actualiza originalOptions si la longitud de options cambia
    if (options.length !== originalOptions.length) {
      setOriginalOptions([...options]);
    }
  }, [options, originalOptions.length]);

  const hasChanged = (index: number) => {
    const original = originalOptions[index];
    const current = options[index];
    if (!original || !current) return false;
    return (
      original.text.toLowerCase() !== current.text.toLowerCase() ||
      original.weight !== current.weight
    );
  };

  // Función para revertir los cambios de una opción a su estado original
  const revertOption = (index: number) => {
    const original = originalOptions[index];
    if (original) {
      updateOption(index, "name", original.text);
      updateOption(index, "value", original.weight);
    }
  };

  const defaultOptionOrder = [
    "siempre",
    "casi siempre",
    "algunas veces",
    "casi nunca",
    "nunca",
  ];

  // Verifica si las opciones actuales coinciden exactamente con el orden predeterminado
  const isDefaultOrder = () => {
    const currentNames = options.map((opt) => opt.text.toLowerCase());
    return (
      currentNames.length === defaultOptionOrder.length &&
      currentNames.every((name, index) => name === defaultOptionOrder[index])
    );
  };

  // Ordena solo si las opciones coinciden con el orden predeterminado
  const sortedOptions = isDefaultOrder()
    ? [...options].sort((a, b) => {
        const aIndex = defaultOptionOrder.indexOf(a.text.toLowerCase());
        const bIndex = defaultOptionOrder.indexOf(b.text.toLowerCase());

        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.text.localeCompare(b.text);
      })
    : options;

  return (
    <>
      {isMultipleChoice && (
        <div className="space-y-2">
          <Label>Opciones</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Lista de opciones"
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltips.options}</p>
            </TooltipContent>
          </Tooltip>
          <div className="grid grid-cols-1 gap-4">
            {sortedOptions.map((option, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center"
              >
                <Input
                  placeholder="Nombre"
                  value={option.text}
                  onChange={(e) => updateOption(index, "name", e.target.value)}
                  disabled={inputsDisabled || isLoading}
                />
                <Input
                  type="number"
                  placeholder="Valor"
                  value={option.weight}
                  onChange={(e) =>
                    updateOption(index, "value", Number(e.target.value))
                  }
                  disabled={inputsDisabled || isLoading}
                />

                {/* Edit icon if changed */}
                {hasChanged(index) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => revertOption(index)} // Acción para revertir cambios
                        disabled={inputsDisabled || isLoading} // Desactiva solo si inputsDisabled o isLoading
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Revertir cambios</TooltipContent>
                  </Tooltip>
                )}

                {/* Delete icon */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteOption(index)}
                      disabled={inputsDisabled || isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Eliminar opción</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>

          {/* Botón para agregar una opción */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={addOption}
            disabled={inputsDisabled || isLoading}
          >
            Agregar opción
          </Button>
        </div>
      )}
    </>
  );
};
