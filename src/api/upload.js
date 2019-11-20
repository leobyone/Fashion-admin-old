import ajax from "../api/index";

const api = {
  uploadImg(params, conf) {
    return ajax.post("upload/upload-image", params, conf);
  }
};

export default api;
