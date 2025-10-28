import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography } from "@mui/material";

export default function ConfigSection() {
  const [tool, setTool] = useState("perfetto");
  const [configs, setConfigs] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const refreshConfigs = () => {
    axios.get(`http://localhost:8000/configs?tool=${tool}`).then(res => setConfigs(res.data));
  };

  const saveCurrent = () => {
    axios.post("http://localhost:8000/configs", { tool, name, content }).then(res => refreshConfigs());
  };

  const deleteConfig = (name) => {
    axios.delete(`http://localhost:8000/configs/${name}?tool=${tool}`).then(res => refreshConfigs());
  };

  return (
    <div>
      <Typography variant="h5">Manage Configs</Typography>
      <TextField label="Config Name" value={name} onChange={e => setName(e.target.value)} sx={{ my: 2 }} />
      <TextField label="Content" value={content} onChange={e => setContent(e.target.value)} multiline rows={4} fullWidth sx={{ my: 2 }} />
      <Button variant="contained" color="primary" onClick={saveCurrent} sx={{ mr: 2 }}>Save</Button>
      <Button variant="outlined" onClick={refreshConfigs}>Refresh List</Button>
      <ul>
        {configs.map(c => (
          <li key={c}>
            {c} <Button size="small" color="secondary" onClick={() => deleteConfig(c)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
