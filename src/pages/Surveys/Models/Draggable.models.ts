// /models/Draggable.models.ts
import { Category } from "./category.models";

export interface PositionItem {
  id: string;
  label: string;
  position: number;
  category: string;
  subcategory: string;
  options?: { name: string; value: number }[];
}

export interface DraggableItemProps {
  item: PositionItem;
  onDrop: (sourceId: string, targetId: string) => void;
  surveyId: string;
}

export interface QuestionResponse {
  message: string;
  questions: Category[];
}
