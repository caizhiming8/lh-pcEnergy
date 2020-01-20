<template>
    <div id="deviceReal">
        <div class="deviceReal">
            <div class="placeTag">
                <p v-for="(item, index) in itemList" @click="handleClick(index)" :class="currentIndex==index?'active': ''">{{item.name}}</p>
            </div>

            <div class="placeEcharts" v-loading="loading">
    		    <div class="echarts" ref="Echarts01"></div>
    		    <div class="echarts" ref="Echarts02"></div>
    		    <div class="echarts" ref="Echarts03"></div>
    		</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            itemList: [{name: '用水量'}, {name: '用电量'}],
            currentIndex: 0,
            loading: true,
            yearSum: [],
            yearSum1: [],
            yearSum2: [],
            yeartext: '当年累计用水量',
            monthtext: '当月累计用水量',
            daytext: '当日累计用水量',
            buildingId: '',
            systemId: '',
            subsystemId: '',
            monad: 'm³'
        }
    },
    methods: {
        init() {
            let myChart01 = this.$echarts.init(this.$refs.Echarts01);
            let option01 = {
                title: {
                   left: 'center',
                   text: this.yeartext,
                },
                tooltip : {      // 鼠标滑过的显示值得处理
                    formatter: "{a} {b} : {c}" + this.monad
                },
                series: [
                    {
                        name: this.yeartext,
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
                        max: this.yearSum[0].value==0?100:parseInt((Math.random()+1)*this.yearSum[0].value),
                        detail: {
                            formatter: '{value} ' + this.monad,
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
                   text: this.monthtext,
                },
                tooltip : {
                    formatter: "{a} {b} : {c}" + this.monad
                },
                series: [
                    {
                        name: this.monthtext,
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
                        max: this.yearSum1[0].value==0?100:Math.round((Math.random()+1)*this.yearSum1[0].value),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} ' + this.monad,
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
                   text: this.daytext,
                },
                tooltip : {
                    formatter: "{a} {b} : {c}" + this.monad
                },
                series: [
                    {
                        name: this.daytext,
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
                        max:this.yearSum2[0].value==0?100:Math.round((Math.random()+1)*this.yearSum2[0].value),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} ' + this.monad,
                            textStyle: {
                                fontSize: 18,
                                fontWeight: 700
                            }
                        },
                        data: [{value: 0}],
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
                        data: this.yearSum2
                    }
                ]
            };
            myChart03.setOption(option03);
        },

        handleClick(i) {
            this.currentIndex = i;
            if(i == 0) {
                this.yeartext = '当年累计用水量';
                this.monthtext = '当月累计用水量';
                this.daytext = '当日累计用水量';
                this.monad = 'm³';
            }else{
                this.yeartext = '当年累计用电量';
                this.monthtext = '当月累计用电量';
                this.daytext = '当日累计用电量';
                this.monad = 'kWh';
            };
            this.loading = true;
            this.initData(i);
        },

        // 初始化数据
        initData(flag) {
            let data = {
                buildingId: this.buildingId,
                systemId: this.systemId,
                subsystemId: this.subsystemId,
                flag
            };
            this.$axios.post(`BMPlatServers/conditioner/queryNowConsume`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.yearSum = [];
                    this.yearSum1 = [];
                    this.yearSum2 = [];
                    res.data.result.yearconsume == undefined ? this.yearSum.push({value: 0}) : this.yearSum.push({value: res.data.result.yearconsume});
                    res.data.result.monthconsume == undefined ? this.yearSum1.push({value: 0}) : this.yearSum1.push({value: res.data.result.monthconsume});
                    res.data.result.dayconsume == undefined ? this.yearSum2.push({value: 0}) : this.yearSum2.push({value: res.data.result.dayconsume});
                    this.init();
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.yearSum.push({value: 0});
                    this.yearSum1.push({value: 0});
                    this.yearSum2.push({value: 0});
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        }
    },
    mounted() {
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.initData(0);
    },
    watch: {
        $route(to, from) {
            this.systemId = to.fullPath.split('=')[1].split(',')[0];
            this.subsystemId = to.fullPath.split('=')[1].split(',')[1];
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
        }
    }
}
</script>

<style lang="scss" scoped>
#deviceReal{
    .deviceReal{
        .placeTag{
            overflow: hidden;
            padding-top: 10px;
            p{
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

        }
        .placeEcharts{
            margin-top: 40px;
            overflow: hidden;
            .echarts{
                width: 33%;
                height: 300px;
                float: left;
            }
        }
    }
}
</style>
