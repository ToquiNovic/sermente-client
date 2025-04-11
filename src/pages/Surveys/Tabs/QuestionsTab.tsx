import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import {
  getQuestionsBySubcategoryId,
  getSubcategoriesBySurveyId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../services";
import { Input } from "@/components/ui/input";
import { Question } from "../Models";
import { toast } from "sonner";

interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  idcategory: string;
  namecategory: string;
  subcategories: Subcategory[];
}

interface QuestionsTabProps {
  surveyId: string;
}

export const QuestionsTab = ({ surveyId }: QuestionsTabProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const [originalQuestionData, setOriginalQuestionData] =
    useState<Question | null>(null);
  const [questionText, setQuestionText] = useState<string>("");
  const [relatedQuestionId, setRelatedQuestionId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionPosition, setQuestionPosition] = useState<number>(0);
  const [newRelatedQuestionText, setNewRelatedQuestionText] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [isMultipleChoice, setIsMultipleChoice] = useState(true);
  const [options, setOptions] = useState([
    { name: "siempre", value: 0 },
    { name: "casi siempre", value: 0 },
    { name: "algunas veces", value: 0 },
    { name: "casi nunca", value: 0 },
    { name: "nunca", value: 0 },
  ]);

  const handleOptionChange = (index: number, newValue: number) => {
    const updatedOptions = [...options];
    updatedOptions[index].value = newValue;
    setOptions(updatedOptions);
  };

  const handleOptionNameChange = (index: number, newName: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].name = newName;
    setOptions(updatedOptions);
  };

  const filteredQuestions =
    questions?.filter((q) => {
      const textMatch = q.text
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const positionMatch = q.position?.toString().includes(searchTerm.trim());
      return textMatch || positionMatch;
    }) || [];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSubcategoriesBySurveyId(surveyId);
      setCategories(data);
    };
    fetchData();
  }, [surveyId]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const selected = categories.find((c) => c.idcategory === categoryId);
    setSubcategories(selected?.subcategories || []);
    setSelectedSubcategoryId(null);
    setQuestions([]);
  };

  const handleSubcategoryChange = async (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    try {
      const { questions } = await getQuestionsBySubcategoryId(subcategoryId);
      setQuestions(Array.isArray(questions) ? questions : []);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
      setQuestions([]);
    }
  };

  const handleRelatedQuestionSelect = (value: string) => {
    setRelatedQuestionId(value);
    setNewRelatedQuestionText("");

    const selected = questions.find((q) => q.id === value);
    if (selected) {
      setQuestionText(selected.text);
      setQuestionPosition(selected.position || 0);
      setIsMultipleChoice(
        selected.isMultipleChoice !== undefined
          ? selected.isMultipleChoice
          : true
      );

      const formattedOptions = selected.options?.length
        ? selected.options.map((opt) => ({
            name: opt.text,
            value: opt.weight,
          }))
        : [
            { name: "siempre", value: 0 },
            { name: "casi siempre", value: 0 },
            { name: "algunas veces", value: 0 },
            { name: "casi nunca", value: 0 },
            { name: "nunca", value: 0 },
          ];

      setOptions(formattedOptions);

      setOriginalQuestionData({
        ...selected,
        options: formattedOptions.map((opt) => ({
          text: opt.name,
          weight: opt.value,
        })),
      });
    }
  };

  const handleCreate = async () => {
    if (!selectedSubcategoryId) return;

    setIsCreating(true);

    let relatedQuestion = relatedQuestionId;

    if (!relatedQuestion && newRelatedQuestionText.trim()) {
      const nuevaPregunta: Question = {
        id: crypto.randomUUID(),
        text: newRelatedQuestionText,
        position: 0,
        isMultipleChoice: false,
        options: [],
      };
      setQuestions((prev) => [...prev, nuevaPregunta]);
      relatedQuestion = nuevaPregunta.id;
    }

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: questionText,
      position: questionPosition,
      isMultipleChoice,
      options: isMultipleChoice
        ? options.map((opt) => ({
            text: opt.name,
            weight: Number(opt.value),
          }))
        : [],
    };

    try {
      const response = await createQuestion(selectedSubcategoryId, newQuestion);
      toast.success("Pregunta creada correctamente");
      setQuestions((prev) => [...prev, response]);

      setRelatedQuestionId(null);
      setNewRelatedQuestionText("");
      setQuestionText("");
      setQuestionPosition(0);
      setOptions([
        { name: "siempre", value: 0 },
        { name: "casi siempre", value: 0 },
        { name: "algunas veces", value: 0 },
        { name: "casi nunca", value: 0 },
        { name: "nunca", value: 0 },
      ]);
    } catch (error) {
      console.error("Error al crear la pregunta:", error);
      toast.error("Error al crear la pregunta");
    } finally {
      setIsCreating(false);
    }
  };

  const hasChanges = () => {
    if (!originalQuestionData) return false;

    if (originalQuestionData.text !== questionText) return true;
    if (originalQuestionData.position !== questionPosition) return true;
    if (originalQuestionData.isMultipleChoice !== isMultipleChoice) return true;

    if ((originalQuestionData.options?.length || 0) !== options.length)
      return true;

    for (let i = 0; i < options.length; i++) {
      if (
        options[i].name !== originalQuestionData.options?.[i]?.text ||
        options[i].value !== originalQuestionData.options?.[i]?.weight
      ) {
        return true;
      }
    }

    return false;
  };

  const handleUpdate = async () => {
    if (!relatedQuestionId) return;

    try {
      setIsCreating(true);

      const updatedQuestion: Question = {
        id: relatedQuestionId,
        text: questionText,
        position: questionPosition,
        isMultipleChoice,
        options: isMultipleChoice
          ? options.map((opt) => ({
              text: opt.name,
              weight: Number(opt.value),
            }))
          : [],
      };

      await updateQuestion(relatedQuestionId, updatedQuestion);

      // Actualiza manualmente la lista local de preguntas
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === relatedQuestionId
            ? {
                ...q,
                ...updatedQuestion,
              }
            : q
        )
      );

      toast.success("Pregunta actualizada correctamente");
      setOriginalQuestionData(updatedQuestion);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la pregunta");
    } finally {
      setIsCreating(false);
    }
  };

  const inputsDisabled = !selectedCategoryId || !selectedSubcategoryId;

  return (
    <Card className="w-full max-w-3xl mx-auto mt-4">
      <CardContent className="space-y-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.idcategory}
                    value={category.idcategory}
                  >
                    {category.namecategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subcategoría</Label>
            <Select
              disabled={!subcategories.length}
              onValueChange={handleSubcategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Pregunta relacionada</Label>
          <Select
            onValueChange={handleRelatedQuestionSelect}
            disabled={inputsDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una pregunta relacionada" />
            </SelectTrigger>
            <SelectContent>
              {filteredQuestions.length > 0 ? (
                <>
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Buscar pregunta..."
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {filteredQuestions.map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      {`${q.position ?? 0} - ${q.text}`}
                    </SelectItem>
                  ))}
                </>
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No hay preguntas disponibles
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Posición</Label>
          <Input
            placeholder="Posición"
            value={questionPosition}
            onChange={(e) => setQuestionPosition(Number(e.target.value))}
            disabled={inputsDisabled}
          />
          <Label>Pregunta</Label>
          <Textarea
            placeholder="Escribe la pregunta"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            disabled={inputsDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label>¿Selección múltiple?</Label>
          <Switch
            checked={isMultipleChoice}
            onCheckedChange={setIsMultipleChoice}
            disabled={inputsDisabled}
          />
        </div>

        {isMultipleChoice && (
          <div className="space-y-2">
            <Label>Opciones</Label>
            <div className="grid grid-cols-1 gap-4">
              {[...options]
                .sort((a, b) => b.value - a.value)
                .map((option, index) => (
                  <div key={option.name} className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Nombre"
                      value={option.name.toUpperCase()}
                      onChange={(e) =>
                        handleOptionNameChange(index, e.target.value)
                      }
                      disabled={inputsDisabled}
                    />
                    <Input
                      placeholder="Valor"
                      value={option.value}
                      onChange={(e) =>
                        handleOptionChange(index, Number(e.target.value))
                      }
                      disabled={inputsDisabled}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {originalQuestionData && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" disabled={isCreating}>
                    Eliminar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                    <DialogDescription>
                      Esta acción no se puede deshacer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2">
                    Esta acción eliminará permanentemente la pregunta.
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          if (relatedQuestionId) {
                            try {
                              await deleteQuestion(relatedQuestionId);
                              setQuestions((prev) =>
                                prev.filter((q) => q.id !== relatedQuestionId)
                              );
                              setRelatedQuestionId(null);
                              setNewRelatedQuestionText("");
                              setQuestionText("");
                              setQuestionPosition(0);
                              setIsMultipleChoice(true);
                              setOptions([
                                { name: "siempre", value: 0 },
                                { name: "casi siempre", value: 0 },
                                { name: "algunas veces", value: 0 },
                                { name: "casi nunca", value: 0 },
                                { name: "nunca", value: 0 },
                              ]);
                              setOriginalQuestionData(null);
                            } catch (error) {
                              console.error(
                                "Error eliminando la pregunta:",
                                error
                              );
                            }
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="secondary"
                onClick={() => {
                  setRelatedQuestionId(null);
                  setNewRelatedQuestionText("");
                  setQuestionText("");
                  setQuestionPosition(0);
                  setIsMultipleChoice(true);
                  setOptions([
                    { name: "siempre", value: 0 },
                    { name: "casi siempre", value: 0 },
                    { name: "algunas veces", value: 0 },
                    { name: "casi nunca", value: 0 },
                    { name: "nunca", value: 0 },
                  ]);
                  setOriginalQuestionData(null);
                }}
                disabled={isCreating}
              >
                Limpiar
              </Button>
            </>
          )}

          <Button
            onClick={
              originalQuestionData && hasChanges() ? handleUpdate : handleCreate
            }
            disabled={inputsDisabled || isCreating}
          >
            {isCreating
              ? originalQuestionData
                ? "Actualizando..."
                : "Creando..."
              : originalQuestionData && hasChanges()
              ? "Actualizar"
              : "Crear"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
