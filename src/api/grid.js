import Json from "json3";
import ajax from "@/api/index.js";

const api = {
  getList(api, p) {
    return ajax.get(api, p);
  }
};
export default api;
