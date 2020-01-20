<template>
	<div id="consumeCompare">
		<div class="consumeCompare">
			<span>只选择月份</span>
			<el-date-picker  v-model="dataTime" value-format="MM" format="MM" type="month" placeholder="只能选择月份"></el-date-picker>
			<el-button @click="search" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search" class="btn">查询</el-button>
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
				num:1,
				consume:[],
				number:[],
				systemId:"",
				subsystemId:"",
				loading:true,
				dataTime:"10",
				isShowEcharts: true
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
			       tooltip: {
			           trigger: 'axis',
					   formatter: "{a} <br/>{b}: {c} GJ"
			       },
				   color: '#8EF6D2',
			       title: {
					   left: 'center',
					   text: '历史能耗'
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
			           data: this.number
			       },
			       yAxis: {
			           type: 'value',
					   name: 'GJ'
			       },
			       series: [
			           {
			               name:'历史能耗',
			               type:'line',
			               stack: '总量',
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
			               data: this.consume
			           }
			       ]
			    }
			    myChart2.setOption(option2);
			},
			search(){
				this.isShowEcharts = true;
				if(this.dataTime == null) {
					this.$notify.warning({
						title: '警告',
						message: '请选择月份',
						duration: 2000
					})
					return false;
				}
				this.loading = true;
				let data={
					systemId:this.systemId,
					subsystemId:this.subsystemId,
					buildingId:this.buildingId,
					time:this.dataTime
				}
				this.$axios.post(`BMPlatServers/hvacheat/queryMonthsConsume`, this.$qs.stringify(data)).then((res)=>{
				    if(res.data.success) {
						this.consume = [];
						this.number = [];
						if(res.data.result.list&&res.data.result.list.length){
							res.data.result.list.forEach((item)=>{
							    this.consume.push(item.consume);
							    this.number.push(item.number);
							});
						}else {
							this.isShowEcharts = false;
						}
						this.init()
						this.loading = false;
				    }else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000
						})
						this.loading = false;
						this.consume = [];
						this.number = [];
						this.init();
				    }
				});
			}
		},
		mounted(){
			var item = window.location.href.split("=")[1];
			this.systemId = item.split(",")[0];
			this.subsystemId = item.split(",")[1];
			this.buildingId = item.split(",")[2];
			this.search();
		},
		watch:{
			$route(item){
				var obj = item.fullPath.split("=")[1];
				this.systemId = obj.split(",")[0];
				this.subsystemId = obj.split(",")[1];
				this.buildingId = obj.split(",")[2];
				this.search();
			}
		}
	}
</script>

<style lang='scss' scoped>
#consumeCompare{
	padding: 20px 0;
	.consumeCompare{
		padding-left: 10px;
		.btn{
			margin-left: 20px;
		}
	}
	.echarts{
		width: 100%;
		height: 400px;
		margin-top: 20px;
	}
}
</style>
