import mysql from "mysql2/promise";
import CouponRepository from "./CouponRepository";

export default class CouponRepositoryDatabase implements CouponRepository {
  async get(coupon: string) {
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);
    const statement = `SELECT * FROM coupons WHERE coupon=?;`;
    const [couponData] = await connection.query<any>(statement, [coupon]);
    connection.destroy();
    return couponData[0];
  }
}
