<template>
	<div id="realdata">
		<div class="realdata">
			<b>设备列表</b>
			<el-select v-model="deviceData" placeholder="请选择" class="">
			    <el-option v-for="(item, index) in devices" :key="index" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<b style="margin-left: 20px;">查询时间</b>
			<el-date-picker  v-model="time" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			<el-button @click="search" style="margin-left: 40px;" size="small" type="primary" icon="el-icon-search">查询</el-button>
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
				devices:[],
				buildingId:"",
				historydata:[],
				loading:true,
				deviceData:"",
				dataType:"",
				deviceId:"",
				time:[],
				startTime:"",
				endTime:"",
				hvac:[],
				number:[],
				isShowEcharts: true,
				monad1: '',
				systemId: '',
				subsystemId: ''
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
					   formatter: "{a} <br/>{b}: {c}" + this.monad1
			       },
				   color: '#8EF6D2',
			       title: {
					  text: '历史数据',
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
			       yAxis: {
			           type: 'value',
					   name: this.monad1
			       },
				    dataZoom: [
                      	{
                        	type: 'slider',
                        	show: true,
                        	xAxisIndex: [0],
                        	start: 1,
                        	end: 100,
                        	showDetail: true
                    	},
                    	{
	                        type: 'inside',
	                        xAxisIndex: [0],
	                        start: 1,
	                        end: 100,
	                        showDetail: true
                    	}
                  	],
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
			                data: this.hvac
			            }
			        ]
			    }
			    myChart2.setOption(option2);
			},
			initDevice(){
				let data={
					buildingId:this.buildingId,
					systemId: this.systemId,
					subsystemId: this.subsystemId
				}
				this.$axios.post(`BMPlatServers/hvacheat/queryHistoryHeatDevice`, this.$qs.stringify(data)).then((res)=>{
					// console.log(res);
				    if(res.data.success) {
						this.devices = [];
						if(res.data.result.list&&res.data.result.list.length) {
							res.data.result.list.forEach((item)=>{
								this.devices.push({
									label:item.dataName,
									value:item.deviceId+','+item.dataType+','+item.unit
								})
							})
							this.deviceData = res.data.result.list[0].deviceId + ',' + res.data.result.list[0].dataType + ',' + res.data.result.list[0].unit;
							this.dataType = res.data.result.list[0].dataType;
							this.deviceId = res.data.result.list[0].deviceId;
							this.monad1 = res.data.result.list[0].unit
							this.search();
						}else {
							// this.$message.warning("暂无数据");
						}
				    }else{

				    }
				});
			},
			search(){
				this.isShowEcharts = true;
				if(this.startTime==""){
					this.$notify.warning({
	                    title: '警告',
	                    message: '请选择时间',
	                    duration: 3000
	                })
	                return false;
				}
				this.loading = true;
				let data={
					buildingId:this.buildingId,
					deviceId:this.deviceId,
					dataType:this.dataType,
					startTime:this.startTime,
					endTime:this.endTime
				}
				// console.log(data);
				this.$axios.post(`BMPlatServers/hvacheat/queryCityHeatRealHistory`, this.$qs.stringify(data)).then((res)=>{
					console.log(res);
					if(res.data.success) {
						this.hvac = [];
						this.number=[];
						if(res.data.result.list&&res.data.result.list.length){
							res.data.result.list.forEach((item)=>{
								this.hvac.push(item.consume);
								this.number.push(item.number);
							});
						}else {
							this.isShowEcharts = false;
						}
						this.init();
						this.loading = false;
					}else{
						this.loading = false;
						this.$message.warning({
							message: '系统异常',
							showClose: true,
							duration: 1000
						})
					}
				});
			}
		},
		mounted(){
			let date1 = new Date(new Date().getTime() - 48*60*60*1000);
			let startYear = date1.getFullYear();
			let startMonth = date1.getMonth()+1;
			let startDay = date1.getDate();
			let startHours = date1.getHours();
			let startMinutes = date1.getMinutes();
			let startSeconds = date1.getSeconds();
			let date2 = new Date(new Date().getTime());
			let endYear = date2.getFullYear();
			let endMonth = date2.getMonth()+1;
			let endDate = date2.getDate();
			let endHours = date2.getHours();
			let endMinutes = date2.getMinutes();
			let endSeconds = date2.getSeconds();
			this.startTime = `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}:${startSeconds}`;
			this.endTime = `${endYear}-${endMonth}-${endDate} ${endHours}:${endMinutes}:${endSeconds}`;
			this.time = [];
			this.time.push(this.startTime);
			this.time.push(this.endTime);
			var item = window.location.href.split("=")[1];
			this.buildingId = item.split(",")[2];
			this.systemId = item.split(",")[0];
			this.subsystemId = item.split(",")[1];
			this.initDevice();
		},
		watch:{
			$route(item){
				var item = item.fullPath.split("=")[1].split(",");
				this.buildingId = item[2];
				this.initDevice();
			},
			deviceData(item){
				if(item) {
					this.deviceId = item.split(",")[0];
					this.dataType = item.split(",")[1];
					this.monad1 = item.split(",")[2];
				}else{
					this.deviceId = '';
					this.dataType = '';
				}
			},
			time(item){
				if(item == null) {
					this.startTime = '';
					this.endTime = '';
				}else{
					let startTime = item[0];
					let endTime = item[1];
					if(new Date(endTime).getTime() - new Date(startTime).getTime() >= 72*60*60*1000) {
						this.$notify.warning({
							title: '警告',
							message: '输入的时间不能超过三天',
							duration: 2000
						})
						this.startTime = '';
						this.endTime = '';
						this.time = null;
					}else{
						this.startTime = item[0];
						this.endTime = item[1];
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
#realdata{
    .realdata{
        padding: 25px;
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
