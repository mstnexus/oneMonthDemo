import React, { Component } from "react";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import "./App.css";

class App extends Component {
  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="App">
          <Layout>
            <Navigation />
          </Layout>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;
