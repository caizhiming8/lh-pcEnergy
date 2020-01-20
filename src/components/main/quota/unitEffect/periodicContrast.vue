<template>
	<div id="periodicContrast">
		<div class="periodicContrast">
			<div class="top-search">
				<span class="cycle-seach">查询时间</span>
				<el-date-picker v-model="timeData" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
				<span class="cycle-seach">查询周期</span>
				<el-select v-model="cycle" placeholder="请选择" clearable style="width: 150px;">
					<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="periodicContrast-center">
				<div class="placeEcharts" v-loading="loading">
				    <div class="echarts" ref="Echarts1"></div>
					<div class="echarts" ref="Echarts2"></div>
				</div>
				<div class="placeEcharts" v-loading="loading1">
				    <div class="echarts" ref="Echarts3"></div>
					<div class="echarts" ref="Echarts4"></div>
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
			loading: true,
			loading1: true,
			roomTopName: [],
			roomTopPrice: [],
			timeData: '',
			year: ''
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
			        subtext: '面积'
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
			            }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice
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
			            }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice
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
			        subtext: '单位'
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
			            }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice
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
			            }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.roomTopPrice
			        }
			    ]
			};
			myEcharts4.setOption(option4);
		},
		/* 查询信息 */
		initData(){
			let data ={
				periodId:this.cycle,
				year:this.year
			}
			this.$axios.post(`BMPlatServers/consum/querydephisenereffibypro`, this.$qs.stringify(data)).then((res)=>{
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
					if(res.data.result.rommsByArerList && res.data.result.rommsByArerList.length){
						res.data.result.rommsByArerList.forEach((item)=>{
							this.roomTopName.push(item.departName);
							this.roomTopPrice.push(item.rate);
						});
					}
					if(res.data.result.rommsByPelList && res.data.result.rommsByPelList.length){
						res.data.result.rommsByPelList.forEach((item)=>{
							this.roomTopName1.push(item.departName);
							this.roomTopPrice1.push(item.rate);
						});
					}
					if(res.data.result.zgrommsByArerList && res.data.result.zgrommsByArerList.length){
						res.data.result.zgrommsByArerList.forEach((item)=>{
							this.roomTopName2.push(item.departName);
							this.roomTopPrice2.push(item.rate);
						});
					}
					if(res.data.result.rommsByPelList && res.data.result.rommsByPelList.length){
						res.data.result.rommsByPelList.forEach((item)=>{
							this.roomTopName3.push(item.departName);
							this.roomTopPrice3.push(item.rate);
						});
					}
					this.loading1 = false
					this.loading = false
					this.init()
				}else{
					this.loading1 = false
					this.loading = false
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		search(){
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
#periodicContrast{
	.periodicContrast{
		padding: 10px;
		.placeEcharts{
		    overflow: hidden;
		    padding-top: 20px;
		    .echarts{
		        width: 50%;
		        height: 300px;
		        float: left;
		    }
		}
	}
}
</style>
