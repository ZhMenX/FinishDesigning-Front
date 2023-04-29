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
let questionList = reactive({
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
  FindUserListByPage(page.currentSize, page.pageSize, null);
  console.log(`current page: ${val}`);
};
//获取问题列表方法
const FindUserListByPage = (
  currentSize: number,
  pageSize: number,
  type: string
) => {
  api
    .get("/questions/page?index=" + currentSize + "&pageSize=" + pageSize)
    .then((res: any) => {

      questionList.list = res.data.data.records;
      page.total = res.data.data.total;
      page.currentSize = res.data.data.current;
      page.pageSize = res.data.data.size;
      questionList.list.forEach((question) => {
        const timestampInSeconds = Math.floor(question.updatedAt / 1000);
        const timeStr = timestampTime(timestampInSeconds);
        question.updatedAt = timeStr;
      });
      console.log(res.data);      loading.value = false
    });
};

onMounted(() => {
  FindUserListByPage(page.currentSize, page.pageSize, null);
  getQuestionType();
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
//新增框
var dialogVisibleAdd = ref(false);
const openAdd = () => {
  dialogVisibleAdd.value = true;
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
//删除问题
const onDelete = (row: any) => {
  api.get("/questions/DeleteQuestionById?id=" + row.id).then((res: any) => {
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
const rowStyle = (arg: any) => {
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
  questionId: "",
  title: "",
  content: "",
});
//筛选方法
const onSubmit = () => {
  let formData = {
    currentIndex: formInline.currentIndex,
    pageSize: formInline.pageSize,
    questionId: formInline.questionId,
    title: formInline.content,
    content: formInline.content,
    type: selectedValue.value,
  };
  console.log("类型为", selectedValue.value);
  /*api
    .get("/questions/page?index=" + formData.currentIndex + "&pageSize=" +formData.pageSize+"&type="+selectedValue.value+""+ "&content="+formData.content)
    .then((res: any) => {
      questionList.list = res.data.data.records;
      page.total = res.data.data.total;
      page.currentSize = res.data.data.current;
      page.pageSize = res.data.data.size;
      console.log(res.data);
    });*/
  api
    .get("/questions/page", {
      params: {
        index: formData.currentIndex,
        pageSize: formData.pageSize,
        type: selectedValue.value,
        content: formData.content,
      },
    })
    .then((res) => {
      questionList.list = res.data.data.records;
      page.total = res.data.data.total;
      page.currentSize = res.data.data.current;
      page.pageSize = res.data.data.size;
      console.log(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
  //FindUserListByPage(page.currentSize, page.pageSize,type);
};
//重置筛选表单
const resetFormLine = () => {
  (formInline.title = ""),
    (formInline.content = ""),
    (formInline.questionId = ""),
    (selectedValue.value = ""),
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
const editorConfigDetail: Partial<IEditorConfig> = {
  // TS 语法
};
editorConfigDetail.readOnly = true;

// 初始化 MENU_CONF 属性
const editorConfig = {
  MENU_CONF: {},
  placeholder: "请输入内容...",
};
//自定义上传图片
const UploadFile = (file: string | Blob, insertFn: (arg0: any) => void) => {
  let imgData = new FormData();
  imgData.append("file", file);
  //调用上传图片接口，上传图片
  api
    .post("uploadquestionImage", imgData)
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

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
//题目类型
const type = reactive({
  list: [],
});
const selectedValue = ref("");
//获取题目类型
const getQuestionType = () => {
  api.get("/questions/types").then((res: any) => {
    type.list = res.data.data;
    console.log(res.data);
  });
};
const question = ref({
  content: "",
  type: "",
  description: "",
  answer: "",
});
const options = ref([
  {
    content: "",
    isAnswer: false,
    label: "A",
  },
  {
    content: "",
    isAnswer: false,
    label: "B",
  },
  {
    content: "",
    isAnswer: false,
    label: "C",
  },
  {
    content: "",
    isAnswer: false,
    label: "D",
  },
]);
const saveQuestion = async () => {
  //保存问题的逻辑
  const questionRequest = {
    id: 0,
    content: question.value.content,
    description: question.value.description,
    answer: "",
    type: question.value.type,
    created_at: new Date(),
    updated_at: new Date(),
    grade: 1,
  };
  options.value.forEach((option) => {
    if (option.label === question.value.answer) {
      questionRequest.answer = option.content;
    }
  });
  console.log("最终的问题数据为");
  console.log(questionRequest);

  //保存选项的逻辑
  const optionA = {
    id: 0,
    questionId: 0,
    optionName: "A",
    optionContent: options.value[0].content,
    isAnswer: question.value.answer === options.value[0].label ? 1 : 0,
  };
  const optionB = {
    id: 0,
    questionId: 0,
    optionName: "B",
    optionContent: options.value[1].content,
    isAnswer: question.value.answer === options.value[1].label ? 1 : 0,
  };
  const optionC = {
    id: 0,
    questionId: 0,
    optionName: "C",
    optionContent: options.value[2].content,
    isAnswer: question.value.answer === options.value[2].label ? 1 : 0,
  };
  const optionD = {
    id: 0,
    questionId: 0,
    optionName: "D",
    optionContent: options.value[3].content,
    isAnswer: question.value.answer === options.value[3].label ? 1 : 0,
  };

  await api
    .post("/questions/addQuestions", questionRequest)
    .then((res) => {
      dialogVisibleAdd.value = false;
      console.log("问题新增成功");
      console.log(res.data);
      optionA.questionId = res.data.data;
      optionB.questionId = res.data.data;
      optionC.questionId = res.data.data;
      optionD.questionId = res.data.data;
      console.log("最终的选项数据A为");
      console.log(optionA);
      console.log("最终的选项数据B为");
      console.log(optionB);
      console.log("最终的选项数据C为");
      console.log(optionC);
      console.log("最终的选项数据D为");
      console.log(optionD);
      AddOption(optionA);
      AddOption(optionB);
      AddOption(optionC);
      AddOption(optionD);
    })
    .catch((err) => {
      console.error(err);
    });
  /* */
};
const AddOption = async (options: {
  id: number;
  questionId: number;
  optionName: string;
  optionContent: string;
  isAnswer: number;
}) => {
  api
    .post("/options/AddOptions", options)
    .then((res) => {
      console.log("选项新增成功");
      console.log(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};
//编辑框
var dialogVisibleUpdate = ref(false);
//编辑处理
const QuestionUpdate = reactive({
  id: 0,
  content: question.value.content,
  description: question.value.description,
  answer: "",
  type: question.value.type,
  OptionA: "",
  OptionB: "",
  OptionC: "",
  OptionD: "",
  grade: 0,
  created_at: 0,
  updated_at: 0,
});
const optionsList = reactive({
  list: [],
});
//获取问题对应的选项列表
const getOptionsList = (id: any) => {
  api.get("/options/list/" + id).then((res: any) => {
    optionsList.list = res.data.data;
    console.log(res.data.data);
    console.log(optionsList.list);
    optionsList.list.forEach((option) => {
      if (option.isAnswer == true) {
        QuestionUpdate.answer = option.optionName;
      }
      switch (option.optionName) {
        case "A":
          QuestionUpdate.OptionA = option.optionContent;
          break;
        case "B":
          QuestionUpdate.OptionB = option.optionContent;
          break;
        case "C":
          QuestionUpdate.OptionC = option.optionContent;
          break;
        case "D":
          QuestionUpdate.OptionD = option.optionContent;
          break;
      }
    });
  });
};
const openUpdate = (row: any) => {
  getOptionsList(row.id);

  console.log(row);
  (QuestionUpdate.id = row.id),
    (QuestionUpdate.content = row.content),
    (QuestionUpdate.description = row.description),
    (QuestionUpdate.type = row.type),
    (QuestionUpdate.grade = row.grade),
    (QuestionUpdate.created_at = row.created_at),
    (QuestionUpdate.updated_at = row.updated_at),
    (dialogVisibleUpdate.value = true);
};
const onUpdate = () => {
  //保存问题的逻辑
  const questionRequest = {
    id: QuestionUpdate.id,
    content: QuestionUpdate.content,
    description: QuestionUpdate.description,
    answer: QuestionUpdate.answer,
    type: QuestionUpdate.type,
    created_at: QuestionUpdate.created_at,
    updated_at: QuestionUpdate.updated_at,
    grade: QuestionUpdate.grade,
  };
  optionsList.list.forEach((option) => {
    option.isAnswer = false;
    switch (option.optionName) {
      case "A":
        if (QuestionUpdate.answer == option.optionName) {
          option.isAnswer = true;
        }
        option.optionContent = QuestionUpdate.OptionA;
        break;
      case "B":
        if (QuestionUpdate.answer == option.optionName) {
          option.isAnswer = true;
        }
        option.optionContent = QuestionUpdate.OptionB;
        break;
      case "C":
        if (QuestionUpdate.answer == option.optionName) {
          option.isAnswer = true;
        }
        option.optionContent = QuestionUpdate.OptionC;
        break;
      case "D":
        if (QuestionUpdate.answer == option.optionName) {
          option.isAnswer = true;
        }
        option.optionContent = QuestionUpdate.OptionD;
        break;
    }
  });
  console.log("最终的问题数据为");
  console.log(questionRequest);
  api
    .post("/questions/UpdateQuestions", questionRequest)
    .then((res) => {
      dialogVisibleUpdate.value = false;
      console.log("问题更新成功");
      console.log(res.data);
      console.log("最终的选项数据A为");
      console.log(optionsList.list[0]);
      console.log("最终的选项数据B为");
      console.log(optionsList.list[1]);
      console.log("最终的选项数据C为");
      console.log(optionsList.list[2]);
      console.log("最终的选项数据D为");
      console.log(optionsList.list[3]);
      UpdateOption(optionsList.list[0]);
      UpdateOption(optionsList.list[1]);
      UpdateOption(optionsList.list[2]);
      UpdateOption(optionsList.list[3]);
    })
    .catch((err) => {
      console.error(err);
    });
  dialogVisibleUpdate.value = false;
  reload();
};
const UpdateOption = async (options: any) => {
  api
    .post("/options/UpdateOptions", options)
    .then((res) => {
      console.log("选项更新成功");
      console.log(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};
const questionDetail = reactive({
  id: 0,
  content: question.value.content,
  description: question.value.description,
  answer: "",
  type: question.value.type,
  OptionA: "",
  OptionB: "",
  OptionC: "",
  OptionD: "",
});
//查看详情
var dialogVisibleDetail = ref(false);
const openDetail = async (row: any) => {
  getOptions(row.id);
  console.log(row);
  (questionDetail.id = row.id),
    (questionDetail.content = row.content),
    (questionDetail.description = row.description),
    (questionDetail.answer = row.answer),
    (questionDetail.type = row.type),
    (dialogVisibleDetail.value = true);
};
//获取问题对应的选项
const getOptions = async (id: string) => {
  api.get("/options/" + id).then((res: any) => {
    questionDetail.OptionA = res.data.data.A;
    questionDetail.OptionB = res.data.data.B;
    questionDetail.OptionC = res.data.data.C;
    questionDetail.OptionD = res.data.data.D;
    console.log(res.data.data);
  });
};
//转化时间
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
const loading = ref(true);
</script>

<template>
  <el-card style="background-color: #153a40; margin-bottom: 5px">
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键词：">
          <el-input v-model="formInline.content" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="selectedValue" placeholder="请选择类型">
            <el-option
              v-for="(option, index) in type.list"
              :key="index"
              :label="option"
              :value="option"
            />
          </el-select>
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
          <div style="float: right; position: relative">
            <el-button
              type="primary"
              size="large"
              text
              @click="openAdd()"
              style="color: aqua"
              >新增问题</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-card>

  <el-card style="background-color: #153a40">
    <el-table
      v-loading ="loading"
      :data="questionList.list"
      style="width: 100%"
      :header-cell-style="headerStyle"
      :row-style="rowStyle"
    >
      <el-table-column prop="content" label="标题" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="updatedAt" label="操作时间" />
      <el-table-column prop="type" label="类型" sortable />
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
    title="新增问题"
    v-model="dialogVisibleAdd"
    width="45%"
    draggable
    center
  >
    <el-form ref="questionForm" :model="question" label-width="120px">
      <el-form-item label="问题内容" required>
        <el-input
          v-model="question.content"
          placeholder="请输入问题内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项A" required>
        <el-input
          v-model="options[0].content"
          placeholder="请输入选项A"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项B" required>
        <el-input
          v-model="options[1].content"
          placeholder="请输入选项B"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项C" required>
        <el-input
          v-model="options[2].content"
          placeholder="请输入选项C"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项D" required>
        <el-input
          v-model="options[3].content"
          placeholder="请输入选项D"
        ></el-input>
      </el-form-item>
      <el-form-item label="答案设置" required>
        <el-select v-model="question.answer" placeholder="请设置问题答案">
          <el-option label="A" value="A"></el-option>
          <el-option label="B" value="B"></el-option>
          <el-option label="C" value="C"></el-option>
          <el-option label="D" value="D"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题类型" required>
        <el-select v-model="question.type" placeholder="请选择问题类型">
          <el-option label="JAVA" value="JAVA"></el-option>
          <el-option label="C#" value="C#"></el-option>
          <el-option label="HTML" value="HTML"></el-option>
          <el-option label="CSS" value="CSS"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述" required>
        <el-input
          type="textarea"
          v-model="question.description"
          placeholder="请输入问题描述"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="saveQuestion()">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog
    title="编辑问题"
    v-model="dialogVisibleUpdate"
    width="45%"
    draggable
    center
  >
    <el-form ref="questionForm" :model="question" label-width="120px">
      <el-form-item label="问题内容" required>
        <el-input
          v-model="QuestionUpdate.content"
          placeholder="请输入问题内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项A" required>
        <el-input
          v-model="QuestionUpdate.OptionA"
          placeholder="请输入选项A"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项B" required>
        <el-input
          v-model="QuestionUpdate.OptionB"
          placeholder="请输入选项B"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项C" required>
        <el-input
          v-model="QuestionUpdate.OptionC"
          placeholder="请输入选项C"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项D" required>
        <el-input
          v-model="QuestionUpdate.OptionD"
          placeholder="请输入选项D"
        ></el-input>
      </el-form-item>
      <el-form-item label="答案设置" required>
        <el-select v-model="QuestionUpdate.answer" placeholder="请设置问题答案">
          <el-option label="A" value="A"></el-option>
          <el-option label="B" value="B"></el-option>
          <el-option label="C" value="C"></el-option>
          <el-option label="D" value="D"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题类型" required>
        <el-select v-model="QuestionUpdate.type" placeholder="请选择问题类型">
          <el-option label="JAVA" value="JAVA"></el-option>
          <el-option label="C#" value="C#"></el-option>
          <el-option label="HTML" value="HTML"></el-option>
          <el-option label="CSS" value="CSS"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述" required>
        <el-input
          type="textarea"
          v-model="QuestionUpdate.description"
          placeholder="请输入问题描述"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="dialogVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" @click="onUpdate()">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog
    title="详情"
    v-model="dialogVisibleDetail"
    width="45%"
    draggable
    label-position="top"
    center
  >
    <el-form ref="questionForm" :model="question" label-width="120px">
      <el-form-item label="问题内容" required>
        <el-input
          v-model="questionDetail.content"
          placeholder="请输入问题内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="选项A" required>
        <el-input
          v-model="questionDetail.OptionA"
          disabled
          placeholder="请输入选项A"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项B" required>
        <el-input
          v-model="questionDetail.OptionB"
          disabled
          placeholder="请输入选项B"
        ></el-input>
      </el-form-item>
      <el-form-item label="选项C" required>
        <el-input
          v-model="questionDetail.OptionC"
          placeholder="请输入选项C"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="选项D" required>
        <el-input
          v-model="questionDetail.OptionD"
          placeholder="请输入选项D"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="答案设置" required>
        <el-input
          v-model="questionDetail.answer"
          placeholder="请输入答案设置"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="问题类型" required>
        <el-input
          v-model="questionDetail.type"
          placeholder="请输入问题类型"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="问题描述" required>
        <el-input
          type="textarea"
          v-model="questionDetail.description"
          placeholder="请输入问题描述"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="dialogVisibleDetail = false">取 消</el-button>
      </el-form-item>
    </el-form>
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
