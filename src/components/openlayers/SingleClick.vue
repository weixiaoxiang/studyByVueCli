<template>
  <div>点击事件页面</div>
</template>
<script>
export default {
  data() {
    return {}
  },
  created() {
    this.$store.commit('changeActiveTitle', '地图单击')
  },
  methods: {}
}
</script>
<style lang="less" scoped></style>
