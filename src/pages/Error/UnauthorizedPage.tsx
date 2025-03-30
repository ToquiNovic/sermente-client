import { Link } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LogoUnauthorized from "@/assets/unauthorized.svg"; 

export const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 dark:bg-gray-900 px-4">
        <CardContent className="p-6 text-center space-y-4">
          <img
            src={LogoUnauthorized}
            alt="No autorizado"
            className="mx-auto w-50 h-50" 
          />
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            No autorizado
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Intentaste acceder a una página para la que no tienes autorización.
          </p>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </CardContent>
    </div>
  );
};
