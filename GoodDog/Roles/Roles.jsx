import React from "react";
import { Label, Input } from "reactstrap";
import * as roleService from "../../services/roleServices";
import * as prompts from "../NotificationMessage";

class Roles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.getRole();
  };

  getRole = () => {
    roleService.getRolesCTE(this.props.userId).then(this.getAccountData);
  };

  getAccountData = resp => {
    this.setState(
      {
        Titles: resp.item.title
      },
      () => this.roleCheck()
    );
  };

  checkTitles(value) {
    let role = { userId: this.props.userId, roleId: value };
    if (this.state.Titles) {
      if (this.state.Titles[value] === 0) {
        roleService
          .addRole(role)
          .then(this.sweetSuccess)
          .catch(this.sweetError);
      } else {
        roleService
          .deleteRoles(role)
          .then(this.sweetSuccess)
          .catch(this.sweetError);
      }
      this.getRole();
    } else {
      setTimeout(() => {
        this.checkTitles(value);
      }, 1000);
    }
  }

  sweetSuccess() {
    prompts.success({
      message: "Successful Role Change!"
    });
  }

  sweetError() {
    prompts.warning({
      message: "Error Changing Role!"
    });
  }

  roleCheck = () => {
    this.state.Titles[0] === 0
      ? this.setState({
          Admin: false
        })
      : this.setState({
          Admin: true
        });
    this.state.Titles[1] === 0
      ? this.setState({
          User: false
        })
      : this.setState({
          User: true
        });
    this.state.Titles[2] === 0
      ? this.setState({
          UnAuth: false
        })
      : this.setState({
          UnAuth: true
        });
    this.state.Titles[3] === 0
      ? this.setState({
          Premium: false
        })
      : this.setState({
          Premium: true
        });
  };

  onAddRoleSuccess(resp) {
    console.log(resp);
  }

  render() {
    return (
      <div>
        <div className="card-header">Assign Roles</div>
        <div className="card-body">
          <form>
            <div className="form-row align-items-center">
              <div className="col-md-10">
                <div className="checkbox c-checkbox">
                  <Label>
                    <Input
                      type="checkbox"
                      defaultChecked={this.state.Admin}
                      onClick={e => this.checkTitles(0, e)}
                    />{" "}
                    <span className="fa fa-check" />
                    Admin
                  </Label>
                </div>
                <div className="checkbox c-checkbox">
                  <Label>
                    <Input
                      type="checkbox"
                      defaultChecked={this.state.User}
                      onClick={e => this.checkTitles(1, e)}
                    />{" "}
                    <span className="fa fa-check" />
                    User
                  </Label>
                </div>

                <div className="checkbox c-checkbox">
                  <Label>
                    <Input
                      type="checkbox"
                      defaultChecked={this.state.UnAuth}
                      onClick={e => this.checkTitles(2, e)}
                    />{" "}
                    <span className="fa fa-check" />
                    Unauth
                  </Label>
                </div>
                <div className="checkbox c-checkbox">
                  <Label>
                    <Input
                      type="checkbox"
                      defaultChecked={this.state.Premium}
                      onClick={e => this.checkTitles(3, e)}
                    />{" "}
                    <span className="fa fa-check" />
                    Premium
                  </Label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Roles;
