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
  animate,
}: SurveyProgressProps & { animate?: boolean }) => {
  console.log("current:", current, "total:", total);

  const questionsPerFactor = factors.map((factor) =>
    factor.domains.reduce(
      (acc, domain) =>
        acc +
        domain.dimensions.reduce((dAcc, dim) => dAcc + dim.questions.length, 0),
      0
    )
  );

  const totalQuestions = questionsPerFactor.reduce((a, b) => a + b, 0);
  const segmentWidth = 100 / factors.length;

  let cumulativeQuestions = 0;
  const factorProgress = questionsPerFactor.map((q) => {
    cumulativeQuestions += q;
    if (current >= cumulativeQuestions) return 100;
    const prevCumulative = cumulativeQuestions - q;
    return ((current - prevCumulative) / q) * 100;
  });

  return (
    <div className="w-full space-y-6">
      <div className="text-center text-4xl font-bold">
        {current} / {totalQuestions}
      </div>

      <div className="w-full h-6 flex rounded-full overflow-hidden bg-gray-200 relative">
        {factors.map((factor, index) => (
          <div
            key={factor.id}
            className={`h-6 relative ${index === 0 ? "rounded-l-full" : ""} ${
              index === factors.length - 1 ? "rounded-r-full" : ""
            }`}
            style={{ width: `${segmentWidth}%`, backgroundColor: "#e5e7eb" }}
          >
            {factorProgress[index] > 0 && (
              <div
                className={`h-6 bg-red-500 ${
                  animate ? "transition-all duration-300" : ""
                }`}
                style={{ width: `${factorProgress[index]}%` }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {factor.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
