<template>
    <div id="totalSubsystemPowerDistribute">
        <div class="totalSubsystemPowerDistribute">
            <div class="placeSearch">
                <span class="searchType">查询方式</span>
                <el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
                    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="Time-search">查询时间</span>
                <el-date-picker v-model="timeData" v-if="this.types == 1" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <el-button type="primary" size="small" icon="el-icon-search" class="btn" @click="search">搜索</el-button>
            </div>
            <div class="placeEchart" v-loading="loading">
                <div class="echarts" ref="Echarts"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            subsystem: '',
            subsystemList: [],
            choiceTime: 2,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            timeData: '2019-01',
            types: 2,
            year: '2019',
            month: '01',
            day: '',
            loading: true,
			dataName: [],
			dataValue: [],
        }
    },
    methods: {
        init() {
            let myEcharts = this.$echarts.init(this.$refs.Echarts);
            let option = {
                title : {
                    text: '能耗分布',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} kW·h"
                },
                color: ['#FCC667', '#BC8DEE','#F66F6F', '#2DA8E8', '#B5B5B5'],
                legend: {
                    orient: 'vertical',
                    left: '10px',
                    data: this.dataName
                },
                series : [
                    {
                        name: '子系统能耗分布',
                        type: 'pie',
                        radius : '70%',
                        center: ['50%', '60%'],
                        data: this.dataValue,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            myEcharts.setOption(option);
        },
        search() {
            if(!this.choiceTime || this.timeData == '' || this.timeData == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.loading = true;
			this.initData()
        },
		/* 查询 */
		initData(){
			let param = {
				year: this.year,
				month: this.month,
				day: this.day,
				hour: '',
				id:this.subsystem,
				queryFlag:this.choiceTime,
			}
			this.$axios.post(`BMPlatServers/electricity/querysubenergyspread`,this.$qs.stringify(param)).then((res)=>{
				// console.log(res);
                this.dataName = [];
                this.dataValue = [];
				if(res.data.success) {
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
    						this.dataName.push(item.name);
    						this.dataValue.push({name:item.name,value:item.consum});
    					});
                    }else{
                        this.$message.warning({
							message: '暂无数据',
							showClose: true,
							duration: 1000,
						});
                        this.dataName.push('交流中心');
                        this.dataValue.push({name:'交流中心',value:0});
                    }
                    this.init();
                    this.loading = false;
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.loading = false;
                    this.dataName.push('交流中心');
                    this.dataValue.push({name:'交流中心',value:0});
                    this.init();
				}
			});
		}
    },
    mounted() {
		let dates = new Date();
		dates = dates.getTime();
		dates = dates - 24*60*60*1000;
		let yesToday = new Date(dates);
		let year = yesToday.getFullYear();
		let month = yesToday.getMonth() + 1;
		let day = yesToday.getDate();
		this.timeData = `${year}-${month}-${day}`;
		this.year = year;
		this.month = month;
        this.subsystem = window.location.href.split('=')[1];
		this.initData();
    },
    watch: {
        $route(to, from) {
            this.subsystem = to.fullPath.split('=')[1];
            this.initData();
        },
        timeData(item) {
            if(item == '' || item == null) {
                this.year = '';
                this.month = '';
                this.day = '';
            }else{
                this.year = item.split('-')[0];
                this.month = item.split('-')[1];
                this.day = item.split('-')[2];
            }
        },
        choiceTime(item) {
            if(item==1) {
                this.types = 1;
            }else if(item==2) {
                this.types = 2;
            }else if(item==3) {
                this.types = 3;
            }
            this.timeData = '';
        }
    }
}
</script>

<style lang="scss" scoped>
#totalSubsystemPowerDistribute{
    .totalSubsystemPowerDistribute{
        .placeSearch{
            .searchType{
                margin-left: 20px;
            }
            .Time-search{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
        }
        .placeEchart{
            padding-top: 30px;
            .echarts{
                width: 100%;
                height: 500px;
            }
        }
    }
}
</style>
