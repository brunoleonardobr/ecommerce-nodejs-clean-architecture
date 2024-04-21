import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";
import SimulateFreight from "../src/SimulateFreight";

test("deve simular o frete", async () => {
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
  const productRepository = new ProductRepositoryDatabase();
  const simulateFreight = new SimulateFreight(productRepository);
  const output = await simulateFreight.execute(input);
  expect(output.freight).toBe(280);
});
