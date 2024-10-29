<template>
    <div class="container">
        <div class="header">
            <van-icon name="arrow-left" @click="goBack" class="header-left" size="30" />
            订单详情
        </div>
        <StatusBar :item="colorMap[active.trade_state]"/>
        <div class="tips">
            <div class="dzf" v-if="active.trade_state === '待支付'">
                <div class="text1">订单待支付</div>
                <div class="text2">
                    请在
                    <Counter :second="timer"></Counter>
                    内完成支付，否则订单将自动取消。
                </div>
                <div class="text3">
                    <van-button type="success" @click="showCode=true">立即支付</van-button>
                </div>
            </div>
            <div class="dzf" v-if="active.trade_state === '待服务'">
                <div class="text1">正在为您按排服专员...</div>
                <div class="text2">
                    请保持手机畅通，稍后将有服务专员与您联系。
                </div>
            </div>
            <div class="dzf" v-if="active.trade_state === '已完成'">
                <div class="text1">服务已完成</div>
                <div class="text2">
                    感谢您的使用，期待您的下次光临。
                </div>
            </div>
            <div class="dzf" v-if="active.trade_state === '已取消'">
                <div class="text1">订单已取消</div>
                <div class="text2">
                    您的订单已取消，如需帮助可咨询客服。
                </div>
            </div>
        </div>
        <van-cell-group class="card">
          <div class="header-text">预约信息</div>
          <van-cell v-for="(item,key) in makeInfo" :key="key" :title="item" :value="formatData(key)"></van-cell>
        </van-cell-group>
        <van-cell-group class="card">
          <div class="header-text">订单信息</div>
          <van-cell v-for="(item,key) in orderInfo" :key="key" :title="item" :value="formatData(key)"></van-cell>
        </van-cell-group>
        <!-- 支付弹窗 -->
        <van-dialog v-model:show="showCode"  :show-confirm-button="false" >
          <van-icon name="cross" class="close" @click="closeCode"></van-icon>
          <div>微信支付</div>
          <van-image width="150" height="150" :src="codeImg"></van-image>
          <div>请使用本人微信扫描二维码</div>
        </van-dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted,reactive,computed } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import StatusBar from '../../components/statusBar.vue'
import Counter from '../../components/counter.vue'
import Qrcode from 'qrcode'

const router = useRouter()
const route = useRoute()
const colorMap = {
    "待支付": 10,
    "待服务": 20,
    "已完成": 30,
    "已取消": 40
}

//订单详情
const makeInfo = {
  service_name: '预约服务',
  hospital_name: '就诊医院',
  starttime:'期望就诊时间',
  'client.name': '就诊人',
  'client.mobile': '就诊人电话',
  receiveAddress:'接送地址',
  demand:'其他需求'
}
const orderInfo = {
  tel:'就诊人电话',
  order_start_time:'下单时间',
  price:'应付金额',
  out_trade_no:'订单编号',
}
const formatData = (key) => {
  if (key.indexOf(".") === -1) {
    if (key === "order_start_time") {
      return formatTimestamp(active[key]);
    }
    return active[key];
  }
  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  },active );
  return arr;
}
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
const active = reactive({})

//计算倒计时
const timer = computed(() => {
    if (active.order_start_time) {
        return active.order_start_time + 7200000 - Date.now()
    }
})
const { proxy } = getCurrentInstance()
onMounted(async () => {
    // console.log(route.query.oid);
    
    const res = await proxy.$api.orderDetail({oid:route.query.oid})
    // console.log(res.data)
    Object.assign(active, res.data.data)
    Qrcode.toDataURL(active.code_url).then((url) => {
    codeImg.value = url
  })
})


const goBack = () => {
    router.go(-1)
}

//支付弹窗
const showCode = ref(false)
const closeCode = () => {
  router.push('/order')
  showCode.value = false
}

const codeImg = ref('')


</script>

<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
  }
  .header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
    .header-left {
      float: left;
    }
  }
  .card {
    margin: 15px 0;
    padding: 10px;
    .header-text {
      padding-left: 5px;
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;
      border-left: 4px solid red;
    }
  }
  .dzf {
    padding: 20px;
    .text1 {
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
      color: #666;
    }
    .text2 {
      font-size: 14px;
      color: #666;
    }
    .text3 {
      text-align: center;
      .van-button {
        margin-top: 10px;
        margin-left: 10px;
        width: 80%;
        font-weight: bold;
      }
    }
  }
  ::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;
    .close {
      position: absolute;
      left: 20px;
    }
  }
</style>

