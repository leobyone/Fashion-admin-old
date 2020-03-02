<template>
  <el-upload class="avatar-uploader" :action="action" :show-file-list="false" :before-upload="beforeAvatarUpload"
    :http-request="uploadImage">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import uploadApi from '@/api/upload.js'
export default {
  data() {
    return {
      action: '/api/upload/upload-image',
      imageUrl: ''
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //上传头像
    uploadImage(params) {
      let img = new FormData()
      img.append('file', params.file)
      let conf = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      uploadApi.uploadImg(img, conf).then(res => {
        let ret = res.data;
        if (ret.success) {
          this.imageUrl = ret.data;
          this.$emit('callBack', ret.data);
        } else {
          this.$message.error('上传失败!');
        }
      })
    },
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>