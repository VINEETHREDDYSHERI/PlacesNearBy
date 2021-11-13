import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./ResetPwdDialog.css";
import Link from '@mui/material/Link';

export default function ResetPwdDialog(props) {
  const [code, setCode] = React.useState(null);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setconfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [confirmpasswordError, setConfirmPasswordError] = React.useState(false);

  const handleChange = (event, name) => {
    if (name === "code") {
      setCode(event.target.value);
    } else if (name === "password") {
      setPassword(event.target.value);
      event.target.value.length < 8
        ? setPasswordError(true)
        : setPasswordError(false);
    } else {
      setconfirmPassword(event.target.value);
      password !== event.target.value || confirmPassword === ""
        ? setConfirmPasswordError(true)
        : setConfirmPasswordError(false);
    }
  };

  const onClose = () => {
    cleanUP();
    props.onClose();
  }

  const resendMail = () => {
    cleanUP();
    props.resendMail()
  }

  const cleanUP = () => {
    setCode(null);
    setPassword("");
    setconfirmPassword("");
    setPasswordError(false);
    setConfirmPasswordError(false);
  }

  return (
    <div>
      <Dialog
        open={props.open}
        classes={{ paper: "dialogWidth" }}
        onClose={onClose}
      >
        <DialogTitle style={{ color: "#030140" }} variant="h5">
          Create New Password
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2">
            Your new password must be different from the previous used
            passwords.
          </DialogContentText>
          <TextField
            fullWidth
            sx={{ marginTop: 2 }}
            label="Enter the code"
            required
            error={code===""}
            value={code}
            onChange={(event) => handleChange(event, "code")}
            helperText="Check your email for the code."
          />
          <TextField
            fullWidth
            sx={{ marginTop: 2 }}
            label="Password"
            required
            type="password"
            value={password}
            onBlur={() =>
              password.length < 8
                ? setPasswordError(true)
                : setPasswordError(false)
            }
            error={passwordError}
            onChange={(event) => handleChange(event, "password")}
            helperText="Must be atleast 8 characters."
          />
          <TextField
            fullWidth
            sx={{ marginTop: 2 }}
            label="Confirm Password"
            required
            type="password"
            value={confirmPassword}
            error={confirmpasswordError}
            onBlur={() =>
              password !== confirmPassword
                ? setConfirmPasswordError(true)
                : setConfirmPasswordError(false)
            }
            onChange={(event) => handleChange(event, "confirmPassword")}
            helperText="Both passwords must match"
          />
          <Link component="button" underline="hover" style={{marginTop: 10, marginLeft:10}} onClick={resendMail}>Click here to Re-Enter the Email Address</Link>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", marginBottom: 16 }}>
          <Button
            variant="contained"
            disabled={
              confirmpasswordError ||
              passwordError ||
              password === "" ||
              confirmPassword === "" ||
              code === ""
            }
            onClick={() => props.resetPwd(code, confirmPassword)}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
