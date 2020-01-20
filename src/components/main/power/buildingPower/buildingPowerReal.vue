<template>
    <div id="buildingPowerReal">
        <div class="buildingPowerReal-echarts">
            <div class="imgInfo" v-loading="loading1">
                <img :src="imgUrl" class="img">
                <p>{{imgInfo}}</p>
            </div>
            <div class="echarts" ref="Echarts" v-loading="loading"></div>
        </div>

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
            buildingId: '',
            loading: true,
            imgUrl: '',
            imgInfo: '',
            yearSum: [],
            monthSum: [],
            daySum: [],
            dataList: [],
            dataName: [],
            loading1: true
        }
    },
    methods: {
        init() {
            let myEcharts = this.$echarts.init(this.$refs.Echarts);
            let option = {
                title : {
                   text: '当月四类分项用电',
                   x:'center'
               },
               tooltip : {
                   trigger: 'item',
                   formatter: "{a} <br/>{b} : {c} kW·h ({d}%)"
               },
               color: ['#FCC667', '#BC8DEE','#F66F6F', '#2DA8E8'],
               legend: {
                   orient: 'vertical',
                   left: '8%',
                   data: this.dataName
               },
               series : [
                   {
                       name: '四类分项用电',
                       type: 'pie',
                       radius : '70%',
                       center: ['50%', '50%'],
                       data: this.dataList,
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
                        max: this.yearSum[0].value==0?100:Math.round((Math.random()+1)*this.yearSum[0].value),
                        data: this.yearSum,
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
                        }
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
                        max: this.monthSum[0].value==0?100:Math.round((Math.random()+1)*this.monthSum[0].value),
                        // max: 100,
                        data: this.monthSum,
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
                        }
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
                        max:this.daySum[0].value==0?100:Math.round((Math.random()+1)*this.daySum[0].value),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} kW·h',
                            textStyle: {
                                fontSize: 15,
                                fontWeight: 700
                            }
                        },
                        data: this.daySum,
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

        // 初始化数据
        initData() {
            let data = {
                building_id: this.buildingId
            };
            this.$axios.post(`BMPlatServers/electricity/querybuildrealenereffi`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    // 楼宇简介与图片
                    this.imgUrl = res.data.result.buildInfo.imgUrl;
                    // console.log(this.imgUrl)
					this.imgInfo = res.data.result.buildInfo.intro;
                    // 四类分项用电
                    this.dataList = [];
                    this.dataName = [];
					if(res.data.result.totoClassConsList&&res.data.result.totoClassConsList.length){
						res.data.result.totoClassConsList.forEach((item)=>{
						    this.dataList.push({name: item.name, value: item.classConsum});
						    this.dataName.push(item.name);
						});
					}else{
						this.dataList = [{name:"照明插座用电",value:0},{name:"空调用电",value:0},{name:"动力用电",value:0},{name:"特殊用电",value:0}];
						this.dataName = ["照明插座用电","空调用电","动力用电","特殊用电"];
					}
                    //表盘当年 当月当日累计用电量
                    this.yearSum = [];
                    this.monthSum = [];
                    this.daySum = [];
                    this.yearSum.push({value: res.data.result.realTimeConSum.YearCon});
                    this.monthSum.push({value: res.data.result.realTimeConSum.MonthCon});
                    this.daySum.push({value: res.data.result.realTimeConSum.DayCon});

                    this.init();
                    this.loading = false;
                    this.loading1 = false;
                }else{
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
        this.buildingId = window.location.href.split('=')[1];
        this.initData();
    },
    watch: {
        $route(to,from) {
            this.buildingId = to.fullPath.split('=')[1];
            this.loading = true;
            this.loading1 = true;
            this.imgUrl = '';
            this.initData();
        }
    }
}
</script>

<style lang="scss" scoped>
#buildingPowerReal{
    .btn{
        margin-left: 20px;
    }
    .buildingPowerReal-echarts{
        display: flex;
        padding-top: 20px;
        .imgInfo{
            width: 38%;
            padding-left: 20px;
            .img{
                display: block;
                width: 100%;
                height: 320px;
                margin: 0 auto;
            }
            p{
                font-size: 12px;
                color: #666;
                margin-top: 13px;
                text-indent: 2em;
            }
        }
        .echarts{
            width: 60%;
            height: 300px;
            margin-left: 180px;
        }
    }
    .placeEcharts{
        overflow: hidden;
        margin-top: 30px;
        .echarts-left{
            width: 33%;
            height: 300px;
            float: left;
        }
        .echarts-center{
            width: 33%;
            height: 300px;
            float: left;
        }
        .echarts-right{
            width: 33%;
            height: 300px;
            float: left;
        }
    }
}
</style>
