import axios from "axios";
import Checkout from "../src/Checkout";

import ProductRepository from "../src/ProductRepository";
import CouponRepository from "../src/CouponRepository";
import crypto from "crypto";
import GetOrder from "../src/GetOrder";
import OrderRepositoryDatabase from "../src/OrderRepositoryDatabase";

axios.defaults.validateStatus = () => {
  return true;
};

let checkout: Checkout;
let getOrder: GetOrder;
let orderRepository: OrderRepositoryDatabase;
let productRepository: ProductRepository;
let couponRepository: CouponRepository;

beforeEach(() => {
  const products: any = {
    1: {
      idProduct: 1,
      description: "A",
      price: 1000,
      width: 100,
      height: 30,
      length: 10,
      weight: 3,
    },
    2: {
      idProduct: 2,
      description: "B",
      price: 5000,
      width: 50,
      height: 50,
      length: 50,
      weight: 22,
    },
    3: {
      idProduct: 3,
      description: "C",
      price: 30,
      width: 10,
      height: 10,
      length: 10,
      weight: 0.9,
    },
    4: {
      idProduct: 4,
      description: "D",
      price: 1000,
      width: -100,
      height: 30,
      length: 10,
      weight: 3,
    },
    5: {
      idProduct: 5,
      description: "E",
      price: 1000,
      width: 100,
      height: 30,
      length: 10,
      weight: -3,
    },
  };
  productRepository = {
    async get(idProduct: number): Promise<any> {
      return products[idProduct];
    },
  };
  const coupons: any = {
    VALE10: {
      percentual: 10,
      expire_date: new Date(2023, 0, 1),
    },
    VALE20: {
      percentual: 20,
      expire_date: new Date(2025, 12, 1),
    },
  };
  couponRepository = {
    async get(coupon: string): Promise<any> {
      return coupons[coupon];
    },
  };

  orderRepository = new OrderRepositoryDatabase();
  checkout = new Checkout(productRepository, couponRepository, orderRepository);
  getOrder = new GetOrder(orderRepository);
});

test("Não deve criar pedido com cpf inválido", async () => {
  const input = {
    cpf: "406.302.170-27",
    items: [],
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid cpf")
  );
});

test("Deve fazer um pedido com 3 items", async () => {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(6090);
});

test("Deve fazer um pedido com 3 items com cupom de desconto", async () => {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: "VALE20",
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(4872);
});

test("Não deve aplicar cupom de desconto expirado", async () => {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: "VALE10",
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(6090);
});

test("Não deve aplicar cupom de desconto que não existe", async () => {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: "VALE0",
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(6090);
});

test("Ao fazer um pedido, a quantidade de um item não pode ser negativa", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: -1 },
    ],
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid quantity")
  );
});

test("Ao fazer um pedido, o mesmo item não pode ser informado mais de uma vez", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 1, quantity: 1 },
    ],
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Duplicated item")
  );
});

test("Nenhuma dimensão do item pode ser negativa", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 4, quantity: 3 },
    ],
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid dimensions")
  );
});

test("O peso do item não pode ser negativo", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 5, quantity: 3 },
    ],
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid weight")
  );
});

test("Deve calcular o valor do frete com base nas dimensões (altura, largura e profundidade em cm) e o peso dos produtos (em kg)", async () => {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
    ],
    from: "88015600",
    to: "22030060",
  };
  const output = await checkout.execute(input);
  expect(output.subtotal).toBe(6000);
  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
});

test("Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado", async () => {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    from: "88015600",
    to: "22030060",
  };
  const output = await checkout.execute(input);
  expect(output.subtotal).toBe(6090);
  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
});

test("Deve fazer um pedido com 3 items com envio de email", async () => {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    email: "john.doe@mail.com",
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(6090);
});

test("Deve fazer um pedido, salvando no banco de dados", async () => {
  const idOrder = await crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
  };
  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.total).toBe(6090);
});

test("Deve fazer um pedido, e gerar o codigo do pedido", async () => {
  await orderRepository.clear();
  await checkout.execute({
    idOrder: crypto.randomUUID(),
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    date: new Date("2022-01-01T10:00:00"),
  });
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    date: new Date("2022-01-01T10:00:00"),
  };
  await checkout.execute(input);
  const output = await getOrder.execute(input.idOrder);
  expect(output.code).toBe(`202200000002`);
});
