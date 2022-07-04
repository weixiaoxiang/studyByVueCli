<template>
  <div id="firekeeper">
    <div class="header">
      <div id="early">预警监测</div>
      <div id="disasters">灾情管理</div>
      <div id="nav-title"></div>
      <div id="alarm">告警统计</div>
      <div id="analysis">告警分析</div>
      <div id="username">
        <b>{{ username }}</b>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    if (this.$route.params) {
      console.log(this.$route.query, 110)
      // 获取当前的登录用户名，从home页面传值过来
      this.username = this.$route.query.username
    }
  },
  mounted() {},
  destroyed: {},
  methods: {}
}
</script>
<style lang="less" scoped>
@import '~@assets/css/firekeeper/base.css';
@import '~@assets/css/firekeeper/index.css';
</style>
