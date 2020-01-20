<template>
    <div id="BuildingEfficiencyHistory">
        <div class="choiceTime">
            <span>选择楼宇</span>
            <el-select v-model="building" placeholder="请选择" clearable style="width: 110px;">
                <el-option v-for="item in buildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="searchType">查询方式</span>
            <el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
                <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="Time-search">查询时间</span>
            <el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData" v-if="this.types == 2" type="year" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData" v-if="this.types == 3" type="month" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData" v-if="this.types == 4" type="date" placeholder="选择日期"></el-date-picker>
            <el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
        </div>

        <div class="placeEcharts">
            <div class="echarts" ref="Echarts1"></div>
            <div class="echarts" ref="Echarts2"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            building: '',
            buildingList: [],
            choiceTime: '',
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            timeData: '',
            types: 2
        }
    },
    methods: {
        init() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                color: ['#3398DB'],
                title: {
                    text: '楼宇历史能耗',
                    subtext: '人均',
                    left: 'center'
                },

                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['邮件营销', '国家标准值'],
                    x: '10px'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'邮件营销',
                        type:'line',
                        stack: '总量',
                        data:[10, 132, 101, 134, 90, 230, 10],
                        markLine: {
                           silent: true,
                           data: [{yAxis: 180, name: '111'}]
                       }
                    },
                ]
            };
            myEcharts1.setOption(option1);

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                color: ['#3398DB'],
                title: {
                    text: '楼宇历史能耗',
                    subtext: '单位面积',
                    left: 'center'
                },

                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['邮件营销', '国家标准值'],
                    x: '10px'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'邮件营销',
                        type:'line',
                        stack: '总量',
                        data:[10, 132, 101, 134, 90, 230, 10],
                        markLine: {
                           silent: true,
                           data: [{yAxis: 180, name: '111'}]
                       }
                    },
                ]
            };
            myEcharts2.setOption(option2);
        },
        search() {

        }
    },
    mounted() {
        setTimeout(()=>{
            this.init();
        }, 800);
    },
    watch: {
        choiceTime(olds) {
            if(olds == 1) {
                this.types = 1
            }else if(olds == 2) {
                this.types = 2
            }else if(olds == 3) {
                this.types = 3
            }else if(olds == 4) {
                this.types = 4
            };
            this.timeData = ''
        }
    }
}
</script>

<style lang="scss" scoped>
#BuildingEfficiencyHistory{
    .choiceTime{
        .searchType{
            margin-left: 20px;
        }
        .Time-search{
            margin-left: 20px;
        }
        .btn{
            margin-left: 20px;
        }
    }
    .placeEcharts{
        overflow: hidden;
        padding-top: 20px;
        .echarts{
            float: left;
            width: 50%;
            height: 500px;
        }
    }
}
</style>
