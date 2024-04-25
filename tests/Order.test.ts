import crypto from "crypto";
import Order from "../src/Order";
import Product from "../src/Product";
import Coupon from "../src/Coupon";

test("deve criar um pedido vazio", () => {
  const idOrder = crypto.randomUUID();
  const cpf = "407.302.170-27";
  const order = new Order(idOrder, cpf);
  expect(order.getTotal()).toBe(0);
});

test("não deve criar pedido com cpf invalido", () => {
  const idOrder = crypto.randomUUID();
  const cpf = "406.302.170-26";
  expect(() => new Order(idOrder, cpf)).toThrow(new Error("invalid cpf"));
});

test("deve criar um pedido com 3 itens", () => {
  const idOrder = crypto.randomUUID();
  const cpf = "407.302.170-27";
  const order = new Order(idOrder, cpf);
  order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1);
  order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22), 1);
  order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9), 3);
  expect(order.getTotal()).toBe(6090);
});

test("não deve adicionar item duplicado", () => {
  const idOrder = crypto.randomUUID();
  const cpf = "407.302.170-27";
  const order = new Order(idOrder, cpf);
  order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1);
  expect(() =>
    order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1)
  ).toThrow(new Error("duplicated item"));
});

test("deve criar um pedido e gerar o codigo", () => {
  const idOrder = crypto.randomUUID();
  const cpf = "407.302.170-27";
  const order = new Order(idOrder, cpf, new Date("2023-10-01T00:00:00"));
  expect(order.code).toBe("202300000001");
});

test("deve criar um pedido com 3 itens com desconto", () => {
  const idOrder = crypto.randomUUID();
  const cpf = "407.302.170-27";
  const order = new Order(idOrder, cpf);
  order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1);
  order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22), 1);
  order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9), 3);
  order.addCoupon(new Coupon("VALE20", 20, new Date("2025-10-01T00:00:00")));
  expect(order.getTotal()).toBe(4872);
});
