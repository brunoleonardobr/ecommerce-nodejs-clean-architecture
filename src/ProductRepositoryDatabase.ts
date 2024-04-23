import mysql from "mysql2/promise";
import ProductRepository from "./ProductRepository";

export default class ProductRepositoryDatabase implements ProductRepository {
  async get(idProduct: number) {
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);
    const [products] = await connection.query<any>(
      `SELECT * FROM products WHERE id=?`,
      [idProduct]
    );
    connection.destroy();
    return products[0];
  }
}
