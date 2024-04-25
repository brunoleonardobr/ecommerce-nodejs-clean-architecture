export default class Item {
  constructor(
    readonly idProduct: number,
    readonly price: number,
    readonly quantity: number
  ) {
    if (this.quantity <= 0) throw new Error("invalid quantity");
  }
  getTotal() {
    return this.price * this.quantity;
  }
}
