import mysql from "mysql2/promise";

export default interface CouponRepository {
  get(coupon: string): Promise<any>;
}
