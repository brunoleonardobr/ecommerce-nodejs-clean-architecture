import express from "express";
import mysql from "mysql2/promise";
import { validate } from "./validateCpf";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/checkout", async (req, res) => {
  const { cpf, items, coupon } = req.body;

  try {
    if (!validate(cpf)) throw new Error("O cpf deve ser válido");

    let output = {
      totalValue: 0,
    };
    const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
    const connection = await mysql.createConnection(connectionString);

    if (items?.length > 0) {
      for (const item of items) {
        const values = [item.id];
        const statement = `SELECT * FROM products WHERE id=?`;
        const [products] = await connection.query<any>(statement, values);
        if (products?.length)
          output.totalValue += parseFloat(products[0].price);
      }
    }

    if (coupon) {
      const values = [coupon];
      const statement = `SELECT * FROM coupons WHERE coupon=?`;
      const [coupons] = await connection.query<any>(statement, values);
      if (coupons?.length)
        output.totalValue -=
          output.totalValue * (parseFloat(coupons[0].percentual) / 100);
    }
    res.json({ output });
  } catch (error: any) {
    console.log("error", error);
    res.send({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Ecommerce app listening port ${port}`);
});
