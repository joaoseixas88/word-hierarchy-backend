import "./setup";
import z from "zod";
import { WordHierarchyAnalizer } from "./src/features/word-hierarchy-analyzer";
import { WordHierarchyMakerByFile } from "./src/services/word-hierarchy-maker-by-file";
import { WordThreeValidator } from "./src/validator";

const availableArgs = ["depth", "filename"];

const args = (() => {
  const argv = process.argv.slice(2);
  const lastIndex = argv.length - 1;
  argv.forEach((value) => {
    const sanitizedArg = value.replace("-", "").replace("--", "");
    if (sanitizedArg === "verbose") return;
    if (value.startsWith("--") || value.startsWith("-")) {
      if (!availableArgs.includes(sanitizedArg)) {
        console.error(`Invalid argument ${value}`);
        process.exit(1);
      }
    }
  });
  const obj = {} as Record<string, any>;
  for (const arg of availableArgs) {
    const argIndex = argv.indexOf(`-${arg}`);
    if (argIndex !== -1) {
      obj[arg] = argv[argIndex + 1];
    }
  }
  obj["text"] = argv[lastIndex];
  if (argv[lastIndex] === "-verbose") {
    obj["verbose"] = true;
    obj["text"] = argv[lastIndex - 1];
  }
  return obj;
})();
const path = `${process.cwd()}/dicts/`;
const getPath = (filename: string) => path + filename;
const defaultFile = getPath("example.json");

const schema = z.object({
  filename: z.string().optional(),
  verbose: z.boolean().optional(),
  depth: z.coerce.number(),
  text: z.string(),
});

const validateArgs = (values: any) => {
  const result = schema.safeParse(values);
  if (!result.success) {
    return {
      data: undefined,
      error: result.error.issues[0].message,
    };
  }
  return { data: result.data, error: undefined };
};

const outputMaker = (data: WordHierarchyAnalizer.Output): string => {
  let output = "0; ";
  if (data.length) {
    output = "";
    data.forEach((val) => {
      const { amount, value } = val;
      output = output.concat(`${value} = ${amount}; `);
    });
  }
  return output;
};

async function main() {
  const { data, error } = validateArgs(args);
  if (error) {
    console.error(error);
    process.exit(1);
  }
  if (data) {
    try {
      const { depth, filename, verbose, text } = data;

      const validator = new WordThreeValidator();
      const fileMaker = new WordHierarchyMakerByFile(validator);
      const textAnalyzer = new WordHierarchyAnalizer();
      const dataToAnalyze = await fileMaker.make(
        getPath(filename ? filename : "example.json")
      );
      if (!dataToAnalyze) {
        console.error("File not found");
        process.exit(1);
      }
      const result = await textAnalyzer.analyze({
        depth,
        text,
        data: dataToAnalyze,
      });
      if (verbose) {
        const data = [
          {
            Description: "Tempo de carregamento dos parâmetros",
            Time: `${fileMaker.timeLapsed} ms`,
          },
          {
            Description: "Tempo de verificação da frase",
            Time: `${textAnalyzer.timeLapsed} ms`,
          },
        ];
        console.table(data);
      }
      console.log(outputMaker(result));
    } catch (error: any) {
      console.error(error.message);
      process.exit(1);
    }
  }
}

main();
