<template>
	<div id="secondOrder">
		<div class="secondOrder">
			<div class="secondOrder_center">
				<div class="placeEcharts">
					<div>
						<span class="numerical">实时总能耗：
							<v-countup :startValue="0" :endValue="duanluo" :decimals="2" :duration="1"></v-countup>
							kw·h</span>
						<div class="place-Echarts" v-if="isShowEcharts == 1"  v-loading="loading1">
							<div class="echarts" ref="Echarts1"></div>
						</div>
						<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
					</div>

				</div>
				<div class="placeEcharts1">
					<div>
						<span class="numerical">自管总能耗：
							<v-countup :startValue="0" :endValue="duanluo1" :decimals="2" :duration="1"></v-countup>kw·h
						</span>
						<div class="place-Echarts" v-if="isShowEcharts1 == 1"  v-loading="loading2">
							<div class="echarts1" ref="Echarts3"></div>
						</div>
						<div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>
					</div>
				</div>
				<div class="placeEcharts2">
					<div>
						<span class="numerical">
							公摊总能耗：<v-countup :startValue="0" :endValue="duanluo2" :decimals="2" :duration="1"></v-countup>kw·h
						</span>
						<div class="place-Echarts" v-if="isShowEcharts2 == 1" v-loading="loading3">
							<div class="echarts2" ref="Echarts5"></div>
						</div>
						<div class="noDataEcharts" v-if="isShowEcharts2 == 2">暂无数据</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return{
			school: '',
			XvaluePeoson: [],
			dataValuePerson: [],
			areaValue: [],
			areaValue2: [],
			XvaluePeoson1: [],
			dataValuePerson1: [],
			XvaluePeoson2: [],
			dataValuePerson2: [],
			loading1: true,
			loading2: true,
			loading3: true,
			duanluo: '',
			duanluo1: '',
			duanluo2: '',
			isShowEcharts: 1,
			isShowEcharts1: 1,
			isShowEcharts2: 1
		}
	},
	methods: {
		init() {
			let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
			let option1 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '实时能耗',
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
			            data : this.XvaluePeoson,
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
			            name:'人均',
			            type:'bar',
			            barWidth: '60%',
			            data:this.dataValuePerson,
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
		let myEcharts3 = this.$echarts.init(this.$refs.Echarts3);
			let option3 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '自管能耗',
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
			            data : this.XvaluePeoson1,
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
			            data:this.dataValuePerson1,
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
		let myEcharts5 = this.$echarts.init(this.$refs.Echarts5);
			let option5 = {
			    color: ['#3398DB'],
			    title: {
			        left: 'center',
			        text: '公摊能耗',
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
			            data : this.XvaluePeoson2,
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
			            name:'人均',
			            type:'bar',
			            barWidth: '60%',
			            data:this.dataValuePerson2,
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
			myEcharts5.setOption(option5);
		},
		initData(){
			this.isShowEcharts = 1;
			this.isShowEcharts1 = 1;
			this.isShowEcharts2 = 1;
			let data = {
				depart:this.school,
				type:'1,2'
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/querydepartrealcons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res);
			    if(res.data.success) {
					this.XvaluePeoson = [];
					this.dataValuePerson = [];
					this.duanluo = '';
					this.XvaluePeoson1 = [];
					this.dataValuePerson1 = [];
					this.duanluo1 = '';
					this.XvaluePeoson2 = [];
					this.dataValuePerson2 = [];
					this.duanluo2 = '';
					if(res.data.result.allinfo[0].classList != [] && res.data.result.allinfo[0].classList.length != 0){
						this.duanluo = res.data.result.allinfo[0].consunm
						res.data.result.allinfo[0].classList.forEach((item)=>{
							this.XvaluePeoson.push(item.class_name);
							this.dataValuePerson.push(item.usage);
						});
						console.log(this.isShowEcharts)
					}else{
						this.isShowEcharts = 2;
					}
					this.duanluo2 = res.data.result.gtinfo[0].consunm
					if(res.data.result.gtinfo[0].classList != []&& res.data.result.gtinfo[0].classList.length != 0){
						res.data.result.gtinfo[0].classList.forEach((item)=>{
							this.XvaluePeoson2.push(item.class_name);
							this.dataValuePerson2.push(item.usage);
						});
					}else{
						this.isShowEcharts2 = 2;
					}
					this.duanluo1 = res.data.result.zginfo[0].consunm
					if(res.data.result.zginfo[0].classList != []&& res.data.result.zginfo[0].classList.length != 0){
						res.data.result.zginfo[0].classList.forEach((item)=>{
							this.XvaluePeoson1.push(item.class_name);
							this.dataValuePerson1.push(item.usage);
						});
					}else{
						this.isShowEcharts1 = 2;
					}
					this.init();
					this.loading1 = false;
					this.loading2 = false;
					this.loading3 = false;
			    }else{
				   this.loading1 = false;
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
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.initData();
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
		},
	}
}
</script>
<style lang="scss" scoped>
#secondOrder{
	.secondOrder{
		padding: 10px;
		.placeEcharts{
			overflow: hidden;
			padding-top: 20px;
			.numerical{
				color: #434343;
				font-size: 16px;
				font-weight: 500;
			}
			.echarts{
				width: 100%;
				height: 300px;
				float: left;
			}
		}
		.placeEcharts1{
			overflow: hidden;
			padding-top: 20px;
			.numerical{
				color: #434343;
				font-size: 16px;
				font-weight: 500;
			}
			.echarts1{
				width: 100%;
				height: 300px;
				float: left;
			}
		}
		.placeEcharts2{
			overflow: hidden;
			padding-top: 20px;
			.numerical{
				color: #434343;
				font-size: 16px;
				font-weight: 500;
			}
		   .echarts2{
			   width: 100%;
			   height: 300px;
			   float: left;
		   }
		}
	}
}
</style>
