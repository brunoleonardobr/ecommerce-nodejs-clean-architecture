import mysql from "mysql2/promise";
import CouponRepository from "./CouponRepository";
import Coupon from "./Coupon";

export default class CouponRepositoryDatabase implements CouponRepository {
  async get(coupon: string) {
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);
    const statement = `SELECT * FROM coupons WHERE coupon=?;`;
    const [couponData] = await connection.query<any>(statement, [coupon]);
    connection.destroy();
    return new Coupon(
      couponData[0].code,
      parseFloat(couponData[0].percentual),
      couponData[0].expire_date
    );
  }
}
