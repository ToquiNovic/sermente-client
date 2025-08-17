import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Survey } from "../type";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SurveyCardProps {
  survey: Survey;
}

export const SurveyCard = ({ survey }: SurveyCardProps) => {
  const navigate = useNavigate();

  const handleSurveyResponse = () => {
    navigate(`/respondent/survey/${survey.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-bold">{survey.title}</h2>
        </CardTitle>
        <CardDescription>
          <p className="text-gray-500">{survey.description}</p>
        </CardDescription>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSurveyResponse}
          >
            Responder
          </Button>
        </CardFooter>
      </CardHeader>
    </Card>
  );
};
