import axios from "axios";

describe("Api", () => {
  test("Deve criar um pedido com 3 produtos (com descrição, preço e quantidade) e calcular o valor total", async () => {
    const body = {
      cpf: "447.071.820-38",
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    const { data } = await axios.post("http://localhost:3000/checkout", body);
    expect(data.output.totalValue).toBe(60);
  });

  test("Deve criar um pedido com 3 produtos, associar um cupom de desconto e calcular o total (percentual sobre o total do pedido)", async () => {
    const body = {
      cpf: "447.071.820-38",
      coupon: "VALE10",
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    const { data } = await axios.post("http://localhost:3000/checkout", body);
    expect(data.output.totalValue).toBe(54);
  });

  test("Não deve criar um pedido com cpf inválido (lançar algum tipo de erro)", async () => {
    const body = {
      cpf: "999.999.999-99",
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    const { data } = await axios.post("http://localhost:3000/checkout", body);
    expect(data.message).toBe("O cpf deve ser válido");
  });
});
