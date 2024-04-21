export default interface CouponRepository {
  get(coupon: string): Promise<any>;
}
