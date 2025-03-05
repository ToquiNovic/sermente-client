import { Link } from "react-router-dom";
import { LayoutGrid, LogOut, User } from "lucide-react";
import { useUserProfile } from "@/hooks";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav() {
  const { userPerfil, fetchUserDetails } = useUserProfile();

  return (
    <DropdownMenu onOpenChange={(open) => open && fetchUserDetails()}>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className="bg-transparent">
                    {userPerfil?.people?.names &&
                    userPerfil?.people?.surNames ? (
                      `${userPerfil.people.names
                        .charAt(0)
                        .toUpperCase()}${userPerfil.people.surNames
                        .charAt(0)
                        .toUpperCase()}`
                    ) : (
                      <User />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Perfil</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userPerfil?.people?.names && userPerfil?.people?.surNames
                ? `${userPerfil.people.names} ${userPerfil.people.surNames}`
                : userPerfil?.numberDoc || "Sin información"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {(userPerfil?.roles ?? []).map((role) => role.name).join(", ") ||
                "Sin roles asignados"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Cuenta
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
