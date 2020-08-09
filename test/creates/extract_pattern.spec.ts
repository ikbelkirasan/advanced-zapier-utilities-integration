import { describe, appTester, App, mock } from "../helpers";
import _ from "lodash";

interface Options {
  pattern: string;
  input: string | string[];
  expected: object;
  flags?: string[];
}

async function runTest(options: Options) {
  const { pattern, input, expected, flags } = options;

  const inputData: any = {};
  inputData.pattern = pattern;

  // Get flags
  _.merge(
    inputData,
    _.reduce(
      flags,
      (prev: any, flag: string) => {
        prev[`flags__${flag}`] = true;
        return prev;
      },
      {},
    ),
  );

  // Get values
  let values = [];
  if (_.isArray(input)) {
    values = _.map(input, i => {
      return {
        input: i,
      };
    });
  } else {
    values = [
      {
        input,
      },
    ];
  }
  inputData.values = values;

  const bundle: any = {
    inputData,
  };

  const response = await appTester(
    App.creates["extract_pattern"].operation.perform,
    bundle,
  );
  expect(response).toEqual(expected);
}

describe("Extract Pattern (RegEx)", () => {
  it("should work", async () => {
    await runTest({
      pattern: "f([o]+)( b(?<named>[a]+)r)?",
      input: "",
      expected: {
        output: [{ _matched: false }],
      },
    });
    await runTest({
      pattern: "f([o]+)( b(?<named>[a]+)r)?",
      input: null as any,
      expected: {
        output: [
          {
            _matched: false,
          },
        ],
      },
    });
    await runTest({
      pattern: "f([o]+)( b(?<named>[a]+)r)?",
      input: "Hello foo folks and another foo bar I will not catch",
      expected: {
        output: [
          {
            _matched: true,
            matches: [
              {
                0: "foo",
                1: "oo",
                2: undefined,
                3: undefined,
                named: undefined,
                _start: 6,
                _end: 9,
              },
              {
                0: "fo",
                1: "o",
                2: undefined,
                3: undefined,
                named: undefined,
                _start: 10,
                _end: 12,
              },
              {
                0: "foo bar",
                1: "oo",
                2: " bar",
                3: "a",
                named: "a",
                _start: 28,
                _end: 35,
              },
            ],
          },
        ],
      },
    });

    await runTest({
      pattern: "#[a-f0-9]{3}",
      input: "color: #3f3; background-color: #AA00ef; and: #abcd",
      expected: {
        output: [
          {
            _matched: true,
            matches: [
              {
                0: "#3f3",
                _start: 7,
                _end: 11,
              },
              {
                0: "#AA0",
                _start: 31,
                _end: 35,
              },
              {
                0: "#abc",
                _start: 45,
                _end: 49,
              },
            ],
          },
        ],
      },
      flags: ["i"],
    });
  });
});
