<template>
	<div id="periodicRoom">
		<div class="periodicRoom">
			<span class="cycle-seach">查询周期</span>
			<el-select v-model="cycle" placeholder="请选择" clearable style="width: 150px;">
				<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<span class="cycle-seach">查询时间</span>
			<el-date-picker v-model="timeData" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
			<span class="four-seach" >四类分项</span>
			<el-select v-model="quadrature" placeholder="请选择" clearable style="width: 150px;">
				<el-option v-for="item in quadratureList" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			<div class="periodicRoom-center">
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
			<div class="periodicRoom-bottom">
				<div class="placeEcharts1">
					<div class="place-Echarts" v-if="isShowEcharts2 == 1" v-loading="loading2">
						<div class="echarts" ref="Echarts3"></div>
					</div>
					<div class="noDataEcharts" v-if="isShowEcharts2 == 2">暂无数据</div>
				</div>
				<div class="placeEcharts1">
					<div class="place-Echarts" v-if="isShowEcharts3 == 1" v-loading="loading3">
						<div class="echarts" ref="Echarts4"></div>
					</div>
					<div class="noDataEcharts" v-if="isShowEcharts3 == 2">暂无数据</div>
				</div>
			</div>
			<div class="periodicRoom-table">
				<span class="table-center">周期自管房间列表</span>
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="buildingNmae" label="单位名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="roomName" label="房间名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="consum" label="能耗(kw·h)" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="collectTime" label="采集时间" align="center"></el-table-column>
				</el-table>
			</div>
			<div class="periodicRoom-table-bottom">
				<span class="table-bottom">周期分摊区域列表</span>
				<el-table tooltip-effect="light" :data="tableData1" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="buildingNmae" label="单位名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="roomName" label="房间名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="consum" label="能耗(kw·h)" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="collectTime" label="采集时间" align="center"></el-table-column>
				</el-table>
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
			loading: true,
			loading1: true,
			loading2: true,
			loading3: true,
			tableData: [],
			tableData1: [],
			quadrature: 1,
			roomTopName: [],
			roomTopPrice: [],
			roomTopName1: [],
			roomTopPrice1: [],
			roomTopName2: [],
			roomTopPrice2: [],
			roomTopName3: [],
			roomTopPrice3: [],
			quadratureList: [{label: '照明插座用电', value: 1}, {label: '空调用电', value: 2}, {label: '动力用电', value: 3}, {label: '特殊用电', value: 4}],
			fourName: '照明插座用电',
			year: '',
			timeData: '2018',
			isShowEcharts: 1,
			isShowEcharts1: 1,
			isShowEcharts2: 1,
			isShowEcharts3: 1,
		}
	},
	methods:{
		init(){
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '自管房间能耗TOP项',
			        subtext: ''
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
						name : 'kw·h'
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
			        text: `自管房间四类分项:${this.fourName}`,
			        subtext: ''
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
			            data : this.roomTopName1,
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
						name : 'kw·h'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice1,
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
			        text: '公共分摊能耗TOP项',
			        subtext: ''
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
			            data : this.roomTopName2,
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
						name : 'kw·h'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice2,
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
			        text: `公共分摊四类分项:${this.fourName}`,
			        subtext: ''
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
			            data : this.roomTopName3,
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
						name : 'kw·h'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice3,
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
		initDataList(){
			this.$axios.post(`BMPlatServers/consum/queryperiod`).then((res)=>{
				console.log(res)
				if(res.data.success) {
					this.cycleList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						    this.cycleList.push({label: item.name, value: item.Id});
						});
						this.cycle = this.cycleList[0].value
					}
				}else{
					this.cycleList = [];
				}
			})
		},
		initData(){
			this.isShowEcharts = true;
			let data = {
				periodId: this.cycle,
				classId: this.quadrature,
				depart: this.school,
				year: this.year,
				type: '1',
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/querydepartpretop`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.roomTopName = [];
					this.roomTopPrice = [];
					this.roomTopName1 = [];
					this.roomTopPrice1 = [];
					this.tableData = res.data.result.zginfo[0].allInfoList
					if(res.data.result.zginfo[0].consumList && res.data.result.zginfo[0].consumList.length){
						res.data.result.zginfo[0].consumList.forEach((item)=>{
							this.roomTopName.push(item.roomName);
							this.roomTopPrice.push(item.consum);
						});
					}else{
						this.isShowEcharts = 2;
					}
					if(res.data.result.zginfo[0].classInfoList && res.data.result.zginfo[0].classInfoList.length){
						res.data.result.zginfo[0].classInfoList.forEach((item)=>{
							this.roomTopName1.push(item.roomName);
							this.roomTopPrice1.push(item.consum);
						});
					}else{
						this.isShowEcharts1 = 2;
					}
					this.init()
					this.loading = false;
					this.loading1 = false;
					this.loading2 = false;
					this.loading3 = false;
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
			let datas ={
				periodId: this.cycle,
				classId: this.quadrature,
				depart: this.school,
				year: this.year,
				type: '2',
			}
			this.$axios.post(`BMPlatServers/consum/querydepartggpretop`, this.$qs.stringify(datas)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.roomTopName2 = [];
					this.roomTopPrice2 = [];
					this.roomTopName3 = [];
					this.roomTopPrice3 = [];
					this.tableData1 = res.data.result.allList
					if(res.data.result.classInfoList && res.data.result.classInfoList.length){
						res.data.result.classInfoList.forEach((item)=>{
							this.roomTopName2.push(item.time);
							this.roomTopPrice2.push(item.consum);
						});
					}else{
						this.isShowEcharts2 = 2;
					}
					if(res.data.result.topList && res.data.result.topList.length){
						res.data.result.topList.forEach((item)=>{
							this.roomTopName3.push(item.time);
							this.roomTopPrice3.push(item.consum);
						});
					}else{
						this.isShowEcharts3 = 2;
					}
					this.init()
					this.loading = false
					this.loading1 = false
					this.loading2 = false
					this.loading3 = false
				}else{
					this.loading = false
					this.loading1 = false
					this.loading2 = false
					this.loading3 = false
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
						message: '请选择时间',
                        showClose: true,
                        duration: 1000,
				});
			}
		}
	},
	mounted() {
		this.initDataList()
		this.school =  window.location.href.split('=')[1];
		this.year = this.timeData;
		this.initData()
	},
	watch:{
		timeData(item) {
			if(item != ''){
				this.year = item
			}

		},
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
		},
		quadrature(item) {
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
	}
}

</script>

<style lang="scss" scoped>
#periodicRoom{
	.periodicRoom{
		padding-left: 20px;
	}
}
	.placeEcharts{
	    padding-top: 20px;
	    padding-bottom: 20px;
	    border-bottom: 2px solid #ddd;
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
	.placeEcharts1{
	    padding-top: 20px;
	    padding-bottom: 20px;
	    border-bottom: 2px solid #ddd;
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
	.periodicRoom-table{
		margin-top: 20px;
		text-align: center;
		float: left;
		width: 49.5;
		.table-center{
			font-weight: 800;
			font-size: 16px;
			color: #333333;
			letter-spacing:2px;
		}
	}
	.periodicRoom-table-bottom{
		margin-top: 20px;
		text-align: center;
		float: right;
		width: 49.5;
		.table-bottom{
			font-weight: 800;
			font-size: 18px;
			color: #333333;
			letter-spacing:2px;
		}
	}
</style>
