import type CouponRepository from "./CouponRepository";
import type OrderRepository from "./OrderRepository";
import type ProductRepository from "./ProductRepository";

export default interface RepositoryFactory {
  createOrderRepository(): OrderRepository;
  createProductRepository(): ProductRepository;
  createCouponRepository(): CouponRepository;
}
