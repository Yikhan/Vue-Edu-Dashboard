<template>
  <div id="app">
    <h1>Vue Dashboard</h1>
    <p class="text">hello world</p>
    <!-- 根路由出口 -->
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.text {
  color: $success-color
}
</style>
