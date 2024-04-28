import Checkout from "./Checkout";
import CsvPresenter from "./CsvPresenter";
import GetProducts from "./GetProduct";
import JsonPresenter from "./JsonPresente";
import type Presenter from "./Presenter";
import type RepositoryFactory from "./RepositoryFactory";

export default class UseCaseFactory {
  constructor(readonly repositoryFactory: RepositoryFactory) {}

  createCheckout() {
    return new Checkout(this.repositoryFactory);
  }

  createGetProducts(type: string) {
    let presenter;
    if (type === "application/json") {
      presenter = new JsonPresenter();
    }
    if (type === "text/csv") {
      presenter = new CsvPresenter();
    }
    if (!presenter) throw new Error("Invalid type");
    return new GetProducts(this.repositoryFactory, presenter);
  }
}
