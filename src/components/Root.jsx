import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "../scss/index.scss"
import Main from "./Main.jsx";
import Footer from "./Footer.jsx";

class Root extends React.Component {
  render() {
    return (
      <div className="flex-column flex1">
        <div className="flex-column flex1">
          <BrowserRouter>
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Main />}
              />
            </Switch>
            <div className="flex-auto Footer-wrapper u-width--full">
              <Footer />
            </div>
          </BrowserRouter>
        </div>
      </div>
    )
  }
};

ReactDOM.render(<Root />, document.getElementById("app"));