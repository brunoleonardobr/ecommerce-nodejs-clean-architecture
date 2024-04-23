import type ProductRepository from "./ProductRepository";

export default class SimulateFreight {
  constructor(readonly productRepository: ProductRepository) {}
  async execute(input: Input): Promise<Output> {
    const output = {
      freight: 0,
    };
    for (const item of input.items) {
      if (input.from && input.to) {
        const product = await this.productRepository.get(item.idProduct);
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
    return output;
  }
}

type Input = {
  items: { idProduct: number; quantity: number }[];
  from?: string;
  to?: string;
};

type Output = {
  freight: number;
};
