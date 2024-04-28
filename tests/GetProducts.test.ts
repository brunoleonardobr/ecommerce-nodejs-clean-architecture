import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import GetProducts from "../src/GetProduct";
import JsonPresenter from "../src/JsonPresente";
import MysqlPromiseAdapter from "../src/MysqlPromiseAdapter";

test("deve listar os produtos", async () => {
  const connection = new MysqlPromiseAdapter();
  await connection.connect();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  const getProducts = new GetProducts(repositoryFactory, new JsonPresenter());
  const output = await getProducts.execute();
  expect(output).toHaveLength(3);
  await connection.close();
});
