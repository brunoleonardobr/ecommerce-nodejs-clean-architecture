import axios from "axios";

axios.defaults.validateStatus = () => {
  return true;
};

test("Não deve criar pedido com cpf inválido", async () => {
  const input = {
    cpf: "406.302.170-27",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.message).toBe("Invalid cpf");
});

test("Deve fazer um pedido com 3 items", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
      { productId: 3, quantity: 3 },
    ],
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

test("Deve fazer um pedido com 3 items com cupom de desconto", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
      { productId: 3, quantity: 3 },
    ],
    coupon: "VALE20",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.total).toBe(4872);
});

test("Não deve aplicar cupom de desconto expirado", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
      { productId: 3, quantity: 3 },
    ],
    coupon: "VALE10",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

test("Não deve aplicar cupom de desconto que não existe", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
      { productId: 3, quantity: 3 },
    ],
    coupon: "VALE0",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

test("Ao fazer um pedido, a quantidade de um item não pode ser negativa", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
      { productId: 3, quantity: -1 },
    ],
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.message).toBe("Invalid quantity");
});

test("Ao fazer um pedido, o mesmo item não pode ser informado mais de uma vez", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 1, quantity: 1 },
    ],
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.message).toBe("Duplicated item");
});

test("Nenhuma dimensão do item pode ser negativa", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
      { productId: 4, quantity: 3 },
    ],
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.message).toBe("Invalid dimensions");
});

test("O peso do item não pode ser negativo", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
      { productId: 5, quantity: 3 },
    ],
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.message).toBe("Invalid weight");
});

test("Deve calcular o valor do frete com base nas dimensões (altura, largura e profundidade em cm) e o peso dos produtos (em kg)", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
    ],
    from: "88015600",
    to: "22030060",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.subtotal).toBe(6000);
  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
});

test("Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
      { productId: 3, quantity: 3 },
    ],
    from: "88015600",
    to: "22030060",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.subtotal).toBe(6090);
  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
});
