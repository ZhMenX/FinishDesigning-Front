<script lang="ts" setup>
import { onMounted, reactive, inject } from "vue";
import api from "../../axios/axios";
import { ElMessage } from "element-plus";
//引入界面刷新
const reload: any = inject("reload");
const userList = reactive({
  list: [],
});
let userImage = reactive;
//分页
//获取用户列表方法
const FindUserListByPage = () => {
  api.get("wechatinfo/selectAllWechatUser").then((res: any) => {
    console.log("查询到了");
    userList.list = res.data.data;
    userList.list.forEach((user) => {
      const timestampInSeconds = Math.floor(user.updatedDate / 1000);
      const timeStr = timestampTime(timestampInSeconds);
      user.updatedDate = timeStr;
    });
    console.log(res.data);
  });
};

onMounted(() => {
  FindUserListByPage();
});

//删除用户
const onDelete = (row: any) => {
  api.get("wechatinfo/DeleteWechatUser?id=" + row.id).then((res: any) => {
    console.log(res.data);
    reload();
    ElMessage({
      showClose: true,
      message: "删除成功！",
      type: "success",
    });
  });
};
//修改表头样式
const headerStyle = ({ row, column, rowIndex, columnIndex }: never) => {
  return {
    color: "black",
    fontWeight: "bold",
    background: "#b1feff",
  };
};
//获取头像链接
const getImageUrl = (userImage: string) => {
  return `http://www.atzmx.online/static/userImage/${userImage}`;
};
//修改表格行列样式
const rowStyle = (arg) => {
  return {
    color: "#111e24",
    fontWeight: "bold",
    background: "#409ea2",
  };
};
function timestampTime(timestamp) {
  const dateObj = new Date(timestamp * 1000);
  const year = dateObj.getFullYear();
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObj.getDate()).slice(-2);
  const hours = ("0" + dateObj.getHours()).slice(-2);
  const minutes = ("0" + dateObj.getMinutes()).slice(-2);
  const seconds = ("0" + dateObj.getSeconds()).slice(-2);
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
}
</script>

<template>
  <el-card style="background-color: #153a40">
    <el-table
      :data="userList.list"
      style="width: 100%"
      :header-cell-style="headerStyle"
      :row-style="rowStyle"
    >
      <el-table-column label="头像" width="200">
        <template #default="scope">
          <el-avatar :src="getImageUrl(scope.row.userImage)" />
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="昵称"/>
      <el-table-column prop="updatedDate" label="操作时间" width="400" />
      <el-table-column label="操作" >
        <template #default="scope">
          <el-button type="danger" text @click="onDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<style scoped>
</style>
