import ajax from "../api/index";

const api = {
  get(id) {
    return ajax.get("module", { params: { id: id } });
  },
  add(params) {
    return ajax.post("module", params);
  },
  update(params) {
    return ajax.put("module", params);
  },
  delete(id) {
    return ajax.delete("module", { params: { id: id } });
  },
  deleteAll(ids) {
    return ajax.delete("module/deleteall", { params: { ids: ids } });
  },
  getPageList(params) {
    return ajax.get("module/pagelist", { params: params });
  },
  getList(params) {
    return ajax.get("module/list", { params: params });
  }
};

export default api;
