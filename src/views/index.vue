<script lang="ts" setup>
import { ref } from 'vue'
import { Delete, Edit, Search, Share, Upload,ArrowLeftBold,
ArrowRightBold } from '@element-plus/icons-vue'
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
import { is } from '@babel/types';
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const isCollapse = ref(false)
const CloseCollapse = () =>{
  isCollapse.value = true
}
const OpenCollapse = () =>{
  isCollapse.value = false
}
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<template>
  <div class="container">
    <el-row style="margin-bottom:30px">
      <el-col :span="24">
        <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        background-color="#112229"
        text-color="#27fffb"
        @select="handleSelect"
        >
          <el-menu-item index="0" @click="CloseCollapse">关闭</el-menu-item>
          <el-menu-item index="1" @click="OpenCollapse">展开</el-menu-item>
          <div class="flex-grow" />
          <el-menu-item index="2" @click="OpenCollapse">
            <h1 style="text-align:center; color: #199e9e;">后台管理系统</h1>
          </el-menu-item>
          <div class="flex-grow_right" />
          <el-menu-item index="3">Processing Center</el-menu-item>
          <el-sub-menu index="4">
            <template #title>Workspace</template>
              <el-menu-item index="4-1">item one</el-menu-item>
              <el-menu-item index="4-2">item two</el-menu-item>
              <el-menu-item index="4-3">item three</el-menu-item>
          </el-sub-menu>
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
      router=true
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
          <template #title><span>权限管理</span></template>
          <el-menu-item index="1-1">用户管理</el-menu-item>
          <el-menu-item index="1-2">角色管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="账号管理">
          <el-menu-item index="1-3">账号管理</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><Handbag /></el-icon>
          <span>小程序内容管理</span>
        </template>
        <el-menu-item-group>
          <template #title><span>话题</span></template>
          <el-menu-item index="3-1">话题发布审核</el-menu-item>
          <el-menu-item index="3-2">话题分类</el-menu-item>
          <el-menu-item index="3-3">话题标签</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="文章博客">
          <el-menu-item index="3-3">文章发布审核</el-menu-item>
          <el-menu-item index="3-3">文章分类</el-menu-item>
          <el-menu-item index="3-3">文章标签</el-menu-item>
        </el-menu-item-group>
        <!--<el-sub-menu index="3-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="3-4-1">item one</el-menu-item>
        </el-sub-menu>-->
      </el-sub-menu>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>GitHub</template>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><MoreFilled /></el-icon>
        <template #title>待更新</template>
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
  background-image: url('../assets/background-image.jpg')
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.flex-grow {
  flex-grow: 0.70;
}
.flex-grow_right{
  flex-grow: 0.5;
}
</style>
  