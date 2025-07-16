export interface Sector {
  id: string;
  idStocker: number;
  ownerId: string | null;
  owner: Owner | null;
  creatAt: string;
  description: string | null;
  status: string | null;
  foto: string | null;
  idLocal: number | null;
}

export interface Owner {
   id: string;
}
