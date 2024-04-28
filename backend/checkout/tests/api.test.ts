import axios from "axios";
test("deve listar os produtos em json", async () => {
  const response = await axios({
    url: "http://localhost:3000/products",
    headers: { "Content-Type": "application/json" },
  });
  const output = response.data;
  expect(output).toHaveLength(3);
  expect(output.at(0)?.idProduct).toBe(1);
  expect(output.at(1)?.idProduct).toBe(2);
  expect(output.at(2)?.idProduct).toBe(3);
});

test("deve listar os produtos em csv", async () => {
  const response = await axios({
    url: "http://localhost:3000/products",
    headers: { "Content-Type": "text/csv" },
  });
  const output = response.data;
  expect(output).toBe("1;A;1000.00\n2;B;5000.00\n3;C;30.00");
});
