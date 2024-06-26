import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UseCaseFactory";

//interface adapter
export default class HttpController {
  constructor(readonly httpServer: HttpServer, useCaseFactory: UseCaseFactory) {
    httpServer.on(
      "post",
      "/checkout",
      async (params: any, body: any, headers: any) => {
        const checkout = useCaseFactory.createCheckout();
        const output = await checkout.execute(body);
        return output;
      }
    );

    httpServer.on(
      "get",
      "/products",
      async (params: any, body: any, headers: any) => {
        const contentType = headers["content-type"];
        const getProducts = useCaseFactory.createGetProducts(contentType);
        const output = await getProducts.execute();
        return output;
      }
    );
  }
}
