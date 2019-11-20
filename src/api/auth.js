import ajax from "../api/index";

const api = {
  getToken(params) {
    return ajax.get("auth/Token", params);
  },
  refreshToken(params) {
    return ajax.get("auth/RefreshToken", params);
  }
  // add(params) {
  //   return ajax.post("bbs-block", params);
  // },
  // delete(id) {
  //   return ajax.delete("bbs-block/" + id);
  // },
  // update(id, params) {
  //   return ajax.put("bbs-block/" + id, params);
  // },
  // batch(params) {
  //   return ajax.post("bbs-block/batch", params);
  // },
  // get(id) {
  //   return ajax.get("bbs-block/" + id);
  // },
  // getPage(params) {
  //   return ajax.get("bbs-block/page", params);
  // },
  // getList(params) {
  //   return ajax.get("bbs-block/list", params);
  // }
};
export default api;
