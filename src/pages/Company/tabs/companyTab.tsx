// pages/Company/tabs/companyTab.tsx
import { useState } from "react";
import { Company } from "@/models/company.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

interface CompanyTabProps {
  company: Company | null;
  onSave: (updatedCompany: Company) => void;
}

export const CompanyTab: React.FC<CompanyTabProps> = ({ company, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Company | null>(company);

  if (!company) {
    return <p className="text-gray-500 text-center py-4">No hay información de la empresa.</p>;
  }

  // Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => prev && { ...prev, [e.target.name]: e.target.value });
  };

  // Guardar cambios y cerrar modal
  const handleSave = () => {
    if (formData) {
      onSave(formData);
      setIsEditing(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 relative">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Información de la Empresa
          </CardTitle>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Pencil className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Información</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nombre</Label>
                  <Input name="name" value={formData?.name || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>NIT</Label>
                  <Input name="nitCompany" value={formData?.nitCompany || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>Representante Legal</Label>
                  <Input name="legalAgent" value={formData?.legalAgent || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" name="email" value={formData?.email || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input name="phone" value={formData?.phone || ""} onChange={handleChange} />
                </div>
                <Button onClick={handleSave} className="w-full">
                  Guardar cambios
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p><strong className="text-gray-700">Nombre:</strong> {company.name}</p>
          <p><strong className="text-gray-700">NIT:</strong> {company.nitCompany}</p>
          <p><strong className="text-gray-700">Representante Legal:</strong> {company.legalAgent}</p>
          <p><strong className="text-gray-700">Email:</strong> {company.email}</p>
          <p><strong className="text-gray-700">Teléfono:</strong> {company.phone || "No disponible"}</p>
        </div>

        <div className="space-y-2">
          <p><strong className="text-gray-700">Dirección:</strong> {company.address || "No disponible"}</p>
          <p><strong className="text-gray-700">Número de empleados:</strong> {company.numberOfEmployees}</p>
          <Avatar className="w-20 h-20 mt-4">
            <AvatarImage src={company.urlIcon} alt={company.name} />
            <AvatarFallback>Logo</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
};
