import { ZObject, Bundle } from "zapier-platform-core";
import toCSV from "jsonexport";
import JSON from "json5";

const perform = async (z: ZObject, bundle: Bundle) => {
  const { inputType, json, lineItems } = bundle.inputData;
  let obj;
  if (inputType === "json") {
    obj = JSON.parse(json);
  } else if (inputType === "lineItems") {
    obj = lineItems;
  } else {
    throw new Error("Invalid input type");
  }

  const output = await toCSV(obj);
  return {
    output,
  };
};

export default {
  key: "export_csv",
  noun: "CSV",
  display: {
    label: "Export CSV",
    description: "Converts input data to CSV",
  },
  operation: {
    inputFields: [
      {
        key: "inputType",
        label: "Input Type",
        choices: {
          json: "JSON",
          lineItems: "Line Items",
        },
        default: "json",
        altersDynamicFields: true,
      },
      (z: ZObject, bundle: Bundle) => {
        const { inputType } = bundle.inputData;
        switch (inputType) {
          case "json":
            return [
              {
                key: "json",
                label: "JSON data",
                type: "string",
                required: true,
              },
            ];
          case "lineItems":
            return [
              {
                key: "lineItems",
                label: "Line Items",
                children: [
                  {
                    key: "items",
                    label: "Items",
                    dict: true,
                  },
                ],
              },
            ];
        }
      },
      {
        key: "columns",
        label: "Columns",
        list: true,
        helpText: "If left unpopulated, all columns will be included",
      },
    ],
    perform,
    sample: {
      id: 1,
    },
  },
};
