import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { createUser } from './service';
import { CreateUserFormData, UserTableData } from '@/models';

export const CreateUser = ({ onUserCreated }: { onUserCreated: (user: UserTableData) => void }) => {
  // Utiliza CreateUserFormData para tipar el estado inicial
  const [formData, setFormData] = useState<CreateUserFormData>({
    numberDoc: '',
    password: '',
    roleId: 3, 
  });

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () => createUser(formData),
    onSuccess: (newUser: UserTableData) => {
      onUserCreated({
        id: newUser.id,
        numerDoc: newUser.numerDoc,
        rol: newUser.rol,
      });

      setFormData({ numberDoc: '', password: '', roleId: 3 });

      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado exitosamente',
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Error al crear el usuario',
        description: 'No se ha podido crear el usuario',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'roleId' ? parseInt(value) || 3 : value,
    }));
  };

  const handleCreateUser = () => {
    const { numberDoc, password, roleId } = formData;

    if (!numberDoc.trim() || !password.trim() || roleId <= 0) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor, completa todos los campos correctamente.',
        variant: 'destructive',
      });
      return;
    }

    mutation.mutate();
  };

  return (
    <Dialog>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roleId" className="text-right">
              Rol ID
            </Label>
            <Input
              id="roleId"
              name="roleId"
              type="number"
              value={formData.roleId || ''}
              placeholder="1"
              onChange={handleInputChange}
              className="col-span-3"
            />
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
