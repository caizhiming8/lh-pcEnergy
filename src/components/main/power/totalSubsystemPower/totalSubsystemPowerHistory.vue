<template>
    <div id="totalSubsystemPowerHistory">
        <div class="totalSubsystemPowerHistory">
            <div class="placeSearch">
                <span class="searchType">查询方式</span>
                <el-select v-model="choiceTime" placeholder="请选择" style="width: 110px;">
                    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="Time-search">查询时间</span>
                <el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <el-button type="primary" size="small" icon="el-icon-search" class="btn" @click="search1">搜索</el-button>
            </div>
            <div class="placeEcharts">
            	<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading1">
            		<div class="echarts" ref="Echarts1"></div>
            	</div>
            	<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
            </div>

            <div class="timeQuantum">
                <div class="timeQuantum-search">
                    <span class="timeChoice">时间段选择</span>
                    <el-date-picker v-model="timeRange" type="datetimerange" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" size="small" class="btn" @click="search2">搜索</el-button>
                </div>

                <div class="placeEcharts1" v-loading="loading2">
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
            subsystem1: '',
            subsystem2: '',
            choiceTime: 2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            types: 2,
            timeData: '',
            loading1: true,
            loading2: true,
            timeRange: [],
            startTime: '',
            endTime: '',
			year: '',
			month: '',
			day: '',
			dataTime: [],
			dataConsum: [],
			dataConsumBySjd: [],
			isShowEcharts: 1,
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
                    enterable:true,
                    trigger: 'axis',
                    axisPointer : {  
                        type : 'line'
                    },
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
                    data: this.dataTime,
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
                        data: this.dataConsum,
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
                    formatter: "{a} {b} : {c} kwh"
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
                        max: parseInt((Math.random()+1)*this.dataConsumBySjd[0].value),
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
                        },
						data: this.dataConsumBySjd
                    },
                ]
            };
            myChart2.setOption(option2);
        },
		/* 历史用电搜索 */
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
			this.isShowEcharts = 1;
            this.loading1 = true;
			this.initData()
        },
		/* 历史累计用电搜索 */
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
			this.initDataCumulative()
        },
		/* 历史用电 */
		initData(){
			let param = {
				year: this.year,
				month: this.month,
				day: this.day,
				id:this.subsystem1,
				queryFlag:this.choiceTime
			}
			this.$axios.post(`BMPlatServers/electricity/querysubhistoryconsum`,this.$qs.stringify(param)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.dataTime = [];
					this.dataConsum = [];
                    if(res.data.result.allCons && res.data.result.allCons.length) {
                        res.data.result.allCons.forEach((item)=>{
    						this.dataTime.push(item.time)
    						this.dataConsum.push(item.consum)
    					})
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
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.loading1 = false;
				}
			})
		},
		/* 历史累计用电 */
		initDataCumulative(){
			let param = {
				id:this.subsystem2,
				flag:1,
				start_time:this.startTime,
				end_time:this.endTime
			}
			this.$axios.post(`BMPlatServers/electricity/querysubbuildhisbysjd`,this.$qs.stringify(param)).then((res)=>{
                // console.log(res);
				if(res.data.success){
					this.dataConsumBySjd = [];
					this.dataConsumBySjd.push({value:res.data.result.consumBySjd == undefined ? 0 : res.data.result.consumBySjd})
					this.init2();
                    this.loading2 = false;
				}else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.loading2 = false;
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
		this.timeData = `${year}-${month}-${day}`;
		this.year = year;
		/* this.month = month; */
		
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
		this.timeRange = [];
		this.timeRange.push(this.startTime);
		this.timeRange.push(this.endTime);
        this.subsystem1 = window.location.href.split('=')[1];
        this.subsystem2 = window.location.href.split('=')[1];
		this.initData()
		this.initDataCumulative()
    },
    watch: {
        $route(to, from) {
            this.subsystem1 = to.fullPath.split('=')[1];
            this.subsystem2 = to.fullPath.split('=')[1];
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
		timeData(item){
            if(item == '' || item == null) {
                this.year = '';
                this.month = '';
                this.day = '';
            }else{
                this.year=item.split('-')[0]
    			this.month=item.split('-')[1]
    			this.day=item.split('-')[2]
            }
		},
        timeRange(item) {
            if(item && item.length) {
                this.startTime = item[0];
                this.endTime = item[1];
            }else{
                this.startTime = '';
                this.endTime = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#totalSubsystemPowerHistory{
    .totalSubsystemPowerHistory{
        .placeSearch{
            .searchType{
                margin-left: 20px;
            }
            .Time-search{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
        }
        .placeEcharts{
            margin-top: 20px;
            .echarts{
                width: 100%;
                height: 300px;
            }
        }
        .timeQuantum{
            margin-top: 30px;
            .timeQuantum-search{
                .timeChoice{
                    margin-left: 20px;
                }
                .btn{
                    margin-left: 20px;
                }
            }
            .placeEcharts1{
                padding-top: 40px;
                .echarts1{
                    width: 100%;
                    height: 400px;
                }
            }
        }
    }
}
</style>
