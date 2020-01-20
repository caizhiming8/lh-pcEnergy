<template>
	<div id="selfRoomEffect">
		<div class="selfRoomEffect">
			<div class="energyTree">
				<v-energyTree @sonData="sonDatas"></v-energyTree>
			</div>
			<div class="selfRoom">
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
				<div class="selfRoom-top">
					<span class="selfRoom-left">单位面积实时能效:  {{unitArea}}</span>
					<span class="selfRoom-right">人均实时能效:  {{perCapita}}</span>
				</div>
				<div class="selfRoom-center">
					<div class="placeEcharts" v-loading="loading">
					    <div class="echarts" ref="Echarts1"></div>
						<div class="echarts" ref="Echarts2"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import energyTree from './energyTree';
export default{
	data(){
		return{
			choiceTime: '',
			TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3},{label: '按时查询', value: 4}],
			timeData: '',
			types: '2',
			school: '',
			year: '',
			month: '',
			day: '',
			loading: true,
			roomTopName: [],
			roomTopPrice: [],
			roomTopName1:[],
			roomTopPrice1:[],
			unitArea:'',
			perCapita:'',
			buildingId: '',
			floorId: '',
			id: '',
		}
	},
	methods:{
		/* 树结构 */
		sonDatas(datas){
			console.log("接收数的参数")
			console.log(datas)
			this.buildingId = datas.buildingId
			this.floorId = datas.floorId
			this.id = datas.id
			this.initData()
		},
		init(){
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '自管房间历史能效',
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
			        text: '自管房间历史能效',
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
		},
		initData(){
			let data ={
				depart:this.school,
				buildingId: this.buildingId,
				floorId: this.floorId,
				id: this.id,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/queryroomrealenereffi`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.unitArea = res.data.result.rateForArea;
					this.perCapita = res.data.result.rateForPeple;
				}else{
					this.$message.warning(res.data.resultMessage);
				}
			})
		},
		initDataList(){
			let data ={
				depart:this.school,
				buildingId: this.buildingId,
				floorId: this.floorId,
				id: this.id,
				queryFlag:this.choiceTime,
				year:this.year,
				month:this.month,
				day:this.day,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/queryroomenerefficomp`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.roomTopName = []
					this.roomTopPrice = []
					this.roomTopName1 = []
					this.roomTopPrice1 = []
					if(res.data.result.rommsByArerList && res.data.result.rommsByArerList.length){
						res.data.result.rommsByArerList.forEach((item)=>{
							this.roomTopName.push(item.time);
							this.roomTopPrice.push(item.rate);
						});
					}else{
						this.roomTopName = ["2016","2017","2018","2019"];
						this.roomTopPrice = [0,0,0,0];
					}
					if(res.data.result.rommsByPepleList && res.data.result.rommsByPepleList.length){
						res.data.result.rommsByPepleList.forEach((item)=>{
							this.roomTopName1.push(item.time);
							this.roomTopPrice1.push(item.rate);
						});
					}else{
						this.roomTopName1 = ["2016","2017","2018","2019"];
						this.roomTopPrice1 = [0,0,0,0];
					}
					this.loading = false
					this.init()
				}else{
					this.loading = false
					this.$message.warning(res.data.resultMessage);
				}
			})
			// this.loading = false
			// this.init()
			// this.roomTopName = ["2016","2017","2018","2019"];
			// this.roomTopPrice = [0,0,0,0];
			// this.roomTopName1 = ["2016","2017","2018","2019"];
			// this.roomTopPrice1 = [0,0,0,0];
		},
		search(){
			this.initDataList()
		},
		handleNodeClick(id){
			console.log(id)
		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.initDataList()
		this.initData()
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData()
			this.initDataList()
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
	},
	components: {
	    'v-energyTree': energyTree
	}
}
</script>

<style lang="scss" scoped>
#selfRoomEffect{
	.selfRoomEffect{
		overflow: hidden;
		.energyTree{
			float: left;
			width: 15%;
			height: 550px;
			overflow: auto;
			padding-right: 10px;
			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			-o-box-sizing: border-box;
			border-right: 1px solid #ddd;
			&::-webkit-scrollbar{
			    width: 1px;
			}
		}
		.selfRoom{
			.selfRoom-top{
				font-size: 16px;
				font-weight: 800;
				color: #454545;
				margin-top: 20px;
				margin-left: 20px;
				.selfRoom-left{
					margin-left: 25px;
				}
				.selfRoom-right{
					margin-left: 50px;
				}
			}
			.selfRoom-center{
				margin-top: 20px;
			}
			float: left;
			width: 85%;
			overflow: auto;
			padding-left: 10px;
			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			-o-box-sizing: border-box;
			&::-webkit-scrollbar{
			    width: 1px;
			}
		}
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
