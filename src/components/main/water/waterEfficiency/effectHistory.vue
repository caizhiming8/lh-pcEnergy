<template>
    <div id="effectHistory">
        <div class="historyMain">
            <div class="treeShow">
                <div class="middlePadding">
                    <span class="span">选择楼宇</span>
                    <el-select v-model="choilce" placeholder="请选择" class="selects">
                        <el-option v-for="(item, index) in choilceList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="span">选择单位面积或者人均</span>
                    <el-select v-model="Type" placeholder="请选择" class="selects" style="width: 110px;">
                        <el-option key="1" label="单位面积" value="1"></el-option>
                        <el-option key="2" label="人均" value="2"></el-option>
                    </el-select>
                    <span class="search-type span">查询方式</span>
                    <el-select v-model="timeValue" placeholder="请选择" class="selects" style="width: 110px;">
                        <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span style="margin-left: 20px;" class="span">查询时间</span>
                    <el-date-picker v-if="types == 1" v-model="dataTime" value-format="yyyy" type="datetime" disabled placeholder="选择日期时间"></el-date-picker>
                    <el-date-picker v-if="types == 2" v-model="dataTime" value-format="yyyy" type="year" placeholder="选择日期时间"></el-date-picker>
                    <el-date-picker v-if="types == 3" v-model="dataTime" value-format="yyyy-MM" type="month" placeholder="选择日期时间"></el-date-picker>
                    <el-button @click="search" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
                </div>

                <!-- 图标展示 -->
                <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
                <div class="charts" v-if="isShowEcharts" v-loading="loading">
                    <div class="echarts1" ref="Echarts1"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
             timeValue: 3,
             timeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
             choilceList: [],
             choilce: '',
             types: 3,
             dataTime: '',
             year: '',
             month: '',
             dya: '',
             Time: [],
             TimePerson: [],
             areaValuePerson: [],
             areaValue: [],
             loading: true,
             Type: '1',
             Name: '单位面积',
             isShowEcharts: true,
             mouns: 'm³/㎡'
        }
    },
    methods: {
        init() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let wid1 = document.body.clientWidth || document.documentElement.clientWidth
            var resize1 = {
              width: wid1 - 300,
              height: 400
            };
            myEcharts1.resize(resize1);
            let option1 = {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c} " + this.mouns
                },
                legend: {
                    data:['']
                },
                color: '#8EF6D2',
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '7%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.Time,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
                },
                yAxis: {
                    type: 'value',
                    name: this.mouns
                },
                series: [
                    {
                        name: this.Name,
                        type:'line',
                        stack: '总量',
                        data:this.areaValue,
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        },
                    },
                ]
            };
            myEcharts1.setOption(option1);
        },
        search() {
            if(this.dataTime == null) {
                this.$notify.warning({
                    titlt: '警告',
                    message: '请选择查询时间',
                    duration: 3000
                })
                return false;
            }
            this.loading = true
            this.towerArea();
        },

        //楼宇列表
        initTower() {
            this.$axios.post(`BMPlatServers/common/queryWaterBuildings`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.choilceList.push({label: item.label, value: item.id})
                        })
                    }else{
                        this.choilceList = [];
                    }
                    this.choilce = res.data.result[0].id;
                    this.towerArea();
                }else{
                    // this.$message.warning(res.data.resultMessage);
                }
            })
        },

        // 单位面积某楼宇的历史能耗
        towerArea() {
            this.isShowEcharts = true;
            let data = {
                type: this.Type,
                buildingId: this.choilce,
                flag: this.timeValue,
                year: this.year,
                month: this.month,
                day: this.day
            };
            this.$axios.post(`BMPlatServers/water/queryWaterBuildingEfficiency`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.Time = [];
                    this.areaValue = [];
                    if(res.data.result.result && res.data.result.result.length) {
                        res.data.result.result.forEach((item)=>{
                            this.Time.push(item.number);
                            this.areaValue.push(item.buildingEfficiency);
                        })
                    }else{
                        this.isShowEcharts = false;
                    }
                    this.init();
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
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
        this.initTower();
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
            if(oldss == null) {
                this.year = '';
                this.month = '';
                this.day = '';
            }else{
                this.year = oldss.split('-')[0];
                this.month = oldss.split('-')[1];
                this.day = oldss.split('-')[2];
            }
        },
        Type(newData) {
            if(newData == 1) {
                this.Name = '单位面积';
                this.mouns = 'm³/㎡';
            }else if(newData == 2) {
                this.Name = '人均';
                this.mouns = 'm³/人';
            }
        }
    }
}
</script>

<style lang="scss">
#effectHistory{
    .historyMain{
        .treeShow{
            .middlePadding{
                .span{
                    color: #666;
                    margin-left: 20px;
                }
                .search-type{
                    margin-left: 20px;
                }
            }
            .charts{
                width: 100%;
                padding-top: 20px;
                .echarts1{
                    width: 100%;
                    height: 400px;
                }
            }
        }
    }
}
</style>
