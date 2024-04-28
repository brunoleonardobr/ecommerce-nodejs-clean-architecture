import Product from "../../domain/entity/Product";

export default interface ProductRepository {
  get(idProduct: number): Promise<Product>;
  list(): Promise<Product[]>;
}
