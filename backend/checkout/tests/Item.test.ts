import Item from "../src/domain/entity/Item";
import Product from "../src/domain/entity/Product";

test("não deve criar item com quantidade invalida", () => {
  const product = new Product(1, "A", 1000, 100, 30, 10, 3);
  expect(() => new Item(product.idProduct, product.price, 0)).toThrow(
    new Error("invalid quantity")
  );
});
