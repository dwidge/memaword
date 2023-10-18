const importJSON = (input) => JSON.parse(input);

const exportJSON = (ts = tables) =>
  JSON.stringify(
    Object.fromEntries(ts.map(([key, [get, set]]) => [key, get])),
    null,
    2,
  );

const Json = [".json", importJSON, exportJSON];
export default Json;
