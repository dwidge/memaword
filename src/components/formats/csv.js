import { calcCsvFromObjects, calcObjectsFromCsv } from "@dwidge/lib";

const isArray = (a) => a instanceof Array;

const importCSV = (input, keys = []) =>
  Object.fromEntries(
    input.split(/\r?\n\r?\n/g).map((t, i) => {
      const lines = t.split(/\r?\n/g);
      const first = lines[0].match(/^"?#(.*?)"?$/)[1];

      const key = first || keys[i];
      const rows = calcObjectsFromCsv(first ? lines.slice(1).join("\n") : t);
      return [key, rows];
    }),
  );

const exportCSV = (ts = tables) =>
  ts
    .map(
      ([key, [get, set]]) =>
        '"#' +
        key +
        '"' +
        "\r\n" +
        calcCsvFromObjects(isArray(get) ? get : [get]),
    )
    .join("\r\n\r\n");

const CSV = [".csv", importCSV, exportCSV];
export default CSV;
