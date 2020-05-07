import * as React from "react";
import Select from "react-select";
import MobileCategories from "./shared/MobileCategories";

import supportedAddOnsData from "../../static/add-ons.json";
import installerData from "../../static/installer.json";

import("../scss/components/SupportedAddOns.scss");

class SupportedAddOns extends React.Component {
  state = {
    kubernetesVersions: [
      { version: "1.15.0" },
      { version: "1.15.1" },
      { version: "1.15.2" },
      { version: "1.15.3" },
      { version: "1.16.4" },
      { version: "1.17.3" }],
    selectedVersion: { version: "1.17.3" },
    categoryToShow: "",
    categoryVersionsToShow: [],
    mobileCategoriesOpen: false
  }

  onVersionChange = (selectedVersion) => {
    this.setState({ selectedVersion });
  }

  getLabel = ({ version }) => {
    return (
      <div style={{ alignItems: "center", display: "flex" }}>
        <span style={{ fontSize: 18, marginRight: "0.5em" }} className="icon u-kubernetesIcon"></span>
        <span style={{ fontSize: 14 }}>{`Kubernetes ${version}`}</span>
      </div>
    );
  }

  showingCategoryDetails = (category, e) => {
    if (!e.target.classList.contains("icon")) {
      this.setState({ categoryToShow: category });
    }
  }

  onCloseCategory = () => {
    this.setState({ categoryToShow: "" });
  }

  toggleSupportedVersions = (category) => {
    const doesCategoryAlreadyExist = this.state.categoryVersionsToShow.find(c => c === category);
    if (!doesCategoryAlreadyExist) {
      this.setState({ categoryVersionsToShow: [...this.state.categoryVersionsToShow, category] });
    }
  }

  onCloseSupportedVersions = (category) => {
    this.setState({ categoryVersionsToShow: this.state.categoryVersionsToShow.filter(c => c !== category) });
  }

  getDocumentationUrl = (addOn) => {
    if (addOn === "weave" || addOn === "docker" || addOn === "docker registry" || addOn === "contour" || addOn === "prometheus") {
      return <a href={`${addOn === "docker registry" ? "https://kurl.sh/docs/create-installer/add-on-adv-options#registry" : `https://kurl.sh/docs/create-installer/add-on-adv-options#${addOn}`}`} target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover"> Learn more </a>
    } else {
      return <a href={`${addOn === "kots" ? "https://kurl.sh/docs/add-ons/kotsadm" : `https://kurl.sh/docs/add-ons/${addOn}`}`} target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover"> Learn more </a>
    }
  }

  renderDependeciesStates = (dependencies) => {
    if (dependencies.length === 1) {
      if (dependencies[0].includes("OS")) {
        const splitDependecy = dependencies[0].split(" ");
        return <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> Requires {splitDependecy[0]} to be {splitDependecy[1]}  </span>
      } else {
        return <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> Requires a {dependencies[0]} add-on </span>
      }
    } else if (dependencies.length === 2) {
      return <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> Requires {dependencies.join(" & ")} add-ons </span>
    } else {
      return <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> Requires {dependencies.join(", ")} add-ons </span>
    }
  }

  renderAddOnCard = (addOn, i) => {
    const { categoryVersionsToShow } = this.state;
    const { isMobile } = this.props;
    const activeSupportedVersionCategory = categoryVersionsToShow.find(c => c.name === addOn.name);
    const supportedVersions = addOn.name === "Docker Registry" ? installerData["registry"] : addOn.name === "Kots" ? installerData["kotsadm"] : installerData[addOn.name.toLowerCase()];

    return (
      <div className={`${isMobile ? "mobileAddOns--wrapper" : "AddOns--wrapper flex flex-column"}`} key={`${addOn}-${i}`}>
        <div className="addOnsBackground flex alignItems--center">
          <div className="flex flex1 alignItems--center">
            <span className={`icon u-${addOn.name === "Docker Registry" ? "dockerRegistry" : addOn.name === "EKCO" ? "kubernetes" : addOn.name.toLowerCase()} u-marginBottom--small`}></span>
            <div className="flex-column">
              <span className="u-fontSize--largest u-fontWeight--medium u-color--tuna  u-marginLeft--10">{addOn.name}</span>
              <div className="flex flex1 u-marginTop--small">
                {addOn.categories.map((category, i) => {
                  return (
                    <div className="category-item" key={`${category}-${i}`}>
                      <span className="u-color--dustyGray u-fontWeight--medium u-fontSize--normal"> {category}
                      </span>
                    </div>
                  )
                })
                }
              </div>
            </div>
          </div>
          <div className="flex justifyContent--flexEnd">
            <a href={`https://github.com/replicatedhq/kURL/tree/master/addons/${addOn.name.toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="icon u-externalLinkIcon clickable" />
          </div>
        </div>
        {categoryVersionsToShow && activeSupportedVersionCategory && categoryVersionsToShow.length > 0 ?
          <div className="flex1 flex-column alignItems--center u-marginTop--15 u-paddingLeft--15 u-paddingRight--15 u-paddingBottom--10" key={`${addOn}-${i}`}>
            <div className="alignItems--center">
              <span className="icon u-greenCheckmarkSmall" />
              <span className="u-fontSize--large u-fontWeight--bold u-color--tundora u-marginLeft--small"> Supported versions </span>
            </div>
            <div className="SupportedVersionsList--wrapper flex1 flex-column u-marginTop--15">
              {supportedVersions.map((version, i) => {
                return <li className="u-fontSize--large u-fontWeight--medium u-color--dustyGray u-marginTop--small" key={`${version}-${i}`}> {version} </li>
              })}
            </div>
            <div className="u-marginTop--15 roundBorder">
              <span className="icon u-closeCircle clickable" onClick={() => this.onCloseSupportedVersions(addOn)} />
            </div>
          </div>
          :
          <div className="flex-column flex u-marginTop--15 u-paddingLeft--15 u-paddingRight--15 u-paddingBottom--10">
            <div className="flex">
              <span className="icon u-dependecy" />
              <div className="flex-column">
                <span className="u-fontSize--normal u-fontWeight--bold u-color--tundora"> Depends on </span>
                <div className="flex-auto u-marginTop--small">
                  {addOn.dependencies.length > 0 ?
                    this.renderDependeciesStates(addOn.dependencies)
                    :
                    <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small" key={i}> No dependencies required </span>
                  }
                </div>
              </div>
            </div>
            <div className="flex u-marginTop--20">
              <span className="icon u-grayCircleCheckmark" />
              <div className="flex-column">
                <span className="u-fontSize--normal u-fontWeight--bold u-color--tundora"> Works well with </span>
                <div className="flex-auto u-marginTop--small">
                  <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> {addOn.compatibilities.join(", ")} </span>
                </div>
              </div>
            </div>
            <div className="flex u-marginTop--20">
              <span className="icon u-grayCircleExclamationMark" />
              <div className="flex-column">
                <span className="u-fontSize--normal u-fontWeight--bold u-color--tundora"> Incompatible with </span>
                <div className="flex-auto u-marginTop--small">
                  {addOn.incompatibilities.length > 0 ?
                    <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> {addOn.incompatibilities.join(", ")} </span>
                    :
                    <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small"> No incompatibilities </span>
                  }
                </div>
              </div>
            </div>
            <div className="u-marginTop--40">
              <div className="flex flex1">
                {this.getDocumentationUrl(addOn.name.toLowerCase())}
                {supportedVersions && supportedVersions.length > 0 ?
                  <div>
                    <span className="u-color--scorpion u-fontSize--small u-marginLeft--small u-marginRight--small"> | </span>
                    <span className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover" onClick={() => this.toggleSupportedVersions(addOn)}> Supported versions </span>
                  </div>
                  : null
                }
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  renderCategories = (categories, filteredCategoriesToShow) => {
    const { categoryToShow } = this.state;

    if (categoryToShow === "") {
      return categories.map((addOn, i) => {
        return this.renderAddOnCard(addOn, i);
      })
    } else if (filteredCategoriesToShow && filteredCategoriesToShow.length > 0) {
      return filteredCategoriesToShow.map((addOn, i) => {
        return this.renderAddOnCard(addOn, i)
      })
    } else {
      return (
        <div className="alignItems--center body-copy u-marginTop--20">
          <span className="u-fontSize--normal u-color--tuna"> {filteredCategoriesToShow.length} results </span>
          <span className="u-fontSize--normal u-color--dustyGray u-marginLeft--small">for</span>
          <span className="u-fontSize--normal activeTag u-marginLeft--small"> {categoryToShow} </span>
        </div>
      )
    }
  }

  onMobileCategoriesClick = () => {
    this.setState({ mobileCategoriesOpen: !this.state.mobileCategoriesOpen });
  }


  render() {
    const { kubernetesVersions, selectedVersion, categoryToShow } = this.state;
    const { isMobile } = this.props;

    const filteredCategoriesToShow = supportedAddOnsData.addOns.filter(addOn => (categoryToShow === addOn.categories.find(c => c === categoryToShow)));

    return (
      <div className="u-minHeight--full u-width--full flex-column flex1 u-overflow--auto">
        <div className={`${isMobile ? "mobile-container flex flex-column" : "container"} u-marginBottom---40`}>
          <h2> Supported Add-ons</h2>
          <div className={`${!isMobile && "u-width--half"}`}>
            <span className="u-fontWeight--medium u-color--tuna u-fontSize--large u-lineHeight--more">
              It all starts with Kubernetes. kURL uses <a href="https://kustomize.io/" target="_blank" rel="noopener noreferrer" className="u-color--royalBlue">Kustomize </a> to assist in the automation of tasks enabling any
                user to deploy to a Kubernetes cluster with a single script.
                Select the version of Kubernetes you’re using to see which add-ons are supported.
              </span>
          </div>
          <div className="u-borderTop--gray u-marginTop--30">
            <div className={`flex ${isMobile ? "flex-column" : "flex1"} u-marginTop--30`}>
              <div className="flex flex-column">
                <div className={`flex flex-column ${isMobile ? "mobile-wrapperForm alignItems--center" : "wrapperForm"}`}>
                  <span className="u-fontWeight--bold u-fontSize--large u-color--tundora"> Select your Kubernetes version</span>
                  <div className="SelectKubernetes--wrapper u-marginTop--15" style={{ width: "250px" }}>
                    <Select
                      options={kubernetesVersions}
                      getOptionLabel={this.getLabel}
                      getOptionValue={(version) => version}
                      value={selectedVersion}
                      onChange={this.onVersionChange}
                      matchProp="value"
                      isOptionSelected={() => false}
                      isSearchable={false}
                    />
                  </div>
                </div>
                {!isMobile ?
                  <div className="flex-column u-marginTop--40">
                    <span className="u-fontSize--18  u-color--tundora u-fontWeight--bold"> Categories </span>
                    <div className="u-borderTop--gray u-marginTop--12">
                      {supportedAddOnsData.categories.map((category, i) => (
                        <p className={`Category--item u-fontSize--normal u-color--dustyGray u-fontWeight--bold u-lineHeight--normal body-copy flex alignItems--center justifyContent--spaceBetween ${category === this.state.categoryToShow && "is-active"}`} onClick={(e) => this.showingCategoryDetails(category, e)} key={`${category}-${i}`}>
                          {category}
                          {category === this.state.categoryToShow && <span className="icon u-whiteCloseIcon u-marginLeft--10 clickable" onClick={this.onCloseCategory} />}
                        </p>
                      ))}
                    </div>
                  </div>
                  :
                  <div className="flex flex-column u-marginTop--20">
                    <button className="Button secondary" onClick={() => this.onMobileCategoriesClick()}> Categories </button>
                  </div>
                }
              </div>
              <div className={`flex flexWrap--wrap u-width--full ${isMobile ? "justifyContent--center u-marginTop--15" : "u-marginLeft--50"}`}>
                {this.renderCategories(supportedAddOnsData.addOns, filteredCategoriesToShow)}
              </div>
            </div>
          </div>
        </div>
        <div className="AddOns--footer flex flex-1-auto">
          <div className="AddOns--background flex flex-1-auto">
            <div className="flex1 flex-column u-marginTop--40 u-marginBottom--40 justifyContent--center alignItems--center u-textAlign--center">
              <div className="flex title"> Want more Add-ons? </div>
              <p className="flex u-width--half u-lineHeight--more"> We’re working to always add more add-ons to kURL. If there is a particular service you want check out our contributing guide and submit a PR. </p>
              <a href="https://github.com/replicatedhq/kurl" target="_blank" rel="noopener noreferrer" className="Button secondary-white u-marginTop--normal u-marginBottom--more"> Contribute to kURL </a>
            </div>
          </div>
        </div>
        {isMobile ? (
          <MobileCategories
            className="MobileNavBar"
            categoryToShow={categoryToShow}
            onCloseCategory={this.onCloseCategory}
            categoryItems={supportedAddOnsData.categories}
            isOpen={this.state.mobileCategoriesOpen}
            showingCategoryDetails={this.showingCategoryDetails}
            onClose={this.onMobileCategoriesClick}
          />
        ) : null}
      </div>
    );
  }
}

export default SupportedAddOns;
