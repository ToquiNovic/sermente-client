import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createUser } from "@/redux/states";
import { formSchema, FormData } from "./Schema";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./services";
import { useState } from "react";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"respondent" | "specialist">("respondent");

  // Determinar si es especialista (requiere contraseña)
  const isSpecialist = selectedTab === "specialist";

  // Usamos el esquema dinámico según el tipo de usuario
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema(isSpecialist)), // Se usa el esquema correspondiente
    defaultValues: {
      idNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const user = await loginUser({
        numberDoc: values.idNumber,
        password: isSpecialist ? values.password : undefined, // Solo enviamos la contraseña si es especialista
      });

      if (user && user.accessToken) {
        dispatch(createUser({ id: user.id, accessToken: user.accessToken }));
        toast.success("Inicio de sesión exitoso 🎉");
        navigate("/dashboard");
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error:", err);
      if (err instanceof Error) {
        setFieldError("idNumber", { type: "manual", message: err.message });
        toast.error(`Error: ${err.message} 🚨`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val as "respondent" | "specialist")} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="respondent">Responder Encuesta</TabsTrigger>
          <TabsTrigger value="specialist">Especialista</TabsTrigger>
        </TabsList>

        {/* FORMULARIO PARA RESPONDER ENCUESTA (Solo ID) */}
        <TabsContent value="respondent">
          <Card>
            <CardHeader>
              <CardTitle>Acceder a Encuesta</CardTitle>
              <CardDescription>
                Ingresa tu número de identificación para responder encuestas.
              </CardDescription>
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

        {/* FORMULARIO PARA ESPECIALISTAS (ID + Contraseña) */}
        <TabsContent value="specialist">
          <Card>
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>
                Ingresa tus credenciales como especialista.
              </CardDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                  />
                  {errors.password && (
                    <p id="password-error" className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Iniciando Sesión..." : "Iniciar Sesión"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
