// types/domains.type.ts
import { Factor } from "./factors.types";

export interface Domain {
  id?: string;
  position: string | number;
  name: string;
}

export interface GetDomainsResponse {
  message: string;
  domains?: Domain[];
  factors?: Factor[];
}

export interface CreateDomainProps {
  name: string;
  position: number;
  factorId: string;
}

export interface UpdateDomainProps {
  id: string;
  name: string;
  position: number;
}