<template>
    <div id="watersSchoolTopmiddle">
        <div class="watersSchoolTopmiddle">
            <b>查询方式</b>
            <el-select v-model="timeValue" placeholder="请选择" clearable class="selects">
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
        <div v-if="isShowEcharts">
            <div class="echarts" ref="Echarts2" v-loading="loading" ></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            timeValue: 4,
            time: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            dataTime: '',
            loading: true,
            types: 4,
            monthlist: [],
            water: [],
            year: '',
            month: '',
            day: '',
            isShowEcharts: false
        }
    },
    methods: {
        init() {
            let myChart2 = this.$echarts.init(this.$refs.Echarts2);
            let wid = document.body.clientWidth || document.documentElement.clientWidth
            var resize = {
              width: wid - 360,
              height: 300
            };
            myChart2.resize(resize);
            let option2 = {
                title: {
                    text: '历史能耗',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c} m³"
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '7%',
                    containLabel: true
                },
                color: '#8EF6D2',
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.monthlist,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'm³'
                },
                series: [
                    {
                        name:'历史能耗',
                        type:'line',
                        stack: '总量',
                        // lineStyle: {
                        //     normal: {
                        //         width: '1'
                        //     }
                        // },
                        areaStyle: {normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#8EF6D2'},
                                    {offset: 1, color: '#E7FAF5'}
                                ]
                            )
                        }},
                        data: this.water
                   }
               ]
            }
            myChart2.setOption(option2);
        },
        search() {
            this.loading = true;
            this.history(this.timeValue, this.year, this.month, this.day);
        },

        history(flag, year, month, day) {
            this.isShowEcharts = true;
            if(!this.timeValue) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择查询方式',
                    duration: 2000
                })
                this.loading = false;
                return false;
            }
            if(this.timeValue != 1) {
                if(this.dataTime == null) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择查询时间',
                        duration: 2000
                    })
                    this.loading = false;
                    return false;
                }
            }

            let data = {
                flag: flag,
                year: year,
                month: month,
                day: day
            };
            this.$axios.post(`BMPlatServers/water/querySchoolHistory`, this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.water = [];
                    this.monthlist = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.water.push(item.consume);
                            this.monthlist.push(item.number)
                        })
                    }else{
                        this.isShowEcharts = false;
                    }
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
                this.init();
                this.loading = false;
            });
        }
    },
    mounted() {
        let dates = new Date();
        dates = dates.getTime();
        dates = dates - 24*60*60*1000;
        let yesToday = new Date(dates);
        let year = yesToday.getFullYear();
        let month = yesToday.getMonth() + 1;
        let day = yesToday.getDate();
        this.dataTime = `${year}-${month}-${day}`;
        this.year = year;
        this.month = month;
        this.day = day;
        this.history(4, year, month, day);
    },
    watch: {
        timeValue(olds) {
            this.dataTime = null;
            if(olds == 1) {
                this.types = 1
            }else if(olds == 2) {
                this.types = 2
            }else if(olds == 3){
                this.types = 3
            }else if(olds == 4) {
                this.types = 4
            }else{
                this.types = 4
            }
        },
        dataTime(newData) {
            if(newData==null) {
                this.year = '';
                this.month = '';
                this.day = '';
            }else{
                this.year = newData.split('-')[0];
                this.month = newData.split('-')[1];
                this.day = newData.split('-')[2];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#watersSchoolTopmiddle{
    .watersSchoolTopmiddle{
        padding: 15px 30px;
        .selects{
            width: 110px;
        }
    }
    .echarts{
        width: 100%;
        height: 400px;
    }
}
</style>
