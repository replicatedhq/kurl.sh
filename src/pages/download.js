import React from "react";
import NavBar from "../components/shared/NavBar";
import DownloadAirgapBundle from "../components/DownloadAirgapBundle";
import Footer from "../components/shared/Footer"

const Download = () => {
  return (
    <div className="u-minHeight--full flex-column flex1">
      <div className="flex-column flex1">
        <NavBar />
        <DownloadAirgapBundle />
        <div className="flex-auto Footer-wrapper u-width--full">
          <Footer />
        </div>
      </div>
    </div>
  )
};

export default Download;