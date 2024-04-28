import CouponRepository from "./CouponRepository";
import Coupon from "./Coupon";
import DatabaseConnection from "./DatabaseConnection";

export default class CouponRepositoryDatabase implements CouponRepository {
  constructor(readonly connection: DatabaseConnection) {}
  async get(coupon: string) {
    const statement = `SELECT * FROM coupons WHERE coupon=?;`;
    const [couponData] = await this.connection.query(statement, [coupon]);
    if (!couponData[0]) return undefined;
    return new Coupon(
      couponData[0].code,
      parseFloat(couponData[0].percentual),
      couponData[0].expire_date
    );
  }
}
