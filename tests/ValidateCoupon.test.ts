import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import ValidateCoupon from "../src/ValidateCoupon";

test("deve validar o cupom de desconto", async () => {
  const input = "VALE20";
  const repositoryFactory = new DatabaseRepositoryFactory();
  const validateCoupon = new ValidateCoupon(repositoryFactory);
  const output = await validateCoupon.execute(input);
  expect(output.isValid).toBe(true);
});

test("deve validar o cupom expirado", async () => {
  const input = "VALE10";
  const repositoryFactory = new DatabaseRepositoryFactory();
  const validateCoupon = new ValidateCoupon(repositoryFactory);
  const output = await validateCoupon.execute(input);
  expect(output.isValid).toBe(false);
});
