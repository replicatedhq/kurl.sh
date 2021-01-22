import * as React from "react";
import Select from "react-select";
import { Link, navigate } from "gatsby";
import MobileCategories from "./MobileCategories";
import Loader from "./shared/Loader";

import { Utilities } from "./utilities";
import isEmpty from "lodash/isEmpty";
import chunk from "lodash/chunk";
import intersection from "lodash/intersection";

import "../scss/components/SupportedAddOns.scss";

class SupportedAddOns extends React.Component {
  state = {
    kubernetesVersions: [
      { version: "1.20.2" },
      { version: "1.19.7" },
      { version: "1.19.3" },
      { version: "1.19.2" },
      { version: "1.18.10" },
      { version: "1.18.9" },
      { version: "1.18.4" },
      { version: "1.17.13" },
      { version: "1.17.7" },
      { version: "1.17.3" },
      { version: "1.16.4" },
      { version: "1.15.3" },
      { version: "1.15.2" },
      { version: "1.15.1" },
      { version: "1.15.0" }],
    selectedVersion: { version: "1.20.2" },
    categoryToShow: "",
    categoryVersionsToShow: [],
    mobileCategoriesOpen: false,
    supportedVersions: [],
    supportedAddOns: [],
    categories: []
  }

  getSupportedAddOnsData = async () => {
    const url = `${process.env.ADDONS_JSON}`;
    try {
      const resp = await fetch(url);
      const addOns = await resp.json();
      this.setState({
        // hiding calico add on
        supportedAddOns: addOns.addOns.filter(a => a.name !== "calico"),
        categories: [...new Set(addOns.addOns.map(add => chunk(add.fulfills, 1)[0].join("")))]
      });
    } catch (error) {
      throw error;
    }
  }

  getSupportedVersions = async () => {
    this.setState({ supportedVersions: await Utilities.getSupportedVersions() })
  }

  getCurrentCategory = (category) => {
    if (category === "pvc-provisioner") {
      this.setState({ categoryToShow: "PVC Provisioner" })
    } else if (category === "cni-plugin") {
      this.setState({ categoryToShow: "CNI Plugin" });
    } else if (category === "metrics-monitoring") {
      this.setState({ categoryToShow: "Metrics & Monitoring" });
    } else {
      this.setState({
        categoryToShow: Utilities.toTitleCase(category.replace("-", " "))
      })
    }
  }

  getAddOnIncompatibilities = (addOn) => {
    const incompatibileAddOns = this.state.supportedAddOns.filter(a => intersection(a.fulfills, addOn.fulfills).length > 0).map(a => a.name);
    if (incompatibileAddOns.length > 1) {
      if (addOn.name === "minio" || addOn.name === "rook" || addOn.name === "openEBS") {
        return "No incompatibilities";
      } else {
        return this.generateVersionName(incompatibileAddOns.filter(add => add !== addOn.name).join(", "));
      }
    } else {
      return "No incompatibilities";
    }
  }

  componentDidMount() {
    if (this.props.category) {
      this.getCurrentCategory(this.props.category);
    }
    this.getSupportedAddOnsData();
    this.getSupportedVersions();
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
    this.setState({ categoryToShow: "" }, () => {
      navigate("/add-ons");
    });
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

  renderDependeciesStates = (requires) => {
    if (requires.length === 1) {
      if (requires[0].includes("OS")) {
        const splitDependecy = requires[0].split(" ");
        return <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> Requires {splitDependecy[0]} to be {splitDependecy[1]}  </span>
      } else {
        return <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> Requires a {requires[0]} add-on </span>
      }
    } else if (requires.length === 2) {
      return <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> Requires {requires.join(" & ")} add-ons </span>
    } else {
      return <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> Requires {requires.join(", ")} add-ons </span>
    }
  }

  generateVersionName = (name) => {
    switch (name) {
      case "kotsadm":
        return "KOTS";
      case "selinux":
        return "SELinux";
      case "firewalld":
        return "firewalld";
      case "ekco":
        return "EKCO";
      case "openEBS":
        return "OpenEBS";
      case "iptables":
        return "iptables"
      default:
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }

  renderAddOnCard = (addOn, i, filteredCategories) => {
    const { categoryVersionsToShow, supportedVersions } = this.state;
    const { isMobile } = this.props;
    const activeSupportedVersionCategory = categoryVersionsToShow.find(c => c.name === addOn.name);
    const versions = supportedVersions[addOn.name];


    return (
      <div className={`${isMobile ? "mobileAddOns--wrapper" : filteredCategories ? "AddOns--wrapper fixedHeight flex flex-column" : "AddOns--wrapper flex flex-column"}`} key={`${addOn}-${i}`}>
        <div className="addOnsBackground flex alignItems--center">
          <div className="flex flex1 alignItems--center">
            <span className={`icon u-${addOn.name === "ekco" || addOn.name === "metrics-server" ? "kubernetes" : addOn.name === "cert-manager" ? "certManager" : addOn.name.toLowerCase()} u-marginBottom--small`}></span>
            <div className="flex-column">
              <span className="u-fontSize--largest u-fontWeight--medium u-color--tuna  u-marginLeft--10">{this.generateVersionName(addOn.name)}</span>
              <div className="flex flex1 u-marginTop--small">
                {addOn.fulfills.map((category, i) => {
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
            <a href={`https://github.com/replicatedhq/kURL/tree/master/addons/${addOn.name}`} target="_blank" rel="noopener noreferrer"> <i className="icon u-externalLinkIcon clickable"></i> </a>
          </div>
        </div>
        {categoryVersionsToShow && activeSupportedVersionCategory && categoryVersionsToShow.length > 0 ?
          <div className="flex1 flex-column alignItems--center u-marginTop--15 u-paddingLeft--15 u-paddingRight--15 u-paddingBottom--10" key={`${addOn}-${i}`}>
            <div className="alignItems--center">
              <span className="icon u-greenCheckmarkSmall" />
              <span className="u-fontSize--large u-fontWeight--bold u-color--tundora u-marginLeft--small"> Supported versions </span>
            </div>
            <div className="SupportedVersionsList--wrapper flex1 flex-column u-marginTop--15">
              {versions.map((version, i) => {
                return <li className="u-fontSize--large u-fontWeight--medium u-color--dustyGray u-marginTop--small" key={`${version}-${i}`}> {version} </li>
              })}
            </div>
            <div className="u-marginTop--15 roundBorder">
              <span className="icon u-closeCircle clickable" onClick={() => this.onCloseSupportedVersions(addOn)} />
            </div>
          </div>
          :
          <div className="u-marginTop--15 u-paddingLeft--15 u-paddingRight--15 u-paddingBottom--10">
            <div className="flex-column flex1 dependeciesWrapper">
              <div className="flex">
                <span className="icon u-dependecy" />
                <div className="flex-column">
                  <span className="u-fontSize--normal u-fontWeight--bold u-color--tundora"> Depends on </span>
                  <div className="flex-auto u-marginTop--small">
                    {addOn.requires.length > 0 ?
                      this.renderDependeciesStates(addOn.requires)
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
                    {addOn.recommends.length > 0 ?
                      <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> {this.generateVersionName(addOn.recommends.join(", "))} </span>
                      :
                      <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> KOTS </span>
                    }
                  </div>
                </div>
              </div>
              <div className="flex u-marginTop--20">
                <span className="icon u-grayCircleExclamationMark" />
                <div className="flex-column">
                  <span className="u-fontSize--normal u-fontWeight--bold u-color--tundora"> Incompatible with </span>
                  <div className="flex-auto u-marginTop--small">
                    <span className="u-fontSize--normal u-fontWeight--normal u-color--dustyGray u-marginTop--small u-display--inline u-marginRight--small"> {this.getAddOnIncompatibilities(addOn)} </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`flex flex1 ${isMobile && "u-marginTop--40"}`}>
              <div className="flex flex1">
                <a href={`https://kurl.sh/docs/add-ons/${addOn.name}`} target="_blank" rel="noopener noreferrer" className="u-color--royalBlue u-fontWeight--medium u-fontSize--normal u-lineHeight--more u-textDecoration--underlineOnHover"> Learn more </a>
                {versions && versions.length > 0 ?
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
        return this.renderAddOnCard(addOn, i, false);
      })
    } else if (filteredCategoriesToShow && filteredCategoriesToShow.length > 0) {
      return filteredCategoriesToShow.map((addOn, i) => {
        return this.renderAddOnCard(addOn, i, true)
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
    const { kubernetesVersions, selectedVersion, categoryToShow, supportedAddOns, categories } = this.state;
    const { isMobile } = this.props;

    const filteredCategoriesToShow = supportedAddOns.filter(addOn => (categoryToShow === addOn.fulfills.find(c => c === categoryToShow)));

    if (isEmpty(supportedAddOns)) {
      return (
        <div className="flex-column flex-1-auto u-overflow--hidden justifyContent--center alignItems--center">
          <Loader
            size="70"
          />
        </div>
      )
    }

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
                      {categories.map((category, i) => (
                        <Link to={`${category === "Metrics & Monitoring" ? "/add-ons/?category=metrics-monitoring" : `/add-ons/?category=${category.replace(/\s/g, "-").toLowerCase()}`}`} className={`Category--item u-fontSize--normal u-color--dustyGray u-fontWeight--bold u-lineHeight--normal body-copy flex alignItems--center justifyContent--spaceBetween ${category === this.state.categoryToShow && "is-active"}`} onClick={(e) => this.showingCategoryDetails(category, e)} key={`${category}-${i}`}>
                          {category}
                          {category === this.state.categoryToShow && <span className="icon u-whiteCloseIcon u-marginLeft--10 clickable" onClick={this.onCloseCategory} />}
                        </Link>
                      )
                      )}
                    </div>
                  </div>
                  :
                  <div className="flex flex-column u-marginTop--20">
                    <button className="Button secondary" onClick={() => this.onMobileCategoriesClick()}> Categories </button>
                  </div>
                }
              </div>
              <div className={`flex flexWrap--wrap u-width--full ${isMobile ? "justifyContent--center u-marginTop--15" : "u-marginLeft--50"}`}>
                {this.renderCategories(supportedAddOns, filteredCategoriesToShow)}
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
            categoryItems={categories}
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
