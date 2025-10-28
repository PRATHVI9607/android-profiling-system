import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";

export default function DeviceSection() {
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    axios.get("http://localhost:8000/devices")
      .then(res => setDevices(res.data))
      .catch(() => setError("Could not fetch device list. Check ADB and permissions."));
  }, []);
  return (
    <div>
      <h3>Connected Android Devices</h3>
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl fullWidth>
        <InputLabel id="devsel-label">Device</InputLabel>
        <Select
          labelId="devsel-label"
          value={selected}
          label="Device"
          onChange={e => setSelected(e.target.value)}
        >
          {devices.length === 0 ? (
            <MenuItem value="">No devices connected</MenuItem>
          ) : devices.map(dev => (
            <MenuItem key={dev} value={dev}>{dev}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
