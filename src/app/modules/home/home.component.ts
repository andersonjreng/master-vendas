import { Component, HostListener, OnInit } from '@angular/core';
import { MobileCheckService } from '../../services/mobile-check.service';
import { DataService } from '../../services/data.service';
import { error } from 'jquery';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isMobile: boolean = false;
  periodoSelecionado: string = 'hoje';
  loading: boolean = false;

  cardsResumo = [
  {
    tituloMenor: 'Quantidade de vendas',
    tituloMaior: '0',
    emoji: 'shopping_cart',
    emojiColor: '#1976d2'
  },
  {
    tituloMenor: 'Valor arrecadado',
    tituloMaior: 'R$ 0,00',
    emoji: 'attach_money',
    emojiColor: '#43a047'
  },
  {
    tituloMenor: 'Valor de lucro',
    tituloMaior: 'R$ 0,00',
    emoji: 'trending_up', // ou outro ícone/material
    emojiColor: '#ff9800'
  }
];

  constructor(
    private mobileCheckService: MobileCheckService,
    private dataService: DataService // Supondo que você tenha um serviço para buscar dados
    
  ) {

    
  }

  ngOnInit(): void {

    this.isMobile = this.mobileCheckService.getIsMobile();
    this.mobileCheckService.isMobileChanged.subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });
    this.buscarResumo();  
  }

  @HostListener('window:resize')
    onResize() {
      // Atualiza a variável isMobile ao redimensionar a janela
      this.mobileCheckService.checkMobile();
    }

  buscarResumo() {
    this.loading = true;
    const hoje = new Date();
    let dataInicio: Date;
    let dataFim: Date = hoje;

    if (this.periodoSelecionado === 'hoje') {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    } else if (this.periodoSelecionado === 'semana') {
      dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - 6); // últimos 7 dias
    } else { // mês
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    }

    const filtro = {
      data_inicio: dataInicio.toISOString().slice(0, 10),
      data_fim: dataFim.toISOString().slice(0, 10)
    };

    this.dataService.getProdutos().subscribe(produtos => {
      console.log('Produtos:', produtos); // Adicione esta linha para depuração
      this.dataService.getSaidas(filtro).subscribe(saidas => {
        console.log('Saídas:', saidas); // Adicione esta linha para depuração
        const quantidadeVendas = saidas.length;
        const valorArrecadado = saidas.reduce((total, s) => total + parseFloat(s.valor_total), 0);

        const saidaIds = saidas.map(s => s.id);
        this.dataService.getSaidasProdutos({ saida_ids: saidaIds }).subscribe(saidasProdutos => {
          console.log('SaidasProdutos:', saidasProdutos); // Adicione esta linha para depuração
          let valorLucro = 0;

          saidasProdutos.forEach(sp => {
            const produto = produtos.find(p => String(p.id) === String(sp.produto_id));
            const custo = produto ? parseFloat(produto.custo) : 0;
            const valorVenda = parseFloat(sp.valor_venda);
            const quantidade = parseInt(sp.quantidade, 10) || 1;
            console.log('Produto:', produto, 'Custo:', custo, 'Valor Venda:', valorVenda, 'Quantidade:', quantidade);
            valorLucro += (valorVenda - custo) * quantidade;
          });

          this.cardsResumo[0].tituloMaior = quantidadeVendas.toString();
          this.cardsResumo[1].tituloMaior = 'R$ ' + valorArrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          this.cardsResumo[2].tituloMaior = 'R$ ' + valorLucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        });
      });
    }
    , error => {
      console.error('Erro ao buscar dados:', error);
      this.loading = false;
    });
    this.loading = false;

  }

}
