<template>
    <div id="heatSupplyNetworkUllageHistory">
        <div class="placeSearch">
            <span>分区</span>
            <el-select v-model="area" placeholder="请选择">
                <el-option v-for="item in arrList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <b style="margin-left: 20px;">查询方式</b>
            <el-select v-model="timeValue" placeholder="请选择" class="selects">
                <el-option v-for="(item, index) in time" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <b style="margin-left: 20px;">查询时间</b>
            <el-date-picker v-if="types == 1" v-model="dataTime" type="datetime" disabled placeholder="选择日期时间"></el-date-picker>
            <el-date-picker v-if="types == 2" v-model="dataTime" value-format="yyyy" type="year" placeholder="选择日期时间"></el-date-picker>
            <el-date-picker v-if="types == 3" v-model="dataTime" value-format="yyyy-MM" type="month" placeholder="选择日期时间"></el-date-picker>
            <el-date-picker v-if="types == 4" v-model="dataTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
            <el-button @click="search" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
        </div>
        <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
        <div class="placeEcharts" v-if="isShowEcharts" v-loading="loading">
            <div class="echarts" ref="Echarts1"></div>
            <div class="echarts" ref="Echarts2"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            timeValue: 4,
            time: [{label:"按年查询",value:1},{label:"按月查询",value:2},{label:"按日查询",value:3},{label:"按时查询",value:4}],
            dataTime: '',
            types: 4,
            loading: true,
            numberValue: [],
            consumeValue2: [],
            consumeValue1: [],
            arrList: [],
            area: '',
            isShowEcharts: false
        }
    },
    methods: {
        init() {
            let myChart1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} GJ"
               },
              title:{
                  text: '历史漏损量',
                  left: 'center'
               },
               color: '#8EF6D2',
               grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '3%',
                   containLabel: true
               },
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: this.numberValue
               },
               yAxis: {
                   type: 'value',
                   name: 'GJ'
               },
               series: [
                   {
                       name:'历史漏损量',
                       type:'line',
                       stack: '总量',
                       areaStyle: {
                           color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                               colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                               global: false
                           }
                       },
                       data: this.consumeValue1,
                   }
               ]
            }
            myChart1.setOption(option1);

            let myChart2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} %"
               },
               title: {
                   text: '历史漏损率',
                   left: 'center'
               },
               color: '#8EF6D2',
               grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '3%',
                   containLabel: true
               },
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: this.numberValue
               },
               yAxis: {
                   type: 'value',
                   name: '%'
               },
               series: [
                   {
                       name:'历史漏损率',
                       type:'line',
                       stack: '总量',
                       areaStyle: {
                           color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                               colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                               global: false
                           }
                       },
                       data: this.consumeValue2,
                   }
               ]
            }
            myChart2.setOption(option2);
        },

        // 列表查询
        List() {
            this.$axios.post('BMPlatServers/common/queryHeatGridTree').then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.arrList = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.arrList.push({label: item.name, value: item.id});
                        })
                        this.area = res.data.result[0].id
                        this.historyData();
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

        // 历史数据
        historyData() {
            this.isShowEcharts = true;
            let data = {
                flag: this.timeValue,
                areaId: this.area,
                time: this.dataTime
            };
            this.$axios.post('BMPlatServers/hvacheat/queryHeatGridLeakHistory', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                	this.numberValue = [];
                	this.consumeValue1 = [];
                	this.consumeValue2 = [];
                    if(res.data.result.list && res.data.result.list.length) {
                    	res.data.result.list.forEach((item)=>{
                    		this.numberValue.push(item.number);
							this.consumeValue1.push(item.diff);
							this.consumeValue2.push(item.percent);
                    	})
                    }else{
                        this.isShowEcharts = false;
                    }
                    this.init();
                    this.loading = false
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
            if(this.timeValue != 1) {
                if(this.dataTime == '' || this.dataTime == null) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择时间',
                        duration: 3000
                    })
                    return false;
                }
            }
            this.loading = true;
            this.historyData();
        }
    },
    mounted() {
        let date2 = new Date(new Date().getTime() - 24*60*60*1000);
        let endYear = date2.getFullYear();
        let endMonth = date2.getMonth()+1;
        let endDate = date2.getDate();
        this.dataTime = `${endYear}-${endMonth}-${endDate}`;
        this.List();
    },
    watch: {
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
        }
    }
}
</script>

<style lang="scss" scoped>
#heatSupplyNetworkUllageHistory{
    .placeSearch{

    }
    .placeEcharts{
        overflow: hidden;
        .echarts{
            width: 50%;
            float: left;
            height: 400px;
        }
    }
}
</style>
