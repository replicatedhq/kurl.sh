import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "../scss/index.scss"
import Kurlsh from "./Kurlsh.jsx";
import DownloadAirgapBundle from "./DownloadAirgapBundle.jsx";
import NavBar from "./shared/NavBar";
import Footer from "./shared/Footer.jsx";

class Root extends React.Component {
  render() {
    return (
      <div className="u-minHeight--full flex-column flex1">
        <div className="flex-column flex1">
          <BrowserRouter>
            <NavBar />
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Kurlsh />}
              />
              <Route
                path="/:sha/download"
                render={() => <DownloadAirgapBundle />}
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