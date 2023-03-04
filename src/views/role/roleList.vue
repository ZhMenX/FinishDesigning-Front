<script lang="ts" setup>
import { onMounted, ref ,reactive,inject,getCurrentInstance} from 'vue';
import api from '../../axios/axios';
import { ElMessageBox } from "element-plus";
import { FormInstance, FormRules,ElMessage} from 'element-plus'

//引入界面刷新
const reload: any = inject("reload");
let roleList = reactive({
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
//获取角色列表方法
const FindUserListByPage = (currentSize:number,pageSize:number) =>{
    api.get("role/FindRoleList?index="+currentSize+"&size="+pageSize).then((res: any) => {
          roleList.list = res.data.data.records;
          page.total = res.data.data.total;
          page.currentSize = res.data.data.current;
          page.pageSize  = res.data.data.size;
          console.log(res.data)
  });
}

onMounted(() => {
    FindUserListByPage(page.currentSize,page.pageSize);
});

//表单校验
const ruleFormRef = ref<FormInstance>()
const validateAccount = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } 
  else {
    if (formAdd.name !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
//校验规则
const rules = reactive({
    name: [{ validator: validateAccount, trigger: 'blur' }],
})

//编辑框
var dialogVisibleUpdate = ref(false);
//编辑处理
const formUpdate = reactive({
    id:0,
    name: "",
});
const openUpdate =(row: any) => {
  formUpdate.id = row.id,
  formUpdate.name=row.name,
  dialogVisibleUpdate.value = true;
};
const onUpdate = (row: any)  => {
  let userUpdate = {
    id:formUpdate.id,
    name: formUpdate.name,
  };
  api.post("role/UpdateRole", JSON.stringify(userUpdate)).then((res: any) => {
    roleList.list = res.data;
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
  name: "",
});
const openAdd =() => {
  dialogVisibleAdd.value = true;
};
const onAdd = (row: any)  => {
  let role = {
    id:0,
    name: formAdd.name,
  }
  api.post("role/InsertRole", JSON.stringify(role)).then((res: any) => {
    roleList.list = res.data;
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
//删除角色
const onDelete =(row:any)=>{

  api.get("role/DeleteRole?id="+row.id).then((res:any) =>{
    console.log(res.data)
    reload();
    ElMessage({
        showClose: true,
        message: '删除成功！',
        type: 'success',
    })
  })
  reload();
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
  api.post("role/FindRoleListByOthers",formInline).then((res:any) =>{
    roleList.list = res.data.records;
    page.total = res.data.total;
    page.currentSize = res.data.current;
    page.pageSize  = res.data.size;
    console.log(res.data)
  })

}
//重置筛选表单
const resetFormLine = () => {
  formInline.name = ''
}


</script>

<template>
    <el-card  style="background-color:#153a40;margin-bottom:5px">
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="角色名：">
            <el-input v-model="formInline.name" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" style="color:aqua" text @click="resetFormLine">重置</el-button>
            <el-button type="primary" size="large" style="color:aqua" text @click="onSubmit">筛选</el-button>
            <el-button type="primary" size="large" text @click="openAdd()" style="color:aqua">新增角色</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card  style="background-color:#153a40">
    <el-table :data="roleList.list" 
        style="width: 100%" 
        :header-cell-style="headerStyle"
        :row-style="rowStyle"
    >
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="name" label="角色名字" />    
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
        title="新增角色"
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
          <el-form-item label="角色名称：">
            <el-input v-model="formAdd.name" type="text" autocomplete="off"  placeholder="请输入角色名称" />
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
        title="编辑角色"
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
          <el-form-item label="角色名称：">
            <el-input v-model="formUpdate.name" type="text" autocomplete="off"  placeholder="请输入角色名称" />
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
