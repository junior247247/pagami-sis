export interface Producto{
    id:string,
    codigo:string;
    description:string;
    precio:string;
    existencia:string;
    isSelected?:boolean;
    cant?:number;
    pCompra?:string;
    img?:string
  
}