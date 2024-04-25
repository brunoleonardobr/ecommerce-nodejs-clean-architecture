export default class Coupon {
  constructor(
    readonly code: string,
    readonly percentual: number,
    readonly expireDate: Date
  ) {}
  isValid(today: Date) {
    return this.expireDate.getTime() >= today.getTime();
  }
  calculateDiscount(amount: number) {
    return (amount * this.percentual) / 100;
  }
}
