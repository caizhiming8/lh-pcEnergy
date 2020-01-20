<template>
    <div id="historyEnegyTop">
        <div class="historyEnegyTop">
            <div class="top-search">
                <span class="searchType">查询方式</span>
                <el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
                    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="Time-search">查询时间</span>
                <el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <span style="margin-left: 40px;">四类分项查询</span>
                <el-select v-model="four" placeholder="请选择" clearable style="width: 135px;">
                    <el-option v-for="item in fourList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <!-- <div class="top-echarts">
                <div class="echarts-left" ref="echartsLeft" v-loading="loading1"></div>
                <div class="ecgarts-right" ref="ecgartsRight" v-loading="loading2"></div>
            </div> -->
			<div class="top-echarts">
				<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading1">
					<div class="echarts-left" ref="echartsLeft"></div>
				</div>
				<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
			</div>
			<div class="top-echarts">
				<div class="place-Echarts" v-if="isShowEcharts1 == 1" v-loading="loading2">
					<div class="ecgarts-right" ref="ecgartsRight"></div>
				</div>
				<div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>
			</div>
        </div>
    </div>
</template>

<script>
import bus from '../../../../../../static/js/bus.js';
export default {
    data() {
        return{
            choiceTime: 2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            timeData: '',
            types: 2,
            loading1: true,
            loading2: true,
            four: 1,
            fourList: [{label: '照明插座用电', value: 1}, {label: '空调用电', value: 2}, {label: '动力用电', value: 3}, {label: '特殊用电', value: 4}],
            num: [],
            num1: [],
            valueList: [],
            valueList1: [],
            year: '',
            month: '',
            day: '',
            fourName: '照明插座用电',
			isShowEcharts: 1,
			isShowEcharts1: 1,
        }
    },
    methods: {
        init() {
            let myEchartsLeft = this.$echarts.init(this.$refs.echartsLeft);
            let wid = document.body.clientWidth || document.documentElement.clientWidth
            var resize = {
              width: wid / 2 - 150,
              height: 300
            };
            myEchartsLeft.resize(resize);
            let optionLeft = {
                title: {
                    text: '历史用电',
                    left: 'center',
                    subtext: ''
                },
                color: '#8EF6D2',
                tooltip: {
					trigger: 'axis',
                    /* enterable:true,
                    axisPointer : {
                        type : 'line'
                    } */
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.num,
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
                        data:this.valueList,
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
            myEchartsLeft.setOption(optionLeft);

            let EcgartsRight = this.$echarts.init(this.$refs.ecgartsRight);
            let widr = document.body.clientWidth || document.documentElement.clientWidth
            var resizeR = {
              width: widr / 2 - 150,
              height: 300
            };
            EcgartsRight.resize(resizeR);
            let optionRight = {
                title: {
                    text: `四类分项: ${this.fourName}`,
                    left: 'center'
                },
                tooltip: {
					trigger: 'axis',
                    /* enterable:false,
                    axisPointer : {    
                        type : 'line'
                    } */
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
                    data: this.num1,
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
                        name:'动力用电',
                        type:'line',
                        stack: '总量',
                        data:this.valueList1,
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
            EcgartsRight.setOption(optionRight);
        },

        // 初始化数据
        initData() {
            let params = {
                classId: this.four,
                queryFlag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day
            };
            this.$axios.post(`BMPlatServers/electricity/queryhistoryconsum`, this.$qs.stringify(params)).then((res)=>{
                this.num = [];
                this.valueList = [];
                this.num1 = [];
                this.valueList1 = [];
                if(res.data.success) {
                    if(res.data.result.AllbuildCousumList && res.data.result.AllbuildCousumList.length) {
                        res.data.result.AllbuildCousumList.forEach((item)=>{
                            this.num.push(item.time);
                            this.valueList.push(item.consum);
                        })
                    }else{
						this.isShowEcharts = 2;
					}
                    if(res.data.result.classConsumList && res.data.result.classConsumList.length) {
                        res.data.result.classConsumList.forEach((data)=>{
                            this.num1.push(data.time);
                            this.valueList1.push(data.consum);
                        })
                    }else{
						this.isShowEcharts1 = 2;
					}
                    this.loading1 = false;
                    this.loading2 = false;
                    this.init();
                }else{
                    this.loading1 = false;
                    this.loading2 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
                    this.init();
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
            if(!this.four) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择四类分项',
                    duration: 3000
                })
                return false;
            }
            this.loading1 = true;
            this.loading2 = true;
			this.isShowEcharts = 1;
			this.isShowEcharts1 = 1;
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
        this.initData();
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
        timeData(items) {
            if(items) {
                this.year = items.split('-')[0];
                this.month = items.split('-')[1];
                this.day = items.split('-')[2];
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
#historyEnegyTop{
    .historyEnegyTop{
        .top-search{
            .Time-search{
                margin-left: 20px;
            }
            .searchType{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
        }
        .top-echarts{
            overflow: hidden;
            padding-top: 20px;
			float: left;
			width: 50%;
			height: 350px;
            .echarts-left{
                float: left;
                width: 100%;
                height: 350px;
            }
        }
		.top-echarts{
		    overflow: hidden;
		    padding-top: 20px;
			float: left;
			width: 50%;
			height: 350px;
		    .ecgarts-right{
		        float: left;
		        width: 100%;
		        height: 350px;
		    }
		}
    }
}
</style>
