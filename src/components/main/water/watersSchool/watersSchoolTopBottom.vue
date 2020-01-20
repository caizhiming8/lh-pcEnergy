<template>
    <div id="watersSchoolTopBottom">
        <div class="watersSchoolTopBottom">
            <div style="margin: 15px 0 0 15px;">
                <b>查询方式</b>
                <el-select v-model="timeValue" placeholder="请选择" clearable class="selects" style="width: 110px">
                    <el-option v-for="(item, index) in time" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <b style="margin-left: 20px;">查询时间</b>
                <el-date-picker v-if="types == 1" v-model="dataTime" value-format="yyyy" type="year" placeholder="选择日期时间"></el-date-picker>
                <el-date-picker v-if="types == 2" v-model="dataTime" value-format="yyyy-MM" type="month" placeholder="选择日期时间"></el-date-picker>
                <el-date-picker v-if="types == 3" v-model="dataTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
                <el-button @click="search1" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
                <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
                <div v-if="isShowEcharts">
                    <div class="echarTS" ref="Echarts3" v-loading="loading"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            data4: [],
            data3: [],
            time: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            timeValue: 3,
            loading: true,
            types: 3,
            dataTime: '',
            year: '',
            month: '',
            day: '',
            isShowEcharts: true
        }
    },
    methods: {
        init() {
            let myChart3 = this.$echarts.init(this.$refs.Echarts3);
            let wid = document.body.clientWidth || document.documentElement.clientWidth
            var resize = {
              width: wid - 300,
              height: 400
            };
            myChart3.resize(resize);
            let option3 = {
                title : {},
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} m³ ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: this.data3
                },
                color: ['#FCC667', '#BC8DEE','#F66F6F', '#2DA8E8', '#B5B5B5'],
                series : [
                    {
                        name: '楼宇用水量',
                        type: 'pie',
                        radius : '80%',
                        center: ['50%', '55%'],
                        data: this.data4,
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
            myChart3.setOption(option3);
        },

        search1() {
            this.loading = true;
            this.initData(this.timeValue, this.year, this.month, this.day);
        },

        initData(flag, year, month, day) {
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
            if(!this.dataTime) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择查询时间',
                    duration: 2000
                })
                this.loading = false;
                return false;
            }

            //初始化楼宇分布饼图数据
            let datas = {
                flag: flag,
                year: year,
                month: month,
                day: day
            };
            this.$axios.post(`BMPlatServers/water/querySchoolPie`, this.$qs.stringify(datas)).then((res)=>{
                if(res.data.success) {
                    this.data3 = [];
                    this.data4 = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.data3.push(item.name);
                            this.data4.push({value: item.consume, name: item.name});
                        })
                        this.loading = false;
                    }else{
                        this.loading = false;
                        this.isShowEcharts = false;
                    }
                }else{
                    this.loading = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
                this.init();
            })
        }
    },
    mounted() {
        let date = new Date();
        date = date.getTime();
        date = date - 24*60*60*1000;
        let yesToday = new Date(date);
        let year = yesToday.getFullYear();
        let month = yesToday.getMonth() + 1;
        let day = yesToday.getDate();
        this.dataTime = `${year}-${month}-${day}`;
        this.year = year;
        this.month = month;
        this.day = day;
        this.initData(3, year, month, day);
    },
    watch: {
        timeValue(olds) {
            if(olds == 1) {
                this.types = 1
            }else if(olds == 2) {
                this.types = 2
            }else if(olds == 3){
                this.types = 3
            }else{
                this.types = 3
            }
            this.dataTime = ''
        },
        dataTime(item) {
            if(item==null) {
                this.year = '';
                this.month = '';
                this.day = '';
            }else{
                this.year = item.split('-')[0];
                this.month = item.split('-')[1];
                this.day = item.split('-')[2];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#watersSchoolTopBottom{
    .watersSchoolTopBottom{
        .echarTS{
            width: 100%;
            height: 400px;
        }
    }
}
</style>
