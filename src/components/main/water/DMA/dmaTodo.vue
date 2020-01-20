<template>
    <div id="dmaTodo">
        <div class="dmaTodo">
            <span>选择时间</span>
            <el-date-picker v-model="TimeChange" value-format="yyyy-MM-dd HH" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <span class="DMAarea">分区名称</span>
            <el-select v-model="dmaName" placeholder="请选择" filterable>
                <el-option v-for="item in DMAName" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" size="small" icon="el-icon-search" class="btn" @click="search">搜索</el-button>
        </div>
        <div class="dmaEcharts" v-loading="loading">
            <div class="dmaLeft">
                <div class="echarts echarts2" ref="Echarts1"></div>
            </div>
            <div class="dmaRight">
                <div class="echarts" ref="Echarts2"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            dmaName: '',
            DMAName: [],
            TimeChange: [],
            startTime: '',
            endTime: '',
            loading: true,
            DMAname: '',
            outbranchsName: '',
            outbranchsValue: [],
            links: [],
            DMAData: []
        }
    },
    methods: {
        //分区列表
        initDMA() {
            this.$axios.post(`BMPlatServers/water/queryWaterArea`).then((res)=>{
                   console.log(res);
                if(res.data.success) {
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.DMAName.push({label: item.areaComment, value: item.id});
                        })
                        this.dmaName = res.data.result[0].id;
                        this.DMAdata();
                    }else{
                        this.DMAName = [];
                        this.loading = false;
                    }
                }else{
                	this.loading = false;
                }
            })
        },

        //  DMA节点流向数据查询
        DMAdata() {
            let data = {
                areaId: this.dmaName,
                startTime: this.startTime,
                endTime: this.endTime
            };
            this.$axios.post(`BMPlatServers/water/queryAreaBranch`, this.$qs.stringify(data)).then((res)=>{
                let Dom = document.querySelector(".echarts2");
                if(res.data.success) {
                    this.outbranchsName = [];
                    this.links = [];
                    this.DMAData = [];
                    this.outbranchsValue = [];
                    let n = 0;
                    if(res.data.result.outbranchs && res.data.result.outbranchs.length) {
                        res.data.result.outbranchs.forEach((item)=>{
                            // 处理饼图的数据
                            this.outbranchsName.push(item.deviceName);
                            this.outbranchsValue.push({value: item.consume , name: item.deviceName});

                            // 出口处理球线数据
                            this.links.push({target: item.deviceName, source: item.areaComment});
                            this.DMAData.push({name: item.deviceName, symbolSize: 80, x: 500, y: 250 + n, value: item.consume});
                            n += 60;
                        });
                    }

                    let m = 0;
                    if(res.data.result.inbranchs && res.data.result.inbranchs.length) {
                        this.DMAname = res.data.result.inbranchs[0].areaComment;
                        res.data.result.inbranchs.forEach((item)=>{
                            // 进口处理球线数据
                            this.links.push({source: item.name, target: item.areaComment});
                            this.DMAData.push({name: item.name, symbolSize: 80, x: 300, y: 250 + m, value: item.consume});
                            m += 60;
                        });
                    }
                    let max = n >= m ? n : m;
                    if(max == 60) {
                        Dom.style.height = "500px";
                    }else{
                        Dom.style.height = max * 2.5 + "px";
                    }

                    // 左面的求线图
                    this.DMAData.push({name: this.DMAname, symbolSize: 120, x: 400, y: 300});

                    // 右边的饼图
                    this.outbranchsName.push('漏损量');
                    if(res.data.result.leak == null) {
                        this.outbranchsValue.push({value: '0' , name: '漏损量'});
                    }else{
                        this.outbranchsValue.push({value: res.data.result.leak.diff , name: '漏损量'});
                    }
                    this.init();
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        search() {
            if(this.TimeChange == null) {
                this.$notify.warning({
                    titlt: '警告',
                    message: '请选择查询时间',
                    duration: 3000
                })
                return false;
            }
            this.loading = true;
            this.DMAdata();
        },

        init() {
            let myChart1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} m³"
                },
                grid:{
                    left:'8%',
                    right:'0',
                    bottom:'1%',
                    top: '2%',
                    containLabel:true
                },
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series : [
                    {
                        type: 'graph',
                        layout: 'none',
                        symbolSize: 50,
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [4, 10],
                        edgeLabel: {
                            normal: {
                                textStyle: {
                                    fontSize: 20
                                }
                            }
                        },

                        data: this.DMAData,
                        links: this.links,
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 2,
                                curveness: -0.2
                            }
                        }
                    }
                ]
            };
            myChart1.setOption(option1);
            myChart1.resize();

            let myChart2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title : {
                    text: '',
                    subtext: '',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                color: ['#FCC667', '#BC8DEE','#F66F6F', '#2DA8E8', '#B5B5B5'],
                legend: {
                    orient: 'vertical',
                    left: '20px',
                    data: this.outbranchsName
                },
                series : [
                    {
                        name: '出口占比',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        // data:[{value:335, name:'漏损量'}, {value:310, name:'出口1'}, {value:234, name:'出口2'}, {value:135, name:'出口3'}],
                        data:this.outbranchsValue,
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
            myChart2.setOption(option2);
        }
    },
    mounted() {
        let date = new Date();
        let endYear = date.getFullYear();
        let endMonth = date.getMonth() + 1;
        let endDay = date.getDate();
        let endHours = date.getHours();
        let endMinutes = date.getMinutes();
        let endSeconds = date.getSeconds();

        let startdate = new Date(new Date().getTime() - 3*24*60*60*1000);
        let startYear = startdate.getFullYear();
        let startMonth = startdate.getMonth() + 1;
        let startDay = startdate.getDate();
        let startHours = startdate.getHours();
        let startMinutes = startdate.getMinutes();
        let startSeconds = startdate.getSeconds();
        this.startTime = `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}:${startSeconds}`;
        this.endTime = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}`;
        this.TimeChange = [];
        this.TimeChange.push(this.startTime);
        this.TimeChange.push(this.endTime);

        let faDom = document.querySelector(".dmaLeft");
        let screenDomHeight = document.body.clientHeight || document.documentElement.clientHeight;
        screenDomHeight = screenDomHeight - 70;
        faDom.style.height = screenDomHeight - 180 + "px";

        this.initDMA();
    },
    watch: {
        TimeChange(olds) {
            if(olds == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = olds[0];
                this.endTime = olds[1];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#dmaTodo{
    height: 100%;
    .dmaTodo{
        span{
            color: #666;
        }
        .DMAarea{
            margin: 0 0 0 20px;
        }
        .btn{
            margin-left: 20px;
        }
    }
    .dmaEcharts{
        overflow: hidden;
        padding-top: 15px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        height: 100%;
        .dmaLeft{
            width: 50%;
            float: left;
            border-right: 1px solid #ddd;
            overflow: auto;
            height: 500px;
            .echarts2{
                height: 500px;
            }
        }
        .dmaRight{
            width: 49%;
            float: left;
            .echarts{
                height: 500px;
            }
        }
    }
}
</style>
