import { describe, appTester, App, mock } from "../helpers";

describe("Export CSV", () => {
  async function runTest(inputData: any) {
    const bundle: any = {
      inputData,
    };

    const response = await appTester(
      App.creates["export_csv"].operation.perform,
      bundle,
    );

    return response;
  }

  it("should convert json input to CSV", async () => {
    const response = await runTest({
      inputType: "json",
      json: `[{"id": "1000", "name": "John Doe"}]`,
    });

    expect(response).toEqual({
      output: `id,name\n1000,John Doe`,
    });
  });

  it("should convert line items to CSV", async () => {
    const response = await runTest({
      inputType: "lineItems",
      lineItems: [{ id: "1000", name: "John Doe" }],
    });

    expect(response).toEqual({
      output: `id,name\n1000,John Doe`,
    });
  });
});
