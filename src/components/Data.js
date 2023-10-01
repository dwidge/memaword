import React from "react";
import PropTypes from "prop-types";
import { ImportFile, saveText } from "@dwidge/table-react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const Data = ({ tables: ts, formats = {} }) => {
  const tables = Object.entries(ts);

  const isClear = (ts = tables) =>
    ts.every(([key, [get, set]]) => !get?.length);

  const clearAll = (ts = tables) => {
    ts.forEach(([key, [get, set]]) => set(isArray(get) ? [] : {}));
  };

  const isArray = (a) => a instanceof Array;
  // const isObject=a=>a instanceof Object

  const importFormat = (importer, ts = tables, input) => {
    try {
      if (!isClear(ts) && !confirm("Combine with existing?")) return;

      const keys = ts.map(([key]) => key);
      const data = importer(input, keys);

      ts.forEach(([key, [get, set]]) => {
        if (data && data[key]) {
          set(isArray(get) ? get.concat(data[key]) : { ...get, ...data[key] });
        }
      });
    } catch (e) {
      alert("Not valid format." + e.stack);
    }
  };

  const exportFormat = async (exporter, ext = ".txt", ts = tables) => {
    const fdata = await exporter(ts);
    if (!fdata) return;
    const fname = ts.map(([key]) => key).join(" ") + ext;
    saveText(fdata, fname);
  };

  const Summary = ({ data }) => (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            {data.map(([key, [get, set]]) => key).join(" ")}
          </Card.Title>
          {data.map(([key, [get, set]]) => (
            <p key={key}>
              {key}: {isArray(get) ? get.length : Object.keys(get).join(" ")}
              {isArray(get) ? (
                <Button
                  onClick={() => {
                    if (confirm(`Clear ${key}?`)) set([]);
                  }}
                >
                  Clear {key}
                </Button>
              ) : null}
            </p>
          ))}
          <Button
            onClick={() => {
              if (confirm(`Clear all?`)) clearAll(data);
            }}
          >
            Clear
          </Button>
        </Card.Body>
      </Card>
    </>
  );
  Summary.propTypes = {
    data: PropTypes.array.isRequired,
  };

  const Exports = ({ data, formats, className }) => (
    <div className={className}>
      <Card>
        <Card.Body>
          <Table size="sm" className="mt-3">
            <thead>
              <tr>
                <th>Import</th>
                <th>Export</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formats).map(
                ([formatkey, [ext, importer, exporter]]) => (
                  <tr key={formatkey}>
                    <td>
                      {importer?.button ? (
                        <Button onClick={() => importer.button(data)}>
                          Import from {ext}
                        </Button>
                      ) : importer ? (
                        <ImportFile
                          ext={ext}
                          onAccept={(input) =>
                            importFormat(importer, data, input)
                          }
                        />
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      {exporter ? (
                        <Button
                          onClick={() => exportFormat(exporter, ext, data)}
                        >
                          Export to {ext}
                        </Button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
  Exports.propTypes = {
    data: PropTypes.array.isRequired,
    formats: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  return (
    <div-page>
      <Summary data={tables} />
      <p className="mt-3">
        Import/export to backup, transfer between devices or use with a
        spreadsheet program.
      </p>
      <Exports data={tables} formats={formats} className="mb-3" />
    </div-page>
  );
};

Data.propTypes = {
  tables: PropTypes.object.isRequired,
  formats: PropTypes.object.isRequired,
};

export default Data;
