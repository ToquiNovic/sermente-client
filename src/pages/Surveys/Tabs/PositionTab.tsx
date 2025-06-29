import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DraggableItem } from "../Components";
import { FactorGroup, PositionItem } from "../Models";
import { FactorForQuestion } from "../types";
import { getQuestionBySurveyId, updateQuestionPosition } from "../services";
import { useFactorColors } from "../utils/colorRamdon";
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
  const [version, setVersion] = useState(0);
  const positionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const originalPositionsRef = useRef<Record<string, number>>({});
  const [groupedItems, setGroupedItems] = useState<FactorGroup[]>([]);

  const factorColorMap = useFactorColors(groupedItems);

  const fetchAndSetQuestions = useCallback(async () => {
    try {
      const data = await getQuestionBySurveyId(surveyId);
      const allGrouped: FactorGroup[] = [];

      const orderedFactors = [...(data.questions as FactorForQuestion[])].sort(
        (a, b) => a.position - b.position
      );

      orderedFactors.forEach((factor) => {
        const factorQuestions: PositionItem[] = [];

        factor.domains?.forEach((domain) => {
          domain.dimensions?.forEach((dimension) => {
            const orderedQuestions = [...(dimension.questions ?? [])].sort(
              (a, b) => a.position - b.position
            );

            orderedQuestions.forEach((question) => {
              factorQuestions.push({
                id: question.id,
                label: question.text,
                position: question.position ?? 0,
                domains: domain.name,
                dimension: dimension.name,
                options:
                  question.options?.map((option) => ({
                    text: option.text,
                    weight: option.weight,
                  })) ?? [],
              });

              originalPositionsRef.current[question.id] =
                question.position ?? 0;
            });
          });
        });

        allGrouped.push({
          id: factor.id!,
          name: factor.name,
          position: factor.position,
          questions: factorQuestions,
        });
      });

      setGroupedItems(allGrouped);
      // Flatten all questions from all groups into a single array
      const flatQuestions = allGrouped.flatMap((group) => group.questions);
      setItems(flatQuestions);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
      toast.error("Error al obtener preguntas.");
    }
  }, [surveyId]);

  useEffect(() => {
    fetchAndSetQuestions();
  }, [fetchAndSetQuestions, version]);

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
      setVersion((prev) => prev + 1);
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
                    {item.domains} / {item.dimension}
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

      <div className="space-y-10">
        {groupedItems.map((factor) => (
          <div
            key={factor.id}
            className={`border rounded-lg p-4 shadow-sm ${
              factorColorMap[factor.id]
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">
              Factor Nº {factor.position} - {factor.name}
            </h2>

            <div className="space-y-4">
              {factor.questions
                .sort((a, b) => a.position - b.position)
                .map((item) => (
                  <div
                    key={item.id}
                    ref={(el) => (positionRefs.current[item.position] = el)}
                    className="border border-gray-300 rounded p-3 bg-slate-50"
                  >
                    <h3 className="text-sm font-medium mb-1">
                      Posición Nº {item.position} - {item.label}
                    </h3>
                    <DraggableItem
                      item={item}
                      onDrop={() => {}}
                      surveyId={surveyId}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
