<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { mainStore } from "../../store/index";
import { storeToRefs } from "pinia";
import { ArrowDown } from "@element-plus/icons-vue";
import axios from "axios";
import { UploadFilled } from "@element-plus/icons-vue";
//富文本编辑器
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import api from "../../axios/axios";
import { IEditorConfig, SlateElement } from "@wangeditor/editor";
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  inject,
  onMounted,
  reactive,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
const store = mainStore();
//引入界面刷新
const reload: any = inject("reload");
let discussList = reactive({
  list: [],
});
//分页
const page = reactive({
  pageSize: 10,
  currentSize: 1,
  total: 0,
});
//分页方法
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  page.currentSize = val;
  FindUserListByPage(page.currentSize, page.pageSize);
  console.log(`current page: ${val}`);
};
const loading = ref(true);
//获取话题列表方法
const FindUserListByPage = (currentSize: number, pageSize: number) => {
  api
    .get(
      "/discuss/FindDiscussListPage?index=" + currentSize + "&size=" + pageSize
    )
    .then((res: any) => {
      loading.value = false
      discussList.list = res.data.data.records;
      page.total = res.data.data.total;
      page.currentSize = res.data.data.current;
      page.pageSize = res.data.data.size;
      console.log(res.data);
    });
};

onMounted(() => {
  FindUserListByPage(page.currentSize, page.pageSize);
});

//登录校验
const ruleFormRef = ref<FormInstance>();
const validateTitle = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("标题不能为空！"));
  } else {
    callback();
  }
};
const validateDescription = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("描述不能为空！"));
  } else {
    callback();
  }
};
const validateContent = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("内容不能为空！"));
  } else {
    callback();
  }
};

const rules = reactive({
  title: [{ validator: validateTitle, trigger: "blur" }],
  content: [{ validator: validateContent, trigger: "blur" }],
});
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
//上传文件编辑框
var dialogVisibleImage = ref(false);
const uploadFirstImageUrl = ref("");
//封面上传参数
const uploadFirstImage = reactive({
  title: "",
});
const openImage = (row: any) => {
  uploadFirstImage.title = row.title;
  uploadFirstImageUrl.value =
    "http://www.atzmx.online:8090/upload?title=" + uploadFirstImage.title;
  dialogVisibleImage.value = true;
};


//编辑框
var dialogVisibleUpdate = ref(false);
//编辑处理
const formUpdate = reactive({
  discussId: "",
  title: "",
  content: "",
  image: "",
});
const openUpdate = (row: any) => {
  (formUpdate.discussId = row.discussId),
    (formUpdate.title = row.title),
    (formUpdate.content = row.content),
    (formUpdate.image = row.image),
    (dialogVisibleUpdate.value = true);
};
const onUpdate = (row: any) => {
  let userUpdate = {
    discussId: formUpdate.discussId,
    title: formUpdate.title,
    content: formUpdate.content,
    createUserId: store.getUserId,
  };
  axios
    .request({
      baseURL: "http://www.atzmx.online:8090/",
      url: "discuss/UpdDiscuss",
      data: {
        discussId: formUpdate.discussId,
        title: formUpdate.title,
        content: formUpdate.content,
        createUserId: store.getUserId,
      },
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res: any) => {
      discussList.list = res.data;
      ElMessage({
        showClose: true,
        message: "保存成功！",
        type: "success",
      });
    });
  dialogVisibleUpdate.value = false;
  reload();
};

//查看详情
var dialogVisibleDetail = ref(false)
const openDetail = (row:any) =>{
  (formUpdate.discussId = row.discussId),
    (formUpdate.title = row.title),
    (formUpdate.content = row.content),
    (formUpdate.image = row.image),
    (dialogVisibleDetail.value = true);
}

//新增框
var dialogVisibleAdd = ref(false);
//新增处理
const formAdd = reactive({
  discussId: "",
  title: "",
  content: "",
  image: "",
});
const openAdd = () => {
  dialogVisibleAdd.value = true;
};
const onAdd = (row: any) => {
  let discuss = {
    discussId: formAdd.discussId,
    title: formAdd.title,
    content: formAdd.content,
    createUserId: store.getUserId,
  };
  axios
    .request({
      baseURL: "http://www.atzmx.online:8090/",
      url: "discuss/AddDiscuss",
      data: {
        discussId: formAdd.discussId,
        title: formAdd.title,
        content: formAdd.content,
        createUserId: store.getUserId,
      },
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res: any) => {
      discussList.list = res.data;
      dialogVisibleAdd.value = false;
      reload();
      ElMessage({
        showClose: true,
        message: "新增成功！",
        type: "success",
      });
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
const onDelete = (row: any) => {
  api.get("/discuss/DelDiscuss?id=" + row.discussId).then((res: any) => {
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
//修改表格行列样式
const rowStyle = (arg) => {
  return {
    color: "#111e24",
    fontWeight: "bold",
    background: "#409ea2",
  };
};
//模糊查询
const formInline = reactive({
  currentIndex: page.currentSize,
  pageSize: page.pageSize,
  discussId: "",
  title: "",
  content: "",

});
//筛选方法
const onSubmit = () => {
  let formData = {
    currentIndex: formInline.currentIndex,
    pageSize: formInline.pageSize,
    discussId: formInline.discussId,
    title: formInline.content,
    content: formInline.content
  };

  api.post("/discuss/FindDiscussListByOthers", formData).then((res: any) => {
    discussList.list = res.data.data.records;
    page.total = res.data.data.total;
    page.currentSize = res.data.data.current;
    page.pageSize = res.data.data.size;
    console.log(res.data);
  });
};
//重置筛选表单
const resetFormLine = () => {
  (formInline.title = ""),
    (formInline.content = ""),
    (formInline.discussId = ""),
    onSubmit();
};

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("<p>hello</p>");

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
  }, 1500);
});

const toolbarConfig = {};
const editorConfigDetail: Partial<IEditorConfig> = {   // TS 语法

}
editorConfigDetail.readOnly = true

// 初始化 MENU_CONF 属性
const editorConfig = {
  MENU_CONF: {},
  placeholder: "请输入内容...",
};
//自定义上传图片
const UploadFile = (file, insertFn) => {
  let imgData = new FormData();
  imgData.append("file", file);
  //调用上传图片接口，上传图片
  api
    .post("uploaddiscussImage", imgData)
    .then((res) => {
      console.log(res);
      console.log(res.data.data[0]);
      // 插入后端返回的url
      insertFn(res.data.data[0]); //res.data.data是url地址
      ElMessage({
        type: "success",
        message: "上传成功",
      });
    })
    .catch((error) => {
      ElMessage({
        message: "上传失败！",
        type: "error",
      });
    });
  /*api.post("uploaddiscussImage", imgData) //该上传图片接口，返回url
  .then((res) => {
      console.log(res);
      console.log(res.data.data[0]);
      // 插入后端返回的url
      insertFn(res.data.data[0]); //res.data.data是url地址
      ElMessage({
        type: "success",
        message: "上传成功"
      })
  })
  .catch((error) => {
      ElMessage({
        message:"上传失败！",
        type:"error"
      })
  });*/
};
editorConfig.MENU_CONF["uploadImage"] = {
  customUpload: UploadFile,
  fieldName: "files",
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
//上传封面
var dialogVisible = ref(false);
</script>

<template>
  <el-card style="background-color: #153a40; margin-bottom: 5px">
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键词：">
          <el-input
            v-model="formInline.content"
            placeholder="请输入关键字"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="color: aqua"
            text
            @click="resetFormLine"
            >重置</el-button
          >
          <el-button
            type="primary"
            size="large"
            style="color: aqua"
            text
            @click="onSubmit"
            >筛选</el-button
          >
          <div style="float:right; position: relative;">
            <el-button
            type="primary"
            size="large"
            text
            @click="openAdd()"
            style="color: aqua"
            >新增话题</el-button
          >
          </div>

        </el-form-item>
      </el-form>
    </div>
  </el-card>

  <el-card style="background-color: #153a40">
    <el-table
      :data="discussList.list"
      v-loading ="loading"
      style="width: 100%"
      :header-cell-style="headerStyle"
      :row-style="rowStyle"
    >
      <el-table-column prop="discussId" label="话题序号" sortable />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="viewedTimes" label="浏览量" />
      <el-table-column prop="replyNumber" label="回复量" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-icon class="el-icon--right">
                <More />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button
                    type="primary"
                    text
                    @click="openImage(scope.row)"
                    style="color: black"
                    >上传封面图</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="primary"
                    text
                    @click="openDetail(scope.row)"
                    style="color: black"
                    >查看详情</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="primary"
                    text
                    @click="openUpdate(scope.row)"
                    style="color: black"
                    >编辑</el-button
                  ></el-dropdown-item
                >
                <el-dropdown-item>
                  <el-button type="danger" text @click="onDelete(scope.row)"
                    >删除</el-button
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!--<el-button
            type="primary"
            text
            @click="openImage(scope.row)"
            style="color: aqua"
            >上传封面图</el-button
          >
          <el-button
            type="primary"
            text
            @click="openUpdate(scope.row)"
            style="color: aqua"
            >编辑</el-button
          >
          <el-button type="danger" text @click="onDelete(scope.row)"
            >删除</el-button
          >-->
        </template>
      </el-table-column>
    </el-table>
    <div style="float: left; margin-top: 5px; margin-left: 2px">
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
    v-model="dialogVisibleImage"
    title="封面上传"
    width="50%"
    height="auto"
    :before-close="handleClose"
  >
    <el-upload class="upload-demo" drag :action="uploadFirstImageUrl" multiple>
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleImage = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisibleImage = false">
          上传封面
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogVisibleAdd"
    title="新增话题"
    width="auto"
    fullscreen="true"
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
        <el-input
          v-model="formAdd.title"
          type="text"
          autocomplete="off"
          placeholder="请输入标题"
          style="width: 500px"
        />
      </el-form-item>
      <el-form-item label="内容：">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default"
        />
        <Editor
          style="height: 350px; overflow-y: hidden; width: 1370px"
          v-model="formAdd.content"
          :defaultConfig="editorConfig"
          mode="default"
          @onCreated="handleCreated"
        />
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
    title="编辑话题"
    width="auto"
    :before-close="handleClose"
    fullscreen="true"
  >
    <el-form
      :inline="true"
      class="demo-form-inline"
      ref="ruleFormRef"
      :model="formUpdate"
      :rules="rules"
    >
      <el-form-item label="标题：">
        <el-input
          v-model="formUpdate.title"
          type="text"
          autocomplete="off"
          placeholder="请输入标题"
          style="width: 500px"
        />
      </el-form-item>
      <el-form-item label="内容：">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default"
        />
        <Editor
          style="height: auto; overflow-y: hidden; width: 1370px"
          v-model="formUpdate.content"
          :defaultConfig="editorConfig"
          mode="default"
          @onCreated="handleCreated"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleUpdate = false">取消</el-button>
        <el-button type="primary" @click="onUpdate"> 保存修改 </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogVisibleDetail"
    title="详情"
    width="auto"
    :before-close="handleClose"
    fullscreen="true"
  >
    <el-form
      :inline="true"
      class="demo-form-inline"
      ref="ruleFormRef"
      :model="formUpdate"
      :rules="rules"
    >
      <el-form-item>
        <Toolbar
          style="border-bottom: 1px solid #ccc;width:1500px"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default"
        />
        <Editor
          style="height: auto; overflow-y: hidden; width: 1500px"
          v-model="formUpdate.content"
          :defaultConfig="editorConfigDetail"
          mode="default"
          @onCreated="handleCreated"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleDetail = false">返回</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
