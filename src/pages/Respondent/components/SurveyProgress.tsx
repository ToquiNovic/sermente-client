interface Factor {
  id: string;
  name: string;
  domains: {
    dimensions: {
      questions: { id: string }[];
    }[];
  }[];
}

interface SurveyProgressProps {
  current: number;
  total: number;
  factors: Factor[];
}

export const SurveyProgress = ({
  current,
  total,
  factors,
}: SurveyProgressProps) => {
  // Dividir la barra igualmente según la cantidad de factores
  const segmentWidth = 100 / factors.length;

  // Calcular el número de preguntas por factor para determinar los límites
  const questionsPerFactor = factors.map((factor) =>
    factor.domains.flatMap((d) => d.dimensions.flatMap((dim) => dim.questions)).length
  );

  // Calcular los límites acumulados de preguntas para cada factor
  let cumulativeQuestions = 0;
  const segmentBoundaries = questionsPerFactor.map((questions) => {
    cumulativeQuestions += questions;
    return cumulativeQuestions;
  });

  // Calcular progreso en porcentaje
  const progress = (current / total) * 100;
  console.log(progress);  

  return (
    <div className="w-full space-y-6">
      {/* Progreso total arriba */}
      <div className="text-center text-4xl font-bold">
        {current} / {total}
      </div>

      {/* Barra única dividida por factores con nombres dentro */}
      <div className="w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700 flex overflow-hidden relative">
        {factors.map((factor, index) => {
          const isActive = current > (segmentBoundaries[index - 1] || 0);
          return (
            <div
              key={factor.id}
              className={`h-6 transition-all duration-300 relative ${
                isActive
                  ? "bg-blue-600 dark:bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              } ${index === 0 ? "rounded-l-full" : ""} ${
                index === factors.length - 1 ? "rounded-r-full" : ""
              }`}
              style={{ width: `${segmentWidth}%` }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {factor.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};