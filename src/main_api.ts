import Checkout from "./Checkout";
import MysqlPromiseAdapter from "./MysqlPromiseAdapter";
import DatabaseRepositoryFactory from "./DatabaseRepositoryFactory";
import ExpressAdapter from "./ExpressAdapter";
import HttpController from "./HttpController";
import UseCaseFactory from "./UseCaseFactory";

//main
const connection = new MysqlPromiseAdapter();
connection.connect();
const repositoryFactory = new DatabaseRepositoryFactory(connection);
const useCaseFactory = new UseCaseFactory(repositoryFactory);
const httpServer = new ExpressAdapter();
new HttpController(httpServer, useCaseFactory);
httpServer.listen(3000);
