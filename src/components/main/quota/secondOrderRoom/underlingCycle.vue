<template>
	<div id="underlingCycle">
		<div class="underlingCycle">
			<div class="top-search">
				<span class="cycle-seach">查询周期</span>
				<el-select v-model="cycle" placeholder="请选择" clearable style="width: 150px;">
					<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="four-seach" >四类分项</span>
				<el-select v-model="quadrature" placeholder="请选择" clearable style="width: 150px;">
					<el-option v-for="item in quadratureList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="underlingCycle-center">
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
import session from '../../../../../static/js/session.js';
export default{
	props: ["giveData"],
	data(){
		return{
			cycle:'',
			cycleList:[],
			quadrature:1,
			quadratureList:[{label: '照明插座用电', value: 1}, {label: '空调用电', value: 2}, {label: '动力用电', value: 3}, {label: '特殊用电', value: 4}],
			fourName: '照明插座用电',
			roomTopName: [],
			roomTopPrice:[],
			roomTopName1: [],
			roomTopPrice1:[],
			buildingId: '',
			floorId: '',
			id: '',
			school:'',
			roomTopName3: [],
			roomTopPrice3: [],
			roomTopName4:[],
			roomTopPrice4:[],
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
		init(){
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    title: {
					left: 'center',
			        text: '历史总能耗'
			    },
				color: '#8EF6D2',
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
			        data: this.roomTopName,
					axisLabel: {
						interval:0,
						rotate:-40
					}
			    },
			    yAxis: {
			        type: 'value',
					name : 'kw·h'
			    },
			    series: [
			        {
			            name:'历史总能耗',
			            type:'line',
			            stack: '总量',
			            data:this.roomTopPrice,
						lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        }
			        }
			    ]
			};
			myEcharts1.setOption(option1);

			let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
			let option2 = {
			    title: {
					left: 'center',
			        text: `四类分项: ${this.fourName}`
			    },
				color: '#8EF6D2',
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
			        data: this.roomTopName1,
					axisLabel: {
						interval:0,
						rotate:-40
					}
			    },
			    yAxis: {
			        type: 'value',
					name : 'kw·h'
			    },
			    series: [
			        {
			            name:'四类分项',
			            type:'line',
			            stack: '总量',
			            data:this.roomTopPrice1,
						lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
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
						name : 'kw·h/m²'
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
			myEcharts3.setOption(option3);
			let myEcharts4 = this.$echarts.init(this.$refs.Echarts4);
			let option4 = {
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
			            data : this.roomTopName4,
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
			            data:this.roomTopPrice4,
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
			let data = {
				depart:this.school,
				building_id:this.buildingId,
				floor_id:this.floorId,
				room_id:this.id,
				periodId:this.cycle,
				classId: this.quadrature,
			}
			this.$axios.post(`BMPlatServers/consum/queryroomprehiscons`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.roomTopName = []
					this.roomTopPrice = []
					this.roomTopName1 = []
					this.roomTopPrice1 = []
					if(res.data.result.preEnerEffiList && res.data.result.preEnerEffiList.length){
						res.data.result.preEnerEffiList.forEach((item)=>{
							this.roomTopName.push(item.time);
							this.roomTopPrice.push(item.consum);
						});
					}else{
						this.isShowEcharts = 2;
					}
					if(res.data.result.preEnerClasEffiList && res.data.result.preEnerClasEffiList.length){
						res.data.result.preEnerClasEffiList.forEach((item)=>{
							this.roomTopName1.push(item.time);
							this.roomTopPrice1.push(item.consum);
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
		initData1(){
			let data ={
				depart_id:this.school,
				building_id:this.buildingId,
				floor_id:this.floorId,
				room_id:this.id,
				periodId:this.cycle,
			}
			/* 房间历史能效 */
			this.$axios.post(`BMPlatServers/consum/queryroomhispre`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.roomTopName3 = []
					this.roomTopPrice3 = []
					this.roomTopName4 = []
					this.roomTopPrice4 = []
					if(res.data.result.rateForArea && res.data.result.rateForArea.length){
						res.data.result.rateForArea.forEach((item)=>{
							this.roomTopName3.push(item.year);
							this.roomTopPrice3.push(item.rate);
						});
					}else{
						this.isShowEcharts2 = 2;
					}
					if(res.data.result.rateForPeple && res.data.result.rateForPeple.length){
						res.data.result.rateForPeple.forEach((item)=>{
							this.roomTopName4.push(item.year);
							this.roomTopPrice4.push(item.rate);
						});
					}else{
						this.isShowEcharts3 = 2;
					}
					this.loading2 = false;
					this.loading3 = false;
					this.init();
				}else{
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
			this.initData()
			this.initData1()
		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		if(session.get('dataString')) {
			this.buildingId = session.get('dataString').buildingId;
			this.floorId = session.get('dataString').floorId;
			this.id = session.get('dataString').id;
		}
		this.initDataList()
		this.initData()
		this.initData1()
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
			this.initData1();
		},
		giveData(item) {
		    if(typeof(item.chidren) == 'undefined') {
		        session.set('dataString', item);
				this.buildingId = item.buildingId;
				this.floorId = item.floorId;
				this.id = item.id;
		        this.loading = true;
		        this.initData();
				this.initData1();
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
	}
}
</script>

<style lang="scss" scoped>
#underlingCycle{
	.underlingCycle{
		.top-search{
			padding: 15px 0 15px 20px;
		}
	}
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
</style>
