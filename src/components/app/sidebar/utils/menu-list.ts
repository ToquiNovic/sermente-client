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
  NotebookPen,
} from "lucide-react";
import { ADMIN_ROLE, SPECIALIST_ROLE, SURVEYED } from "@/config/index";

export type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  roles?: string[];
};

export type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  roles?: string[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  roles?: string[];
};

export function getMenuList(pathname: string, userRole: string): Group[] {
  const allGroups: Group[] = [
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
      groupLabel: "Mis Encuestas",
      menus: [
        {
          label: "Responder Encuesta",
          href: "/respondent",
          icon: NotebookPen,
          submenus: [],
        },
      ],
      roles: [SURVEYED],
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
          roles: [ADMIN_ROLE, SPECIALIST_ROLE],
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
          roles: [ADMIN_ROLE],
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
          roles: [ADMIN_ROLE],
        },
        {
          label: "Roles",
          href: "/rol",
          icon: SlidersVertical,
          active: pathname === "/rol",
          roles: [ADMIN_ROLE],
        },
        {
          label: "Cuenta",
          href: "/commingsoon",
          icon: CircleUser,
          active: pathname === "/commingsoon",
          roles: [ADMIN_ROLE, SPECIALIST_ROLE, SURVEYED],
        },
        {
          label: "Economía",
          href: "/commingsoon",
          icon: Coins,
          active: pathname === "/commingsoon",
          roles: [ADMIN_ROLE],
        },
        {
          label: "Configuraciones",
          href: "#",
          icon: Settings2,
          submenus: [
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
          ],
          roles: [ADMIN_ROLE],
        },
      ],
    },
  ];

  // 💥 Acá filtrás correctamente por rol tanto en el grupo como en los menús
  return allGroups
    .map((group) => {
      // Verificás si el grupo tiene restricciones de roles
      if (group.roles && !group.roles.includes(userRole)) {
        return null;
      }

      const filteredMenus = group.menus
        .map((menu) => {
          // Si el menú tiene submenús, los filtrás también
          const filteredSubmenus = menu.submenus?.filter(
            (submenu) => !submenu.roles || submenu.roles.includes(userRole)
          );

          // Si el menú tiene roles y el user no tiene acceso, descartalo
          if (menu.roles && !menu.roles.includes(userRole)) return null;

          return {
            ...menu,
            submenus: filteredSubmenus ?? [],
          };
        })
        .filter(Boolean);

      if (filteredMenus.length === 0) return null;

      return {
        ...group,
        menus: filteredMenus,
      };
    })
    .filter(Boolean) as Group[];
}
