<template>
	<div id="periodicHistory">
		<div class="periodicHistory">
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
			<div class="periodicHistory-center">
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
				<div class="placeEcharts">
					<div class="place-Echarts" v-if="isShowEcharts4 == 1" v-loading="loading4">
						<div class="echarts" ref="Echarts5"></div>
					</div>
					<div class="noDataEcharts" v-if="isShowEcharts4 == 2">暂无数据</div>
				</div>
				<div class="placeEcharts">
					<div class="place-Echarts" v-if="isShowEcharts5 == 1" v-loading="loading5">
						<div class="echarts" ref="Echarts6"></div>
					</div>
					<div class="noDataEcharts" v-if="isShowEcharts5 == 2">暂无数据</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			school:'',
			cycle: '',
			cycleList: [],
			loading: true,
			loading1: true,
			loading2: true,
			loading3: true,
			loading4: true,
			loading5: true,
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
			quadrature:1,
			quadratureList: [{label: '照明插座用电', value: 1}, {label: '空调用电', value: 2}, {label: '动力用电', value: 3}, {label: '特殊用电', value: 4}],
			fourName: '照明插座用电',
			isShowEcharts: 1,
			isShowEcharts1: 1,
			isShowEcharts2: 1,
			isShowEcharts3: 1,
			isShowEcharts4: 1,
			isShowEcharts5: 1
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
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
				color: '#8EF6D2',
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList1,
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
			            data:this.dataValue1,
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
                        },
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
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
				color: '#8EF6D2',
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList2,
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
			            data:this.dataValue2,
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
			    title: {
					left: 'center',
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
				color: '#8EF6D2',
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList3,
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
			            name:'历史自管能耗',
			            type:'line',
			            stack: '总量',
			            data:this.dataValue3,
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
                        },
			        }
			    ]
			};
			myEcharts3.setOption(option3);

			let myEcharts4 = this.$echarts.init(this.$refs.Echarts4);
			let option4 = {
			    title: {
					left: 'center',
			        text: `四类分项: ${this.fourName}`
			    },
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
				color: '#8EF6D2',
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList4,
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
			            data:this.dataValue4,
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
                        },
			        }
			    ]
			};
			myEcharts4.setOption(option4);

			let myEcharts5 = this.$echarts.init(this.$refs.Echarts5);
			let option5 = {
			    title: {
					left: 'center',
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
				color: '#8EF6D2',
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList5,
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
			            name:'历史分摊能耗',
			            type:'line',
			            stack: '总量',
			            data:this.dataValue5,
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
                        },
			        }
			    ]
			};
			myEcharts5.setOption(option5);

			let myEcharts6 = this.$echarts.init(this.$refs.Echarts6);
			let option6 = {
			    title: {
					left: 'center',
			        text: `四类分项: ${this.fourName}`
			    },
			    tooltip: {
			        enterable:true,
			        trigger: 'axis',
			        axisPointer : {  
			            type : 'line'
			        }
			    },
				color: '#8EF6D2',
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: this.nameList6,
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
			            data:this.dataValue6,
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
                        },
			        }
			    ]
			};
			myEcharts6.setOption(option6);
		},
		initDataList(){
			this.$axios.post(`BMPlatServers/consum/queryperiod`).then((res)=>{
				// console.log(res)
				if(res.data.success) {
					this.cycleList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						    this.cycleList.push({label: item.name, value: item.Id});
						});
						this.cycle = this.cycleList[0].value
					}
				}else{
					this.cycleList = []
				}
			})
		},
		initData(){
			let data = {
				periodId:this.cycle,
				classId: this.quadrature,
				type:'1,2',
				depart: this.school
			}
			this.$axios.post(`BMPlatServers/consum/querypereff`, this.$qs.stringify(data)).then((res)=>{
				console.log(res);
				if(res.data.success) {
					this.nameList1 = []
					this.dataValue1 = []
					this.nameList2 = []
					this.dataValue2 = []
					this.nameList3 = []
					this.dataValue3 = []
					this.nameList4 = []
					this.dataValue4 = []
					this.nameList5 = []
					this.dataValue5 = []
					this.nameList6 = []
					this.dataValue6 = []
					this.isShowEcharts = true;
					if(res.data.result.allinfo && res.data.result.allinfo.length){
						if(res.data.result.allinfo[0].zconsunm && res.data.result.allinfo[0].zconsunm.length) {
							res.data.result.allinfo[0].zconsunm.forEach((item)=>{
								this.nameList1.push(item.time);
								this.dataValue1.push(item.consum);
							});
						}else{
							this.isShowEcharts = 2;
						}
					}
					if(res.data.result.allinfo && res.data.result.allinfo.length){
						if(res.data.result.allinfo[0].zclassList && res.data.result.allinfo[0].zclassList.length) {
							res.data.result.allinfo[0].zclassList.forEach((item)=>{
								this.nameList2.push(item.time);
								this.dataValue2.push(item.consum);
							});
						}else{
							this.isShowEcharts1 = 2;
						}
					}
					if(res.data.result.zginfo && res.data.result.zginfo.length){
						if(res.data.result.zginfo[0].zgconsunm && res.data.result.zginfo[0].zgconsunm.length) {
							res.data.result.zginfo[0].zgconsunm.forEach((item)=>{
								this.nameList3.push(item.time);
								this.dataValue3.push(item.consum);
							});
						}else{
							this.isShowEcharts2 = 2;
						}
					}
					if(res.data.result.zginfo && res.data.result.zginfo.length){
						if(res.data.result.zginfo[0].zgclassList && res.data.result.zginfo[0].zgclassList.length) {
							res.data.result.zginfo[0].zgclassList.forEach((item)=>{
								this.nameList4.push(item.time);
								this.dataValue4.push(item.consum);
							});
						}else{
							this.isShowEcharts3 = 2;
						}
					}
					if(res.data.result.gtinfo && res.data.result.gtinfo.length){
						if(res.data.result.gtinfo[0].gtconsunm && res.data.result.gtinfo[0].gtconsunm.length) {
							res.data.result.gtinfo[0].gtconsunm.forEach((item)=>{
								this.nameList5.push(item.time);
								this.dataValue5.push(item.consum);
							});
						}else{
							this.isShowEcharts4 = 2;
						}
					}
					if(res.data.result.gtinfo && res.data.result.gtinfo.length){
						if(res.data.result.gtinfo[0].gtclassList && res.data.result.gtinfo[0].gtclassList.length) {
							res.data.result.gtinfo[0].gtclassList.forEach((item)=>{
								this.nameList6.push(item.time);
								this.dataValue6.push(item.consum);
							});
						}else{
							this.isShowEcharts5 = 2;
						}
					}
					this.init();
					this.loading = false;
					this.loading1 = false;
					this.loading2 = false;
					this.loading3 = false;
					this.loading4 = false;
					this.loading5 = false;
			    }else{
				   this.loading = false;
				   this.loading1 = false;
				   this.loading2 = false;
				   this.loading3 = false;
				   this.loading4 = false;
				   this.loading5 = false;
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
			this.isShowEcharts4 = 1;
			this.isShowEcharts5 = 1;
			this.loading = true;
			this.loading1 = true;
			this.loading2 = true;
			this.loading3 = true;
			this.loading4 = true;
			this.loading5 = true;
			this.initData()
		},
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.initDataList()
		setTimeout(res=>{
			this.initData()
		},500)
	},
	watch:{
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
		    }else if(item == ''){
				this.fourName = '';
			}
		},
	}
}
</script>

<style lang="scss" scoped>
#periodicHistory{
	.periodicHistory{
		.top-search{
			padding-left: 20px;
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
