import { ZObject, Bundle } from "zapier-platform-core";

export async function getCsvFile(z: ZObject, bundle: Bundle) {
  const { url } = bundle.inputData;
  return url;
}
