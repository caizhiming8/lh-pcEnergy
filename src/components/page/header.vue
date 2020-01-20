<template>
  <div id="header" v-loading="get_systemOutLoading">
    <div class="header">
      <div class="left">
        <img src="../../../static/img/1572416983.jpg">
        <span>济南中西医结合医院</span>
      </div>
      <div class="right">
        <div class="info">
          <img src="../../../static/img/info_nor.png" class="imgInfo">
          <span class="infoSpan">消息</span>
          <i class="i">0</i>
          <img src="../../../static/img/notice_nor.png" class="imgNotify">
          <p class="giveInfo">通知</p>
        </div>
        <div class="alert">
          <img src="../../../static/img/notice_set.png" v-if="allNum==0" class="img1">
          <img src="../../../static/img/gaojing_set.gif" v-if="allNum!=0" class="img1">

          <el-dropdown @command="alertCommand" trigger="click">
            <span class="el-dropdown-link">告警</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="items.systemId" v-for="(items, index) in list" :key="Math.random()">{{items.systemName}}
                <b style="color:red;">({{items.num}})</b> </el-dropdown-item>
            </el-dropdown-menu>
            <b class="b2">{{allNum}}</b>
          </el-dropdown>

        </div>
        <img src="../../../static/img/touxiang.jpg" class="imgzhong">
        <div class="dropDown">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">修改密码</el-dropdown-item>
              <el-dropdown-item command="b" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="left" ref="mainLeft">
        <div id="slider">
          <el-menu class="el-menu-vertical-demo" :collapse="collapse" :default-active="onRoutes" background-color="rgba(0,0,0,0)"
            text-color="#fff" active-text-color="#409eff" unique-opened @select="handleSelect" :default-openeds="defaultOpens"
            router>
            <el-menu-item index="index">
              <i class="iconfont icon-shouye" style="color:#fff;margin-right: 5px;"></i>首页
            </el-menu-item>
            <el-menu-item index="energyTolte">
              <i class="iconfont icon-jieneng" style="color:#fff;margin-right: 5px;"></i>能源汇总
            </el-menu-item>
            <!-- <el-menu-item index="energyConservationAssessment">
              <i class="iconfont icon-rfq" style="color:#fff;margin-right: 5px;"></i>节能考核
            </el-menu-item> -->
            <el-submenu index="1" v-hasMenu="1">
              <template slot="title">
                <i class="iconfont icon-gongdiansuo" style="color: #fff;"></i>
                <span>供电系统</span>
              </template>
              <el-menu-item index="powerIndex">供电首页</el-menu-item>
              <el-submenu index="1-1" v-hasMenu="1-1">
                <span slot="title">医院用电</span>
                <el-menu-item index="EnergySchool" v-hasMenu="1-1-1">能耗查询</el-menu-item>
                <el-menu-item index="consumption" v-hasMenu="1-1-2">能效查询</el-menu-item>
              </el-submenu>

              <el-submenu index="1-2" v-hasMenu="1-2">
                <span slot="title">楼宇用电</span>
                <el-menu-item v-for="(item, index) in items" :key="index+'qwertgb'" :index="'buildingPower?buildingId='+item.Id">{{item.name}}</el-menu-item>
              </el-submenu>

              <el-submenu index="1-3" v-hasMenu="1-3">
                <span slot="title">子系统用电</span>
                <el-menu-item v-hasMenu="1-3-1" v-for="(item, index) in dataList" :index="'totalSubsystemPower?subClassId='+item.id"
                  :key="index+'cvfdghn'">{{item.name}}</el-menu-item>

                <el-menu-item index="lamp">灯控系统</el-menu-item>
              </el-submenu>

              <!-- <el-menu-item index="equipmentManagement" v-hasMenu="1-4">采集设备管理</el-menu-item> -->
              <el-submenu index="1-4" v-hasMenu="1-4">
                <span slot="title">设备状态</span>
                <el-menu-item index="equipmentManagement" v-hasMenu="1-4-1">采集器状态</el-menu-item>
                <el-menu-item index="powerState" v-hasMenu="1-4-2">电表状态</el-menu-item>
                <el-menu-item index="meterReadValue" v-hasMenu="1-4-3">实时抄表值</el-menu-item>
                <el-menu-item index="powerCharge" v-hasMenu="1-4-4">电费</el-menu-item>
              </el-submenu>

              <el-submenu index="1-5" v-hasMenu="1-5">
                <span slot="title">告警管理</span>
                <el-menu-item index="alertManagement">实时告警</el-menu-item>
                <el-menu-item index="alertManagementHistory">历史告警</el-menu-item>
                <el-menu-item index="alertManagementSetting">告警设定</el-menu-item>
              </el-submenu>

              <el-menu-item index="manualEntry" v-hasMenu="1-6">人工录入</el-menu-item>
            </el-submenu>


            <el-submenu index="2" v-hasMenu="2">
              <template slot="title">
                <i class="iconfont icon-gongshui" style="color: #fff;"></i>
                <span>供水系统</span>
              </template>
              <el-menu-item index="WaterIndex">供水首页</el-menu-item>
              <el-submenu index="2-2" v-hasMenu="2-2">
                <span slot="title">能耗分析</span>
                <el-menu-item index="watersSchool" v-hasMenu="2-2-1">医院能耗</el-menu-item>
                <el-menu-item index="waterTower" v-hasMenu="2-2-2">楼宇能耗</el-menu-item>
                <el-menu-item index="waterEfficiency" v-hasMenu="2-2-3">能效查询</el-menu-item>
              </el-submenu>

              <el-submenu index="2-5" v-hasMenu="2-5">
                <span slot="title">流量分析</span>
                <el-menu-item index="DMA" v-hasMenu="2-5-1">DMA分区</el-menu-item>
                <el-menu-item index="nightFlow" v-hasMenu="2-5-2">夜间小流量</el-menu-item>
              </el-submenu>

              <el-submenu index="2-3" v-hasMenu="2-3">
                <span slot="title">告警管理</span>
                <el-menu-item index="realAlarm" v-hasMenu="2-3-1">实时告警</el-menu-item>
                <el-menu-item index="historyAlarm" v-hasMenu="2-3-2">历史告警</el-menu-item>
                <el-menu-item index="alarmSetting" v-hasMenu="2-3-3">告警设定</el-menu-item>
              </el-submenu>

              <el-submenu index="2-4" v-hasMenu="2-4">
                <span slot="title">设备状态</span>
                <el-menu-item index="NBWaterMeter" v-hasMenu="2-4-1">NB水表</el-menu-item>
                <el-menu-item index="inWaterMeter" v-hasMenu="2-4-2">集采水表</el-menu-item>
                <el-menu-item index="waterMeterValue" v-hasMenu="2-4-3">实时抄表值</el-menu-item>
                <el-menu-item index="waterCharge" v-hasMenu="2-4-4">水费</el-menu-item>
              </el-submenu>
            </el-submenu>

            <el-submenu index="3" v-hasMenu="3">
              <template slot="title">
                <i class="iconfont icon-gongnuan" style="color: #fff;"></i>
                <span>集中供暖</span>
              </template>
              <el-menu-item index="hotIndex">暖通首页</el-menu-item>
              <el-submenu index="3-2" v-hasMenu="3-2">
                <template slot="title">
                  <span>热源系统</span>
                </template>
                <!-- 锅炉系统，后台暂无数据，暂时保留 -->
                <!-- <el-menu-item :index="index+'www'" v-for="(item, index) in hotList1.children" :key="index+'zzz'">
                                        <router-link tag="div" :to="{path:'/heatSource', query: {id: item.systemId+','+item.subsystemId+','+item.id}}">{{item.label}}</router-link>
                                    </el-menu-item> -->
                <el-menu-item :index="'heatSourceSystem?id='+item.systemId+','+item.subsystemId+','+item.id" v-for="(item, index) in hotList2.children"
                  :key="index+'zzzdsfs'">{{item.label}}</el-menu-item>
              </el-submenu>

              <el-submenu index="3-3" v-hasMenu="3-3">
                <template slot="title">
                  <span>换热站</span>
                </template>
                <el-menu-item v-hasMenu="3-3-1" :index="'heatTransfer?id='+item.systemId+','+item.subsystemId+','+item.id"
                  v-for="(item, index) in hotList3.children" :key="index+'qqq'">{{item.label}}</el-menu-item>
              </el-submenu>

              <el-submenu index="3-4" v-hasMenu="3-4">
                <template slot="title">
                  <span>楼宇系统</span>
                </template>
                <el-menu-item :index="'buildingCompare?id='+item.systemId+','+item.subsystemId" v-hasMenu="3-4-1" v-for="(item,index) in hotList5"
                  :key="index+'qqqqq'">楼宇对比</el-menu-item>
                <el-menu-item :index="'buildingHeat?id='+item.systemId+','+item.subsystemId+','+item.id" v-hasMenu="3-4-2"
                  v-for="(item, index) in hotList4.children" :key="index+'qqqq'">{{item.label}}</el-menu-item>
              </el-submenu>

              <el-submenu index="3-5" v-hasMenu="3-5">
                <template slot="title">
                  <span>供热管网</span>
                </template>
                <el-menu-item index="heatSupplyNetworkControl" key="88" v-hasMenu="3-5-1">运行监控</el-menu-item>
                <el-menu-item index="heatSupplyNetworkUllage" key="883" v-hasMenu="3-5-2">漏损监控</el-menu-item>
                <el-menu-item index="heatSupplyNetworkBalance" key="884" v-hasMenu="3-5-3">管网平衡</el-menu-item>
              </el-submenu>

              <el-submenu index="3-6" v-hasMenu="3-6">
                <template slot="title">
                  <span>告警管理</span>
                </template>
                <el-menu-item index="hotReal">实时告警</el-menu-item>
                <el-menu-item index="hotHitsory">历史告警</el-menu-item>
                <el-menu-item index="makeHot">告警设定</el-menu-item>
              </el-submenu>
            </el-submenu>

            <el-submenu index='5' v-hasMenu="5">
              <template slot="title">
                <i class="iconfont icon-kongtiao" style="color: #fff; font-size: 12px;"></i>
                <span>中央空调</span>
              </template>
              <el-submenu index="5-1" v-hasMenu="5-1">
                <template slot="title">
                  <span>中央空调机组</span>
                </template>
                <el-menu-item :index="'aircrew?id='+item.systemId+','+item.subsystemId+','+item.buildingId" :key="`5-1-${index}`"
                  v-for="(item, index) in DataList">{{item.buildingName}}</el-menu-item>
              </el-submenu>
              <el-submenu index="5-2" v-hasMenu="5-2">
                <template slot="title">
                  <span>楼宇系统</span>
                </template>
                <el-menu-item :index="'buildingList?id='+item.systemId+','+item.subsystemId+','+item.buildingId" v-for="(item, index) in Datalist"
                  :key="index">{{item.buildingName}}</el-menu-item>
              </el-submenu>
              <el-submenu index="5-3" v-hasMenu="5-3">
                <template slot="title">
                  <span>告警管理</span>
                </template>
                <el-menu-item index="airReal" v-hasMenu="5-3-1">实时告警</el-menu-item>
                <el-menu-item index="airHistory" v-hasMenu="5-3-2">历史告警</el-menu-item>
                <el-menu-item index="airAlert" v-hasMenu="5-3-3">告警设定</el-menu-item>
              </el-submenu>
            </el-submenu>

            <el-submenu index='4' v-hasMenu="4">
              <template slot="title">
                <i class="iconfont icon-shebeiguanli" style="color: #fff;"></i>
                <span>设备管理</span>
              </template>
              <el-menu-item index="DeviceQuery" v-hasMenu="4-1">设备档案</el-menu-item>
              <el-menu-item index="equipmentInspection" v-hasMenu="4-2">设备巡检</el-menu-item>
            </el-submenu>
            <el-submenu index='6' v-hasMenu="6">
              <template slot="title">
                <i class="iconfont icon-eduguanli" style="color:#fff;"></i>
                <span>能耗定额</span>
              </template>
              <el-submenu index="6-1" v-hasMenu="6-1">
                <span slot="title">定额能耗分析</span>
                <el-menu-item index="efficiencyContrast" v-hasMenu="6-1-1">能效对比</el-menu-item>
                <el-submenu index="6-1-2" v-hasMenu="6-1-2">
                  <span slot="title">二级单位</span>
                  <el-submenu v-for="(item, index) in schoolData" :key="`6-1-2-${index}`" :index="`6-1-2-${index}`">
                    <span slot="title">{{item.groupname}}</span>
                    <el-menu-item v-for="(item, indexs) in item.chilList" :key="`6-1-2-${index}-${indexs}`" :index="'Analysis?schoolId='+item.Id">{{item.name}}</el-menu-item>
                  </el-submenu>
                </el-submenu>
              </el-submenu>
              <el-submenu index="6-2" v-hasMenu="6-2">
                <span slot="title">定额管理</span>
                <el-menu-item index="contrast" v-hasMenu="6-2-1">定额审批</el-menu-item>
                <el-submenu index="6-2-2" v-hasMenu="6-2-2">
                  <span slot="title">二级单位</span>
                  <el-submenu v-for="(item, index) in schoolData" :key="`6-2-2-${index}`" :index="`6-2-2-${index}`">
                    <span slot="title">{{item.groupname}}</span>
                    <el-menu-item v-for="(item, indexs) in item.chilList" :key="`6-2-2-${index}-${indexs}`" :index="'quotaAllocation?schoolId='+item.Id">{{item.name}}</el-menu-item>
                  </el-submenu>
                </el-submenu>
              </el-submenu>
              <el-submenu index="6-3" v-hasMenu="6-3">
                <span slot="title">定额考核</span>
                <el-menu-item index="assessmentQuota" v-hasMenu="6-3-1">定额考核对比</el-menu-item>
                <el-submenu index="6-3-2" v-hasMenu="6-3-2">
                  <span slot="title">二级单位</span>
                  <el-submenu v-for="(item, index) in schoolData" :key="`6-3-2-${index}`" :index="`6-3-2-${index}`">
                    <span slot="title">{{item.groupname}}</span>
                    <el-menu-item v-for="(item, indexs) in item.chilList" :key="`6-3-2-${index}-${indexs}`" :index="'examine?schoolId='+item.Id">{{item.name}}</el-menu-item>
                  </el-submenu>
                </el-submenu>
              </el-submenu>
            </el-submenu>

            <el-submenu index="7" v-hasMenu="7">
              <template slot="title">
                <i class="iconfont icon-baoxiu" style="color:#fff;"></i>
                <span>报修管理</span>
              </template>
              <el-menu-item index="realRepair" v-hasMenu="7-1">报修列表</el-menu-item>
              <el-menu-item index="processReapir" v-hasMenu="7-2">工单管理</el-menu-item>
              <el-menu-item index="analyze" v-hasMenu="7-3">统计分析</el-menu-item>
              <el-menu-item index="MaintenancePersonnel" v-hasMenu="7-4">维修人员维护</el-menu-item>
            </el-submenu>

            <el-submenu index="8" v-hasMenu="8">
              <template slot="title">
                <i class="iconfont icon-icon" style="color:#fff;"></i>
                <span>商业用能</span>
              </template>
              <el-menu-item index="Generon" v-hasMenu="8-1">能耗查询</el-menu-item>
              <el-menu-item index="recharge" v-hasMenu="8-2">充值管理</el-menu-item>
              <el-menu-item index="tenant" v-hasMenu="8-3">商户管理</el-menu-item>
            </el-submenu>
            <el-submenu index="10" v-hasMenu="10">
              <template slot="title">
                <i class="iconfont icon-report" style="color:#fff;"></i>
                <span>报表管理</span>
              </template>
              <el-menu-item index="statementlist" v-hasMenu="10-1">报表下载</el-menu-item>
            </el-submenu>
            <el-submenu index="9" v-hasMenu="9">
              <template slot="title">
                <i class="iconfont icon-xitongguanli" style="color:#fff;"></i>
                <span>系统管理</span>
              </template>
              <el-menu-item index="User" v-hasMenu="9-1">用户管理</el-menu-item>
              <el-menu-item index="role" v-hasMenu="9-2">角色管理</el-menu-item>
              <el-submenu index="9-3" v-hasMenu="9-3">
                <template slot="title">
                  <span>系统配置</span>
                </template>
                <el-menu-item index="authority" v-hasMenu="9-3-1">楼宇配置</el-menu-item>
                <el-menu-item index="department" v-hasMenu="9-3-2">房间管理</el-menu-item>
                <el-menu-item index="jobs" v-hasMenu="9-3-3">单位管理</el-menu-item>
                <el-menu-item index="configurationCycle" v-hasMenu="9-3-4">周期配置</el-menu-item>
                <el-menu-item index="configurationMeter" v-hasMenu="9-3-5">公共能耗配置</el-menu-item>
                <el-menu-item index="configurationCollector" v-hasMenu="9-3-6">采集器配置</el-menu-item>
                <el-menu-item index="configurationPower" v-hasMenu="9-3-7">电表配置</el-menu-item>
                <el-menu-item index="configurationWater" v-hasMenu="9-3-8">水表配置</el-menu-item>
                <el-menu-item index="configurationWaterArea" v-hasMenu="9-3-9">水表分区配置</el-menu-item>
                <el-menu-item index="configurationWarm" v-hasMenu="9-3-10">暖通分区配置</el-menu-item>
              </el-submenu>
              <el-menu-item index="pagemenucontrol" v-hasMenu="9-5">页面管理</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
      <div class="right" ref="mainRight">
        <!-- <transition name="el-fade-in-linear"> -->
        <router-view style="overflow: auto;"></router-view>
        <!-- </transition> -->
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="control_modelShow" width="30%">
      <el-form :model="req_Data" :rules="add_roleRules" ref="ruleForm" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="req_Data.oldPassword" placeholder="请输入原密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="req_Data.password" placeholder="请输入新密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="req_Data.password2" placeholder="请确认密码" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="control_modelShow = false" size="small">取消</el-button>
        <el-button type="primary" :disabled="req_loading" @click="gomodifyPassword('ruleForm')" size="small">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import storage from '../../../static/js/store.js';
  import session from '../../../static/js/session.js';
  import slider from './slider.vue';
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(this.req_Data.password)) {
          callback();
        } else {
          callback(new Error('8-16个字符,至少1个大写字母,1个小写字母和1个数字,其他任意'));
        }
      };
      let validatePass1 = (rule, value, callback) => {
        value = this.req_Data.password2;
        if (value !== this.req_Data.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        userName: this.$_globalData.$_userInfo ? this.$_globalData.$_userInfo.username : "盛帆蓝海",
        sonData: [],
        control_modelShow: false,
        req_loading: false,
        req_Data: {
          uid: this.$_globalData.$_userInfo.Id,
          oldPassword: '',
          password: '',
          password2: '',
          flag: false
        },
        get_systemOutLoading: false,
        add_roleRules: {
          oldPassword: [{
            required: true,
            message: '原密码不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          },
          {
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
          password2: [{
              required: true,
              message: '确认密码不能为空',
              trigger: 'blur'
            },
            {
              required: true,
              validator: validatePass1,
              trigger: 'blur'
            }
          ]
        },
        list: [],
        allNum: 0,
        Num: 0,



        collapse: false,
        items: [],
        dataList: [],
        hotList1: [],
        hotList2: [],
        hotList3: [],
        hotList4: [],
        hotList5: [],
        onRoutes: '',
        DataList: [],
        Datalist: [],
        schoolData: [],
        collegeData: [],
        defaultOpens: [],
        apis: ''
      }
    },
    methods: {
      initWebsockit() {
        this.apis = window.location.href.split("http://")[1].split(":")[0];
        if ("WebSocket" in window) {
          var ws = new WebSocket(`ws://${this.apis}:8081/BMPlatServers/warningWebSocket`);
          // var ws = new WebSocket(`ws://192.168.0.109:8081/BMPlatServers/warningWebSocket`);
          ws.onopen = () => {

          };

          ws.onmessage = (evt) => {
            let objects = JSON.parse(evt.data)
            if (objects.list && objects.list.length) {
              this.list = objects.list;
              this.allNum = objects.all.num;
            } else {
              this.list = [];
              this.allNum = "0";
            }
          };
        } else {
          this.list = [];
          this.allNum = "0";
          this.$message.warning('您的浏览器不支持 WebSocket!');
        }
      },
      alertCommand(comment) {
        if (comment == 1) {
          this.$router.push('/realAlarm');
          this.Num = 'realAlarm';
        } else if (comment == 2) {
          this.$router.push('/alertManagement');
          this.Num = 'alertManagement';
        } else if (comment == 3) {
          this.$router.push('/hotReal');
          this.Num = 'hotReal';
        } else if (comment == 4) {
          this.$router.push('/airReal');
          this.Num = 'airReal';
        }
      },
      handleCommand(command) {
        if (command == "a") {
          // console.log('修改密码');
          this.control_modelShow = true;
          this.req_Data.oldPassword = "";
          this.req_Data.password = "";
          this.req_Data.password2 = "";
        } else if (command == "b") {
          // console.log('退出登录');
          this.get_systemOutLoading = true;
          this.$axios.post(`BMPlatServers/login/loginout`, this.$qs.stringify({
              login_name: this.$_globalData.$_userInfo.login_name
            }))
            .then((res) => {
              if (res.data.success) {
                sessionStorage.clear();
                this.$_globalData.$_flowerRouter = [];
                this.$_globalData.$_menuShowList = [];
                this.$_globalData.$_userToken = '';
                this.$router.replace({
                  path: '/login'
                });
                this.get_systemOutLoading = false;
              } else {
                this.get_systemOutLoading = false;
                this.$message.warning({
                  message: res.data.resultMessage,
                  showClose: true,
                  duration: 1000
                })
              }
            });
        }
      },
      // 修改密码
      gomodifyPassword(formName) {
        let _this = this;
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.req_loading = true;
            _this.$axios.post(`BMPlatServers/authority/resetpassword`, _this.$qs.stringify(_this.req_Data))
              .then(res => {
                _this.req_loading = false;
                if (res.data.success) {
                  _this.$refs[formName].resetFields();
                  _this.control_modelShow = false;
                } else {
                  _this.$message.warning(res.data.resultMessage);
                }
              })
              .catch(res => {
                _this.req_loading = false;
              })
          }
        });
      },





      handleSelect(key, path) {
        this.onRoutes = key;
        // 将上次用户点击的状态保存下来
        session.set('statePreservation', key);
        if (key == 'index') {
          this.defaultOpens = [0];
        }
      },
      initList() {
        this.$axios.post(`BMPlatServers/common/queryBuildings`).then((res) => {
          if (res.data.success) {
            if (res.data.result && res.data.result.length) {
              this.items = res.data.result;
              storage.set('slideData', this.items);
            }
          } else {
            this.$message.warning({
              message: res.data.resultMessage,
              duration: 1000,
              showClose: true
            })
          }
        });
        if (this.giveSonData && this.giveSonData.length) {
          this.items = this.giveSonData
        };
        // 获取子系统列表
        this.$axios.post(`BMPlatServers/electricity/querysubinfo`).then((res) => {
          // console.log(res);
          if (res.data.success) {
            this.dataList = res.data.result.systemInfo;
          } else {
            this.$message.warning({
              message: res.data.resultMessage,
              duration: 1000,
              showClose: true
            })
          }
        })
        this.$axios.post(`BMPlatServers/common/departlist`).then((res) => {
          if (res.data.result.infos && res.data.result.infos.length) {
            this.schoolData = res.data.result.infos
          }
        })
      },
      initList1() {
        // 热源系统列表
        let datas = {
          systemId: 3
        }
        this.$axios.post(`BMPlatServers/common/queryHvacTree`, this.$qs.stringify(datas)).then((res) => {
          // console.log(res);
          if (res.data.success) {
            if (res.data.result && res.data.result.length) {
              this.hotList1 = [];
              this.hotList2 = [];
              this.hotList3 = [];
              this.hotList4 = [];
              this.hotList5 = [];
              res.data.result.forEach((item) => {
                if (item.subsystemId == 1) {
                  this.hotList1 = item;
                }
                if (item.subsystemId == 2) {
                  this.hotList2 = item;
                }
                if (item.subsystemId == 3) {
                  this.hotList3 = item;
                }
                if (item.subsystemId == 4) {
                  this.hotList4 = item;
                  this.hotList5 = [];
                  this.hotList5.push(this.hotList4.children[0]); // 楼宇系统
                }
              })
            }
          } else {
            this.$message.warning({
              message: res.data.resultMessage,
              duration: 1000,
              showClose: true
            })
          }
        });

        // 空调机组列表
        let datass = {
          systemId: 4,
        }
        this.$axios.post(`BMPlatServers/conditioner/queryBuildingList`, this.$qs.stringify(datass)).then((res) => {
          console.log(res);
          if (res.data.success) {
            if (res.data.result.list1 && res.data.result.list1.length) {
              this.DataList = res.data.result.list1;
            } else {
              this.DataList = [];
            }
            if (res.data.result.list2 && res.data.result.list2.length) {
              this.Datalist = res.data.result.list2;
            } else {
              this.Datalist = [];
            }
          } else {
            this.$message.warning({
              message: res.data.resultMessage,
              duration: 1000,
              showClose: true
            })
          }
        });
      }
    },
    mounted() {
      let heightLeft = document.documentElement.clientHeight || document.body.clientHeight;
      this.$refs.mainLeft.style.height = heightLeft - 70 + "px";

      let height = document.documentElement.clientHeight || document.body.clientHeight;
      this.$refs.mainRight.style.height = height - 74 + "px";

      let slideData = storage.get('slideData');
      if (slideData && slideData.length) {
        this.sonData = slideData;
      } else {

      }
      this.initWebsockit();
      this.initList();
      this.initList1();
      if (session.get('statePreservation')) {
        this.onRoutes = '' + session.get('statePreservation');
      } else {
        this.onRoutes = 'index';
        this.defaultOpens = [0];
      }
      if(this.$_globalData.$_userInfo.iscs) {
        this.$message.warning({
          message: '您的初始密码等级太低，请进行修改',
          duration: 2000,
          showClose: true
        })
        setTimeout(()=> {
          this.control_modelShow = true;
        },2000)
      }
    },
    computed: {
      onRoutes() {
        const route = this.$route;
        const {
          meta,
          path
        } = route;
        if (meta.activeMenu) {
          return meta.activeMenu;
        }
        return path;
      },
      // 设备管理跳转到报修页面的高亮导航栏
      changeOnRoutes() {
        return this.$store.state.changeOnRoutes;
      },
      onRoutes1() {
        return this.$store.state.onRoutes1
      }
    },
    watch: {
      $route(oldData, newData) {
        if (oldData.name == 'buildingPower' && newData.path == '/powerIndex') {
          this.onRoutes = `buildingPower?buildingId=${oldData.query.buildingId}`
        }
        if (oldData.name == 'buildingPower' && newData.path == '/EnergySchool') {
          this.onRoutes = `buildingPower?buildingId=${oldData.query.buildingId}`
        }
        if (oldData.name == 'waterTower' && newData.path == '/WaterIndex') {
          this.onRoutes = `waterTower`
        }
        if (oldData.name == 'buildingHeat' && newData.path == '/hotIndex') {
          this.onRoutes = `buildingHeat?id='${oldData.query.id}'`
        }
        if (oldData.name == 'buildingHeat' && newData.name == '/heatSupplyNetworkControl') {
          this.onRoutes = `buildingHeat?id='${oldData.query.id}'`
        }
        if (oldData.name == 'heatSourceSystem' && newData.name == '/hotIndex') {
          this.onRoutes = `heatSourceSystem?id='${oldData.query.id}'`
        }
        if (oldData.name == 'heatTransfer' && newData.name == '/hotIndex') {
          this.onRoutes = `heatTransfer?id='${oldData.query.id}'`
        }
        if (oldData.name == 'heatSourceSystem' && newData.name == '/heatSupplyNetworkControl') {
          this.onRoutes = `heatSourceSystem?id='${oldData.query.id}'`
        }
        if (oldData.name == 'heatTransfer' && newData.name == '/heatSupplyNetworkControl') {
          this.onRoutes = `heatTransfer?id='${oldData.query.id}'`
        }
        if (oldData.name == 'recharge' && newData.name == 'tenantDetail') {
          this.onRoutes = 'recharge';
        }
        if (newData.path == '/implementEquipmentInspection' && oldData.name == 'processReapir') {
          this.onRoutes = 'processReapir';
        }
      },
      Num(newData) {
        this.onRoutes = newData;
      },
      // 设备管理跳转到报修页面的高亮导航栏
      changeOnRoutes(oldData, newData) {
        this.onRoutes = oldData;
      },
      onRoutes1(oldData) {
        this.onRoutes = oldData;
      }
    }
  }
</script>

<style lang="scss">
  #header {
    .header {
      overflow: hidden;
      height: 70px;
      box-shadow: 0 0 10px #d6d6d7;

      .left {
        float: left;
        overflow: hidden;
        color: #282828;

        img {
          width: 53px;
          height: 53px;
          margin: 10px 0 0 12px;
          display: block;
          float: left;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
        }

        span {
          margin-left: 18px;
          font-size: 26px;
          display: block;
          float: left;
          line-height: 70px;
        }
      }

      .right {
        float: right;
        overflow: hidden;

        .info {
          float: left;
          overflow: hidden;
          position: relative;

          .imgInfo {
            display: block;
            float: left;
            width: 25px;
            height: 25px;
            margin: 23px 0 0 0;
          }

          .infoSpan {
            display: block;
            float: left;
            font-size: 15px;
            color: #282828;
            line-height: 70px;
            margin-left: 5px;
          }

          i.i {
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #F42020;
            color: #fff;
            font-size: 13px;
            line-height: 20px;
            text-align: center;
            left: 55px;
            top: 16px;
          }

          .imgNotify {
            display: block;
            float: left;
            width: 25px;
            height: 25px;
            margin: 22px 0 0 35px;
          }

          .giveInfo {
            display: block;
            float: left;
            font-size: 15px;
            color: #282828;
            line-height: 70px;
            margin-left: 5px;
          }
        }

        .alert {
          float: left;
          position: relative;
          margin-left: 25px;

          .img1 {
            width: 30px;
            height: 30px;
            margin-top: -15px;
          }

          .el-dropdown {
            font-size: 15px;
            line-height: 70px;
            cursor: pointer;
            display: inline-block;
            color: #282828;
          }

          .b2 {
            position: absolute;
            width: 20px;
            height: 20px;
            font-size: 13px;
            line-height: 20px;
            text-align: center;
            background: #F42020;
            color: #fff;
            border-radius: 50%;
            left: 26px;
            top: 18px;
          }
        }

        img.imgzhong {
          width: 47px;
          height: 47px;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          -o-border-radius: 50%;
          border-radius: 50%;
          display: block;
          float: left;
          margin: 11px 5px 0 45px;
        }

        .dropDown {
          float: left;
          margin-right: 60px;

          .el-dropdown {
            cursor: pointer;
            font-size: 15px;
            color: #282828;
            line-height: 70px;
          }
        }
      }
    }

    .main {
      display: flex;

      .left {
        overflow-y: auto;
        overflow-x: hidden;
        background: #2F3A4C;
        scrollbar-arrow-color: #f4ae21;
        /**/
        /*三角箭头的颜色*/
        scrollbar-face-color: #333;
        /**/
        /*立体滚动条的颜色*/
        scrollbar-3dlight-color: #666;
        /**/
        /*立体滚动条亮边的颜色*/
        scrollbar-highlight-color: #666;
        /**/
        /*滚动条空白部分的颜色*/
        scrollbar-shadow-color: #999;
        /**/
        /*立体滚动条阴影的颜色*/
        scrollbar-darkshadow-color: #666;
        /**/
        /*立体滚动条强阴影的颜色*/
        scrollbar-track-color: #666;
        /**/
        /*立体滚动条背景颜色*/
        scrollbar-base-color: #f8f8f8;

        /**/
        /*滚动条的基本颜色*/
        &::-webkit-scrollbar {
          width: 0px;
        }

        #slider {
          width: 280px;

          .el-menu {
            width: 100%;

            li.el-menu-item.is-active {
              background: #505B6C !important;
              color: #fff !important;
              font-weight: 700 !important;
            }

            li.el-menu-item:hover {
              background: #505B6C !important;
            }

            .el-submenu__title:hover {
              background: #505B6C !important;
            }
          }
        }
      }

      .right {
        flex: 1;
        overflow: auto;
        margin-top: 4px;
      }
    }
  }
</style>
