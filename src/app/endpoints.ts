import { environment } from "../environments/environment";

export class Endpoints {
  baseServidor: string = Endpoints.baseServidor();
  // public static baseServidor(): string { return environment.baseApi }
  public static baseServidor(): string { return '' }

  public baseCompany(): string {
    return `${this.baseServidor}/company`;
  }

  public baseCompanyComId(id: number): string {
    return `${this.baseServidor}/company/${id}`;
  }

  public baseCompanyComDoc(doc: number): string {
    return `${this.baseServidor}/company/doc/${doc}`;
  }

  public baseCompanyList(): string {
    return `${this.baseServidor}/company/list`;
  }

  public baseInternalTransfer(): string {
    return `${this.baseServidor}/InternalTransfer`;
  }

  public baseInternalTransferPage(size: number, page: number): string {
    return `${this.baseServidor}/InternalTransfer?PageSize=${size}&&PageNumber=${page}`;
  }

  public baseInternalTransferComId(id: number): string {
    return `${this.baseServidor}/InternalTransfer/${id}`;
  }

  public baseInternalCancelTransfer(id: number): string {
    return `${this.baseServidor}/InternalTransfer/${id}/cancel`;
  }

  public baseInternalTransferSend(id: number): string {
    return `${this.baseServidor}/InternalTransfer/${id}/send`;
  }

  public baseInternalTransferAfterSend(id: number): string {
    return `${this.baseServidor}/InternalTransfer/${id}/afterSend`;
  }

  public baseItemInternalTransfer(): string {
    return `${this.baseServidor}/InternalTransferItem`;
  }

  public baseDeleteItemInternalTransfer(id: number): string {
    return `${this.baseServidor}/InternalTransferItem/${id}`;
  }

  public baseDeleteInternalTransfer(id: number): string {
    return `${this.baseServidor}/InternalTransfer/${id}`;
  }

  public baseItemInternalTransferComTransferId(id: number, ean: number): string {
    return `${this.baseServidor}/InternalTransferItem?internalTransferId=${id}&productId=${ean}`;
  }

  public baseItemInternalTransferComTransferIdOnly(id: number): string {
    return `${this.baseServidor}/InternalTransferItem?internalTransferId=${id}`;
  }

  public baseItemInternalTransferComId(id: number): string {
    return `${this.baseServidor}/InternalTransferItem/${id}`;
  }

  public baseItemInternalTransferComIdAfter(id: number): string {
    return `${this.baseServidor}/InternalTransferItem/${id}/aftersend`;
  }

  public baseProduct(): string {
    return `${this.baseServidor}/Product`;
  }

  public baseProductComId(id: number): string {
    return `${this.baseServidor}/Product/${id}`;
  }

  public baseProductComEan(ean: any): string {
    return `${this.baseServidor}/Product/ean/${ean}`;
  }

  public baseProductList(): string {
    return `${this.baseServidor}/Product/list`;
  }

  public baseStockList(): string {
    return `${this.baseServidor}/Stock/list`;
  }

  public baseStock(): string {
    return `${this.baseServidor}/Stock`;
  }

  public baseStockCompany(companyId: number, productId: number): string {
    return `${this.baseServidor}/Stock/company/${companyId}/product/${productId}`;
  }

  public baseUser(): string {
    return `${this.baseServidor}/User`;
  }

  public baseUserMe(): string {
    return `${this.baseServidor}/User/me`;
  }

  public baseUserById(id: string): string {
    return `${this.baseServidor}/User/${id}`;
  }

  public baseUserPermissions(id: string): string {
    return `${this.baseServidor}/User/${id}/permissions`;
  }

  public baseUserActivate(id: number): string {
    return `${this.baseServidor}/User/${id}/activate`;
  }

  public baseUserDeactivate(id: number): string {
    return `${this.baseServidor}/User/${id}/deactivate`;
  }

  public baseUserRegister(): string {
    return `${this.baseServidor}/User/Register`;
  }

  public baseChangePasswordUser(id: string): string {
    return `${this.baseServidor}/User/${id}/change-password`;
  }

  public baseChangePasswordUserMe(): string {
    return `${this.baseServidor}/User/change-password`;
  }

  public baseUserLogin(): string {
    return `${this.baseServidor}/User/Login`;
  }

  public baseUserComId(id: number): string {
    return `${this.baseServidor}/User/${id}`;
  }

  public baseInfosacUsers(pageSize: number): string {
    return `${this.baseServidor}/InfosacUser?pageSize=${pageSize}`;
  }

  public baseInfosacUsersPost(): string {
    return `${this.baseServidor}/InfosacUser`;
  }
}
