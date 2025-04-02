import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { getCompanies, deleteCompany } from "../services";
import { Company } from "@/models";
import { CompanyCard } from "./CompanyCard";
import { DeleteCompanyDialog } from "./DeleteCompanyDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CompanyList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Company[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companies = await getCompanies();        
        setData(companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setData([]);
      }
    };

    fetchCompanies();
  }, []);

  const handleDelete = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCompany) {
      try {
        await deleteCompany(selectedCompany.companyId);
        toast.error(`Se eliminó la empresa "${selectedCompany.name}".`);
        setData((prevData) =>
          prevData.filter((c) => c.id !== selectedCompany.id)
        );
      } catch (error) {
        toast.error("Hubo un error al eliminar la empresa.");
        console.error("Error deleting company:", error);
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-x-2">
          <ChevronRight />
        </h1>
        <Button variant="outline" onClick={() => navigate("/company/new")}>
          <Plus className="mr-2 h-4 w-4" /> Nueva
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {data.length > 0 ? (
          data.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-500">No hay empresas registradas.</p>
        )}
      </div>

      {selectedCompany ? (
        <DeleteCompanyDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={confirmDelete}
          companyName={selectedCompany.name}
        />
      ) : null}
    </div>
  );
};
