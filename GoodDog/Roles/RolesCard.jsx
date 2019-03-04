import React, { Component } from "react";

export default class RolesCard extends Component {
  editUserRoles = () => {
    this.props.modalRequest(this.props.user.id);
  };

  render() {
    return (
      <tr onClick={this.editUserRoles}>
        <td>{this.props.user.emailAddress}</td>
        <td>{this.props.user.userName}</td>
        <td>{this.props.user.firstName}</td>
        <td>{this.props.user.lastName}</td>
        <td>{this.props.user.id}</td>
        {this.props.user.title.map((role, i) => (
          <td key={i}>{role}</td>
        ))}
      </tr>
    );
  }
}
