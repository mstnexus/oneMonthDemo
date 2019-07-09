import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  loginButton: {
    display: "flex"
  },
  listItem: {
    display: "flex",
    textTransform: "upperCase",
    color: "inherit",
    textDecoration: "none",
    height: "40px",
    alignItems: "center"
  }
}));
export default function Navigation() {
  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <ListItem button key="home">
          <Link className={classes.listItem} to="/">
            Home
          </Link>
        </ListItem>
        <ListItem button key="admin">
          <Link className={classes.listItem} to="/admin">
            Administrator
          </Link>
        </ListItem>
        <ListItem button key="surgeon">
          <Link className={classes.listItem} to="/surgeon">
            Surgeon
          </Link>
        </ListItem>
        <ListItem button key="patient">
          <Link className={classes.listItem} to="/patients">
            Patient
          </Link>
        </ListItem>
      </List>
    </div>
  );

  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="default"
              aria-label="Menu"
              onClick={toggleDrawer("left", true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Nexus</Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          open={state.left}
          onClose={toggleDrawer("left", false)}
        >
          {sideList("left")}
        </Drawer>
      </div>
    </>
  );
}
