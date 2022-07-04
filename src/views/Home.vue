<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo">
          <img src="~@assets/images/logo.png" alt="" />
          <span>学习道路漫长且孤独...</span>
        </div>
        <span class="active-title">{{ activeTitle }}</span>
        <el-button size="small" @click="loginout">退出</el-button>
      </el-header>
      <el-container class="container">
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="collapse" @click="toggleClass">||</div>
          <el-scrollbar>
            <el-menu
              :router="true"
              :default-active="activeIndex"
              class="el-menu-vertical-demo"
              :collapse-transition="false"
              unique-opened
              :collapse="isCollapse"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#ffd04b"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-submenu v-for="item in menuList" :key="item.id" :index="item.id">
                <template slot="title">
                  <i :class="[iconObj[item.id], 'iconCustom']"></i>
                  <!-- <span slot="title">{{item.name}}</span> -->
                  <span slot="title" :title="item.name">{{ item.name }}</span>
                </template>
                <div v-for="item2 in item.children" :key="item2.id">
                  <el-submenu v-if="item2.children" :index="item2.id">
                    <template slot="title">
                      <span :title="item2.name">{{ item2.name }}</span>
                    </template>
                    <div v-for="item3 in item2.children" :key="item3.id">
                      <el-submenu v-if="item3.children" :index="item3.id">
                        <template slot="title">
                          <span :title="item3.name">{{ item3.name }}</span>
                        </template>
                        <div v-for="item4 in item3.children" :key="item4.id">
                          <el-submenu v-if="item4.children" :index="item4.id">
                            <template slot="title">
                              <span :title="item4.name">{{ item4.name }}</span>
                            </template>
                          </el-submenu>
                          <el-menu-item
                            v-else
                            :index="item4.path"
                            @click="saveActiveNavIndex(item4)"
                          >
                            <!-- {{item4.name}} -->
                            <span :title="item4.name">{{ item4.name }}</span>
                          </el-menu-item>
                        </div>
                      </el-submenu>
                      <el-menu-item v-else :index="item3.path" @click="saveActiveNavIndex(item3)">
                        <span :title="item3.name">{{ item3.name }}</span>
                      </el-menu-item>
                    </div>
                  </el-submenu>
                  <el-menu-item v-else :index="item2.path" @click="saveActiveNavIndex(item2)">
                    <!-- {{item2.name}} -->
                    <span :title="item2.name">{{ item2.name }}</span>
                  </el-menu-item>
                </div>
              </el-submenu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
console.log(process.env.NODE_ENV, 111)
import menuDataList from '@assets/js/menuDataList'
import api from '@/api/api'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      isCollapse: false,
      menuList: menuDataList,
      iconObj: {
        1: 'iconfont icon-ditu',
        2: 'iconfont icon-bf-icon-3Dmap',
        3: 'iconfont icon-three-dimensional',
        4: 'iconfont icon-jurassic_add-project',
        5: 'iconfont icon-jurassic_add-project'
      },
      activeIndex: '0'
    }
  },
  created() {
    this.activeIndex = window.sessionStorage.getItem('activeNavIndex')
    if (!this.activeIndex) {
      this.$router.push('/welcome')
    }
  },
  computed: {
    ...mapState({
      activeTitle: state => state.activeTitle,
      mapUpdateSize: state => state.mapUpdateSize
    })
  },
  mounted() {},
  filters: {},
  methods: {
    loginout() {
      window.sessionStorage.clear()
      // 重置store
      this.$store.commit('changeActiveTitle', '欢迎页')
      this.$router.push('/login')
    },
    handleOpen() {},
    handleClose() {},
    toggleClass() {
      this.isCollapse = !this.isCollapse
      this.$nextTick(() => {
        this.$store.commit('toggleMapUpdateSize', !this.mapUpdateSize)
      })
      // this.$store.commit('toggleMapUpdateSize', !this.mapUpdateSize)
      // this.$store.dispatch('toggleMapUpdateSize', !this.mapUpdateSize)
    },
    saveActiveNavIndex(item) {
      if (!item.isTarget) {
        console.log(this.activeIndex)
        this.activeIndex = item.path
        window.sessionStorage.setItem('activeNavIndex', this.activeIndex)
      } else {
        this.isTargetTab(item)
      }
    },
    isTargetTab(item) {
      const params = item
      const routeData = this.$router.resolve({
        path: `${item.path}`,
        query: {
          ...params,
          username: 'wxx'
        }
      })
      // window.open(routeData.location.path, "_blank");
      window.open(routeData.href, '_blank')
      // 将旧页面重置为 activeIndex,当activeIndex为null时直接进入welcome中
      this.$router.push(this.activeIndex || '/welcome')
      window.sessionStorage.setItem('activeNavIndex', this.activeIndex)
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
}

.container {
  height: calc(100vh - 60px);
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  padding-left: 0;
}

.logo {
  height: 60px;
  line-height: 60px;

  img {
    height: 100%;
    vertical-align: middle;
  }

  span {
    color: #fff;
    font-size: 16px;
    margin-left: 15px;
  }
}

.el-aside {
  background-color: #333744;
  transition: all 0.5s;
  height: 100%;
}

// 滚动条样式  注意：
// 1、el-scrollbar 的外部标签必须设置高度，高度随意，根据需求来；
// 2、el-scrollbar 本身也必须设置高度，类名可以自己随意设置。
.el-scrollbar {
  // position: relative;
  // height: 100%;
  height: calc(100% - 30px);
  overflow-x: hidden;
}

.el-menu {
  border: none !important;
  font-size: 18px !important;
  // box-sizing: border-box;
}

.collapse {
  // position: absolute;
  width: 100%;
  height: 30px;
  background-color: #409eff;
  text-align: center;
  line-height: 30px;
  color: #fff;
}

.iconCustom {
  font-size: 20px;
  margin-right: 10px;
}

.active-title {
  color: #ffffff;
}
</style>
<style>
/* 滚动条样式 解决x轴显示滚动条问题 */
.el-scrollbar__wrap {
  overflow-x: auto;
}
</style>
