import { ZObject, Bundle } from "zapier-platform-core";
import vm2 from "vm2";
import _ from "lodash";

const perform = async (z: ZObject, bundle: Bundle) => {
  const { keyProperty, valueProperty, entries } = bundle.inputData;

  const vm = new vm2.NodeVM({
    wrapper: "commonjs",
    sandbox: {
      True: true,
      False: false,
      None: null,
    },
  });

  const items = _.map(entries, entry => {
    return vm.run(`module.exports = ${entry}`);
  });

  const result: {
    [key: string]: any;
  } = {};

  _.each(items, (item: any) => {
    const key = item[keyProperty];
    const value = item[valueProperty];
    result[key] = value;
  });

  return result;
};

export default {
  key: "convert_pairs_to_object",
  noun: "Object",
  display: {
    label: "Convert Key-Value pairs to Object",
    description: "Convert a list of key-value pairs to an object",
  },
  operation: {
    inputFields: [
      {
        key: "keyProperty",
        required: true,
      },
      {
        key: "valueProperty",
        required: true,
      },
      {
        key: "entries",
        label: "Entries",
        list: true,
        required: true,
      },
    ],
    perform,
    sample: {
      foo: "bar",
    },
  },
};
