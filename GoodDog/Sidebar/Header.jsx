import * as actions from "../../store/actions/actions";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroup,
  ListGroupItem,
  UncontrolledDropdown
} from "reactstrap";
import React, { Component } from "react";
import HeaderRun from "../uiHelpers/Header.run";
import PropTypes from "prop-types";
import ToggleFullscreen from "../Common/ToggleFullscreen";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Header extends Component {
  componentDidMount() {
    HeaderRun();
  }

  handleChatBubbleClick = e => {
    e.preventDefault();
    this.props.history.push("/chat");
  };

  handleProfileView = e => {
    e.preventDefault();
    this.props.history.push("/users/" + this.props.currentUser.id);
  };

  handleEditProfile = e => {
    e.preventDefault();
    this.props.history.push("/myaccount/edit");
  };

  handleLogout = e => {
    e.preventDefault();
    this.props.history.push("/logout");
  };

  toggleUserblock = e => {
    e.preventDefault();
    this.props.actions.toggleSetting("showUserBlock");
  };

  toggleCollapsed = e => {
    e.preventDefault();
    this.props.actions.toggleSetting("isCollapsed");
    this.resize();
  };

  toggleAside = e => {
    e.preventDefault();
    this.props.actions.toggleSetting("asideToggled");
  };

  resize() {
    // all IE friendly dispatchEvent
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
    // modern dispatchEvent way
    // window.dispatchEvent(new Event('resize'));
  }

  returnHome = e => {
    e.preventDefault();
    this.props.history.push("/");
  };

  render() {
    return (
      <header className="topnavbar-wrapper">
        {/* START Top Navbar */}
        <nav className="navbar topnavbar">
          {/* START navbar header */}
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <div className="brand-logo">
                <i className="fas fa-dog" alt="Good Dog Logo" />
                <span> Good Dog</span>
              </div>
              <div className="brand-logo-collapsed">
                <i
                  className="fas fa-dog"
                  alt="Good Dog Logo"
                  onClick={e => this.returnHome(e)}
                />
              </div>
            </a>
          </div>
          {/* END navbar header */}

          {/* START Left navbar */}
          <ul className="navbar-nav mr-auto flex-row">
            <li className="nav-item">
              {/* Button used to collapse the left sidebar. Only visible on tablet and desktops */}
              <a
                href=""
                className="nav-link d-none d-md-block d-lg-block d-xl-block"
                onClick={this.toggleCollapsed}
              >
                <em className="fas fa-bars" />
              </a>
              {/* Button to show/hide the sidebar on mobile. Visible on mobile only. */}
              <a
                href=""
                className="nav-link sidebar-toggle d-md-none"
                onClick={this.toggleAside}
              >
                <em className="fas fa-bars" />
              </a>
            </li>
          </ul>
          {/* END Left navbar */}
          {/* START Right Navbar */}
          <ul className="navbar-nav flex-row">
            {/* Fullscreen (only desktops) */}
            <li className="nav-item d-none d-md-block">
              <ToggleFullscreen className="nav-link" />
            </li>
            {/* START Alert menu */}
            <UncontrolledDropdown nav inNavbar className="dropdown-list">
              <DropdownToggle nav className="dropdown-toggle-nocaret">
                <em className="icon-user" />
                {/* call user img here */}
              </DropdownToggle>
              {/* START Dropdown menu */}
              <DropdownMenu
                right
                className="dropdown-menu-right animated flipInX"
              >
                <DropdownItem>
                  {/* START list group */}
                  <ListGroup>
                    <ListGroupItem
                      action
                      tag="a"
                      href=""
                      onClick={this.handleEditProfile}
                    >
                      <div className="media">
                        <div className="align-self-start mr-2">
                          <em className="far fa-edit fa-2x text-info" />
                        </div>
                        <div className="media-body">
                          <p className="m-0">Edit Account</p>
                          <p className="m-0 text-muted text-sm" />
                        </div>
                      </div>
                    </ListGroupItem>
                    <ListGroupItem
                      action
                      tag="a"
                      href=""
                      onClick={this.handleLogout}
                    >
                      <div className="media">
                        <div className="align-self-start mr-2">
                          <em className="fas fa-sign-out-alt fa-2x text-info" />
                        </div>
                        <div className="media-body">
                          <p className="m-0">Logout</p>
                          <p className="m-0 text-muted text-sm">
                            We're sad to see you go!
                          </p>
                        </div>
                      </div>
                    </ListGroupItem>
                  </ListGroup>
                  {/* END list group */}
                </DropdownItem>
              </DropdownMenu>
              {/* END Dropdown menu */}
            </UncontrolledDropdown>
            {/* END Alert menu */}
          </ul>
          {/* END Right Navbar */}

          {/* START Search form */}
          <form className="navbar-form" role="search" action="search.html">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                placeholder="Type and hit enter ..."
              />
              <div
                className="fa fa-times navbar-form-close"
                data-search-dismiss=""
              />
            </div>
            <button className="d-none" type="submit">
              Submit
            </button>
          </form>
          {/* END Search form */}
        </nav>
        {/* END Top Navbar */}
      </header>
    );
  }
}

Header.propTypes = {
  actions: PropTypes.object,
  settings: PropTypes.object
};

const mapStateToProps = state => ({
  settings: state.settings,
  chat: state.chat
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
