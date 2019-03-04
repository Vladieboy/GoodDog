import axios from "axios";
import * as global from "./serviceHelpers";

let addRole = payload => {
  const config = {
    data: payload,
    url: global.API_HOST_PREFIX + "/api/roles",
    method: "Post",
    headers: { "Content-type": "application/json" }
  };
  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

let getRoles = () => {
  const config = {
    url: global.API_HOST_PREFIX + "/api/roles/",
    method: "get",
    headers: { "Content-type": "application/json" }
  };
  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

let getUsersWithRoles = () => {
  const config = {
    url: global.API_HOST_PREFIX + "/api/roles/list",
    method: "get",
    headers: { "Content-type": "application/json" }
  };
  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

let getRolesCTE = id => {
  const config = {
    url: global.API_HOST_PREFIX + "/api/roles/" + id,
    method: "get",
    headers: { "Content-type": "application/json" }
  };
  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

let getPagedRoles = payload => {
  const config = {
    data: payload,
    url: global.API_HOST_PREFIX + "api/roles/pagination",
    method: "Post",
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

let searchRolesList = payload => {
  const config = {
    data: payload,
    url: global.API_HOST_PREFIX + "api/roles/search",
    method: "Post",
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

let deleteRoles = payload => {
  const config = {
    data: payload,
    url: global.API_HOST_PREFIX + "/api/roles/delete",
    method: "post",
    header: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

export {
  addRole,
  getRoles,
  getUsersWithRoles,
  getPagedRoles,
  deleteRoles,
  getRolesCTE,
  searchRolesList
};
