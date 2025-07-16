export interface User {
  id: string;
  active: boolean;
  admin: boolean;
  claims: any[];
  email: string;
  phoneNumber: string;
  userName: string;
}
