import mysql from "mysql2/promise";
import ProductRepository from "./ProductRepository";
import Product from "./Product";

export default class ProductRepositoryDatabase implements ProductRepository {
  async get(idProduct: number) {
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);
    const [products] = await connection.query<any>(
      `SELECT * FROM products WHERE id = ?`,
      [idProduct]
    );
    connection.destroy();
    return new Product(
      products[0].id,
      products[0].description,
      parseFloat(products[0].price),
      products[0].width,
      products[0].height,
      products[0].length,
      parseFloat(products[0].weight)
    );
  }
}
