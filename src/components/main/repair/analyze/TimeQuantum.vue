<template>
    <div id="TimeQuantum">
        <div class="TimeQuantum">
            <div class="placeSearch">
                <span>时间段查询</span>
                <el-date-picker v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <el-button type="primary" size="small" icon="el-icon-search" @click="search" class="btn">搜索</el-button>
            </div>

            <div class="placeEcharts" v-if="isShowEcharts">
                <div class="echarts" ref="Echarts" v-loading="loading"></div>
            </div>
            <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            time: [],
            loading: true,
            dataName: [],
            dataValue: [],
            startTime: '',
            endTime: '',
            isShowEcharts: true
        }
    },
    methods: {
        init() {
            let myChart = this.$echarts.init(this.$refs.Echarts);
            let option = {
                title : {
                    text: '时间段数据统计',
                    subtext: '',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} 个 ({d}%)"
                },
                color: ['#FCC667', '#BC8DEE','#F66F6F', '#2DA8E8', '#B5B5B5'],
                legend: {
                    orient: 'vertical',
                    left: '40px',
                    data: this.dataName
                },
                series : [
                    {
                        name: '时间段数据统计',
                        type: 'pie',
                        radius : '70%',
                        center: ['50%', '50%'],
                        data: this.dataValue,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        },
        initData() {
            this.isShowEcharts = true;
            let data = {
                flag: 1,
                startTime: this.startTime,
                endTime: this.endTime
            };
            // console.log(data);
            this.$axios.post('BMPlatServers/repair/analyzeRepairItem', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataValue = [];
                    this.dataName = [];
                    if(res.data.result.result&&res.data.result.result.length) {
                        res.data.result.result.forEach((item)=>{
                            this.dataValue.push({name: item.name, value: item.num});
                            this.dataName.push(item.name);
                        })
                    }else{
                        this.isShowEcharts = false;
                    }
                    this.loading = false;
                    this.init();
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                    this.loading = false;
                    this.init();
                }
            })
        },
        search() {
            if(!this.time ||this.time == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '选择时间',
                    duration: 3000
                })
                return false;
            }
            this.loading = true;
            this.initData();
        }
    },
    mounted() {
        let date = new Date();
        let endYear = date.getFullYear();
        let endMonth = date.getMonth() + 1;
        let endDay = date.getDate();

        let startdate = new Date(new Date().getTime() - 3*24*60*60*1000);
        let startYear = startdate.getFullYear();
        let startMonth = startdate.getMonth() + 1;
        let startDay = startdate.getDate();
        this.startTime = `${startYear}-${startMonth}-${startDay}`;
        this.endTime = `${endYear}-${endMonth}-${endDay}`;
        this.time = [];
        this.time.push(this.startTime);
        this.time.push(this.endTime);
        this.initData();
    },
    watch: {
        time(oldData, newData) {
            if(oldData == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = oldData[0];
                this.endTime = oldData[1];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#TimeQuantum{
    .TimeQuantum{
        .btn{
            margin-left: 40px;
        }
        .placeEcharts{
            margin-top: 30px;
            .echarts{
                width: 100%;
                height: 500px;
            }
        }
    }
}
</style>
