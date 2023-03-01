<script lang="ts" setup>
import { ref } from 'vue'
const active = ref(0)
</script>

<template>
  <div class="container">
    <h1 class="title" >后台管理系统</h1>
    <van-row>
      <van-col span="4">
        <div class="left">
          <van-sidebar v-model="active" style="background-color: antiquewhite;">
            <van-sidebar-item title="文章列表" url="/article">
            </van-sidebar-item>
            <van-sidebar-item title="角色列表" url="/role">
            </van-sidebar-item>
            <van-sidebar-item title="标签名称" />
          </van-sidebar>
        </div>
      </van-col>
      <van-col span="20">
        <div class="right">
          <router-view></router-view>
        </div>
      </van-col>
    </van-row>  
  </div>
</template>

<style scoped>
.container {
  width: 1500px;
  margin-top: 50px;
  padding: 0;
  height: auto;
}
.title{
  text-align: center;
}
.left{
  background-color: antiquewhite;
  height: 1200;
}
.right{
  width: 1200;
  height: auto;
  background-color: #f7f8fa;
}
</style>
