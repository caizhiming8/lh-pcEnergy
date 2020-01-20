<template>
	<div id="roomEffectContrast">
		<div class="roomEffectContrast">
			<div class="top-search">
				<span class="searchType">查询方式</span>
				<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
				    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="Time-search">查询时间</span>
				<el-date-picker v-model="timeData" v-if="this.types == 1" value-format="yyyy" type="year" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy-MM" type="month" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="roomEffectContrast-center">
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
			<div class="roomEffectContrast-left">
				<span class="table-center">单位面积</span>
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="roomName" label="房间名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="rate" label="能耗" align="center"></el-table-column>
				</el-table>
				<div class="bottom-pagnation">
				    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
			</div>
			<div class="roomEffectContrast-right">
				<span class="table-center">人均</span>
				<el-table tooltip-effect="light" :data="tableData1" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="roomName" label="房间名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="rate" label="能耗" align="center"></el-table-column>
				</el-table>
				<div class="bottom-pagnation">
				    <el-pagination background @current-change="handleCurrentChange1" :current-page.sync='currentPage1' :page-size='pageSize1' layout="total, prev, pager, next"  :total="pageTotal1"></el-pagination>
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
			TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
			timeData: '2018',
			types: '1',
			school: '',
			year: '',
			month: '',
			day: '',
			loading: true,
			loading1: true,
			tableData:[],
			tableData1:[],
			currentPage: 1,
			pageSize: 5,
			pageTotal: 0,
			currentPage1: 1,
			pageSize1: 5,
			pageTotal1: 0,
			isShowEcharts: 1,
			isShowEcharts1: 1,
		}
	},
	methods:{
		init(){
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '自管房间TOP能效',
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
			        text: '自管房间TOP能效',
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
						name : 'kw·h/人'
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
		},
		initData(){
			let data ={
				depart:this.school,
				queryFlag:this.choiceTime,
				year:this.year,
				month:this.month,
				day:this.day
			}
			this.$axios.post(`BMPlatServers/consum/queryroomsenereffitop`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.roomTopName = []
					this.roomTopPrice = []
					this.roomTopName1 = []
					this.roomTopPrice1 = []
					if(res.data.result.rommsTopByArerList && res.data.result.rommsTopByArerList.length){
						res.data.result.rommsTopByArerList.forEach((item)=>{
							this.roomTopName.push(item.roomName);
							this.roomTopPrice.push(item.rate);
						});
					}else{
						this.isShowEcharts = 2;
					}
					if(res.data.result.rommsTopByPepleList && res.data.result.rommsTopByPepleList.length){
						res.data.result.rommsTopByPepleList.forEach((item)=>{
							this.roomTopName1.push(item.roomName);
							this.roomTopPrice1.push(item.rate);
						});
					}else{
						this.isShowEcharts1 = 2;
					}
					this.loading = false;
					this.loading1 = false;
					this.init()
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
		},
		initDataList(currentPage){
			let data ={
				depart:this.school,
				queryFlag:this.choiceTime,
				year:this.year,
				month:this.month,
				day:this.day,
				currentPage,
				pageSize: this.pageSize,
			}
			this.$axios.post(`BMPlatServers/consum/queryroomsenerefficompforare`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.pageTotal = res.data.result.count;
					this.tableData = res.data.result.rommsByArerList
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		initDataList1(currentPage){
			let data ={
				depart:this.school,
				queryFlag:this.choiceTime,
				year:this.year,
				month:this.month,
				day:this.day,
				currentPage,
				pageSize: this.pageSize1,
			}
			this.$axios.post(`BMPlatServers/consum/queryroomsenerefficompforpel`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.pageTotal1 = res.data.result.count;
					this.tableData1 = res.data.result.rommsByPepleList
				}else{
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
			this.loading = true;
			this.loading1 = true;
			this.initData()
			this.initDataList(1)
			this.initDataList1(1)
		},
		handleCurrentChange(val){
			this.initDataList(val);
		},
		handleCurrentChange1(val){
			this.initDataList1(val);
		},
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.initData()
		this.initDataList(1)
		this.initDataList1(1)
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
#roomEffectContrast{
	.roomEffectContrast{
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
		.roomEffectContrast-left{
			.table-center{
				margin: 8px;
				color: #434343;
				font-size: 16px;
				font-weight: 800;
			}
			.bottom-pagnation{
			    text-align: right;
			    padding: 30px;
			}
			text-align: center;
			width: 49%;
			float: left;
		}
		.roomEffectContrast-right{
			.table-center{
				margin: 8px;
				color: #434343;
				font-size: 16px;
				font-weight: 800;
			}
			.bottom-pagnation{
			    text-align: right;
			    padding: 30px;
			}
			text-align: center;
			width: 49%;
			float: right;
		}
	}
}
</style>
