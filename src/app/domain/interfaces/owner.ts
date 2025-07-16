import { Address } from './address';


export interface Owner {
    id: string;
    document: string | null;
    corporateName: string | null;
    fantasyName: string | null;
    phone: string | null;
    inscricaoEstadual: string | null;
    idLocal: number | null;
    address: Address | null;
}
