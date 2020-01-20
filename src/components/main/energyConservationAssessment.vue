<template>
    <div id="energyConservationAssessment">
        <div class="energyConservationAssessment">
            <div class="choiceTime">
                <span>查询方式</span>
                <el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
                    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="Time-search">查询时间</span>
                <el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>

            <div class="consumption-center">
                <div class="consumption-center-inner">
    				<div class="placeEcharts">
    					<div class="place-Echarts" v-loading="loading1">
    						<div class="echarts" ref="Echarts1"></div>
    					</div>
    					<!-- <div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div> -->
    				</div>
    				<div class="placeEcharts">
    					<div class="place-Echarts"  v-loading="loading2">
    						<div class="echarts" ref="Echarts2"></div>
    					</div>
    					<!-- <div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div> -->
    				</div>
                </div>
            </div>
            <div class="powerZongHot">
                <div class="powerZongHot-left">
                    <div class="echarts" ref="Echarts5" v-loading="loading5"></div>
                </div>
                <div class="powerZongHot-left">
                    <div class="echarts" ref="Echarts6" v-loading="loading6"></div>
                </div>
            </div>

            <div class="waterEnegy">
                <div class="waterEnegy-left">
                    <div class="echarts" ref="Echarts3" v-loading="loading3"></div>
                </div>
                <div class="waterEnegy-left">
                    <div class="echarts" ref="Echarts4" v-loading="loading4"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            choiceTime: 2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            timeData: '',
            types: 2,
            isShowEcharts: 1,
            isShowEcharts1: 1,
            loading1: true,
            loading2: true,
            loading3: true,
            loading4: true,
            loading5: true,
            loading6: true,
            year: '',
            month: '',
            day: "",
            isShowEcharts2: 1,
            dataName: [],
            dataValue: [],
            dataValue3: [],
            dataName3: [],
            dataName1: [],
            dataValue1: [],
            dataName4: [],
            dataValue4: [],
            dataName5: [],
            dataValue5: [],
            dataName6: [],
            dataValue6: []
        }
    },
    methods: {
        init() {
		    let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
		    let option1 = {
		        title: {
		            text: '用电总能效',
		            subtext: '人均',
		            left: 'center'
		        },

		        tooltip: {
		            trigger: 'axis',
		            formatter: "{a} <br/>{b}: {c} kW·h/人"
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
		            data: this.dataName,
		            axisLabel: {
		                interval:0,
		                rotate:-40
		            }
		        },
		        yAxis: {
		            type: 'value',
					name : 'kW·h/人',
					left: '4%'
		        },
		        series: [
		            {
		                name:'统计总能效',
		                type:'line',
		                stack: '总量',
		                data:this.dataValue,
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
                        markLine: {
                            data: [
                                {type : 'average', name : '平均值', silent:true, lineStyle:{ type:"solid", color:"#409fee"}}
                            ]
                        }
		            },
		        ],
		    };
		    myEcharts1.setOption(option1);
		    let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
		    let option2 = {
		        title: {
		            text: '用电总能效',
		            subtext: '单位面积',
		            left: 'center'
		        },

		        tooltip: {
		            trigger: 'axis',
		            formatter: "{a} <br/>{b}: {c} kW·h/m²"
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
		            data: this.dataName1,
		            axisLabel: {
		                interval:0,
		                rotate:-40
		            }
		        },
		        yAxis: {
		            type: 'value',
					name : 'kW·h/m²',
					left: '4%'
		        },
		        series: [
		            {
		                name:'统计总能效',
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
                        markLine: {
                            data: [
                                {type : 'average', name : '平均值', silent:true, lineStyle:{ type:"solid", color:"#409fee"}}
                            ]
                        }
		            }
		        ]
		    };
		    myEcharts2.setOption(option2);
		},
        init2() {
            let myEcharts3 = this.$echarts.init(this.$refs.Echarts3);
		    let option3 = {
		        title: {
		            text: '用水总能效',
		            subtext: '人均',
		            left: 'center'
		        },

		        tooltip: {
		            trigger: 'axis',
		            formatter: "{a} <br/>{b}: {c} m³/人"
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
		            data: this.dataName3,
		            axisLabel: {
		                interval:0,
		                rotate:-40
		            }
		        },
		        yAxis: {
		            type: 'value',
					name : 'm³/人',
					left: '4%'
		        },
		        series: [
		            {
		                name:'统计总能效',
		                type:'line',
		                stack: '总量',
		                data:this.dataValue3,
						areaStyle: {normal: {
						    color: new echarts.graphic.LinearGradient(
						        0, 0, 0, 1,
						        [
						            {offset: 0, color: '#8EF6D2'},
						            {offset: 1, color: '#E7FAF5'}
						        ]
						    )
						}},
                        markLine: {
                            data: [
                                {type : 'average', name : '平均值', silent:true, lineStyle:{ type:"solid", color:"#409fee"}}
                            ]
                        }
		            }
		        ]
		    };
		    myEcharts3.setOption(option3);

            let myEcharts4 = this.$echarts.init(this.$refs.Echarts4);
		    let option4 = {
		        title: {
		            text: '用水总能效',
		            subtext: '总能耗',
		            left: 'center'
		        },

		        tooltip: {
		            trigger: 'axis',
		            formatter: "{a} <br/>{b}: {c} m³"
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
		            data: this.dataName4,
		            axisLabel: {
		                interval:0,
		                rotate:-40
		            }
		        },
		        yAxis: {
		            type: 'value',
					name : 'm³',
					left: '4%'
		        },
		        series: [
		            {
		                name:'统计总能效',
		                type:'line',
		                stack: '总量',
		                data:this.dataValue4,
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
		    myEcharts4.setOption(option4);
        },
        init3() {
            let myEcharts5 = this.$echarts.init(this.$refs.Echarts5);
		    let option5 = {
		        title: {
		            text: '用电总能效',
		            subtext: '总能耗',
		            left: 'center'
		        },

		        tooltip: {
		            trigger: 'axis',
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
		            data: this.dataName5,
		            axisLabel: {
		                interval:0,
		                rotate:-40
		            }
		        },
		        yAxis: {
		            type: 'value',
					name : 'kW·h',
					left: '4%'
		        },
		        series: [
		            {
		                name:'统计总能效',
		                type:'line',
		                stack: '总量',
		                data:this.dataValue5,
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
		    myEcharts5.setOption(option5);
        },
        init4() {
            let myEcharts6 = this.$echarts.init(this.$refs.Echarts6);
		    let option6 = {
		        title: {
		            text: '用暖总能效',
		            subtext: '总能耗',
		            left: 'center'
		        },

		        tooltip: {
		            trigger: 'axis',
		            formatter: "{a} <br/>{b}: {c} GJ"
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
		            data: this.dataName6,
		            axisLabel: {
		                interval:0,
		                rotate:-40
		            }
		        },
		        yAxis: {
		            type: 'value',
					name : 'GJ',
					left: '4%'
		        },
		        series: [
		            {
		                name:'统计总能效',
		                type:'line',
		                stack: '总量',
		                data:this.dataValue6,
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
		    myEcharts6.setOption(option6);
        },
        initData() {
            let data = {
                queryFlag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day
            };
            this.$axios.post(`BMPlatServers/electricity/queryenergyefficiency`, this.$qs.stringify(data)).then((res)=>{
                this.dataName = [];
                this.dataValue = [];

                this.dataName1 = [];
                this.dataValue1 = [];
                if(res.data.success) {
                    // 校园总能耗人均
                    if(res.data.result.TjnConsumByPepleList && res.data.result.TjnConsumByPepleList.length) {
                        res.data.result.TjnConsumByPepleList.forEach((item)=>{
                            this.dataName.push(item.time);
                            this.dataValue.push(item.rate);
                        });
                    }else{
						this.isShowEcharts = 2;
					}
                    // 校园总能耗单位面积
                    if(res.data.result.TjnConsumByArerList && res.data.result.TjnConsumByArerList.length) {
                        res.data.result.TjnConsumByArerList.forEach((item)=>{
                            this.dataName1.push(item.time);
                            this.dataValue1.push(item.rate)
                        });
                    }else{
						this.isShowEcharts1 = 2;
					}
                }else{
                    // this.$message.warning({
					// 	message: res.data.resultMessage,
                    //     showClose: true,
                    //     duration: 1000,
					// });
					this.isShowEcharts = 2;
					this.isShowEcharts1 = 2;
                }
               this.init();
                this.loading1 = false;
                this.loading2 = false;
            })

            let params3 = {
                flag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day
            }
            this.$axios.post('BMPlatServers/water/querySchoolEnergy', this.$qs.stringify(params3)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataName3 = [];
                    this.dataValue3 = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.dataName3.push(item.number);
                            this.dataValue3.push({name: item.number, value: item.personConsume});
                        })
                        this.init2();
                        this.loading3 = false;
                    }else{
                        this.dataName3 = [];
                        this.dataValue3 = [];
                        this.init2();
                        this.loading3 = false;
                    }
                }else{
                    this.dataName3 = [];
                    this.dataValue3 = [];
                    this.init2();
                    this.loading3 = false;
                }
            })
            this.$axios.post("BMPlatServers/water/querySchoolHistory", this.$qs.stringify(params3)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataName4 = [];
                    this.dataValue4 = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.dataName4.push(item.number);
                            this.dataValue4.push({name: item.number, value: item.consume});
                        })
                        this.init2();
                        this.loading4 = false;
                    }else{
                        this.dataName4 = [];
                        this.dataValue4 = [];
                        this.init2();
                        this.loading4 = false;
                    }
                }else{
                    this.dataName4 = [];
                    this.dataValue4 = [];
                    this.init2();
                    this.loading4 = false;
                }
            })

            // 用电总能耗
            let params5 = {
                queryFlag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day,
                classId: 1
            }
            this.$axios.post("BMPlatServers/electricity/queryhistoryconsum", this.$qs.stringify(params5)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataValue5 = [];
                    this.dataName5 = [];
                    if(res.data.result.AllbuildCousumList && res.data.result.AllbuildCousumList.length) {
                        res.data.result.AllbuildCousumList.forEach((item)=>{
                            this.dataName5.push(item.time);
                            this.dataValue5.push({name: item.time, value: item.consum});
                        })
                        this.init3();
                        this.loading5 = false;
                    }else{
                        this.dataValue5 = [];
                        this.dataName5 = [];
                        this.init3();
                        this.loading5 = false;
                    }
                }else{
                    this.dataValue5 = [];
                    this.dataName5 = [];
                    this.init3();
                    this.loading5 = false;
                }
            });
            let params6 = {
                flag: this.choiceTime,
                time: this.timeData,
                query: 1,
                systemId: 3,
                subsystemId: 3
            }

            this.$axios.post("BMPlatServers/hvacheat/queryCityHeatHistory", this.$qs.stringify(params6)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataName6 = [];
                    this.dataValue6 = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.dataName6.push(item.number);
                            this.dataValue6.push({name: item.number, value: item.consume});
                        })
                        this.init4();
                        this.loading6 = false;
                    }else{
                        this.dataName6 = [];
                        this.dataValue6 = [];
                        this.init4();
                        this.loading6 = false;
                    }
                }else{
                    this.dataName6 = [];
                    this.dataValue6 = [];
                    this.init4();
                    this.loading6 = false;
                }
            })
        },
        search() {
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
            this.loading1 = true;
            this.loading2 = true;
            this.loading3 = true;
            this.loading4 = true;
            this.loading5 = true;
            this.loading6 = true;
            this.isShowEcharts = 1;
            this.isShowEcharts1 = 1;
            // bus.$emit('searchClick', '');
            this.initData();
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
		this.timeData = `${year}`;
		this.year = year;
		this.month = month;
        this.initData();
    },
    watch: {
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
#energyConservationAssessment{
    .energyConservationAssessment{
        .choiceTime{
            padding: 20px 0 20px 15px;
            .Time-search{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
        }
        .consumption-center{
            // padding: 15px;
            .consumption-center-inner{
                overflow: hidden;
                .placeEcharts{
                    overflow: hidden;
                    padding-top: 30px;
    				float: left;
    				width: 50%;
                    .place-Echarts{
                        float: left;
                        width: 100%;
                        .echarts{
                            float: left;
                            width: 100%;
                        }
                    }
                }
    			.placeEcharts{
    			    overflow: hidden;
    			    padding-top: 30px;
    				float: left;
    				width: 50%;
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
            }
        }
        .waterEnegy{
            padding-top: 20px;
            overflow: hidden;
            .waterEnegy-left{
                width: 50%;
                float: left;
                height: 300px;
                .echarts{
                    width: 100%;
                    height: 300px;
                }
            }
        }
        .powerZongHot{
            padding-top: 20px;
            overflow: hidden;
            .powerZongHot-left{
                width: 50%;
                float: left;
                height: 300px;
                .echarts{
                    width: 100%;
                    height: 300px;
                }
            }
        }
    }
}
</style>
