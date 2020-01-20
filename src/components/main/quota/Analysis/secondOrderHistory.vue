<template>
	<div id="secondOrderHistory">
		<div class="secondOrderHistory">
			<div class="secondOrderHistory-seach">
				<span class="searchType">查询方式</span>
				<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
				    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="Time-search">查询时间</span>
				<el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM" type="month" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<span class="four-seach" >四类分项</span>
				<el-select v-model="quadrature" placeholder="请选择" clearable style="width: 150px;">
					<el-option v-for="item in quadratureList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="cycle-seach">查询周期</span>
				<el-select v-model="cycle" placeholder="请选择" clearable style="width: 150px;">
					<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="secondOrderHistory-center">
				<div class="placeEcharts" v-loading="loading">
				    <div class="echarts" ref="Echarts1"></div>
					<div class="echarts" ref="Echarts2"></div>
				</div>
				<div class="placeEcharts" v-loading="loading1">
				    <div class="echarts" ref="Echarts3"></div>
					<div class="echarts" ref="Echarts4"></div>
				</div>
				<div class="placeEcharts" v-loading="loading2">
				    <div class="echarts" ref="Echarts5"></div>
					<div class="echarts" ref="Echarts6"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			timeData:[],
			choiceTime: '',
			types:2,
			TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3},],
			year:'',
			month:'',
			quadrature: '',
			quadratureList: [{label: '照明插座用电', value: 1}, {label: '空调用电', value: 2}, {label: '动力用电', value: 3}, {label: '特殊用电', value: 4}],
			cycle:'',
			cycleList:[],
			loading: true,
			loading1: true,
			loading2: true,
			nameList1: [],
			dataValue1: [],
			nameList2: [],
			dataValue2: [],
			nameList3: [],
			dataValue3: [],
			nameList4: [],
			dataValue4: [],
			nameList5: [],
			dataValue5: [],
			nameList6: [],
			dataValue6: [],
			fourName:'',
			queryFlag:''
		}
	},
	methods:{
		init(){
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    title: {
			        text: '历史总能耗'
			    },
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList1
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [
			        {
			            name:'历史总能耗',
			            type:'line',
			            stack: '总量',
			            data:this.dataValue1
			        }
			    ]
			};
			myEcharts1.setOption(option1);

			let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
			let option2 = {
			    title: {
			        text: `四类分项: ${this.fourName}`
			    },
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList2
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [
			        {
			            name:'四类分项',
			            type:'line',
			            stack: '总量',
			            data:this.dataValue2
			        }
			    ]
			};
			myEcharts2.setOption(option2);

			let myEcharts3 = this.$echarts.init(this.$refs.Echarts3);
			let option3 = {
			    title: {
			        text: '历史自管能耗'
			    },
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList3
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [
			        {
			            name:'历史自管能耗',
			            type:'line',
			            stack: '总量',
			            data:this.dataValue3
			        }
			    ]
			};
			myEcharts3.setOption(option3);

			let myEcharts4 = this.$echarts.init(this.$refs.Echarts4);
			let option4 = {
			    title: {
			        text: `四类分项: ${this.fourName}`
			    },
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList4
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [
			        {
			            name:'四类分项',
			            type:'line',
			            stack: '总量',
			            data:this.dataValue4
			        }
			    ]
			};
			myEcharts4.setOption(option4);

			let myEcharts5 = this.$echarts.init(this.$refs.Echarts5);
			let option5 = {
			    title: {
			        text: '历史分摊能耗'
			    },
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList5
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [
			        {
			            name:'历史分摊能耗',
			            type:'line',
			            stack: '总量',
			            data:this.dataValue5
			        }
			    ]
			};
			myEcharts5.setOption(option5);

			let myEcharts6 = this.$echarts.init(this.$refs.Echarts6);
			let option6 = {
			    title: {
			        text: `四类分项: ${this.fourName}`
			    },
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList6
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [
			        {
			            name:'四类分项',
			            type:'line',
			            stack: '总量',
			            data:this.dataValue6
			        }
			    ]
			};
			myEcharts6.setOption(option6);
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
					}
				}else{
					this.cycleList = []
					this.$message.warning(res.data.resultMessage);
				}



			})
		},
		initData(){
			if(this.year != ''){
				this.queryFlag = this.year
			}else if(this.month != ''){
				this.queryFlag = this.month
			}
			let data = {
				depart:this.school,
				type:'1,2',
				queryFlag:this.queryFlag,
				classId:this.quadrature,
				periodId:this.cycle
			}
			console.log(data)

		},
		search(){

		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		console.log(this.school)
		this.initDataList()
		this.initData()
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
		},
		quadrature(item) {
		    // console.log(item);
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
		    }
		    this.timeData = ''
		},
		timeData(item) {
			if(item) {
				this.year = item.split('-')[0];
			    this.month = item.split('-')[1];
			}else{
				this.year = '';
			    this.month = '';
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.searchType{
		margin-left: 20px;
	}
	.Time-search{
		margin-left: 20px;
	}
	.four-seach{
		margin-left: 20px;
	}
	.cycle-seach{
		margin-left: 20px;
	}
	.btn{
		margin-left: 20px;
	}
	.placeEcharts{
	    padding-top: 20px;
	    padding-bottom: 20px;
	    border-bottom: 3px solid #ddd;
	    overflow: hidden;
	    .echarts{
	        width: 50%;
	        height: 300px;
	        float: left;
	    }
	}
</style>
