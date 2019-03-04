import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Trans } from "react-i18next";
import { Collapse, Badge } from "reactstrap";
import SidebarRun from "../uiHelpers/Sidebar.run";
import * as routing from "../uiHelpers/Sidebar";
import SidebarUserBlock from "./SidebarUserBlock";
import * as userService from "../../services/accountsService";

// Name over Sidebar Segments
const SidebarItemHeader = ({ item }) => {
  if (!item.isNav) return null;
  else {
    return (
      <li className="nav-heading">
        <span>
          <Trans i18nKey={item.translate}>{item.heading}</Trans>
        </span>
      </li>
    );
  }
};
// Create Main Sidebar List
const SidebarItem = props => {
  let { item, isActive } = props;
  // let { isActive } = props.isActive;
  if (!item.isNav) {
    return null;
  } else {
    return (
      <li className={isActive ? "active" : ""}>
        <Link to={item.path} title={item.name}>
          {item.label && (
            <Badge tag="div" className="float-right" color={item.label.color}>
              {item.label.value}
            </Badge>
          )}
          {item.icon && <em className={item.icon} />}
          <span>
            <Trans i18nKey={item.translate}>{item.name}</Trans>
          </span>
        </Link>
      </li>
    );
  }
};

//create sidebar submenu List
const SidebarSubItem = ({ item, isActive, handler, children, isOpen }) => {
  if (!item.isNav) return null;
  else {
    return (
      <li className={isActive ? "active" : ""}>
        <div className="nav-item" onClick={handler}>
          {item.label && (
            <Badge tag="div" className="float-right" color={item.label.color}>
              {item.label.value}
            </Badge>
          )}
          {item.icon && <em className={item.icon} />}
          <span>
            <Trans i18nKey={item.translate}>{item.name}</Trans>
          </span>
        </div>
        <Collapse isOpen={isOpen}>
          <ul id={item.path} className="sidebar-nav sidebar-subnav">
            {children}
          </ul>
        </Collapse>
      </li>
    );
  }
};

//add SubHeader to sidebar
const SidebarSubHeader = ({ item }) => {
  return <li className="sidebar-subnav-header">{item.name}</li>;
};

class ReactRouter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: {},
      roles: []
    };
    this.buildCollapseList = this.buildCollapseList.bind(this);
    // this.roleCheck = this.roleCheck.bind(this);
  }
  componentDidMount() {
    this.getCurrent();
  }

  getCurrent() {
    userService.getCurrent().then(this.getCurrentSuccess);
  }

  getCurrentSuccess = data => {
    this.setState({
      roles: data.item.roles
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.roles !== this.state.roles &&
      this.state.roles !== undefined
    ) {
      SidebarRun(this.navigator.bind(this));
      this.buildCollapseList();
    }
  }

  buildCollapseList = () => {
    let collapse = {};

    if (this.state.roles && this.state.roles.includes("Admin")) {
      this.populateSubmenus(collapse, routing.getAdminRoutes);
    } else if (this.state.roles && this.state.roles.includes("Premium")) {
      this.populateSubmenus(collapse, routing.getPremiumRoutes);
    }  else if (this.state.roles && this.state.roles.includes("User")) {
      this.populateSubmenus(collapse, routing.getUserRoutes);
    }

    this.populateSubmenus(collapse, routing.getMiscGlobalRoutes);

    this.setState({ collapse });
  };

  populateSubmenus = (collapse, func) => {
    func()
      .filter(({ heading }) => !heading)
      .forEach(({ name, path, submenu }) => {
        collapse[name] = this.routeActive(
          submenu ? submenu.map(({ path }) => path) : path
        );
      });
  };

  navigator(route) {
    this.props.history.push(route);
  }

  routeActive(paths) {
    paths = Array.isArray(paths) ? paths : [paths];
    return paths.some(p => this.props.location.pathname.indexOf(p) > -1);
  }

  toggleItemCollapse(stateName) {
    for (let c in this.state.collapse) {
      if (this.state.collapse[c] === true && c !== stateName)
        this.setState({
          collapse: {
            [c]: false
          }
        });
    }
    this.setState({
      collapse: {
        [stateName]: !this.state.collapse[stateName]
      }
    });
  }

  getSubRoutes = item => {
    return item.submenu
      .filter(menu => !menu.excludeFromNav)
      .map(({ path }) => path);
  };

  itemType = item => {
    if (item.heading) return "heading";
    if (!item.submenu) return "menu";
    if (item.submenu) return "submenu";
  };

  roleCheck = () => {
    let sidebar = [];

    if (this.state.roles.includes("Admin")) {
      sidebar.push(routing.getAdminRoutes());
    } else if (this.state.roles.includes("Premium")) {
      sidebar.push(routing.getPremiumRoutes());
    } else if (this.state.roles.includes("User")) {
      sidebar.push(routing.getUserRoutes());
    }

    sidebar.push(routing.getMiscGlobalRoutes());

    return sidebar;
  };

  render() {
    return (
      <aside className="aside-container">
        <div className="aside-inner">
          <nav data-sidebar-anyclick-close="" className="sidebar">
            <ul className="sidebar-nav">
              <li className="has-user-block">
                <SidebarUserBlock {...this.props} />
              </li>
              {this.state.roles &&
                this.state.roles.length > 0 &&
                this.roleCheck().map(array =>
                  array.map((item, i) => {
                    if (this.itemType(item) === "heading")
                      return <SidebarItemHeader item={item} key={i} />;
                    else {
                      if (this.itemType(item) === "menu")
                        return (
                          <SidebarItem
                            {...this.props}
                            roles={this.state.roles}
                            isActive={this.routeActive(item.path)}
                            item={item}
                            key={i}
                          />
                        );

                      if (this.itemType(item) === "submenu")
                        return [
                          <SidebarSubItem
                            {...this.props}
                            item={item}
                            isOpen={this.state.collapse[item.name]}
                            handler={this.toggleItemCollapse.bind(
                              this,
                              item.name
                            )}
                            isActive={this.routeActive(this.getSubRoutes(item))}
                            key={i}
                          >
                            <SidebarSubHeader item={item} key={i} />

                            {item.submenu
                              .filter(menu => !menu.excludeFromNav)
                              .map((subitem, i) => (
                                <SidebarItem
                                  {...this.props}
                                  key={i}
                                  item={subitem}
                                  isActive={this.routeActive(subitem.path)}
                                />
                              ))}
                          </SidebarSubItem>
                        ];
                    }
                    return <SidebarItem {...this.props} />;
                  })
                )}{" "}
            </ul>
          </nav>
        </div>
      </aside>
    );
  }
}

export default withRouter(ReactRouter);
