<template>
    <div id="buildingSystem">
        <div class="buildingSystem">
            <div class="placeSearch">
                <span>查询方式</span>
                <el-select v-model="type" placeholder="请选择" clearable>
                    <el-option v-for="item in typelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="spans">查询时间</span>
                <el-date-picker v-model="timer" type="year" placeholder="选择日期" v-if="Type==1" disabled></el-date-picker>
                <el-date-picker v-model="timer" type="year" placeholder="选择日期" v-if="Type==2" value-format="yyyy"></el-date-picker>
                <el-date-picker v-model="timer" type="month" placeholder="选择日期" v-if="Type==3" value-format="yyyy-MM"></el-date-picker>
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
            type: 3,
            typelist: [{label: '按年查询', value: 2}, {label: '按月查询', value: 3}],
            timer: '',
            Type: 3,
            loading: true,
            dataValue: [],
            dataName: [],
            isShowEcharts: true
        }
    },
    methods: {
        init() {
            let myChart = this.$echarts.init(this.$refs.Echarts);
            let option = {
                title : {
                    text: '楼宇系统数据统计',
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
                        name: '楼宇统计分析',
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
                flag: 3,
                query: this.type,
                time: this.timer
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
            if(!this.type) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择查询方式',
                    duration: 3000
                })
                return false;
            }
            if(!this.timer) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
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
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        this.timer = `${year}-${month}`;
        this.initData();
    },
    watch: {
        type(oldData, newData) {
            this.timer = '';
            if(oldData == 2) {
                this.Type = 2;
            }else if(oldData == 3) {
                this.Type = 3;
            }else{
                this.Type = 2;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#buildingSystem{
    .buildingSystem{
        .placeSearch{
            .spans{
                margin-left: 20px;
            }
            .btn{
                margin-left: 40px;
            }
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
