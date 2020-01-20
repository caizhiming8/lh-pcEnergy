<template>
    <div id="roomEnegy">
        <div class="roomEnegy">
            <div class="roomEnegy-right">
				<div class="seach">
					<span class="searchType">查询方式</span>
					<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
						<el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="Time-search" style="margin-left:20px">查询时间</span>
					<el-date-picker v-model="timeData" v-if="this.types == 1" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
					<el-date-picker v-model="timeData" v-if="this.types == 2" type="month"  value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
					<el-date-picker v-model="timeData" v-if="this.types == 3" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
					<el-button class="btn" style="margin-left: 40px" type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
				</div>
                <div class="placeEcharts">
                	<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading">
                		<div class="echarts" ref="Echarts1"></div>
                	</div>
                	<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
                </div>
                <div class="placeEcharts">
                	<div class="place-Echarts" v-if="isShowEcharts1 == 1" v-loading="loading1">
                		<div class="echarts" ref="Echarts2"></div>
                	</div>
                	<div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import session from '../../../../../static/js/session.js';
export default {
    props: ['giveData'],
    data() {
        return{
            choiceTime: 2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            timeData: '',
            types: 2,
            loading: true,
            loading1: true,
            building_id: '',
            floor_id: '',
            room_id: '',
            year: '',
            month: '',
            day: '',
            hour: '',
            dataRommsByPepleList: [],
            dataRommsByPepleListTime: [],
            dataAreaTime: [],
            dataArea: [],
			isShowEcharts: 1,
			isShowEcharts1: 1,
        }
    },
    methods: {
        init() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                color: '#8EF6D2',
                title: {
                    text: '房间历史能效',
                    subtext: '人均',
					x:'center',
					y:'top',
					textAlign:'center'
                },
                tooltip : {
                    trigger: 'axis',
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
                    data: this.dataRommsByPepleListTime,
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value',
					name : 'kW·h/人'
                },
                series: [{
                    name:'人均',
                    data: this.dataRommsByPepleList,
                    type: 'line',
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
                }]
            };
            myEcharts1.setOption(option1);

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                color: '#8EF6D2',
                title: {
                    text: '房间历史能效',
                    subtext: '单位面积',
					x:'center',
					y:'top',
					textAlign:'center'
                },
                tooltip : {
                    trigger: 'axis',
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
                    data: this.dataAreaTime,
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value',
					name : 'kW·h/m²'
                },
                series: [{
                    name:'单位面积',
                    data: this.dataArea,
                    type: 'line',
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
                }]
            };
            myEcharts2.setOption(option2);
        },
        search() {
			this.isShowEcharts = 1;
			this.isShowEcharts1 = 1;
			this.loading = true;
			this.loading1 = true;
            this.initData()
        },
        initData(){
            let param = {
                building_id:this.building_id,
                floor_id:this.floor_id,
                room_id:this.room_id,
                queryFlag:this.choiceTime,
                year:this.year,
                month:this.month,
                day:this.day,
                hour:this.hour
            }
            console.log(param)
            this.$axios.post(`BMPlatServers/electricity/queryroomenerefficomp`, this.$qs.stringify(param)).then((res)=>{
                console.log(res);
                if(res.data.success){
                    this.dataRommsByPepleList = [];
                    this.dataRommsByPepleListTime = [];
                    this.dataAreaTime = [];
                    this.dataArea = [];
                    if(res.data.result.rommsByPepleList && res.data.result.rommsByPepleList.length) {
                        res.data.result.rommsByPepleList.forEach((item)=>{
                            this.dataRommsByPepleList.push(item.rate)
                            this.dataRommsByPepleListTime.push(item.time)
                        });

                    }else{
						this.isShowEcharts = 2;
                        this.$message.warning({
							message: '暂无数据',
							showClose: true,
							duration: 1000,
						});
                        this.dataRommsByPepleList = [];
                        this.dataRommsByPepleListTime = [];
                    }
					if(res.data.result.rommsByArerList && res.data.result.rommsByArerList.length){
						res.data.result.rommsByArerList.forEach((item)=>{
						    this.dataAreaTime.push(item.time)
						    this.dataArea.push(item.rate)
						})
					}else{
						this.isShowEcharts1 = 2;
						this.$message.warning({
							message: '暂无数据',
							showClose: true,
							duration: 1000,
						});
						this.dataAreaTime = [];
						this.dataArea = [];
					}
                    this.init();
                    this.loading = false;
                    this.loading1 = false;
                }else{
                    this.loading = false;
                    this.loading1 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
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
		this.month = month;
        this.building_id = window.location.href.split('=')[1];
        if(session.get('dataString')) {
            this.floor_id = session.get('dataString').floorId;
            this.room_id = session.get('dataString').roomId;
        }
        this.initData();
    },
    watch: {
        giveData(item) {
            if(typeof(item.chidren) == 'undefined') {
                session.set('dataString', item);
                this.floor_id = item.floorId;
                this.floor_id = item.roomId;
                this.loading = true;
                this.initData();
            }
        },
        timeData(item){
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
        $route(to, from) {
            this.building_id = to.fullPath.split('=')[1];
        },
        choiceTime(item) {
            this.timeData = '';
            if(item == 1) {
                this.types = 1;
            }else if(item == 2) {
                this.types = 2;
            }else if(item == 3) {
                this.types = 3;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#roomEnegy{
    .roomEnegy{
        .roomEnegy-right{
            width: 100%;
            height: 600px;
            overflow: auto;
            padding-left: 10px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            &::-webkit-scrollbar{
                width: 1px;
            }
            .placeEcharts{
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
        }
    }
}
</style>
