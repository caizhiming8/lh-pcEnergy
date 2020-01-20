<template>
	<div id="historicalCycleContrast">
		<div class="historicalCycleContrast">
			<div class="top-search">
				<!-- <span class="cycle-seach">查询时间</span>
				<el-date-picker v-model="timeData" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker> -->
				<span class="cycle-seach">查询周期</span>
				<el-select v-model="cycle" placeholder="请选择" clearable style="width: 150px;">
					<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="historicalCycleContrast-center">
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
</template>

<script>
export default{
	data(){
		return{
			cycle: '',
			cycleList: [],
			roomTopName: [],
			roomTopPrice: [],
			timeData: '2018',
			year: '',
			school:'',
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
		/* 周期 */
		initDataList(){
			this.$axios.post(`BMPlatServers/consum/queryperiod`).then((res)=>{
				// console.log(res)
				if(res.data.success) {
					this.cycleList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						    this.cycleList.push({label: item.name, value: item.Id});
						});
					}
					this.cycle = this.cycleList[0].value
				}else{
					this.cycleList = []
				}
			})
		},
		/* 柱状图显示 */
		init(){
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '二级单位周期总能效',
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
			        text: '二级单位周期总能效',
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
			        text: '二级单位周期自管能效',
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
			        text: '二级单位周期自管能效',
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
				periodId:this.cycle
			}
			this.$axios.post(`BMPlatServers/consum/querydephispre`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
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
		search(){
			this.isShowEcharts = 1;
			this.isShowEcharts1 = 1;
			this.isShowEcharts2 = 1;
			this.isShowEcharts3 = 1;
			this.loading = true;
			this.loading1 = true;
			this.loading2 = true;
			this.loading3 = true;
			if(this.timeData == '2018'){
				this.year = this.timeData
			}
			if(this.year != ''&&this.year != null){
				this.initData()
			}else{
				this.$message.warning({
					message: '请选时间',
					showClose: true,
					duration: 1000,
				});
			}

		}
	},
	mounted(){
		this.initDataList()
		this.school =  window.location.href.split('=')[1];
		this.initData()
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
		},
		timeData(item) {
		    this.year = item
		}
	}
}
</script>

<style lang="scss" scoped>
#historicalCycleContrast{
	.historicalCycleContrast{
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
