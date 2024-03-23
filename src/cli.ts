const input: {
  cpf: string;
  items: { idProduct: number; quantity: number }[];
  from?: string;
  to: string;
  coupon?: string;
} = {
  cpf: "",
  items: [],
};

process.stdin.on("data", (data) => {
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
    const checkout = new Checkout();
    try {
      const output = await checkout(input);
      console.log(output);
    } catch (error) {
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
