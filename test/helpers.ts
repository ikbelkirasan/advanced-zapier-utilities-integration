import config from "../src/config";
import nock from "nock";
import mockData from "mockdate";
import zapier from "zapier-platform-core";
import App from "../src";

export const appTester = zapier.createAppTester(App);

export function mock() {
  const scope = nock(config.apiUrl);

  return scope;
}

export function describe(title: string, cb: () => void) {
  return (global as any).describe(title, () => {
    beforeEach(async () => {
      mockData.set("2020-01-01");
      nock.cleanAll();
      nock.disableNetConnect();
    });

    afterEach(async () => {
      mockData.reset();
      nock.cleanAll();
      nock.disableNetConnect();
    });

    cb();
  });
}

export { App, zapier };
