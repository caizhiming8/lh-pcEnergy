<template>
    <div id="totalSubsystemPowerReal">
        <div class="totalSubsystemPowerReal">
            <div class="totalSubsystemPowerReal-main" v-loading="loading">
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
            subsystemList: [],
            subsystem: '',
            loading: true,
			building: '',
			buildingList:[],
			id:'',
			datalist1: [],
			datalist2: [],
			datalist3:[],
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
                        max: this.datalist1[0].value==0?100:parseInt((Math.random()+1)*this.datalist1[0].value),
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
                        data: this.datalist1,
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
                        max: this.datalist2[0].value==0?100:parseInt((Math.random()+1)*this.datalist2[0].value),
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
                        data: this.datalist2
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
                        max:this.datalist3[0].value==0?100:parseInt((Math.random()+1)*this.datalist3[0].value),
                        splitNumber:4,
                        detail: {
                            formatter: '{value} kW·h',
                            textStyle: {
                                fontSize: 15,
                                fontWeight: 700
                            }
                        },
                        data: this.datalist3,
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

		/* 初始化查询年月日 */
		initData(){
			let param = {
				id:this.subsystem,
			}
			this.$axios.post(`BMPlatServers/electricity/querysubrealcons`,this.$qs.stringify(param)).then((res)=>{
			    if(res.data.success) {
                    this.datalist1 = [];
                    this.datalist2 = [];
    				this.datalist3 = [];
			        this.datalist1.push({value:res.data.result.realTimeConSum.YearCon == undefined ? 0 : res.data.result.realTimeConSum.YearCon})
				    this.datalist2.push({value:res.data.result.realTimeConSum.MonthCon == undefined ? 0 : res.data.result.realTimeConSum.MonthCon})
				    this.datalist3.push({value:res.data.result.realTimeConSum.DayCon == undefined ? 0 : res.data.result.realTimeConSum.DayCon})
				    this.init()
                    this.loading = false;
			    }else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.loading = false;
			    }
			});
		},
    },

    mounted() {
        this.subsystem = window.location.href.split('=')[1];
		this.initData();
    },
    watch: {
        $route(to, from) {
            this.subsystem = to.fullPath.split('=')[1];
            this.loading = true;
            this.initData();
        }
    }
}
</script>

<style lang="scss" scoped>
#totalSubsystemPowerReal{
    .totalSubsystemPowerReal{
        .placeSearch{
            .btn{
                margin-left: 20px;
            }
        }
        .totalSubsystemPowerReal-main{
            overflow: hidden;
            padding-top: 20px;
            .echarts{
                width: 33%;
                height: 300px;
                float: left;
            }
        }
    }
}
</style>
