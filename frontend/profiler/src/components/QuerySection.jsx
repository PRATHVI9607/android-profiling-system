import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography } from "@mui/material";

export default function QuerySection() {
  const [tool, setTool] = useState("perfetto");
  const [trace, setTrace] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [queries, setQueries] = useState([]);

  const refreshQueries = () => {
    axios.get("http://localhost:8000/queries").then(res => setQueries(res.data));
  };

  const runQuery = () => {
    axios.post("http://localhost:8000/sql_query", { trace_name: trace, query, tool }).then(res => setResult(res.data));
  };

  const exportResult = (format) => {
    axios.post("http://localhost:8000/export", { trace_name: trace, format, tool })
      .then(res => window.open(`http://localhost:8000/download/${trace}.${format}?tool=${tool}`));
  };

  return (
    <div>
      <Typography variant="h5">Trace Query</Typography>
      <TextField label="Trace Name" value={trace} onChange={e => setTrace(e.target.value)} fullWidth sx={{ my: 2 }} />
      <TextField label="SQL Query" value={query} onChange={e => setQuery(e.target.value)} multiline rows={2} fullWidth sx={{ my: 2 }} />
      <Button variant="contained" onClick={runQuery} sx={{ mr: 2 }}>Run Query</Button>
      <Button variant="outlined" onClick={() => exportResult("csv")}>Export CSV</Button>
      <Button variant="outlined" onClick={() => exportResult("tsv")}>Export TSV</Button>
      <Typography variant="h6" sx={{ mt: 3 }}>Saved Queries</Typography>
      <Button onClick={refreshQueries}>Refresh Saved</Button>
      <ul>
        {queries.map(q => <li key={q}>{q}</li>)}
      </ul>
      <div>
        <Typography variant="h6" sx={{ mt: 3 }}>Result</Typography>
        {result &&
          <table>
            <thead>
              {Object.keys(result).length > 0 &&
                <tr>{Object.keys(result).map(h => <th key={h}>{h}</th>)}</tr>
              }
            </thead>
            <tbody>
              {Object.values(result).length > 0 &&
                Object.values(result)[0].map((_, i) => (
                  <tr key={i}>
                    {Object.keys(result).map((col) => (
                      <td key={col}>{result[col][i]?.toString()}</td>
                    ))}
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
