<template>
  <div id="pinyougou">
    <div class="shortcut">
      <div class="w">
        <div class="register fl">
          <div class="hello fl">
            <p>品优购欢迎您!</p>
          </div>
          <div class="register-box fl">
            <a href="#">请登录</a>
            <a href="#" class="style-red">免费注册</a>
          </div>
        </div>
        <!-- 快速导航模块start -->
        <div class="shortcut_nav fr">
          <ul>
            <li><a href="#">我的订单</a></li>
            <li>|</li>
            <li><a href="#" class="shortcut_nav_arr">我的品优购</a></li>
            <li>|</li>
            <li><a href="#">品优购会员</a></li>
            <li>|</li>
            <li><a href="#">企业采购</a></li>
            <li>|</li>
            <li><a href="#" class="shortcut_nav_arr">关注品优购</a></li>
            <li>|</li>
            <li><a href="#" class="shortcut_nav_arr">客户服务</a></li>
            <li>|</li>
            <li><a href="#" class="shortcut_nav_arr">网站导航</a></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 快速导航end -->
    <!-- 头部start -->
    <div class="header">
      <div class="w">
        <div class="logo">
          <img src="@assets/images/pinyougou/logo.png" alt="" />
        </div>
        <div class="search">
          <input
            id="searchtext"
            type="text"
            name=""
            class="fl"
            placeholder="请输入"
          />
          <button class="btn fl">搜索</button>
        </div>
        <div class="navitems">
          <ul>
            <li><a href="#">亿元优惠</a></li>
            <li><a href="#">9.9元团购</a></li>
            <li><a href="#">美满99减30</a></li>
            <li><a href="#">办公用品</a></li>
            <li><a href="#">电脑</a></li>
            <li><a href="#">通信</a></li>
          </ul>
        </div>
        <div class="shopcar">
          我的购物车
          <div class="shop-count">999</div>
        </div>
        <div class="nav">
          <div class="all-class">
            <div class="all-class-title">全部商品分类</div>
            <ul class="all-class-items">
              <li>家用电器<i class="iconfont icon-youjiantou"></i></li>
              <li>手机、数码、通信<i class="iconfont icon-youjiantou"></i></li>
              <li>电脑、办公<i class="iconfont icon-youjiantou"></i></li>
              <li>
                家具、家居、家装、厨具<i class="iconfont icon-youjiantou"></i>
              </li>
              <li>
                男装、女装、童装、内衣<i class="iconfont icon-youjiantou"></i>
              </li>
              <li>
                个户化妆、清洁用品、宠物<i class="iconfont icon-youjiantou"></i>
              </li>
              <li>
                鞋靴、箱包、珠宝、奢侈品<i class="iconfont icon-youjiantou"></i>
              </li>
              <li>运动户外、钟表<i class="iconfont icon-youjiantou"></i></li>
              <li>汽车、汽车用品<i class="iconfont icon-youjiantou"></i></li>
              <li>母婴、玩具乐器<i class="iconfont icon-youjiantou"></i></li>
              <li>
                食品、酒类、生鲜、特产<i class="iconfont icon-youjiantou"></i>
              </li>
              <li>医药保健<i class="iconfont icon-youjiantou"></i></li>
              <li>
                图书、音响、电子书<i class="iconfont icon-youjiantou"></i>
              </li>
              <li>
                彩票、旅行、充值、票务<i class="iconfont icon-youjiantou"></i>
              </li>
              <li>
                理财、众筹、白条、保险<i class="iconfont icon-youjiantou"></i>
              </li>
            </ul>
          </div>
          <div class="navbar">
            <div>服装城</div>
            <div>美妆城</div>
            <div>传智超市</div>
            <div>全球购</div>
            <div>闪购</div>
            <div>团购</div>
            <div>拍卖</div>
            <div>有趣</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 头部end -->
    <!-- banner start -->
    <div class="w clearfix">
      <div class="banner">
        <img src="@assets/images/pinyougou/banner.png" alt="" />
      </div>
      <div class="banner-right">
        <div class="news">
          <div class="news-hd">
            品优购快报
            <span>更多></span>
          </div>
          <div class="news-bd">
            <ul>
              <li><b>[特惠]</b>备战开学季 全民半价购数码</li>
              <li><b>[公告]</b>品优稳占家电网购六成份额</li>
              <li><b>[特惠]</b>百元中秋全品类礼券限额领</li>
              <li><b>[公告]</b>上品优生鲜 享阳澄湖大闸蟹</li>
              <li><b>[特惠]</b>每日享折扣品优品质游</li>
            </ul>
          </div>
        </div>
        <div class="meun-grid">
          <div>
            <p>话费</p>
          </div>
          <div>
            <p>机票</p>
          </div>
          <div>
            <p>电影票</p>
          </div>
          <div>
            <p>游戏</p>
          </div>
          <div>
            <p>彩票</p>
          </div>
          <div>
            <p>加油卡</p>
          </div>
          <div>
            <p>酒店</p>
          </div>
          <div>
            <p>火车票</p>
          </div>
          <div>
            <p>众筹</p>
          </div>
          <div>
            <p>理财</p>
          </div>
          <div>
            <p>礼品卡</p>
          </div>
          <div>
            <p>白条</p>
          </div>
        </div>
        <div class="banner-right-bottom">
          <img src="@assets/images/pinyougou/banner-right-bottom.png" alt="" />
        </div>
      </div>
    </div>
    <!-- banner end-->
    <div class="w">
      <!-- recommend start -->
      <div class="recommend">
        <div class="recommend-left">
          <img src="@assets/images/pinyougou/clock.png" alt="" />
          <p>今日推荐</p>
        </div>
        <div class="recommend-right">
          <div>
            <img src="@assets/images/pinyougou/recommend1.png" alt="" />
          </div>
          <div>
            <img src="@assets/images/pinyougou/recommend1.png" alt="" />
          </div>
          <div>
            <img src="@assets/images/pinyougou/recommend1.png" alt="" />
          </div>
          <div>
            <img src="@assets/images/pinyougou/recommend1.png" alt="" />
          </div>
        </div>
      </div>
      <!-- recommend end -->
      <!-- 猜你喜欢 start -->
      <div class="like">
        <div class="like-hd">
          <h3>猜你喜欢</h3>
          <span>换一批</span>
        </div>
        <div class="like-bd">
          <div>
            <img src="@assets/images/pinyougou/like1.png" alt="" />
            <div class="like-text">
              <p>
                阳光美包新款单肩包女<br />
                包时尚子母包四件套女
              </p>
              <span>￥199.00</span>
            </div>
          </div>
          <div>
            <img src="@assets/images/pinyougou/like2.png" alt="" />
            <div class="like-text">
              <p>
                阳光美包新款单肩包女<br />
                包时尚子母包四件套女
              </p>
              <span>￥199.00</span>
            </div>
          </div>
          <div>
            <img src="@assets/images/pinyougou/like3.png" alt="" />
            <div class="like-text">
              <p>
                阳光美包新款单肩包女<br />
                包时尚子母包四件套女
              </p>
              <span>￥199.00</span>
            </div>
          </div>
          <div>
            <img src="@assets/images/pinyougou/like4.png" alt="" />
            <div class="like-text">
              <p>
                阳光美包新款单肩包女<br />
                包时尚子母包四件套女
              </p>
              <span>￥199.00</span>
            </div>
          </div>
          <div>
            <img src="@assets/images/pinyougou/like5.png" alt="" />
            <div class="like-text">
              <p>
                阳光美包新款单肩包女<br />
                包时尚子母包四件套女
              </p>
              <span>￥199.00</span>
            </div>
          </div>
          <div>
            <img src="@assets/images/pinyougou/like6.png" alt="" />
            <div class="like-text">
              <p>
                阳光美包新款单肩包女<br />
                包时尚子母包四件套女
              </p>
              <span>￥199.00</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 猜你喜欢 end -->
    </div>
    <div class="w">
      <div class="hotshop">
        <div class="hotshop-hd">
          <h3>热门疯抢</h3>
        </div>
        <div class="hotshop-bd">
          <div class="content-item1">
            <div class="img-box">
              <img src="@assets/images/pinyougou/content-item1.png" alt="" />
            </div>
            <p>暴风魔镜 小D 虚拟现实智能VR眼镜3</p>
            <span>￥79.00</span>
          </div>
          <div class="content-item2">
            <div>
              <div class="item2-imgbox">
                <img src="@assets/images/pinyougou/content-item2.png" alt="" />
              </div>
              <div class="item2-detail">
                <p>宇博 7800毫安 Z3移动电源/充电</p>
                <span>￥139.00</span>
              </div>
            </div>
            <div>
              <div class="item2-imgbox">
                <img src="@assets/images/pinyougou/content-item2.png" alt="" />
              </div>
              <div class="item2-detail">
                <p>宇博 7800毫安 Z3移动电源/充电</p>
                <span>￥139.00</span>
              </div>
            </div>
            <div>
              <div class="item2-imgbox">
                <img src="@assets/images/pinyougou/content-item2.png" alt="" />
              </div>
              <div class="item2-detail">
                <p>宇博 7800毫安 Z3移动电源/充电</p>
                <span>￥139.00</span>
              </div>
            </div>
            <div>
              <div class="item2-imgbox">
                <img src="@assets/images/pinyougou/content-item2.png" alt="" />
              </div>
              <div class="item2-detail">
                <p>宇博 7800毫安 Z3移动电源/充电</p>
                <span>￥139.00</span>
              </div>
            </div>
            <div>
              <div class="item2-imgbox">
                <img src="@assets/images/pinyougou/content-item2.png" alt="" />
              </div>
              <div class="item2-detail">
                <p>宇博 7800毫安 Z3移动电源/充电</p>
                <span>￥139.00</span>
              </div>
            </div>
            <div>
              <div class="item2-imgbox">
                <img src="@assets/images/pinyougou/content-item2.png" alt="" />
              </div>
              <div class="item2-detail">
                <p>宇博 7800毫安 Z3移动电源/充电</p>
                <span>￥139.00</span>
              </div>
            </div>
          </div>
          <div class="content-item3">
            <div>
              <div class="item3-imgbox">
                <img src="@assets/images/pinyougou/content-item3.png" alt="" />
              </div>
              <div class="item3-right">
                <div class="item3-right-hd">
                  <img
                    src="@assets/images/pinyougou/content-item3hd.png"
                    alt=""
                  />
                  <span>0807***</span>
                </div>
                <div class="item3-right-bd">
                  <div>
                    “高清分辨率的屏幕用着和台式机一样，摄摄像头超清晰，拍出来的图片是1像头超清晰，拍出来的图片是1”
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="item3-imgbox">
                <img src="@assets/images/pinyougou/content-item3.png" alt="" />
              </div>
              <div class="item3-right">
                <div class="item3-right-hd">
                  <img
                    src="@assets/images/pinyougou/content-item3hd.png"
                    alt=""
                  />
                  <span>0807***</span>
                </div>
                <div class="item3-right-bd">
                  <div>
                    “高清分辨率的屏幕用着和台式机一样，摄像头超摄像头超清晰，拍出来的图片是1清晰，拍出来的图片是1”
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- footer start -->
    <footer class="footer">
      <div class="w">
        <div class="mod-service">
          <ul class="clearfix">
            <li>
              <h5></h5>
              <div class="service-text">
                <h3>正品保障</h3>
                <p>正品保障，提供发票</p>
              </div>
            </li>
            <li>
              <h5></h5>
              <div class="service-text">
                <h3>正品保障</h3>
                <p>正品保障，提供发票</p>
              </div>
            </li>
            <li>
              <h5></h5>
              <div class="service-text">
                <h3>正品保障</h3>
                <p>正品保障，提供发票</p>
              </div>
            </li>
            <li>
              <h5></h5>
              <div class="service-text">
                <h3>正品保障</h3>
                <p>正品保障，提供发票</p>
              </div>
            </li>
            <li>
              <h5></h5>
              <div class="service-text">
                <h3>正品保障</h3>
                <p>正品保障，提供发票</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="mod-help">
          <ul>
            <li>
              <dl>
                <dt>购物指南</dt>
                <dd>购物流程</dd>
                <dd>会员介绍</dd>
                <dd>生活旅行/团购</dd>
                <dd>常见问题</dd>
                <dd>大家电</dd>
                <dd>联系客服</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>购物指南</dt>
                <dd>购物流程</dd>
                <dd>会员介绍</dd>
                <dd>生活旅行/团购</dd>
                <dd>常见问题</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>购物指南</dt>
                <dd>购物流程</dd>
                <dd>会员介绍</dd>
                <dd>常见问题</dd>
                <dd>大家电</dd>
                <dd>联系客服</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>购物指南</dt>
                <dd>购物流程</dd>
                <dd>生活旅行/团购</dd>
                <dd>常见问题</dd>
                <dd>大家电</dd>
                <dd>联系客服</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>购物指南</dt>
                <dd>购物流程</dd>
                <dd>会员介绍</dd>
                <dd>生活旅行/团购</dd>
                <dd>常见问题</dd>
                <dd>联系客服</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>购物指南</dt>
                <dd>购物流程</dd>
                <dd>会员介绍</dd>
                <dd>生活旅行/团购</dd>
                <dd>常见问题</dd>
                <dd>大家电</dd>
                <dd>联系客服</dd>
              </dl>
            </li>
          </ul>
        </div>
        <div class="copyrights"></div>
      </div>
    </footer>
    <!-- footer end -->
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  watch: {
    $route(to, from) {
      console.log(to, from)
      // 监听路由是否变化
      // if (to.params.id != from.params.id) {
      //     this.active = to.params.id;
      //     this.init(); //重新加载数据
      // }
    }
  },
  created() {
    if (this.$route.params) {
      console.log(this.$route.query)
      this.init()
    }
  },
  methods: {}
}
</script>
<style></style>
<style lang="less" scoped>
@import "~@assets/css/pinyougou/base.css";
@import "~@assets/css/pinyougou/index.css";

#pinyougou {
  width: 100%;
  height: 100%;
}
</style>
