<template>
    <div id="energyConsumptionManagementReal">
        <div class="energyConsumptionManagementReal">
            <div class="echarts" ref="Echarts01"></div>
            <div class="echarts" ref="Echarts02"></div>
            <div class="echarts" ref="Echarts03"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{

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
                                width: 10
                            }
                        },
                        splitNumber:4,  // 表盘上显示的刻度个数
                        min:0,
                        // max: parseInt(((Math.random()+1)*this.yearSum[0].value)*12/this.month),
                        max: 100,
                        detail: {formatter:'{value}'},
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
                        data: [{value: 50}],
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
                                width: 10
                            }
                        },
                        min:0,
                        // max: this.yearSum1[0].value==0?100:Math.round(((Math.random()+1)*this.yearSum1[0].value)*30/this.date),
                        max: 100,
                        splitNumber:4,
                        detail: {formatter:'{value}'},
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
                        data: [{value: 70}]
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
                                width: 10
                            }
                        },
                        min:0,
                        max:120,
                        splitNumber:4,
                        detail: {formatter:'{value}'},
                        data: [{value: 20}],
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
        }
    },
    mounted() {
        setTimeout(()=>{
            this.init();
        }, 400);
    }
}
</script>

<style lang="scss" scoped>
#energyConsumptionManagementReal{
    .energyConsumptionManagementReal{
        overflow: hidden;
        .echarts{
            width: 33%;
            height: 300px;
            float: left;
        }
    }
}
</style>
