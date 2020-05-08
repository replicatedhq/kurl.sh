import React from "react";
import PropTypes from "prop-types";
import withLocation from "../../withLocation";
import SupportedAddOns from "./SupportedAddOns";

const CustomQueryStringComponent = ({ search, isMobile }) => {
  const { category } = search
  return <SupportedAddOns category={category} isMobile={isMobile} />
}

CustomQueryStringComponent.propTypes = {
  search: PropTypes.object,
}

export default withLocation(CustomQueryStringComponent)