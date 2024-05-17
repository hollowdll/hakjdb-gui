"use client";

import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { NavItem } from "@/types/types";

export function NavBar() {
  const drawerWidth = 240;

  const navItems: NavItem[] = [
    { text: "Connection", href: "/connection" },
    { text: "Server", href: "/server" },
    { text: "Databases", href: "/databases" },
    { text: "Keys", href: "/keys" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <List>
        {navItems.map((item) => (
            <ListItem key={item.text}>
              <ListItemButton>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
