import TinyXLSX from "tiny-xlsx";

const isArray = (a) => a instanceof Array;

const exportXLS = (ts = tables) => {
  const sheets = ts.map(([key, [get, set]]) => ({
    title: key,
    data: isArray(get)
      ? [Object.keys(get[0] || {}), ...get.map((r) => Object.values(r))]
      : [Object.keys(get || {}), Object.values(get || {})],
  }));

  TinyXLSX.generate(sheets)
    .base64()
    .then((base64) => {
      location.href =
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
        base64;
    });
};

const XLSX = [".xlsx", null, exportXLS];
export default XLSX;
