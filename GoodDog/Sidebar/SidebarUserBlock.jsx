import React, { Component } from "react";
import PropTypes from "prop-types";
import { Collapse } from "reactstrap";
import { connect } from "react-redux";

class SidebarUserBlock extends Component {
  state = {
    showUserBlock: true
  };

  render() {
    return (
      <Collapse id="user-block" isOpen={this.state.showUserBlock}>
        <div>
          <div className="item user-block" style={{ cursor: "default" }}>
            {/* User picture */}
            <div className="user-block-picture">
              <div className="user-block-status">
                <img
                  className="img-thumbnail rounded-circle"
                  src={
                    this.props.currentUser.photoUrl ||
                    "https://via.placeholder.com/50"
                  }
                  alt="Avatar"
                  width="60"
                  height="60"
                />
              </div>
            </div>
            {/* Name and Job */}
            <div className="user-block-info">
              <span className="user-block-name">
                {this.props.currentUser.name}
              </span>
              <span className="user-block-role">
                {this.props.currentUser.roles &&
                this.props.currentUser.roles.includes("Admin")
                  ? "Administrator"
                  : this.props.currentUser.roles &&
                    this.props.currentUser.roles.includes("Premium")
                  ? "Premium User"
                  : "User"}
              </span>
            </div>
          </div>
        </div>
      </Collapse>
    );
  }
}

SidebarUserBlock.propTypes = {
  showUserBlock: PropTypes.bool
};

const mapStateToProps = state => ({
  showUserBlock: state.settings.showUserBlock
});

export default connect(mapStateToProps)(SidebarUserBlock);
