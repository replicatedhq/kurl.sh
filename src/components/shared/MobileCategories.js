import * as React from "react";
import * as PropTypes from "prop-types";

import "../../scss/components/shared/MobileCategories.scss";

export default class MobileCategories extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func,
  };
  static defaultProps = {
    user: {}
  };

  showingCategoryDetails = (category, e) => {
    this.props.showingCategoryDetails(category, e);
    this.props.onClose();
  }

  render() {
    const {
      isOpen,
      categoryItems,
      onClose,
      categoryToShow,
      onCloseCategory,
    } = this.props;

    const mobileDropdownVisibleClasses = `MobileFilters ${isOpen ? "is-open" : ""}`;

    return (
      <nav className={mobileDropdownVisibleClasses}>
        <div className="MobileFilters-menu u-overflow--auto">
          <div className="flex flex1 u-padding--20 justifyContent--spaceBetween alignItems--center">
            <p className="u-fontSize--18 u-fontWeight--bold u-color--biscay u-lineHeight--more"> Categories </p>
            <span className={`${isOpen ? "icon clickable u-closeBlueIcon" : ""}`} onClick={onClose}></span>
          </div>
          <div className="flex u-borderTop--gray u-padding--20">
            <div className="flex-column u-marginTop--10">
              {categoryItems.map((category, i) => {
                return (
                  <span className={`Category--item u-fontSize--normal u-color--dustyGray u-fontWeight--bold u-lineHeight--normal body-copy flex justifyContent--spaceBetween alignItems--center ${category === categoryToShow && "is-active"}`} onClick={(e) => this.showingCategoryDetails(category, e)} key={`${category}-${i}`}>
                    {category}
                    {category === categoryToShow && <span className="icon u-whiteCloseIcon clickable u-marginLeft--small" onClick={onCloseCategory} />}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
        <div className="MobileFilters-bg flex1" onClick={onClose} />
      </nav>
    );
  }
}
