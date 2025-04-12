import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DraggableItem } from "../Components";
import { Category, PositionItem } from "../Models";
import { getQuestionBySurveyId, updateQuestionPosition } from "../services";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PositionTabProps {
  surveyId: string;
}

export const PositionTab = ({ surveyId }: PositionTabProps) => {
  const [items, setItems] = useState<PositionItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [version, setVersion] = useState(0); // ✅ Necesario para el control de versiones
  const positionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const originalPositionsRef = useRef<Record<string, number>>({});

  const fetchAndSetQuestions = useCallback(async () => {
    try {
      const data = await getQuestionBySurveyId(surveyId);
      const allQuestions: PositionItem[] = [];

      (data.questions as Category[]).forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          subcategory.questions.forEach((question) => {
            allQuestions.push({
              id: question.id,
              label: question.text,
              position: question.position ?? 0,
              category: category.name,
              subcategory: subcategory.name,
              options: question.options.map((option) => ({
                name: option.text,
                value: option.weight,
              })),
            });
            originalPositionsRef.current[question.id] = question.position ?? 0;
          });
        });
      });

      setItems(allQuestions);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
      toast.error("Error al obtener preguntas.");
    }
  }, [surveyId]);

  useEffect(() => {
    fetchAndSetQuestions();
  }, [fetchAndSetQuestions, version]); // 🔄 Se vuelve a ejecutar al cambiar `version`

  const handleDrop = useCallback(
    (sourceId: string, targetPosition: number) => {
      const sourceItem = items.find((i) => i.id === sourceId);
      const targetItem = items.find((i) => i.position === targetPosition);

      if (!sourceItem) return;

      setItems((prev) =>
        prev.map((item) => {
          if (item.id === sourceId) {
            return { ...item, position: targetPosition };
          }
          if (targetItem && item.id === targetItem.id) {
            return { ...item, position: sourceItem.position };
          }
          return item;
        })
      );
    },
    [items]
  );

  const groupedByPosition = items.reduce<Record<number, PositionItem>>(
    (acc, item) => {
      acc[item.position] = item;
      return acc;
    },
    {}
  );

  const sortedPositions = Object.keys(groupedByPosition)
    .map(Number)
    .sort((a, b) => a - b);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    sortedPositions.forEach((pos) => {
      const el = positionRefs.current[pos];
      if (!el) return;

      const cleanup = dropTargetForElements({
        element: el,
        getData: () => ({ position: pos }),
        onDrop: ({ source }) => {
          const sourceId = source.data.id as string;
          handleDrop(sourceId, pos);
        },
      });

      cleanups.push(cleanup);
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [sortedPositions, items, handleDrop]);

  const changedItems = useMemo(() => {
    return items.filter(
      (item) => item.position !== originalPositionsRef.current[item.id]
    );
  }, [items]);

  const hasChanges = changedItems.length > 0;

  const handleUpdatePositions = async () => {
    try {
      for (const item of changedItems) {
        await updateQuestionPosition(item.id, item.position);
      }

      const updatedPositions: Record<string, number> = {};
      items.forEach((item) => {
        updatedPositions[item.id] = item.position;
      });
      originalPositionsRef.current = updatedPositions;

      toast.success("Posiciones actualizadas correctamente.");
      setVersion((prev) => prev + 1); // ✅ Aumentamos versión para refetch
    } catch (error) {
      console.error("Error al actualizar posiciones:", error);
      toast.error("Error al actualizar posiciones.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Gestión de Posiciones</h2>
          <p className="text-sm text-gray-500">
            Arrastra preguntas para intercambiar posiciones.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {hasChanges && (
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                Actualizar posiciones
              </Button>
            </DialogTrigger>
          )}

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmación</DialogTitle>
              <DialogDescription>
                Estas son las posiciones que se van a modificar:
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-64 overflow-y-auto my-4 space-y-2">
              {changedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2 border rounded bg-slate-100 text-sm"
                >
                  <strong>{item.label}</strong>
                  <div>
                    De: {originalPositionsRef.current[item.id]} → A:{" "}
                    {item.position}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.category} / {item.subcategory}
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <DialogClose
                onClick={() => setIsDialogOpen(false)}
                className="mr-2"
              >
                Cancelar
              </DialogClose>
              <Button
                onClick={async () => {
                  await handleUpdatePositions();
                  setIsDialogOpen(false);
                }}
                variant="secondary"
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {sortedPositions.map((position) => {
          const item = groupedByPosition[position];
          if (!item) return null;

          return (
            <div
              key={position}
              ref={(el) => (positionRefs.current[position] = el)}
              className="border-2 border-gray-300 rounded-lg p-4 bg-slate-50 min-h-[120px]"
            >
              <h3 className="text-sm font-bold text-slate-700 mb-3">
                Capa posición {position}
              </h3>
              <DraggableItem
                item={item}
                onDrop={() => {}}
                surveyId={surveyId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
