import MysqlPromiseAdapter from "./infra/database/MysqlPromiseAdapter";
import DatabaseRepositoryFactory from "./infra/factory/DatabaseRepositoryFactory";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpController from "./infra/http/HttpController";
import UseCaseFactory from "./infra/factory/UseCaseFactory";

//main
const connection = new MysqlPromiseAdapter();
connection.connect();
const repositoryFactory = new DatabaseRepositoryFactory(connection);
const useCaseFactory = new UseCaseFactory(repositoryFactory);
const httpServer = new ExpressAdapter();
new HttpController(httpServer, useCaseFactory);
httpServer.listen(3000);
