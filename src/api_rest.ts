import express, { Request, Response } from "express";
import Checkout from "./checkout";

const app = express();
app.use(express.json());

app.post("/checkout", async (req: Request, res: Response) => {
  const checkout = new Checkout();
  try {
    const output = await checkout.execute(req.body);
    res.status(200).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.listen(3000);
