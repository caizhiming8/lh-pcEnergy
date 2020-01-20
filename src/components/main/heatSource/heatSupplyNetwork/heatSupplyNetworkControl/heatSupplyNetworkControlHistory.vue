<template>
    <div id="heatSupplyNetworkControlHistory">
        <div class="heatSupplyNetworkControlHistory">
            <div class="placeSearch">
                <span>设备选择</span>
                <el-cascader v-model="handleValue" style="width: 280px;" :options="options" :props="{ expandTrigger: 'hover' }"></el-cascader>
                <span class="spans">时间段查询</span>
                <el-date-picker v-model="datetimeranges" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <el-button size="small" type="primary" icon="el-icon-search" @click="search" class="btn">搜索</el-button>
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
            datetimeranges: [],
            areaId: '',
            buildingId: '',
            dataType: '',
            deviceId: '',
            startTime: '',
            endTime: '',
            loading: true,
            time: [],
            valueData: [],
            options: [],
            handleValue: '',
            isShowEcharts: true
        }
    },
    methods: {
        init() {
            let myChart = this.$echarts.init(this.$refs.Echarts);
            let option = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} GJ"
               },
               title: {
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
                   data: this.time
               },
               yAxis: {
                   type: 'value',
                   name: 'GJ'
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
                       data: this.valueData
                   }
               ]
            }
            myChart.setOption(option);
        },

        // 设备列表
        deviceList() {
            this.$axios.post('BMPlatServers/hvacheat/queryHeatGridTree').then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.options = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        this.options = res.data.result.list;
                        this.handleValue = res.data.result.list[0].children[0].children[0].value;
                        if(res.data.result.list[0].children[0].children[0].value) {
                            this.buildingId = res.data.result.list[0].children[0].children[0].value.split(',')[0];
                            this.deviceId = res.data.result.list[0].children[0].children[0].value.split(',')[1];
                            this.dataType = res.data.result.list[0].children[0].children[0].value.split(',')[2];
                        }
                        this.historyTimeRangeData();
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

        // 历史时间段数据
        historyTimeRangeData() {
            this.isShowEcharts = true;
            let data = {
                startTime: this.startTime,
                endTime: this.endTime,
                buildingId: this.buildingId,
                dataType: this.dataType,
                deviceId: this.deviceId
            };
            this.$axios.post('BMPlatServers/hvacheat/queryCityHeatRealHistory', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.time = [];
                    this.valueData = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.time.push(item.number);
                            this.valueData.push(item.consume);
                        })
                    }else{
                        this.isShowEcharts = false;
                    }
                    this.init();
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
            if(this.datetimeranges == '' || this.datetimeranges == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.loading = true;
            this.historyTimeRangeData();
        }
    },
    mounted() {
        let date1 = new Date(new Date().getTime() - 72*60*60*1000);
        let startYear = date1.getFullYear();
        let startMonth = date1.getMonth()+1;
        let startDay = date1.getDate();
        let startHours = date1.getHours();
        let startMinutes = date1.getMinutes();
        let startSeconds = date1.getSeconds();
        let date2 = new Date(new Date().getTime() - 24*60*60*1000);
        let endYear = date2.getFullYear();
        let endMonth = date2.getMonth()+1;
        let endDate = date2.getDate();
        let endHours = date2.getHours();
        let endMinutes = date2.getMinutes();
        let endSeconds = date2.getSeconds();
        this.startTime = `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}:${startSeconds}`;
        this.endTime = `${endYear}-${endMonth}-${endDate} ${endHours}:${endMinutes}:${endSeconds}`;
        this.datetimeranges = [];
        this.datetimeranges.push(this.startTime);
        this.datetimeranges.push(this.endTime);
        this.deviceList();
    },
    watch: {
        datetimeranges(item) {
            if(item && item.length) {
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
                    this.time = null;
                }else{
                    this.startTime = item[0];
                    this.endTime = item[1];
                }
            }else{
                this.startTime = '';
                this.endTime = '';
            }
        },
        handleValue(item) {
            if(item.length == 3) {
                this.buildingId = item[2].split(',')[0];
                this.deviceId = item[2].split(',')[1];
                this.dataType = item[2].split(',')[2];
            }else{
                this.buildingId = '';
                this.dataType = '';
                this.deviceId = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#heatSupplyNetworkControlHistory{
    .heatSupplyNetworkControlHistory{
        .placeSearch{
            .spans{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
        }
        .echarts{
            margin-top: 20px;
            width: 100%;
            height: 400px;
        }
    }
}
</style>
