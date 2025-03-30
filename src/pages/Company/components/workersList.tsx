// components/workersList.tsx
import { useEffect, useState } from "react";
import { getCompanyUsers } from "../services";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks";
import { PlaceholderWorkerList } from "./placehoderWorkerList";
import { DataTable, getColumns } from "../dataTable";
import { WorkerTableData } from "@/models";

interface Props {
  companyId: string;
  specialistId: string;
}

interface PeopleWorker {
  id: string;
  names: string;
  surNames: string;
  phone: string;
  email: string;
}

interface UserWorker {
  id: string;
  numberDoc: string;
  people: PeopleWorker;
}

interface Worker {
  id: string;
  companyId: string;
  specialistId: string;
  user: UserWorker;
}

export const WorkersList = ({ companyId, specialistId }: Props) => {
//   const [data, setData] = useState<WorkerTableData[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userPerfil } = useUserProfile();

  useEffect(() => {
    if (!companyId || !specialistId) return;

    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const data: Worker[] = await getCompanyUsers(companyId, specialistId);
        setWorkers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [companyId, specialistId]);

  const filteredWorkers = workers.filter(
    (worker) => worker.user.id !== userPerfil?.id
  );

  return loading ? (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : filteredWorkers.length > 0 ? (
    <DataTable
    columns={getColumns(
        (id) => setWorkers((prev) => prev.filter((worker) => worker.id !== id)),
        (worker: WorkerTableData) => console.log("Detalles del usuario:", worker)
      )}
      data={filteredWorkers.map((worker) => ({
        id: worker.id,
        numberDoc: worker.user.numberDoc,
        names: worker.user.people.names,
        surNames: worker.user.people.surNames,
        phone: worker.user.people.phone,
        email: worker.user.people.email,
      }))}
    />
  ) : (
    <PlaceholderWorkerList companyId={companyId} />
  );
};
