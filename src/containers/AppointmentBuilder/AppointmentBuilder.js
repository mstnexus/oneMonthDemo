import React, { Component } from "react";
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Step,
  Stepper,
  StepButton,
  StepContent,
  TextField,
  Typography
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import * as moment from "moment";

class AppointmentBuilder extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      value: "",
      selectedIndex: 1,
      smallScreen: window.innerWidth < 768,
      validEmail: true,
      validPhone: true,
      setType: "",
      open: false,
      setOpen: false,
      confirmationTextVisible: false,
      location: "1229 Madison St, Suite 1250, Seattle, WA 98104",
      clinicPhone: "(800) 340-3595",
      phone: "",
      parsedNumber: "",
      secondModal: false,
      stepIndex: 0
    };
    this.anchorRef = React.createRef();
    this.handleNextStep = this.handleNextStep.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    this.handleParseHandler = this.handleParseHandler.bind(this);
    this.closeSecondModal = this.closeSecondModal.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
  }

  handleNextStep() {
    const { stepIndex } = this.state;
    return stepIndex < 4 ? this.setState({ stepIndex: stepIndex + 1 }) : null;
  }

  // handleChange(event) {
  //   this.handleNextStep();
  //   this.setState({
  //     setType: event.target.value,
  //     confirmationTextVisible: true
  //   });
  // }

  handleFetch(response) {
    const { configs, appointments } = response;
    const initSchedule = {};
    const today = moment().startOf("day");
    initSchedule[today.format("YYYY-DD-MM")] = true;
  }

  handleClose() {
    this.setState({ setOpen: false, open: false });
  }

  handleOpen() {
    this.setState({ setOpen: true });
  }

  handleSetDate(date) {
    this.handleNextStep();
    this.setState({ appointmentDate: date, confirmationTextVisible: true });
  }

  handleSetSlot(slot) {
    this.handleNextStep();
    this.setState({ appointmentSlot: slot });
  }

  validateEmail(email) {
    const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regex.test(email)
      ? this.setState({ email: email, validEmail: true })
      : this.setState({ validEmail: false });
  }

  validatePhone(event, phoneNumber) {
    const regex = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/;
    this.setState({ phone: event.target.value });
    return regex.test(phoneNumber)
      ? this.setState({ phone: phoneNumber, validPhone: true })
      : this.setState({ validPhone: false });
  }

  handleParseHandler() {
    let parsedNumber = `+1${this.state.phone}`;
    this.setState({ phone: parsedNumber });
  }

  renderAppointmentTimes() {
    if (this.state.loading) {
      const slots = [...Array(8).keys()];
      return slots.map(slot => {
        const t1 = moment()
          .hour(9)
          .minute(0)
          .add(slot, "hours");
        const t2 = moment()
          .hour(9)
          .minute(0)
          .add(slot + 1, "hours");
        return (
          <FormControlLabel
            control={
              <Radio
                onChange={val => this.setState({ appointmentSlot: val })}
              />
            }
            label={t1.format("h:mm a") + " - " + t2.format("h:mm a")}
            key={slot}
            value={slot}
          />
        );
      });
    } else {
      return null;
    }
  }

  renderConfirmationString() {
    const spanStyle = { color: "#3F51B5" };
    return this.state.confirmationTextVisible ? (
      <h2
        style={{
          textAlign: this.state.smallScreen ? "center" : "left",
          color: "#bdbdbd",
          lineHeight: 1.5,
          padding: "0 10px",
          fontFamily: "inherit",
          fontWeight: 300
        }}
      >
        {
          <span>
            Scheduling your appointment{"  "}
            {this.state.appointmentDate && (
              <span>
                on{" "}
                <span style={spanStyle}>
                  {moment(this.state.appointmentDate).format("dddd[,] MMMM Do")}
                </span>
              </span>
            )}{" "}
            {this.state.appointmentSlot && (
              <span>
                at{" "}
                <span style={spanStyle}>
                  {moment()
                    .hours(9)
                    .minute(0)
                    .add(this.state.appointmentSlot, "hours")
                    .format("h:mm a")}
                </span>
              </span>
              // )}{" "}
              // at
              /* <span style={spanStyle}> Evergreen Eye Clinic.</span> */
            )}
            {"."}
          </span>
        }
      </h2>
    ) : null;
  }

  addAppointment(event) {
    event.preventDefault();

    const confirmation = {
      owner_id: this.client.auth.user.id,
      name: this.state.firstName,
      date: this.state.appointmentDate,
      type: this.state.setType,
      location: this.state.location,
      phone: this.state.phone
    };

    this.db
      .collection("new_appointment")
      .insertOne(confirmation)
      .then(result =>
        console.log(
          `Successfully inserted item with _id: ${
            result.insertedIds
          } and the appointment date is ${this.appointmentDate}`
        )
      )
      .catch(err => console.error(`Failed to insert item: ${err}`))
      .then(this.handleClose)
      .then(
        window.setTimeout(() => {
          this.openSecondModal();
        }, 3000)
      );
  }

  openSecondModal() {
    this.setState({ secondModal: true });
  }

  closeSecondModal() {
    this.setState({ secondModal: false });
    window.location.reload();
  }

  renderAppointmentConfirmation() {
    const spanStyle = { color: "#3F51B5" };
    return (
      <section>
        <p>
          Name:{" "}
          <span style={spanStyle}>
            {this.state.firstName} {this.state.lastName}
          </span>
        </p>
        <p>
          Number: <span style={spanStyle}>{this.state.phone}</span>
        </p>
        <p>
          Email: <span style={spanStyle}>{this.state.email}</span>
        </p>
        <p>
          Appointment:{" "}
          <span style={spanStyle}>
            {moment(this.state.appointmentDate).format(
              "dddd[,] MMMM Do[,] YYYY"
            )}
          </span>{" "}
          at{" "}
          <span style={spanStyle}>
            {moment()
              .hour(9)
              .minute(0)
              .add(this.state.appointmentSlot, "hours")
              .format("h:mm a")}
          </span>
        </p>
        <p>
          Location: <span style={spanStyle}>{this.state.location}</span>
        </p>
        <p>
          Clinic Phone: <span style={spanStyle}>{this.state.clinicPhone}</span>
        </p>
      </section>
    );
  }

  componentDidMount() {
    // Initialize the App Client
    this.client = Stitch.initializeDefaultAppClient(
      "appointmentscheduler-racyu"
    );

    Stitch.defaultAppClient.auth
      .loginWithCredential(new AnonymousCredential())
      .then(user => {
        console.log(`Logged in as anonymous user with id: ${user.id}`);
      })
      .catch(console.error);
    // Get a MongoDB Service Client, used for logging in and communicating with Stitch
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    // Get a reference to the todo database
    this.db = mongodb.db("appointments");
  }

  render() {
    const { stepIndex, smallScreen, loading, ...data } = this.state;
    return (
      <>
        <section
          style={{
            maxWidth: !smallScreen ? "80%" : "100%",
            margin: "auto",
            marginTop: !smallScreen ? 20 : 0
          }}
        >
          {this.renderConfirmationString()}

          <Card
            style={{
              marginTop: "20px",
              padding: "10px 10px 25px 10px",
              height: smallScreen ? "100vh" : null
            }}
          >
            <Stepper activeStep={stepIndex} orientation="vertical" nonLinear>
              {/* <Step disabled={loading} index={0}>
                <StepButton
                  style={{ marginTop: "5px" }}
                  onClick={() => this.setState({ stepIndex: 0 })}
                >
                  Choose the type of appointment
                </StepButton>
                <StepContent>
                  <form
                    style={{
                      minWidth: 200,
                      textAlign: "left",
                      paddingTop: "5px"
                    }}
                  >
                    <FormControl>
                      <Select
                        style={{ width: "200px", margin: "auto" }}
                        value={this.state.setType}
                        onClose={this.handleClose}
                        onOpen={this.handleOpen}
                        onChange={this.handleChange}
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
                </StepContent> 
              </Step>*/}

              <Step disabled={loading} index={0}>
                <StepButton onClick={() => this.setState({ stepIndex: 1 })}>
                  Choose an available day for your appointment
                </StepButton>

                <StepContent>
                  <DatePicker
                    style={{
                      marginTop: 10,
                      marginLeft: 10
                    }}
                    value={data.appointmentDate}
                    mode={smallScreen ? "portrait" : "landscape"}
                    label="Select a date"
                    onChange={date => this.handleSetDate(date)}
                  />
                </StepContent>
              </Step>
              <Step disabled={!data.appointmentDate}>
                <StepButton onClick={() => this.setState({ stepIndex: 1 })}>
                  Choose an available time for your appointment
                </StepButton>
                <StepContent>
                  <FormControl>
                    <FormLabel component="legend">
                      Select Available Appointment Times
                    </FormLabel>
                    <RadioGroup
                      name="appointmentTimes"
                      onChange={val => this.handleSetSlot(val.target.value)}
                    >
                      <FormControlLabel
                        value="9:00 am"
                        control={<Radio color="primary" />}
                        label="8:00am - 9:00am"
                        disabled={true}
                      />
                      <FormControlLabel
                        value="9:00 am"
                        control={<Radio color="primary" />}
                        label="9:00am - 10:00am"
                      />
                      <FormControlLabel
                        value="10:00 am"
                        control={<Radio color="primary" />}
                        label="10:00am - 11:00am"
                        disabled={true}
                      />
                      <FormControlLabel
                        value="11:00 am"
                        control={<Radio color="primary" />}
                        label="11:00am - 12:00pm"
                        disabled={true}
                      />
                    </RadioGroup>
                  </FormControl>
                </StepContent>
              </Step>
              <Step>
                <StepButton onClick={() => this.setState({ stepIndex: 2 })}>
                  Share your contact information with us and we'll send you a
                  reminder
                </StepButton>
                <StepContent>
                  <TextField
                    style={{ display: "block" }}
                    name="first_name"
                    label="First Name"
                    fullWidth
                    onChange={newValue =>
                      this.setState({ firstName: newValue.target.value })
                    }
                  />
                  <TextField
                    style={{ display: "block" }}
                    name="last_name"
                    label="Last Name"
                    fullWidth
                    onChange={newValue =>
                      this.setState({ lastName: newValue.target.value })
                    }
                  />
                  <TextField
                    style={{ display: "block" }}
                    name="email"
                    fullWidth
                    label="name@mail.com (optional)"
                    onClick={() =>
                      this.setState({
                        confirmationModalOpen: !this.state.confirmationModalOpen
                      })
                    }
                    onChange={newValue =>
                      this.validateEmail(newValue.target.value)
                    }
                  />
                  <TextField
                    style={{ display: "block" }}
                    name="phone"
                    label="(888) 888-8888"
                    fullWidth
                    onChange={newValue => this.validatePhone(newValue)}
                    onChangeCapture={this.handleParseHandler}
                  />
                  <Button
                    style={{ marginTop: "20px" }}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => this.setState({ open: true })}
                  >
                    Schedule
                  </Button>
                </StepContent>
              </Step>
            </Stepper>
          </Card>
          <form onSubmit={this.addAppointment}>
            <Dialog
              open={this.state.open}
              onClose={this.openSecondModal}
              ref={this.modalOneRef}
            >
              <DialogTitle id="alert-dialog-title">
                Confirm your appointment?
              </DialogTitle>
              <DialogContent>
                {this.renderAppointmentConfirmation()}
                <DialogContentText id="alert-dialog-description" />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>

                <Button
                  onClick={this.addAppointment}
                  variant="contained"
                  color="primary"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </section>
        <Dialog open={this.state.secondModal} onClose={this.handleClose}>
          <DialogTitle>Your appointment has been confirmed!</DialogTitle>
          <DialogContent>
            <Button
              onClick={this.closeSecondModal}
              color="primary"
              variant="contained"
              style={{
                textAlign: "center",
                margin: "auto",
                display: "flex"
              }}
            >
              OK
            </Button>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default AppointmentBuilder;
