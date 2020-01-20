<template>
    <div class="realTime">
        <div class="top">
            <div class="spanout">
                <span class="sapninner">楼宇实时能耗</span>
                <b>
                    <span v-for="item in List">
                        {{item.name}}:
                        <i style="color: red; font-weight: 700;">
                            <v-countup start-value="0" :end-value="item.currentconsume" :duration="1" :decimals="2"></v-countup> m³
                        </i> ；
                    </span>
                </b>
            </div>
            <div class="towerChance">
                <span>选择楼宇</span>
                <el-select v-model="tower" placeholder="请选择" filterable>
                    <el-option v-for="item in towerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button @click="search1" style="margin-left: 40px;" type="primary" icon="el-icon-search" size="small">查询</el-button>
                <div class="placeEcharts" v-loading="loading">
                    <div class="echarts-l" ref="Echarts01"></div>
                    <div class="echarts-m" ref="Echarts02"></div>
                    <div class="echarts-r" ref="Echarts03"></div>
                </div>
            </div>
        </div>
        <div class="middle" v-if="isShow">
            <div class="span">
                <span>重点区域实时能耗</span>
                <b> <span v-for="item in List1">{{item.name}}:<b style="color: red;"> {{item.currentconsume}} m³</b></span> </b> 
            </div>
            <div class="middlePadding">
                <i>选择重点房间：</i>
                <el-select v-model="timeValue" placeholder="请选择" clearable @focus="focusRoom">
                    <el-option v-for="(item, index) in room" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button @click="search2" style="margin-left: 40px;" type="primary" icon="el-icon-search" size="small">查询</el-button>
            </div>
            <div class="areaEcharts" v-loading="loading1">
                <div class="echarts-t" ref="Echarts11"></div>
                <div class="echarts-c" ref="Echarts12"></div>
                <div class="echarts-b" ref="Echarts13"></div>
            </div>
        </div>
    </div>
</template>

<script>
// import bus from '../../../../../static/js/bus.js';
export default {
    data() {
        return{
            towerList: [],
            tower: '',
            timeValue: '',
            room: [],
            loading: true,
            loading1: true,
            yearconsume: [{value: 0}],
            monthconsume: [{value: 0}],
            dayconsume: [{value: 0}],
            roomYear: [{value: 0}],
            roomMonth: [{value: 0}],
            roomDay: [{value: 0}],
            floorID: '',
            roomID: '',
            buildingID: '',
            List: [],
            List1: [],
            isShow: true
        }
    },
    methods: {
        init1() {
            let myChart01 = this.$echarts.init(this.$refs.Echarts01);
            let option01 = {
                title: {
                   left: 'center',
                   text: '当年累计用水量',
                },
                tooltip : {
                    formatter: "{a}{b} : {c} m³"
                },


                series: [
                    {
                        name: '当年累计用水量',
                        type: 'gauge',
                        axisLine: {
                            lineStyle: {
                                width: 8,
                                color: [
                                    [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                            offset: 0.1,
                                            color: "#FFC600"
                                        },
                                        {
                                            offset: 0.6,
                                            color: "#30D27C"
                                        },
                                        {
                                            offset: 1,
                                            color: "#0B95FF"
                                        }
                                    ])]
                                ]
                            }
                        },
                        min:0,
                        max: this.yearconsume[0].value==0?100:Math.ceil(this.yearconsume[0].value*(Math.random()+1)),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} m³',
                            textStyle: {
                                fontSize: 18,
                                fontWeight: 700
                            }
                        },
                        data: this.yearconsume,
                        axisLabel: {
                            textStyle: {       // 属性lineStyle控制线条样式
                                color: '#000',
                                fontSize:8,   //改变仪表盘内刻度数字的大小
                                shadowColor : '#000', //默认透明
                            }
                        },
                        pointer: {
                            width:3,//指针的宽度
                            length:"80%", //指针长度，按照半圆半径的百分比
                            shadowColor : '#ccc', //默认透明
                            shadowBlur: 5
                        },
                        splitLine: { //分割线样式
        		        	 length: 10
        		        },
                        axisLabel: {            // 坐标轴小标记
                             distance: 10,
                             fontSize: 10,
                             formatter: function(v){
                                 return v.toFixed(0);
                             },
                        },
                     }
                ]
            };
            myChart01.setOption(option01);

            let myChart02 = this.$echarts.init(this.$refs.Echarts02);
            let option02 = {
                title: {
                   left: 'center',
                   text: '当月累计用水量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c} m³"
                },
                series: [
                    {
                        name: '当月累计用水量',
                        type: 'gauge',
                        axisLine: {
                            lineStyle: {
                                width: 8,
                                color: [
                                    [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                            offset: 0.1,
                                            color: "#FFC600"
                                        },
                                        {
                                            offset: 0.6,
                                            color: "#30D27C"
                                        },
                                        {
                                            offset: 1,
                                            color: "#0B95FF"
                                        }
                                    ])]
                                ]
                            }
                        },
                        min:0,
                        max: this.monthconsume[0].value==0?100:Math.ceil(this.monthconsume[0].value*(Math.random()+.5)),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} m³',
                            textStyle: {
                                fontSize: 18,
                                fontWeight: 700
                            }
                        },
                        data: this.monthconsume,
                        axisLabel: {
                            textStyle: {       // 属性lineStyle控制线条样式
                                color: '#000',
                                fontSize:8,   //改变仪表盘内刻度数字的大小
                                shadowColor : '#000', //默认透明
                            }
                        },
                        pointer: {
                            width:3,//指针的宽度
                            length:"80%", //指针长度，按照半圆半径的百分比
                            shadowColor : '#ccc', //默认透明
                            shadowBlur: 5
                        },
                        splitLine: { //分割线样式
        		        	 length: 10
        		        },
                        axisLabel: {            // 坐标轴小标记
                             distance: 10,
                             fontSize: 10,
                             formatter: function(v){
                                 return v.toFixed(0);
                             },
                        },
                    }
                ]
            };
            myChart02.setOption(option02);

            let myChart03 = this.$echarts.init(this.$refs.Echarts03);
            let option03 = {
                title: {
                   left: 'center',
                   text: '当日累计用水量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c} m³"
                },
                series: [
                    {
                        name: '当日累计用水量',
                        type: 'gauge',
                        axisLine: {
                            lineStyle: {
                                width: 8,
                                color: [
                                    [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                            offset: 0.1,
                                            color: "#FFC600"
                                        },
                                        {
                                            offset: 0.6,
                                            color: "#30D27C"
                                        },
                                        {
                                            offset: 1,
                                            color: "#0B95FF"
                                        }
                                    ])]
                                ]
                            }
                        },
                        min:0,
                        max:this.dayconsume[0].value==0?100:Math.ceil(this.dayconsume[0].value*(Math.random()+.5)),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} m³',
                            textStyle: {
                                fontSize: 18,
                                fontWeight: 700
                            }
                        },
                        data: this.dayconsume,
                        axisLabel: {
                            textStyle: {       // 属性lineStyle控制线条样式
                                color: '#000',
                                fontSize:8,   //改变仪表盘内刻度数字的大小
                                shadowColor : '#000', //默认透明
                            }
                        },
                        pointer: {
                            width:3,//指针的宽度
                            length:"80%", //指针长度，按照半圆半径的百分比
                            shadowColor : '#ccc', //默认透明
                            shadowBlur: 5
                        },
                        splitLine: { //分割线样式
        		        	 length: 10
        		        },
                        axisLabel: {            // 坐标轴小标记
                             distance: 10,
                             fontSize: 10,
                             formatter: function(v){
                                 return v.toFixed(0);
                             },
                        },
                    }
                ]
            };
            myChart03.setOption(option03);
        },
        init2() {
            let myChart11 = this.$echarts.init(this.$refs.Echarts11);
            let option11 = {
                title: {
                   left: 'center',
                   text: '当年累计用水量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c} m³"
                },
                series: [
                    {
                        name: '当年累计用水量',
                        type: 'gauge',
                        axisLine: {
                            lineStyle: {
                                width: 8,
                                color: [
                                    [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                            offset: 0.1,
                                            color: "#FFC600"
                                        },
                                        {
                                            offset: 0.6,
                                            color: "#30D27C"
                                        },
                                        {
                                            offset: 1,
                                            color: "#0B95FF"
                                        }
                                    ])]
                                ]
                            }
                        },
                        min:0,
                        max:this.roomYear[0].value==0?100:Math.ceil(this.roomYear[0].value*(Math.random()+1)),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} m³',
                            textStyle: {
                                fontSize: 18,
                                fontWeight: 700
                            }
                        },
                        data: this.roomYear,
                        axisLabel: {
                            textStyle: {       // 属性lineStyle控制线条样式
                                color: '#000',
                                fontSize:8,   //改变仪表盘内刻度数字的大小
                                shadowColor : '#000', //默认透明
                            }
                        },
                        pointer: {
                            width:3,//指针的宽度
                            length:"80%", //指针长度，按照半圆半径的百分比
                            shadowColor : '#ccc', //默认透明
                            shadowBlur: 5
                        },
                        splitLine: { //分割线样式
        		        	 length: 10
        		        },
                        axisLabel: {            // 坐标轴小标记
                             distance: 10,
                             fontSize: 10,
                             formatter: function(v){
                                 return v.toFixed(0);
                             },
                        },
                    }
                ]
            };
            myChart11.setOption(option11);

            let myChart12 = this.$echarts.init(this.$refs.Echarts12);
            let option12 = {
                title: {
                   left: 'center',
                   text: '当月累计用水量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c} m³"
                },
                series: [
                    {
                        name: '当月累计用水量',
                        type: 'gauge',
                        axisLine: {
                            lineStyle: {
                                width: 8,
                                color: [
                                    [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                            offset: 0.1,
                                            color: "#FFC600"
                                        },
                                        {
                                            offset: 0.6,
                                            color: "#30D27C"
                                        },
                                        {
                                            offset: 1,
                                            color: "#0B95FF"
                                        }
                                    ])]
                                ]
                            }
                        },
                        min:0,
                        max:this.roomMonth[0].value==0?100:Math.ceil(this.roomMonth[0].value*(Math.random()+.5)),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} m³',
                            textStyle: {
                                fontSize: 18,
                                fontWeight: 700
                            }
                        },
                        data: this.roomMonth,
                        axisLabel: {
                            textStyle: {       // 属性lineStyle控制线条样式
                                color: '#000',
                                fontSize:8,   //改变仪表盘内刻度数字的大小
                                shadowColor : '#000', //默认透明
                            }
                        },
                        pointer: {
                            width:3,//指针的宽度
                            length:"80%", //指针长度，按照半圆半径的百分比
                            shadowColor : '#ccc', //默认透明
                            shadowBlur: 5
                        },
                        splitLine: { //分割线样式
        		        	 length: 10
        		        },
                        axisLabel: {            // 坐标轴小标记
                             distance: 10,
                             fontSize: 10,
                             formatter: function(v){
                                 return v.toFixed(0);
                             },
                        },
                    }
                ]
            };
            myChart12.setOption(option12);

            let myChart13 = this.$echarts.init(this.$refs.Echarts13);
            let option13 = {
                title: {
                   left: 'center',
                   text: '当日累计用水量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c}m³"
                },
                series: [
                    {
                        name: '当日累计用水量',
                        type: 'gauge',
                        axisLine: {
                            lineStyle: {
                                width: 8,
                                color: [
                                    [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                            offset: 0.1,
                                            color: "#FFC600"
                                        },
                                        {
                                            offset: 0.6,
                                            color: "#30D27C"
                                        },
                                        {
                                            offset: 1,
                                            color: "#0B95FF"
                                        }
                                    ])]
                                ]
                            }
                        },
                        min:0,
                        max:this.roomDay[0].value==0?100:Math.ceil(this.roomDay[0].value*(Math.random()+1)),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} m³',
                            textStyle: {
                                fontSize: 18,
                                fontWeight: 700
                            }
                        },
                        data: this.roomDay,
                        axisLabel: {
                            textStyle: {       // 属性lineStyle控制线条样式
                                color: '#000',
                                fontSize:8,   //改变仪表盘内刻度数字的大小
                                shadowColor : '#000', //默认透明
                            }
                        },
                        pointer: {
                            width:3,//指针的宽度
                            length:"80%", //指针长度，按照半圆半径的百分比
                            shadowColor : '#ccc', //默认透明
                            shadowBlur: 5
                        },
                        splitLine: { //分割线样式
        		        	 length: 10
        		        },
                        axisLabel: {            // 坐标轴小标记
                             distance: 10,
                             fontSize: 10,
                             formatter: function(v){
                                 return v.toFixed(0);
                             },
                        },
                    }
                ]
            };
            myChart13.setOption(option13);
        },

        //选择楼宇列表
        initTower(e) {
            this.$axios.get(`BMPlatServers/common/queryWaterBuildings`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.towerList = [];
                    this.tower = 0;
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.towerList.push({label: item.label, value: item.id});
                        })
                        if(e) {
                            this.realTower(e)
                            this.tower = e;
                        }else {
                            this.realTower(this.towerList[0].value)
                            this.tower = this.towerList[0].value;
                        }
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

        //重点房间列表
        initRoom() {
            this.timeValue = ''
            let data = {
                buildingId: this.tower
            };
            // console.log(data);
            this.$axios.post(`BMPlatServers/common/queryRooms`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.room = []
                    if(res.data.result && res.data.result.length) {
                        this.isShow = true;
                        res.data.result.forEach((item)=>{
                            this.room.push({label: item.roomName, value: item.floorId + ',' + item.roomId + ',' + this.tower})
                        })
                        this.timeValue = res.data.result[0].floorId + ',' + res.data.result[0].roomId + ',' + this.tower;
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

        //初始化查询楼宇实时能耗
        realTower(buildingId) {
            let data = {
                buildingId: buildingId
            };
            this.$axios.post(`BMPlatServers/water/queryBuildingWater`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.monthconsume[0].value = 0
                    this.yearconsume[0].value = 0
                    this.dayconsume[0].value = 0
                    this.monthconsume[0].value = Math.ceil(res.data.result.monthconsume)
                    this.yearconsume[0].value = Math.ceil(res.data.result.yearconsume);
                    this.dayconsume[0].value = Math.ceil(res.data.result.dayconsume);

                    // 实时抄表值
                    this.List = res.data.result.maindevice;
                    this.loading = false;
                    this.init1();
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

        //初始化房间实时能效
        initRoomData() {
            let data = {
                buildingId: this.tower,
                roomId: this.roomID,
                floorId: this.floorID
            };
            this.$axios.post(`BMPlatServers/water/queryRoomWater`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.roomMonth[0].value =  Math.ceil(res.data.result.monthconsume)
                    this.roomYear[0].value =  Math.ceil(res.data.result.yearconsume)
                    this.roomDay[0].value =  Math.ceil(res.data.result.dayconsume)

                    this.List1 = res.data.result.maindevice
                    this.loading1 = false;
                    this.init2();
                }else {
                    this.loading1 = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        //  重点房间获取焦点没有值
        focusRoom() {
            if(!this.tower) {
                this.$message.warning({
                    message: '请先选择要查询的楼宇',
                    showClose: true,
                    duration: 1000
                })
            }
        },

        search1() {
            this.loading = true;
            this.realTower(this.tower);
        },
        search2() {
            if(!this.floorID) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择重点房间',
                    duration: 2000
                })
                return false;
            }
            this.loading1 = true;
            this.initRoomData();
        }
    },
    mounted() {
        let buildingId = this.$route.query.buildingId;
        if(buildingId) {
            this.initTower(Number(buildingId));
        }else{
            this.initTower();
        }
    },
    watch: {
        tower(olds) {
            let str = ''
            str += olds;
            if(str) {
                this.initRoom();
            }
            this.timeValue = ''
        },
        timeValue(news) {
            if(news) {
                this.floorID = ''+news.split(',')[0]
                this.roomID = ''+news.split(',')[1]
                this.buildingID = ''+news.split(',')[2]
            }else{
                this.floorID = ''
                this.roomID = ''
                this.buildingID = ''
            }
            this.initRoomData();
        }
    }
}
</script>

<style lang="scss" scoped>
.realTime{
    .top{
        width: 98%;
        margin: 0 auto;
        border: 1px solid #DDDDDD;
        box-shadow: 0 0 3px #DDDDDD;
        -webkit-box-shadow: 0 0 3px #DDDDDD;
        -moz-box-shadow: 0 0 3px #DDDDDD;
        -o-box-shadow: 0 0 3px #DDDDDD;
        .spanout{
            padding: 15px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            border-bottom: 1px solid #ddd;
            overflow: hidden;
            span.sapninner{
                float: left;
            }
            b{
                float: right;
                font-size: 14px;
                font-weight: 700;
            }
        }
        .towerChance{
            margin: 20px;
            .placeEcharts{
                overflow: hidden;
                padding-top: 20px;
                .echarts-l{
                    float: left;
                    width: 32%;
                    height: 300px;
                }
                .echarts-m{
                    float: left;
                    width: 32%;
                    height: 300px;
                }
                .echarts-r{
                    float: left;
                    width: 32%;
                    height: 300px;
                }
            }
        }
    }
    .middle{
        width: 98%;
        margin: 20px auto;
        border: 1px solid #DDDDDD;
        box-shadow: 0 0 3px #DDDDDD;
        -moz-box-shadow: 0 0 3px #DDDDDD;
        -o-box-shadow: 0 0 3px #DDDDDD;
        .span{
            display: block;
            padding: 15px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            width: 100%;
            border-bottom: 1px solid #ddd;
            overflow: hidden;
            span{
                 float: left;
            }
            b{
                float: right;
                font-weight: 700;
            }
        }
        .selects{
            width: 108px !important;
        }
        .middlePadding{
            padding: 30px 0 0 30px;
        }
        .areaEcharts{
            overflow: hidden;
            padding-top: 20px;
            .echarts-t{
                float: left;
                width: 32%;
                height: 300px;
            }
            .echarts-c{
                float: left;
                width: 32%;
                height: 300px;
            }
            .echarts-b{
                float: left;
                width: 32%;
                height: 300px;
            }
        }
    }
}
</style>
