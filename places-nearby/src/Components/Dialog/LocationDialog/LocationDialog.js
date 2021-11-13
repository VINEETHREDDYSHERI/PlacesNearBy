import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./LocationDialog.css";

export default function LocationDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        classes={{ paper: "locationDialog" }}
        onClose={() => props.onClose()}
      >
        <DialogTitle style={{ color: "#030140" }} variant="h5">
          Enable Location
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body1">
            Enable Location service to get near by venues or Enter the location manually. If already enabled location wait for 2-3 seconds.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ marginBottom: 16, marginRight: 16 }}>
          <Button variant="contained" onClick={() => props.onClose()}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
