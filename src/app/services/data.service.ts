import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atendimentos } from '../interfaces/atendimentos';
import { Saidas } from '../interfaces/saidas';
import { environment } from '@/src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost/master-api';
  


  constructor(private http: HttpClient) { }

  getData(dataInicio: string, dataFim: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_data.php?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }
  
  getTelefonia(dataInicio: string, dataFim: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_telefonia.php?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  getTelefoniaDesc(dataInicio: string, dataFim: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_telefonia_desc.php?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  changeStatusTelefonia(id: any, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change_status_telefonia.php/${id}`, dados);
  }

  changeStatusUser(id: any, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_ativo_user.php/${id}`, dados);
  }

  updateTelefonia(id: any, dados: Atendimentos): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_telefonia.php/${id}`, dados);
  }
  
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_users.php`);
  }

  getAnydesk(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_anydesk.php`);
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_me.php`);
  }

  getCasos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_casos.php`);
  }

  getLogin(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_login.php`);
  }

  getLoginLiberacoes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_login_liberacoes.php`);
  }

  addCasos(casos: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_casos.php`, casos);
  }

  addTelefonia(telefonia: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert_telefonia.php`, telefonia);
  }

  addLogin(login: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert_login.php`, login);
  }

  deleteCasos(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_casos.php/${id}`);
  }

  getUsinas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_usinas.php`);
  }

  getSolicitacoesRh(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_cargos_rh.php`);
  }

  getSolicitacoesRhMatriz(niveis: string[]): Observable<any> {
    let params = new HttpParams();

    if (niveis && niveis.length > 0) {
      // Join the array into a comma-separated string
      params = params.append('niveis', niveis.join(','));
    }
    return this.http.get<any>(`${this.apiUrl}/get_cargos_matriz.php`, { params: params });
  }

  addUsinas(usinas: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_usinas.php`, usinas);
  }

  deleteUsinas(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_usina.php/${id}`);
  }

  addCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_categoria_saida.php`, categoria);
  }

  sendEmail(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sendEmail.php`, data);
  }

  deleteCategoria(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_categoria_saida.php/${id}`);
  }

  getCategorias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_categoria_saida.php`);
  }

  addAtendimento(atendimento: Atendimentos): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert_data.php`, atendimento);
  }

  addCargo(cargo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_cargo_rh.php`, cargo);
  }

  addAnydesk(anydesk: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert_anydesk.php`, anydesk);
  }

  deleteAnydesk(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_anydesk.php/${id}`);
  }

  deleteLogin(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_login.php/${id}`);
  }

  deleteAtendimento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_data.php/${id}`);
  }

  updateData(id: any, dados: Atendimentos): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_data.php/${id}`, dados);
  }

  updateSolicitacaoRh(id: any, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_cargos_rh.php/${id}`, dados);
  }

  updateFinalizarCargo(id: any, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_finalizar_cargo.php/${id}`, dados);
  }

  updateAnydesk(id: any, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_anydesk.php/${id}`, dados);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_user.php`, user);
  }

  updateUser(id: any, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_user.php/${id}`, dados);
  }

  // getSaidas(dataInicio: string, dataFim: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/get_saidas.php?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  // }

  addSaidas(atendimento: Saidas): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert_saidas.php`, atendimento);
  }

  updateSaida(id: any, dados: Saidas): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_saidas.php/${id}`, dados);
  }

  deleteSaida(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_saida.php/${id}`);
  }

  addFaqs(faqs: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert_faqs.php`, faqs);
  }

  getFaqs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_faqs.php`);
  }

  deleteFaqs(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_faqs.php/${id}`);
  }

  getPermissions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_permissions.php`);
  }

  //Liberações

  getChamadosLiberacoes(dataInicio: string, dataFim: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_chamados_liberacoes.php?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  getChamadosMonitoramento(dataInicio: string, dataFim: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_chamados_monitoramento.php?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  updateMonitoramento(id: any, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_chamados_monitoramento.php/${id}`, dados);
  }

  addChamadoLiberacoes(atendimento: Atendimentos): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert_chamados_liberacoes.php`, atendimento);
  }

  addChamadoMonitoramento(registro: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert_chamados_monitoramento.php`, registro);
  }

  deleteChamadoMonitoramento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_chamados_monitoramento.php/${id}`);
  }

  deleteChamadoLiberacoes(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_chamados_liberacoes.php/${id}`);
  }

  updateChamadosLiberacoes(id: any, dados: Atendimentos): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_chamados_liberacoes.php/${id}`, dados);
  }

  getCasosLiberacoes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_casos_liberacoes.php`);
  }

  deleteCasosLiberacoes(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_casos_liberacoes.php/${id}`);
  }

  addCasosLiberacoes(atendimento: Atendimentos): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert_casos_liberacoes.php`, atendimento);
  }

  getTiposComprovantes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_tipos_comprovantes.php`);
  }

  getVerificados(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_verificados.php`);
  }

  addVerificados(idVerificado: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_verificados.php`, idVerificado);
  }

  addSomaVerificado(dataVerificado: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_soma_verificado.php`, dataVerificado);
  }

  getSomaVerificado(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_soma_verificado.php`);
  }

  getProgresso(id_user: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_progresso_cursos.php?id_user=${id_user}`);
  }

  // novos endpoints

  getProdutos(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/getProdutos.php`);
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/getClientes.php`);
  }

  getClientesAtivos(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/getClientesAtivos.php`);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/getUsuarios.php`);
  }

  getFormasPagamento(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/getFormasPagamento.php`);
  }

  postSaidas_produtos(saida: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/postSaidas_produtos.php`, saida);
  }

  getSaidas(filtro: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/getSaidas.php`, filtro);
  }

  getSaidasProdutos(filtro: any) {
    return this.http.post<any[]>(`${this.apiUrl}/getSaidas_produtos.php`, filtro);
  }

  postProdutos(produto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/postProdutos.php`, produto);
  }

  putProduto(produto: any): Observable<any> { 
    return this.http.put<any>(`${this.apiUrl}/putProduto.php`, produto);
  }

  deleteProduto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteProduto.php/${id}`);
  }

  postClientes(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/postClientes.php`, cliente);
  }

  getEmpresas(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/getEmpresas.php`);
  }

  postUsuarios(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/postUsuarios.php`, usuario);
  }

  putCliente(cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/putCliente.php`, cliente);
  }

  putUsuario(usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/putUsuario.php`, usuario);
  }

 

}
