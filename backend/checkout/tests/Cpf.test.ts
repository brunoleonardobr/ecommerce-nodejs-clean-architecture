import Cpf from "../src/domain/entity/Cpf";

test.each(["447.071.820-38", "44707182038"])(
  "Deve ser um cpf válido",
  (cpf: string) => {
    expect(cpf).toBeDefined();
  }
);

test.each(["447.071.820-3", "999.999.999-99", ""])(
  "Deve ser um cpf inválido",
  (cpf: string) => {
    expect(() => new Cpf(cpf)).toThrow(new Error("invalid cpf"));
  }
);
