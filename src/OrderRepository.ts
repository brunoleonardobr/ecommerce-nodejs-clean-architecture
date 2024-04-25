import type Order from "./Order";

export default interface OrderRepository {
  get(idOrder: string): Promise<any>;
  save(order: Order): any;
  clear(): Promise<void>;
  count(): Promise<number>;
}
