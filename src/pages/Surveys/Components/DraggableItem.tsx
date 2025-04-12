import { useEffect, useRef, useCallback } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DraggableItemProps } from "../Models";

const sectionClass = "rounded-md border px-4 py-2 font-mono text-sm shadow-sm";

export const DraggableItem = ({ item, onDrop }: DraggableItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (sourceId: string, targetId: string) => {
      if (sourceId !== targetId) {
        onDrop(sourceId, targetId);
      }
    },
    [onDrop]
  );

  useEffect(() => {
    if (!ref.current) return;

    const cleanupDraggable = draggable({
      element: ref.current,
      getInitialData: () => ({ id: item.id }),
    });

    const cleanupDropTarget = dropTargetForElements({
      element: ref.current,
      getData: () => ({ id: item.id }),
      onDrop: ({ source }) => handleDrop(source.data.id as string, item.id),
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [item.id, handleDrop]);

  return (
    <div
      ref={ref}
      className="p-3 border rounded cursor-move bg-white shadow hover:bg-[#faa0a038]"
    >
      <Collapsible className="w-min[500px] space-y-2">
        <div className="flex items-center justify-between px-4">
          <h4 className="text-sm font-semibold truncate">
            {item.position} - {item.label}
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <div className={sectionClass}>
          <div>Categoría: {item.category}</div>
          <div>Subcategoría: {item.subcategory}</div>
        </div>

        <CollapsibleContent className="space-y-2 px-4">
          <h5 className="text-xs font-medium text-gray-500">Opciones:</h5>
          {item.options?.length === 0 ? (
            <p className="text-sm text-gray-400">No hay opciones.</p>
          ) : (
            <div className="space-y-2">
              {[...(item.options || [])]
                .sort((a, b) => b.value - a.value)
                .map((opt, index) => (
                  <div
                    key={index}
                    className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm"
                  >
                    {opt.name.toUpperCase()} - {opt.value}
                  </div>
                ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
