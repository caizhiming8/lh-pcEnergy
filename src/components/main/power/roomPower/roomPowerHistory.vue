<template>
    <div id="roomPowerHistory">
        <div class="roomPowerHistory">
            <div class="history-right">
                <div class="placeSearch">
                    <span class="searchType">查询方式</span>
                    <el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
                        <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="Time-search">查询时间</span>
                    <el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData" v-if="this.types == 4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                    <el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
                </div>
                <div class="placeEcharts">
                	<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading1">
                		<div class="echarts" ref="Echarts1"></div>
                	</div>
                	<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
                </div>
                <div class="placeSearch-bottom">
                    <span>选择电流电压功率</span>
                    <el-select v-model="Type" placeholder="请选择" clearable style="width: 110px;">
                        <el-option v-for="item in TypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="timeRange">时间段查询</span>
                    <el-date-picker v-model="TimeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    <el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search1">搜索</el-button>
                    <div style="overflow: hidden; padding-top: 20px;">
                		<span class="dianliuspan">时间段用电量：{{timeRanges}}</span>
                        <div class="place-Echarts" v-if="isShowEcharts1 == 1" v-loading="loading">
                        	<div class="echarts" ref="Echarts2"></div>
                        </div>
                        <div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import session from '../../../../../static/js/session.js';
export default {
    props: ["giveData"],
    data() {
        return{
            choiceTime: 3,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            TypeList: [{label: '电流', value: 1}, {label: '电压', value: 2}, {label: '功率', value: 3}],
            timeData: '',
            types: 3,
            TimeRange: [],
            tableData: [],
            buildingId: '',
            floorId: '',
            id: '',
            year: '',
            month: '',
            day: '',
            dataName: [],
            dataValue: [],
            loading1: true,
            Type: 1,
            timeRanges: '',
            dianliuName: [],
            dianliuList: [],
            loading:true,
            textName: '电流',
            isShowEcharts: 1,
            isShowEcharts1: 1,
            startTime: '',
            endTime: '',
            danwei: 'A'
        }
    },
    methods: {
        init1() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '历史用电',
                    left: 'center'
                },
                tooltip: {
                   /* enterable:true, */
                    trigger: 'axis',
                   /* axisPointer : {  
                        type : 'line'
                    }, */
                    formatter: "{a} <br/>{b}: {c} kW·h"
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
                    data: this.dataName,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
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
                        data:this.dataValue,
                        /* lineStyle: {
                            normal: {
                                width: '1'
                            }
                        }, */
                        /* areaStyle: {
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
			   tooltip: {
					trigger: 'axis',
					formatter: "{a} <br/>{b}: {c}"
			   },
				title: {
					left: 'center',
					text: '时间段数据',
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
			       data: this.dianliuName
			   },
			   yAxis: {
					type: 'value',
					name: this.danwei
			   },
				color: '#8EF6D2',
				dataZoom: [
					{
			           type: 'inside',
			           start: 0,
			           end: 100
					},
					{
						start: 0,
						end: 100,
						handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
						handleSize: '80%',
							handleStyle: {
								color: 'pink',
								shadowBlur: 3,
								shadowColor: 'red',
								shadowOffsetX: 2,
								shadowOffsetY: 2
						   }
					}
				],
			   series: [
			       {
						name:'时间段历史数据',
						type:'line',
						stack: '总量',
						lineStyle: {
			               normal: {
			                   width: '1'
			               }
			           },
						areaStyle: {
							color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
								colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
								global: false
							}
						},
						data: this.dianliuList,
			       }
			   ]
			}
			myChart2.setOption(option2);
            /* let myChart2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                   left: 'center',
                   text: '时间段用电量',
                },
                tooltip : {      // 鼠标滑过的显示值得处理
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
                        max:this.timeRanges[0].value==0?100:parseInt((Math.random()+1)*this.timeRanges[0].value),
                        detail: {
                            formatter:'{value} kW·h',
                            textStyle: {
                                fontSize: 14,
                                fontWeight: '700'
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
                        },
                        data: this.timeRanges,
                    },

                ]
            };
            myChart2.setOption(option2);

            let myChart3 = this.$echarts.init(this.$refs.Echarts3);
            let option3 = {
                title: {
                   left: 'center',
                   text: `${this.textName}`,
                },
                tooltip : {      // 鼠标滑过的显示值得处理
                    formatter: "{a} {b} : {c}"
                },
                series: [
                    {
                        name: '',
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
                        max:this.dianliuList[0].value==0?100:parseInt((Math.random()+1)*this.dianliuList[0].value),
                        detail: {
                            formatter:'{value} A',
                            textStyle: {
                                fontSize: 14,
                                fontWeight: '700'
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
                        },
                        data: this.dianliuList,
                    },

                ]
            };
            myChart3.setOption(option3); */
        },

        // 初始化数据
        initData() {
            let data = {
                building_id: this.buildingId,
                floor_id: this.floorId,
                room_id: this.id,
                queryFlag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day,
                startTime: this.startTime,
                endTime: this.endTime
            };
            this.$axios.post(`BMPlatServers/electricity/queryroomshiscons`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataName = [];
                    this.dataValue = [];
					if(res.data.result.allCons&&res.data.result.allCons.length){
						res.data.result.allCons.forEach((item)=>{
						    this.dataName.push(item.time);
						    this.dataValue.push(item.consum)
						});
					}else{
						this.isShowEcharts = 2;
						this.$message.warning({
							message: '暂无数据',
							showClose: true,
							duration: 1000,
						});
					}
                    this.init1();
                    this.loading1 = false;
                }else{
                    this.dataName = [];
                    this.dataValue = [];
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },

        // 时间段查询
        timeRange() {
            let data = {
                building_id: this.buildingId,
                floor_id: this.floorId,
                room_id: this.id,
                queryFlag: this.Type,
                start_time: this.startTime,
                end_time: this.endTime
            };
            this.$axios.post(`BMPlatServers/electricity/queryroomhisbysjd`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
            		this.timeRanges = res.data.result.consumBySjd==undefined?0:res.data.result.consumBySjd;
            		if(res.data.result.hisInfoList&&res.data.result.hisInfoList.length){
            			res.data.result.hisInfoList.forEach((item)=>{
            			    this.dianliuName.push(item.collect_time);
            			    this.dianliuList.push(item.info)
            			});
            		}else{
            			this.isShowEcharts1 = 2;
            			this.$message.warning({
            				message: '暂无数据',
            				showClose: true,
            				duration: 1000,
            			});
            		}
                    this.init2();
            		this.loading = false;
                }else{
            		this.timeRanges = ''
            		this.isShowEcharts1 = 2;
                    this.loading = false;
                    this.$message.warning({
            			message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
            		});
                }
            })
        },

        search() {
            this.loading1 = true;
			this.isShowEcharts = 1;
            this.initData();
        },
        search1() {
            this.isShowEcharts1 = 1;
            this.loading = true;
            this.timeRange();
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
		let dates1 = new Date();
		dates1 = dates1.getTime();
		dates1 = dates1 - 3*24*60*60*1000;
		let yesToday1 = new Date(dates1);
		let endYear1 = yesToday1.getFullYear();
		let endMonth1 = yesToday1.getMonth() + 1;
		let endDay1 = yesToday1.getDate();
		let endHours1 = yesToday1.getHours();
		let endMinutes1 = yesToday1.getMinutes();
		let endSeconds1 = yesToday1.getSeconds();
		this.startTime = `${endYear1}-${endMonth1}-${endDay1} ${endHours1}:${endMinutes1}:${endSeconds1}`;
		this.endTime = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}`;
		this.TimeRange = [];
		this.TimeRange.push(this.startTime);
		this.TimeRange.push(this.endTime);
        this.buildingId = window.location.href.split('=')[1];
        if(session.get('dataString')) {
            this.floorId = session.get('dataString').floorId;
            this.id = session.get('dataString').roomId;
        }
        this.initData();
        this.timeRange();
    },
    watch: {
        Type(item) {
            if(item == 1) {
                this.textName = '电流';
        		this.danwei = 'A'
            }else if(item == 2) {
                this.textName = '电压';
        		this.danwei = 'V'
            }else if(item == 3) {
                this.textName = '功率';
        		this.danwei = 'kw·h'
            }
        },
        giveData(item) {
            if(typeof(item.chidren) == 'undefined') {
                session.set('dataString', item);
                this.floorId = item.floorId;
                this.id = item.roomId;
                this.loading = true;
                this.initData();
            }
        },
        $route(item) {
            this.buildingId = item.fullPath.split('=')[1];
        },
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
            if(item == '' || item == null) {
                this.year = '';
                this.month = '';
                this.day = '';
            }else{
                this.year = item.split('-')[0];
                this.month = item.split('-')[1];
                this.day = item.split('-')[2];
            }
        },
        TimeRange(item) {
            if(item == '' || item == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = item[0];
                this.endTime = item[1];
            }
        }
    },
    components: {

    }
}
</script>

<style lang="scss" scoped>
#roomPowerHistory{
    .roomPowerHistory{
        .history-right{
            width: 100%;
            height: 850px;
            padding-left: 10px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            &::-webkit-scrollbar{
                width: 1px;
            }
            .placeSearch{
                .Time-search{
                    margin-left: 20px;
                }
                .btn{
                    margin-left: 20px;
                }
            }
            .echarts{
                width: 100%;
                height: 300px;
            }
            .placeSearch-bottom{
                margin-top: 20px;
                overflow: hidden;
                .btn{
                    margin-left: 20px;
                }
                .dianliuspan{
                	font-size: 16px;
                	font-weight: 400;
                	color: #434343;
                	margin-left: 75%;
                }
                .place-Echarts{
                	.echarts{
                		width: 100%;
                		height: 300px;
                	}
                }
            }
        }
    }
}
</style>
