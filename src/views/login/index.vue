<template>
  <div class="login">
    <!-- 绑定model和rules后还需要给具体的input元素绑定prop
    prop的值就是需要调用的rule的名字 -->
    <el-form
      class="login-form"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item
        label="手机号码"
        prop="phone"
      >
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="form.password"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onSubmit"
          :loading="isLoginLoading"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import request from '@/utils/request'
import qs from 'qs'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '15510792995',
        password: '111111'
      },
      isLoginLoading: false,
      rules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\w{6,15}$/, message: '6到15个合法字符，只允许大小写字母、数字和下划线', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 登录按钮loading
        this.isLoginLoading = true
        // 1. 表单验证
        await (this.$refs.form as Form).validate()
        // 2. 发送请求
        // axios默认发送application/json格式的数据
        // 但本项目的后端API要求使用x-www-form-urlencoded格式
        // 需要使用qs库来转换
        const { data } = await login(this.form)
        // 3. 处理请求结果
        // 失败：弹窗显示错误
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          // 成功：跳转到首页
          this.$message.success('登录成功')
          this.$router.push({
            name: 'home'
          })
        }
      } catch (err) {
        console.log('登录失败', err)
      }
      // 结束登录按钮loading
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 300px;
    padding: 20px;
    border-radius: 5px;
    background: #fff;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
