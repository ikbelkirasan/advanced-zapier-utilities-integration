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
      csv: `id,name\n1000,John Doe`,
    });
  });

  it("should convert line items to CSV", async () => {
    const response = await runTest({
      inputType: "lineItems",
      lineItems: [
        {
          items: {
            id: "1000",
            name: "John Doe",
          },
        },
      ],
    });

    expect(response).toEqual({
      csv: `id,name\n1000,John Doe`,
    });
  });

  it("should change the delimiter", async () => {
    const response = await runTest({
      inputType: "lineItems",
      lineItems: [
        {
          items: {
            id: "1000",
            name: "John Doe",
          },
        },
      ],
      delimiter: "|",
    });

    expect(response).toEqual({
      csv: `id|name\n1000|John Doe`,
    });
  });

  it("should only output selected columns", async () => {
    const response = await runTest({
      inputType: "json",
      json: JSON.stringify([
        { id: 1000, name: "foo" },
        { id: 2000, name: "foo" },
      ]),
      columns: ["id"],
    });

    expect(response).toEqual({
      csv: `id\n1000\n2000`,
    });
  });

  it("should output a file url", async () => {
    const response = await runTest({
      inputType: "json",
      json: JSON.stringify([
        { id: 1000, name: "foo" },
        { id: 2000, name: "foo" },
      ]),
      columns: ["id"],
      fileOutput: true,
    });

    expect(response).toEqual({
      file: `hydrate|||{"type":"file","method":"hydrators.getCsvFile","bundle":{"url":"https://example.url/foobar"}}|||hydrate`,
    });
  });

  it("should change the endOfLine character", async () => {
    const response = await runTest({
      inputType: "lineItems",
      lineItems: [
        {
          items: {
            id: "1000",
            name: "John Doe",
          },
        },
        {
          items: {
            id: "2000",
            name: "Jane Doe",
          },
        },
      ],
      endOfLine: "\r\n",
    });

    expect(response).toEqual({
      csv: `id,name\r\n1000,John Doe\r\n2000,Jane Doe`,
    });
  });
});
