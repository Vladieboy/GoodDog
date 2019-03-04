import React from "react";
import * as roleService from "../../services/roleServices";
import RolesPagination from "./RolesPagination";
import SearchBar from "../SearchBar/SearchBar";

export default class RolesDislayContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      users: [],
      pages: {
        activePage: 0,
        pageSize: 6,
        hasNextPage: null,
        hasPreviousPage: null,
        totalPages: null,
        totalCount: null
      }
    };
  }

  componentDidMount() {
    this.pageDisplay(0, 6);
  }

  handleSearchSubmit = (e, query) => {
    e.preventDefault();

    let requestObj = this.state.pages.activePage;

    this.searchUsers(query, requestObj);
    this.searchMode = {
      active: !query ? false : true,
      query: query
    };
  };

  handleSearchCancel = () => {
    this.searchMode = {
      active: false,
      query: ""
    };
    this.setState({
      pageIndex: 0,
      noResults: false
    });
    this.getAll(this.state);
  };

  modalRequester = () => {
    this.setState({
      modal: !this.state.modal
    });
  };
  pageDisplay = pageIndex => {
    let pageData = {
      pageIndex: pageIndex,
      pageSize: this.state.pages.pageSize
    };
    roleService
      .getPagedRoles(pageData)
      .then(this.onGetUserRolesSuccess)
      .catch(this.onGetUserRolesError);
  };

  handlePageChange = pageIndex => {
    this.pageDisplay(pageIndex - 1, this.state.pages.pageSize);
  };

  onGetUserRolesSuccess = resp => {
    const pageResp = {
      activePage: resp.item.pageIndex,
      pageSize: resp.item.pageSize,
      hasNextPage: resp.item.hasNextPage,
      hasPreviousPage: resp.item.hasPreviousPage,
      totalCount: resp.item.totalCount,
      totalPages: resp.item.totalPages
    };
    this.setState({
      users: resp.item.pagedItems,
      pages: pageResp
    });
  };

  searchUsers = (query, requestObj) => {
    const queryStrings = {
      query: query,
      pageIndex: requestObj,
      pageSize: this.state.pages.pageSize
    };
    roleService
      .searchRolesList(queryStrings)
      .then(this.onGetUserRolesSuccess)
      .catch(this.onSearchAccountsFail);
  };

  onGetUserRolesError = resp => {
    console.log(resp);
  };

  onSearchAccountsSuccess = () => {};

  render() {
    return (
      <div>
        <SearchBar
          handleSearchSubmit={this.handleSearchSubmit}
          handleSearchCancel={this.handleSearchCancel}
          searchMode={this.searchUsers}
        />
        <div>
          <RolesPagination
            modalRequester={this.modalRequester}
            modal={this.state.modal}
            users={this.state.users}
            pages={this.state.pages}
            pageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}
