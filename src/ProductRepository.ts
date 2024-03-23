import mysql from "mysql2/promise";

export default interface ProductRepository {
  get(productId: number): Promise<any>;
}
