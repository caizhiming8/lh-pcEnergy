<template>
    <div class="history">
        <div class="linePadding">
            <div class="towerChance" style="margin: 0 0 15px 10px;">
                <b>查询方式</b>
                <el-select v-model="typeSearch" placeholder="请选择" clearable class="selects" style="width: 110px;">
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <b style="margin-left: 20px;">查询时间</b>
                <el-date-picker v-if="types == 1" v-model="dataTime" type="datetime" disabled placeholder="选择日期时间"></el-date-picker>
                <el-date-picker v-if="types == 2" v-model="dataTime" value-format="yyyy" type="year" placeholder="选择日期时间"></el-date-picker>
                <el-date-picker v-if="types == 3" v-model="dataTime" value-format="yyyy-MM" type="month" placeholder="选择日期时间"></el-date-picker>
                <el-date-picker v-if="types == 4" v-model="dataTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
            </div>
            <div class="top">
                <span class="span">楼宇历史能耗</span>
                <div class="towerChance">
                    <span>选择楼宇</span>
                    <el-select v-model="tower" placeholder="请选择" filterable>
                        <el-option v-for="item in towerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button @click="search1" style="margin-left: 40px;" size="small" type="primary" icon="el-icon-search">查询</el-button>
                </div>

                <br>
                <div class="noDataEcharts" v-if="!isShowEcharts1">暂无数据</div>
                <div v-if="isShowEcharts1">
                    <div class="echarts" ref="Echarts" v-loading="loading1"></div>
                </div>
            </div>
            <div class="middle" ref="middle" v-if="isShow">
                <span class="span">重点区域历史能耗</span>
                <div class="middlePadding">
                    <i>选择重点房间：</i>
                    <el-select v-model="roomValue" placeholder="请选择" @focus="focusRoom">
                        <el-option v-for="(item, index) in room" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button @click="search2" style="margin-left: 40px;" size="small" type="primary" icon="el-icon-search">查询</el-button>
                </div>
                <div ref="changeEcharts" v-if="isShowEcharts2" style="width: 100%; height: 300px;" v-loading="loading2">
                    <div class="echarts" ref="Echarts2"></div>
                </div>
                <div class="noDataEcharts" v-if="!isShowEcharts2">暂无数据</div>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../../../../../static/js/bus.js';
export default {
    data() {
        return{
            water: [],
            month: [],
            water2: [],
            month2: [],
            tower: '',
            towerList: [],
            typeSearch: 4,
            typeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            dataTime: '',
            roomValue: '',
            room: [],
            types: 4,
            choiceYear: '',
            choiceMonth: '',
            choiceDate: '',
            loading1: true,
            loading2: true,
            floorID: '',
            roomID: '',
            buildingID: '',
            isShowEcharts1: true,
            isShowEcharts2: true,
            isShow: true
        }
    },
    methods: {
        init1() {
            let myChart = this.$echarts.init(this.$refs.Echarts);
            let wid = document.body.clientWidth || document.documentElement.clientWidth
            var resize = {
              width: wid - 380,
              height: 300
            };
            myChart.resize(resize);
            let option = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} m³"
               },
               color: '#8EF6D2',
               title:{
                  text: '历史能耗',
                  left: 'center'
               },
               grid: {
                   left: '3%',
                   right: '7%',
                   bottom: '7%',
                   containLabel: true
               },
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: this.month,
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
            myChart.setOption(option);
        },
        init2() {
            let myChart2 = this.$echarts.init(this.$refs.Echarts2);
            let wids = document.body.clientWidth || document.documentElement.clientWidth
            var resizes = {
              width: wids - 380,
              height: 300
            };
            myChart2.resize(resizes);
            let option2 = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} m³"
               },
               title:{
                  text: '历史能耗',
                  left: 'center'
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
                   data: this.month2,
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
                       areaStyle: {normal: {
                           color: new echarts.graphic.LinearGradient(
                               0, 0, 0, 1,
                               [
                                   {offset: 0, color: '#8EF6D2'},
                                   {offset: 1, color: '#E7FAF5'}
                               ]
                           )
                       }},
                       data: this.water2
                   }
               ]
            }
            myChart2.setOption(option2);
        },

        // 楼宇列表
        towerlist() {
            this.$axios.get(`BMPlatServers/common/queryWaterBuildings`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.towerList = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.towerList.push({label: item.label, value: item.id});
                        })
                        this.tower = res.data.result[0].id;
                        this.historyTower();
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

        // 重点房间列表
        initRoom() {
            let data = {
                buildingId: this.tower
            };
            this.$axios.post(`BMPlatServers/common/queryRooms`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.room = [];
                    if(res.data.result && res.data.result.length) {
                        this.isShow = true;
                        res.data.result.forEach((item)=>{
                            this.room.push({label: item.roomName, value: item.floorId + ',' + item.roomId + ',' + this.tower})
                        })
                        this.roomValue = res.data.result[0].floorId+','+res.data.result[0].roomId+','+this.tower
                        this.roomID = res.data.result[0].roomId
                        this.floorID = res.data.result[0].floorId;
                        this.initRoomData();
                    }else{
                        this.isShow = false;
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

        focusRoom() {
            if(!this.tower) {
                this.$message.warning({
                    message: '请选选择要查询的楼宇',
                    showClose: true,
                    duration: 1000
                })
            }
        },

        //楼宇历史能效查询
        historyTower() {
            this.isShowEcharts1 = true;
            let data = {
                flag: this.typeSearch,
                buildingId: this.tower,
                year: this.choiceYear,
                month: this.choiceMonth,
                day: this.choiceDate
            };
            this.$axios.post(`BMPlatServers/water/queryBuildingHistory`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.month = [];
                    this.water = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.month.push(item.number);
                            this.water.push(item.consume)
                        })
                    }else{
                        this.isShowEcharts1 = false;
                    }
                    this.loading1 = false;
                    this.init1();
                }else{
                    this.loading1 = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        //重点房间历史能效查询
        initRoomData() {
            this.isShowEcharts2 = true;
            let data = {
                flag: this.typeSearch,
                buildingId: this.tower,
                floorId: this.floorID,
                roomId: this.roomID,
                year: this.choiceYear,
                month: this.choiceMonth,
                day: this.choiceDate
            };
            this.$axios.post(`BMPlatServers/water/queryRoomHistory`, this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.month2 = [];
                    this.water2 = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.month2.push(item.number);
                            this.water2.push(item.consume);
                        })
                    }else{
                        this.isShowEcharts2 = false;
                    }
                    this.init2();
                    this.loading2 = false;
                }else{
                    this.loading2 = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        search1() {
            if(!this.typeSearch) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择查询方式',
                    duration: 3000
                })
                return false;
            }
            if(this.typeSearch != 1) {
                if(!this.dataTime) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择查询时间',
                        duration: 3000
                    })
                    return false;
                }
            }
            this.loading1 = true;
            this.historyTower();
        },
        search2() {
            if(!this.typeSearch) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择查询方式',
                    duration: 3000
                })
                return false;
            }
            if(this.typeSearch != 1) {
                if(!this.dataTime) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择查询时间',
                        duration: 3000
                    })
                    return false;
                }
            }
            this.loading2 = true;
            this.initRoomData();
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
        this.choiceYear = year;
        this.choiceMonth = month;
        this.choiceDate = day;
        this.towerlist();
    },
    watch: {
        typeSearch(olds) {
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
            this.dataTime = ''
        },
        dataTime(news) {
            if(news == null) {
                this.choiceYear = '';
                this.choiceMonth = '';
                this.choiceDate = '';
            }else{
                this.choiceYear = news.split('-')[0];
                this.choiceMonth = news.split('-')[1];
                this.choiceDate = news.split('-')[2];
            }
        },
        tower(oldss) {
            this.roomValue = ''
            let str = ''
            str += oldss;
            if(str) {
                this.initRoom();
            }
            this.timeValue = ''
        },
        roomValue(data) {
            if(data) {
                this.floorID = ''+data.split(',')[0]
                this.roomID = ''+data.split(',')[1]
                this.buildingID = ''+data.split(',')[2]
            }else{
                this.floorID = ''
                this.roomID = ''
                this.buildingID = ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.history{
    .linePadding{
        // padding-top: 30px;
        padding-bottom: 30px;
        .top{
            width: 98%;
            margin: 0 auto;
            border: 1px solid #DDDDDD;
            box-shadow: 0 0 3px #DDDDDD;
            -webkit-box-shadow: 0 0 3px #DDDDDD;
            -moz-box-shadow: 0 0 3px #DDDDDD;
            -o-box-shadow: 0 0 3px #DDDDDD;
            .towerChance{
                padding: 30px 0 0 30px;
                display: inline-block;
            }
        }
        .middle{
            width: 98%;
            margin: 20px auto;
            border: 1px solid #DDDDDD;
            box-shadow: 0 0 3px #DDDDDD;
            -moz-box-shadow: 0 0 3px #DDDDDD;
            -o-box-shadow: 0 0 3px #DDDDDD;
            .selects{
                width: 108px !important;
            }
            .middlePadding{
                padding: 30px 0 0 30px;
            }
        }
        .bottom{
            width: 98%;
            margin: 0 auto;
            border: 1px solid #DDDDDD;
            box-shadow: 0 0 3px #DDDDDD;
            -moz-box-shadow: 0 0 3px #DDDDDD;
            -o-box-shadow: 0 0 3px #DDDDDD;
        }
        .echarts{
            width: 100% !important;
            height: 300px !important;
            margin: 0 auto 10px !important;
        }
        .span{
            // font-weight: 700;
            display: block;
            padding: 15px 0 15px 15px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
    }
}
</style>
