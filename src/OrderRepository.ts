export default interface OrderRepository {
  get(idOrder:string): Promise<any>;
  save(order:any): any;
  clear (): Promise<void>
  count():Promise<number>
}
