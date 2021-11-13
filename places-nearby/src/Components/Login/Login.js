import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import "./Login.css";
import {
  TextField,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Link,
  Button,
  Alert,
} from "@mui/material";
import MediaQuery from "react-responsive";
import ResetPwdDialog from "../Dialog/ResetPwdDialog/ResetPwdDialog";
import ForgotPwdDialog from "../Dialog/ForgotPwdDialog/ForgotPwdDialog";
import { Link as RouterLink } from "react-router-dom";
import validator from "validator";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: "",
      password: "",
      rememberMe: false,
      errorStatus: {},
      resetPwdOpen: false,
      forgotPwdOpen: false,
      errMsg: "",
      resetEmailAddress: "",
      openSB: false
    };
  }

  Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  componentDidMount = () => {
    window.scrollTo(0, 0);
    if (this.props.cookies.get("rememberEmail")) {
      this.setState({ emailAddress: this.props.cookies.get("rememberEmail") });
    }
  };

  handleChange = (event, name) => {
    this.setState({ [name]: event.target.value });

    let errorStatus = this.state.errorStatus;
    if (name === "emailAddress") {
      if (validator.isEmail(this.state.emailAddress)) {
        errorStatus.emailAddress = false;
      }
    }
  };

  handleChangeCheck = (event) => {
    this.setState({ rememberMe: event.target.checked });
  };

  handleBlur = (name) => {
    let errorStatus = this.state.errorStatus;
    if (name === "emailAddress") {
      if (validator.isEmail(this.state.emailAddress)) {
        errorStatus.emailAddress = false;
      } else {
        errorStatus.emailAddress = true;
      }
    }
    this.setState({ errorStatus });
  };

  openResetPwdDialog = () => {
    this.setState({ resetPwdOpen: true });
  };

  openForgotPwdDialog = (event) => {
    if (this.state.resetEmailAddress !== "") {
      this.openResetPwdDialog();
    } else {
      this.setState({ forgotPwdOpen: true });
    }
    event.preventDefault();
  };

  resendMail = () => {
    this.closeResetPwd();
    this.setState({ forgotPwdOpen: true });
  };

  resetPwd = (code, pwd) => {
    try {
      axios
        .post("http://localhost:3001/resetPwd", {
          emailAddress: this.state.resetEmailAddress,
          code: code,
          password: pwd,
        })
        .then((res) => {
          if (res.data.status === "success") {
            this.closeResetPwd();
            this.setState({ resetEmailAddress: "" });
          }
          this.setState({ msgSB: res.data.response, openSB: true, typeSB: res.data.status});
        });
    } catch (err) {}
  };

  closeResetPwd = () => {
    this.setState({ resetPwdOpen: false });
  };

  sendPwdResetInstruction = (emailAddress) => {
    try {
      axios
        .post("http://localhost:3001/forgotPwdEmail", {
          emailAddress: emailAddress,
        })
        .then((res) => {
          if (res.data.status === "success") {
            this.closeForgotPwd();
            this.openResetPwdDialog();
            this.setState({ resetEmailAddress: emailAddress });
          }
          this.setState({ msgSB: res.data.response, openSB: true, typeSB: res.data.status});
        });
    } catch (err) {}
  };

  closeForgotPwd = () => {
    this.setState({ forgotPwdOpen: false });
  };

  validateCredentials = () => {
    if (
      this.state.emailAddress !== "" &&
      !this.state.errorStatus.emailAddress &&
      this.state.password !== ""
    ) {
      // Need to add API changes to check credentials
      try {
        axios
          .post("http://localhost:3001/login", {
            emailAddress: this.state.emailAddress,
            password: this.state.password,
          })
          .then((res) => {
            if (res.data.status === "success") {
              let fullName =
                res.data.response.firstname + " " + res.data.response.lastname;
              this.props.cookies.set("name", fullName, { path: "/" });
              this.props.cookies.set(
                "emailId",
                res.data.response.emailAddress,
                { path: "/" }
              );
              this.state.rememberMe &&
                this.props.cookies.set(
                  "rememberEmail",
                  res.data.response.emailAddress,
                  { path: "/" }
                );
              this.props.history.push("/home");
            } else {
              this.setState({ errMsg: res.data.error });
            }
          });
      } catch (err) {}
    }
  };

  closeSB = () => {
    this.setState({openSB: false})
  }

  render() {
    return (
      <React.Fragment>
        <Grid container justifyContent="center">
          <Grid item sm={0} md={7}>
            <MediaQuery minWidth={900}>
              <img
                className="login-img"
                src="/Assets/Login.jpeg"
                alt="LoginImage"
              />
            </MediaQuery>
          </Grid>
          <Grid item sm={12} md={5} className="login-container">
            <div className="login">
              {this.state.errMsg && (
                <Alert
                  severity="error"
                  style={{
                    width: "fit-content",
                    marginBottom: 16,
                  }}
                >
                  {this.state.errMsg}
                </Alert>
              )}
              <Typography variant="h5">Login</Typography>
              <div className="login-msg">
                <Typography variant="h4" className="welcome-msg">
                  Welcome to <br></br>
                  <span className="app-login-color">NearBy</span>
                </Typography>
                <Typography variant="caption" className="caption-msg">
                  Enter the credentials to access your account
                </Typography>
              </div>
              <Box
                sx={{
                  "& > :not(style)": {
                    margin: "8px 4px",
                    maxWidth: "45ch",
                    width: "100%",
                  },
                }}
              >
                <TextField
                  label="Email Address"
                  required
                  value={this.state.emailAddress}
                  error={this.state.errorStatus.emailAddress}
                  onBlur={() => this.handleBlur("emailAddress")}
                  onChange={(event) => this.handleChange(event, "emailAddress")}
                  helperText={
                    this.state.errorStatus.emailAddress &&
                    "Enter Valid Email Address."
                  }
                />
                <TextField
                  label="Password"
                  required
                  type="password"
                  value={this.state.password}
                  onChange={(event) => this.handleChange(event, "password")}
                />
                <div className="login-features">
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={this.state.rememberMe}
                        onChange={this.handleChangeCheck}
                      />
                    }
                    label="Remember me"
                  />
                  <Link
                    component="button"
                    onClick={(event) => this.openForgotPwdDialog(event)}
                    underline="none"
                    className="forgot-link"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="button-container">
                  <Button
                    variant="contained"
                    size="large"
                    className="signin-btn"
                    onClick={() => this.validateCredentials()}
                  >
                    Sign In
                  </Button>
                </div>
                <Typography style={{ marginTop: 16 }}>
                  Don't have an account yet?
                  <Link to="/signup" component={RouterLink} underline="none">
                    {" "}
                    Register here.
                  </Link>
                </Typography>
              </Box>
            </div>
          </Grid>
        </Grid>
        <ResetPwdDialog
          open={this.state.resetPwdOpen}
          resetPwd={this.resetPwd}
          onClose={this.closeResetPwd}
          resendMail={this.resendMail}
        />
        <ForgotPwdDialog
          open={this.state.forgotPwdOpen}
          sendPwdResetInstruction={this.sendPwdResetInstruction}
          onClose={this.closeForgotPwd}
        />
        <Snackbar open={this.state.openSB} autoHideDuration={6000} onClose={this.closeSB}>
          <Alert
            onClose={this.closeSB}
            severity={this.state.typeSB}
            sx={{ width: "100%" }}
          >
            {this.state.msgSB}
          </Alert>
        </Snackbar>
      </React.Fragment>
    );
  }
}

export default withCookies(withRouter(Login));
