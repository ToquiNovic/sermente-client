import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";
import { UserTableData } from "@/models";
import { removeRoleFromUser } from "../service";

// Función para generar colores de roles dinámicamente
const generateColorFromRole = (role?: string) => {
  if (!role) return "bg-gray-400";

  const hash = role.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
  ];
  return colors[hash % colors.length];
};

const RoleCell = ({
  roles,
  userId,
  setData,
  openAssignRoleModal,
}: {
  roles?: { id: string; name: string }[];
  userId: string;
  setData: React.Dispatch<React.SetStateAction<UserTableData[]>>;
  openAssignRoleModal: (userId: string, currentRoles: { id: string; name: string }[]) => void;
}) => {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [roleToRemove, setRoleToRemove] = useState<{ id: string; name: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRemoveRole = async () => {
    if (!roleToRemove) return;
    try {
      await removeRoleFromUser(userId, roleToRemove.id);
      setData((prevData) =>
        prevData.map((user) =>
          user.id === userId
            ? { ...user, roles: user.roles.filter((role) => role.id !== roleToRemove.id) }
            : user
        )
      );
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {roles && roles.length > 0 ? (
        roles.map((role) => (
          <div
            key={role.id}
            className="relative group"
            onMouseEnter={() => setHoveredRole(role.id)}
            onMouseLeave={() => setHoveredRole(null)}
          >
            <Badge className={`pr-6 relative ${generateColorFromRole(role.name)} text-white`}>
              {role.name}
              {hoveredRole === role.id && (
                <button
                  onClick={() => {
                    setRoleToRemove(role);
                    setIsDialogOpen(true);
                  }}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </Badge>
          </div>
        ))
      ) : (
        <span className="text-gray-500 italic">Sin roles</span>
      )}

      <button
        onClick={() =>
          openAssignRoleModal(
            userId,
            (roles || []).map(({ id, name }) => ({ id: id.toString(), name }))
          )
        }
        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <Plus size={16} />
      </button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Rol</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar el rol <strong>{roleToRemove?.name}</strong> de este usuario?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRemoveRole}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleCell;