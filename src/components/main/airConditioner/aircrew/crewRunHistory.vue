<template>
    <div id="crewRunHistory">
        <div class="crewRunHistory">
            <div class="search">
                <span>设备列表</span>
                <el-select v-model="device" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in deviceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="spans">选择时间</span>
                <el-date-picker v-model="time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <el-button size="small" type="primary" icon="el-icon-search" class="btn" @click="search">搜索</el-button>
            </div>
            <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
            <div v-if="isShowEcharts">
                <div class="echarts" ref="Echarts" v-loading="loading"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            device: '',
            deviceList: [],
            time: [],
            loading: true,
            startTime: '',
            endTime: '',
            buildingId: '',
            dataType: '',
            deviceId: '',
            Xvalue: [],
            dataValue: [],
            isShowEcharts: true,
            monad1: '',
            systemId: '',
            subsystemId: ''
        }
    },
    methods:{
        init() {
            let myChart = this.$echarts.init(this.$refs.Echarts);
            let option = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c}" + this.monad1
               },
               title:{
                  text: '历史数据',
                  left: 'center'
               },
               grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '3%',
                   containLabel: true
               },
               color: '#8EF6D2',
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: this.Xvalue
               },
               yAxis: {
                   type: 'value',
                   name: this.monad1
               },
               dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 1,
                        end: 100,
                        showDetail: true
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                        start: 1,
                        end: 100,
                        showDetail: true
                    }
                ],
               series: [
                   {
                       name:'时间段历史数据',
                       type:'line',
                       stack: '总量',
                       areaStyle: {
                           color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                               colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                               global: false
                           }
                       },
                       data: this.dataValue
                   }
               ]
            }
            myChart.setOption(option);
        },
        // 设备列表
        devideList() {
            let data = {
                buildingId: this.buildingId,
                systemId: this.systemId,
                subsystemId: this.subsystemId
            };
            this.$axios.post(`BMPlatServers/conditioner/queryHistoryDeviceList`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.deviceList = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        let list = res.data.result.list;
                        res.data.result.list.forEach((item)=>{
                            this.deviceList.push({label: item.dataName, value: `${item.dataType},${item.deviceId},${item.buildingId},${item.unit}`});
                        });
                        this.device = list[0].dataType +','+ list[0].deviceId +','+ list[0].buildingId + ',' + list[0].unit;
                        this.monad1 = list[0].unit;
                        this.initData(this.buildingId, list[0].dataType, list[0].deviceId, this.startTime, this.endTime);
                    }
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 初始化数据
        initData(buildingId, dataType, deviceId, startTime, endTime) {
            this.isShowEcharts = true;
            let data = {
                buildingId,
                dataType: dataType,
                deviceId: deviceId,
                startTime: startTime,
                endTime: endTime,
            };
            this.$axios.post(`BMPlatServers/conditioner/queryPeriodTimeData`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.Xvalue = [];
                    this.dataValue = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.Xvalue.push(item.time);
                            this.dataValue.push(item.consume);
                        })
                    }else{
                        this.isShowEcharts = false;
                    }
                    this.init();
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        search() {
            if(!this.device) {
                this.$notify({
                    title: '警告',
                    message: '请选择设备列表',
                    type: 'warning',
                    duration: 2000
                });
                return
            };
            if(!this.endTime) {
                this.$notify({
                    title: '警告',
                    message: '请选择时间',
                    type: 'warning',
                    duration: 2000
                });
                return
            };
            this.loading = true;
            this.initData(this.buildingId, this.dataType, this.deviceId, this.startTime, this.endTime);
        }
    },
    mounted() {
        let end = new Date(new Date().getTime());
        let start = new Date(new Date().getTime() - 48*60*60*1000);
        let startYear = start.getFullYear();
        let startMonth = start.getMonth() + 1;
        let startDate = start.getDate();
        let startHours = start.getHours();
        let startMinutes = start.getMinutes();
        let startSeconds = start.getSeconds();
        let endYear = end.getFullYear();
        let endMonth = end.getMonth() + 1;
        let endDate = end.getDate();
        let endHours = end.getHours();
        let endMinutes = end.getMinutes();
        let endSeconds = end.getSeconds();
        this.startTime = `${startYear}-${startMonth}-${startDate} ${startHours}:${startMinutes}:${startSeconds}`;
        this.endTime = `${endYear}-${endMonth}-${endDate} ${endHours}:${endMinutes}:${endSeconds}`;
        this.time = [];
        this.time.push(this.startTime);
        this.time.push(this.endTime);
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.devideList();
    },
    watch: {
        time(item) {
            if(item && item.length) {
                let startTime = item[0];
                let endTime = item[1];
                if(new Date(endTime).getTime() - new Date(startTime).getTime() >= 72*60*60*1000) {
                    this.$notify.warning({
                        title: '警告',
                        message: '填写的时间不能超过三天',
                        duration: 2000
                    })
                    this.time = [];
                    this.startTime = '';
                    this.endTime = '';
                }else{
                    this.startTime = item[0];
                    this.endTime = item[1];
                }
            }else{
                this.startTime = '';
                this.endTime = '';
            }
        },
        device(item) {
            if(item) {
                this.dataType = item.split(',')[0];
                this.deviceId = item.split(',')[1];
                this.buildingId = item.split(',')[2];
                this.monad1 = item.split(',')[3];
            }else{
                this.dataType = '';
                this.deviceId = '';
                this.buildingId = '';
            }
        },
        $route(to, from) {
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
        }
    }
}
</script>

<style lang="scss" scoped>
#crewRunHistory{
    .crewRunHistory{
        .search{
            .spans{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
        }
        .echarts{
            width: 100%;
            height: 400px;
            margin-top: 20px;
        }
    }
}
</style>
