export interface Product {
    id?: number;
    product?: string;
    description?: string;
    qty?: number;
    price?: number;
  
    store?: string;
  
    orderdate?: Date;
  
    ordernr?: string;
  
    tags?: Array<string>;
  
    img?: string;
  
    manu?: string;
  
    model?: string;
  
    category?: string;
  
    active?: boolean;

}