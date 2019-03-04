import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { Suspense, lazy } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Base from "../components/Layout/Base";
import * as sidebarRoutes from "../components/uiHelpers/Sidebar";
import PageLoader from "../components/Common/PageLoader";

class AppRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      sidebarContent: null
    };
    this.currentKey = props.location.pathname.split("/")[1] || "/";
    this.timeout = { enter: 500, exit: 500 };

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'
    this.animationName = "rag-fadeIn";
  }

  componentdDidMount() {
    this.setState({
      roles: this.props.currentUser.roles
    });
  }

  maproute(route) {
    let Component = lazy(() => route.component);
    let content = [
      <Route
        key={route.id}
        path={route.path}
        exact={true}
        render={props => (
          <Component
            {...props}
            currentUser={this.props.currentUser}
            updateProfilePic={this.props.updateProfilePic}
            isAdmin={this.props.isAdmin}
          />
        )}
      />
    ];

    return content;
  }

  flatten(menuItem, mod, bucket) {
    bucket.push(menuItem);
    if (menuItem.submenu) {
      menuItem.submenu.forEach(r => mod.flatten(r, mod, bucket));
    }
  }

  render() {
    let b = [];
    sidebarRoutes.getAdminRoutes().forEach(r => this.flatten(r, this, b));
    sidebarRoutes.getUserRoutes().forEach(r => this.flatten(r, this, b));
    sidebarRoutes.getMiscGlobalRoutes().forEach(r => this.flatten(r, this, b));
    sidebarRoutes.getPremiumRoutes().forEach(r => this.flatten(r, this, b));

    let filter = b.filter(r => r.component);
    let sidebarContent = filter.map(r => this.maproute(r, this.props));
    return (
      <Base {...this.props}>
        <TransitionGroup>
          <CSSTransition
            key={this.currentKey}
            timeout={this.timeout}
            classNames={this.animationName}
            exit={false}
          >
            <div>
              <Suspense fallback={<PageLoader />}>
                <Switch location={this.props.location}>
                  {sidebarContent}

                  <Redirect to="/notfound" />
                </Switch>
              </Suspense>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Base>
    );
  }
}

export default withRouter(AppRoutes);
