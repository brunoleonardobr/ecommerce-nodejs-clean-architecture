import Coupon from "../src/Coupon";

test("deve testar o cupom valido", async () => {
  const coupon = new Coupon("VALE20", 20, new Date("2023-10-01T10:00:00"));
  expect(coupon.isValid(new Date("2023-03-01T10:00:00"))).toBe(true);
});

test("deve testar o cupom inválido", async () => {
  const coupon = new Coupon("VALE20", 20, new Date("2023-03-01T10:00:00"));
  expect(coupon.isValid(new Date("2023-04-01T10:00:00"))).toBe(false);
});

test("deve calcular o desconto", async () => {
  const coupon = new Coupon("VALE20", 20, new Date("2023-10-01T10:00:00"));
  expect(coupon.calculateDiscount(1000)).toBe(200);
});
