import Cpf from "../src/Cpf";

test("deve criar cpf valido", () => {
  const cpf = new Cpf("407.302.170-27");
  expect(cpf).toBeDefined();
});

test("não deve criar cpf invalido", () => {
  expect(() => new Cpf("406.302.170-26")).toThrow(new Error("invalid cpf"));
});
