<script lang="ts" setup>
import { onMounted, ref ,reactive,inject,getCurrentInstance} from 'vue';
import api from '../../axios/axios';
import axios from 'axios'
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from 'element-plus'
//引入界面刷新
const reload: any = inject("reload");
let userList = reactive({
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
//获取用户列表方法
const FindUserListByPage = (currentSize:number,pageSize:number) =>{
    api.get("User/FindUserList?index="+currentSize+"&size="+pageSize).then((res: any) => {
          userList.list = res.data.data.records;
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
const validateAccount = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } 
  else {
    if (formAdd.username !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码！'))
  }
  else if(formAdd.checkPassword === ''){
    callback(new Error('请确认密码！'))
  }
  else if (value !== formAdd.password) {
    callback(new Error("Two inputs don't match!"))
  } 
  else if(value!==formAdd.checkPassword&&formAdd.password!=formAdd.checkPassword){
    callback(new Error("两次输入的密码不一致！"))
  }
  else {
    callback()
  }
}

const rules = reactive({
    username: [{ validator: validateAccount, trigger: 'blur' }],
    password: [{ validator: validatePass, trigger: 'blur' }],
})
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

//编辑框
var dialogVisibleUpdate = ref(false);
//编辑处理
const formUpdate = reactive({
  username: "",
  age: 0,
  name: "",
  sex: 0,
});
const requestUpdate = reactive({
  username :formUpdate.username,
  age: formUpdate.age,
  name: formUpdate.name,
  password:'123456',
  sex: formUpdate.sex,
})
const openUpdate =(row: any) => {
  formUpdate.username=row.username,
  formUpdate.age=row.age,
  formUpdate.name=row.name,
  formUpdate.sex= row.sex,
  dialogVisibleUpdate.value = true;
};
const onUpdate = (row: any)  => {
  let userUpdate = {
    username :formUpdate.username,
    age: formUpdate.age,
    name: formUpdate.name,
    password:'123456',
    sex: formUpdate.sex,
  };
  requestUpdate.username = formUpdate.username;
  requestUpdate.age = formUpdate.age;
  requestUpdate.name = formUpdate.name;
  requestUpdate.sex = formUpdate.sex;
  axios.request({
    baseURL:"http://www.atzmx.online:8090/",
    url:"User/UpdateUser",
    data:requestUpdate,
    method:'post',
    headers:{'Content-Type': 'application/json','X-Requested-With': 'XMLHttpRequest'}
  }).then((res: any) => {
    userList.list = res.data;
  });
  /*api.post("User/UpdateUser", {params:JSON.stringify(userUpdate),headers:"application/json"}).then((res: any) => {
    userList.list = res.data;
  });*/
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
  username: "",
  age: 0,
  name: "",
  password: "",
  checkPassword:'',
  sex: 0,
});
const requestAdd = reactive({
    username :formAdd.username,
    age: formAdd.age,
    name: formAdd.name,
    password: formAdd.password,
    sex: formAdd.sex,
})
const openAdd =() => {
  dialogVisibleAdd.value = true;
};
const onAdd = (row: any)  => {
  let user = {
    username :formAdd.username,
    age: formAdd.age,
    name: formAdd.name,
    password: formAdd.password,
    sex: formAdd.sex,
  };
  requestAdd.username = formAdd.username;
  requestAdd.age = formAdd.age;
  requestAdd.name = formAdd.name;
  requestAdd.sex = formAdd.sex;
  requestAdd.password = formAdd.password;
  axios.request({
    baseURL:"http://www.atzmx.online:8090/",
    url:"register",
    data:requestAdd,
    method:'post',
    headers:{'Content-Type': 'application/json','X-Requested-With': 'XMLHttpRequest'}
  })
  .then((res: any) => {
    userList.list = res.data;
    dialogVisibleAdd.value = false;
    reload();
    ElMessage({
        showClose: true,
        message: '新增成功！',
        type: 'success',
    })
  });
  /*api.post("register",JSON.stringify(user))
  .then((res: any) => {
    userList.list = res.data;
    dialogVisibleAdd.value = false;
    reload();
    ElMessage({
        showClose: true,
        message: '新增成功！',
        type: 'success',
    })
  });*/
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
  name: '',
  username:'',
  currentIndex: page.currentSize,
  pageSize:page.pageSize,
})
//筛选方法
const onSubmit = () => {
  api.post("User/FindUserListByOthers",formInline).then((res:any) =>{
    userList.list = res.data.data.records;
    page.total = res.data.data.total;
    page.currentSize = res.data.data.current;
    page.pageSize  = res.data.data.size;
    console.log(res.data)
  })

}
//重置筛选表单
const resetFormLine = () => {
  formInline.name = '',
  formInline.username = ''
}


</script>

<template>
    <el-card  style="background-color:#153a40;margin-bottom:5px">
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="用户名：" > 
            <el-input v-model="formInline.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="昵称：">
            <el-input v-model="formInline.name" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" style="color:aqua" text @click="resetFormLine">重置</el-button>
            <el-button type="primary" size="large" style="color:aqua" text @click="onSubmit">筛选</el-button>
            <el-button type="primary" size="large" text @click="openAdd()" style="color:aqua">新增用户</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card  style="background-color:#153a40">
    <el-table :data="userList.list" 
        style="width: 100%" 
        :header-cell-style="headerStyle"
        :row-style="rowStyle"
    >
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="sex"  label="性别(0-女 1-男)" />
        <el-table-column prop="isDeleted" label="状态(0-未删除 1-已删除)" />
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
          <el-form-item label="用户：">
            <el-input v-model="formAdd.username" type="text" autocomplete="off"  placeholder="用户名注册后不可修改" />
          </el-form-item>
          <el-form-item label="昵称：">
            <el-input v-model="formAdd.name" type="text" autocomplete="off"  placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="密码：">
            <el-input v-model="formAdd.password" type="password" autocomplete="off" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="密码：">
            <el-input v-model="formAdd.checkPassword" type="password" autocomplete="off"  placeholder="请确认密码" />
          </el-form-item>
          <el-form-item label="年龄：">
            <el-input v-model="formAdd.age" type="number" autocomplete="off" placeholder="请输入年龄" />
          </el-form-item>
          <el-form-item label="性别：">
            <el-input v-model="formAdd.sex" type="number" autocomplete="off" placeholder="请输入性别: 0-女 1-男" />
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
          <el-form-item label="昵称：">
            <el-input v-model="formUpdate.name" type="text" autocomplete="off"  placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="年龄：">
            <el-input v-model="formUpdate.age" type="number" autocomplete="off" placeholder="请输入年龄" />
          </el-form-item>
          <el-form-item label="性别：">
            <el-input v-model="formUpdate.sex" type="number" autocomplete="off" placeholder="请输入性别: 0-女 1-男" />
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
