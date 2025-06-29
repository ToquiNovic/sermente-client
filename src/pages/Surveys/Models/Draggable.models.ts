// /models/Draggable.models.ts
import { Category } from "./category.models";
import { Option } from "../types";

export interface PositionItem {
  id: string;
  label: string;
  position: number;
  domains: string;
  dimension: string;
  options?: Option[];
}

export interface FactorGroup {
  id: string;
  name: string;
  position: number;
  questions: PositionItem[];
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
