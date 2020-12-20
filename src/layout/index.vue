<template>
  <el-container>
    <side-bar></side-bar>
    <el-container>
      <el-header>Header</el-header>
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

export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    SideBar
  }
})
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;
  min-width: 980px;
}

.el-aside {
  background: #d3dce6;
}

.el-header {
  background: #b3c0d1;
}
</style>
