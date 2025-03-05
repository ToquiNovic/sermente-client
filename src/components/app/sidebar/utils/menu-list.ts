import {
  BookOpen,
  LayoutList,
  Settings2,
  Blocks,
  Building2,
  LucideIcon,
  LayoutGrid,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Gestión",
      menus: [
        {
          label: "Empresa",
          href: "#",
          icon: Building2,
          submenus: [
            {
              label: "Crear Empresa",
              href: "/company/new",
              active: pathname === "/company/new",
            },
            {
              label: "Empresas",
              href: "/company",
              active: pathname === "/company",
            },
          ],
        },
        {
          label: "Encuesta",
          href: "#",
          icon: BookOpen,
          submenus: [
            {
              label: "Crear Encuesta",
              href: "/surveys/new",
              active: pathname === "/surveys/new",
            },
            {
              label: "Encuestas",
              href: "/surveys",
              active: pathname === "/surveys",
            },
          ],
        },
        {
          label: "Categoría",
          href: "#",
          icon: LayoutList,
          submenus: [
            {
              label: "Crear Categorías",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Categorías",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
          ],
        },
        {
          label: "Subcategoría",
          href: "#",
          icon: Blocks,
          submenus: [
            {
              label: "Crear SubCategorías",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "SubCategorías",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Configuracion",
      menus: [
        {
          label: "Configuraciones",
          href: "#",
          icon: Settings2,
          submenus: [
            { label: "Roles", href: "/rol", active: pathname === "/rol" },
            {
              label: "Usuarios",
              href: "/users",
              active: pathname === "/users",
            },
            {
              label: "Tipo Contrato",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Tipo Sangre",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Tipo Encuesta",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Tipo Salario",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Estrato",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Nivel de Estudio",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Géneros",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Dependencias",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Housing Types",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Marital Statuses",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
            {
              label: "Economía",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
            },
          ],
        },
      ],
    },
  ];
}
