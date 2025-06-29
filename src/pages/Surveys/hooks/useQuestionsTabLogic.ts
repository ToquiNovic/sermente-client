// src/pages/Surveys/hooks/useQuestionsTabLogic.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionBySurveyId,
} from "../services";
import { Question } from "../Models";
import {
  DimensionForQuestion,
  DomainForQuestion,
  FactorForQuestion,
  Option,
} from "../types";
import { AxiosError } from "axios";

// Constantes
const DEFAULT_OPTIONS: Option[] = [
  { text: "Siempre", weight: 0 },
  { text: "Casi siempre", weight: 0 },
  { text: "Algunas veces", weight: 0 },
  { text: "Casi nunca", weight: 0 },
  { text: "Nunca", weight: 0 },
];

export const useQuestionsTab = (surveyId: string) => {
  // Estados
  const [factors, setFactors] = useState<FactorForQuestion[]>([]);
  const [domains, setDomains] = useState<DomainForQuestion[]>([]);
  const [dimensions, setDimensions] = useState<DimensionForQuestion[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedFactor, setSelectedFactor] =
    useState<FactorForQuestion | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [selectedDimensionId, setSelectedDimensionId] = useState<string | null>(
    null
  );
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

  // Cargar factores al iniciar
  useEffect(() => {
    const loadQuestionsStructure = async () => {
      try {
        const response = await getQuestionBySurveyId(surveyId);
        const data = response.questions || [];

        setFactors(data);
      } catch {
        toast.error("Error al cargar estructura de preguntas");
      }
    };

    loadQuestionsStructure();
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

  // Cambiar factor
  const handleFactorChange = useCallback(
    (factorId: string) => {
      const factor = factors.find((fac) => fac.id === factorId) || null;
      setSelectedFactor(factor);
      setDomains(factor?.domains || []);
      setSelectedDomainId(null);
      setSelectedDimensionId(null);
      setQuestions([]);
      resetForm();
    },
    [factors, resetForm]
  );

  // Cambiar dominio
  const handleDomainChange = useCallback(
    (domainId: string) => {
      const domain = domains.find((d) => d.id === domainId);
      setDimensions(domain?.dimensions || []);
      setSelectedDomainId(domainId);
      setSelectedDimensionId(null);
      setQuestions([]);
      resetForm();
    },
    [domains, resetForm]
  );

  // Cambiar dimensión
  const handleDimensionChange = useCallback(
    (dimensionId: string) => {
      setSelectedDimensionId(dimensionId);

      const dimension = dimensions.find((d) => d.id === dimensionId);
      const dimensionQuestions = dimension?.questions ?? [];

      setQuestions(dimensionQuestions);
      resetForm();
    },
    [dimensions, resetForm]
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
              text: opt.text,
              weight: opt.weight,
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
    setOptions((prevOptions) => [...prevOptions, { text: "", weight: 0 }]);
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
      text: opt.text,
      weight: opt.weight,
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
    if (!selectedDomainId || !selectedDimensionId) {
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
        ? options.map((opt) => ({ text: opt.text, weight: Number(opt.weight) }))
        : [],
    };

    try {
      const response = await createQuestion(selectedDimensionId, newQuestion);
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
    selectedDomainId,
    selectedDimensionId,
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
        ? options.map((opt) => ({ text: opt.text, weight: Number(opt.weight) }))
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
    factors,
    selectedFactor,
    domains,
    selectedDomainId,
    dimensions,
    selectedDimensionId,
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
    handleFactorChange,
    handleDomainChange,
    handleDimensionChange,
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
