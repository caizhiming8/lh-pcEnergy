<template>
	<div id ="sourcerealdata">
		<div class="placeEcharts" v-loading="loading">
		    <div class="echarts-left" ref="Echarts01"></div>
		    <div class="echarts-center" ref="Echarts02"></div>
		    <div class="echarts-right" ref="Echarts03"></div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
			    loading: true,
			    yearSum: [],
			    yearSum1: [],
				yearSum2: [],
				systemId:"",
				subsystemId:"",
				buildingId:"",
				yeartext:"当年供暖季累计用热量",
				monthtext:"当月供暖季累计用热量",
				daytext:"当日供暖季累计用热量",
				name:"用热量",
				query:"1"
			}
		},
		methods:{
			init() {
			    let myChart01 = this.$echarts.init(this.$refs.Echarts01);
				let wid1 = document.body.clientWidth || document.documentElement.clientWidth
			    var resize1 = {
			      width: wid1/3 - 150,
			      height: 300
			    };
			    myChart01.resize(resize1);
			    let option01 = {
			        title: {
			           left: 'center',
			           text: this.yeartext,
			        },
			        tooltip : {      // 鼠标滑过的显示值得处理
			            formatter: "{a} {b} : {c} GJ"
			        },
			        series: [
			            {
			                name: this.name,
			                type: 'gauge',
			                axisLine: {   // 表盘宽度
								lineStyle: {
		                            width: 8,
		                            color: [
		                                [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
		                                        offset: 0.1,
		                                        color: "#FFC600"
		                                    },
		                                    {
		                                        offset: 0.6,
		                                        color: "#30D27C"
		                                    },
		                                    {
		                                        offset: 1,
		                                        color: "#0B95FF"
		                                    }
		                                ])]
		                            ]
		                        }
			                },
			                splitNumber:4,  // 表盘上显示的刻度个数
			                min:0,
			                max: this.yearSum[0].value==0?100:parseInt((Math.random()+1)*this.yearSum[0].value),
							detail: {
	                            formatter: '{value} GJ',
	                            textStyle: {
	                                fontSize: 18,
	                                fontWeight: 700
	                            }
	                        },
			                axisLabel: {
			                    textStyle: {       // 属性lineStyle控制线条样式
			                        color: '#000',
			                        fontSize:18,   //改变仪表盘内刻度数字的大小
			                        shadowColor : '#000', //默认透明
			                    }
			                },
			                pointer: {   // 指针的宽度和长度
			                    width:3,//指针的宽度
			                    length:"80%", //指针长度，按照半圆半径的百分比
			                    shadowColor : '#ccc', //默认透明
			                    shadowBlur: 5
			                },
			                splitLine: {   //分割线的长度
					        	length: 10
					        },
			                axisLabel: {
			                     distance: 10,
			                     fontSize: 10,
			                     formatter: function(v){    // 坐标轴数值的刻度取整数
			                         return v.toFixed(0);
			                     },
			                },
			                data: this.yearSum
			            },

			        ]
			    };
			    myChart01.setOption(option01);

			    let myChart02 = this.$echarts.init(this.$refs.Echarts02);
				let wid2 = document.body.clientWidth || document.documentElement.clientWidth
			    var resize2 = {
			      width: wid2/3 - 150,
			      height: 300
			    };
			    myChart02.resize(resize2);
			    let option02 = {
			        title: {
			           left: 'center',
			           text: this.monthtext,
			        },
			        tooltip : {
			            formatter: "{a} {b} : {c} GJ"
			        },
			        series: [
			            {
			                name: this.name,
			                type: 'gauge',
			                // radius: 100,
			                axisLine: {
								lineStyle: {
		                            width: 8,
		                            color: [
		                                [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
		                                        offset: 0.1,
		                                        color: "#FFC600"
		                                    },
		                                    {
		                                        offset: 0.6,
		                                        color: "#30D27C"
		                                    },
		                                    {
		                                        offset: 1,
		                                        color: "#0B95FF"
		                                    }
		                                ])]
		                            ]
		                        }
			                },
			                min:0,
			                max: this.yearSum1[0].value==0?100:Math.round((Math.random()+2)*this.yearSum1[0].value),
			                splitNumber:4,
							detail: {
	                            formatter: '{value} GJ',
	                            textStyle: {
	                                fontSize: 18,
	                                fontWeight: 700
	                            }
	                        },
			                axisLabel: {
			                    textStyle: {       // 属性lineStyle控制线条样式
			                        color: '#000',
			                        fontSize:8,   //改变仪表盘内刻度数字的大小
			                        shadowColor : '#000', //默认透明
			                    }
			                },
			                pointer: {
			                    width:3,//指针的宽度
			                    length:"80%", //指针长度，按照半圆半径的百分比
			                    shadowColor : '#ccc', //默认透明
			                    shadowBlur: 5
			                },
			                splitLine: { //分割线样式
					        	 length: 10
					        },
			                axisLabel: {            // 坐标轴小标记
			                     distance: 10,
			                     fontSize: 10,
			                     formatter: function(v){
			                         return v.toFixed(0);
			                     },
			                },
			                data: this.yearSum1
			            }
			        ]
			    };
			    myChart02.setOption(option02);

			    let myChart03 = this.$echarts.init(this.$refs.Echarts03);
				let wid3 = document.body.clientWidth || document.documentElement.clientWidth
			    var resize3 = {
			      width: wid3/3 - 150,
			      height: 300
			    };
			    myChart03.resize(resize3);
			    let option03 = {
			        title: {
			           left: 'center',
			           text: this.daytext,
			        },
			        tooltip : {
			            formatter: "{a} {b} : {c} GJ"
			        },
			        series: [
			            {
			                name: this.name,
			                type: 'gauge',
			                axisLine: {
								lineStyle: {
		                            width: 8,
		                            color: [
		                                [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
		                                        offset: 0.1,
		                                        color: "#FFC600"
		                                    },
		                                    {
		                                        offset: 0.6,
		                                        color: "#30D27C"
		                                    },
		                                    {
		                                        offset: 1,
		                                        color: "#0B95FF"
		                                    }
		                                ])]
		                            ]
		                        }
			                },
			                min:0,
			                max:this.yearSum2[0].value==0?100:Math.round((Math.random()+3)*this.yearSum2[0].value),
			                splitNumber:4,
							detail: {
	                            formatter: '{value} GJ',
	                            textStyle: {
	                                fontSize: 18,
	                                fontWeight: 700
	                            }
	                        },
			                data: [{value: 0}],
			                axisLabel: {
			                    textStyle: {       // 属性lineStyle控制线条样式
			                        color: '#000',
			                        fontSize:8,   //改变仪表盘内刻度数字的大小
			                        shadowColor : '#000', //默认透明
			                    }
			                },
			                pointer: {
			                    width:3,//指针的宽度
			                    length:"80%", //指针长度，按照半圆半径的百分比
			                    shadowColor : '#ccc', //默认透明
			                    shadowBlur: 5
			                },
			                splitLine: { //分割线样式
					        	 length: 10
					        },
			                axisLabel: {            // 坐标轴小标记
			                     distance: 10,
			                     fontSize: 10,
			                     formatter: function(v){
			                         return v.toFixed(0);
			                     },
			                },
							data: this.yearSum2
			            }
			        ]
			    };
			    myChart03.setOption(option03);
			},

			initData() {
				let data={
					systemId:this.systemId,
					subsystemId:this.subsystemId,
					buildingId:this.buildingId,
					query:this.query
				}
			    this.$axios.post(`BMPlatServers/hvacheat/queryCityHeat`, this.$qs.stringify(data)).then((res)=>{
			        if(res.data.success) {
						this.yearSum=[];
						this.yearSum1=[];
						this.yearSum2=[];
						if(res.data.result.yearconsume != undefined) {
							this.yearSum.push({value:Number(res.data.result.yearconsume)});
						}
			            if(res.data.result.monthconsume != undefined) {
							this.yearSum1.push({value:Number(res.data.result.monthconsume)});
						}
			            if(res.data.result.dayconsume != undefined) {
							this.yearSum2.push({value:Number(res.data.result.dayconsume)});
						}
						this.init();
						this.loading = false;
			        }else{
						this.yearSum.push({value:0});
						this.yearSum1.push({value:0});
						this.yearSum2.push({value:0});
			        }
			    });
			}
		},
		mounted(){
			var item = window.location.href.split("=")[1].split(",");
			this.systemId = item[0];
			this.subsystemId = item[1];
			this.buildingId = item[2];
			this.initData();
		},
		watch:{
			$route(item){
				this.loading = true;
				var item = item.fullPath.split("=")[1].split(",");
				this.systemId = item[0];
				this.subsystemId = item[1];
				this.buildingId = item[2];
				this.initData();
			}
		}
	}
</script>

<style  lang="scss" scoped>
	#sourcerealdata{
	    .placeEcharts{
	        overflow: hidden;
	        padding-top: 20px;
	        .echarts-left{
	            float: left;
	            width: 32%;
	            height: 300px;
	        }
	        .echarts-center{
	            float: left;
	            width: 32%;
	            height: 300px;
	        }
	        .echarts-right{
	            float: left;
	            height: 300px;
	            width: 32%;
	        }
	    }
	}
</style>
