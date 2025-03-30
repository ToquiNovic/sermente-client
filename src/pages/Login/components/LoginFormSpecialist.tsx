// components/LoginFormSpecialist.tsx
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createUser } from "@/redux/states";
import { loginUser } from "../services";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "../Schema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const LoginFormSpecialist: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema(true)),
    defaultValues: { idNumber: "", password: "" },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    try {
      const user = await loginUser({ numberDoc: values.idNumber, password: values.password, isSpecialist: true });
      if (user && user.accessToken) {
        dispatch(createUser({ id: user.id, accessToken: user.accessToken }));
        toast.success("Inicio de sesión exitoso 🎉");
        navigate("/dashboard");
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(`Error: ${err instanceof Error ? err.message : "Error desconocido"} 🚨`);
    }
  };

  return (
    <TabsContent value="specialist">
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales como especialista.</CardDescription>
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Ingresa tu contraseña"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
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
  );
};