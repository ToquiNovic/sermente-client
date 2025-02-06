import {
  BookOpen,
  LayoutList,
  Settings2,
  Blocks
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
      title: "Encuestas",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
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
          url: "/create-category",
        },
        {
          title: "Categorias",
          url: "/categorys",
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
          url: "#",
        },
        {
          title: "SubCategorias",
          url: "#",
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
          title: "Economía",
          url: "/#",
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
