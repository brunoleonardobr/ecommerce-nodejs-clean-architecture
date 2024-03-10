import { validate } from "../src/validateCpf";

describe("Validate", () => {
  test.each(["447.071.820-38", "44707182038"])(
    "Deve ser um cpf válido",
    (cpf: string) => {
      expect(validate(cpf)).toBe(true);
    }
  );

  test.each(["447.071.820-3", "999.999.999-99", ""])(
    "Deve ser um cpf inválido",
    (cpf: string) => {
      expect(validate(cpf)).toBe(false);
    }
  );
});
