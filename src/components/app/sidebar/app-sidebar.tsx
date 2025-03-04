import {
  BookOpen,
  LayoutList,
  Settings2,
  Blocks,
  Building2 
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Empresa",
      url: "#",
      icon: Building2 ,
      isActive: false,
      items: [
        {
          title: "Crear Empresa",
          url: "/company/new",
        },
        {
          title: "Empresa",
          url: "/company",
        },
      ],
    },
    {
      title: "Encuestas",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "Crear Encuesta",
          url: "/surveys/new",
        },
        {
          title: "Encuestas",
          url: "/surveys",
        },
      ],
    },
    {
      title: "Categorias",
      url: "#",
      icon: LayoutList,
      items: [
        {
          title: "Crear Categorias",
          url: "/commingsoon",
        },
        {
          title: "Categorias",
          url: "/commingsoon",
        },
      ],
    },
    {
      title: "Subcategorias",
      url: "#",
      icon: Blocks,
      items: [
        {
          title: "Crear SubCategorias",
          url: "/commingsoon",
        },
        {
          title: "SubCategorias",
          url: "/commingsoon",
        }
      ],
    },
    {
      title: "Configuraciones",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Roles",
          url: "/rol",
        },
        {
          title: "Usuarios",
          url: "/users",
        },
        {
          title: "Tipo Contrato",
          url: "/commingsoon",
        },
        {
          title: "Tipo Sangre",
          url: "/commingsoon",
        },
        {
          title: "Tipo Encuesta",
          url: "/commingsoon",
        },
        {
          title: "Tipo Salario",
          url: "/commingsoon",
        },
        {
          title: "Estrato",
          url: "/commingsoon",
        },
        {
          title: "Nivel de Estudio",
          url: "/commingsoon",
        },
        {
          title: "Generos",
          url: "/commingsoon",
        },
        {
          title: "Dependencias",
          url: "/commingsoon",
        },
        {
          title: "housing_types",
          url: "/commingsoon",
        },
        {
          title: "marital_statuses",
          url: "/commingsoon",
        },
        {
          title: "Economía",
          url: "/commingsoon",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
