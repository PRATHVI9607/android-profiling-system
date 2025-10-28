import React, { useState } from "react";
import axios from "axios";
import { Button, Select, MenuItem, TextField, FormControl, InputLabel, Typography } from "@mui/material";

export default function TraceSection() {
  const [tool, setTool] = useState("perfetto");
  const [device, setDevice] = useState("");
  const [config, setConfig] = useState("");
  const [thread, setThread] = useState("");
  const [traceList, setTraceList] = useState([]);
  const [status, setStatus] = useState("");

  const refreshTraces = () => {
    axios.get(`http://localhost:8000/traces?tool=${tool}`).then(res => setTraceList(res.data));
  };

  const runProfiler = () => {
    axios.post("http://localhost:8000/run_trace", { tool, device, config, thread }).then(res => setStatus(res.data.status));
  };

  const pullTraceFile = () => {
    axios.post("http://localhost:8000/pull_trace", { device, remote_path: "/data/local/tmp/trace.perfetto-trace", tool }).then(res => setStatus("Trace file pulled."));
    refreshTraces();
  };

  return (
    <div>
      <Typography variant="h5">Trace Runner</Typography>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel>Tool</InputLabel>
        <Select value={tool} onChange={e => setTool(e.target.value)}>
          <MenuItem value="perfetto">Perfetto</MenuItem>
          <MenuItem value="simpleperf">Simpleperf</MenuItem>
          <MenuItem value="ebpf">eBPF</MenuItem>
        </Select>
      </FormControl>
      <TextField label="Device Serial" value={device} onChange={e => setDevice(e.target.value)} fullWidth sx={{ my: 2 }} />
      <TextField label="Config Name" value={config} onChange={e => setConfig(e.target.value)} fullWidth sx={{ my: 2 }} />
      {tool === "simpleperf" &&
        <TextField label="Thread ID" value={thread} onChange={e => setThread(e.target.value)} fullWidth sx={{ my: 2 }} />
      }
      <Button variant="contained" color="primary" onClick={runProfiler} sx={{ mr: 2 }}>Run Trace</Button>
      <Button variant="contained" color="secondary" onClick={pullTraceFile}>Pull Trace File</Button>
      <Typography variant="body2" sx={{ mt: 2 }}>{status}</Typography>
      <Typography variant="h6" sx={{ mt: 3 }}>Traces</Typography>
      <Button onClick={refreshTraces}>Refresh List</Button>
      <ul>
        {traceList.map(trace => <li key={trace}>{trace}</li>)}
      </ul>
    </div>
  );
}
