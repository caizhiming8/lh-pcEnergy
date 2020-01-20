<template>
	<div id="historicalContrast">
		<div class="historicalContrast">
			<div class="top-search">
				<span class="searchType">查询方式</span>
				<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
				    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="Time-search">查询时间</span>
				<el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM" type="month" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="historicalContrast-center">
				<div class="effectContrast-center">
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
					<div class="placeEcharts">
						<div class="place-Echarts" v-if="isShowEcharts2 == 1" v-loading="loading2">
							<div class="echarts" ref="Echarts3"></div>
						</div>
						<div class="noDataEcharts" v-if="isShowEcharts2 == 2">暂无数据</div>
					</div>
					<div class="placeEcharts">
						<div class="place-Echarts" v-if="isShowEcharts3 == 1" v-loading="loading3">
							<div class="echarts" ref="Echarts4"></div>
						</div>
						<div class="noDataEcharts" v-if="isShowEcharts3 == 2">暂无数据</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return{
			choiceTime: 1,
			TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3},{label: '按时查询', value: 4}],
			timeData: '',
			types: '1',
			roomTopPrice: [],
			roomTopName: [],
			roomTopPrice1: [],
			roomTopName1: [],
			roomTopPrice2: [],
			roomTopName2: [],
			roomTopPrice3: [],
			roomTopName3: [],
			school: '',
			year: '',
			month: '',
			day: '',
			loading: true,
			loading1: true,
			loading2: true,
			loading3: true,
			isShowEcharts: 1,
			isShowEcharts1: 1,
			isShowEcharts2: 1,
			isShowEcharts3: 1,
		}
	},
	methods:{
		/* 柱状图显示 */
		init(){
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    title: {
			        left: 'center',
			        text: '二级单位总能效',
			        subtext: '单位面积'
			    },
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : this.roomTopName,
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
						name : 'kw·h/m²'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice,
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
			        left: 'center',
			        text: '二级单位总能效',
			        subtext: '人均'
			    },
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : this.roomTopName,
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
						name : 'kw·h/人'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice,
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
			let myEcharts3 = this.$echarts.init(this.$refs.Echarts3);
			let option3 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '二级单位自管能效',
			        subtext: '单位面积'
			    },
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : this.roomTopName,
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
						name : 'kw·h/m²'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice,
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
			myEcharts3.setOption(option3);
			let myEcharts4 = this.$echarts.init(this.$refs.Echarts4);
			let option4 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '二级单位自管能效',
			        subtext: '人均'
			    },
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : this.roomTopName,
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
						name : 'kw·h/人'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice,
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
			myEcharts4.setOption(option4);
		},
		/* 查询信息 */
		initData(){
			let data ={
				depart:this.school,
				queryFlag:this.choiceTime,
				year:this.year,
				month:this.month,
				day:this.day
			}
			this.$axios.post(`BMPlatServers/consum/querydephis`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.roomTopName = []
					this.roomTopPrice = []
					this.roomTopName1 = []
					this.roomTopPrice1 = []
					this.roomTopName2 = []
					this.roomTopPrice2 = []
					this.roomTopName3 = []
					this.roomTopPrice3 = []
					if(res.data.result.byArerList && res.data.result.byArerList.length){
						res.data.result.byArerList.forEach((item)=>{
							this.roomTopName.push(item.time);
							this.roomTopPrice.push(item.rate);
						});
					}else{
						this.isShowEcharts = 2;
					}
					if(res.data.result.byPepleList && res.data.result.byPepleList.length){
						res.data.result.byPepleList.forEach((item)=>{
							this.roomTopName1.push(item.time);
							this.roomTopPrice1.push(item.rate);
						});
					}else{
						this.isShowEcharts1 = 2;
					}
					if(res.data.result.byArerZgList && res.data.result.byArerZgList.length){
						res.data.result.byArerZgList.forEach((item)=>{
							this.roomTopName2.push(item.time);
							this.roomTopPrice2.push(item.rate);
						});
					}else{
						this.isShowEcharts2 = 2;
					}
					if(res.data.result.byPepleZgList && res.data.result.byPepleZgList.length){
						res.data.result.byPepleZgList.forEach((item)=>{
							this.roomTopName3.push(item.time);
							this.roomTopPrice3.push(item.rate);
						});
					}else{
						this.isShowEcharts3 = 2;
					}
					this.loading = false;
					this.loading1 = false;
					this.loading2 = false;
					this.loading3 = false;
					this.init()
				}else{
					this.loading = false;
					this.loading1 = false;
					this.loading2 = false;
					this.loading3 = false;
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		/* 搜索 */
		search(){
			this.isShowEcharts = 1;
			this.isShowEcharts1 = 1;
			this.isShowEcharts2 = 1;
			this.isShowEcharts3 = 1;
			this.loading = true;
			this.loading1 = true;
			this.loading2 = true;
			this.loading3 = true;
			this.initData()
		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.initData()
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
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
#historicalContrast{
	.historicalContrast{
		.top-search{
			padding-left: 20px;
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
</style>
