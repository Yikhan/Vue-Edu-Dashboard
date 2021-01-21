<template>
  <el-container>
    <side-bar></side-bar>
    <el-container>
      <el-header>
        <app-header />
      </el-header>
      <el-main>
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>dd

<script lang="ts">
import Vue from 'vue'
import SideBar from './components/side-bar.vue'
import AppHeader from './components/app-header.vue'

export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    SideBar,
    AppHeader
  }
})
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;
}

.el-aside {
  background: #d3dce6;
}

.el-header {
  background: #fff;
}
</style>
