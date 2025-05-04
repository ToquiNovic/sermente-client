// src/pages/Surveys/hooks/useQuestionsTabLogic.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getQuestionsBySubcategoryId,
  getSubcategoriesBySurveyId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../services";
import { Question } from "../Models";
import { AxiosError } from "axios";

// Interfaces
interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  idcategory: string;
  namecategory: string;
  subcategories: Subcategory[];
}

interface Option {
  name: string;
  value: number;
}

// Constantes
const DEFAULT_OPTIONS: Option[] = [
  { name: "Siempre", value: 0 },
  { name: "Casi siempre", value: 0 },
  { name: "Algunas veces", value: 0 },
  { name: "Casi nunca", value: 0 },
  { name: "Nunca", value: 0 },
];

export const useQuestionsTab = (surveyId: string) => {
  // Estados
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );

  const [questionText, setQuestionText] = useState("");
  const [questionPosition, setQuestionPosition] = useState(0);
  const [isMultipleChoice, setIsMultipleChoice] = useState(true);
  const [options, setOptions] = useState<Option[]>(DEFAULT_OPTIONS);
  const [originalQuestion, setOriginalQuestion] = useState<Question | null>(
    null
  );

  const [newRelatedQuestionText, setNewRelatedQuestionText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [areInputsEnabled, setAreInputsEnabled] = useState(false);

  const inputsDisabled = !areInputsEnabled;

  // Cargar categorías al iniciar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getSubcategoriesBySurveyId(surveyId);
        setCategories(data);
      } catch {
        toast.error("Error al cargar categorías");
      }
    };
    loadCategories();
  }, [surveyId]);

  // Reset de formulario
  const resetForm = useCallback(() => {
    setSelectedQuestionId(null);
    setQuestionText("");
    setQuestionPosition(0);
    setIsMultipleChoice(true);
    setOptions(DEFAULT_OPTIONS);
    setOriginalQuestion(null);
    setNewRelatedQuestionText("");
    setAreInputsEnabled(false);
  }, []);

  // Cambiar categoría
  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      const category = categories.find((cat) => cat.idcategory === categoryId);
      setSubcategories(category?.subcategories || []);
      setSelectedSubcategoryId(null);
      setQuestions([]);
      resetForm();
    },
    [categories, resetForm]
  );

  // Cambiar subcategoría
  const handleSubcategoryChange = useCallback(
    async (subcategoryId: string) => {
      setSelectedSubcategoryId(subcategoryId);
      try {
        const { questions } = await getQuestionsBySubcategoryId(subcategoryId);
        setQuestions(Array.isArray(questions) ? questions : []);
      } catch {
        toast.error("Error al cargar preguntas");
        setQuestions([]);
      }
      resetForm();
    },
    [resetForm]
  );

  // Seleccionar una pregunta
  const handleQuestionSelect = useCallback(
    (questionId: string) => {
      setSelectedQuestionId(questionId);
      const selected = questions.find((q) => q.id === questionId);
      if (!selected) return;

      setQuestionText(selected.text);
      setQuestionPosition(selected.position || 0);
      setIsMultipleChoice(selected.isMultipleChoice ?? true);
      setOptions(
        selected.options?.length
          ? selected.options.map((opt) => ({
              name: opt.text,
              value: opt.weight,
            }))
          : DEFAULT_OPTIONS
      );
      setOriginalQuestion({ ...selected, options: selected.options || [] });
      setAreInputsEnabled(true);
    },
    [questions]
  );

  // Filtro de preguntas
  const filteredQuestions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return questions.filter(
      (q) =>
        q.text?.toLowerCase().includes(term) ||
        q.position?.toString().includes(term)
    );
  }, [questions, searchTerm]);

  // Actualizar una opción
  const updateOption = useCallback(
    (index: number, field: "name" | "value", value: string | number) => {
      setOptions((prev) =>
        prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
      );
    },
    []
  );

  const addOption = () => {
    setOptions((prevOptions) => [
      ...prevOptions,
      { name: "", value: 0 }, // Opción vacía
    ]);
  };

  // Eliminar una opción
  const deleteOption = useCallback((index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const enableInputs = useCallback(() => setAreInputsEnabled(true), []);

  // Verificar si hay cambios
  const hasChanges = useMemo(() => {
    if (!originalQuestion) return false;
    const originalOptions = originalQuestion.options?.map((opt) => ({
      text: opt.text,
      weight: opt.weight,
    }));
    const currentOptions = options.map((opt) => ({
      text: opt.name,
      weight: opt.value,
    }));

    return (
      originalQuestion.text !== questionText ||
      originalQuestion.position !== questionPosition ||
      originalQuestion.isMultipleChoice !== isMultipleChoice ||
      JSON.stringify(originalOptions) !== JSON.stringify(currentOptions)
    );
  }, [
    originalQuestion,
    questionText,
    questionPosition,
    isMultipleChoice,
    options,
  ]);

  const handleCreate = useCallback(async () => {
    if (!selectedCategoryId || !selectedSubcategoryId) {
      toast.error("Selecciona una categoría y subcategoría");
      return;
    }
    if (!questionText.trim()) {
      toast.error("Escribe el texto de la pregunta");
      return;
    }

    setIsLoading(true);
    let relatedId = selectedQuestionId;

    if (!relatedId && newRelatedQuestionText.trim()) {
      const related: Question = {
        id: crypto.randomUUID(),
        text: newRelatedQuestionText,
        position: 0,
        isMultipleChoice: false,
        options: [],
      };
      setQuestions((prev) => [...prev, related]);
      relatedId = related.id;
    }

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: questionText,
      position: questionPosition,
      isMultipleChoice,
      options: isMultipleChoice
        ? options.map((opt) => ({ text: opt.name, weight: Number(opt.value) }))
        : [],
    };

    try {
      const response = await createQuestion(selectedSubcategoryId, newQuestion);
      if (response && response.message === "Pregunta creada con éxito") {
        setQuestions((prev) => [...prev, response.question]);
        toast.success("Pregunta creada");
        resetForm();
      } else {
        toast.error("Error inesperado al crear la pregunta");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Error al crear pregunta");
        console.error("Error al crear pregunta:", error.message);
      } else if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "Error desconocido";
        toast.error(errorMessage);
        console.error("Error al crear pregunta:", errorMessage);
      } else {
        toast.error("Error de conexión o desconocido");
        console.error("Error de conexión o desconocido:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedCategoryId,
    selectedSubcategoryId,
    selectedQuestionId,
    newRelatedQuestionText,
    questionText,
    questionPosition,
    isMultipleChoice,
    options,
    resetForm,
  ]);

  // Actualizar pregunta
  const handleUpdate = useCallback(async () => {
    if (!selectedQuestionId || !questionText.trim()) {
      toast.error("Selecciona una pregunta y escribe el texto");
      return;
    }

    setIsLoading(true);
    const updated: Question = {
      id: selectedQuestionId,
      text: questionText,
      position: questionPosition,
      isMultipleChoice,
      options: isMultipleChoice
        ? options.map((opt) => ({ text: opt.name, weight: Number(opt.value) }))
        : [],
    };

    try {
      await updateQuestion(selectedQuestionId, updated);
      setQuestions((prev) =>
        prev.map((q) => (q.id === selectedQuestionId ? updated : q))
      );
      setOriginalQuestion(updated);
      toast.success("Pregunta actualizada");
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedQuestionId,
    questionText,
    questionPosition,
    isMultipleChoice,
    options,
  ]);

  // Eliminar pregunta
  const handleDelete = useCallback(async () => {
    if (!selectedQuestionId) return;
    setIsLoading(true);
    try {
      await deleteQuestion(selectedQuestionId);
      setQuestions((prev) => prev.filter((q) => q.id !== selectedQuestionId));
      toast.success("Pregunta eliminada");
      resetForm();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setIsLoading(false);
    }
  }, [selectedQuestionId, resetForm]);

  return {
    categories,
    selectedCategoryId,
    subcategories,
    selectedSubcategoryId,
    questions,
    filteredQuestions,
    selectedQuestionId,
    questionText,
    questionPosition,
    isMultipleChoice,
    options,
    searchTerm,
    newRelatedQuestionText,
    isLoading,
    inputsDisabled,
    hasChanges,
    originalQuestion,
    addOption,
    setQuestionText,
    setQuestionPosition,
    setIsMultipleChoice,
    setSearchTerm,
    setNewRelatedQuestionText,
    handleCategoryChange,
    handleSubcategoryChange,
    handleQuestionSelect,
    updateOption,
    deleteOption,
    enableInputs,
    handleCreate,
    handleUpdate,
    handleDelete,
    resetForm,
  };
};
