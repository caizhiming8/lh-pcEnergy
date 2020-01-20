<template>
    <div id="buildingListHistory">
        <div class="buildingListHistory">
            <div class="buildingListHistory-right">
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
                    <el-button type="primary" size="small" icon="el-icon-search" class="btn" @click="search1">搜索</el-button>
                </div>
                <div class="buildingListHistory-right-top">
                    <div class="place-Echarts" v-if="isShowEcharts1 == 1" v-loading="loading1">
                    		<div class="echarts" ref="Echarts1"></div>
					</div>
					<div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>
                </div>

                <div class="buildingListHistory-right-placeSearch">
                    <span class="timeChoice">时间段选择</span>
                    <el-date-picker v-model="timeRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" size="small" class="btn" @click="search2">搜索</el-button>
                </div>
                <div class="buildingListHistory-right-middle" v-loading="loading2">
                    <div class="echarts" ref="Echarts2"></div>
                </div>

                <div>
                    <span class="searchType">查询方式</span>
                    <el-select v-model="choiceTime1" placeholder="请选择" clearable style="width: 110px;">
                        <el-option v-for="item in TimeList1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="Time-search">查询时间</span>
                    <el-date-picker v-model="timeData1" v-if="this.types1 == 1" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData1" v-if="this.types1 == 2" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData1" v-if="this.types1 == 3" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" class="btn" size="small" @click="search3">搜索</el-button>
                </div>
                <div class="buildingListHistory-right-bottom">
                    <div class="place-Echarts" v-if="isShowEcharts3 == 1" v-loading="loading3">
                    	<div class="echarts" ref="Echarts3"></div>
                    </div>
                    <div class="noDataEcharts" v-if="isShowEcharts3 == 2">暂无数据</div>
                </div>

                <div style="margin-top: 40px;">
                    <span class="searchType">查询方式</span>
                    <el-select v-model="choiceTime2" placeholder="请选择" clearable style="width: 110px;">
                        <el-option v-for="item in TimeList2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="Time-search">查询时间</span>
                    <el-date-picker v-model="timeData2" v-if="this.types2 == 1" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData2" v-if="this.types2 == 2" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="timeData2" v-if="this.types2 == 3" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                    <el-button type="primary" icon="el-icon-search" size="small" class="btn" @click="search4">搜索</el-button>
                </div>
                <div class="placeTable">
                    <el-table tooltip-effect="light" :data="tableData" stripe v-loading="loading4" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
                        <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
                            <template slot-scope="scope">
                                <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="room_name" label="房间名字" align='center'></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="consum" label="用电量" align='center'></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="collect_time" label="时间" align='center'></el-table-column>
		            </el-table>
                    <div class="pagination">
                        <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size='pageSize'  layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import session from '../../../../../static/js/session.js';
export default {
    props: ['giveSonData'],
    data() {
        return{
            choiceTime: 2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            timeData: '2019',
            types: 2,
            timeRange: ['2019-01-01', '2019-01-03'],
            startTime: '2019-01-01',
            endTime: '2019-01-03',
            choiceTime1: 3,
            TimeList1: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            types1: 3,
            timeData1: '2019-01-01',
			choiceTime2: 3,
			TimeList2: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
			types2: 3,
			timeData2: '2019-01',
            val: 1,
			tableData: [],
            pageSize: 10,
            currentPage: 1,
            pageTotal: 0,
			subId: '',
			buildingId: '',
			year: '2019',
			month: '01',
			day: '01',
			dataMouth: [],
			dataHistory: [],
			dataTime: [],
			dataRoom: [],
			dataRoomTop: [],
            loading1: false,
            loading2: true,
            loading3: true,
            loading4: true,
			isShowEcharts1: 1,
			isShowEcharts3: 1,
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
                    right: '7%',
                    bottom: '7%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.dataMouth,
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
                        data: this.dataHistory,
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
                        max: this.dataTime[0].value==0?100:parseInt((Math.random()+1)*this.dataTime[0].value),
                        data: this.dataTime,
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
        init3() {
            let myChart3 = this.$echarts.init(this.$refs.Echarts3);
            let option3 = {
                color: ['#3398DB'],
                title: {
                    text: '房间top项'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    },
                    formatter: "{a} <br/>{b}: {c} kW·h"
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
                        data : this.dataRoom,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            interval:0,
                            rotate:-40
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
						name : 'kW·h'
                    }
                ],
                series : [
                    {
                        name:'房间top值',
                        type:'bar',
                        barWidth: '60%',
                        data:this.dataRoomTop,
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
            myChart3.setOption(option3);
        },
		// 初始化数据
		/* 历史用电 */
		initData() {
			let data = {
				building_id: this.buildingId,
				id: this.subId,
				queryFlag: this.choiceTime,
				year: this.year,
				month: this.month,
				day: this.day,
				hour: ''
			};
			this.$axios.post(`BMPlatServers/electricity/querysubbuildhisenereffi`, this.$qs.stringify(data)).then((res)=>{
                this.dataMouth = []
                this.dataHistory = []
				if(res.data.success) {
                    if(res.data.result.allCons && res.data.result.allCons.length) {
                        res.data.result.allCons.forEach((item)=>{
    						this.dataMouth.push(item.time);
    						this.dataHistory.push(item.consum)
    					});
                    }else{
						this.isShowEcharts1 = 2;
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
                    this.init1();
				}
			})

		},
		/* 时间段累计 */
		initDataTime() {
			let data = {
				building_id: this.buildingId,
				id: this.subId,
				flag: 2
			};
			this.$axios.post(`BMPlatServers/electricity/querysubbuildhisbysjd`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res);
				if(res.data.success) {
					this.dataTime = []
					this.dataTime.push({value: res.data.result.consumBySjd==undefined?0: res.data.result.consumBySjd})
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
		},
		/* 房间Top值 */
		initDataTop() {
			let data = {
				building_id: this.buildingId,
				id: this.subId,
				queryFlag: this.choiceTime1,
				year: this.year,
				month: this.month,
				day: this.day,
				hour: ''
			};
			this.$axios.post(`BMPlatServers/electricity/querysubbuildroomeneffictop`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
                this.dataRoom = []
                this.dataRoomTop = [];
				if(res.data.success) {
                    if(res.data.result.topInfoList && res.data.result.topInfoList.length) {
                        res.data.result.topInfoList.forEach((item)=>{
    						this.dataRoom.push(item.room_name);
    						this.dataRoomTop.push(item.consum);
    					});
                    }else{
						this.isShowEcharts3 = 2;
                        this.$message.warning({
							message: '暂无数据',
							showClose: true,
							duration: 1000,
						});
                    }
                    this.init3();
                    this.loading3 = false;
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.loading3 = false;
                    this.init3();
				}
			})
		},
		/* 房间值列表 */

		initDataQueryRoom() {
			let data = {
				building_id: this.buildingId,
				id: this.subId,
				queryFlag: this.choiceTime2,
				year: this.year,
				month: this.month,
				day: this.day,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				hour: ''
			};
			// console.log(data)
			this.$axios.post(`BMPlatServers/electricity/querysubbuildroomenefficcomp`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res);
				if(res.data.success){
					this.tableData = res.data.result.consumInfoList;
					this.pageTotal = res.data.result.count;
                    this.loading4 = false;
				}else{
                    this.loading4 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
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
			this.isShowEcharts1 = 1;
			this.initData();
            this.loading1 = true;
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
			this.initDataTime();
        },
        search3() {
            if(!this.choiceTime1 || !this.timeData1 || this.timeData1 == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
			this.isShowEcharts3 = 1;
            this.loading3 = true;
			this.initDataTop();
        },
		search4() {
            if(!this.choiceTime2 || !this.timeData2 || this.timeData2 == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.loading4 = true;
			this.initDataQueryRoom();
		},
        // 分页
        handleCurrentChange(val) {
            this.val = val;
            this.loading4 = true;
			let data = {
				building_id: this.buildingId,
				id: this.subId,
				queryFlag: this.choiceTime2,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				year: this.year,
				month: this.month,
				day: this.day,
				hour: ''
			};
			this.$axios.post(`BMPlatServers/electricity/querysubbuildroomenefficcomp`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res);
				if(res.data.success){
					this.tableData = res.data.result.consumInfoList;
					this.pageTotal = res.data.result.count;
                    this.loading4 = false;
				}else{
                    this.loading4 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
        },
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
        this.subId = window.location.href.split('=')[1];
        if(session.get('buildingId')) {
            this.buildingId = session.get('buildingId');
        }
        let Dom = document.querySelector('.buildingListHistory .buildingListHistory-right')
        Dom.style.height = window.screen.availHeight- 400 + 'px';
		this.initData();
		this.initDataTime();
		this.initDataTop();
		this.initDataQueryRoom();
    },
    watch: {
        giveSonData(item) {
            if(typeof(item.chidren) == 'undefined') {
                this.loading1 = true;
                this.loading2 = true;
                this.loading3 = true;
                this.loading4 = true;
                this.buildingId = item.id;
                session.set('buildingId', item.id);
                this.initData();
        		this.initDataTime();
        		this.initDataTop();
        		this.initDataQueryRoom();
            }
        },
        $route(to, from) {
            this.subId = to.fullPath.split('=')[1];
            this.loading1 = true;
            this.loading2 = true;
            this.loading3 = true;
            this.loading4 = true;
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
        choiceTime1(item) {
            if(item == 1) {
                this.types1 = 1
            }else if(item == 2) {
                this.types1 = 2
            }else if(item == 3) {
                this.types1 = 3
            }
            this.timeData1 = ''
        },
		choiceTime2(item) {
		    if(item == 1) {
		        this.types2 = 1
		    }else if(item == 2) {
		        this.types2 = 2
		    }else if(item == 3) {
		        this.types2 = 3
		    }
		    this.timeData2 = ''
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

		},
		timeData1(item) {
            if(item) {
                this.year = item.split('-')[0];
    			this.month = item.split('-')[1];
    			this.day = item.split('-')[2];
            }else{
                this.year = '';
                this.month = '';
                this.day = '';
            }
		},
		timeData2(item) {
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
#buildingListHistory{
    .buildingListHistory{

        .buildingListHistory-right{
            padding-left: 20px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            overflow-y: auto;
            .Time-search{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
            .buildingListHistory-right-top{
                .echarts{
                    width: 100%;
                    height: 300px;
                }
            }
            .buildingListHistory-right-placeSearch{
                margin-top: 20px;
                .btn{
                    margin-left: 20px;
                }
            }
            .buildingListHistory-right-middle{
                padding-top: 20px;
                .echarts{
                    width: 100%;
                    height: 400px;
                }
            }
            .buildingListHistory-right-bottom{
                padding-top: 20px;
                .echarts{
                    width: 100%;
                    height: 300px;
                }
            }
            .placeTable{
                margin-top: 30px;
                .pagination{
                    text-align: right;
                    margin: 15px;
                }
            }
        }
    }
}
</style>
