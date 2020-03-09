import ajax from "../api/index";

const api = {
  get(id) {
    return ajax.get("permission", { params: { id: id } });
  },
  add(params) {
    return ajax.post("permission", params);
  },
  update(params) {
    return ajax.put("permission", params);
  },
  delete(id) {
    return ajax.delete("permission", { params: { id: id } });
  },
  deleteAll(ids) {
    return ajax.delete("permission/deleteall", { params: { ids: ids } });
  },
  getPageList(params) {
    return ajax.get("permission/pagelist", params);
  },
  getList(params) {
    return ajax.get("permission/list", { params: params });
  },
  getPermissionTree(params) {
    return ajax.get("permission/tree", { params: params });
  },
  getPermissionIdsByRoleId(roleId) {
    return ajax.get("permission/permissionidsbyroleid", {
      params: { roleId: roleId }
    });
  },
  getPermissionListByUserId(userId) {
    return ajax.get("permission/permissionlistbyuserid", {
      params: { userId: userId }
    });
  },
  assignPermission(params) {
    return ajax.post("permission/assign", params);
  }
};

export default api;
