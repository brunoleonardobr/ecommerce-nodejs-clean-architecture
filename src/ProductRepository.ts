import mysql from "mysql2/promise";
import type Product from "./Product";

export default interface ProductRepository {
  get(idProduct: number): Promise<Product>;
}
