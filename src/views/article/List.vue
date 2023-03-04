<script lang="ts" setup>
import { onMounted, ref ,reactive,inject,getCurrentInstance} from 'vue';
import api from '../../axios/axios';
import { ElMessageBox } from "element-plus";
//引入界面刷新
const reload: any = inject("reload");
let userList = reactive({
    list:[]
})
//获取列表
onMounted(() => {
  api.get("article/FindArticleList").then((res: any) => {
          userList.list = res.data;
          console.log(res.data)
  });
});
//编辑框
var dialogVisibleAdd = ref(false);
//新增处理
const formAdd = reactive({
  articleId: "",
  title: "",
  description: "",
  content: "",
  createUserId:""
});
const openAdd =(row:any) => {
  dialogVisibleAdd.value = true;
};
const onAdd = (row: any)  => {
  let article = {
    articleId: 0,
    title: formAdd.title,
    description: formAdd.description,
    content: formAdd.content,
    createUserId: 11,
  };
  api.post("article/AddArticle", JSON.stringify(article)).then((res: any) => {
    userList.list = res.data;
    dialogVisibleAdd.value = false;
    reload();
  });
  reload();
};
//关闭编辑框
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
const onDelete =(row:any)=>{

  api.get("article/DelArticle?id="+row.articleId).then((res:any) =>{
    console.log(res.data)
    reload();
  })
  reload();
}
</script>
<template>
  <el-table :data="userList.list" stripe style="width: 100%">
    <el-table-column prop="articleId" label="id" width="180" />
    <el-table-column prop="title" label="标题" width="180" />
    <el-table-column prop="description" label="描述" />
    <el-table-column prop="content" label="文章内容" />
    <el-table-column prop="image" label="图片名称" />
    <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="openAdd(scope.row)">新增</el-button>
            <el-button type="danger" @click="onDelete(scope.row)">删除</el-button>
          </template>
    </el-table-column>
  </el-table>
  <el-dialog
        v-model="dialogVisibleAdd"
        title="新增文章"
        width="55%"
        :before-close="handleClose"
      >
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="文章名字：">
            <el-input v-model="formAdd.title" placeholder="请输入文章名字" />
          </el-form-item>
          <el-form-item label="文章描述：">
            <el-input v-model="formAdd.description" placeholder="请输入文章描述：" />
          </el-form-item>
          <el-form-item label="文章主要内容：">
            <el-input v-model="formAdd.content" placeholder="请输入文章主要内容" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisibleAdd = false">取消</el-button>
            <el-button type="primary" @click="onAdd"> 新增 </el-button>
          </span>
        </template>
      </el-dialog>
</template>
<style scoped>
</style>
