import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import DatabaseRepositoryFactory from "../src/infra/factory/DatabaseRepositoryFactory";
import MysqlPromiseAdapter from "../src/infra/database/MysqlPromiseAdapter";
import ValidateCoupon from "../src/application/usecase/ValidateCoupon";

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
