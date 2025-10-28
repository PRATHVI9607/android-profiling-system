import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

export default function Sidebar({ section, setSection }) {
  const sections = ["Device", "Trace", "Query", "Config", "Graph"];
  return (
    <Drawer variant="permanent" sx={{
      width: 220,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: 220,
        boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(12px)'
      }
    }}>
      <List>
        <ListItem>
          <h2 style={{ color: "#1160E0", fontWeight: "bold" }}>Android Profiler</h2>
        </ListItem>
        {sections.map(sec => (
          <ListItem button key={sec} selected={section === sec} onClick={() => setSection(sec)}>
            <ListItemText primary={sec} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
