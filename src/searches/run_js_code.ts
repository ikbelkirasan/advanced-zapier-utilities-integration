import { ZObject, Bundle } from "zapier-platform-core";
import vm2 from "vm2";
import moment from "moment";
import JSON from "json5";
import lodash from "lodash";
import jsonexport from "jsonexport";
import fetch from "node-fetch";
// import XML from "xml2json";

const runCode = async (code: string, inputData: any) => {
  // const parseXML = (xml: string) => {
  //   const json = XML.toJson(xml);
  //   return JSON.parse(json);
  // };

  const vm = new vm2.NodeVM({
    sandbox: {
      moment,
      JSON,
      _: lodash,
      toCSV: jsonexport,
      fetch,
      // XML,
      // parseXML,
      inputData,
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
      },
      {
        key: "code",
        label: "Code",
        type: "string",
        required: true,
      },
    ],
    perform,
    sample: {
      id: 1,
    },
  },
};
