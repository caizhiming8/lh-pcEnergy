<template>
	<div id="consumehistory">
		<div class="consumehistory">
			<ul>
                <li v-for="(item, index) in List" @click="handleClick(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
            </ul>
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
		<div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
		<div v-loading="loading" class="echarttop" v-if="isShowEcharts">
			<div class="echarts" ref="Echarts2"></div>
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
				heat:[],
				flag:"",
				time:[{label:"按年查询",value:1},{label:"按月查询",value:2},{label:"按日查询",value:3},{label:"按时查询",value:4}],
				dataTime:"",
				types:4,
				timeValue:4,
				num:"1",
				monad: 'GJ',
				isShowEcharts: false,
				List: [{name: '热量'}, {name: '电量'}, {name: '水量'}],
				currentIndex: 0
			}
		},
		methods:{
			init(){
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
					   formatter: "{a} <br/>{b}: {c} " + this.monad
				   },
				  title: {
					 text: '历史能耗',
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
					   name: this.monad
				   },
				   series: [
				       {
				           name:'历史能耗',
				           type:'line',
				           stack: '总量',
                           areaStyle: {
                               color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                   colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                   global: false
                               }
                           },
				           data: this.heat
				       }
				   ]
				}
				myChart2.setOption(option2);
			},
			handleClick(item) {
				this.loading = true;
				this.currentIndex = item;
				this.query = item + 1;
				this.search();
				if(item == 0) {
					this.monad = 'GJ';
				}else if(item == 1) {
					this.monad = 'kWh';
				}else if(item == 2) {
					this.monad = 'm³';
				}
			},
			search(){
				this.isShowEcharts = true;
				if(!this.timeValue) {
					this.$notify.warning({
	                    title: '警告',
	                    message: '请选择查询方式',
	                    duration: 3000
	                })
	                return false;
				}
				if(this.timeValue != 1) {
					if(!this.dataTime || this.dataTime == null) {
						this.$notify.warning({
		                    title: '警告',
		                    message: '请选择时间',
		                    duration: 3000
		                })
		                return false;
					}
				}
				let data={
					systemId:this.systemId,
					subsystemId:this.subsystemId,
					buildingId:this.buildingId,
					query:this.query,
					flag: this.timeValue,
					time:this.dataTime
				}
				this.loading = true;
				this.$axios.post(`BMPlatServers/hvacheat/queryCityHeatHistory`, this.$qs.stringify(data)).then((res)=>{
				    if(res.data.success) {
						this.heat = [];
						this.number = [];
						if(res.data.result.list&&res.data.result.list.length){
							res.data.result.list.forEach((item)=>{
							    this.heat.push(item.consume);
							    this.number.push(item.number);
							})
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
			let date2 = new Date(new Date().getTime());
			let endYear = date2.getFullYear();
			let endMonth = date2.getMonth()+1;
			let endDate = date2.getDate();
			this.dataTime = `${endYear}-${endMonth}-${endDate}`;
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
				if(item==1){
					this.types = 1;
				}else if(item==2){
					this.types = 2;
				}else if(item==3){
					this.types = 3;
				}else if(item==4){
					this.types = 4;
				}
				this.dataTime = '';
			}
		}
	}
</script>

<style lang="scss" scoped>
#consumehistory{
    .consumehistory{
        padding: 0 10px;
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
			li:first-child{
				margin-left: 0;
			}
        }
        .selects{
            width: 110px;
        }
    }
    .echarts{
        width: 100%;
        height: 400px;
    }
}
</style>
