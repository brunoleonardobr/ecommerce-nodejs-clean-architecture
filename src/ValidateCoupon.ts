import type CouponRepository from "./CouponRepository";
import type RepositoryFactory from "./RepositoryFactory";

export default class ValidateCoupon {
  couponRepository: CouponRepository;
  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.couponRepository = repositoryFactory.createCouponRepository();
  }
  async execute(code: string): Promise<Output> {
    const output = {
      isValid: false,
    };
    const coupon = await this.couponRepository.get(code);
    const today = new Date();
    output.isValid = coupon.isValid(today);
    return output;
  }
}

type Output = {
  isValid: boolean;
};
