import DatabaseConnection from "./DatabaseConnection";
import mysql from "mysql2/promise";
export default class MysqlPromiseAdapter implements DatabaseConnection {
  connection: any;
  async connect(): Promise<void> {
    this.connection = await mysql.createConnection(
      `mysql://root:admin@localhost:3306/ecommerce`
    );
  }
  async query(statement: string, params: any): Promise<any> {
    return this.connection.execute(statement, params);
  }
  async close(): Promise<void> {
    this.connection.end();
  }
}
