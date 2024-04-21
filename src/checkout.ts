import CouponRepository from "./CouponRepository";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import OrderRepository from "./OrderRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import { validate } from "./validateCpf";

export default class Checkout {
  constructor(
    readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
    readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
    readonly orderRepository: OrderRepository = new OrderRepositoryDatabase()
  ) {}
  async execute(input: Input): Promise<Output> {
    let output = {
      total: 0,
      subtotal: 0,
      freight: 0,
    };

    const { cpf, items, coupon, from, to } = input;
    if (validate(cpf)) {
      if (items) {
        for (const item of items) {
          if (item.quantity <= 0) throw new Error("Invalid quantity");
          const isProductDuplicated =
            items.filter((i: any) => i.productId === item.productId).length > 1;
          if (isProductDuplicated) throw new Error("Duplicated item");
          const product = await this.productRepository.get(item.productId);
          if (product.width <= 0 || product.height <= 0 || product.length <= 0)
            throw new Error("Invalid dimensions");
          if (product.weight <= 0) throw new Error("Invalid weight");
          const price = parseFloat(product.price) * item.quantity;
          output.subtotal += price;
          if (from && to) {
            const volume =
              (product.width / 100) *
              (product.height / 100) *
              (product.length / 100);
            const density = parseFloat(product.weight) / volume;
            let freight = volume * 1000 * (density / 100);
            freight = Math.max(10, freight);
            output.freight += freight * item.quantity;
          }
        }
      }
      output.total = output.subtotal;
      const today = input.date || new Date();
      if (coupon) {
        const couponData = await this.couponRepository.get(coupon);
        if (couponData && couponData.expire_date.getTime() >= today.getTime()) {
          output.total -=
            output.total * (parseFloat(couponData.percentual) / 100);
        }
      }
      output.total += output.freight;
      let sequence = await this.orderRepository.count();
      sequence++;
      const code = `${today.getFullYear()}${new String(sequence).padStart(
        8,
        "0"
      )}`;
      const order = {
        idOrder: input.idOrder,
        code,
        cpf: input.cpf,
        total: output.total,
        freight: output.freight,
        items: input.items,
      };
      await this.orderRepository.save(order);
      return output;
    } else throw new Error("Invalid cpf");
  }
}

type Input = {
  idOrder?: string;
  cpf: string;
  items: { productId: number; quantity: number }[];
  from?: string;
  to?: string;
  date?: Date;
  coupon?: string;
  email?: string;
};

type Output = {
  subtotal: number;
  freight: number;
  total: number;
};
