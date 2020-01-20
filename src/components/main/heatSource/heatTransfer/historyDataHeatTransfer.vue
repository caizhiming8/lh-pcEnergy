<template>
    <div id="historyDataHeatTransfer">
        <div class="historyDataHeatTransfer">
            <div class="historyDataHeatTransfer-data">
                <span class="spans">历史数据</span>
                <div class="historyDataHeatTransfer-data-history">
                    <span>设备列表</span>
                    <el-select v-model="device" placeholder="请选择" clearable class="selects">
                        <el-option v-for="(item, index) in deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <b style="margin-left: 20px;">时间段查询</b>
                    <el-date-picker v-model="dateRange" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                    <el-button @click="searchT" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
                </div>
                <div class="noDatas" v-if="!isShowEcharts1">暂无数据</div>
                <div v-if="isShowEcharts1">
                    <div class="echarts" ref="EchartsT" v-loading="loadingT"></div>
                </div>
            </div>
            <div class="historyDataHeatTransfer-enegy">
                <span class="spans">历史能耗</span>
                <div class="placeBox">
                    <div class="sourcehistorydata">
            			<el-tabs @tab-click="setQuery" v-model="activeName">
            				<el-tab-pane label="热量" name="1"></el-tab-pane>
            				<el-tab-pane label="电量" name="2"></el-tab-pane>
            				<el-tab-pane label="水量" name="3"></el-tab-pane>
            			</el-tabs>
            		    <b>查询方式</b>
            		    <el-select v-model="timeValue" placeholder="请选择" clearable class="selects">
            		        <el-option v-for="(item, index) in time" :key="index" :label="item.label" :value="item.value"></el-option>
            		    </el-select>
            		    <b style="margin-left: 20px;">查询时间</b>
            		    <el-date-picker v-if="types == 1" v-model="dataTime" type="datetime" disabled placeholder="选择日期时间"></el-date-picker>
            		    <el-date-picker v-if="types == 2" v-model="dataTime" value-format="yyyy" type="year" placeholder="选择日期时间"></el-date-picker>
            		    <el-date-picker v-if="types == 3" v-model="dataTime" value-format="yyyy-MM" type="month" placeholder="选择日期时间"></el-date-picker>
            		    <el-date-picker v-if="types == 4" v-model="dataTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
            		    <el-button @click="search" style="margin-left: 40px;" size="small" type="primary" icon="el-icon-search">查询</el-button>
            		</div>
                    <div class="noDataEcharts" v-if="!isShowEcharts2">暂无数据</div>
                    <div v-if="isShowEcharts2">
                        <div class="echarts" ref="Echarts" v-loading="loading"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            timeValue: 4,
            time: [{label:"按年查询",value:1},{label:"按月查询",value:2},{label:"按日查询",value:3},{label:"按时查询",value:4}],
            types: 4,
            dataTime: '',
            loading: true,
            activeName: '1',
            systemId: '',
            subsystemId: '',
            buildingId: '',
            query: '1',
            numberValue: [],
            consumeValue: [],
            loadingT: false,
            dateRange: [],
            deviceList: [],
            device: '',
            dataType: '',
            deviceId: '',
            endTime: '',
            startTime: '',
            xAxisName: [],
            dataValue: [],
            isShowEcharts1: true,
            isShowEcharts2: true,
            monad: 'GJ',
            monad1: 'kwh'
        }
    },
    methods: {
        init1() {
            let myChartT = this.$echarts.init(this.$refs.EchartsT);
            let optionT = {
                tooltip: {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c}" + this.monad1
                },
                title: {
                    text: '历史数据',
                    left: 'center'
                },
                color: '#8EF6D2',
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
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
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.xAxisName
                },
                yAxis: {
                    type: 'value',
                    name: this.monad1
                },
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
                        data: this.dataValue,
                    }
               ]
            }
            myChartT.setOption(optionT);
        },
        init2() {
            let myChart = this.$echarts.init(this.$refs.Echarts);
            let wid = document.body.clientWidth || document.documentElement.clientWidth
            var resize = {
              width: wid - 380,
              height: 300
            };
            myChart.resize(resize);
            let option = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c}" + this.monad
               },
               title: {
                  text: '历史能耗',
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
                   data: this.numberValue
               },
               yAxis: {
                   type: 'value',
                   name: this.monad
               },
               series: [
                   {
                       name:'历史能耗',
                       type:'line',
                       stack: '总量',
                       areaStyle: {
                           color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                               colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                               global: false
                           }
                       },
                       data: this.consumeValue,
                   }
               ]
            }
            myChart.setOption(option);
        },

        // 设备列表
        deviceListData() {
            let data = {
                buildingId: this.buildingId,
                systemId: this.systemId,
                subsystemId: this.subsystemId
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryHistoryHeatDevice`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.deviceList = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.deviceList.push({label: item.dataName, value: `${item.dataType},${item.deviceId},${item.unit}`})
                        })
                        this.device = res.data.result.list[0].dataType+','+res.data.result.list[0].deviceId+','+res.data.result.list[0].unit;
                        this.deviceId = res.data.result.list[0].deviceId;
                        this.dataType = res.data.result.list[0].dataType;
                        // 单位
                        this.monad1 = res.data.result.list[0].unit;
                        this.historydata();
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

        // 历史数据时间段
        historydata() {
            this.isShowEcharts1 = true;
            if(!this.device) {
                this.$notify.warning({
                    title: '提醒',
                    message: '请选择设备',
                    duration: 2000
                })
                return false;
            }
            if(this.dateRange == null) {
                this.$notify.warning({
                    title: '提醒',
                    message: '请选择时间',
                    duration: 2000
                })
                return false;
            }
            this.loadingT = true;
            let data = {
                buildingId:this.buildingId,
                deviceId: this.deviceId,
                dataType: this.dataType,
                startTime: this.startTime,
                endTime: this.endTime
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryCityHeatRealHistory`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.xAxisName = [];
                    this.dataValue = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.xAxisName.push(item.number);
                            this.dataValue.push(item.consume);
                        })
                    }else{
                        this.isShowEcharts1 = false;
                    }
                    this.init1();
                    this.loadingT = false;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                    this.loadingT = false;
                }
            })
        },

        // 历史能耗数据
        historyData() {
            this.isShowEcharts2 = true;
            if(!this.timeValue) {
                this.$notify.warning({
                    title: '提醒',
                    message: '请选择查询方式',
                    duration: 2000
                })
                return false;
            }
            if(this.timeValue != 1) {
                if(this.dataTime =='' || this.dataTime == null) {
                    this.$notify.warning({
                        title: '提醒',
                        message: '请选择查询时间',
                        duration: 2000
                    })
                    return false;
                }
            }
            this.loading = true;
            let data = {
                flag: this.timeValue,
                time:this.dataTime,
                query: this.query,
                systemId:this.systemId,
                subsystemId:this.subsystemId,
                buildingId:this.buildingId
            };
            // console.log(data);
            this.$axios.post(`BMPlatServers/hvacheat/queryCityHeatHistory`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.consumeValue = [];
                    this.numberValue = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.consumeValue.push(item.consume);
                            this.numberValue.push(item.number);
                        })
                    }else{
                        this.isShowEcharts2 = false;
                    }
                    this.init2();
                    this.loading = false;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                    this.loading = false;
                }
            })
        },
        search() {
            this.historyData()
        },
        searchT() {
            this.historydata();
        },
        setQuery(item) {
            this.query = item.name;
            if(item.name == 1) {
                this.monad = 'GJ';
            }else if(item.name == 2) {
                this.monad = 'kWh';
            }else if(item.name == 3) {
                this.monad = 'm³';
            }
            this.search();
        }
    },
    mounted() {
        let date1 = new Date();
        let endYear = date1.getFullYear();
        let endMonth = date1.getMonth() + 1;
        let endDay = date1.getDate();
        let endHours = date1.getHours();
        let endMinutes = date1.getMinutes();
        let endSeconds = date1.getSeconds();
        let date2 = new Date(new Date().getTime() - 71*60*60*1000);
        let startYear = date2.getFullYear();
        let startMonth = date2.getMonth() + 1;
        let startDay = date2.getDate();
        let startHours = date2.getHours();
        let startMinutes = date2.getMinutes();
        let startSeconds = date2.getSeconds();
        this.startTime = `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}:${startSeconds}`;
        this.endTime = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}`;
        this.dateRange = [];
        this.dateRange.push(this.startTime);
        this.dateRange.push(this.endTime);
        this.dataTime = `${endYear}-${endMonth}-${endDay}`;
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.deviceListData();
        this.historyData();
    },
    watch: {
        $route(item) {
            this.systemId = item.fullPath.split('=')[1].split(',')[0];
            this.subsystemId = item.fullPath.split('=')[1].split(',')[1];
            this.buildingId = item.fullPath.split('=')[1].split(',')[2];
            this.deviceListData();
        },
        timeValue(item) {
            this.dataTime = '';
            if(item == 1) {
                this.types = 1;
            }else if(item == 2) {
                this.types = 2;
            }else if(item == 3) {
                this.types = 3;
            }else if(item == 4) {
                this.types = 4;
            }else{
                this.types = 4;
            }
        },
        device(item) {
            if(item) {
                this.dataType = item.split(',')[0];
                this.deviceId = item.split(',')[1];
                this.monad1 = item.split(',')[2];
            }else{
                this.dataType = '';
                this.deviceId = '';
            }

        },
        dateRange(item) {
            if(item == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                let startTime = item[0];
                let endTime = item[1];
                if(new Date(endTime).getTime() - new Date(startTime).getTime() >= 72*60*60*1000) {
                    this.$notify.warning({
                        title: '警告',
                        message: '输入的时间不能超过三天',
                        duration: 2000
                    })
                    this.startTime = '';
                    this.endTime = '';
                    this.dateRange = null;
                }else{
                    this.startTime = startTime;
                    this.endTime = endTime;
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#historyDataHeatTransfer{
    .historyDataHeatTransfer{
        .historyDataHeatTransfer-data{
            background: #fff;
            border-radius: 4px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            -o-border-radius: 4px;
            span.spans{
                display: block;
                border-bottom: 1px solid #ddd;
                padding: 5px 10px;
                font-size: 16px;
                color: #666;
            }
            .historyDataHeatTransfer-data-history{
                padding: 15px;
                .selects{
                    width: 300px;
                }
            }
            .noDatas{
                width: 90%;
                margin: 0 auto;
                height: 250px;
                text-align: center;
                line-height: 250px;
                font-size: 18px;
                color: #666;
                border-bottom: 1px solid #666;
                border-left: 1px solid #666;
            }
            .echarts{
                width: 100%;
                height: 300px;
            }
        }
        .historyDataHeatTransfer-enegy{
            background: #fff;
            margin-top: 10px;
            border-radius: 4px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            -o-border-radius: 4px;
            span.spans{
                display: block;
                border-bottom: 1px solid #ddd;
                padding: 5px 10px;
                font-size: 16px;
                color: #666;
            }
            .placeBox{
                padding: 15px;
                .echarts{
                    width: 100%;
                    height: 300px;
                }
            }
        }
    }
}
</style>
