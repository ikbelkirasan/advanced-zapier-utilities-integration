import { ZObject, Bundle } from "zapier-platform-core";
import _ from "lodash";
import toCSV from "jsonexport";
import JSON from "json5";
import { getCsvFile } from "../hydrators/get_csv_file";

async function stashCsvFile(z: ZObject, csv: string) {
  if (process.env.NODE_ENV === "test") {
    return "https://example.url/foobar";
  }
  return z.stashFile(csv, csv.length, "output.csv", "text/csv");
}

const perform = async (z: ZObject, bundle: Bundle) => {
  const {
    inputType,
    json,
    lineItems,
    columns,
    delimiter = ",",
    fileOutput,
  } = bundle.inputData;
  let data;
  if (inputType === "json") {
    data = JSON.parse(json);
  } else if (inputType === "lineItems") {
    data = _.map(lineItems, item => {
      return item.items;
    });
  } else {
    throw new Error("Invalid input type");
  }

  if (!_.isEmpty(columns)) {
    data = _.map(data, item => _.pick(item, columns));
  }

  const output: { csv?: string; file?: string } = {};

  const csv = await toCSV(data, {
    rowDelimiter: delimiter,
  });

  if (fileOutput) {
    const url = await stashCsvFile(z, csv);
    output.file = (z as any).dehydrateFile(getCsvFile, { url });
  } else {
    output.csv = csv;
  }

  return output;
};

export default {
  key: "export_csv",
  noun: "CSV",
  display: {
    label: "Export to CSV",
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
      {
        key: "delimiter",
        label: "Delimiter",
        helpText: "Default: `,`",
      },
      {
        key: "fileOutput",
        type: "boolean",
        helpText: "Return the output as a file. Default: false",
      },
    ],
    perform,
    outputFields: [
      { key: "csv", type: "string" },
      { key: "file", type: "file" },
    ],
    sample: {
      csv: "HEAD1,HEAD2\nVAL1,VAL2\nVAL3,VAlL4",
      file: "",
    },
  },
};
