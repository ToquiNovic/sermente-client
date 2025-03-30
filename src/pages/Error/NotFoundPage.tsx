import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="container px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
        {/* Contenido del mensaje */}
          <CardContent className="p-6 space-y-6">
            <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
              404 error
            </p>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
              Página no encontrada
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Lo sentimos, la página que buscas no existe. Aquí tienes algunas opciones:
            </p>

            {/* Botones */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 rtl:rotate-180"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
                </svg>
                Regresar
              </Button>

              <Button asChild>
                <Link to="/">Ir al inicio</Link>
              </Button>
            </div>
          </CardContent>

        {/* Imagen de ilustración */}
        <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0">
          <img
            className="w-full max-w-lg lg:mx-auto"
            src="https://merakiui.com/images/components/illustration.svg"
            alt="Ilustración 404"
          />
        </div>
      </div>
    </section>
  );
};
