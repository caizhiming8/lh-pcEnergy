<template>
	<div id="effectContrast">
		<div class="effectContrast">
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
			<div class="effectContrast-center">
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
			choiceTime: '',
			TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
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
			loading1: true
		}
	},
	methods:{
		/* 柱状图显示 */
		init(){
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '二级单位总能效',
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
			            data : this.roomTopName1,
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
			            data:this.roomTopPrice1
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
			            data : this.roomTopName2,
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
			            data:this.roomTopPrice2
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
			            data : this.roomTopName3,
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
			            data:this.roomTopPrice3
			        }
			    ]
			};
			myEcharts4.setOption(option4);
		},
		/* 查询信息 */
		initData(){
			let data ={
				depart:'',
				is_flag: 1,
				queryFlag:this.choiceTime,
				year:this.year,
				month:this.month,
				day:this.day
			}
			this.$axios.post(`BMPlatServers/consum/querydephisenereffi`, this.$qs.stringify(data)).then((res)=>{
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
					this.loading = false
					this.init()
				}else{
					this.loading = false
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
			if(this.choiceTime != ''&&this.choiceTime != null&&this.timeData != ''&&this.timeData != null){
				this.initData()
			}else{
				this.$message.warning({
					message: '请添加搜索条件时间',
					showClose: true,
					duration: 1000,
				});
			}
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
#effectContrast{
	.effectContrast{
		padding:10px;
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
