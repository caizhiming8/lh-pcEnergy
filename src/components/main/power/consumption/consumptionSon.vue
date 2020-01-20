<template>
    <div id="consumptionSon">
        <div class="consumptionSon">
            <div class="placeEcharts">
            	<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading1">
            		<div class="echarts" ref="Echarts1"></div>
            	</div>
            	<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
            </div>
            <div class="placeEcharts">
            	<div class="place-Echarts" v-if="isShowEcharts1 == 1" v-loading="loading2">
            		<div class="echarts" ref="Echarts2"></div>
            	</div>
            	<div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../../../../../static/js/bus.js';
export default {
    data() {
        return{
            dataValue: [],
            dataValue1: [],
            dataName: [],
            dataName1: [],
            loading1: true,
            loading2: true,
			isShowEcharts: 1,
			isShowEcharts1: 1,
        }
    },
    methods: {
        init() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '统计内医院总能效',
                    subtext: '人均',
                    left: 'center'
                },

                tooltip: {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c} kW·h/人"
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '7%',
                    containLabel: true
                },
                color: '#8EF6D2',
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.dataName,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
                },
                yAxis: {
                    type: 'value',
					name : 'kW·h/人'
                },
                series: [
                    {
                        name:'统计总能效',
                        type:'line',
                        stack: '总量',
                        data:this.dataValue,
                        /* lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        }, */
						areaStyle: {normal: {
						    color: new echarts.graphic.LinearGradient(
						        0, 0, 0, 1,
						        [
						            {offset: 0, color: '#8EF6D2'},
						            {offset: 1, color: '#E7FAF5'}
						        ]
						    )
						}},
                    }
                ]
            };
            myEcharts1.setOption(option1);


            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                    text: '统计内医院总能效',
                    subtext: '单位面积',
                    left: 'center'
                },

                tooltip: {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c} kW·h/m²"
                },
                color: '#8EF6D2',
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '7%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.dataName1,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
                },
                yAxis: {
                    type: 'value',
					name : 'kW·h/m²'
                },
                series: [
                    {
                        name:'统计总能效',
                        type:'line',
                        stack: '总量',
                        data:this.dataValue1,
                        /* lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        }, */
						areaStyle: {normal: {
						    color: new echarts.graphic.LinearGradient(
						        0, 0, 0, 1,
						        [
						            {offset: 0, color: '#8EF6D2'},
						            {offset: 1, color: '#E7FAF5'}
						        ]
						    )
						}},
                    }
                ]
            };
            myEcharts2.setOption(option2);
        },
        initData() {
            bus.$on('TjnConsumByPepleList', (item)=>{
                this.dataName = [];
                this.dataValue = [];
				console.log(item)
				if(item && item.length){
					item.forEach((items)=>{
						this.dataName.push(items.time);
						this.dataValue.push(items.rate);
					})
				}else{
					this.isShowEcharts = 2;
				}
                this.init()
                this.loading1 = false;
            });

            bus.$on('TjnConsumByArerList', (item)=>{
                this.dataName1 = [];
                this.dataValue1 = [];
				if(item && item.length){
					item.forEach((items)=>{
						this.dataName1.push(items.time);
						this.dataValue1.push(items.rate);
					});
				}else{
					this.isShowEcharts1 = 2;
				}
                this.init()
                this.loading2 = false;
            });

            bus.$on('TjnConsumByPepleListErr', ()=>{
                this.loading1 = false;
                this.loading2 = false;
				this.isShowEcharts = 2;
				this.isShowEcharts1 = 2;
            });
        }
    },
    mounted() {
        /* this.initData();
        bus.$on('searchClick', ()=>{
            this.loading1 = true;
            this.loading2 = true;
        }); */
    }
}
</script>

<style lang="scss" scoped>
#consumptionSon{
    // padding: 15px;
    .consumptionSon{
        // padding: 10px;
        .placeEcharts{
            overflow: hidden;
            padding-top: 30px;
        	float: left;
        	width: 50%;
            .place-Echarts{
                float: left;
                width: 100%;
                .echarts{
                    float: left;
                    width: 100%;
                }
            }
        }
        .placeEcharts{
            overflow: hidden;
            padding-top: 30px;
        	float: left;
        	width: 50%;
            .place-Echarts{
            	width: 100%;
            	height: 300px;
            	float: left;
            	.echarts{
            		width: 100%;
            		height: 300px;
            		float: left;
            	}
            }
        }
    }
}
</style>
