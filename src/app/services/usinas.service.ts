import { Injectable } from '@angular/core';
import { Produtos } from '../domain/interfaces/produtos';

@Injectable({
  providedIn: 'root'
})
export class UsinasService {

  usinasDisponiveis: string[] = [
    'ITALVA', 'ARARUAMA', 'BANGU', 'BARRA DO PIRAÍ', 'BAURU', 'BELFORD ROXO', 'BETIM', 'BOM JESUS',
    'CACHOEIRAS DE MACACU', 'CAIEIRAS', 'CAMPOS 28 DE MARÇO', 'CANTAGALO', 'CARANGOLA', 'CHAC RIO-PETROPOLIS',
    'CONGONHAS', 'CONSELHEIRO LAFAIETE', 'CONTAGEM', 'CONTAGEM II', 'DIADEMA', 'DUQUE DE CAXIAS', 'FEIRA DE SANTANA',
    'GARDENIA AZUL', 'GUARATINGUETÁ', 'GUARULHOS', 'GUAÇUÍ', 'IBATIBA', 'IPATINGA', 'ITAPERUNA', 'ITAQUAQUECETUBA',
    'ITAQUERA', 'JACAREI', 'JUATUBA', 'JUIZ DE FORA', 'JUIZ DE FORA II', 'LENÇÓIS PAULISTA', 'LONDRINA', 'MACAÉ',
    'MARINGÁ', 'MATOZINHOS', 'MURIAE', 'MATRIZ', 'NOVA FRIBURGO', 'OLHOS DÁGUA', 'PARAÍBA DO SUL', 'PARÁ DE MINAS',
    'PETRÓPOLIS ITABETON', 'POUSO ALTO', 'POÁ', 'REDUTO', 'RESENDE', 'RIO DAS OSTRAS', 'SANTA CRUZ',
    'SANTO ANTÔNIO DE PÁDUA', 'SAQUAREMA', 'SERRA', 'SETE LAGOAS', 'SIMÕES FILHO', 'SÃO GONÇALO', 'SÃO JOAO DO MANHUAÇU',
    'SÃO JOSÉ DOS CAMPOS', 'SÃO LOURENÇO', 'SÃO PEDRO DA ALDEIA', 'TANGUÁ', 'TAQUARA', 'UBÁ', 'VALENÇA', 'VESPASIANO',
    'VILA VELHA', 'VOLTA REDONDA', 'MARICÁ', 'SANTA LUZIA', 'UBAPORANGA', 'PEDREIRA IMBOASSICA', 'PEDREIRA OUTEIRO', 'PEDREIRA IPEPAMCO', 'PEDREIRA BANGU', 'PEDREIRA APOLO',
  ];


  constructor() { }

   // Método para retornar todos os produtos
   getUsinas(): any[] {
    return this.usinasDisponiveis;
  }

  // // Método para retornar um produto pelo ID
  // getProdutoById(id: number): Produtos | undefined {
  //   return this.produtosBase.find(produto => produto.id === id);
  // }

  // buscarProdutoPorCodigo(codigo: number): Produtos[] {
  //   return this.produtosBase.filter(produto => produto.code == codigo);
  // }

  // adicionarProduto(produto: Produtos): void {
  //   // Verifica se o produto já existe pelo ID
  //   if (!this.produtosBase.find(p => p.id === produto.id)) {
  //     // Adiciona o novo produto ao array
  //     this.produtosBase.push(produto);
  //   } else {
  //     console.error('Erro: Já existe um produto com o mesmo ID.');
  //   }
  // }

}
