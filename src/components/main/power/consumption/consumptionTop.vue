<template>
    <div id="consumptionTop">
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
					<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading1">
						<div class="echarts" ref="Echarts1"></div>
					</div>
					<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
				</div>
				<div class="placeEcharts">
					<div class="place-Echarts" v-if="isShowEcharts1 == 1" v-loading="loading2">
						<div class="echarts" ref="Echarts2"></div>
					</div>
					<div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>
				</div>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../../../../../static/js/bus.js';
export default {
    data() {
        return{
            choiceTime: 2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            timeData: '2019',
            types: 2,
            schoolyardEnergy: 0,
            area: 0,
            person: 0,
            year: '2019',
            month: '',
            day: '',
            dataName: [],
            dataName1: [],
            dataValue: [],
            dataValue1: [],
            loading1: true,
            loading2: true,
			isShowEcharts: 1,
			isShowEcharts1: 1,
        }
    },
    methods: {
		init() {
		    let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
		    let option1 = {
		        title: {
		            text: '统计内医院总能效',
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
		            }
		        ]
		    };
		    myEcharts1.setOption(option1);
		
		
		    let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
		    let option2 = {
		        title: {
		            text: '统计内医院总能效',
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
		            }
		        ]
		    };
		    myEcharts2.setOption(option2);
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
				console.log(res)
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

                    // 统计在内的人均
                    /* bus.$emit('TjnConsumByPepleList', res.data.result.TjnConsumByPepleList); */
                    // 统计在内单位面积
                    /* bus.$emit('TjnConsumByArerList', res.data.result.TjnConsumByArerList); */
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
					this.isShowEcharts = 2;
					this.isShowEcharts1 = 2;
                    /* bus.$emit('TjnConsumByPepleListErr'); */
                }
               this.init();
                this.loading1 = false;
                this.loading2 = false;
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
            this.isShowEcharts = 1;
            this.isShowEcharts1 = 1;
            bus.$emit('searchClick', '');
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
		this.timeData = `${year}-${month}-${day}`;
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
#consumptionTop{
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
            -webkit-box-shadow: 0 0 6px #ddd;
            -moz-box-shadow: 0 0 6px #ddd;
            box-shadow: 0 0 6px #ddd;
            .consumption-center-top{
                padding: 15px;
                font-weight: 100;
                border-bottom: 1px solid #ddd;
                color: #000;
                b{
                    display: inline-block;
                    margin: 0 100px;
                }
            }
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
}
</style>
