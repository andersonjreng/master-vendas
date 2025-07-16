export interface Product {
  id: number
  price: number
  ean: string
  description: string
  unitId: string
  isActive: boolean
}

export class ProductDTO implements Product {
  id: number
  price: number
  ean: string
  description: string
  unitId: string
  isActive: boolean

  constructor(item: Product) {
    this.id = item.id;
    this.price = item.price;
    this.ean = item.ean;
    this.description = item.description;
    this.unitId = item.unitId;
    this.isActive = item.isActive;
  }
}
