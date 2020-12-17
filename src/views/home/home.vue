<template>
  <div>
    <h1 class="title" >科学数据安全审计系统管理平台</h1>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="6" style="height: 120px; padding-bottom: 10px">
        <infor-card shadow color="#E46CBB" icon="md-chatbubbles" :icon-size="36">
          <count-to :end="sjNum.submitUser1" count-class="count-style" />
          <p>生产者数据审计</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" style="height: 120px; padding-bottom: 10px">
        <infor-card shadow color="#2db7f5" icon="ios-aperture" :icon-size="36">
          <count-to :end="sjNum.submitUser2" count-class="count-style" />
          <p>管理者数据审计</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" style="height: 120px; padding-bottom: 10px">
        <infor-card shadow color="#19be6b" icon="ios-apps-outline" :icon-size="36">
          <count-to :end="sjNum.submitUser3" count-class="count-style" />
          <p>使用者数据审计</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" style="height: 120px; padding-bottom: 10px">
        <infor-card shadow color="#ff9900" icon="md-attach" :icon-size="36">
          <count-to :end="sjNum.submitUser4" count-class="count-style" />
          <p>采集过程数据审计</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" style="height: 120px; padding-bottom: 10px">
        <infor-card shadow color="#2b85e4" icon="md-bookmark" :icon-size="36">
          <count-to :end="sjNum.submitUser5" count-class="count-style" />
          <p>汇交过程数据审计</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" style="height: 120px; padding-bottom: 10px">
        <infor-card shadow color="#17233d" icon="md-body" :icon-size="36">
          <count-to :end="sjNum.submitUser6" count-class="count-style" />
          <p>保存数据审计</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" style="height: 120px; padding-bottom: 10px">
        <infor-card shadow color="#9A66E4" icon="md-chatboxes" :icon-size="36">
          <count-to :end="sjNum.submitUser7" count-class="count-style" />
          <p>共享过程数据审计</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" style="height: 120px; padding-bottom: 10px">
        <infor-card shadow color="#dcdee2" icon="md-card" :icon-size="36">
          <count-to :end="sjNum.submitUser8" count-class="count-style" />
          <p>利用过程数据审计</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px">
      <i-col :md="24" :lg="16" style="margin-bottom: 20px">
        <Card shadow>
          <chart-bar
            style="height: 300px"
            :value="barData"
            text="近七日登记审计数量变化图"
          />
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px">
        <Card shadow>
          <chart-pie style="height: 300px" :value="pieData" text="合格率"></chart-pie>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <Table border :columns="columns" :data="tableData" style="margin-bottom: 50px" :loading="loading">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="showDetail(row)"
              >查看详情</Button
            >
          </template>
        </Table>

        <Page
          :current="count"
          :total="total"
          :page-size="pageNum"
          size="small"
          show-elevator
          show-sizer
          @on-change="onChange"
          @on-page-size-change="onPageSizeChange"
        />
      </Card>
    </Row>
    <Modal
      v-model="modalshow"
      title="审计详情页"
      @on-ok="ok"
      @on-cancel="cancel"
      width="1000px"
    >
      <div class="page">
        <div class="container">
          <h2>用户:{{ user.loginUser }}</h2>
          <h2>时间:{{ user.submitTime }}</h2>
          <h2>角色:{{ user.submitUser }}</h2>
          <h2>上传数据名称:{{ user.fileName }}</h2>
        </div>
        <Table :columns="columns1" :data="detailData" >
          <template slot-scope="{ row }" slot="remark">
            <i-switch
              v-model="row.remark"
              size="large"
              true-color="#13ce66"
              false-color="#ff4949"
              :true-value="1"
              :false-value="0"
              @on-change="changePass(row)"
            >
              <span slot="open">合格</span> <span slot="close">错误</span>
            </i-switch>
          </template>
        </Table>
      </div>
    </Modal>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";

import { ChartPie, ChartBar } from "_c/charts";
import {
  totalSize,
  totalSjNum,
  totalPassRate,
  totalWeekSjNum,
  sjMsj,
  auditorList,
  sjDetailOpion,
  sendMail
} from "@/api/service/identity";
export default {
  name: "home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
  },
  data() {
    return {
      loading:false,//表格是否加载中
      user: {},//查看详情用户信息
      sjNum: {
        submitUser1: 0,
        submitUser2: 0,
        submitUser3: 0,
        submitUser4: 0,
        submitUser5: 0,
        submitUser6: 0,
        submitUser7: 0,
        submitUser8: 0,
      }, //审计数
      pieData: [],//饼状图数据
      barData: {},//柱状图数据
      columns: [
        {
          title: "id",
          key: "id",
        },
        {
          title: "用户",
          key: "loginUser",
        },
        {
          title: "时间",
          key: "submitTime",
        },
        {
          title: "角色",
          key: "submitUser",
        },
        {
          title: "上传数据名称",
          key: "fileName",
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      columns1: [
        {
          title: "问题",
          key: "question",
        },
        {
          title: "答案",
          key: "answer",
          align: "center",
        },
        {
          title: "是否合格",
          slot: "remark",
          align: "center",
        },
      ],
      tableData: [],  //表格
      detailData: [], //下探页
      count: 1, //页码
      pageNum: 10, //每页条数
      total: 0, //表格数据总条数
      modalshow: false, //控制下探页显示
    };
  },
  watch: {
    "user.id": {
      handler: function () {
        this.getTableData();
      },

      immediate: true,
    },
  },
  mounted() {
    this.getTotalPassRate();
    this.getTotalSize();
    this.getTotalSjNum();
    this.getTotalWeekSjNum();
    this.getAuditorList(this.count, this.pageNum);
    this.getTableData();
  },
  methods: {
    changePass(row) {
      this.detailData.forEach((v, i) => {
        if (v.id == row.id) {
          this.detailData[i].remark = row.remark;
        }
      });
    },
    //分页
    onChange(cur) {
      this.count = cur;
      this.getAuditorList(this.count, this.pageNum);
    },
    onPageSizeChange(pageSize) {
      this.pageNum = pageSize;
      this.getAuditorList(this.count, this.pageNum);
    },
    showDetail(row) {
      this.modalshow = true;
      this.user = row;
    },
    //数据总量
    getTotalSize() {
      totalSize().then((res) => {
        if (res.data.message == "请求成功") {
          //sjNum.sjtotalSize = res.data.data
        }
      });
    },
    //饼图
    getTotalPassRate() {
      totalPassRate().then((res) => {
        if (res.data.message == "请求成功") {
          this.pieData.push({ value: res.data.data.passNum, name: "合格" });
          this.pieData.push({ value: res.data.data.otherNum, name: "其它" });
        }
      });
    },
    //条形图
    getTotalWeekSjNum() {
      const _this = this;
      totalWeekSjNum().then((res) => {
        if (res.data.message == "请求成功") {
          const allData = res.data.data.reverse(); //反序
          allData.forEach((i) => {
            const key = i.timeOrder;
            const value = i.total;
            _this.$set(_this.barData, key, value);
          });
        }
      });
    },
    // 审计员查看答题情况
    getAuditorList(count, pageNum) {
      let data = { submitUser: "" };
      this.loading =true
      sjMsj(count, pageNum, data).then((res) => {
        if (res.data.message === "审计员查看答题情况") {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        }
      });
      this.loading=false
    },
    //今日审计数目
    getTotalSjNum() {
      totalSjNum().then((res) => {
        if (res.data.message == "请求成功") {
          const data = res.data.data;
          data.forEach((i) => {
            switch (i.submitUser) {
              case "生产者数据审计":
                this.sjNum.submitUser1 = i.total || 0;
                break;
              case "管理者数据审计":
                this.sjNum.submitUser2 = i.total || 0;
                break;
              case "使用者数据审计":
                this.sjNum.submitUser3 = i.total || 0;
                break;
              case "汇交过程数据审计":
                this.sjNum.submitUser4 = i.total || 0;
                break;
              case "采集过程数据审计":
                this.sjNum.submitUser5 = i.total || 0;
                break;
              case "保存过程数据审计":
                this.sjNum.submitUser6 = i.total || 0;
                break;
              case "共享过程数据审计":
                this.sjNum.submitUser7 = i.total || 0;
                break;
              case "利用过程数据审计":
                this.sjNum.submitUser8 = i.total || 0;
                break;
              default:
                break;
            }
          });
        }
      });
    },
    //下探页数据
    getTableData() {
      //获取数据前先清空
      this.detailData = [];
      if (this.user.id) {
        const params = { id: this.user.id, submitUser: this.user.submitUser };
        auditorList(params).then((res) => {
          if (res.data.message == "审计员查看答题情况") {
            this.detailData = res.data.data;
          }
        });
      }
    },
    //审计是否合格
    ok() {
      let data = [];
      const params = this.user.submitUser;
      this.detailData.forEach((i) => {
        data.push({
          id: i.id,
          userId: i.userId,
          remark: i.remark,
        });
      });
      sjDetailOpion(params, data).then((res) => {
         if(res.data.message=="请求成功"){
           this.$Message.success("修改成功");
           const userId = {userId:data[0].userId}
           //修改成功后给提交者发送一封邮件
           sendMail(userId).then(res =>{})
         }else{
            this.$Message.info("修改失败，请稍候重试");
         }
      });
    },
  },
};
</script>

<style lang="less">
.title{
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 48px;
    
}
.count-style {
  font-size: 50px;
}
.container {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-evenly;
}
.ivu-modal {
  width: 50vw !important;
  .ivu-modal-content {
    width: 50vw !important;
    height: 80vh;
  }
}
</style>
