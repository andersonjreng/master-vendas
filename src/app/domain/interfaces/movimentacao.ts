import { Produtos } from "./produtos";

export interface Solicitante {
  id: number,
  nome: string,
}

export interface Destino {
  id: number,
  nome: string,
}

export interface Movimentacoes {
  id: number,
  solicitante: string,
  destino: string,
  observacao: string,
  dataAtual: string,
  produtos: Produtos[]
}
