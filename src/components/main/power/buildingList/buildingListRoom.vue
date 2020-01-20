<template>
    <div id="buildingListRoom">
        <div class="buildingListRoom">
            <div class="buildingListRoom-left">
                <el-tree :data="datas" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>
                            <img src="../../../../../static/img/fangjianguankong.png">{{ node.label }}
                        </span>
                    </span>
                </el-tree>
            </div>
            <div class="buildingListRoom-right">
                <div>
                    <span class="searchType">查询方式</span>
                    <el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
                        <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="Time-search">查询时间</span>
                    <el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData" v-if="this.types == 4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" size="small" class="btn" @click="search1">搜索</el-button>
                </div>
				<div class="placeEcharts" v-if="isShowEcharts1 == 1" v-loading="loading1">
					<div class="echarts" ref="Echarts1"></div>
				</div>
				<div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>

                <div style="margin-top: 40px;">
                    <span class="timeChoice">时间段选择</span>
                    <el-date-picker v-model="timeRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" size="small" class="btn" @click="search2">搜索</el-button>
                </div>
                <div class="placeEcharts" v-loading="loading2">
                    <div class="echarts1" ref="Echarts2"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            datas: [],
            loading1: false,
            choiceTime: 3,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            timeData: '2019-01',
            types: 3,
            timeRange: ['2019-01-01', '2019-01-03'],
            startTime: '2019-01-01',
            endTime: '2019-01-03',
            loading2: true,
            ids: '',
            floorId: '',
            buildingId: '',
            subId: '',
            dataTime: [],
            dataValue: [],
			dataTimeQuantum: [],
			year: '2019',
			month: '01',
			day: '',
			isShowEcharts1: 1
        }
    },
    methods: {
        init1() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '历史用电'
                },
                color: '#8EF6D2',
                tooltip: {
                    enterable:true,
                    trigger: 'axis',
                    axisPointer : {  
                        type : 'line'
                    },
                    formatter: "{a} <br/>{b}: {c} kW·h"
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.dataTime
                },
                yAxis: {
                    type: 'value',
					name : 'kW·h'
                },
                series: [
                    {
                        name:'历史用电',
                        type:'line',
                        stack: '总量',
                        data: this.dataValue,
                        /* lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        }, */
						areaStyle: {normal: {
						    color: new echarts.graphic.LinearGradient(
						        0, 0, 0, 1,
						        [
						            {offset: 0, color: '#8EF6D2'},
						            {offset: 1, color: '#E7FAF5'}
						        ]
						    )
						}},
                    }
                ]
            };
            myEcharts1.setOption(option1);
        },
        init2() {
            let myChart2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                   left: 'center',
                   text: '时间段内累计用电量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c}"
                },
                series: [
                    {
                        name: '用电量',
                        type: 'gauge',
                        axisLine: {   // 表盘宽度
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
                        splitNumber:4,  // 表盘上显示的刻度个数
                        min:0,
                        // max: 100,
                        max: this.dataTimeQuantum[0].value==0?100:parseInt((Math.random()+1)*this.dataTimeQuantum[0].value),
                        data: this.dataTimeQuantum,
                        detail: {
                            formatter: '{value} kW·h',
                            textStyle: {
                                fontSize: 15,
                                fontWeight: 700
                            }
                        },
                        axisLabel: {
                            textStyle: {       // 属性lineStyle控制线条样式
                                color: '#000',
                                fontSize:8,   //改变仪表盘内刻度数字的大小
                                shadowColor : '#000', //默认透明
                            }
                        },
                        pointer: {   // 指针的宽度和长度
                            width:3,//指针的宽度
                            length:"80%", //指针长度，按照半圆半径的百分比
                            shadowColor : '#ccc', //默认透明
                            shadowBlur: 5
                        },
                        splitLine: {   //分割线的长度
        		        	length: 10
        		        },
                        axisLabel: {
                             distance: 10,
                             fontSize: 10,
                             formatter: function(v){    // 坐标轴数值的刻度取整数
                                 return v.toFixed(0);
                             },
                        }
                    },
                ]
            };
            myChart2.setOption(option2);
        },

        // 树状结构
        initDataTree() {
            let data = {
                subsystemId: this.subId
            }
			console.log(data)
            this.$axios.post(`BMPlatServers/common/querySubsystemBuildings`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.datas = res.data.result;
				}else{
					this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true
                    });
				}
			})
        },

        handleNodeClick(data) {
            if(typeof(data.children)=='undefined') {
                this.buildingId = data.buildingId;
                this.floorId = data.floorId;
                this.ids = data.id;
            }
        },

        // 房间历史
        roomHistory() {
            let data = {
                building_id: this.buildingId,
                floor_id: this.floorId,
                room_id: this.ids,
                id: this.subId,
                queryFlag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day
            };
            this.$axios.post(`BMPlatServers/electricity/querysubroomshiscons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res);
                if(res.data.success) {
                    this.dataTime = [];
                    this.dataValue = [];
                    if(res.data.result.allCons && res.data.result.allCons.length) {
                        res.data.result.allCons.forEach((item)=>{
                            this.dataTime.push(item.time);
                            this.dataValue.push(item.consum)
                        })
                    }else{
						this.isShowEcharts1 = 2
                        this.$message.warning({
							message: '暂无数据',
							showClose: true,
							duration: 1000,
						});
                    }
                    this.init1();
                    this.loading1 = false;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.loading1 = false;
                }
            })
        },
		/* 历史时间段 */
		timeHistory(){
			let data = {
			    building_id: this.buildingId,
			    floor_id: this.floorId,
			    room_id: this.ids,
			    id: this.subId,
			    end_time: this.endTime,
				start_time: this.startTime,
				// queryFlag: this.choiceTime
			};
			this.$axios.post(`BMPlatServers/electricity/querysubroomhisbysjd`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res);
			    if(res.data.success) {
			        this.dataTimeQuantum = [];
					this.dataTimeQuantum.push({value:res.data.result.consumBySjd==undefined?0:res.data.result.consumBySjd});
					this.init2();
                    this.loading2 = false;
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.dataTimeQuantum.push({value:0});
                    this.loading2 = false;
			    }
			})
		},

        search1() {
            if(!this.choiceTime) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            if(this.choiceTime != 1) {
                if(!this.timeData || this.timeData == null) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择时间',
                        duration: 3000
                    })
                    return false;
                }
            }
			this.isShowEcharts1 = 1
            this.loading1 = true;
            this.roomHistory();
        },
        search2() {
            if(!this.timeRange || this.timeRange == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间段',
                    duration: 3000
                })
                return false;
            }
            this.loading2 = true;
			this.timeHistory();
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
		
		let date = new Date();
		let endYear = date.getFullYear();
		let endMonth = date.getMonth() + 1;
		let endDay = date.getDate();
		let endHours = date.getHours();
		let endMinutes = date.getMinutes();
		let endSeconds = date.getSeconds();
		this.startTime = `${endYear}-${endMonth}-1 ${endHours}:${endMinutes}:${endSeconds}`;
		this.endTime = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}`;
		this.timeRange = [];
		this.timeRange.push(this.startTime);
		this.timeRange.push(this.endTime);
        this.subSystemId = window.location.href.split('=')[0];
        this.subId = window.location.href.split('=')[1];
        this.initDataTree();
        this.roomHistory();
		this.timeHistory();
    },
    watch: {
        $route(to, from) {
            this.subSystemId = to.fullPath.split('=')[1];
            this.subId = to.fullPath.split('=')[1];
        },
        choiceTime(item) {
            if(item == 1) {
                this.types = 1
            }else if(item == 2) {
                this.types = 2
            }else if(item == 3) {
                this.types = 3
            }else if(item == 4) {
                this.types = 4
            }
            this.timeData = ''
        },
        timeRange(item) {
            if(item == '' || item == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = item[0];
                this.endTime = item[1];
            }
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

<style lang="scss">
#buildingListRoom{
    .buildingListRoom{
        overflow: hidden;
        .buildingListRoom-left{
            float: left;
            width: 15%;
            height: 800px;
            overflow: auto;
            border-right: 1px solid #ddd;
            &::-webkit-scrollbar{
                width: 0px;
                height: 16px;
            }
            .el-tree-node:focus > .el-tree-node__content {
                background-color: #F0F7FF !important;
                font-weight: 700;
                color: #409EFF;
            }
            .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                font-weight: 700;
                color: #409EFF;
            }
        }
        .buildingListRoom-right{
            width: 84%;
            float: left;
            height: 800px;
            padding-left: 10px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            .Time-search{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
            .placeEcharts{
                padding-top: 20px;
                .echarts{
                    width: 100%;
                    height: 300px;
                }
                .echarts1{
                    width: 100%;
                    height: 400px;
                }
            }
        }
    }
}
</style>
