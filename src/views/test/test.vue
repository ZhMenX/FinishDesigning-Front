<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import api from '../../axios/axios';
import { onBeforeUnmount, ref, shallowRef, onMounted ,reactive} from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
    setTimeout(() => {
      valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
    }, 1500)
})

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const article = reactive({
    articleId :'',
    title: "测试编辑器",
    description: "测试编辑器",
    content: valueHtml.value,
    createUserId:11,
})
//新增
const onAdd = (row: any)  => {

  api.post("article/AddArticle", article).then((res: any) => {

  });
};
const Data = reactive({
    content:''
})

const onSelect = (row: any)  => {
  api.get("/article/FindArticleByArticleId?id=96229007").then((res: any) => {
    Data.content=res.data.data.content;
    console.log(res.data)
    console.log(JSON.stringify(Data.content))
  });
};
</script>

<template>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        mode="default"
        @onCreated="handleCreated"
      />
      <div style="margin-top: 10px">
      <textarea
        v-model="Data.content"
        readonly
        style="width: 100%; height: 200px; outline: none"
      ></textarea>
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="Data.content"
        :defaultConfig="editorConfig"
        mode="default"
        @onCreated="handleCreated"
      />
    </div>
      <el-button @click="onAdd">新增</el-button>
      <el-button @click="onSelect">回显</el-button>
    </div>
</template>

<style scoped>
</style>
