import DatabaseConnection from "../src/DatabaseConnection";
import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import MysqlPromiseAdapter from "../src/MysqlPromiseAdapter";
import ValidateCoupon from "../src/ValidateCoupon";

let validateCoupon: ValidateCoupon;
let connection: DatabaseConnection;
beforeEach(async () => {
  connection = new MysqlPromiseAdapter();
  await connection.connect();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  validateCoupon = new ValidateCoupon(repositoryFactory);
});
test("deve validar o cupom de desconto", async () => {
  const input = "VALE20";
  const output = await validateCoupon.execute(input);
  expect(output.isValid).toBe(true);
});

test("deve validar o cupom expirado", async () => {
  const input = "VALE10";

  const output = await validateCoupon.execute(input);
  expect(output.isValid).toBe(false);
});

afterEach(async () => {
  await connection.close();
});
