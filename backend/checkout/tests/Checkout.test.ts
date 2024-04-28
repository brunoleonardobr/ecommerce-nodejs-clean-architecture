import crypto from "crypto";
import GetOrder from "../src/application/usecase/GetOrder";
import OrderRepositoryDatabase from "../src/infra/database/OrderRepositoryDatabase";
import DatabaseRepositoryFactory from "../src/infra/factory/DatabaseRepositoryFactory";
import MysqlPromiseAdapter from "../src/infra/database/MysqlPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import Checkout from "../src/application/usecase/Checkout";

let checkout: Checkout;
let getOrder: GetOrder;
let connection: DatabaseConnection;

beforeEach(async () => {
  connection = new MysqlPromiseAdapter();
  await connection.connect();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  checkout = new Checkout(repositoryFactory);
  getOrder = new GetOrder(repositoryFactory);
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

  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
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
  const connection = new MysqlPromiseAdapter();
  await connection.connect();
  let orderRepository = new OrderRepositoryDatabase(connection);
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

afterEach(async () => {
  await connection.close();
});
