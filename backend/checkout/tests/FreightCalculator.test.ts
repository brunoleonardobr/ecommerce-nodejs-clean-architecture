import FreightCalculator from "../src/domain/entity/FreightCalculator";
import Product from "../src/domain/entity/Product";

test("deve calcular o frete", () => {
  const product = new Product(1, "A", 1000, 100, 30, 10, 3);
  const freight = FreightCalculator.calculate(product);
  expect(freight).toBe(30);
});

test("deve calcular o frete minimo", () => {
  const product = new Product(1, "A", 1000, 100, 30, 10, 0.9);
  const freight = FreightCalculator.calculate(product);
  expect(freight).toBe(10);
});
