import express, { Request, Response } from "express";
import { validate } from "./validateCpf";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());

app.post("/checkout", async (req: Request, res: Response) => {
  try {
    let output = {
      total: 0,
      subtotal: 0,
      freight: 0,
    };
    const { cpf, items, coupon, from, to } = req.body;
    if (validate(cpf)) {
      const connectionString = `mysql://root:admin@localhost:3306/ecommerce`;
      const connection = await mysql.createConnection(connectionString);
      if (items) {
        for (const item of items) {
          if (item.quantity <= 0) throw new Error("Invalid quantity");
          const isProductDuplicated =
            items.filter((i: any) => i.productId === item.productId).length > 1;
          if (isProductDuplicated) throw new Error("Duplicated item");
          const [products] = await connection.query<any>(
            `SELECT * FROM products WHERE id=?`,
            [item.productId]
          );
          const product = products[0];
          if (product.width <= 0 || product.height <= 0 || product.length <= 0)
            throw new Error("Invalid dimensions");
          if (product.weight <= 0) throw new Error("Invalid weight");
          const price = parseFloat(product.price) * parseInt(item.quantity);
          output.subtotal += price;
          if (from && to) {
            const volume =
              (product.width / 100) *
              (product.height / 100) *
              (product.length / 100);
            const density = parseFloat(product.weight) / volume;
            let freight = volume * 1000 * (density / 100);
            freight = Math.max(10, freight);
            output.freight += freight * item.quantity;
          }
        }
      }
      output.total = output.subtotal;
      if (coupon) {
        const values = [coupon];
        const statement = `SELECT * FROM coupons WHERE coupon=?;`;
        const [couponData] = await connection.query<any>(statement, values);
        const today = new Date();
        if (
          couponData[0] &&
          couponData[0].expire_date.getTime() >= today.getTime()
        ) {
          output.total -=
            output.total * (parseFloat(couponData[0].percentual) / 100);
        }
      }
      output.total += output.freight;
      res.json(output);
    } else res.json({ message: "Invalid cpf" });
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.listen(3000);
