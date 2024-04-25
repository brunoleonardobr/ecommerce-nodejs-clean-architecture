import mysql from "mysql2/promise";
import OrderRepository from "./OrderRepository";
import type Order from "./Order";

export default class OrderRepositoryDatabase implements OrderRepository {
  async count(): Promise<number> {
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);
    const [orders] = await connection.query<any>(
      `SELECT count(*) AS quant FROM orders;`
    );
    connection.destroy();
    return orders[0].quant;
  }
  async clear(): Promise<void> {
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);
    await connection.execute<any>(`DELETE FROM orders;`);
    connection.commit();
    connection.destroy();
  }
  async save(order: Order): Promise<void> {
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);
    await connection.execute<any>(
      `INSERT INTO orders (id_order, code, cpf, total, freight) VALUES (?, ?, ?, ?, ?);`,
      [
        order.idOrder,
        order.code,
        order.cpf.value,
        order.getTotal(),
        order.freight,
      ]
    );
    connection.commit();
    connection.destroy();
  }
  async get(idOrder: string): Promise<any> {
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);
    const [orders] = await connection.query<any>(
      `SELECT * FROM orders WHERE id_order = ?;`,
      [idOrder]
    );
    connection.destroy();
    return orders[0];
  }
}
