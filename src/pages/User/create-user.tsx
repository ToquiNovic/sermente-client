// ../create-user.tsx
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, Check, ChevronDown } from "lucide-react";
import { createUser, getUsers } from "./service";
import { getRoles } from "@/pages/Rol/service";
import { CreateUserFormData, UserTableData, Role, UserState } from "@/models";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CreateUser = ({
  onUserCreated,
  setData,
}: {
  onUserCreated: (user: UserTableData) => void;
  setData: React.Dispatch<React.SetStateAction<UserTableData[]>>;
}) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    numberDoc: "",
    password: "",
    roleIds: ["Encuestado"],
    roleNames: ["Encuestado"],
  });

  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  const { data: roles = [], isLoading } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...formData,
        password: formData.password || "",
      };
      return createUser(payload);
    },
    onSuccess: async (newUser: UserTableData) => {
      onUserCreated(newUser);

      const updatedUsers = (await getUsers()).map((user) => ({
        ...user,
        state: user.state as UserState,
      }));
      setData(updatedUsers);
      setIsDialogOpen(false);
      setFormData({ numberDoc: "", password: "", roleIds: ["3"] });

      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error al crear el usuario",
        description: "No se ha podido crear el usuario",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectRole = (roleName: string) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: [roleName],
      roleNames: [roleName],
      password: roleName === "Encuestado" ? "" : prev.password,
    }));
  };

  const selectedRole = roles.find((r) => r.name === formData.roleIds[0]);

  const handleCreateUser = () => {
    console.log(formData);

    if (
      !formData.numberDoc.trim() ||
      (selectedRole?.name !== "Encuestado" &&
        typeof formData.password !== "string")
    ) {
      toast({
        title: "Campos inválidos",
        description: "La contraseña debe ser un texto válido.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Plus className="mr-2 h-4 w-4" /> Nuevo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
          <DialogDescription>Crea un nuevo usuario</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="numberDoc" className="text-right">
              Número de Documento
            </Label>
            <Input
              id="numberDoc"
              name="numberDoc"
              type="text"
              value={formData.numberDoc}
              placeholder="12345678"
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          {selectedRole?.name !== "Encuestado" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                placeholder="********"
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roleIds" className="text-right">
              Rol
            </Label>
            <div className="col-span-3">
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between"
                  >
                    {selectedRole?.name || "Seleccionar rol"}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {isLoading ? (
                    <DropdownMenuItem disabled>
                      Cargando roles...
                    </DropdownMenuItem>
                  ) : (
                    roles.map((role) => (
                      <DropdownMenuItem
                        key={role.name}
                        onSelect={() => handleSelectRole(role.name)}
                        className="flex justify-between cursor-pointer"
                      >
                        {role.name}
                        {formData.roleIds.includes(role.name) && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateUser}>
            Crear
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
