import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private endpoints: Endpoints
  ) { }

  getCompanies(): Observable<any> {
    const urlCompany = `${this.endpoints.baseCompany()}?PageSize=500`
    return this.httpClient.get<any>(urlCompany);
  }

  postCompanies(dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseCompany()}`
    return this.httpClient.post<any>(urlCompany, dados);
  }

  getCompaniesComId(id: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseCompanyComId(id)}`
    return this.httpClient.get<any>(urlCompany);
  }

  putCompaniesComId(dados: any, id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseCompanyComId(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  getCompaniesComDoc(doc: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseCompanyComDoc(doc)}`
    return this.httpClient.get<any>(urlCompany);
  }

  postCompaniesList(dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseCompanyList()}`
    return this.httpClient.post<any>(urlCompany, dados);
  }

  postTransfer(user: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransfer()}`
    return this.httpClient.post<any>(urlCompany, user);
  }

  getTransfer(): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransfer()}?PageSize=500`
    return this.httpClient.get<any>(urlCompany);
  }

  getLastTransfer(): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransfer()}?PageSize=1`
    return this.httpClient.get<any>(urlCompany);
  }

  getTransferByStatus(status: string): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransfer()}?PageSize=500&status=${status}`
    return this.httpClient.get<any>(urlCompany);
  }

  getTransferPage(size: number, page: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransferPage(size, page)}`
    return this.httpClient.get<any>(urlCompany);
  }

  getTransferPageStatus(size: number, page: number, status: string, date: string, originId: number, destinyId: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransferPage(size, page)}&Status=${status}&date=${date}&originId=${originId}&destinyId=${destinyId}`
    return this.httpClient.get<any>(urlCompany);
  }


  getTransferComId(id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransferComId(id)}`
    return this.httpClient.get<any>(urlCompany);
  }

  putTransferComId(id: number, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransferComId(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  putCancelTransfer(id: number, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalCancelTransfer(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  putSendTransfer(id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransferSend(id)}`
    return this.httpClient.put<any>(urlCompany, null);
  }

  putAfterSendTransfer(id: number, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseInternalTransferAfterSend(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  postItemTransfer(user: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseItemInternalTransfer()}`
    return this.httpClient.post<any>(urlCompany, user);
  }

  getItemTransfer(): Observable<any> {
    const urlCompany = `${this.endpoints.baseItemInternalTransfer()}?PageSize=500`
    return this.httpClient.get<any>(urlCompany);
  }

  getItemTransferByStatus(status: string): Observable<any> {
    const urlCompany = `${this.endpoints.baseItemInternalTransfer()}?status=${status}&PageSize=500`
    return this.httpClient.get<any>(urlCompany);
  }

  deleteItemTransfer(id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseDeleteItemInternalTransfer(id)}`
    return this.httpClient.delete<any>(urlCompany);
  }

  deleteTransfer(id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseDeleteInternalTransfer(id)}`
    return this.httpClient.delete<any>(urlCompany);
  }

  getItemTransferComTransferId(id: number, ean: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseItemInternalTransferComTransferId(id, ean)}`
    return this.httpClient.get<any>(urlCompany);
  }

  getItemTransferComTransferIdOnly(id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseItemInternalTransferComTransferIdOnly(id)}`
    return this.httpClient.get<any>(urlCompany);
  }

  getItemTransferComTransferIdOnlyPage(id: number, pageSize: number, pageNumber: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseItemInternalTransferComTransferIdOnly(id)}&PageSize=${pageSize}&PageNumber=${pageNumber}`
    return this.httpClient.get<any>(urlCompany);
  }

  getItemTransferComId(id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseItemInternalTransferComId(id)}`
    return this.httpClient.get<any>(urlCompany);
  }

  putItemTransferComId(id: number, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseItemInternalTransferComId(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  putAfterItemTransferComId(id: number, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseItemInternalTransferComIdAfter(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  getProduct(): Observable<any> {
    const urlCompany = `${this.endpoints.baseProduct()}?PageSize=500`
    return this.httpClient.get<any>(urlCompany);
  }

  getProductByName(description: string, pageSize: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseProduct()}?description=${description}&PageNumber=${pageSize}`
    return this.httpClient.get<any>(urlCompany);
  }

  postProduct(dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseProduct()}`
    return this.httpClient.post<any>(urlCompany, dados);
  }

  getProductComId(id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseProductComId(id)}`
    return this.httpClient.get<any>(urlCompany);
  }

  getProductComEan(ean: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseProductComEan(ean)}`
    return this.httpClient.get<any>(urlCompany);
  }

  putProductComId(dados: any, id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseProductComId(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  postProductList(dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseProductList()}`
    return this.httpClient.post<any>(urlCompany, dados);
  }

  getStock(): Observable<any> {
    const urlCompany = `${this.endpoints.baseStock()}`
    return this.httpClient.get<any>(urlCompany);
  }

  postStockList(dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseStockList()}`
    return this.httpClient.post<any>(urlCompany, dados);
  }

  putStockCompany(dados: any, companyId: number, productId: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseStockCompany(companyId, productId)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  getUser(): Observable<any> {
    const urlCompany = `${this.endpoints.baseUser()}`
    return this.httpClient.get<any>(urlCompany);
  }

  getUserMe(): Observable<any> {
    const urlCompany = `${this.endpoints.baseUserMe()}`
    return this.httpClient.get<any>(urlCompany);
  }

  postUserRegister(dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseUserRegister()}`
    return this.httpClient.post<any>(urlCompany, dados);
  }

  changePasswordUser(id: string, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseChangePasswordUser(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  changePasswordUserMe(dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseChangePasswordUserMe()}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  postUserLogin(dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseUserLogin()}`
    return this.httpClient.post<any>(urlCompany, dados);
  }

  putUserById(id: string, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseUserById(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  putUserPermissions(id: string, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseUserPermissions(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  putUserActivate(id: number, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseUserActivate(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  putUserDeactivate(id: number, dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseUserDeactivate(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  getUserComId(id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseUserComId(id)}`
    return this.httpClient.get<any>(urlCompany);
  }

  putUser(dados: any, id: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseUserComId(id)}`
    return this.httpClient.put<any>(urlCompany, dados);
  }

  getInfosacUsers(pageSize: number): Observable<any> {
    const urlCompany = `${this.endpoints.baseInfosacUsers(pageSize)}`
    return this.httpClient.get<any>(urlCompany);
  }

  postInfosacUsers(dados: any): Observable<any> {
    const urlCompany = `${this.endpoints.baseInfosacUsersPost()}`
    return this.httpClient.post<any>(urlCompany, dados);
  }


}
