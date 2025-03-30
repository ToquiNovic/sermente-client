// components/LoginFormRespondent.tsx
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createUser } from "@/redux/states";
import { loginUser } from "../services";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "../Schema";

export const LoginFormRespondent: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema(false)),
    defaultValues: { idNumber: "", password: "" },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    try {
      const user = await loginUser({ numberDoc: values.idNumber, isSpecialist: false });
      if (user && user.accessToken) {
        dispatch(createUser({ id: user.id, accessToken: user.accessToken }));
        toast.success("Inicio de sesión exitoso 🎉");
        navigate("/respondent");
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(`Error: ${err instanceof Error ? err.message : "Error desconocido"} 🚨`);
    }
  };

  return (
    <TabsContent value="respondent">
      <Card>
        <CardHeader>
          <CardTitle>Acceder a Encuesta</CardTitle>
          <CardDescription>Ingresa tu número de identificación para responder encuestas.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id-number">Número de Identificación</Label>
              <Input
                id="id-number"
                type="text"
                placeholder="Ingresa tu número de identificación"
                {...register("idNumber")}
                aria-invalid={!!errors.idNumber}
                aria-describedby="id-number-error"
              />
              {errors.idNumber && (
                <p id="id-number-error" className="text-sm text-red-500">
                  {errors.idNumber.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Accediendo..." : "Acceder"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
};