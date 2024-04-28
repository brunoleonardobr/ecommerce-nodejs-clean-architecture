import DatabaseRepositoryFactory from "../src/infra/factory/DatabaseRepositoryFactory";
import GetProducts from "../src/application/usecase/GetProduct";
import JsonPresenter from "../src/infra/presenter/JsonPresenter";
import MysqlPromiseAdapter from "../src/infra/database/MysqlPromiseAdapter";

test("deve listar os produtos", async () => {
  const connection = new MysqlPromiseAdapter();
  await connection.connect();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  const getProducts = new GetProducts(repositoryFactory, new JsonPresenter());
  const output = await getProducts.execute();
  expect(output).toHaveLength(3);
  await connection.close();
});
