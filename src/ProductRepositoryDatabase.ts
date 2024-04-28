import ProductRepository from "./ProductRepository";
import Product from "./Product";
import DatabaseConnection from "./DatabaseConnection";

export default class ProductRepositoryDatabase implements ProductRepository {
  constructor(readonly connection: DatabaseConnection) {}
  async list(): Promise<Product[]> {
    const [productData] = await this.connection.query(
      `SELECT * FROM products;`
    );
    const products: Product[] = [];
    for (const product of productData) {
      products.push(
        new Product(
          product.id,
          product.description,
          product.price,
          product.width,
          product.height,
          product.length,
          product.weight
        )
      );
    }
    return products;
  }
  async get(idProduct: number) {
    const [products] = await this.connection.query(
      `SELECT * FROM products WHERE id = ?`,
      [idProduct]
    );
    return new Product(
      products[0].id,
      products[0].description,
      parseFloat(products[0].price),
      products[0].width,
      products[0].height,
      products[0].length,
      parseFloat(products[0].weight)
    );
  }
}
