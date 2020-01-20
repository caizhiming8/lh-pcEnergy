<template>
    <div id="BuildingEfficiency">
        <div class="choiceTime">
            <span>查询方式</span>
            <el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
                <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="Time-search">查询时间</span>
            <el-date-picker v-model="timeData" v-if="this.types == 1" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            <el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>

        <div class="placeEcharts" v-loading="loading">
            <div class="echarts" ref="Echarts1"></div>
            <div class="echarts" ref="Echarts2"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            choiceTime:2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            timeData: '2019-01',
            types: 2,
            year: '2019',
            month: '01',
            day: '',
            loading: true,
            person: [],
            personValue: [],
            area: [],
            areaValue: []
        }
    },
    methods: {
        init() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                color: ['#3398DB'],
                title: {
                    text: '楼宇能效对比',
                    subtext: '人均',
                    left: 'center'
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
                        data : this.person,
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
						name : 'kW·h/人'
                    }
                ],
                series : [
                    {
                        name:'人均',
                        type:'bar',
                        barWidth: '60%',
                        data:this.personValue,
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
            myEcharts1.setOption(option1);

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                color: ['#3398DB'],
                title: {
                    text: '楼宇能效对比',
                    subtext: '单位面积',
                    left: 'center'
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
                        data : this.area,
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
						name : 'kW·h/m²'
                    }
                ],
                series : [
                    {
                        name:'单位面积',
                        type:'bar',
                        barWidth: '60%',
                        data:this.areaValue,
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
            myEcharts2.setOption(option2);
        },

        initData() {
            let data = {
                queryFlag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day
            };
            this.$axios.post(`BMPlatServers/electricity/queryenereffici`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    // 人均
                    this.person = [];
                    this.personValue = [];

                    this.area = [];
                    this.areaValue = [];
                    if(res.data.result.BuildByPepleList && res.data.result.BuildByPepleList.length) {
                        res.data.result.BuildByPepleList.forEach((item)=>{
                            this.person.push(item.name);
                            this.personValue.push(item.rate);
                        });
                    }else{
                        this.$message.warning({
							message: '暂无数据',
							showClose: true,
							duration: 1000,
						});
                    }
                    if(res.data.result.buildByArerList && res.data.result.buildByArerList.length) {
                        res.data.result.buildByArerList.forEach((item)=>{
                            this.area.push(item.name);
                            this.areaValue.push(item.rate);
                        })
                    }else{
                        this.$message.warning({
							message: '暂无数据',
							showClose: true,
							duration: 1000,
						});
                    }
                    this.init();
                    this.loading = false;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.loading = false;
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
            if(!this.timeData) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.loading = true;
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
#BuildingEfficiency{
    .choiceTime{
        padding: 20px 0 20px 15px;
        .Time-search{
            margin-left: 20px;
        }
        .btn{
            margin-left: 20px;
        }
    }
    .placeEcharts{
        overflow: hidden;
        .echarts{
            width: 50%;
            float: right;
            height: 500px;
        }
    }
}
</style>
