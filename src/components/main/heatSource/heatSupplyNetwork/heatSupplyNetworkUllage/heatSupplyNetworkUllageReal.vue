<template>
    <div id="heatSupplyNetworkUllageReal">
        <div class="heatSupplyNetworkUllageReal">
            <div class="placeTag">
                <ul>
                    <li v-for="(item, index) in tagList" @click="activeName(index)" :class="INDEX==index?'active':''">{{item.name}}</li>
                </ul>
            </div>

            <div class="placeSearch">
                <span>分区</span>
                <el-select v-model="area" placeholder="请选择">
                    <el-option v-for="item in arrList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" size="small" icon="el-icon-search" @click="search" class="btn">搜索</el-button>
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
            area: '',
            arrList: [],
            tagList: [{name: '漏损量'}, {name: '漏损率'}],
            INDEX: 0,
            yearSum: [],
            yearSum1: [],
            yearSum2: [],
            yeartext: '当年供暖季累计漏损量',
            monthtext: '当月供暖季累计漏损量',
            daytext: '当日供暖季累计漏损量',
            areaId: '',
            loading: true,
            monad: 'GJ'
        }
    },
    methods:{
        init() {
            let myChart01 = this.$echarts.init(this.$refs.Echarts01);
            let option01 = {
                title: {
                   left: 'center',
                   text: this.yeartext,
                },
                tooltip : {      // 鼠标滑过的显示值得处理
                    formatter: `当年累计漏损值：${this.yearSum[0].value} ${this.monad}`
                },
                series: [
                    {
                        name: this.name,
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
                            formatter: '{value}' + this.monad,
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
                    formatter: `当月累计漏损值：${this.yearSum1[0].value} ${this.monad}`
                },
                series: [
                    {
                        name: this.name,
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
                            formatter: '{value}' + this.monad,
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
                    formatter: `当日累计漏损值：${this.yearSum2[0].value} ${this.monad}`
                },
                series: [
                    {
                        name: this.name,
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
                            formatter: '{value}' + this.monad,
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

        // 列表查询
        List() {
            this.$axios.post('BMPlatServers/common/queryHeatGridTree').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.arrList = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.arrList.push({label: item.name, value: item.id});
                        })
                        this.area = res.data.result[0].id;
                        this.initData();
                    }
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        search() {
            this.loading = true;
            this.initData();
        },

        // 漏损量，漏损率数据
        initData() {
            let data = {
                areaId: this.area
            };
            this.$axios.post('BMPlatServers/hvacheat/queryHeatGridLeakNow', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.yearSum = [];
                    this.yearSum1 = [];
                    this.yearSum2 = [];
                    if(typeof(res.data.result.yearmap.diff) != 'undefined' && typeof(res.data.result.monthmap.diff) != 'undefined' && typeof(res.data.result.daymap.diff) != 'undefined') {
                        if(this.INDEX == 0) {
                            this.yearSum.push({value: res.data.result.yearmap.diff});
                            this.yearSum1.push({value: res.data.result.monthmap.diff});
                            this.yearSum2.push({value: res.data.result.daymap.diff});
                            this.loading = false;
                            this.init();
                        }else if(this.INDEX == 1) {
                            this.yearSum.push({value: res.data.result.yearmap.percent});
                            this.yearSum1.push({value: res.data.result.monthmap.percent});
                            this.yearSum2.push({value: res.data.result.daymap.percent});
                            this.loading = false;
                            this.init();
                        };
                    }
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                    this.loading = false;
                }
            })
        },

        activeName(i) {
            this.loading = true;
            this.INDEX = i;
            if(i == 0) {
                this.yeartext = '当年供暖季累计漏损量';
                this.monthtext = '当月供暖季累计漏损量';
                this.daytext = '当日供暖季累计漏损量';
                this.monad = "GJ";
            }else if(i == 1) {
                this.yeartext = '当年供暖季累计漏损率';
                this.monthtext = '当月供暖季累计漏损率';
                this.daytext = '当日供暖季累计漏损率';
                this.monad = "%";
            }
            this.initData();
        }
    },
    mounted() {
        this.List();
    },
}
</script>

<style lang="scss" scoped>
#heatSupplyNetworkUllageReal{
    .heatSupplyNetworkUllageReal{
        .placeTag{
            ul{
                overflow: hidden;
                padding-bottom: 20px;
                padding-top: 10px;
                li{
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
        }
        .placeSearch{
            padding-left: 8px;
            .btn{
                margin-left: 15px;
            }
        }
        .placeEcharts{
            overflow: hidden;
            padding-top: 30px;
            .echarts{
                width: 33%;
                height: 300px;
                float: left;
            }
        }
    }
}
</style>
