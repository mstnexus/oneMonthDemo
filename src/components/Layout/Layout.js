import React, { Component } from "react";
import Navigation from "../Navigation/Navigation";
import { Route } from "react-router-dom";
import AppointmentBuilder from "../../containers/AppointmentBuilder/AppointmentBuilder";
import ButtonBases from "../LandingPage/LandingPage";
import { Button } from "@material-ui/core";
import Surgeon from "../Surgeon/Surgeon";

class Layout extends Component {
  render() {
    return (
      <>
        <Navigation />
        <Route path="/patients" exact component={AppointmentBuilder} />
        <Route path="/" exact component={ButtonBases} />
        <Route path="/surgeon" component={Surgeon} />
      </>
    );
  }
}

export default Layout;
