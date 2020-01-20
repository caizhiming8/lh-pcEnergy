<template>
    <div id="watersSchoolTop">
        <div class="placeEcharts" v-loading="loading">
            <div class="echarts-left" ref="Echarts01"></div>
            <div class="echarts-center" ref="Echarts02"></div>
            <div class="echarts-right" ref="Echarts03"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            loading: true,
            yearSum: [{value: 0}],
            yearSum1: [{value: 0}],
            yearSum2: [{value: 0}],
            month: 1,
            date: 1
        }
    },
    methods: {
        init() {
            let myChart01 = this.$echarts.init(this.$refs.Echarts01);
            let option01 = {
                title: {
                   left: 'center',
                   text: '当年累计用水量',
                },
                tooltip : {      // 鼠标滑过的显示值得处理
                    formatter: "{a} {b} : {c} m³"
                },
                series: [
                    {
                        name: '用水量',
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
                        max: this.yearSum[0].value==0?100:parseInt(((Math.random()+1)*this.yearSum[0].value)*12/this.month),
                        detail: {
                            formatter: '{value} m³',
                            textStyle: {
                                fontSize: 18,
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
                        data: this.yearSum
                    },

                ]
            };
            myChart01.setOption(option01);

            let myChart02 = this.$echarts.init(this.$refs.Echarts02);
            let option02 = {
                title: {
                   left: 'center',
                   text: '当月累计用水量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c} m³"
                },
                series: [
                    {
                        name: '用水量',
                        type: 'gauge',
                        // radius: 100,
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
                        max: this.yearSum1[0].value==0?100:Math.round(((Math.random()+1)*this.yearSum1[0].value)*30/this.date),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} m³',
                            textStyle: {
                                fontSize: 18,
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
                        data: this.yearSum1
                    }
                ]
            };
            myChart02.setOption(option02);

            let myChart03 = this.$echarts.init(this.$refs.Echarts03);
            let option03 = {
                title: {
                   left: 'center',
                   text: '当日累计用水量',
                },
                tooltip : {
                    formatter: "{a} {b} : {c} m³"
                },
                series: [
                    {
                        name: '用水量',
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
                        min: 0,
                        max: this.yearSum2[0].value==0?100:Math.round(((Math.random()+1)*this.yearSum2[0].value)*30/this.date),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} m³',
                            textStyle: {
                                fontSize: 18,
                                fontWeight: 700
                            }
                        },
                        data: this.yearSum2,
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

        // 初始化数据实时年月日当前累计
        initData() {
            this.$axios.post(`BMPlatServers/water/querySchoolWater`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.yearSum[0].value = Number(res.data.result.yearconsume);
                    this.yearSum1[0].value = Number(res.data.result.monthconsume);
                    this.yearSum2[0].value = Number(res.data.result.dayconsume);
                }else{
                    this.yearSum[0].value = 0;
                    this.yearSum1[0].value = 0;
                    this.yearSum2[0].value = 0;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
                this.init();
                this.loading = false;
            });
        },
    },
    mounted() {
        var date=new Date;
        this.month=date.getMonth()+1;
        this.date = date.getDate();
        this.initData();
    }
}
</script>

<style lang="scss" scoped>
#watersSchoolTop{
    .placeEcharts{
        overflow: hidden;
        padding-top: 20px;
        .echarts-left{
            float: left;
            width: 32%;
            height: 300px;
        }
        .echarts-center{
            float: left;
            width: 32%;
            height: 300px;
        }
        .echarts-right{
            float: left;
            height: 300px;
            width: 32%;
        }
    }
}
</style>
