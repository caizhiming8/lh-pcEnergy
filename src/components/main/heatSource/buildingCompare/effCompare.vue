<template>
	<div id="effCompare">
		<div class="effCompare">
			<b>查询方式</b>
			<el-select v-model="timeValue" placeholder="请选择" clearable class="selects">
			    <el-option v-for="(item, index) in time" :key="index" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<b style="margin-left: 20px;">查询时间</b>
			<el-date-picker v-if="types == 1" v-model="dataTime" value-format="yyyy" type="year" placeholder="选择日期时间"></el-date-picker>
			<el-date-picker v-if="types == 2" v-model="dataTime" value-format="yyyy-MM" type="month" placeholder="选择日期时间"></el-date-picker>
			<el-date-picker v-if="types == 3" v-model="dataTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
			<el-button @click="search" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
		</div>
		<div v-loading="loading" class="echarttop">
			<div class="echarts" ref="Echarts1" ></div>
			<div class="echarts" ref="Echarts2" ></div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				flag:1,
				areaeff:[],
				personeff:[],
				buildings:[],
				systemId:"",
				subsystemId:"",
				loading:false,
				types:3,
				time:[{label:"按年查询",value:1},{label:"按月查询",value:2},{label:"按日查询",value:3}],
				dataTime:"",
				timeValue:3
			}
		},
		methods:{
			init() {
				let myChart1 = this.$echarts.init(this.$refs.Echarts1);
				let option1 = {
				    color: ['#3398DB'],
					title: {
						text: '单位面积',
  					    left: 'center'
					},
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {
				            type : 'shadow'
				        },
						formatter: "{a} <br/>{b}: {c} GJ / ㎡"
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
				            data : this.buildings,
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
							name: 'GJ/㎡'
				        }
				    ],
				    series : [
				        {
				            name:'单位面积',
				            type:'bar',
				            barWidth: '60%',
				            data: this.areaeff,
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
				myChart1.setOption(option1);

			    let myChart2 = this.$echarts.init(this.$refs.Echarts2);
				let option2 = {
				    color: ['#3398DB'],
					title: {
						text: '人均',
  					    left: 'center'
					},
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {
				            type : 'shadow'
				        },
						formatter: "{a} <br/>{b}: {c} GJ / 人"
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
				            data : this.buildings,
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
							name: 'GJ/人'
				        }
				    ],
				    series : [
				        {
				            name:'人均',
				            type:'bar',
				            barWidth: '60%',
				            data: this.personeff,
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
			    myChart2.setOption(option2);
			},
			search(){
				if(!this.timeValue) {
					this.$notify.warning({
	                    title: '警告',
	                    message: '请选择查询时间',
	                    duration: 3000
	                })
	                return false;
				}
				if(this.dataTime==null || this.dataTime == ''){
					this.$notify.warning({
	                    title: '警告',
	                    message: '请选择查询时间',
	                    duration: 3000
	                })
	                return false;
				}
				this.loading = true;
				let data={
					systemId:this.systemId,
					subsystemId:this.subsystemId,
					flag:this.flag,
					time:this.dataTime
				}
				this.$axios.post(`BMPlatServers/hvacheat/queryBuildingsEff`, this.$qs.stringify(data)).then((res)=>{
					// console.log(res);
				    if(res.data.success) {
						this.buildings = [];
						this.areaeff = [];
						this.personeff =[];
						if(res.data.result.list&&res.data.result.list.length){
							res.data.result.list.forEach((item)=>{
							    this.personeff.push(item.personeff);
								this.areaeff.push(item.areaeff);
							    this.buildings.push(item.buildingName);
							})
						}else {
							this.$message.warning({
		                        message: '暂无数据',
		                        showClose: true,
								duration: 1000
		                    })
						}
						this.init();
						this.loading = false;
				    }else{
						this.loading = false;
						this.$message.warning({
	                        message: res.data.resultMessage,
	                        showClose: true,
							duration: 1000
	                    })
				    }
				});
			}
		},
		mounted(){
			let date = new Date().getTime() - 24*60*60*1000;
			let date1 = new Date(date);
			let year = date1.getFullYear();
			let month = date1.getMonth() + 1;
			let day = date1.getDate();
			this.dataTime = `${year}-${month}-${day}`;
			this.loading = true;
			var item = window.location.href.split("=")[1];
			this.systemId = item.split(",")[0];
			this.subsystemId = item.split(",")[1];
			this.search();
		},
		watch:{
			$route(item){
				this.loading = true;
				var obj = item.fullPath.split("=")[1];
				this.systemId = obj.split(",")[0];
				this.subsystemId = obj.split(",")[1];
				this.search();
			},
			timeValue(olds){
				if(olds==1){
					this.types=1;
					this.flag = 1;
				}else if(olds==2){
					this.types=2;
					this.flag=2;
				}else if(olds==3){
					this.types=3;
					this.flag=3
				}
				this.dataTime = '';
			}
		}
	}
</script>

<style lang="scss" scoped>
#effCompare{
    .effCompare{
        padding: 25px;
        .selects{
            width: 110px;
        }
    }
	.echarttop{
		overflow:hidden;
		.echarts{
			width: 50%;
		    height: 400px;
			float:left;
		}
	}
}
</style>
