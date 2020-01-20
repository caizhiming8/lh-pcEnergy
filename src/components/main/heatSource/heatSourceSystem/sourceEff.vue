<template>
	<div id="sourceEff">
		<div class="sourceEff">
			<b>查询方式</b>
			<el-select v-model="timeValue" placeholder="请选择" clearable class="selects">
			    <el-option v-for="(item, index) in time" :key="index" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<b style="margin-left: 20px;">查询时间</b>
			<el-date-picker v-if="types == 1" v-model="dataTime" type="datetime" disabled placeholder="选择日期时间"></el-date-picker>
			<el-date-picker v-if="types == 2" v-model="dataTime" value-format="yyyy" type="year" placeholder="选择日期时间"></el-date-picker>
			<el-date-picker v-if="types == 3" v-model="dataTime" value-format="yyyy-MM" type="month" placeholder="选择日期时间"></el-date-picker>
			<el-date-picker v-if="types == 4" v-model="dataTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
			<el-button @click="search" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
		</div>
		<div v-loading="loading" class="echarttop">
			<div class="noDataEcharts" v-if="!isShowEcharts1">暂无数据</div>
	        <div v-if="isShowEcharts1">
	            <div class="echarts" ref="Echarts1" ></div>
				<div class="echarts" ref="Echarts2" ></div>
	        </div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				query:1,
				systemId:"",
				subsystemId:"",
				buildingId:"",
				loading:true,
				number:[],
				personeff:[],
				areaeff:[],
				flag:"",
				time:[{label:"按年查询",value:1},{label:"按月查询",value:2},{label:"按日查询",value:3},{label:"按时查询",value:4}],
				dataTime:"",
				types:4,
				timeValue:4,
				isShowEcharts1: true
			}
		},
		methods:{
			init(){
				let myChart1 = this.$echarts.init(this.$refs.Echarts1);
				let option1 = {
				   tooltip: {
				       trigger: 'axis',
					   formatter: "{a} <br/>{b}: {c} GJ"
				   },
				   title: {
					   text: '人均能耗',
					   left: 'center'
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
				       data: this.number
				   },
				   yAxis: {
				       type: 'value',
					   name: 'GJ'
				   },
				   series: [
				       {
				           name:'人均能耗',
				           type:'line',
				           stack: '总量',
                           areaStyle: {
                               color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                   colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                   global: false
                               }
                           },
				           data: this.personeff
				       }
				   ]
				}
				myChart1.setOption(option1);

				let myChart2 = this.$echarts.init(this.$refs.Echarts2);
				let option2 = {
				   tooltip: {
				       trigger: 'axis',
					   formatter: "{a} <br/>{b}: {c} GJ"
				   },
				   title: {
					  text: '单位面积能耗',
					  left: 'center'
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
				   color: '#8EF6D2',
				   yAxis: {
				       type: 'value',
					   name: 'GJ'
				   },
				   series: [
				       {
				           name:'单位面积能耗',
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
				           data: this.areaeff
				       }
				   ]
				}
				myChart2.setOption(option2);
			},
			search(){
				this.isShowEcharts1 = true;
				if(!this.timeValue) {
					this.$notify.warning({
						title: '警告',
						message: '请选择查询方式',
						duration: 2000
					})
					return false;
				}
				if(this.timeValue != 1) {
					if(this.dataTime == null || this.dataTime == '') {
						this.$notify.warning({
							title: '警告',
							message: '请选择查询时间',
							duration: 2000
						})
						return false;
					}
				}
				this.loading = true;
				let data={
					systemId:this.systemId,
					subsystemId:this.subsystemId,
					buildingId:this.buildingId,
					query:this.query,
					flag: this.timeValue,
					time:this.dataTime
				}
				this.$axios.post(`BMPlatServers/hvacheat/queryCityHeatEfficiency`, this.$qs.stringify(data)).then((res)=>{
				    if(res.data.success) {
						this.personeff = [];
						this.areaeff = [];
						this.number = [];
						if(res.data.result.list&&res.data.result.list.length){
							res.data.result.list.forEach((item)=>{
							    this.personeff.push(item.personeff);
								this.areaeff.push(item.areaeff);
							    this.number.push(item.number);
							})
						}else {
							this.isShowEcharts1 = false;
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
			let date = new Date().getTime() - 24*60*60*1000;
			let date1 = new Date(date);
			let year = date1.getFullYear();
			let month = date1.getMonth() + 1;
			let day = date1.getDate();
			this.dataTime = `${year}-${month}-${day}`;
			var item = window.location.href.split("=")[1];
			this.systemId = item.split(",")[0];
			this.subsystemId = item.split(",")[1];
			this.buildingId = item.split(",")[2];
			this.search();
		},
		watch:{
			$route(item){
				var item = item.fullPath.split("=")[1];
				this.systemId = item.split(",")[0];
				this.subsystemId = item.split(",")[1];
				this.buildingId = item.split(",")[2];
			},
			timeValue(item){
				this.dataTime = '';
				if(item==1){
					this.types = 1;
				}else if(item==2){
					this.types = 2;
				}else if(item==3){
					this.types = 3;
				}else if(item==4){
					this.types = 4;
				}else{
					this.types = 4;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
#sourceEff{
    .sourceEff{
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
