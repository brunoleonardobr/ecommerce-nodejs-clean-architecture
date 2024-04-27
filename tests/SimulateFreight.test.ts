import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import SimulateFreight from "../src/SimulateFreight";

test("deve simular o frete", async () => {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    from: "88015600",
    to: "22030060",
  };
  const repositoryFactory = new DatabaseRepositoryFactory();
  const simulateFreight = new SimulateFreight(repositoryFactory);
  const output = await simulateFreight.execute(input);
  expect(output.freight).toBe(280);
});
