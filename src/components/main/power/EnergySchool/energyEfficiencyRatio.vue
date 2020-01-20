<template>
	<div id="energyEfficiencyRatio">
		<div class="energyEfficiencyRatio">
			<div class="choiceTime">
			    <span>查询类型</span>
			    <el-select v-model="pattern" placeholder="请选择" clearable style="width: 110px;">
			        <el-option v-for="item in patternList" :key="item.value" :label="item.label" :value="item.value"></el-option>
			    </el-select>
				<span v-if="this.leixing == 2||this.leixing == 3">查询楼宇</span>
				<el-select v-model="building" v-if="this.leixing == 2||this.leixing == 3" placeholder="请选择" clearable style="width: 110px;">
				    <el-option v-for="item in buildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span v-if="this.leixing == 3">查询楼层</span>
				<el-select v-model="floor" v-if="this.leixing == 3" placeholder="请选择" clearable style="width: 110px;">
				    <el-option v-for="item in floorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span v-if="this.leixing == 3&&this.zong ==1">查询房间</span>
				<el-select v-model="room" v-if="this.leixing == 3&&this.zong ==1" placeholder="请选择" clearable style="width: 110px;">
				    <el-option v-for="item in roomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span>查询方式</span>
				<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
				    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			    <span class="Time-search">查询时间</span>
			    <el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期"></el-date-picker>
			    <!-- <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker> -->
				<el-select v-model="month" placeholder="请选择" clearable style="width: 200px;" v-if="this.types == 2">
				    <el-option v-for="item in monthList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			    <el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="placeEcharts">
				<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading1">
					<div class="echarts" ref="Echarts1"></div>
				</div>
				<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return{
			timeData: '',
			choiceTime: 1,
			TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}],
			pattern: 1,
			patternList: [{label: '全校', value: 1}, {label: '楼宇', value: 2},{label: '房间', value: 3}],
			types: 1,
			person:[],
			personValue:[],
			building: '',
			buildingList: [],
			floor: '',
			floorList: [],
			room: '',
			roomList: [],
			loading1:true,
			isShowEcharts: 1,
			leixing : 0,
			zong: '',
			monthList: [{label: '一月', value: 1}, {label: '二月', value: 2}, {label: '三月', value: 3}, {label: '四月', value: 4}, {label: '五月', value: 5}, {label: '六月', value: 6}, {label: '七月', value:7}, {label: '八月', value: 8}, {label: '九月', value: 9}, {label: '十月', value: 10}, {label: '十一月', value: 11}, {label: '十二月', value: 12}],
			month: ''
		}
	},
	methods:{
		init(){
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    color: ['#3398DB'],
			    title: {
			        text: '历史能效对比',
			        subtext: '',
			        left: 'center'
			    },
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {
			            type : 'shadow'
			        },
			        formatter: "{a} <br/>{b}: {c} kW·h"
			    },
			    grid: {
			        left: '3%',
			        right: '7%',
			        bottom: '7%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : this.person,
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
						name : 'KW·h'
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth: '60%',
			            data:this.personValue,
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
		},
		initBuilding(){
			this.$axios.post(`BMPlatServers/electricity/queryentrybuildings`).then((res)=>{
			    console.log(res);
			    if(res.data.success) {
					this.buildingList = []
					if(res.data.result.buildingList && res.data.result.buildingList.length) {
						res.data.result.buildingList.forEach((item)=>{
						    this.buildingList.push({label: item.buildingName, value: item.building_id});
						});
					}
			    }else{
					this.$message.warning({
						message: res.data.resultMessage,
					    showClose: true,
					    duration: 1000,
					});
			    }
			})
		},
		initfloor(){
			let data={
				building_id:this.building
			};
			console.log(data)
			this.$axios.post(`BMPlatServers/electricity/queryentryfloors`, this.$qs.stringify(data)).then((res)=>{
			    console.log(res);
			    if(res.data.success) {
					this.floorList = []
					if(res.data.result.floorIdList && res.data.result.floorIdList.length) {
						res.data.result.floorIdList.forEach((item)=>{
						    this.floorList.push({label: item.floorName, value: item.floor_id});
						});
					}
			    }else{
					this.$message.warning({
						message: res.data.resultMessage,
					    showClose: true,
					    duration: 1000,
					});
			    }
			})
		},
		initroom(){
			let data={
				building_id:this.building,
				floor_id:this.floor
			};
			console.log(data)
			this.$axios.post(`BMPlatServers/electricity/queryentryrooms`, this.$qs.stringify(data)).then((res)=>{
			    console.log(res);
			    if(res.data.success) {
					this.roomList = []
					if(res.data.result.roomIdList && res.data.result.roomIdList.length) {
						res.data.result.roomIdList.forEach((item)=>{
						    this.roomList.push({label: item.room_name, value: item.room_id});
						});
					}
			    }else{
					this.$message.warning({
						message: res.data.resultMessage,
					    showClose: true,
					    duration: 1000,
					});
			    }
			})
		},
		initData(){
			let data = {
			    queryFlag: this.choiceTime,
			    year: this.month,
				flag: this.pattern,
				building: this.building,
				floor: this.floor,
				room: this.room
			};
			console.log(data)
			this.$axios.post(`BMPlatServers/electricity/queryhistorycompared`, this.$qs.stringify(data)).then((res)=>{
			    console.log(res);
			    if(res.data.success) {
					if(res.data.result.AllbuildCousumList && res.data.result.AllbuildCousumList.length) {
						this.person = []
						this.personValue = []
					    res.data.result.AllbuildCousumList.forEach((item)=>{
					        this.person.push(item.time);
					        this.personValue.push(item.consum);
					    });
					}else{
						this.isShowEcharts = 2;
					}
					this.init()
					this.loading1 = false
			    }else{
					this.loading1 = false
					this.isShowEcharts = 2
					this.$message.warning({
						message: res.data.resultMessage,
					    showClose: true,
					    duration: 1000,
					});
			    }
			})
			
		},
		search(){
			this.loading1 = true
			this.isShowEcharts = 1
			this.initData()
		}
	},
	mounted() {
		this.initData()
	},
	watch:{
		choiceTime(olds) {
		    if(olds == 1) {
		        this.types = 1
				this.month = ''
		    }else if(olds == 2) {
		        this.types = 2
		    }
		    this.timeData = ''
		},
		pattern(olds){
			if(olds != ''){
				if(olds == 1) {
					this.leixing = 1
				}else if(olds == 2) {
					this.leixing = 2
					this.initBuilding()
				}else if(olds == 3){
					this.leixing = 3
					this.initBuilding()
				}
			}else{
				this.leixing = ''
			}
		},
		building(build){
			if(build != ''){
				this.floor = ''
				this.initfloor()
			}else{
				this.floor = ''
				this.floor = []
				this.room = ''
				this.roomList = []
				this.$message.warning({
					message: '请选择楼宇',
				    showClose: true,
				    duration: 1000,
				});
			}
		},
		floor(floo){
			if(floo != ''&&floo != 0){
				this.zong = 1
				this.room = ''
				this.initroom()
			}else{
				this.zong = ''
				this.room = ''
				this.roomList = []
			}
		}
	}
}
</script>

<style lang="scss" scoped>
#energyEfficiencyRatio{
	.energyEfficiencyRatio{
		.choiceTime{
			padding: 20px 0 20px 15px;
			.Time-search{
				margin-left: 20px;
			}
			.btn{
				margin-left: 20px;
			}
		}
		.placeEcharts{
			overflow: hidden;
			padding-top: 30px;
			float: left;
			width: 100%;
			.place-Echarts{
				float: left;
				width: 100%;
				.echarts{
					float: left;
					width: 100%;
					height: 500px;
				}
			}
		}
	}
}
</style>
