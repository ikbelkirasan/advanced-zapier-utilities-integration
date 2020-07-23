import { describe, appTester, App, mock } from "../helpers";

describe("Run JavaScript Code", () => {
  async function runTest(inputData: any) {
    const bundle: any = {
      inputData,
    };

    const response = await appTester(
      App.searches["run_js_code"].operation.perform,
      bundle,
    );
    return response;
  }

  it("moment should work", async () => {
    const response = await runTest({
      inputData: {
        format: "YYYY-MM-DD",
      },
      code: `
      output = [{
        date: moment().format(inputData.format)
      }]`,
    });
    expect(response).toEqual([
      {
        date: "2020-01-01",
      },
    ]);
  });

  it("lodash should work", async () => {
    const response = await runTest({
      inputData: {
        key: "a.b.c",
      },
      code: `
      const o = {
        a: {
          b: {
            c: 1,
          }
        }
      }
      output = [{
        data: _.get(o, inputData.key)
      }]`,
    });
    expect(response).toEqual([
      {
        data: 1,
      },
    ]);
  });

  it("JSON5 should work", async () => {
    const response = await runTest({
      inputData: {
        input: `[{a: 1, 'b': 'c', "d": "3"}]`,
      },
      code: `
      const o = {
        a: {
          b: {
            c: 1,
          }
        }
      }
      output = [{
        data: JSON.parse(inputData.input)
      }]`,
    });
    expect(response).toEqual([
      {
        data: [
          {
            a: 1,
            b: "c",
            d: "3",
          },
        ],
      },
    ]);
  });

  it("JSON to CSV should work", async () => {
    const response = await runTest({
      inputData: {
        input: `[{"id": "1000", "name": "John Doe"}]`,
      },
      code: `
      const items = JSON.parse(inputData.input);
      const csv = await toCSV(items);
      output = [{
        csv
      }]
      `,
    });
    expect(response).toEqual([
      {
        csv: `id,name\n1000,John Doe`,
      },
    ]);
  });

  it.skip("XML<->JSON parsing/serializing should work", async () => {
    const response = await runTest({
      inputData: {
        xml: `<?xml version="1.0"?>
<root>
  <foo>Hello</foo>
  <bar key="value">complex</bar>
</root>
`,
        json: `{"root": {"foo":"bar"}}`,
      },
      code: `
      const json = parseXML(inputData.xml);
      const xml = XML.toXml(inputData.json);
      output = [{
        json,
        xml,
      }]
      `,
    });
    expect(response).toEqual([
      {
        json: {
          root: {
            foo: "Hello",
            bar: {
              $t: "complex",
              key: "value",
            },
          },
        },
        xml: `<root foo="bar"></root>`,
      },
    ]);
  });
});
