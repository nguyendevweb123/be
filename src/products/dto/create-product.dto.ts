
export class CreateProductDto {
  name: string;
  quantity: number;
  price: number;
  category: string;
  status: 'active' | 'disable';
  image?: string; 
}
