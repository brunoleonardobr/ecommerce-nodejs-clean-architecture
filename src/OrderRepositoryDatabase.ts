import OrderRepository from "./OrderRepository";
import Order from "./Order";
import DatabaseConnection from "./DatabaseConnection";

export default class OrderRepositoryDatabase implements OrderRepository {
  constructor(readonly connection: DatabaseConnection) {}
  async count(): Promise<number> {
    const [orders] = await this.connection.query(
      `SELECT count(*) AS quant FROM orders;`
    );
    return orders[0].quant;
  }
  async clear(): Promise<void> {
    await this.connection.query(`DELETE FROM orders;`);
  }
  async save(order: Order): Promise<void> {
    await this.connection.query(
      `INSERT INTO orders (id_order, code, cpf, total, freight) VALUES (?, ?, ?, ?, ?);`,
      [
        order.idOrder,
        order.code,
        order.cpf.value,
        order.getTotal(),
        order.freight,
      ]
    );
  }
  async get(idOrder: string): Promise<any> {
    const [orders] = await this.connection.query(
      `SELECT * FROM orders WHERE id_order = ?;`,
      [idOrder]
    );
    return orders[0];
  }
}
