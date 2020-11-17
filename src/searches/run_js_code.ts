import { ZObject, Bundle } from "zapier-platform-core";
import vm2 from "vm2";
import moment from "moment";
import JSON from "json5";
import lodash from "lodash";
import jsonexport from "jsonexport";
import fetch from "node-fetch";
import * as CSV from "@fast-csv/parse";
import papa from "papaparse";

const runCode = async (code: string, inputData: any) => {
  const vm = new vm2.NodeVM({
    sandbox: {
      moment,
      JSON,
      _: lodash,
      toCSV: jsonexport,
      fetch,
      inputData,
      CSV,
      papa,
    },
  });

  const wrapper = `module.exports = (async function run() {
    let output;
    ${code}
    return output;
  })()`;

  const result = await vm.run(wrapper);

  return result;
};

const perform = async (z: ZObject, bundle: Bundle) => {
  const { code, inputData } = bundle.inputData;
  const result = await runCode(code, inputData);
  return result;
};

export default {
  key: "run_js_code",
  noun: "Code",
  display: {
    label: "Run JavaScript Code",
    description: "Runs JavaScript code",
  },
  operation: {
    inputFields: [
      {
        key: "inputData",
        label: "Input Data",
        dict: true,
        helpText:
          "What input data should we provide to your code (as strings) via an object set to a variable named `inputData`?",
      },
      async (z: ZObject, bundle: Bundle) => {
        return [
          {
            key: "code",
            label: "Code",
            type: "code",
            language: "javascript",
            default:
              '// this is wrapped in an `async` function\n// you can use await throughout the function\n\noutput = [{id: 123, hello: "world"}];',
            required: true,
          },
        ];
      },
    ],
    perform,
    sample: {
      id: 1,
    },
  },
};
