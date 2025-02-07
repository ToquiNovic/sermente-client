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
import { createRole } from './service';
import { CreateRoleFromData, RoleTableData } from '@/models';

export const CreateRole = ({ onRoleCreated }: { onRoleCreated: (role: RoleTableData) => void }) => {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<CreateRoleFromData>({
    name: '',
    state: true,
    description: 'Sin descripción',
  });

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createRole,
    onSuccess: (newRole: RoleTableData) => {
      onRoleCreated(newRole);
  
      setFormData({ name: '', state: true, description: 'Sin descripción' });
  
      toast({
        title: 'Rol creado',
        description: 'El rol ha sido creado exitosamente',
        variant: 'default',
      });
  
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al crear el rol',
        description: error.message,
        variant: 'destructive',
      });
    },
  });  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value || (name === 'description' ? 'Sin descripción' : ''), 
    }));
  };
  
  const handleCreateRole = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor, ingresa un nombre para el rol.',
        variant: 'destructive',
      });
      return;
    }
  
    mutation.mutate(formData); 
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Rol</DialogTitle>
          <DialogDescription>Crea un nuevo rol</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              placeholder="Rol"
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              placeholder="Descripción del rol"
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateRole}>
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
