// pages/Surveys/surveyManager.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab, CategoriesTab, SubcategoriesTab, OptionsTab } from "./Tabs";
import { Survey } from "@/models";
import { getSurvey } from "./services";
import { ContentLayout } from "@/components/app/sidebar/content-layout";

export const SurveyManagerPage = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);

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
    <ContentLayout title="Gestionar Encuesta" icon={<UsersTab />}>
      <h1 className="text-2xl font-bold mb-4">
        Gestionar Encuesta:{" "}
        <span className="font-normal">{survey?.title}</span>
      </h1>

      <Tabs defaultValue="users">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategorías</TabsTrigger>
          <TabsTrigger value="options">Opciones</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab />
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
