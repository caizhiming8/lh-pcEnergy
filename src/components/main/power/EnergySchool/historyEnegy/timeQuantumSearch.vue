<template>
    <div id="timeQuantumSearch">
        <div class="timeQuantumSearch">
            <div>
                <span>时间段查询</span>
                <el-date-picker v-model="TimeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <div class="bottom-echarts" v-loading="loading1">
                <div class="bottom-Echarts-l" ref="bottomEchartsLeft" v-loading="loading1"></div>
                <div class="bottom-Echarts-r" ref="bottomEchartsRight" v-loading="loading2"></div>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../../../../../../static/js/bus.js';
export default {
    data() {
        return{
            TimeRange: [],
            loading1: true,
            loading2: true,
            start_time: '',
            end_time: '',
            consumBySjd: '',
            dataList:[],
            dataName: [],
            nameListData: []
        }
    },
    methods: {
        init() {
            let myEchartsLeftB = this.$echarts.init(this.$refs.bottomEchartsLeft);
            let optionLeftB = {
                title: {
                    text: '历史用电',
                    subtext: this.consumBySjd,
                    x: 'center',
                    y: 'center'
                },
                color: ['#08A9FE', '#8693F3', '#FF908F'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c}kW·h"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:['历史用电']
                },
                series: [
                    {
                        name:'历史用电',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.dataList
                    }
                ]
            };
            myEchartsLeftB.setOption(optionLeftB);

            let EcgartsRightB = this.$echarts.init(this.$refs.bottomEchartsRight);
            let optionRightB = {
                title: {
                    text: '',
                    // subtext: '10000kwh',
                    x: 'center',
                    y: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c}kW·h"
                },
                color: ['#08A9FE', '#8693F3', '#FF908F', '#FFC600'],
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:this.dataName
                },
                series: [
                    {
                        name:'四类分项用电',
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
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.nameListData
                    }
                ]
            };
            EcgartsRightB.setOption(optionRightB);
        },

        initData() {
            let params = {
                start_time: this.start_time,
                end_time: this.end_time
            };
            this.$axios.post(`BMPlatServers/electricity/queryhistoryconsumbysjd`, this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    // 四类分项
                    this.dataName = [];
                    this.nameListData = [];
                    this.dataList = [];
                    if(res.data.result.ClassConsumBySjd && res.data.result.ClassConsumBySjd.length) {
                        let num = res.data.result.consumBySjd == undefined ? 0:res.data.result.consumBySjd;
                        this.consumBySjd = `${num}kW·h`;
                        this.dataList.push({value: num, name: '历史用电'});

                        res.data.result.ClassConsumBySjd.forEach((item)=>{
                            this.dataName.push(item.class_name);
                            this.nameListData.push({value: item.consum,name: item.class_name});
                        })
                    }else{
                        this.consumBySjd = `0kwh`;
                        this.dataList.push({value: 0, name: '历史用电'});

                        this.dataName = ['照明插座用电', '动力用电', '空调用电', '特殊用电'];
                        this.nameListData = [{value: 0, name: '照明插座用电'}, {value: 0, name: '动力用电'}, {value: 0, name: '空调用电'}, {value: 0, name: '特殊用电'}];
                    }
                    this.init()
                    this.loading1 = false;
                    this.loading2 = false;
                }else{
                    this.loading1 = false;
                    this.loading2 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },
        search() {
            if(this.TimeRange == null || this.TimeRange == '') {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.initData();
            this.loading1 = true;
            this.loading2 = true;
        }
    },
    mounted() {
		let date = new Date();
		let endYear = date.getFullYear();
		let endMonth = date.getMonth() + 1;
		let endDay = date.getDate();
		let endHours = date.getHours();
		let endMinutes = date.getMinutes();
		let endSeconds = date.getSeconds();
		let dates = new Date();
		dates = dates.getTime();
		dates = dates - 3*24*60*60*1000;
		let yesToday = new Date(dates);
		let endYear1 = yesToday.getFullYear();
		let endMonth1 = yesToday.getMonth() + 1;
		let endDay1 = yesToday.getDate();
		let endHours1 = yesToday.getHours();
		let endMinutes1 = yesToday.getMinutes();
		let endSeconds1 = yesToday.getSeconds();
		this.start_time = `${endYear1}-${endMonth1}-${endDay1} ${endHours1}:${endMinutes1}:${endSeconds1}`;
		this.end_time = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}`;
		this.TimeRange = [];
		this.TimeRange.push(this.start_time);
		this.TimeRange.push(this.end_time);
        /* this.TimeRange.push(days(0)[0].split(' ')[0].split('-')[0]+'-01-01 00:00:00');
        this.TimeRange.push(days(0)[0].split(' ')[0].split('-')[0]+'-01-03 00:00:00');
        this.start_time = days(0)[0].split(' ')[0].split('-')[0]+'-01-01 00:00:00';
        this.end_time = days(0)[0].split(' ')[0].split('-')[0]+'-01-03 00:00:00'; */
        this.initData();
    },
    watch: {
        TimeRange(item) {
            if(item =='' || item ==null) {
                this.start_time = '';
                this.end_time = '';
            }else{
                this.start_time = item[0];
                this.end_time = item[1];
            }

        }
    }
}
</script>

<style lang="scss" scoped>
#timeQuantumSearch{
    .timeQuantumSearch{
        .btn{
            margin-left: 20px;
        }
        .bottom-echarts{
            overflow: hidden;
            padding-top: 30px;
            .bottom-Echarts-l{
                width: 50%;
                float: left;
                height: 300px;
            }
            .bottom-Echarts-r{
                width: 50%;
                float: left;
                height: 300px;
            }
        }
    }
}
</style>
