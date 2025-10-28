import React, { useState } from "react";
import axios from "axios";
import { Typography, Button, TextField, CircularProgress } from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function GraphSection() {
  const [trace, setTrace] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = () => {
    if (!trace || !xAxis || !yAxis) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");
    axios.post("http://localhost:8000/sql_query", {
      trace_name: trace,
      query: `SELECT ${xAxis},${yAxis} FROM slice`,
      tool: "perfetto"
    })
      .then(res => {
        setData(Object.keys(res.data).length > 0
          ? Array(Object.values(res.data)[0].length).fill(0)
            .map((_, i) => Object.fromEntries(Object.entries(res.data).map(([k, vals]) => [k, vals[i]])))
          : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data.");
        setLoading(false);
      });
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Trace Graph Analyzer</Typography>

      <TextField
        label="Trace Name"
        value={trace}
        onChange={e => setTrace(e.target.value)}
        sx={{ my: 2 }}
        fullWidth
      />
      <TextField
        label="X Axis"
        value={xAxis}
        onChange={e => setXAxis(e.target.value)}
        sx={{ my: 2 }}
        fullWidth
      />
      <TextField
        label="Y Axis"
        value={yAxis}
        onChange={e => setYAxis(e.target.value)}
        sx={{ my: 2 }}
        fullWidth
      />

      <Button
        variant="contained"
        onClick={fetchData}
        disabled={loading || !trace || !xAxis || !yAxis}
      >
        {loading ? <CircularProgress size={24} sx={{color:'white'}} /> : "Show Graph"}
      </Button>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      {data.length > 0 &&
        <LineChart width={700} height={350} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey={xAxis} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={yAxis} stroke="#1160E0" />
        </LineChart>
      }
    </div>
  );
}
