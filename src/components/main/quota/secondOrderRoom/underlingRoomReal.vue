<template>
	<div id="underlingRoomReal">
		<div class="underlingRoomReal">
			<!-- <div class="top-search">
				<span class="searchType">查询方式</span>
				<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
				    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="Time-search">查询时间</span>
				<el-date-picker v-model="timeData" v-if="this.types == 1" disabled type="date" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy" type="year" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM" type="month" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
				<span class="four-seach" >四类分项</span>
				<el-select v-model="quadrature" placeholder="请选择" clearable style="width: 150px;">
					<el-option v-for="item in quadratureList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button class="btn" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div> -->
			<div class="center-content">
				<!-- <span class="meterReading">实时能耗：{{rooms}}</span> -->
				<span class="meterReading">当前周期总能耗：<v-countup :startValue="0" :endValue="room" :duration="1" :decimals="2"></v-countup> kw·h</span>
				<span class="meterReading">单位面积实时总能效: <v-countup :startValue="0" :endValue="unitArea" :duration="1" :decimals="2"></v-countup> kw·h</span>
				<span class="meterReading">人均实时总能效: <v-countup :startValue="0" :endValue="perCapita" :duration="1" :decimals="2"></v-countup> kw·h</span>
				<div class="placeEcharts">
					<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading">
						<div class="echarts" ref="Echarts2"></div>
					</div>
					<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
				</div>
				<div class="type-table">
					<span class="table-center">实时能耗表</span>
					<el-table tooltip-effect="light" :data="tableData" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" >
						<el-table-column :show-overflow-tooltip="true" prop="ammeter_id" label="实时能耗表" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="consum" label="实时能耗抄表值" align="center"></el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import session from '../../../../../static/js/session.js';
export default{
	props: ["giveData"],
	data(){
		return{
			school: '',
			choiceTime:'',
			TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3},{label: '按时查询', value: 4}],
			timeData:'',
			types: 2,
			quadrature:'',
			quadratureList: [{label: '照明插座用电', value: 1}, {label: '空调用电', value: 2}, {label: '动力用电', value: 3}, {label: '特殊用电', value: 4}],
			fourName:'',
			year: '',
			month: '',
			day: '',
			loading: true,
			roomTopName: [],
			roomTopPrice:[],
			room:'',
			rooms: '',
			buildingId: '',
			floorId: '',
			id: '',
			tableData:[],
			unitArea:'',
			perCapita:'',
			isShowEcharts: 1,
		}
	},
	methods:{
		init(){
			let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
			let option2 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: `自管房间分项`,
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
			myEcharts2.setOption(option2);
		},
		initData(){
			/* 周期总能耗 */
			let data = {
				depart:this.school,
				building_id:this.buildingId,
				floor_id:this.floorId,
				room_id:this.id
			}
			this.$axios.post(`BMPlatServers/consum/queryroomrealcons`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.roomTopName = []
					this.roomTopPrice = []
					this.tableData = []
					this.tableData = this.room = res.data.result.allinfo[0].ammList
					this.room = res.data.result.allinfo[0].consunm
					this.rooms = res.data.result.allinfo[0].roomconsunm
					if(res.data.result.allinfo[0].classList && res.data.result.allinfo[0].classList.length){
						res.data.result.allinfo[0].classList.forEach((item)=>{
							this.roomTopName.push(item.class_name);
							this.roomTopPrice.push(item.Consums);
						});
					}else{
						this.isShowEcharts = 2;
					}
					this.init()
					this.loading = false
				}else{
					this.loading = false
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
			this.$axios.post(`BMPlatServers/consum/queryroomrealenereffi`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.unitArea = res.data.result.rateForArea;
					this.perCapita = res.data.result.rateForPeple;
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
			this.loading = true;
			this.initData()
		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		if(session.get('dataString')) {
			this.buildingId = session.get('dataString').buildingId;
			this.floorId = session.get('dataString').floorId;
			this.id = session.get('dataString').id;
		}
		this.initData()
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
		},
		giveData(item) {
		    if(typeof(item.chidren) == 'undefined') {
		        session.set('dataString', item);
				this.buildingId = item.buildingId;
				this.floorId = item.floorId;
				this.id = item.id;
		        this.loading = true;
		        this.initData();
		    }
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
	.center-content{
		margin-top: 20px;
	}
	.meterReading{
		margin-left: 20px;
		font-weight: 500;
		color: #333333;
		font-size: 15px;
	}
	.placeEcharts{
	    overflow: hidden;
	    padding-top: 20px;
	    .echarts{
	        width: 100%;
	        height: 300px;
	        float: left;
	    }
	}
	.searchType{
		margin-left: 10px;
	}
	.Time-search{
		margin-left: 10px;
	}
	.four-seach{
		margin-left: 10px;
	}
	.btn{
		margin-left: 10px;
	}
	.type-table{
		margin-top: 20px;
		margin-left: 15px;
		.table-center{
			margin-left: 20px;
			font-weight: 700;
			color: #333333;
			font-size: 16px;
		}
	}
</style>
