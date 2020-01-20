<template>
    <div id="generalAlarm">
        <div class="generalAlarm">
            <div class="alarmLeft" v-loading="loading">
                <div class="echarts" ref="Echarts1"></div>
            </div>
            <div class="alarmRight" v-loading="loading1">
                <div class="echarts" ref="Echarts2"></div>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../../../../../static/js/bus.js';
import QS from 'qs'
export default {
    data() {
        return{
			arr:[],
			arrm:[],
			starr:[],
			starrm:[],
			loading:true,
			loading1:true,
			allnum:0
		}
    },
    methods: {
        init() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '总告警条数',
                    subtext: this.allnum,
                    x: 'center',
                    y: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:this.arrm
                },
                series: [
                    {
                        name:'告警级别',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.arr
                    }
                ]
            };
            myEcharts1.setOption(option1);

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                    text: '总告警条数',
                    subtext: this.allnum,
                    x: 'center',
                    y: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '15px',
                    data:this.starrm
                },
                series: [
                    {
                        name:'告警类型',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.starr
                    }
                ]
            };
            myEcharts2.setOption(option2);
        },
		initData() {
			let param = {
				systemId:2
			}
    		//查询各等级的报警数量
    		this.$axios.post(`BMPlatServers/warn/queryWarningDegree`,this.$qs.stringify(param)).then((response) => {
                console.log(response);
    			if(response.data.success){
                    this.arr = [];
                    this.arrm = [];
    				if(response.data.result&&response.data.result.length){
    					response.data.result.forEach((item)=>{
    						this.arr.push({value:item.number,name:item.message});
    						this.arrm.push(item.message);
    						this.allnum = item.allnum;
    					})
    				}else{
    					this.arr.push({value:0,name:'没有告警'});
    					this.arrm.push('没有告警');
    					this.allnum = '0';
    				}
    				this.init();
    				this.loading = false;
    			}else{
                    this.loading = false;
    				this.$message.warning({
						message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
    			}
    		});
    		//查询各状态的报警数量
    		this.$axios.post(`BMPlatServers/warn/queryWarningStatus`,this.$qs.stringify(param)).then((response) => {
				if(response.data.success){
                    this.starr = [];
                    this.starrm = [];
					if(response.data.result&&response.data.result.length){
						response.data.result.forEach((item)=>{
							this.starr.push({value:item.number,name:item.message});
							this.starrm.push(item.message);
							this.allnum = item.allnum;
						})
					}else{
						this.starr.push({value:0,name:'没有告警'});
						this.starrm.push('没有告警');
						this.allnum = '0';
					}
					this.init();
					this.loading1 = false;
				}else{
                    this.loading1 = false;
					this.$message.warning({
						message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		}
    },
    mounted() {
		this.initData();
        bus.$on('updateData', (updateData)=>{
            this.initData();
        })
    }
}
</script>

<style lang="scss" scoped>
#generalAlarm{
    .generalAlarm{
        overflow: hidden;
        .alarmLeft{
            float: left;
            width: 49%;
            border-right: 1px solid #ddd;
        }
        .alarmRight{
            float: left;
            width: 50%;
        }
        .echarts{
            width: 100%;
            height: 300px;
        }
    }
}
</style>
