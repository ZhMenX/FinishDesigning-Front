<script lang="ts" setup>
import { reactive, ref,onMounted,onActivated,onBeforeUnmount} from 'vue'
import type { FormInstance } from 'element-plus'
import router from '../router/index';
import api from '../axios/axios';
//使用pinia，全局状态保存
import {mainStore} from '../store/index';
import {storeToRefs} from 'pinia';
const store = mainStore()
const {userInfo} = storeToRefs(store);
//登录校验
const ruleFormRef = ref<FormInstance>()
const validateAccount = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the account'))
  } 
  else {
    if (loginUser.username !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else if (value !== loginUser.password) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const loginUser = reactive({
    username:'admin',
    password:'123456'
})

const rules = reactive({
    username: [{ validator: validateAccount, trigger: 'blur' }],
    password: [{ validator: validatePass, trigger: 'blur' }],
})
//登录方法
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    console.log("这是账号"+loginUser.username+loginUser.password);
    if (valid) {
        api.post("/login?username="+loginUser.username+"&password="+loginUser.password)
        .then(res=>{
            console.log(res);
            store.changeToken(res.data.token)
            store.changeUserId(res.data.data.id)
            store.changeUser(res.data.data)
            store.changeUserName(res.data.data.username)
            console.log("取出的token："+store.getToken)
            console.log("取出的用户："+JSON.stringify(store.getUser))
            console.log("取出的用户名："+store.getUserName)
            console.log("取出的用户ID："+store.getUserId)
            router.push("/home")
            //测试
            //router.push("/test")
        })  
    } 
    else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

</script>

<template>
<div class="common-layout">
    <el-container>
      <el-container class="container" >
        <el-aside width="1040px">
        </el-aside>
        <el-main style="width:450px;">
            <div style="margin-top:100px;font-size:xx-large;margin-left:90px;color:#adfdff">
                <span>IT技术交流小程序后台</span>
            </div>
            <el-form
                ref="ruleFormRef"
                :model="loginUser"
                status-icon
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
                style="margin-top:100px"
                >
                <el-form-item label="管理员账号" prop="loginUser.username">
                    <el-input v-model="loginUser.username" type="text" autocomplete="off" placeholder="管理员账号为admin"/>
                </el-form-item>
                <el-form-item label="密码" prop="loginUser.password">
                    <el-input v-model="loginUser.password" type="password" autocomplete="off" placeholder="密码为123456"/>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button color="#15c5c7" type="primary"  size="large" @click="submitForm(ruleFormRef)">登录</el-button>
                    <el-button color="#15c5c7" size="large" @click="resetForm(ruleFormRef)">重置</el-button>
                </el-form-item>
            </el-form>
        </el-main>

      </el-container>
    </el-container>
</div>    

</template>

<style scoped>
.container{
    margin-top: 50px;
    height: 670px;
    background-image: url('../assets/background-image.jpg');
}
</style>
