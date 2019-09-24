import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Kurlsh from "../components/Kurlsh";
import DownloadAirgapBundle from "../components/DownloadAirgapBundle";
import SupportedAddOns from "../components/SupportedAddOns";
import NavBar from "../components/shared/NavBar";
import Footer from "../components/shared/Footer"
import "../scss/index.scss"

const Root = () => {
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
            <Route
              path="/add-ons"
              render={() => <SupportedAddOns />}
            />
          </Switch>
          <div className="flex-auto Footer-wrapper u-width--full">
            <Footer />
          </div>
        </BrowserRouter>
      </div>
    </div>
  )
};

export default Root;