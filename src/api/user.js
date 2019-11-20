import ajax from "../api/index";

const api = {
  getUserByToken(token) {
    return ajax.get("user/getbytoken", { params: { token: token } });
  },
  get(id) {
    return ajax.get("user", { params: { id: id } });
  },
  add(params) {
    return ajax.post("user", params);
  },
  update(params) {
    return ajax.put("user", params);
  },
  delete(id) {
    return ajax.delete("user", { params: { id: id } });
  },
  deleteAll(ids) {
    return ajax.delete("user/deleteall", { params: { ids: ids } });
  },
  getPageList(params) {
    return ajax.get("user/pagelist", { params: params });
  }
};

export default api;
