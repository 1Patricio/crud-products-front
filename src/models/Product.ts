export interface Product {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  createdAt: Date;
  createdByUser: string
}