<template>
    <div id="buildingHistory">
        <div class="buildingHistory">
            <div class="placeSearch">
                <span>选择房间</span>
                <el-select v-model="room" placeholder="请选择" clearable>
                    <el-option v-for="item in roomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="spans">查询方式</span>
                <el-select v-model="type" placeholder="请选择" clearable style="width: 140px;">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="span">查询时间</span>
                <el-date-picker v-model="dataTime" v-if="Type==1" disabled value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="dataTime" v-if="Type==2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="dataTime" v-if="Type==3" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="dataTime" v-if="Type==4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="search" size="small" class="btn">搜索</el-button>
            </div>
            <div class="placeEcharts" v-if="isShowEcharts" v-loading="loading">
    		    <div class="echarts" ref="Echarts"></div>
    		</div>
            <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            roomList: [],
            room: '',
            type: 4,
            typeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            dataTime: '',
            Type: 4,
            loading: true,
            buildingId: '',
            systemId: '',
            subsystemId: '',
            floorId: '',
            roomId: '',
            Xvalue: [],
            dataValue: [],
            isShowEcharts: false
        }
    },
    methods: {
        init() {
            let myChart = this.$echarts.init(this.$refs.Echarts);
            let option = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} kWh"
               },
               title: {
                  text: '历史数据',
                  left: 'center'
               },
               grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '3%',
                   containLabel: true
               },
               color: '#8EF6D2',
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: this.Xvalue
               },
               yAxis: {
                   type: 'value',
                   name: 'kWh'
               },
               series: [
                   {
                       name:'历史数据',
                       type:'line',
                       stack: '总量',
                       areaStyle: {
                           color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                               colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                               global: false
                           }
                       },
                       data: this.dataValue
                   }
               ]
            }
            myChart.setOption(option);
        },

        // 房间列表
        roomlist() {
            let data = {
                buildingId: this.buildingId
            };
            this.$axios.post(`BMPlatServers/conditioner/queryRoomsByBuildingId`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.roomList = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.roomList.push({label: item.roomName, value: `${item.floorId},${item.roomId}`})
                        });
                        let floorId = res.data.result[0].floorId;
                        let roomId = res.data.result[0].roomId;
                        this.room = res.data.result[0].floorId +','+ res.data.result[0].roomId;
                        this.initData(floorId, roomId, this.flag, this.dataTime);
                    }else{
                        this.roomList = [];
                        this.initData(0, 0,this.flag, this.dataTime);
                    }
                }
            })
        },

        // 初始化数据
        initData(floorId, roomId, flag, dataTime) {
            this.isShowEcharts = true;
            let data = {
                systemId: this.systemId,
                subsystemId: this.subsystemId,
                buildingId: this.buildingId,
                floorId: floorId,
                roomId: roomId,
                flag: flag,
                time: dataTime
            };
            this.$axios.post(`BMPlatServers/conditioner/queryRoomHistoryConsume`, this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.Xvalue = [];
                    this.dataValue = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.Xvalue.push(item.number);
                            this.dataValue.push(item.consume);
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
        },

        search() {
            if(!this.room) {
                this.$notify({
                    title: '警告',
                    message: '请选择房间',
                    type: 'warning',
                    duration: 2000
                });
                return
            };
            if(!this.type) {
                this.$notify({
                    title: '警告',
                    message: '请选择查询方式',
                    type: 'warning',
                    duration: 2000
                });
                return
            }
            if(this.type != 1) {
                if(!this.dataTime) {
                    this.$notify({
                        title: '警告',
                        message: '请选择查询时间',
                        type: 'warning',
                        duration: 2000
                    });
                    return
                }
            };
            this.loading = true;
            this.initData(this.floorId, this.roomId, this.type, this.dataTime);
        }
    },
    mounted() {
        let start = new Date(new Date().getTime() - 24*60*60*1000);
        let Year = start.getFullYear();
        let Month = start.getMonth() + 1;
        let Dates = start.getDate();
        this.dataTime = `${Year}-${Month}-${Dates}`;
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.roomlist();
    },
    watch: {
        type(item) {
            this.dataTime = '';
            if(item) {
                if(item == 1) {
                    this.Type = 1;
                }else if(item == 2) {
                    this.Type = 2;
                }else if(item == 3) {
                    this.Type = 3;
                }else if(item == 4) {
                    this.Type = 4;
                }
            }else{
                this.Type = 1;
            }
        },
        $route(to, from) {
            this.systemId = to.fullPath.split('=')[1].split(',')[0];
            this.subsystemId = to.fullPath.split('=')[1].split(',')[1];
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
            this.loading = true;
            this.room = '';
            this.type = '';
            this.dataTime = '';
            this.Type = 2;
            this.roomlist();
        },
        room(item) {
            if(item) {
                this.floorId = item.split(',')[0];
                this.roomId = item.split(',')[1];
            }else{
                this.floorId = '';
                this.roomId = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#buildingHistory{
    .buildingHistory{
        .placeSearch{
            .span{
                margin-left: 20px;
            }
            .spans{
                margin-left: 20px;
            }
            .btn{
                margin-left: 40px;
            }
        }
        .placeEcharts{
            margin-top: 20px;
            .echarts{
                width: 100%;
                height: 500px;
            }
        }
    }
}
</style>
