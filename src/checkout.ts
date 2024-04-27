import CouponRepository from "./CouponRepository";
import FreightCalculator from "./FreightCalculator";
import Order from "./Order";
import OrderRepository from "./OrderRepository";
import ProductRepository from "./ProductRepository";
import RepositoryFactory from "./RepositoryFactory";

export default class Checkout {
  orderRepository: OrderRepository;
  productRepository: ProductRepository;
  couponRepository: CouponRepository;
  constructor(repositoryFactory: RepositoryFactory) {
    this.orderRepository = repositoryFactory.createOrderRepository();
    this.productRepository = repositoryFactory.createProductRepository();
    this.couponRepository = repositoryFactory.createCouponRepository();
  }
  async execute(input: Input): Promise<Output> {
    const sequence = await this.orderRepository.count();
    const order = new Order(input.idOrder, input.cpf, input.date, sequence + 1);
    for (const item of input.items) {
      const product = await this.productRepository.get(item.idProduct);
      order.addItem(product, item.quantity);
      if (input.from && input.to)
        order.freight += FreightCalculator.calculate(product) * item.quantity;
    }
    if (input.coupon) {
      const coupon = await this.couponRepository.get(input.coupon);
      if (coupon) order.addCoupon(coupon);
    }
    await this.orderRepository.save(order);
    return {
      freight: order.freight,
      total: order.getTotal(),
    };
  }
}

type Input = {
  idOrder?: string;
  cpf: string;
  items: { idProduct: number; quantity: number }[];
  from?: string;
  to?: string;
  date?: Date;
  coupon?: string;
  email?: string;
};

type Output = {
  freight: number;
  total: number;
};
