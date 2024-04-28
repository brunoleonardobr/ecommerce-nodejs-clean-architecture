import Coupon from "./Coupon";

export default interface CouponRepository {
  get(coupon: string): Promise<Coupon | undefined>;
}
