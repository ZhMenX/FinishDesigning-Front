<script lang="ts" setup>
import { ref, inject, reactive } from "vue";
import router from "../router";
//引入界面刷新
const reload: any = inject("reload");
const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const isCollapse = ref(false);
const CloseCollapse = () => {
  isCollapse.value = true;
};
const OpenCollapse = () => {
  isCollapse.value = false;
};
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
//跳转GitHub
const toGitHub = () => {
  window.open('https://github.com/ZhMenX');
};

const toLogin = () =>{
  router.push("/login")
}

</script>

<template>
  <div class="container">
    <el-row style="margin-bottom: 30px">
      <el-col :span="24">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          background-color="#112229"
          text-color="#27fffb"
          @select="handleSelect"
          :unique-opened="true"
        >
          <!--<el-menu-item index="0" @click="CloseCollapse">hu</el-menu-item>
          <el-menu-item index="1" @click="OpenCollapse">展开</el-menu-item>-->
          <div class="flex-grow" />
          <el-menu-item index="2" @click="OpenCollapse">
            <h1 style="text-align: center; color: #199e9e">小程序后台管理</h1>
          </el-menu-item>
          <div class="flex-grow_right" />
          <el-menu-item @click="reload()">刷新</el-menu-item>
          <el-menu-item @click="toLogin()">退出登录</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="4">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#11242a"
          active-text-color="#ffd04b"
          text-color="#fff"
          router="true"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <template #title>网站首页</template>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item-group>
              <template #title>
                <span>权限管理</span>
              </template>
              <el-menu-item index="/user">
                <el-icon><User /></el-icon>
                后台用户管理
              </el-menu-item>
              <el-menu-item index="/role">
                <el-icon><Service /></el-icon>
                角色管理
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="账号管理"> </el-menu-item-group>
            <el-menu-item index="/wechatUser">
              <el-icon><Lock /></el-icon>
              微信用户管理
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><Handbag /></el-icon>
              <span>小程序内容管理</span>
            </template>
            <el-menu-item-group>
              <template #title><span>话题</span></template>
              <el-menu-item index="/discussAudit"
                ><el-icon><Tickets /></el-icon>话题发布审核</el-menu-item
              >
              <el-menu-item index="/discuss"
                ><el-icon><Document /></el-icon>话题列表</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item-group title="文章">
              <el-menu-item index="/articleAudit"
                ><el-icon><Postcard /></el-icon>文章发布审核</el-menu-item
              >
              <el-menu-item index="/article"
                ><el-icon><Document /></el-icon>文章列表</el-menu-item
              >
              <el-menu-item index="/tags"
                ><el-icon><Paperclip /></el-icon>文章标签</el-menu-item
              >
              <el-menu-item index="/classify"
                ><el-icon><WindPower /></el-icon>文章领域分类</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item-group>
              <template #title><span>题目</span></template>
              <el-menu-item index="/question"
                ><el-icon><Shop /></el-icon>题目管理</el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item>
            <el-icon><setting /></el-icon>
            <template #title>
              <span @click="toGitHub()">MyGitHub</span>
            </template>
          </el-menu-item>
          <el-menu-item>
            <el-icon><MoreFilled /></el-icon>
            <template #title>
              <span >待续</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>
  
<style>
.container {
  width: 1470px;
  margin-top: 50px;
  padding: 0;
  height: 670px;
  background-image: url("../assets/background-image.jpg");
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.flex-grow {
  flex-grow: 0.65;
}
.flex-grow_right {
  flex-grow: 0.5;
}
</style>
  