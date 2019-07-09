import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    marginLeft: "40px",
    minWidth: 200,
    textAlign: "left",
    paddingTop: "5px"
  }
}));

export default function ControlledOpenSelect(props) {
  const classes = useStyles();
  const [type, setType] = React.useState("");
  const [open, setOpen, confirmationTextVisible] = React.useState(false);
  const confirmationText = renderConfirmationString();
  function handleChange(event) {
    setType(event.target.value);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  function renderConfirmationString() {
    const spanStyle = { color: "#3F51B5" };
    return confirmationTextVisible ? (
      <h2
        style={{
          textAlign: "center",
          color: "#bdbdbd",
          lineHeight: 1.5,
          padding: "0 10px",
          fontFamily: "Roboto",
          fontWeight: 300
        }}
      >
        {
          <span>
            Scheduling a<span style={spanStyle}> {setType}</span>
            appointment{" "}
          </span>
        }
      </h2>
    ) : null;
  }

  return (
    <form autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="demo-controlled-open-select">
          Appointment Type
        </InputLabel>
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={type}
          onChange={handleChange}
          renderValue={confirmationText}
          inputProps={{
            name: "type",
            id: "demo-controlled-open-select"
          }}
        >
          <MenuItem value={"Consultation"}>Consultation</MenuItem>
          <MenuItem value={"Pre-Op"}>Pre-Op</MenuItem>
          <MenuItem value={"Surgery"}>Surgery</MenuItem>
          <MenuItem value={"Post-Op"}>Post-Op</MenuItem>
        </Select>
      </FormControl>
    </form>
  );
}
