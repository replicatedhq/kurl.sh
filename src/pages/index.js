import React from "react";
import NavBar from "../components/shared/NavBar";
import Kurlsh from "../components/Kurlsh";
import Footer from "../components/shared/Footer"
import "../scss/index.scss"

const Kurl = () => {
  return (
    <div className="u-minHeight--full flex-column flex1">
      <div className="flex-column flex1">
        <NavBar />
        <Kurlsh />
        <div className="flex-auto Footer-wrapper u-width--full">
          <Footer />
        </div>
      </div>
    </div>
  )
};

export default Kurl;