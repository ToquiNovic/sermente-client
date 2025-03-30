import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginFormRespondent, LoginFormSpecialist } from "./components";

export default function LoginForm() {
  const [selectedTab, setSelectedTab] = useState<"respondent" | "specialist">("respondent");

  return (
    <div className="flex items-center justify-center h-screen">
      <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val as "respondent" | "specialist")} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="respondent">Responder Encuesta</TabsTrigger>
          <TabsTrigger value="specialist">Especialista</TabsTrigger>
        </TabsList>

        <TabsContent value="respondent">
          <LoginFormRespondent />
        </TabsContent>

        <TabsContent value="specialist">
          <LoginFormSpecialist />
        </TabsContent>
      </Tabs>
    </div>
  );
}
