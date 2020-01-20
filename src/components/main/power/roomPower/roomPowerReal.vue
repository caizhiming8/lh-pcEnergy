<template>
    <div id="roomPowerReal">
        <div class="roomPowerReal">
            <div class="real-right" v-loading="loading">
                <!-- <span class="span"><img style="width:20px;height:20px" src="../../../../../static/img/biao.png">&nbsp;&nbsp;实时抄表值:{{numbers}}</span> -->
                <div class="real-right-top">
                    <div class="echarts" ref="Echarts01"></div>
                    <div class="echarts" ref="Echarts02"></div>
                    <div class="echarts" ref="Echarts03"></div>
                </div>
                <div class="real-right-bottom">
					<!-- <span class="span"><img style="width:20px;height:20px" src="../../../../../static/img/biao.png">&nbsp;&nbsp;实时电表数据</span> -->
					<el-table tooltip-effect="light" :data="tableData" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
						<el-table-column :show-overflow-tooltip="true" prop="ammeter_name" label="名称" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="consum" label="实时电表值" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="current" label="电流" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="voltage" label="电压" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="po_power" label="功率" align='center'></el-table-column>
					</el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import session from '../../../../../static/js/session.js';
export default {
    props: ["giveData"],
    data() {
        return{
            buildingId: '',
            floorId: '',
            id: '',
            cruYearConumList: [],
            monthDataList: [],
            dayDataList: [],
            numbers: 0,
            dianliu: [],
            dianya: [],
            gonglv: [],
            loading: true,
			tableData: []
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
                        max:this.cruYearConumList[0].value==0?100:parseInt((Math.random()+1)*this.cruYearConumList[0].value),
                        detail: {
                            formatter:'{value} kW·h',
                            textStyle: {
                                fontSize: 14,
                                fontWeight: '700'
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
                        data: this.cruYearConumList,
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
                        max:this.monthDataList[0].value==0?100:parseInt((Math.random()+1)*this.monthDataList[0].value),
                        splitNumber:4,
                        detail: {
                            formatter:'{value} kW·h',
                            textStyle: {
                                fontSize: 14,
                                fontWeight: '700'
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
                        data: this.monthDataList
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
                         max:this.dayDataList[0].value==0?100:parseInt((Math.random()+1)*this.dayDataList[0].value),
                        splitNumber:4,
                        detail: {
                            formatter:'{value} kW·h',
                            textStyle: {
                                fontSize: 14,
                                fontWeight: '700'
                            }
                        },
                        data: this.dayDataList,
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
                floor_id: this.floorId,
                room_id: this.id
            };
            this.$axios.post(`BMPlatServers/electricity/querydevicecontr`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    // 当年，当月，当日
                    this.cruYearConumList = [];
                    this.monthDataList = [];
                    this.dayDataList = [];
                    this.cruYearConumList.push({value: res.data.result.realTimeConSum.cruYearConum});
                    this.monthDataList.push({value: res.data.result.realTimeConSum.cruMonthConum});
                    this.dayDataList.push({value: res.data.result.realTimeConSum.cruDayConum});

                    // 实时抄表值
                    this.numbers = res.data.result.RoomInfo[0].consum;

                    // 电流，电压，功率
                    /* this.dianliu = [];
                    this.dianya = [];
                    this.gonglv = [];
                    if(JSON.stringify(res.data.result.RoomInfo.current) != '{}') {
                        this.dianliu.push({value: res.data.result.RoomInfo.current});
                        this.dianya.push({value: res.data.result.RoomInfo.voltage});
                        this.gonglv.push({value: res.data.result.RoomInfo.po_power});
                    }else{
                        this.dianliu.push({value: 0});
                        this.dianya.push({value: 0});
                        this.gonglv.push({value: 0});
                    } */
					this.tableData = [];
					this.tableData = res.data.result.RoomInfo;
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
        this.buildingId = window.location.href.split('=')[1];
        if(session.get('dataString')) {
            this.floorId = session.get('dataString').floorId;
            this.id = session.get('dataString').roomId;
        }
        this.initData();
    },
    watch: {
        $route(item) {
            this.buildingId = item.fullPath.split('=')[1]
        },
        giveData(item) {
            if(typeof(item.chidren) == 'undefined') {
                session.set('dataString', item);
                this.floorId = item.floorId;
                this.id = item.roomId;
                this.loading = true;
                this.initData();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#roomPowerReal{
    .roomPowerReal{
        .real-right{
            width: 100%;
            height: 650px;
            .span{
                display: block;
                text-align: left;
                padding: 15px;
                padding-top: 0;
                border-bottom: 1px solid #ddd;
            }
            .real-right-top{
                overflow: hidden;
                padding-top: 20px;
                border-bottom: 1px solid #ddd;
                .echarts{
                    width: 32%;
                    height: 300px;
                    float: left;
                }
            }
            .real-right-bottom{
                overflow: hidden;
				.span{
				    display: block;
				    text-align: left;
				    padding: 15px;
				    border-bottom: 1px solid #ddd;
				}
                /* .echarts{
                    width: 32%;
                    height: 300px;
                    float: left;
                } */
            }
        }
        .real-right::-webkit-scrollbar {
            width: 1px;
        }
    }
}
</style>
