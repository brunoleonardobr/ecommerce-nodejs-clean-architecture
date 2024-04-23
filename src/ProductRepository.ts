import mysql from "mysql2/promise";

export default interface ProductRepository {
  get(idProduct: number): Promise<any>;
}
