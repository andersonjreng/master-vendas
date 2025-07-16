export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  image: string;
}

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  image: string;
}
