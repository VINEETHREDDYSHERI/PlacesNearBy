import * as React from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Link as RouterLink } from "react-router-dom";
import "./LoginDialog.css";

export default function LoginDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        classes={{ paper: "dialogWidth" }}
        onClose={() => props.onClose()}
      >
        <DialogTitle style={{ color: "#030140" }} variant="h5">
          Login
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body1">
            This feature is not available in Guest mode. {" "}
            <Link
              to="/login"
              component={RouterLink}
              underline="none"
            >
              Click here
            </Link> {" "}
            to Login into our applications.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ marginBottom: 16, marginRight: 16 }}>
          <Button variant="contained" onClick={() => props.onClose()}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
