// utils/colorRamdon.tsx
import { useMemo } from "react";

const bgColors = [
  "bg-red-50",
  "bg-blue-50",
  "bg-green-50",
  "bg-yellow-50",
  "bg-purple-50",
  "bg-pink-50",
  "bg-indigo-50",
  "bg-teal-50",
];

interface HasId {
  id: string;
}

export const useFactorColors = <T extends HasId>(items: T[]) => {
  return useMemo(() => {
    const map: Record<string, string> = {};
    items.forEach((item) => {
      const randomIndex = Math.floor(Math.random() * bgColors.length);
      map[item.id] = bgColors[randomIndex];
    });
    return map;
  }, [items]);
};

