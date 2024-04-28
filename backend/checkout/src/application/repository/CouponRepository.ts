import Coupon from "../../domain/entity/Coupon";

export default interface CouponRepository {
  get(coupon: string): Promise<Coupon | undefined>;
}
