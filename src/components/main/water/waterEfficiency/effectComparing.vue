<template>
    <div id="effectComparing">
        <div class="time">
            <b>选择单位面积或者人均</b>
            <el-select v-model="Type" placeholder="请选择" clearable class="selects" style="width: 110px;">
                <el-option key="1" label="单位面积" value="1"></el-option>
                <el-option key="2" label="人均" value="2"></el-option>
            </el-select>
            <b class="search-type">查询方式</b>
            <el-select v-model="timeValue" placeholder="请选择" clearable class="selects" style="width: 110px;">
                <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <b style="margin-left: 20px;">查询时间</b>
            <el-date-picker v-if="types == 1" v-model="dataTime" value-format="yyyy" type="year" placeholder="选择日期时间"></el-date-picker>
            <el-date-picker v-if="types == 2" v-model="dataTime" value-format="yyyy-MM" type="month" placeholder="选择日期时间"></el-date-picker>
            <el-date-picker v-if="types == 3" v-model="dataTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search" class="btn">搜索</el-button>
        </div>
        <div class="place-Echarts" v-if="isShowEcharts" v-loading="loading">
            <div class="echarts" ref="Echarts1"></div>
        </div>
        <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            timer: '',
            loading: true,
            timeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            timeValue: 3,
            types: 3,
            dataTime: '',
            year: '',
            month: '',
            day: '',
            dataName: [],
            dataValue: [],
            Type: "1",
            Name: '单位面积',
            isShowEcharts: true,
            mouns: 'm³/㎡'
        }
    },
    methods: {
        init() {
            let myChart1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
               color: ['#3398DB'],
               title: [
                   {text: '', left: 'center'}
               ],
               tooltip : {
                   trigger: 'axis',
                   axisPointer : {
                       type : 'shadow'
                   },
                   formatter: "{a} <br/>{b}: {c} " + this.mouns
               },
               grid: {
                   left: '3%',
                   right: '7%',
                   bottom: '7%',
                   containLabel: true
               },
               xAxis : [
                   {
                       type : 'category',
                       data : this.dataName,
                       axisTick: {
                           alignWithLabel: true
                       },
                       axisLabel: {
                           interval:0,
                           rotate:-40,
                           textStyle: {
                               color: "#484848"
                           }
                       }
                   }
               ],
               yAxis : [
                   {
                       type : 'value',
                       name: this.mouns
                   }
               ],
               series : [
                   {
                       name: this.Name,
                       type:'bar',
                       barWidth: '60%',
                       data:this.dataValue,
                       itemStyle : {
                           normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                   offset: 0,
                                   color: '#08A9FE'
                               }, {
                                   offset: 1,
                                   color: '#5C63F6'
                               }]),
                           }
                       }
                   }
               ]
            };
            myChart1.setOption(option1);
        },

        //各楼宇单位面积能效
        towerArea() {
            this.isShowEcharts = true;
            let data ={
                type: this.Type,
                flag: this.timeValue,
                year: this.year,
                month: this.month,
                day: this.day
            };
            this.$axios.post(`BMPlatServers/water/queryWaterEfficiency`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataName = [];
                    this.dataValue = [];
                    if(res.data.result.result && res.data.result.result.length) {
                        res.data.result.result.forEach((item)=>{
                            this.dataName.push(item.name);
                            this.dataValue.push(item.buildingEfficiency);
                        })
                    }else{
                        this.isShowEcharts = false;
                    }
                    this.loading = false;
                    this.init();
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
            if(!this.Type) {
                this.$notify.warning({
                    titlt: '警告',
                    message: '请选择单位面积或人均',
                    duration: 3000
                })
                return false;
            }
            if(!this.timeValue) {
                this.$notify.warning({
                    titlt: '警告',
                    message: '请选择查询方式',
                    duration: 3000
                })
                return false;
            }
            if(!this.dataTime) {
                this.$notify.warning({
                    titlt: '警告',
                    message: '请选择查询时间',
                    duration: 3000
                })
                return false;
            }
            this.loading = true;
            this.towerArea();
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
        this.month  = month;
        this.day = day;
        this.towerArea();
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
        dataTime(oldss) {
            if(oldss) {
                this.year = oldss.split('-')[0];
                this.month = oldss.split('-')[1];
                this.day = oldss.split('-')[2];
            }else{
                this.year = '';
                this.month = '';
                this.day = '';
            }
        },
        Type(newData) {
            if(newData == 1) {
                this.Name = '单位面积';
                this.mouns = 'm³/㎡';
            }else if(newData == 2) {
                this.Name = '人均'
                this.mouns = 'm³/人';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#effectComparing {
    .time{
        .search-type{
            margin-left: 20px;
        }
        .btn{
            margin-left: 50px;
        }
    }
    .place-Echarts{
        padding-top: 20px;
        .echarts{
            width: 100%;
            height: 500px;
        }
    }
}

</style>
