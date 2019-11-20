import ajax from "../api/index";

const api = {
  get(id) {
    return ajax.get("role", { params: { id: id } });
  },
  add(params) {
    return ajax.post("role", params);
  },
  update(params) {
    return ajax.put("role", params);
  },
  delete(id) {
    return ajax.delete("role", { params: { id: id } });
  },
  deleteAll(ids) {
    return ajax.delete("role/deleteall", { params: { ids: ids } });
  },
  getPageList(params) {
    return ajax.get("role/pagelist", { params: params });
  },
  getList(params) {
    return ajax.get("role/list", { params: params });
  }
};

export default api;
