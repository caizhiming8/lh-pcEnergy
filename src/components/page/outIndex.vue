<template>
    <div id="outIndex">
        <div class="outIndex">
            <div class="header">
                <div class="header-left">
                    <span class="span-left">济南中西医结合医院</span>
                </div>
                <p class="p1">能源管控数据平台</p>
                <div class="header-right">
                    <div class="span-right">
                        <p class="pnei" @click="giMain" id="pnei">后台操作系统</p>
                    </div>
                </div>
            </div>

            <div class="main">
                <div class="main-left">
                    <div class="main-left-top1 main-left-top">
                        <div class="top">
                            <span class="span1">{{dates}}</span>
                            <span class="span1">{{time}}</span>
                            <span class="span1">{{day}}</span>
                        </div>
                        <ul class="bottom">
                            <li>
                                <b class="b1">
                                    <img src="../../../static/img/wendu@2x.png" class="img1">
                                    <h6>温度</h6>
                                </b>
                                <b class="b2 b">{{tem}}</b>
                            </li>
                            <li>
                                <b class="b1">
                                    <img src="../../../static/img/shidu@2x.png" class="img2">
                                    <h6>湿度</h6>
                                </b>
                                <b class="b2 bb">{{humidity}}%RH</b>
                            </li>
                            <li>
                                <b class="b1">
                                    <!-- <img src="../../../static/img/tianqi@2x.png" class="img3"> -->
                                    <i class="iconfont icon-fengsu" style="font-size: 30px; color: #22eaf5;position: relative; left: -15px"></i>
                                </b>
                                <b class="b2 bbb">{{wea}}污染</b>
                            </li>
                        </ul>
                    </div>
                    <div class="main-left-top2 main-left-top">
                        <div class="inner-main-left-top2">
                            <div class="inner-top">
                                <img src="../../../static/img/qq@2x.png">
                                <span class="span3">供电历史能耗</span>
                            </div>
                            <div class="echarts" ref="Echarts1" v-loading="loading1" element-loading-background="#1B2775" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"></div>
                        </div>
                    </div>
                    <div class="main-left-top3 main-left-top">
                        <div class="inner-main-left-top3">
                            <div class="inner-top">
                                <img src="../../../static/img/qq@2x.png">
                                <span class="span3">供水历史能耗</span>
                            </div>
                            <div class="echarts" ref="Echarts2" v-loading="loading2" element-loading-background="#1B2775" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"></div>
                        </div>
                    </div>
                    <div class="main-left-top4 main-left-top">
                        <div class="inner-main-left-top4">
                            <div class="inner-top">
                                <img src="../../../static/img/qq@2x.png">
                                <span class="span3">暖通历史能耗</span>
                            </div>
                            <div class="echarts" ref="Echarts3" v-loading="loading3" element-loading-background="#1B2775" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"></div>
                        </div>
                    </div>
                </div>
                <div class="main-right">
                    <div class="main-right-top">
                        <div class="main-right-top-left">
                            <div class="inner-main-right-top-left">
                                <div class="inner-main-right-top-left-top">
                                    <img src="../../../static/img/qq@2x.png">
                                    <span class="span7">实时数据</span>
                                </div>
                                <ol class="ol1">
                                    <li class="li1">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">综合病房楼</span>
                                    </li>
                                    <li class="li2">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">三号公寓</span>
                                    </li>
                                    <li class="li3">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">办公楼</span>
                                    </li>
                                    <li class="li4">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">锅炉房</span>
                                    </li>
                                    <li class="li5">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">专家公寓</span>
                                    </li>
                                    <li class="li6">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">一号公寓</span>
                                    </li>
                                    <li class="li7">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">餐厅楼</span>
                                    </li>
                                    <li class="li8">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">实践基地</span>
                                    </li>
                                    <li class="li9">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">实验楼</span>
                                    </li>
                                    <li class="li10">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">图书馆</span>
                                    </li>
                                    <li class="li11">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">一号教学楼</span>
                                    </li>
                                    <li class="li12">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">二号教学楼</span>
                                    </li>
                                    <li class="li13">
                                        <img src="../../../static/img/blue.gif" ref="img1">
                                        <span class="span6">艺术楼</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div class="main-right-top-right">
                            <div class="real">
                                <div class="real-top">
                                    <img src="../../../static/img/qq@2x.png">
                                    <span class="span4">实时告警</span>
                                </div>
                                <div class="real-bottom">
                                    <div class="li">
                                        <div class="echarts" ref="Echarts4" v-loading="loading4" element-loading-background="#1B2775" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"></div>
                                        <span class="span5">供电告警</span>
                                    </div>
                                    <div class="li">
                                        <div class="echarts" ref="Echarts5" v-loading="loading5" element-loading-background="#1B2775" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"></div>
                                        <span class="span5">供水告警</span>
                                    </div>
                                    <div class="li">
                                        <div class="echarts" ref="Echarts6" v-loading="loading6" element-loading-background="#1B2775" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"></div>
                                        <span class="span5">供暖告警</span>
                                    </div>
                                    <div class="li">
                                        <div class="echarts" ref="Echarts7" v-loading="loading7" element-loading-background="#1B2775" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"></div>
                                        <span class="span5">中央空调</span>
                                    </div>
                                </div>
                            </div>

                            <div class="inspection">
                                <div class="inner-inspection">
                                    <div class="tbl-header">
                                        <ul class="ul6">
                                            <li>巡检编号</li>
                                            <li>巡检人</li>
                                            <li>巡检计划</li>
                                            <li>巡检周期</li>
                                            <li>是否巡检</li>
                                        </ul>
                                    </div>
                                    <div class="placetbl-body">
                                        <div class="tbl-body">
                                            <ul class="ul6"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="main-right-bottom">
                        <div class="main-right-bottom-left">
                            <el-carousel indicator-position="none" :interval="6000">
                                <el-carousel-item>
                                    <div class="el-carousel-top">
                                        <img src="../../../static/img/qq@2x.png">
                                        <span class="span8">供电楼宇能耗占比</span>
                                    </div>
                                    <div class="echarts" ref="Echarts8"></div>
                                </el-carousel-item>
                                <el-carousel-item>
                                    <div class="el-carousel-top">
                                        <img src="../../../static/img/qq@2x.png">
                                        <span class="span8">供水楼宇能耗占比</span>
                                    </div>
                                    <div class="echarts" ref="Echarts9"></div>
                                </el-carousel-item>
                                <el-carousel-item>
                                    <div class="el-carousel-top">
                                        <img src="../../../static/img/qq@2x.png">
                                        <span class="span8">供暖楼宇能耗占比</span>
                                    </div>
                                    <div class="echarts" ref="Echarts10"></div>
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                        <div class="main-right-bottom-right">
                            <div class="inner-main-right-bottom-right">
                                <div class="x-top">
                                    <div class="x-top-header">
                                        <img src="../../../static/img/qq@2x.png">
                                        <span class="span8">报修管理</span>
                                    </div>
                                    <div class="placeEcharts">
                                        <div class="echarts" ref="Echarts12"></div>
                                        <div class="echarts" ref="Echarts13"></div>
                                        <div class="echarts" ref="Echarts14"></div>
                                        <div class="echarts" ref="Echarts15"></div>
                                    </div>
                                </div>
                                <div class="x-middle">
                                    <div class="Left">
                                        <div class="left-x-top-header">
                                            <img src="../../../static/img/qq@2x.png">
                                            <span class="span8">设备故障</span>
                                        </div>
                                        <div class="echarts" ref="Echarts16"></div>
                                    </div>
                                    <div class="Right">
                                        <div class="Right-x-top-header">
                                            <img src="../../../static/img/qq@2x.png">
                                            <span class="span8">采集器状态</span>
                                        </div>
                                        <div class="echarts" ref="Echarts17"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            dates: '-',
            time: '-',
            day: '-',
            loading1: true,
            loading2: true,
            loading3: true,
            loading4: true,
            loading5: true,
            loading6: true,
            loading7: true,

            yName1: [],
            dataValue1: [],
            yName2: [],
            dataValue2: [],
            yName3: [],
            dataValue3: [],
            dataValue4: [],
            dataValue5: [],
            dataValue6: [],
            dataValue7: [],
            tableData: [],
            dataValue16: [],
            dataValue17: [],
            yName8: [],
            dataValue8: [],
            yName9: [],
            dataValue9: [],
            yName10: [],
            dataValue10: [],

            person1: '0',
            person2: '0',
            person3: '0',
            personAll: '0',
            personAll1: '0',
            person0: 0,

            humidity: '',
            tem: '',
            wea: ''
        }
    },
    methods: {
        init1() {
            let myChart = this.$echarts.init(this.$refs.Echarts1);
            let option = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} kW·h",
                   axisPointer: {
                       type: "none"
                   }
               },
               color: '#8EF6D2',
               grid: {
                   left: '3%',
                   right: '7%',
                   bottom: '10%',
                   top: '10%',
                   containLabel: true
               },
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: this.yName1,
                   axisLabel: {
                       color: "#30eee9"
                   },
               },
               yAxis: {
                   type: 'value',
                   axisLabel: {
                       color: "#30eee9",
                       formatter: "{value}",
                       fontSize: "12px"
                   },
                   splitLine: {
                       show: false
                   }
               },
               series: [
                   {
                       name:'历史能耗',
                       type:'line',
                       stack: '总量',
                       symbol:'circle',
                       symbolSize: 8,
                       itemStyle: {
           			        normal: {
           			            areaStyle: {
           							//color: '#94C9EC'
           							color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
           								offset: 0,
           								color: 'rgba(7,44,90,0.3)'
           							}, {
           								offset: 1,
           								color: 'rgba(0,212,199,0.9)'
           							}]),
           			            }
           			        }
       				    },
                       data: this.dataValue1
                   },

               ]
            }
            myChart.setOption(option);
        },
        init2() {
            let myChart = this.$echarts.init(this.$refs.Echarts2);
            let option = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} m³",
                   axisPointer: {
                       type: "none"
                   }
               },
               color: '#9F17FF',
               grid: {
                   left: '3%',
                   right: '7%',
                   bottom: '10%',
                   top: '10%',
                   containLabel: true
               },
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: this.yName2,
                   axisLabel: {
                       color: "#30eee9"
                   },
               },
               yAxis: {
                   type: 'value',
                   axisLabel: {
                       color: "#30eee9",
                       formatter: "{value}",
                       fontSize: "12px"
                   },
                   splitLine: {
                       show: false
                   }
               },
               series: [
                   {
                       name:'历史能耗',
                       type:'line',
                       stack: '总量',
                       symbol:'circle',
                       symbolSize: 8,
                       itemStyle: {
           			        normal: {
           			            areaStyle: {
           							//color: '#94C9EC'
           							color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
           								offset: 0,
           								color: '#112255'
           							}, {
           								offset: 1,
           								color: '#9F17FF'
           							}]),
           			            }
           			        }
       				    },
                       data:this.dataValue2
                   },

               ]
            }
            myChart.setOption(option);
        },
        init3() {
            let myChart = this.$echarts.init(this.$refs.Echarts3);
            let option = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} GJ",
                   axisPointer: {
                       type: "none"
                   }
               },
               color: '#E24A4D',
               grid: {
                   left: '3%',
                   right: '7%',
                   bottom: '10%',
                   top: '10%',
                   containLabel: true
               },
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: this.yName3,
                   axisLabel: {
                       color: "#30eee9"
                   },
               },
               yAxis: {
                   type: 'value',
                   axisLabel: {
                       color: "#30eee9",
                       formatter: "{value}",
                       fontSize: "12px"
                   },
                   splitLine: {
                       show: false
                   }
               },
               series: [
                   {
                       name:'历史能耗',
                       type:'line',
                       stack: '总量',
                       symbol:'circle',
                       symbolSize: 8,
                       itemStyle: {
           			        normal: {
           			            areaStyle: {
           							//color: '#94C9EC'
           							color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
           								offset: 0,
           								color: '#162754'
           							}, {
           								offset: 1,
           								color: '#E24A4D'
           							}]),
           			            }
           			        }
       				    },
                       data: this.dataValue3
                   },

               ]
            }
            myChart.setOption(option);
        },
        init4() {
            let myChart4 = this.$echarts.init(this.$refs.Echarts4);
		    let option4 = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} 个 ({d}%)"
                },
                color: ['#37d250', '#9f17ff', '#fe5050'],
                series: [
                    {
                        name: '供电告警',
                        type: 'pie',
                        radius : '80%',
                        center: ['50%', '50%'],
                        data: this.dataValue4,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
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
		    myChart4.setOption(option4);

            let myChart5 = this.$echarts.init(this.$refs.Echarts5);
		    let option5 = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} 个 ({d}%)"
                },
                color: ['#37d250', '#9f17ff', '#fe5050'],
                series: [
                    {
                        name: '供水告警',
                        type: 'pie',
                        radius : '80%',
                        center: ['50%', '50%'],
                        data: this.dataValue5,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
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
		    myChart5.setOption(option5);

            let myChart6 = this.$echarts.init(this.$refs.Echarts6);
		    let option6 = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} 个 ({d}%)"
                },
                color: ['#37d250', '#9f17ff', '#fe5050'],
                series: [
                    {
                        name: '供暖告警',
                        type: 'pie',
                        radius : '80%',
                        center: ['50%', '50%'],
                        data: this.dataValue6,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
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
		    myChart6.setOption(option6);

            let myChart7 = this.$echarts.init(this.$refs.Echarts7);
		    let option7 = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} 个 ({d}%)"
                },
                color: ['#37d250', '#9f17ff', '#fe5050'],
                series: [
                    {
                        name: '供暖告警',
                        type: 'pie',
                        radius : '80%',
                        center: ['50%', '50%'],
                        data: this.dataValue7,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
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
		    myChart7.setOption(option7);
        },
        init5() {
            let myEcharts8 = this.$echarts.init(this.$refs.Echarts8);
            let option8 = {
                legend: {
                    x: 'center',
                    y: '88%',
                    itemWidth: 13,
                    itemHeight: 13,
                    icon: 'circle',
                    textStyle: {
                        color: '#22EAF5',
                    },
                    data: this.yName8
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(res) {
                        console.log(res);
                        return `<b style="display: inline-block; margin-right: 4px; width: 10px; height: 10px; border-radius: 50%; background: ${res.color};"></b><span style="color: ${res.color}">${res.data.name}: ${res.data.value} kW·h ${res.percent}%</span>`
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['45%', '65%'],
                        color: ['#00FFA8', '#9F17FF','#FFE400', '#F76F01', '#01A4F7', "#FE2C8A", "#FEE449", "#00FFFF"],
                        hoverAnimation: false,
                        label: {
                            show: true,
                            normal: {
                                formatter: '{b}:{c}kW·h {d}%',
                                show: false,
                                position: ''
                            },
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: '#fff',
                            },
                            emphasis: {
                                borderWidth: 0,
                                shadowBlur: 2,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: this.dataValue8
                    }
                ]
            }
            myEcharts8.setOption(option8);

            let myEcharts9 = this.$echarts.init(this.$refs.Echarts9);
            let option9 = {
                legend: {
                    x: 'center',
                    y: '88%',
                    itemWidth: 13,
                    itemHeight: 13,
                    icon: 'circle',
                    textStyle: {
                        color: '#22EAF5',
                    },
                    data: this.yName9
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(res) {
                        console.log(res);
                        return `<b style="display: inline-block; margin-right: 4px; width: 10px; height: 10px; border-radius: 50%; background: ${res.color};"></b><span style="color: ${res.color}">${res.data.name}: ${res.data.value} m³ ${res.percent}%</span>`
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['45%', '65%'],
                        color: ['#00FFA8', '#9F17FF','#FFE400', '#F76F01', '#01A4F7', "#FE2C8A", "#FEE449", "#00FFFF"],
                        hoverAnimation: false,
                        label: {
                            show: true,
                            normal: {
                                formatter: '{b}:{c}kW·h {d}%',
                                show: false,
                                position: ''
                            },
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: '#fff',
                            },
                            emphasis: {
                                borderWidth: 0,
                                shadowBlur: 2,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: this.dataValue9
                    }
                ]
            }
            myEcharts9.setOption(option9);

            let myEcharts10 = this.$echarts.init(this.$refs.Echarts10);
            let option10 = {
                legend: {
                    x: 'center',
                    y: '88%',
                    itemWidth: 13,
                    itemHeight: 13,
                    icon: 'circle',
                    textStyle: {
                        color: '#22EAF5',
                    },
                    data: this.yName10
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(res) {
                        console.log(res);
                        return `<b style="display: inline-block; margin-right: 4px; width: 10px; height: 10px; border-radius: 50%; background: ${res.color};"></b><span style="color: ${res.color}">${res.data.name}: ${res.data.value} Gj ${res.percent}%</span>`
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['45%', '65%'],
                        color: ['#00FFA8', '#9F17FF','#FFE400', '#F76F01', '#01A4F7', "#FE2C8A", "#FEE449", "#00FFFF"],
                        hoverAnimation: false,
                        label: {
                            show: true,
                            normal: {
                                formatter: '{b}:{c}kW·h {d}%',
                                show: false,
                                position: ''
                            },
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: '#fff',
                            },
                            emphasis: {
                                borderWidth: 0,
                                shadowBlur: 2,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: this.dataValue10
                    }
                ]
            }
            myEcharts10.setOption(option10);
        },
        init6() {
            let myChart12 = this.$echarts.init(this.$refs.Echarts12);
            let option12 = {
                title: {
                    text: '报修总量',
                    textStyle:{
                        color:'#08A9FE',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.personAll1,
                    subtextStyle:{
                        color:'#08A9FE',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        type:'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person0), itemStyle:{normal:{color:'#08A9FE'},emphasis:{color:'#08A9FE'}}},
                            {value:Number(this.personAll) - Number(this.person0), itemStyle:{normal:{color:'#389af4'},emphasis:{color:'#389af4'}}}
                        ]
                    }
                ]
            };
            myChart12.setOption(option12);

            let myChart13 = this.$echarts.init(this.$refs.Echarts13);
            let option13 = {
                title: {
                    text: '新申请',
                    textStyle:{
                        color:'#FF8C37',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.person1,
                    subtextStyle:{
                        color:'#FF8C37',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        // name:'访问来源',
                        type:'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person1), itemStyle:{normal:{color:'#ffdcc3'},emphasis:{color:'#ffdcc3'}}},
                            {value:Number(this.personAll)-Number(this.person1), itemStyle:{normal:{color:'#ff8c37'},emphasis:{color:'#ff8c37'}}}
                        ]
                    }
                ]
            };
            myChart13.setOption(option13);

            let myChart14 = this.$echarts.init(this.$refs.Echarts14);
            let option14 = {
                title: {
                    text: '已委派',
                    textStyle:{
                        color:'#1AD238',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.person2,
                    subtextStyle:{
                        color:'#1AD238',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        // name:'访问来源',
                        type:'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person2), itemStyle:{normal:{color:'#8df29e'},emphasis:{color:'#8df29e'}}},
                            {value:Number(this.personAll)-Number(this.person2), itemStyle:{normal:{color:'#1ad238'},emphasis:{color:'#1ad238'}}}
                        ]
                    }
                ]
            };
            myChart14.setOption(option14);

            let myChart15 = this.$echarts.init(this.$refs.Echarts15);
            let option15 = {
                title: {
                    text: '维修中',
                    textStyle:{
                        color:'#FA3E3E',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.person3,
                    subtextStyle:{
                        color:'#FA3E3E',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        // name:'访问来源',
                        type:'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person3), itemStyle:{normal:{color:'#fca2a2'},emphasis:{color:'#fca2a2'}}},
                            {value:Number(this.personAll)-Number(this.person3), itemStyle:{normal:{color:'#fa3e3e'},emphasis:{color:'#fa3e3e'}}}
                        ]
                    }
                ]
            };
            myChart15.setOption(option15);
        },
        init7() {
            let myChart16 = this.$echarts.init(this.$refs.Echarts16);
            let option16 = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
                series: [
                    {
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        color: ["#FE5442", "#625EF3"],
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.dataValue16
                    }
                ]
            };
            myChart16.setOption(option16);

            let myChart17 = this.$echarts.init(this.$refs.Echarts17);
		    let option17 = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} 个 ({d}%)"
                },
                color: ['#fc6868', '#37cefa'],
                series: [
                    {
                        name: '设备巡检',
                        type: 'pie',
                        radius : '60%',
                        center: ['50%', '50%'],
                        data: this.dataValue17,
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
		    myChart17.setOption(option17);
        },

        // axios请求数据
        initData() {
            // 获取天气预报
            let that = this;
            $.ajax({
		        type: 'GET',
		        url: 'https://www.tianqiapi.com/api/?version=v1&appid=[55823161]&appsecret=[cdeVG36j]',
		        dataType: 'JSON',
		        error: function () {
		        },
		        success: function (res) {
                    that.humidity = res.data[0].humidity;
                    that.tem = res.data[0].tem;
                    that.wea = res.data[0].air_level;
		        }
            })
            // 供电历史能耗数据
            this.$axios.post('BMPlatServers/electricity/queryconsums').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.AllbuildCousumList && res.data.result.AllbuildCousumList.length) {
                        this.yName1 = [];
                        this.dataValue1 = [];
                        res.data.result.AllbuildCousumList.forEach((item)=>{
                            this.yName1.push(item.time);
                            this.dataValue1.push(item.consum);
                        })
                        this.init1();
                    }else{
                        this.yName2 = [];
                        this.dataValue2 = [];
                        this.init2();
                    }
                }
            })
            // 供水历史能耗数据
            let data2 = {
                flag: 5
            }
            this.$axios.post('BMPlatServers/water/querySchoolHistory', this.$qs.stringify(data2)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result && res.data.result.length) {
                        this.yName2 = [];
                        this.dataValue2 = [];
                        res.data.result.forEach((item)=>{
                            this.yName2.push(item.number);
                            this.dataValue2.push(item.consume);
                        })
                        this.init2();
                    }else{
                        this.yName2 = [];
                        this.dataValue2 = [];
                        this.init2();
                    }
                }
            })
            // 暖通历史能耗
            let data4 = {
                flag: 5,
                systemId: 3,
                subsystemId: 3,
                query: 1
            }
            this.$axios.post("BMPlatServers/hvacheat/queryCityHeatHistory", this.$qs.stringify(data4)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.yName3 = [];
                    this.dataValue3 = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.yName3.push(item.number);
                            this.dataValue3.push(item.consume);
                        })
                        this.init3();
                    }else{
                        this.yName3 = [];
                        this.dataValue3 = [];
                        this.init3();
                    }
                }
            })
            // 运行图数据
            this.$axios.post("BMPlatServers/warn/queryBuildingWarning").then((res)=>{
                console.log(res);
                if(res.data.success) {
                    // res.data.
                }
            })
            // 实时告警
            this.$axios.post('BMPlatServers/warn/queryAllSystemWarning').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataValue4 = [];
                    this.dataValue5 = [];
                    this.dataValue6 = [];
                    this.dataValue7 = [];
                    res.data.result.system2.forEach((item)=>{
                        this.dataValue4.push({name: item.message, value: item.num});
                    })
                    res.data.result.system1.forEach((item)=>{
                        this.dataValue5.push({name: item.message, value: item.num});
                    })
                    res.data.result.system3.forEach((item)=>{
                        this.dataValue6.push({name: item.message, value: item.num});
                    })
                    res.data.result.system4.forEach((item)=>{
                        this.dataValue7.push({name: item.message, value: item.num});
                    })
                    this.init4();
                }
            })
            // 巡检表格数据
            let data3 = {
                pageSize: 10000,
                currentPage: 1
            }
            this.$axios.post('BMPlatServers/device/findexam', this.$qs.stringify(data3)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.resultList == undefined) {
                        this.tableData = [];
                    }else{
                        this.tableData = res.data.result.resultList;
                    }
                    this.tables();
                }else{
                    this.tableData = [];
                    this.tables();
                }
            })

            // 电水暖轮播的楼宇能耗对比
            let date = new Date(new Date().getTime() - 24*60*60*1000);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            // 电
            let data5 = {
                queryFlag: 3,
                year,
                month,
                day
            }
            this.$axios.post("BMPlatServers/electricity/queryenergyspread", this.$qs.stringify(data5)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.yName8 = [];
                    this.dataValue8 = [];
                    if(res.data.result.result && res.data.result.result.length) {
                        res.data.result.result.forEach((item)=>{
                            this.yName8.push(item.name);
                            this.dataValue8.push({name: item.name, value: item.consum});
                        })
                        this.init5();
                    }else{
                        this.yName8 = [];
                        this.dataValue8 = [];
                        this.init5();
                    }
                }else{

                }
            })
            // 水
            let data6 = {
                flag: 3,
                year,
                month,
                day
            }
            this.$axios.post('BMPlatServers/water/querySchoolPie', this.$qs.stringify(data6)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.yName9 = [];
                    this.dataValue9 = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.yName9.push(item.name);
                            this.dataValue9.push({name: item.name, value: item.consume});
                        })
                    }
                    this.init5();
                }else{

                }
            })
            // 暖
            let data7 = {
                systemId: 3,
                subsystemId: 4,
                flag: 3
            }
            this.$axios.post("BMPlatServers/hvacheat/queryBuildingsConsume", this.$qs.stringify(data7)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.yName10 = [];
                    this.dataValue10 = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.yName10.push(item.buildingName);
                            this.dataValue10.push({name: item.buildingName, value: item.consume});
                        })
                        this.init5();
                    }else{
                        this.yName10 = [];
                        this.dataValue10 = [];
                        this.init5();
                    }
                }
            })

            // 报修管理数据
            this.$axios.post('BMPlatServers/repair/queryRepairStatus').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.personAll = item.num;
                            this.person0 = item.num;
                            if(item.status==0) {   // 总报修的人数
                                if(item.num == 0) {
                                    this.personAll = 1;
                                    this.personAll1 = 0;
                                    this.person0 = 0;
                                }else{
                                    this.personAll1 = this.personAll;
                                }
                            }
                            if(item.status==1) {  // 已申请的人数
                                this.person1 = item.num;
                            }
                            if(item.status==2) {  // 已审核的人数
                                this.person2 = item.num;
                            }
                            if(item.status==3) {  // 已派工的人数
                                this.person3 = item.num;
                            }
                        })
                    }else{

                    }
                    this.init6();
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                    this.init6();
                }
            })

            // 设备故障和巡检数据
            this.$axios.post('BMPlatServers/device/findexams').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataValue16 = [];
                    this.dataValue17 = [];
                    this.dataValue16.push({name: "正常", value: res.data.result.listCount[0].zcs});
                    this.dataValue16.push({name: "故障", value: res.data.result.listCount[0].gzs});

                    this.dataValue17.push({name: "未巡检", value: res.data.result.listCount[0].wzxcount});
                    this.dataValue17.push({name: "已巡检", value: res.data.result.listCount[0].yzxcount});
                    this.init7();
                }else{
                    this.dataValue16.push({name: "正常", value: 0});
                    this.dataValue16.push({name: "故障", value: 0});
                    this.dataValue17.push({name: "未巡检", value: 0});
                    this.dataValue17.push({name: "已巡检", value: 0});
                    this.init7();
                }
            })
        },

        // 点击跳转到系统内部页面
        giMain() {
            this.$router.push("/index");
        },
        // 获取系统时间
        initTime() {
            let times = new Date();
            let year = times.getFullYear();
            let month = times.getMonth() + 1;
            let date = times.getDate();

            let hours = times.getHours();
            let minutes = times.getMinutes();
            let seconds = times.getSeconds();

            this.dates = year + "-" + this.formatTime(month) + "-" + this.formatTime(date);
            this.time =  this.formatTime(hours) + ":" +  this.formatTime(minutes) + ":" +  this.formatTime(seconds);
            this.day =  this.weekFormat(times.getDay());
        },
        // 格式化时间
        formatTime(times) {
            if(times < 10) {
                return "0" + times;
            }else{
                return times;
            }
        },
        // 星期转换
        weekFormat(week) {
            switch (week) {
                case 1:
                    return "星期一"
                    break;
                case 2:
                    return "星期二"
                    break;
                case 3:
                    return "星期三"
                    break;
                case 4:
                    return "星期四"
                    break;
                case 5:
                    return "星期五"
                    break;
                case 6:
                    return "星期六"
                    break;
                case 7:
                    return "星期日"
                    break;
            }
        },

        // 轮播table
        tables() {
            var MyMarhq = '';
            clearInterval(MyMarhq);
            $('.tbl-body .ul6').empty();
            $('.tbl-header tbody').empty();
            var str = '';
            var Items = this.tableData;
            $.each(Items,function (i, item) {
                str = '<ol>'+
                    '<el-tooltip content="Bottom center" placement="bottom" effect="light"><li>'+item.code+'</li></el-tooltip>'+
                    '<el-tooltip content="Bottom center" placement="bottom" effect="light"><li>'+item.username+'</li></el-tooltip>'+
                    '<el-tooltip content="Bottom center" placement="bottom" effect="light"><li>'+item.planName+'</li></el-tooltip>'+
                    '<el-tooltip content="Bottom center" placement="bottom" effect="light"><li>'+item.period+'日</li></el-tooltip>'+
                    '<el-tooltip content="Bottom center" placement="bottom" effect="light"><li>'+item.status1+'</li></el-tooltip>'+
                    '</ol>'
                $('.tbl-body .ul6').append(str);
            });
            if(Items.length > 5){
                $('.tbl-body .ul6').html($('.tbl-body .ul6').html()+$('.tbl-body .ul6').html());
                $('.tbl-body').css('top', '0');
                var tblTop = 0;
                var speedhq = 50; // 数值越大越慢
                var outerHeight = $('.tbl-body .ul6').find("ol").outerHeight();
                function Marqueehq(){
                    if(tblTop <= -outerHeight*Items.length){
                        tblTop = 0;
                    } else {
                        tblTop -= 1;
                    }
                    $('.tbl-body').css('top', tblTop+'px');
                }
                MyMarhq = setInterval(Marqueehq,speedhq);
                // 鼠标移上去取消事件
                $(".tbl-header tbl-body").hover(function (){
                    clearInterval(MyMarhq);
                },function (){
                    clearInterval(MyMarhq);
                    MyMarhq = setInterval(Marqueehq,speedhq);
                })
            }
        },
        initDomChange() {
            let Dom = document.querySelector("#pnei");
            setTimeout(()=>{
                Dom.style.color = "#22EAF5";
                Dom.style.borderColor = "#22EAF5";
                this.anotherDom();
            }, 1000)
        },
        anotherDom() {
            let Dom = document.querySelector("#pnei");
            setTimeout(()=>{
                Dom.style.color = "#0D9299";
                Dom.style.borderColor = "#0D9299";
                this.initDomChange();
            }, 1000)
        }
    },
    mounted() {
        setInterval(()=>{
            this.initTime();
        }, 1000);
        this.initData();
        this.initDomChange();
    }
}

</script>

<style lang="scss" scoped>
#outIndex{
    height: 100%;
    .outIndex{
        height: 100%;
        background: url(../../../static/img/bg@2x.png) no-repeat center;
        background-size: 100% 100%;
        .header{
            height: 8%;
            position: relative;
            .header-left{
                background: url(../../../static/img/left@2x.png) no-repeat center;
                background-size: 100% 100%;
                position: absolute;
                left: 0;
                top: 0;
                height:100%;
                width: 35%;
                color: #0D9299;
                .span-left{
                    padding: 16px 0 0 30px;
                    display: block;
                    font-size: 16px;
                }
            }
            .p1{
                text-align: center;
                font-size: 30px;
                font-weight: bold;
                background-image: -webkit-linear-gradient(to bottom, #DFF8FF, #22EAF5, #0D9299, #084488);
                background-image: -moz-linear-gradient(to bottom, #DFF8FF, #22EAF5, #0D9299, #084488);
                background-image: linear-gradient(to bottom, #DFF8FF, #22EAF5, #0D9299, #084488);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                padding-top: 10px;
            }
            .header-right{
                background: url(../../../static/img/right@2x.png) no-repeat center;
                background-size: 100% 100%;
                position: absolute;
                right: 0;
                top: 0;
                height:100%;
                width: 35%;
                .span-right{
                    padding: 16px 30px 0 0px;
                    font-size: 14px;
                    color: #0D9299;
                    text-align: right;
                    .pnei{
                        border: 1px solid #0D9299;
                        -webkit-border-radius: 2px;
                        -moz-border-radius: 2px;
                        border-radius: 2px;
                        display: inline-block;
                        padding: 3px 10px;
                        -webkit-transition: all .8s;
                        -moz-transition: all .8s;
                        transition: all .8s;
                    }
                    .pnei:hover{
                        color: #22EAF5;
                        border: 1px solid #22EAF5;
                        cursor: pointer;
                    }
                }
            }
        }

        .main{
            height: 92%;
            padding: 8px 18px 18px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .main-left{
                float: left;
                width: 20%;
                height: 100%;
                .main-left-top1{
                    height: 16%;
                    background: url(../../../static/img/bg1@2x.png) no-repeat 0 0;
                    background-size: 100% 100%;
                    .top{
                        overflow: hidden;
                        color: #22EAF5;
                        height: 40%;
                        padding-top: 10px;
                        box-sizing: border-box;
                        .span1{
                            display: block;
                            float: left;
                            text-align: center;
                            width: 33.3%;
                        }
                    }
                    .bottom{
                        height: 60%;
                        li{
                            color: #22EAF5;
                            float: left;
                            display: block;
                            width: 33.3%;
                            text-align: center;
                            .b1{
                                display: block;
                                overflow: hidden;
                                padding-left: 30%;
                                .img1{
                                    float: left;
                                    width: 20px;
                                    height: 29px;
                                }
                                .img2{
                                    float: left;
                                    width: 22px;
                                    height: 29px;
                                }
                                .img3{
                                    float: left;
                                    width: 38px;
                                    height: 29px;
                                }
                                h6{
                                    float: left;
                                    margin-left: 8px;
                                    padding-top: 10px;
                                }
                            }
                            .b2{
                                display: block;
                                padding-top: 10px;
                                box-sizing: border-box;
                                font-size: 14px;
                            }
                            .b{
                                color: #F05A5A;
                            }
                            .bb{
                                color: #F59D56;
                            }
                        }
                    }
                }
                .main-left-top2{
                    height: 28%;
                    padding: 20px 0;
                    box-sizing: border-box;
                    .inner-main-left-top2{
                        background: url(../../../static/img/bg1@2x.png) no-repeat 0 0;
                        background-size: 100% 100%;
                        height: 100%;
                        .inner-top{
                            height: 15%;
                            padding: 3px 0 0 10px;
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                            img{
                                width: 30px;
                                height: 30px;
                            }
                            .span3{
                                color: #22EAF5;
                            }
                        }
                        .echarts{
                            height: 85%;
                        }
                    }
                }
                .main-left-top3{
                    height: 28%;
                    padding: 10px 0;
                    box-sizing: border-box;
                    .inner-main-left-top3{
                        background: url(../../../static/img/bg1@2x.png) no-repeat 0 0;
                        background-size: 100% 100%;
                        height: 100%;
                        .inner-top{
                            height: 15%;
                            padding: 3px 0 0 10px;
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                            img{
                                width: 30px;
                                height: 30px;
                            }
                            .span3{
                                color: #22EAF5;
                            }
                        }
                        .echarts{
                            height: 85%;
                        }
                    }
                }
                .main-left-top4{
                    height: 28%;
                    padding: 6px 0 0 0;
                    box-sizing: border-box;
                    .inner-main-left-top4{
                        background: url(../../../static/img/bg1@2x.png) no-repeat 0 0;
                        background-size: 100% 100%;
                        height: 100%;
                        .inner-top{
                            height: 15%;
                            padding: 3px 0 0 10px;
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                            img{
                                width: 30px;
                                height: 30px;
                            }
                            .span3{
                                color: #22EAF5;
                            }
                        }
                        .echarts{
                            height: 85%;
                        }
                    }
                }
            }
            .main-right{
                float: left;
                width: 80%;
                height: 100%;
                padding-left: 20px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .main-right-top{
                    height: 50%;
                    .main-right-top-left{
                        float: left;
                        width: 60%;
                        height: 100%;
                        padding-right: 20px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        .inner-main-right-top-left{
                            height: 100%;
                            background: url(../../../static/img/louyudenbutu.png) no-repeat 0 0;
                            background-size: 100% 100%;
                            position: relative;
                            .inner-main-right-top-left-top{
                                color: #22EAF5;
                                position: absolute;
                                left: 10px;
                                top: 5px;
                                img{
                                    width: 30px;
                                    height: 30px;
                                }
                            }
                            .ol1{
                                color: #22EAF5;
                                font-size: 12px;
                                .li1{
                                    position: absolute;
                                    left: 28%;
                                    top: 17%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                    }
                                    .span6{
                                        width: 16px;
                                        display: block;
                                    }
                                }
                                .li2{
                                    position: absolute;
                                    left: 36%;
                                    top: 27%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                    }
                                    .span6{
                                        display: inline-block;
                                    }
                                }
                                .li3{
                                    position: absolute;
                                    left: 48%;
                                    top: 20%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                    }
                                    .span6{
                                        display: inline-block;
                                    }
                                }
                                .li4{
                                    position: absolute;
                                    left: 57%;
                                    top: 20%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                    }
                                    .span6{
                                        display: inline-block;
                                    }
                                }
                                .li5{
                                    position: absolute;
                                    left: 64%;
                                    top: 19%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                        position: relative;
                                        top: -16px;
                                        left: 0;
                                    }
                                    .span6{
                                        width: 26px;
                                        display: inline-block;
                                    }
                                }
                                .li6{
                                    position: absolute;
                                    left: 70%;
                                    top: 25%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                        position: relative;
                                        top: -16px;
                                        left: 0;
                                    }
                                    .span6{
                                        width: 26px;
                                        display: inline-block;
                                    }
                                }
                                .li7{
                                    position: absolute;
                                    left: 50%;
                                    top: 32%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: block;
                                    }
                                    .span6{
                                        width: 14px;
                                        display: block;
                                    }
                                }
                                .li8{
                                    position: absolute;
                                    left: 31%;
                                    top: 62%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: block;
                                    }
                                    .span6{
                                        width: 14px;
                                        display: block;
                                    }
                                }
                                .li9{
                                    position: absolute;
                                    left: 40%;
                                    top: 60%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                    }
                                    .span6{
                                        display: inline-block;
                                    }
                                }
                                .li10{
                                    position: absolute;
                                    left: 53%;
                                    top: 60%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                    }
                                    .span6{
                                        display: inline-block;
                                    }
                                }
                                .li11{
                                    position: absolute;
                                    left: 38%;
                                    top: 78%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                    }
                                    .span6{
                                        display: inline-block;
                                    }
                                }
                                .li12{
                                    position: absolute;
                                    left: 65%;
                                    top: 78%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                    }
                                    .span6{
                                        display: inline-block;
                                    }
                                }
                                .li13{
                                    position: absolute;
                                    left: 82%;
                                    top: 78%;
                                    img{
                                        width: 15px;
                                        height: 15px;
                                        display: inline-block;
                                    }
                                    .span6{
                                        display: inline-block;
                                    }
                                }
                            }
                        }
                    }
                    .main-right-top-right{
                        float: left;
                        width: 40%;
                        height: 100%;
                        .real{
                            height: 50%;
                            background: url(../../../static/img/bg3@2x.png) no-repeat 0 0;
                            background-size: 100% 100%;
                            padding: 8px 10px;
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                            .real-top{
                                height: 15%;
                                img{
                                    width: 30px;
                                    height: 30px;
                                }
                                .span4{
                                    color: #22eaf5;
                                }
                            }
                            .real-bottom{
                                height: 85%;
                                .li{
                                    float: left;
                                    display: block;
                                    width: 25%;
                                    height: 100%;
                                    text-align: center;
                                    color: #22EAF5;
                                    .echarts{
                                        height: 90%;
                                    }
                                }
                            }
                        }

                        .inspection{
                            height: 50%;
                            padding-top: 20px;
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                            .inner-inspection{
                                height: 100%;
                                background: url(../../../static/img/bg3@2x.png) no-repeat 0 0;
                                background-size: 100% 100%;
                                padding: 8px 10px;
                                -webkit-box-sizing: border-box;
                                -moz-box-sizing: border-box;
                                box-sizing: border-box;
                                .tbl-header {
                                    height: 20%;
                                    width: 100%;
                                    .ul6{
                                        overflow: hidden;
                                        color: #22EAF5;
                                        font-weight: bold;
                                        li{
                                            float: left;
                                            width: 20%;
                                            text-align: center;
                                            min-width: 85px;
                                            overflow: hidden;
                                            text-overflow:ellipsis;
                                            white-space: nowrap;
                                        }
                                    }
                                }
                                .placetbl-body{
                                    height: 80%;
                                    overflow: hidden;
                                    font-size: 12px;
                                    .tbl-body {
                                        position: relative;
                                        width: 100%;
                                        /deep/ ul{
                                            color: #22EAF5 !important;
                                            /deep/ ol{
                                                overflow: hidden !important;
                                                line-height: 28px !important;
                                                /deep/ li{
                                                    float: left !important;
                                                    width: 20% !important;
                                                    text-align: center !important;
                                                    overflow: hidden !important;
                                                    text-overflow:ellipsis !important;
                                                    white-space: nowrap !important;
                                                }
                                            }
                                        }
                                    }
                                }
                                table {
                                    width: 100%;
                                }
                                table th,
                                table /deep/ td {
                                    font-size: 12px;
                                    color: #22EAF5 !important;
                                    line-height: 25px;
                                    text-align: center;
                                }
                                table tr th {
                                    cursor: pointer;
                                }
                                table tr td {

                                }
                                .tbl-body tr:nth-child(even) td,.tbl-body1 tr:nth-child(even) td {

                                }
                                table tr td span,
                                table tr td span {
                                    font-size: 12px;
                                }
                            }
                        }
                    }
                }
                .main-right-bottom{
                    height: 50%;
                    padding-top: 20px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    .main-right-bottom-left{
                        float: left;
                        width: 40%;
                        height: 100%;
                        position: relative;
                        background: url(../../../static/img/bg3@2x.png) no-repeat 0 0;
                        background-size: 100% 100%;
                        padding: 5px 0 0 10px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        .el-carousel{
                            height: 100%;
                            /deep/ .el-carousel__container{
                                height: 100% !important;
                            }
                            .el-carousel-top{
                                color: #22EAF5;
                                height: 10%;
                                img{
                                    width: 30px;
                                    height: 30px;
                                }
                            }
                            .echarts{
                                height: 90%;
                            }
                        }
                    }
                    .main-right-bottom-right{
                        width: 60%;
                        float: left;
                        height: 100%;
                        padding-left: 20px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        .inner-main-right-bottom-right{
                            background: url(../../../static/img/bg6@2x.png) no-repeat 0 0;
                            background-size: 100% 100%;
                            height: 100%;
                            .x-top{
                                height: 50%;
                                border-bottom: 1px solid #0F6592;
                                -webkit-box-sizing: border-box;
                                -moz-box-sizing: border-box;
                                box-sizing: border-box;
                                .x-top-header{
                                    color: #22EAF5;
                                    padding: 5px 0 0 10px;
                                    height: 10%;
                                    -webkit-box-sizing: border-box;
                                    -moz-box-sizing: border-box;
                                    box-sizing: border-box;
                                    img{
                                        width: 30px;
                                        height: 30px;
                                    }
                                }
                                .placeEcharts{
                                    height: 90%;
                                    .echarts{
                                        height: 100%;
                                        width: 25%;
                                        float: left;
                                    }
                                }
                            }
                            .x-middle{
                                height: 50%;
                                border-top: 1px solid #0AA6C0;
                                -webkit-box-sizing: border-box;
                                -moz-box-sizing: border-box;
                                box-sizing: border-box;
                                padding-top: 5px;
                                .Left{
                                    float: left;
                                    width: 50%;
                                    height: 100%;
                                    padding-left: 10px;
                                    -webkit-box-sizing: border-box;
                                    -moz-box-sizing: border-box;
                                    box-sizing: border-box;
                                    .left-x-top-header{
                                        color: #22EAF5;
                                        height: 15%;
                                        img{
                                            width: 30px;
                                            height: 30px;
                                        }
                                    }
                                    .echarts{
                                        height: 85%;
                                    }
                                }
                                .Right{
                                    float: left;
                                    width: 50%;
                                    height: 100%;
                                    padding-left: 10px;
                                    border-left: 2px solid #0D779B;
                                    -webkit-box-sizing: border-box;
                                    -moz-box-sizing: border-box;
                                    box-sizing: border-box;
                                    .Right-x-top-header{
                                        color: #22EAF5;
                                        height: 15%;
                                        img{
                                            width: 30px;
                                            height: 30px;
                                        }
                                    }
                                    .echarts{
                                        height: 85%;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
