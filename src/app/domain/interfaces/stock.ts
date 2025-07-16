import { Company } from "./company";
import { Produtos } from "./produtos";

// export interface StockMovement {
//   idLocal: number;
//   idUser: number | null;
//   dateMovement: string | null;
//   status: string | null;
//   observation: string | null;
//   stChecked: string | null;
//   numberNote: number | null;
//   codeSeries: string | null;
//   idSector: number | null;
//   idRequester: number | null;
//   solicitante?: string;
//   destino?: string;
//   amount: number | null;
//   ownerId: string | null;
//   companyOriginId: string | null,
//   companyDestinyId: string | null,
//   creatAt?: string;
//   produtos?: Produtos[];
// }

export interface StockMovement {
  dateMovement?: string | null;
  status: string | null;
  observation: string | null;
  stChecked?: string | null;
  amount?: number | null;
  originCompanyId: number | null,
  destinyCompanyId: number | null,
}

export interface TransfMovement {
  id: number;
  userId: number;
  dateMovement?: string | null;
  status: string ;
  observation: string ;
  stChecked?: string | null;
  amount?: number | null;
  originCompanyId: number ;
  destinyCompanyId: number;
  createdAt: string; // Propriedade adicionada
  companyOrigin: string; // Propriedade adicionada
  companyDestiny: string;
}
