import DatabaseRepositoryFactory from "./DatabaseRepositoryFactory";
import MysqlPromiseAdapter from "./MysqlPromiseAdapter";
import UseCaseFactory from "./UseCaseFactory";

const input: {
  cpf: string;
  items: { idProduct: number; quantity: number }[];
  from?: string;
  to: string;
  coupon?: string;
} = {
  cpf: "",
  items: [],
  to: "",
};

process.stdin.on("data", async (data) => {
  const command = data.toString().replace(/\n/g, "");
  if (command.startsWith("set-cpf")) {
    input.cpf = command.replace("set-cpf ", "");
    console.log(input);
    return;
  }
  if (command.startsWith("add-item")) {
    console.log("add-item");
    const [idProduct, quantity] = command.replace("add-item ", "").split(" ");
    input.items.push({
      idProduct: parseInt(idProduct),
      quantity: parseInt(quantity),
    });
    console.log(input);
    return;
  }
  if (command.startsWith("checkout")) {
    console.log("checkout");
    const connection = new MysqlPromiseAdapter();
    connection.connect();
    const repositoryFactory = new DatabaseRepositoryFactory(connection);
    const useCaseFactory = new UseCaseFactory(repositoryFactory);
    const checkout = useCaseFactory.createCheckout();
    try {
      const output = await checkout.execute(input);
      console.log(output);
    } catch (error: any) {
      console.log(error.message);
    }
    return;
  }
  if (command.startsWith("quit")) {
    console.log("quit");
    process.exit();
  }
  console.log("invalid command");
});
