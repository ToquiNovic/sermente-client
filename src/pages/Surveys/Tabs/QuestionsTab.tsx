import { useRef, useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Plus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useQuestionsTab } from "../hooks";
import { MultipleChoiceOptions } from "../Components";
import { tooltips } from "../utils/tooltips";

// Tipos
interface QuestionsTabProps {
  surveyId: string;
}

export const QuestionsTab = ({ surveyId }: QuestionsTabProps) => {
  const {
    factors,
    selectedFactor,
    domains,
    selectedDomainId,
    dimensions,
    selectedDimensionId,
    filteredQuestions,
    questionText,
    setQuestionText,
    questionPosition,
    setQuestionPosition,
    isMultipleChoice,
    setIsMultipleChoice,
    options,
    searchTerm,
    setSearchTerm,
    isLoading,
    inputsDisabled,
    originalQuestion,
    hasChanges,
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
    addOption,
  } = useQuestionsTab(surveyId);

  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const [shouldFocusQuestion, setShouldFocusQuestion] = useState(false);
  const [isQuestionSelectOpen, setIsQuestionSelectOpen] = useState(false);

  const handleAddQuestion = () => {
    enableInputs();
    setShouldFocusQuestion(true);
  };

  useEffect(() => {
    if (shouldFocusQuestion && !inputsDisabled && questionInputRef.current) {
      questionInputRef.current.focus();
      setShouldFocusQuestion(false);
    }
  }, [shouldFocusQuestion, inputsDisabled]);

  return (
    <TooltipProvider>
      <Card className="w-full max-w-3xl mx-auto mt-4">
        <CardContent className="space-y-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Label>Factor</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Información sobre Factor"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltips.category}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Select
                value={selectedFactor?.id ?? ""}
                onValueChange={handleFactorChange}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un factor" />
                </SelectTrigger>
                <SelectContent>
                  {factors.map((factor) => (
                    <SelectItem key={factor.id ?? ""} value={factor.id ?? ""}>
                      {factor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Dominio</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Información sobre Categoría"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltips.category}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select onValueChange={handleDomainChange} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem
                      key={domain.id ?? ""}
                      value={domain.id ?? ""}
                    >
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Dimension</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Información sobre Subcategoría"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltips.subcategory}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                disabled={!dimensions.length || isLoading}
                onValueChange={handleDimensionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {dimensions.map((dime) => (
                    <SelectItem key={dime.id ?? ""} value={dime.id ?? ""}>
                      {dime.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Pregunta relacionada</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Información sobre Pregunta relacionada"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltips.relatedQuestion}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              open={isQuestionSelectOpen}
              onOpenChange={setIsQuestionSelectOpen}
              onValueChange={(value) => {
                handleQuestionSelect(value);
                setIsQuestionSelectOpen(false);
              }}
              disabled={
                !selectedDomainId || !selectedDimensionId || isLoading
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una pregunta" />
              </SelectTrigger>
              <SelectContent>
                {/* Botón Agregar siempre visible al inicio */}
                <div className="px-3 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setIsQuestionSelectOpen(false);
                      handleAddQuestion();
                    }}
                    disabled={isLoading || !dimensions.length}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Agregar
                  </Button>
                </div>

                {/* Si hay preguntas, mostrar buscador y lista */}
                {filteredQuestions.length > 0 ? (
                  <>
                    <div className="p-2">
                      <Input
                        placeholder="Buscar pregunta..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {filteredQuestions
                      .sort((a, b) => a.position - b.position)
                      .map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {`${q.position ?? 0} - ${q.text}`}
                        </SelectItem>
                      ))}
                  </>
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    <span>No hay preguntas disponibles</span>
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Posición</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Información sobre Posición"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltips.position}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              placeholder="Posición"
              value={questionPosition}
              onChange={(e) => setQuestionPosition(Number(e.target.value))}
              disabled={inputsDisabled || isLoading}
            />
            <div className="flex items-center gap-2">
              <Label>Pregunta</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Información sobre Pregunta"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltips.question}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              ref={questionInputRef}
              placeholder="Escribe la pregunta"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              disabled={inputsDisabled || isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>¿Selección múltiple?</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Información sobre Selección múltiple"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltips.multipleChoice}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              checked={isMultipleChoice}
              onCheckedChange={setIsMultipleChoice}
              disabled={inputsDisabled || isLoading}
            />
          </div>

          <MultipleChoiceOptions
            options={options}
            updateOption={updateOption}
            deleteOption={deleteOption}
            isMultipleChoice={isMultipleChoice}
            inputsDisabled={inputsDisabled}
            isLoading={isLoading}
            addOption={addOption}
          />

          <div className="flex justify-end gap-2">
            {originalQuestion && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" disabled={isLoading}>
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
                        <Button variant="destructive" onClick={handleDelete}>
                          Eliminar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="secondary"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Limpiar
                </Button>
              </>
            )}

            <Button
              onClick={
                originalQuestion && hasChanges ? handleUpdate : handleCreate
              }
              disabled={inputsDisabled || isLoading || !questionText.trim()}
            >
              {isLoading
                ? originalQuestion
                  ? "Actualizando..."
                  : "Creando..."
                : originalQuestion && hasChanges
                ? "Actualizar"
                : "Crear"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
