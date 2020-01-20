<template>
    <div id="buildingListReal">
        <div class="buildingListReal">
            <div class="buildingListReal-right" v-loading="loading">
                <div class="echarts" ref="Echarts01"></div>
                <div class="echarts" ref="Echarts02"></div>
                <div class="echarts" ref="Echarts03"></div>
            </div>
        </div>
    </div>
</template>

<script>
import session from '../../../../../static/js/session.js';
export default {
    props: ['giveSonData'],
    data() {
        return{
            loading: true,
			buildingId: '',
			subId: '',
			yearData: [],
			monthData: [],
			dayData: []
        }
    },
    methods: {
        init() {
            let myChart01 = this.$echarts.init(this.$refs.Echarts01);
            let option01 = {
                title: {
                   left: 'center',
                   text: '当年累计用电量',
                },
                tooltip : {      // 鼠标滑过的显示值得处理
                    formatter: "{a} {b} : {c}"
                },
                series: [
                    {
                        name: '用电量',
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
                        max: this.yearData[0].value==0?100:parseInt((Math.random()+1)*this.yearData[0].value),
                        detail: {
                            formatter: '{value} kW·h',
                            textStyle: {
                                fontSize: 15,
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
                        data: this.yearData
                    },

                ]
            };
            myChart01.setOption(option01);

            let myChart02 = this.$echarts.init(this.$refs.Echarts02);
            let option02 = {
                title: {
                   left: 'center',
                   text: '当月累计用电量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c}"
                },
                series: [
                    {
                        name: '用电量',
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
                        max: this.monthData[0].value==0?100:parseInt((Math.random()+1)*this.monthData[0].value),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} kW·h',
                            textStyle: {
                                fontSize: 15,
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
                        data: this.monthData
                    }
                ]
            };
            myChart02.setOption(option02);

            let myChart03 = this.$echarts.init(this.$refs.Echarts03);
            let option03 = {
                title: {
                   left: 'center',
                   text: '当日累计用电量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c}"
                },
                series: [
                    {
                        name: '用电量',
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
                        max:this.dayData[0].value==0?100:parseInt((Math.random()+1)*this.dayData[0].value),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} kW·h',
                            textStyle: {
                                fontSize: 15,
                                fontWeight: 700
                            }
                        },
                        data: this.dayData,
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
                        }
                    }
                ]
            };
            myChart03.setOption(option03);
        },
		initData() {
			let data = {
				building_id: this.buildingId,
				id: this.subId
			};
			// console.log(data);
			this.$axios.post(`BMPlatServers/electricity/querysubbuidrealcons`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res);
				if(res.data.success) {
					this.yearData = [];
					this.monthData = [];
					this.dayData = [];
					this.yearData.push({value: res.data.result.realTimeConSum.subYearCon});
					this.monthData.push({value: res.data.result.realTimeConSum.subMonthCon});
					this.dayData.push({value: res.data.result.realTimeConSum.subDayCon})
					this.init();
                    this.loading = false;
				}else{
                    this.loading = false;
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		}
    },

    mounted() {
        this.subId = window.location.href.split('=')[1];
        if(session.get('buildingId')) {
            this.buildingId = session.get('buildingId');
        }
		this.initData();
    },
    watch: {
        $route(to, from) {
            this.subId = to.fullPath.split('=')[1];
            this.loading = true;
            this.initData();
        },
        giveSonData(item) {
            if(typeof(item.chidren) == 'undefined') {
                session.set('buildingId', item.id);
                this.buildingId = item.id;
                this.loading = true;
                this.initData();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#buildingListReal{
    .buildingListReal{
        .buildingListReal-right{
            padding-top: 50px;
            height: 300px;
            .echarts{
                width: 33%;
                height: 300px;
                float: left;
            }
        }
    }
}
</style>
