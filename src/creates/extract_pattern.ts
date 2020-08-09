import { ZObject, Bundle } from "zapier-platform-core";
import _ from "lodash";
import { unflatten } from "flat";

function extractFlags(flags: any) {
  const result = ["g"];
  for (let flag in flags) {
    const isSelected = flags[flag];
    if (isSelected && !_.includes(result, flag)) {
      result.push(flag);
    }
  }

  return _.join(result, "");
}

const perform = async (z: ZObject, bundle: Bundle): Promise<any> => {
  let { pattern, values, flags } = unflatten(bundle.inputData, {
    delimiter: "__",
  });
  flags = extractFlags(flags);
  const re = new RegExp(pattern, flags);

  const output = _.map(values, ({ input }) => {
    const matches = [];
    let match;
    let result: any = {};
    while ((match = re.exec(input)) !== null) {
      const allMatches = _.reduce(
        match,
        (prev: any, current, key) => {
          prev[key] = current;
          return prev;
        },
        {},
      );
      const chunk = _.merge({}, allMatches, match.groups, {
        _start: match.index,
        _end: re.lastIndex,
      });

      matches.push(chunk);
    }

    result._matched = matches.length > 0;
    if (matches.length > 0) {
      result.matches = matches;
    }

    return result;
  });

  return {
    output,
  };
};

export default {
  key: "extract_pattern",
  noun: "Text",
  display: {
    label: "Extract Pattern (RegEx)",
    description:
      "Find all matches for a regular expression in a text field. Returns all matched groups.",
  },
  operation: {
    inputFields: [
      {
        key: "values",
        children: [
          {
            key: "input",
            label: "Input",
            helpText: "Text you would like to find a pattern from.",
          },
        ],
      },
      {
        key: "pattern",
        label: "Pattern",
        helpText:
          "Enter a [JavaScript Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) to find all matches for, e.g. `f[o]+ (bar)`.",
        required: true,
      },
      {
        key: "flags__i",
        label: "Case-insensitive flag",
        type: "boolean",
        helpText: "Case-insensitive search",
      },
      {
        key: "flags__m",
        label: "Multiline flag",
        type: "boolean",
        helpText: "Multi-line search",
      },
      {
        key: "flags__s",
        label: "Dotall flag",
        type: "boolean",
        helpText: "Allows `.` to match newline characters",
      },
      {
        key: "flags__u",
        label: "Unicode flag",
        type: "boolean",
        helpText:
          '"unicode"; treat a pattern as a sequence of unicode code points.',
      },
      {
        key: "flags__y",
        label: "Sticky flag",
        type: "boolean",
        helpText:
          'Perform a "sticky" search that matches starting at the current position in the target string.',
      },
    ],
    perform,
    sample: {
      id: 1,
    },
  },
};
