<template>
	<div id ="sourcehistorydata">
		<div class="sourcehistorydata">
			<div class="sourcehistorydata-data">
			    <span class="spans">历史数据</span>
			    <div class="sourcehistorydata-data-history">
			        <span>设备列表</span>
			        <el-select v-model="device" placeholder="请选择" class="selects">
			            <el-option v-for="(item, index) in deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
			        </el-select>
			        <b style="margin-left: 20px;">时间段查询</b>
			        <el-date-picker v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
			        <el-button @click="search" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
			    </div>
				<div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
		        <div v-if="isShowEcharts">
		            <div class="echarts" ref="EchartsT" v-loading="loadingT"></div>
		        </div>
			</div>
			<div class="sourcehistorydata-consume">
			    <span class="spans">历史能耗</span>
			    <div class="placeBox">
			        <div class="sourcehistoryconsume">
					    <b>查询方式</b>
					    <el-select v-model="timeValue" placeholder="请选择" clearable class="selects">
					        <el-option v-for="(item, index) in time" :key="index" :label="item.label" :value="item.value"></el-option>
					    </el-select>
					    <b style="margin-left: 20px;">查询时间</b>
					    <el-date-picker v-if="types == 1" v-model="dataTime" type="datetime" disabled placeholder="选择日期时间"></el-date-picker>
					    <el-date-picker v-if="types == 2" v-model="dataTime" value-format="yyyy" type="year" placeholder="选择日期时间"></el-date-picker>
					    <el-date-picker v-if="types == 3" v-model="dataTime" value-format="yyyy-MM" type="month" placeholder="选择日期时间"></el-date-picker>
					    <el-date-picker v-if="types == 4" v-model="dataTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
					    <el-button @click="historySearch" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
					</div>
					<div class="noDataEcharts" v-if="!isShowEcharts1">暂无数据</div>
			        <div v-if="isShowEcharts1">
			            <div class="echarts" ref="Echarts2" v-loading="loading"></div>
			        </div>
			    </div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				time:[{label:"按年查询",value:1},{label:"按月查询",value:2},{label:"按日查询",value:3},{label:"按时查询",value:4}],
				types:4,
				timeValue: 4,
				loading:false,
				dataTime:'',
				water:[],
				month: [],
				query:1,
				systemId:"",
				subsystemId:"",
				buildingId:"",
				loadingT:true,
				deviceList:[],
				device:"",
				deviceId:"",
				deviceType:"",
				dateRange:[],
				startTime:"",
				endTime:"",
				xAxis: [],
				dataValue: [],
				dataType: '',
				deviceId: '',
				isShowEcharts: true,
				isShowEcharts1: true
			}
		},
		methods:{
			 init1() {
				 let myChartT = this.$echarts.init(this.$refs.EchartsT);
				 let optionT = {
				    tooltip: {
				        trigger: 'axis',
						formatter: "{a} <br/>{b}: {c} GJ"
				    },
					title: {
						left: 'center',
 			            text: '历史数据',
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
				        data: this.xAxis
				    },
				    yAxis: {
				        type: 'value',
						name: 'GJ'
				    },
					color: '#8EF6D2',
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
				            name:'时间段历史数据',
				            type:'line',
				            stack: '总量',
	                        areaStyle: {
	                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
	                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
	                                global: false
	                            }
	                        },
				            data: this.dataValue,
				        }
				    ]
				 }
				 myChartT.setOption(optionT);
			 },
			 init2() {
			    let myChart2 = this.$echarts.init(this.$refs.Echarts2);
			    let wid = document.body.clientWidth || document.documentElement.clientWidth
			    var resize = {
			      width: wid - 380,
			      height: 300
			    };
			    myChart2.resize(resize);
			    let option2 = {
			       tooltip: {
			           trigger: 'axis',
					   formatter: "{a} <br/>{b}: {c} GJ"
			       },
				   title: {
					   left: 'center',
					   text: '历史能耗',
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
			           data: this.month
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
                           areaStyle: {
                               color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                   colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                   global: false
                               }
                           },
			               data: this.water
			           }
			       ]
			    }
			    myChart2.setOption(option2);
			},
			// 历史能耗查询
			historySearch(){
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
					if(!this.dataTime) {
						this.$notify.warning({
							title: '警告',
							message: '请选择查询时间',
							duration: 2000
						})
						return false;
					}
				}

				this.loading = true;
				let data = {
				    flag: this.timeValue,
				    time:this.dataTime,
					query:this.query,
					systemId:this.systemId,
					subsystemId:this.subsystemId,
					buildingId:this.buildingId
				};
				this.$axios.post(`BMPlatServers/hvacheat/queryCityHeatHistory`, this.$qs.stringify(data)).then((res)=>{
					// console.log(res);
				    if(res.data.success) {
						this.water = [];
						this.month = [];
						if(res.data.result.list&&res.data.result.list.length){
							res.data.result.list.forEach((item)=>{
							    this.water.push(item.consume);
							    this.month.push(item.number);
							})
						}else {
							this.isShowEcharts1 = false;
						}
						this.init2();
						this.loading = false;
				    }else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000
						})
				    }
				});
			},

			// 历史数据查询
			search() {
				this.isShowEcharts = true;
				if(!this.device) {
					this.$notify.warning({
						title: '警告',
						message: '请选择设备',
						duration: 2000
					})
					return false;
				}
				if(this.dateRange == null) {
					this.$notify.warning({
						title: '警告',
						message: '请选择时间查询',
						duration: 2000
					})
					return false;
				}
				this.loadingT = true;
			    let data = {
			        buildingId:this.buildingId,
			        deviceId: this.deviceId,
			        dataType: this.dataType,
			        startTime: this.startTime,
			        endTime: this.endTime
			    };
			    this.$axios.post(`BMPlatServers/hvacheat/queryCityHeatRealHistory`, this.$qs.stringify(data)).then((res)=>{
			        // console.log(res);
			        if(res.data.success) {
			            this.xAxis = [];
			            this.dataValue = [];
			            if(res.data.result.list && res.data.result.list.length) {
			                res.data.result.list.forEach((item)=>{
			                    this.xAxis.push(item.number);
			                    this.dataValue.push(item.consume);
			                })
							this.init1();
							this.loadingT = false;
			            }else{
							this.isShowEcharts = false;
			                this.loadingT = false;
			            }
			        }else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000
						})
			            this.loadingT = false;
						this.init1();
			        }
			    })
			},
			// 设备列表查询
			queryDevices(){
				let data = {
					systemId:this.systemId,
					subsystemId:this.subsystemId,
					buildingId:this.buildingId
				};
				this.$axios.post(`BMPlatServers/hvacheat/queryHistoryHeatDevice`, this.$qs.stringify(data)).then((res)=>{
					// console.log(res);
				    if(res.data.success) {
				        this.deviceList = [];
				        if(res.data.result.list && res.data.result.list.length) {
				            res.data.result.list.forEach((item)=>{
				                this.deviceList.push({label: item.dataName, value: `${item.dataType},${item.deviceId}`})
				            })
							let str = res.data.result.list[0].dataType + ',' + res.data.result.list[0].deviceId;
							this.device = str
							if(this.deviceList[0].value) {
								this.dataType = this.deviceList[0].value.split(',')[0];
								this.deviceId = this.deviceList[0].value.split(',')[1];
							}
				        }
						this.search();
				    }else{
				        // this.$message.warning(res.data.resultMessage);
				    }
				});
			}
		},
		mounted(){
			let date = new Date().getTime();
			date = date - 24*60*60*1000;
			let dates = new Date(date);
			let endYear = dates.getFullYear()
			let endMonth = dates.getMonth() + 1;
			let endDay = dates.getDate();
			let date2 = new Date(date - 48*60*60*1000);
			let startYear = date2.getFullYear();
			let startMonth = date2.getMonth() + 1;
			let startDay = date2.getDate();
			this.startTime = `${startYear}-${startMonth}-${startDay}`;
			this.endTime = `${endYear}-${endMonth}-${endDay}`;
			this.dateRange = [];
			this.dateRange.push(this.startTime);
			this.dateRange.push(this.endTime);
			this.dataTime = `${endYear}-${endMonth}-${endDay}`;
			var item = window.location.href.split("=")[1].split(",");
			this.systemId = item[0];
			this.subsystemId = item[1];
			this.buildingId = item[2];
			this.queryDevices();
			this.historySearch();
		},
		watch:{
			$route(item){
				var item = item.fullPath.split("=")[1].split(",");
				this.systemId = item[0];
				this.subsystemId = item[1];
				this.buildingId = item[2];
				this.search();
			},
			timeValue(olds){
				if(olds==1){
					this.types=1;
				}else if(olds==2){
					this.types=2;
				}else if(olds==3){
					this.types=3;
				}else if(olds==4){
					this.types=4;
				}else{
					this.types=4;
				}
				 this.dataTime = ''
			},
			device(item) {
				if(item) {
					this.dataType = item.split(',')[0];
				    this.deviceId = item.split(',')[1];
				}else{
					this.dataType = '';
					this.deviceId = '';
				}
			},
			dateRange(item) {
			    if(item && item.length) {
					let startTime = item[0];
					let endTime = item[1];
					if(new Date(endTime).getTime() - new Date(startTime).getTime() >= 72*60*60*1000) {
						this.$notify.warning({
							message: '输入的时间不能超过三天',
							title: '警告',
							duration: 2000
						})
						this.startTime = '';
						this.endTime = '';
						this.dateRange = null;
					}else{
						this.startTime = item[0];
						this.endTime = item[1];
					}
			    }else{
					this.startTime = '';
					this.endTime = '';
				}
			}
		}

	}
</script>
<style lang="scss" scoped>
#sourcehistorydata{
    .sourcehistorydata{
        .sourcehistorydata-data{
            background: #fff;
            border-radius: 4px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            -o-border-radius: 4px;
            span.spans{
                display: block;
                border-bottom: 1px solid #ddd;
                padding: 5px 10px;
                font-size: 16px;
                color: #666;
            }
            .sourcehistorydata-data-history{
                padding: 15px;
                .selects{
                    width: 300px;
                }
            }
            .echarts{
                width: 100%;
                height: 300px;
            }
        }
        .sourcehistorydata-consume{
            background: #fff;
            margin-top: 10px;
            border-radius: 4px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            -o-border-radius: 4px;
            span.spans{
                display: block;
                border-bottom: 1px solid #ddd;
                padding: 5px 10px;
                font-size: 16px;
                color: #666;
            }
            .placeBox{
                padding: 15px;
                .echarts{
                    width: 100%;
                    height: 300px;
					margin-top: 20px;
                }
            }
        }
    }
}
</style>
