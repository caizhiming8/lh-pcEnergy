<template>
    <div id="buildingPowerHistory">
        <div class="buildingPowerHistory">
            <span class="searchType">查询方式</span>
            <el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
                <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="Time-search">查询时间</span>
            <el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData" v-if="this.types == 4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            <span style="margin-left: 40px;">选择四类分项</span>
            <el-select v-model="four" placeholder="请选择" clearable style="width: 150px;">
                <el-option v-for="item in fourList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <div class="placeEcharts1">
        	<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading">
        		<div class="echarts" ref="Echarts1"></div>
        	</div>
        	<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
        </div>
        <div class="placeEcharts1">
        	<div class="place-Echarts" v-if="isShowEcharts1 == 1" v-loading="loading1">
        		<div class="echarts" ref="Echarts2"></div>
        	</div>
        	<div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>
        </div>
        <div class="placeDiv-bottom">
            <div class="changes">
                <span class="searchType">时间段查询</span>
                <el-date-picker v-model="TimeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search1">搜索</el-button>
                <div class="placeEcharts" v-loading="loading2">
                    <div class="echarts" ref="Echarts3"></div>
                    <div class="echarts" ref="Echarts4"></div>
                </div>
            </div>
        </div>

        <div class="buildingPowerHistory-bottom">
            <span style="margin-left: 20px;">选择四类分项</span>
            <el-select v-model="four" placeholder="请选择" clearable style="width: 150px;">
                <el-option v-for="item in fourList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="searchType">查询方式</span>
            <el-select v-model="choiceTime1" placeholder="请选择" clearable style="width: 110px;">
                <el-option v-for="item in TimeList1" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="Time-search">查询时间</span>
            <el-date-picker v-model="timeData1" v-if="this.types1 == 1" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData1" v-if="this.types1 == 2" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData1" v-if="this.types1 == 3" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            <el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search2">搜索</el-button>

            <div class="placeEcharts1">
            	<div class="place-Echarts" v-if="isShowEcharts4 == 1" v-loading="loading4">
            		<div class="echarts" ref="Echarts5"></div>
            	</div>
            	<div class="noDataEcharts" v-if="isShowEcharts4 == 2">暂无数据</div>
            </div>
            <div class="placeEcharts1">
            	<div class="place-Echarts" v-if="isShowEcharts5 == 1" v-loading="loading5">
            		<div class="echarts" ref="Echarts6"></div>
            	</div>
            	<div class="noDataEcharts" v-if="isShowEcharts5 == 2">暂无数据</div>
            </div>
        </div>

        <div class="placeTable">
            <span class="searchType">查询方式</span>
            <el-select v-model="choiceTime1" placeholder="请选择" clearable style="width: 110px;">
                <el-option v-for="item in TimeList1" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="Time-search">查询时间</span>
            <el-date-picker v-model="timeData2" v-if="this.types1 == 1" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData2" v-if="this.types1 == 2" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData2" v-if="this.types1 == 3" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            <el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search3">搜索</el-button>
            <div class="table">
                <el-table tooltip-effect="light" :data="tableData" border style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
                    <el-table-column :show-overflow-tooltip="true" type="index" align='center' label="序号" width="60">
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="room_name" label="房间名字" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="consum" label="用电量" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="collect_time" label="时间" align='center'></el-table-column>
    			</el-table>
                <div class="paginition">
                    <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size='pageSize'  layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return{
            building: '',
            loading: true,
            loading1: true,
            loading2: true,
            loading4: true,
            loading5: true,
            choiceTime: 2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            TimeList1: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            timeData: '',
            timeData1: '',
            timeData2: '',
            choiceTime1: 1,
            types: 2,
			types1: 1,
            TimeRange: [],
            startTime: '',
            endTime: '',
            fourList: [{label: '照明插座用电', value: 1}, {label: '空调用电', value: 2}, {label: '动力用电', value: 3}, {label: '特殊用电', value: 4}],
            four: 1,
            val: 1,
            pageSize: 10,
            tableData: [],
            year: '',
            month: '',
            day: '',
            nameList1: [],
            dataValue1: [],
            datavalue2: [],
            nameList2: [],
            dataValue2: [],
            dataNum: [],
            dataName: [],
            dataValue: [],
            currentPage: 1,
            pageTotal: 0,
            dataName1: [],
            dataValueTop: [],
            nameTop: [],
            nameValueTop: [],
            fourName: '照明插座用电',
			isShowEcharts: 1,
			isShowEcharts1: 1,
			isShowEcharts4: 1,
			isShowEcharts5: 1,
			year1: '',
			month1: '',
			day1: '',
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
                    data: this.nameList1,
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
                        data:this.dataValue1,
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

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                    text: `四类分项: ${this.fourName}`,
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
                    data: this.nameList2,
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
                        name:'四类分项',
                        type:'line',
                        stack: '总量',
                        data:this.dataValue2,
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
            myEcharts2.setOption(option2);
        },
        init2() {
            let myEcharts3 = this.$echarts.init(this.$refs.Echarts3);
            let option3 = {
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
                        max: this.dataNum[0].value==0?100:parseInt((Math.random()+1)*this.dataNum[0].value),
                        data: this.dataNum,
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
            myEcharts3.setOption(option3);

            let myEcharts4 = this.$echarts.init(this.$refs.Echarts4);
            let option4 = {
                title: {
                   left: 'center',
                   text: '时间段四类分项用电量',
                },
                tooltip: {
                   trigger: 'item',
                   formatter: "{a} <br/>{b}: {c} ({d}%)"
               },
               color: ['#08A9FE', '#8693F3', '#FF908F', '#FFC600'],
               legend: {
                   orient: 'vertical',
                   x: 'left',
                   data:this.dataName
               },
               series: [
                   {
                       name:'四类分项用电量',
                       type:'pie',
                       radius: ['50%', '70%'],
                       avoidLabelOverlap: false,
                       label: {
                           normal: {
                               show: false,
                               position: 'center'
                           },
                           emphasis: {
                               show: true,
                               textStyle: {
                                   fontSize: '18',
                                   fontWeight: 'bold'
                               }
                           }
                       },
                       labelLine: {
                           normal: {
                               show: false
                           }
                       },
                       data:this.dataValue
                   }
               ]
            };
            myEcharts4.setOption(option4);
        },
        init3() {
            let myEcharts5 = this.$echarts.init(this.$refs.Echarts5);
            let option5 = {
                title: {
                    left: 'center',
                    text: '房间top'
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
                        data : this.dataName1,
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
                        name:'房间top',
                        type:'bar',
                        barWidth: '60%',
                        data:this.dataValueTop,
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
            myEcharts5.setOption(option5);

            let myEcharts6 = this.$echarts.init(this.$refs.Echarts6);
            let option6 = {
                title: {
                   left: 'center',
                   text: `四类分项top: ${this.fourName}`,
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
                        data : this.nameTop,
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
                        name:'四类分项top',
                        type:'bar',
                        barWidth: '60%',
                        data:this.nameValueTop,
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
            myEcharts6.setOption(option6);
        },

        // 初始化数据
        initData() {
            // 历史用电
            let data = {
                queryFlag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day,
                building_id: this.building,
                classId: this.four
            };
			console.log(data)
            this.$axios.post(`BMPlatServers/electricity/querybuildhisenereffi`, this.$qs.stringify(data)).then((res)=>{
                this.nameList1 = [];
                this.dataValue1 = [];

                this.nameList2 = [];
                this.dataValue2 = [];
                if(res.data.success) {
					console.log(res);
                    // 历史用电
                    if(res.data.result.allCons && res.data.result.allCons.length) {
                        res.data.result.allCons.forEach((item)=>{
                            this.nameList1.push(item.time);
                            this.dataValue1.push(item.consum)
                        });
                    }else{
						this.isShowEcharts = 2;
					}

                    // 四类分项用电
                    if(res.data.result.classAllCons && res.data.result.classAllCons.length) {
                        res.data.result.classAllCons.forEach((item)=>{
                            this.nameList2.push(item.time);
                            this.dataValue2.push(item.consum);
                        });
                    }else{
						this.isShowEcharts1 = 2;
					}
                    this.init1();
                    this.loading = false;
                    this.loading1 = false;
                    this.loading2 = false;
                    this.loading4 = false;
                    this.loading5 = false;
                }else{
                    this.nameList1 = [];
                    this.dataValue1 = [];

                    this.nameList2 = [];
                    this.dataValue2 = [];
                    this.loading = false;
                    this.loading1 = false;
                    this.loading2 = false;
                    this.loading4 = false;
                    this.loading5 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.init1();
                }
            });
        },

        // 时间段查询
        initData1() {
            let params = {
                building_id: this.building,
                start_time: this.startTime,
                end_time: this.endTime
            };
			console.log(params)
            this.$axios.post(`BMPlatServers/electricity/querybuildhisbysjd`, this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    // 时间段总用电
                    this.dataNum = [];
                    this.dataNum.push({value: res.data.result.consumBySjd ==undefined?0:res.data.result.consumBySjd});

                    // 时间段四类分项用电
                    this.dataName = [];
                    this.dataValue = [];
					if(res.data.result.classConsumInfoList&&res.data.result.classConsumInfoList.length){
						res.data.result.classConsumInfoList.forEach((item)=>{
						    this.dataName.push(item.class_name);
						    this.dataValue.push({name: item.class_name, value: item.consum});
						})
					}else{
						this.dataValue = [{name:"照明插座用电",value:0},{name:"空调用电",value:0},{name:"动力用电",value:0},{name:"特殊用电",value:0}];
						this.dataName = ["照明插座用电","空调用电","动力用电","特殊用电"];
					}
                    this.init2();
                    this.loading = false;
                    this.loading1 = false;
                    this.loading2 = false;
                    this.loading4 = false;
                    this.loading5 = false;
                }else{
                    this.loading = false;
                    this.loading1 = false;
                    this.loading2 = false;
                    this.loading4 = false;
                    this.loading5 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },

        // top
        initTop() {
            let params = {
                queryFlag: this.choiceTime1,
                year: this.year,
                month: this.month,
                day: this.day,
                building_id: this.building,
                classId: this.four,
                hour: ''
            };
			console.log(params);
            this.$axios.post(`BMPlatServers/electricity/querybuildroomeneffictop`, this.$qs.stringify(params)).then((res)=>{
                this.dataName1 = [];
                this.dataValueTop = [];

                this.nameTop = [];
                this.nameValueTop = [];
				console.log(res);
                if(res.data.success) {
					
                    // 房间top
                    if(res.data.result.topInfoList && res.data.result.topInfoList.length) {
                        res.data.result.topInfoList.forEach((item)=>{
                            this.dataName1.push(item.room_name);
                            this.dataValueTop.push(item.consum)
                        });
                    }else{
						this.isShowEcharts4 = 2;
					}

                    // 四类分项top
					if(res.data.result.classTopInfoList&&res.data.result.classTopInfoList.length){
						res.data.result.classTopInfoList.forEach((item)=>{
						    this.nameTop.push(item.roomName);
						    this.nameValueTop.push(item.consum);
						});
					}else{
						this.isShowEcharts5 = 2;
					}
                    this.init3();
                    this.loading = false;
                    this.loading1 = false;
                    this.loading2 = false;
                    this.loading4 = false;
                    this.loading5 = false;
                }else{
                    this.loading = false;
                    this.loading1 = false;
                    this.loading2 = false;
                    this.loading4 = false;
                    this.loading5 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.init3();
                }
            })
        },

        // table
        initTable() {
            let params = {
                queryFlag: this.choiceTime1,
                year: this.year,
                month: this.month,
                day: this.day,
                building_id: this.building,
                hour: '',
                currentPage: this.currentPage,
                pageSize: this.pageSize
            };
			console.log(params);
            this.$axios.post(`BMPlatServers/electricity/querybuildroomenefficcomp`, this.$qs.stringify(params)).then((res)=>{
                console.log(res);
                if(res.data.success) {
					console.log(res);
					this.tableData = []
					this.pageTotal = ''
                    this.tableData = res.data.result.consumInfoList;
                    this.pageTotal = res.data.result.count;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },

        handleCurrentChange(val) {
            this.val = val;
            let params = {
                queryFlag: this.choiceTime1,
                year: this.year,
                month: this.month,
                day: this.day,
                building_id: this.building,
                hour: '',
                currentPage: val,
                pageSize: this.pageSize
            };
            this.$axios.post(`BMPlatServers/electricity/querybuildroomenefficcomp`, this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.consumInfoList;
                    this.pageTotal = res.data.result.count;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },

        search() {
			this.isShowEcharts = 1;
			this.isShowEcharts1 = 1;
			this.loading = true;
			this.loading1 = true;
            if(!this.choiceTime) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            if(this.choiceTime != 1) {
                if(this.timeData == '' || this.timeData == null) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择时间',
                        duration: 3000
                    })
                    return false;
                }
            }
            if(!this.four) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择四类分项',
                    duration: 3000
                })
                return false;
            }
            this.initData();
        },
        search1() {
            if(this.TimeRange == '' || this.TimeRange == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间段',
                    duration: 3000
                })
                return false;
            }
            this.initData1();
            this.loading2 = true;
        },
        search2() {
			this.isShowEcharts4 = 1;
			this.isShowEcharts5 = 1;
			this.loading4 = true;
			this.loading5 = true;
            if(!this.four) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择四类分项',
                    duration: 3000
                })
                return false;
            }
            if(!this.choiceTime1) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            if(this.timeData1 == '' || this.timeData1 == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.initTop();
        },
        search3() {
            if(!this.choiceTime1) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            if(this.timeData2 == '' || this.timeData2 == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.initTable();
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
		this.timeData1 = `${year}-${month}-${day}`;
		this.timeData2 = `${year}-${month}-${day}`;
		this.year = year;
		this.year1 = year;
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
		this.TimeRange = [];
		this.TimeRange.push(this.startTime);
		this.TimeRange.push(this.endTime);
        this.building = window.location.href.split('=')[1];
        this.initData1();
        this.initData();
        this.initTop();
        this.initTable();
    },
    watch: {
        four(item) {
            if(item == 1) {
                this.fourName = '照明插座用电';
            }else if(item == 2) {
                this.fourName = '空调用电';
            }else if(item == 3) {
                this.fourName = '动力用电';
            }else if(item == 4) {
                this.fourName = '特殊用电';
            }
        },
        $route(to,from) {
            this.building = to.fullPath.split('=')[1];
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
        choiceTime1(item) {
            if(item == 1) {
                this.types1 = 1
            }else if(item == 2) {
                this.types1 = 2
            }else if(item == 3) {
                this.types1 = 3
            }
            this.timeData = ''
            this.timeData1 = ''
            this.timeData2 = ''
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
                this.year1 = item.split('-')[0];
                this.month1 = item.split('-')[1];
                this.day1 = item.split('-')[2];
            }else{
                this.year1 = '';
                this.month1 = '';
                this.day1 = '';
            }
        },
        timeData2(item) {
            if(item) {
                this.year1 = item.split('-')[0];
                this.month1 = item.split('-')[1];
                this.day1 = item.split('-')[2];
            }else{
                this.year1 = '';
                this.month1 = '';
                this.day1 = '';
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
    }
}
</script>

<style lang="scss" scoped>
#buildingPowerHistory{
    .buildingPowerHistory{
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
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom: 3px solid #ddd;
        overflow: hidden;
        .echarts{
            width: 100%;
            height: 300px;
            float: left;
        }
    }
	.placeEcharts1{
	    padding-top: 20px;
	    padding-bottom: 20px;
	    border-bottom: 3px solid #ddd;
	    overflow: hidden;
		width: 50%;
		float: left;
		.place-Echarts{
			width: 100%;
			height: 300px;
			float: left;
			.echarts{
				width: 100%;
				height: 300px;
				float: left;
			}
		}
	}
    .placeDiv-bottom{
        .choicePower{
            margin-left: 20px;
            margin-top: 30px;
        }
        .searchType{
            margin-left: 20px;
            margin-top: 30px;
        }
        .Time-search{
            margin-left: 20px;
            margin-top: 30px;
        }
        .btn{
            margin-left: 20px;
            margin-top: 30px;
        }
        .echarts{
            width: 100%;
            height: 300px;
        }
        .placeEcharts{
            overflow: hidden;
            .echarts{
                float: left;
                width: 50%;
                height: 300px;
            }
        }
    }
    .buildingPowerHistory-bottom{
        margin-top: 30px;
        padding-bottom: 20px;
        overflow: hidden;
        .btn{
            margin-left: 20px;
        }
        .placeEcharts1{
            width: 50%;
            float: left;
            .echarts{
                width: 100%;
                height: 300px;
            }
        }
    }
    .placeTable{
        margin-top: 30px;
        .searchType{
            margin-left: 20px;
        }
        .Time-search{
            margin-left: 20px;
        }
        .btn{
            margin-left: 20px;
        }
        .table{
            margin-top: 20px;
            .paginition{
                text-align: right;
                margin: 15px;
            }
        }
    }
}
</style>
