import {
  BookOpen,
  Settings2,
  Building2,
  LucideIcon,
  LayoutGrid,
  UsersRound,
  SlidersVertical,
  CircleUser,
  Coins,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  adminOnly?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  adminOnly?: boolean;
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
      ],
    },
    {
      groupLabel: "Configuración",
      menus: [
        {
          label: "Usuarios",
          href: "/users",
          icon: UsersRound,
          active: pathname === "/users",
          adminOnly: true,
        },
        {
          label: "Roles",
          href: "/rol",
          icon: SlidersVertical,
          active: pathname === "/rol",
          adminOnly: true,
        },
        {
          label: "Cuenta",
          href: "/commingsoon",
          icon: CircleUser,
          active: pathname === "/commingsoon",
        },
        {
          label: "Economía",
          href: "/commingsoon",
          icon: Coins,
          active: pathname === "/commingsoon",
        },
        {
          label: "Configuraciones",
          href: "#",
          icon: Settings2,
          adminOnly: true,
          submenus: [
            {
              label: "Tipo Contrato",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
            {
              label: "Tipo Sangre",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
            {
              label: "Tipo Encuesta",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
            {
              label: "Tipo Salario",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
            {
              label: "Estrato",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
            {
              label: "Nivel de Estudio",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
            {
              label: "Géneros",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
            {
              label: "Dependencias",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
            {
              label: "Housing Types",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
            {
              label: "Marital Statuses",
              href: "/commingsoon",
              active: pathname === "/commingsoon",
              adminOnly: true,
            },
          ],
        },
      ],
    },
  ];
}
