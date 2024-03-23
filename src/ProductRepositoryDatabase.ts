import mysql from "mysql2/promise";

export default class ProductRepositoryDatabase
  implements ProductRepositoryDatabase
{
  async get(productId: number) {
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);
    const [products] = await connection.query<any>(
      `SELECT * FROM products WHERE id=?`,
      [productId]
    );
    connection.destroy();
    return products[0];
  }
}
