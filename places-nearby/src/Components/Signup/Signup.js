import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import "./Signup.css";
import { TextField, Typography, Box, Link, Button, Alert } from "@mui/material";
import MediaQuery from "react-responsive";
import { Link as RouterLink } from "react-router-dom";
import validator from "validator";
import axios from "axios";
import { withRouter } from 'react-router-dom';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      state: "",
      city: "",
      zipCode: "",
      rememberMe: false,
      errorStatus: {},
    };
  }

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

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  handleBlur = (name) => {
    let errorStatus = this.state.errorStatus;
    if (name === "emailAddress") {
      if (validator.isEmail(this.state.emailAddress)) {
        errorStatus.emailAddress = false;
      } else {
        errorStatus.emailAddress = true;
      }
    } else if (name === "firstName") {
      if (this.state.firstName !== "") {
        errorStatus.firstName = false;
      } else {
        errorStatus.firstName = true;
      }
    } else if (name === "lastName") {
      if (this.state.lastName !== "") {
        errorStatus.lastName = false;
      } else {
        errorStatus.lastName = true;
      }
    } else if (name === "password") {
      if (validator.isStrongPassword(this.state.password)) {
        errorStatus.password = false;
      } else {
        errorStatus.password = true;
      }
    } else if (name === "state") {
      if (this.state.state !== "") {
        errorStatus.state = false;
      } else {
        errorStatus.state = true;
      }
    } else if (name === "city") {
      if (this.state.city !== "") {
        errorStatus.city = false;
      } else {
        errorStatus.city = true;
      }
    } else {
      if (this.state.zipCode !== "") {
        errorStatus.zipCode = false;
      } else {
        errorStatus.zipCode = true;
      }
    }
    this.setState({ errorStatus });
  };

  createAccount = () => {
    try {
      axios
        .post("https://nearby-backend-app.herokuapp.com/signup", {
          firstname: this.state.firstName,
          lastname: this.state.lastName,
          emailAddress: this.state.emailAddress,
          password: this.state.password,
          city: this.state.city,
          state: this.state.state,
          zipcode: this.state.zipCode,
        })
        .then((res) => {
          if(res.data.status === "success") {
            this.props.history.push("/login");
          } else {
            this.setState({ errMsg: res.data.error });
          }
        });
    } catch (err) {}
  };

  render() {
    return (
      <React.Fragment>
        <Grid
          container
          justifyContent="center"
          style={{ backgroundColor: "#EDF6FF" }}
        >
          <Grid item sm={0} md={5}>
            <MediaQuery minWidth={900}>
              <img
                className="signup-img"
                src="/Assets/Signup.png"
                alt="SignUpImage"
              />
            </MediaQuery>
          </Grid>
          <Grid item sm={12} md={7} className="signup-container">
            <div className="signup">
            {this.state.errMsg && (
                <Alert
                  severity="error"
                  style={{
                    width: "fit-content",
                    marginBottom: 16,
                    paddingRight: 32,
                  }}
                >
                  {this.state.errMsg}
                </Alert>
              )}
              <Typography variant="h5">Registration</Typography>
              <div className="signup-msg">
                <Typography variant="h4" className="create-msg">
                  Create Account to start <br></br>
                  <span className="app-singup-color">Using NearBy</span>
                </Typography>
                <Typography variant="caption" className="caption-msg">
                  Fill out the form to get started.
                </Typography>
              </div>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": {
                    margin: "8px 16px 8px 0px",
                    maxWidth: { xs: "100%", sm: "45%" },
                    width: "100%",
                  },
                }}
              >
                <TextField
                  label="First Name"
                  required
                  value={this.state.firstName}
                  onBlur={() => this.handleBlur("firstName")}
                  error={this.state.errorStatus.firstName}
                  onChange={(event) => this.handleChange(event, "firstName")}
                />
                <TextField
                  label="Last Name"
                  required
                  value={this.state.lastName}
                  onBlur={() => this.handleBlur("lastName")}
                  error={this.state.errorStatus.lastName}
                  onChange={(event) => this.handleChange(event, "lastName")}
                />
                <TextField
                  label="Email Address"
                  required
                  value={this.state.emailAddress}
                  onBlur={() => this.handleBlur("emailAddress")}
                  error={this.state.errorStatus.emailAddress}
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
                  onBlur={() => this.handleBlur("password")}
                  error={this.state.errorStatus.password}
                  onChange={(event) => this.handleChange(event, "password")}
                  helperText={
                    this.state.errorStatus.password &&
                    "Min Length:8, atleast one Lower case, Upper case, Number and Symbol"
                  }
                />
                <TextField
                  label="City"
                  required
                  value={this.state.city}
                  onBlur={() => this.handleBlur("city")}
                  error={this.state.errorStatus.city}
                  onChange={(event) => this.handleChange(event, "city")}
                />
                <div style={{ display: "inline-flex" }}>
                  <TextField
                    style={{ marginRight: 10, width: "50%" }}
                    label="State"
                    required
                    value={this.state.state}
                    error={this.state.errorStatus.state}
                    onBlur={() => this.handleBlur("state")}
                    onChange={(event) => this.handleChange(event, "state")}
                  />
                  <TextField
                    style={{ marginLeft: 10, width: "50%" }}
                    label="Zip Code"
                    required
                    value={this.state.zipCode}
                    error={this.state.errorStatus.zipCode}
                    onBlur={() => this.handleBlur("zipCode")}
                    onChange={(event) => this.handleChange(event, "zipCode")}
                  />
                </div>
                <div className="signup-btn-container">
                  <Typography>
                    Already have an Account?
                    <Link to="/login" component={RouterLink} underline="none">
                      {" "}
                      Login
                    </Link>
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    className="signup-btn"
                    disabled={this.getSignUpBtnStatus}
                    onClick={this.createAccount}
                  >
                    Sign Up
                  </Button>
                </div>
              </Box>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withRouter(Signup);
