// pages/Surveys/surveyManager.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesTab, SubcategoriesTab, OptionsTab } from "../Tabs";
import { Survey } from "@/models";
import { getSurvey } from "../services";
import { ContentLayout } from "@/components/app/sidebar/content-layout";

export const SurveyManagerPage = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [activeTab, setActiveTab] = useState("categories");

  useEffect(() => {
    if (!id) return;
    const fetchSurvey = async () => {
      try {
        const surveyData = await getSurvey(id);
        setSurvey(surveyData);
      } catch (error) {
        console.error("Error fetching survey:", error);
      }
    };

    fetchSurvey();
  }, [id]);

  return (
    <ContentLayout title={survey?.title || "Gestionar Encuesta"} icon={<BookOpen />}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex space-x-2 bg-transparent justify-start">
          <TabsTrigger
            value="categories"
            className="relative py-2 px-4 text-gray-600 border border-transparent rounded-t-md rounded-b-none
            data-[state=active]:border-gray-300 data-[state=active]:border-b-white data-[state=active]:bg-white 
            data-[state=active]:text-black font-medium"
          >
            Categorías
          </TabsTrigger>
          <TabsTrigger
            value="subcategories"
            className="relative py-2 px-4 text-gray-600 border border-transparent rounded-t-md rounded-b-none
            data-[state=active]:border-gray-300 data-[state=active]:border-b-white data-[state=active]:bg-white 
            data-[state=active]:text-black font-medium"
          >
            Subcategorías
          </TabsTrigger>
          <TabsTrigger
            value="options"
            className="relative py-2 px-4 text-gray-600 border border-transparent rounded-t-md rounded-b-none
            data-[state=active]:border-gray-300 data-[state=active]:border-b-white data-[state=active]:bg-white 
            data-[state=active]:text-black font-medium"
          >
            Opciones
          </TabsTrigger>
        </TabsList>

        <div className="border-b border-gray-300 w-full -mt-[1px]" />

        <TabsContent value="categories">
          {id && <CategoriesTab surveyId={id} />}
        </TabsContent>
        <TabsContent value="subcategories">
          <SubcategoriesTab />
        </TabsContent>
        <TabsContent value="options">
          <OptionsTab />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
};
