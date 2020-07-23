import { version as platformVersion } from "zapier-platform-core";
import { version as appVersion } from "../package.json";
import runJsCode from "./searches/run_js_code";
import exportCSV from "./creates/export_csv";
import { getCsvFile } from "./hydrators/get_csv_file";

export default {
  version: appVersion,
  platformVersion,
  beforeRequest: [],
  afterResponse: [],
  triggers: {},
  searches: {
    [runJsCode.key]: runJsCode,
  },
  creates: {
    [exportCSV.key]: exportCSV,
  },
  hydrators: {
    getCsvFile,
  },
};
