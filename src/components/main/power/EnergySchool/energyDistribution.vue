<template>
    <div id="energyDistribution">
        <div class="energyDistribution">
            <div class="choiceTime">
                <span>查询方式</span>
                <el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
                    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="Time-search">查询时间</span>
                <el-date-picker v-model="timeData" v-if="this.types == 1" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>

            <div class="placeEcharts">
                <div class="echarts" ref="Echarts" v-loading="loading"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            choiceTime: 2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            timeData: '2019-01',
            types: 2,
            loading: true,
            year: '',
            month: '',
            day: '',
            dataList: [],
            names: []
        }
    },
    methods: {
        init() {
            let myEcharts = this.$echarts.init(this.$refs.Echarts);
            let option = {
                title : {
                   text: '楼宇能耗分布图',
                   x:'center'
               },
               tooltip : {
                   trigger: 'item',
                   formatter: "{a} <br/>{b} : {c} kW·h ({d}%)"
               },
               legend: {
                   orient: 'vertical',
                   left: 'left',
                   data: this.names
               },
               color: ['#FCC667', '#BC8DEE','#F66F6F', '#2DA8E8', '#B5B5B5'],
               series : [
                   {
                       name: '楼宇能耗分布',
                       type: 'pie',
                       radius : '70%',
                       center: ['50%', '50%'],
                       data:this.dataList,
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
            myEcharts.setOption(option);
        },
        initData() {
            let data = {
                queryFlag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day
            };
            // console.log(data);
            this.$axios.post(`BMPlatServers/electricity/queryenergyspread`, this.$qs.stringify(data)).then((res)=>{
                this.dataList = [];
                this.names = [];
                if(res.data.success) {
                    if(res.data.result.result && res.data.result.result.length) {
                        res.data.result.result.forEach((item)=>{
                            this.dataList.push({value: item.consum, name: item.name});
                            this.names.push(item.name);
                        })
                    }
                    this.init();
                    this.loading = false;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.loading = false;
                    this.init();
                }
            })
        },
        search() {
            if(!this.choiceTime) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            if(this.timeData == '' || this.timeData == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.initData();
            this.loading = true;
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
		this.timeData = `${year}-${month}-${day}`;
		this.year = year;
		this.month = month;
        this.initData();
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
        },
        timeData(item) {
            if(item) {
                this.year = item.split('-')[0];
                this.month = item.split('-')[1];
                this.day = item.split('-')[2];
            }else{
                this.year = '';
                this.month = '';
                this.day = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#energyDistribution{
    .energyDistribution{
        .choiceTime{
            .Time-search{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
        }
        .placeEcharts{
            padding-top: 30px;
            .echarts{
                width: 100%;
                height: 500px;
            }
        }
    }
}
</style>
