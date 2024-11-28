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
import { useNavigate } from "react-router-dom";
import { loginUser } from "./services";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const user = await loginUser({
        numberDoc: values.idNumber,
        password: values.password,
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
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta.
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
  );
}
