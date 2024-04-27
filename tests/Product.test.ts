import Product from "../src/Product";

test("Deve calcular o volume", () => {
  const product = new Product(1, "A", 1000, 100, 30, 10, 3);
  expect(product.getVolume()).toBe(0.03);
});

test("Deve calcular a densidade", () => {
  const product = new Product(1, "A", 1000, 100, 30, 10, 3);
  expect(product.getDensity()).toBe(100);
});

test("não deve criar produto com dimensoes invalidas", () => {
  expect(() => new Product(1, "A", 1000, -100, 30, 10, 3)).toThrow(
    new Error("invalid dimensions")
  );
});

test("não deve criar produto com peso invalido", () => {
  expect(() => new Product(1, "A", 1000, 100, 30, 10, -3)).toThrow(
    new Error("invalid weight")
  );
});
