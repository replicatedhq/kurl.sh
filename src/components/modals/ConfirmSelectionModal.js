import * as React from "react";
import Modal from "react-modal";
import isEmpty from "lodash/isEmpty";

import { Utilities } from "../utilities";

import "../../scss/components/modals/ConfirmSelectionModal.scss";


class ConfirmSelectionModal extends React.Component {
  state = {
    addOnToRemove: {}
  }

  incompatibleAddOnsSelection = () => {
    const { currentSelection, selectedVersions } = this.props;
    const current = Object.keys(currentSelection)[0];

    if (current === "containerd") {
      this.setState({ addOnToRemove: { docker: selectedVersions.docker } });
      return;
    } else if (current === "docker") {
      this.setState({ addOnToRemove: { containerd: selectedVersions.containerd } });
    } else if (current === "flannel") {
      if (selectedVersions.weave.version !== "None") {
        this.setState({ addOnToRemove: { weave: selectedVersions.weave } });
      } else {
        this.setState({ addOnToRemove: { antrea: selectedVersions.antrea } });
      }
    } else if (current === "antrea") {
      if (selectedVersions.weave.version !== "None") {
        this.setState({ addOnToRemove: { weave: selectedVersions.weave } });
      } else {
        this.setState({ addOnToRemove: { flannel: selectedVersions.flannel } });
      }
    } else {
      if (selectedVersions.antrea.version !== "None") {
        this.setState({ addOnToRemove: { antrea: selectedVersions.antrea } });
      } else {
        this.setState({ addOnToRemove: { flannel: selectedVersions.flannel } });
      }
    }
  }

  componentDidMount() {
    this.incompatibleAddOnsSelection();
  }

  handleConfirmSelection = (currentSelection, addOnToRemove) => {
    this.props.onConfirmSelection(currentSelection, addOnToRemove)
  }

  render() {
    const { addOnToRemove } = this.state;
    const {
      displayConfirmSelectionModal,
      toggleConfirmSelection,
      currentSelection
    } = this.props;


    return (
      <Modal
        isOpen={displayConfirmSelectionModal}
        onRequestClose={toggleConfirmSelection}
        shouldReturnFocusAfterClose={false}
        contentLabel="Confirm selection"
        ariaHideApp={false}
        className="Modal ConfirmSelectionModal"
      >
        <div className="Modal-body">
          <div className="u-fontSize--largest u-color--tuna u-fontWeight--bold u-lineHeight--normal">Confirm selection</div>
          <p className="u-fontSize--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--20">
            The option you are selecting is incompatible with another selected option.
        </p>
          <div className="flex flex-column">
            <span className="u-fontSize--normal u-color--tuna u-lineHeight--normal u-fontWeight--bold"> In order to add </span>
            {!isEmpty(currentSelection) &&
              <div className="flex add-wrapper alignItems--center u-marginTop--small">
                <span className="icon u-add-plus-icon" />
                <span className={`icon u-${Object.keys(currentSelection)[0]}-small-icon`} />
                <span className="u-fontSize--small u-lineHeight--normal u-color--tuna">{Utilities.toTitleCase(Object.keys(currentSelection)[0])} version {currentSelection[Object.keys(currentSelection)[0]].version}</span>
              </div>}

            <span className="u-fontSize--normal u-color--tuna u-lineHeight--normal u-fontWeight--bold u-marginTop--20"> The following add-on will be removed </span>
            {!isEmpty(addOnToRemove) &&
              <div className="flex remove-wrapper alignItems--center u-marginTop--small">
                <span className="icon u-remove-minus-icon" />
                <span className={`icon u-${Object.keys(addOnToRemove)[0]}-small-icon`} />
                <span className="u-fontSize--small u-lineHeight--normal u-color--tuna">{Utilities.toTitleCase(Object.keys(addOnToRemove)[0])} version {addOnToRemove[Object.keys(addOnToRemove)[0]].version}</span>
              </div>}
          </div>
          <div className="u-marginTop--20 flex">
            <button
              onClick={() => this.handleConfirmSelection(currentSelection, addOnToRemove)}
              type="button"
              className="Button primary">
              Confirm selection
          </button>
            <button type="button" onClick={() => toggleConfirmSelection(currentSelection)} className="Button secondary u-marginLeft--10">Cancel</button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ConfirmSelectionModal;