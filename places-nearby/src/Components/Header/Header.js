import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import PropTypes from "prop-types";
import CssBaseline from "@mui/material/CssBaseline";
import MediaQuery from "react-responsive";
import "./Header.css";
import { Link as RouterLink } from "react-router-dom";
import { withCookies } from "react-cookie";
import Logout from "@mui/icons-material/Logout";
import { withRouter } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      openProfile: false,
    };
  }

  openProfileMenu = (event) => {
    this.setState({ openProfile: true, anchorEl: event.currentTarget });
  };

  closeProfileMenu = () => {
    this.setState({ openProfile: false });
  };

  handleLogout = () => {
    this.closeProfileMenu();
    this.props.cookies.remove("emailId");
    this.props.cookies.remove("name");
    this.props.history.push("/");
  };

  toggleDrawer = (value) => {
    this.setState({ openDrawer: value });
  };

  navigateTo = (toRoute) => {
    this.props.history.push(toRoute);
    this.toggleDrawer(false);
  };

  render() {
    return (
      <Box sx={{ flexGrow: 1, height: "10vh" }}>
        <CssBaseline />
        <ElevationScroll {...this.props}>
          <AppBar
            color={
              window.location.pathname === "/home" ||
              window.location.pathname === "/aboutUs"
                ? "transparent"
                : "inherit"
            }
            sx={
              window.location.pathname === "/signup"
                ? { backgroundColor: "#EDF6FF" }
                : {}
            }
            elevation={0}
          >
            <Toolbar>
              <Link style={{ flexGrow: 1 }} to="/home" component={RouterLink}>
                <img
                  src="/Assets/Logo.svg"
                  alt="NearBy Logo"
                  style={{ width: 100, marginTop: 10, marginLeft: 5 }}
                />
              </Link>

              <MediaQuery minWidth={600}>
                <Link
                  to="/home"
                  component={RouterLink}
                  color="inherit"
                  underline="none"
                  className="nav-item"
                >
                  Home
                </Link>
                <Link
                  to="/aboutUs"
                  component={RouterLink}
                  color="inherit"
                  underline="none"
                  className="nav-item"
                >
                  About Us
                </Link>
                {!this.props.cookies.get("emailId") && (
                  <React.Fragment>
                    <Link
                      to="/login"
                      component={RouterLink}
                      color="inherit"
                      underline="none"
                      className="nav-item"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      component={RouterLink}
                      color="inherit"
                      underline="none"
                      className="nav-item"
                    >
                      Sign Up
                    </Link>
                  </React.Fragment>
                )}
                {this.props.cookies.get("emailId") && (
                  <React.Fragment>
                    <Link
                      to="/favourites"
                      component={RouterLink}
                      color="inherit"
                      underline="none"
                      className="nav-item"
                    >
                      Favourites
                    </Link>
                    <Tooltip
                      title="Account Info"
                      style={{ margin: "0px 30px 0px 20px" }}
                    >
                      <IconButton
                        onClick={(event) => this.openProfileMenu(event)}
                        disableRipple
                      >
                        <Avatar
                          sx={{ width: 45, height: 45, bgcolor: "#3f51b5" }}
                        >
                          {this.props.cookies.get("name")[0]}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={this.state.anchorEl}
                      open={this.state.openProfile}
                      onClose={this.closeProfileMenu}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          minWidth: 180,
                          "& .MuiAvatar-root": {
                            width: 24,
                            height: 24,
                            ml: -0.5,
                            mr: 2,
                          },
                          "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem>
                        Hello,{" "}
                        <b>
                          <i>{this.props.cookies.get("name")}</i>
                        </b>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={this.handleLogout}>
                        <ListItemIcon>
                          <Logout
                            fontSize="small"
                            sx={{ mr: 2 }}
                            color="primary"
                          />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
              </MediaQuery>

              <MediaQuery maxWidth={600}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={() => this.toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={this.state.openDrawer}
                  onClose={() => this.toggleDrawer(false)}
                >
                  <Box
                    sx={{ width: "auto", minWidth: "240px" }}
                    role="presentation"
                    onKeyDown={() => this.toggleDrawer(false)}
                  >
                    <List>
                      {this.props.cookies.get("emailId") && (
                        <ListItem button key="name">
                          <ListItemIcon>
                            <AccountCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={"Hello, " + this.props.cookies.get("name")}
                          />
                        </ListItem>
                      )}
                      <ListItem button key="home">
                        <ListItemIcon>
                          <HomeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Home"
                          onClick={() => this.navigateTo("/home")}
                        />
                      </ListItem>
                      <ListItem button key="aboutUs">
                        <ListItemIcon>
                          <InfoIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="About Us"
                          onClick={() => this.navigateTo("/aboutUs")}
                        />
                      </ListItem>
                      {!this.props.cookies.get("emailId") && (
                        <React.Fragment>
                          <ListItem button key="login">
                            <ListItemIcon>
                              <LoginIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Login"
                              onClick={() => this.navigateTo("/login")}
                            />
                          </ListItem>
                          <ListItem button key="signup">
                            <ListItemIcon>
                              <PersonAddIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Sign Up"
                              onClick={() => this.navigateTo("/signup")}
                            />
                          </ListItem>
                        </React.Fragment>
                      )}
                      {this.props.cookies.get("emailId") && (
                        <React.Fragment>
                          <ListItem button key="favourites">
                            <ListItemIcon>
                              <BookmarksIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Favourites"
                              onClick={() => this.navigateTo("/favourites")}
                            />
                          </ListItem>
                          <ListItem button key="logout">
                            <ListItemIcon>
                              <LogoutIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Logout"
                              onClick={this.handleLogout}
                            />
                          </ListItem>
                        </React.Fragment>
                      )}
                    </List>
                  </Box>
                </Drawer>
              </MediaQuery>
            </Toolbar>
          </AppBar>
        </ElevationScroll>
      </Box>
    );
  }
}

export default withCookies(withRouter(Header));

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    style: trigger ? { backgroundColor: "#eceff1" } : {},
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};
