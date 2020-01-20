<template>
	<div id="buildingCompare">
		<div class="buildingCompare">
			<ul>
                <li v-for="(item, index) in List" @click="handleClick(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
            </ul>
		</div>
		<div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
        <div v-if="isShowEcharts">
            <div class="echarts" ref="Echarts2" v-loading="loading"></div>
        </div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				flag:1,
				num:'1',
				consume:[],
				buildings:[],
				systemId:"",
				subsystemId:"",
				loading:true,
				isShowEcharts: true,
				List: [{name: '当年累计'}, {name: '当月累计'}, {name: '当日累计'}],
				currentIndex: 0
			}
		},
		methods:{
			init() {
			    let myChart2 = this.$echarts.init(this.$refs.Echarts2);
			    let wid = document.body.clientWidth || document.documentElement.clientWidth
			    var resize = {
			      width: wid - 300,
			      height: 300
			    };
			    myChart2.resize(resize);
				let option2 = {
				    color: ['#3398DB'],
					title: {
						text: '历史能耗',
  					    left: 'center'
					},
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {
				            type : 'shadow'
				        },
						formatter: "{a} <br/>{b}: {c} GJ"
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
							},
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
							name: 'GJ'
				        }
				    ],
				    series : [
				        {
				            name:'历史能耗',
				            type:'bar',
				            barWidth: '60%',
				            data: this.consume,
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
			handleClick(item){
				this.currentIndex = item;
				this.loading = true;
				this.flag = Number(item) + 1;
				this.search();
			},
			search(){
				this.isShowEcharts = true;
				let data={
					systemId:this.systemId,
					subsystemId:this.subsystemId,
					flag:this.flag
				}
				this.$axios.post(`BMPlatServers/hvacheat/queryBuildingsConsume`, this.$qs.stringify(data)).then((res)=>{
				    if(res.data.success) {
						this.consume = [];
						this.buildings = [];
						if(res.data.result.list && res.data.result.list.length) {
							res.data.result.list.forEach((item)=>{
							    this.consume.push(item.consume);
							    this.buildings.push(item.buildingName);
							});
						}else {
							this.isShowEcharts = false;
						}
						this.init()
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
			}
		}
	}
</script>

<style lang="scss" scoped>
#buildingCompare{
	.buildingCompare{
		ul{
			overflow: hidden;
			padding-bottom: 30px;
			padding-top: 10px;
			li{
				float: left;
				padding: 5px 15px;
				border: 1px solid #409eff;
				border-radius: 3px;
				-webkit-border-radius: 3px;
				-moz-border-radius: 3px;
				-ms-border-radius: 3px;
				-o-border-radius: 3px;
				color: #409eff;
				margin: 0 10px;
				cursor: pointer;
				&.active{
					background: #409EFF;
					color: #fff;
					font-weight: normal;
				}
			}
		}
	}
}
</style>
