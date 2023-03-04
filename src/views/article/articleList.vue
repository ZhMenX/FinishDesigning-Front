<script lang="ts" setup>
import { onMounted, ref ,reactive,inject,getCurrentInstance} from 'vue';
import api from '../../axios/axios';
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from 'element-plus'
import {mainStore} from '../../store/index';
import {storeToRefs} from 'pinia';
const store = mainStore()
//引入界面刷新
const reload: any = inject("reload");
let articleList = reactive({
    list:[]
})
//分页
const page = reactive({
    pageSize:7,
    currentSize:1,
    total:0,
})
//分页方法
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    page.currentSize = val;
    FindUserListByPage(page.currentSize,page.pageSize);
  console.log(`current page: ${val}`)
}
//获取文章列表方法
const FindUserListByPage = (currentSize:number,pageSize:number) =>{
    api.get("article/FindArticleListPage?index="+currentSize+"&size="+pageSize).then((res: any) => {
      articleList.list = res.data.data.records;
          page.total = res.data.data.total;
          page.currentSize = res.data.data.current;
          page.pageSize  = res.data.data.size;
          console.log(res.data)
  });
}

onMounted(() => {
    FindUserListByPage(page.currentSize,page.pageSize);
});

//登录校验
const ruleFormRef = ref<FormInstance>()
const validateTitle = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('标题不能为空！'))
  }
  else {
    callback()
  }
}
const validateDescription = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('描述不能为空！'))
  }
  else {
    callback()
  }
}
const validateContent = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('内容不能为空！'))
  }
  else {
    callback()
  }
}

const rules = reactive({
    title: [{ validator: validateTitle, trigger: 'blur' }],
    description: [{ validator: validateDescription, trigger: 'blur' }],
    content: [{ validator: validateContent, trigger: 'blur' }],
})
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

//编辑框
var dialogVisibleUpdate = ref(false);
//编辑处理
const formUpdate = reactive({
  articleId:'',
  title: "",
  description: "",
  content: "",
  image: "",

});
const openUpdate =(row: any) => {
  formUpdate.articleId=row.articleId,
  formUpdate.title=row.title,
  formUpdate.description=row.description,
  formUpdate.content= row.content,
  formUpdate.image= row.image,
  dialogVisibleUpdate.value = true;
};
const onUpdate = (row: any)  => {
  let userUpdate = {
    articleId :formUpdate.articleId,
    title: formUpdate.title,
    description: formUpdate.description,
    content:formUpdate.content,
    createUserId:store.getUserId,
  };
  api.post("article/UpdArticle", JSON.stringify(userUpdate)).then((res: any) => {
    articleList.list = res.data;
  });
  dialogVisibleUpdate.value = false;
  reload();
  ElMessage({
        showClose: true,
        message: '保存成功！',
        type: 'success',
    })
};
//新增框
var dialogVisibleAdd = ref(false);
//新增处理
const formAdd = reactive({
  articleId:'',
  title: "",
  description: "",
  content: "",
  image: '',
});
const openAdd =() => {
  dialogVisibleAdd.value = true;
};
const onAdd = (row: any)  => {
  let article = {
    articleId :formAdd.articleId,
    title: formAdd.title,
    description: formAdd.description,
    content: formAdd.content,
    createUserId:store.getUserId,
  };
  api.post("/article/AddArticle", JSON.stringify(article)).then((res: any) => {
    articleList.list = res.data;
    dialogVisibleAdd.value = false;
    reload();
    ElMessage({
        showClose: true,
        message: '新增成功！',
        type: 'success',
    })
  });
};
//关闭弹出框
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
//删除用户
const onDelete =(row:any)=>{

  api.get("User/DeleteUserById?id="+row.id).then((res:any) =>{
    console.log(res.data)
    reload();
    ElMessage({
        showClose: true,
        message: '删除成功！',
        type: 'success',
    })
  })
}
//修改表头样式
const headerStyle = ({ row, column, rowIndex, columnIndex }:never)=>{
    return {
      color: 'black',
      fontWeight: 'bold',
      background: '#b1feff'
    };
}
//修改表格行列样式
const rowStyle = (arg)=>{
    return {
      color: '#111e24',
      fontWeight: 'bold',
      background: '#409ea2',
    };
}
//模糊查询
const formInline = reactive({
  currentIndex: page.currentSize,
  pageSize:page.pageSize,
  articleId:'',
  title: "",
  description: "",
  classify_list:"",
  tag_list:""
})
//筛选方法
const onSubmit = () => {
  let formData={
    currentIndex : formInline.currentIndex,
    pageSize  : formInline.pageSize,
    articleId : formInline.articleId,
    title : formInline.description,
    description : formInline.description,
    classify_list : formInline.classify_list,
    tag_list : formInline.tag_list,
  }

  api.post("article/FindArticleListByOthers",formData).then((res:any) =>{
    articleList.list = res.data.data.records;
    page.total = res.data.data.total;
    page.currentSize = res.data.data.current;
    page.pageSize  = res.data.data.size;
    console.log(res.data)
  })

}
//重置筛选表单
const resetFormLine = () => {
  formInline.title = '',
  formInline.description = '',
  formInline.classify_list = '',
  formInline.tag_list = '',
  formInline.articleId=''
}


</script>

<template>
    <el-card  style="background-color:#153a40;margin-bottom:5px">
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="关键词：">
            <el-input v-model="formInline.description" placeholder="请输入关键字" />
          </el-form-item>
          <el-form-item label="文章领域：">
            <el-input v-model="formInline.classify_list" placeholder="请输入相关领域" />
          </el-form-item>
          <el-form-item label="标签：">
            <el-input v-model="formInline.tag_list" placeholder="请输入标签" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" style="color:aqua" text @click="resetFormLine">重置</el-button>
            <el-button type="primary" size="large" style="color:aqua" text @click="onSubmit">筛选</el-button>
            <el-button type="primary" size="large" text @click="openAdd()" style="color:aqua">新增文章</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card  style="background-color:#153a40">
    <el-table :data="articleList.list" 
        style="width: 100%" 
        :header-cell-style="headerStyle"
        :row-style="rowStyle"
    >
      <el-table-column prop="title" label="标题" width="500" />
      <el-table-column prop="description" label="描述" width="500" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" text @click="openUpdate(scope.row)" style="color:aqua">编辑</el-button>
            <el-button type="danger" text @click="onDelete(scope.row)">删除</el-button>
          </template>     
        </el-table-column>
    </el-table>
    <div style="float:left;margin-top:5px;margin-left:2px">
        <el-pagination
          v-model:current-page="page.currentSize"
          :page-size="page.pageSize"
          :background="true"
          layout="total,prev, pager, next, jumper"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
    </div>
  </el-card>
  <el-dialog
        v-model="dialogVisibleAdd"
        title="新增用户"
        width="500px"
        :before-close="handleClose"
      >
        <el-form 
        :inline="true" 
        class="demo-form-inline"
        ref="ruleFormRef"
        :model="formAdd"
        :rules="rules"
        >
          <el-form-item label="标题：">
            <el-input v-model="formAdd.title" type="text" autocomplete="off"  placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="描述：">
            <el-input v-model="formAdd.description" type="text" autocomplete="off"  placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="内容：">
            <el-input v-model="formAdd.content" type="password" autocomplete="off" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisibleAdd = false">取消</el-button>
            <el-button type="primary" @click="onAdd"> 新增 </el-button>
          </span>
        </template>
  </el-dialog>
  <el-dialog
        v-model="dialogVisibleUpdate"
        title="编辑用户"
        width="500px"
        :before-close="handleClose"
      >
        <el-form 
        :inline="true" 
        class="demo-form-inline"
        ref="ruleFormRef"
        :model="formUpdate"
        :rules="rules"
        >
          <el-form-item label="标题：">
            <el-input v-model="formUpdate.title" type="text" autocomplete="off"  placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="描述：">
            <el-input v-model="formUpdate.description" type="text" autocomplete="off" placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="内容：">
            <el-input v-model="formUpdate.content" type="text" autocomplete="off" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisibleUpdate = false">取消</el-button>
            <el-button type="primary" @click="onUpdate"> 保存修改 </el-button>
          </span>
        </template>
  </el-dialog>
</template>
<style scoped>
</style>
