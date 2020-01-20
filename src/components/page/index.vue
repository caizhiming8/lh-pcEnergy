<template>
    <div id="index">
        <div class="index" ref="index">
            <ul class="index-header">
                <li>
                    <div class="inner" v-loading="loading1">
                        <span>供水系统实时告警</span>
                        <div class="echarts" ref="Echarts1"></div>
                    </div>
                </li>
                <li>
                    <div class="inner" v-loading="loading2">
                        <span>供电系统实时告警</span>
                        <div class="echarts" ref="Echarts2"></div>
                    </div>
                </li>
                <li>
                    <div class="inner" v-loading="loading3">
                        <span>集中供暖实时告警</span>
                        <div class="echarts" ref="Echarts3"></div>
                    </div>
                </li>
                <li>
                    <div class="inner" v-loading="loading4">
                        <span>中央空调实时告警</span>
                        <div class="echarts" ref="Echarts4"></div>
                    </div>
                </li>
            </ul>

            <div class="map">
                <div class="map-left">
                    <div class="innerMapLeft">
                        <span class="span1">集中供暖总运行图</span>
                        <div id="system_index_map" class="system_index_map"></div>
                    </div>
                </div>
                <div class="map-right">
                    <div class="innerMapRight">
                        <div class="mapRight-top" v-loading="loading5">
                            <span class="span2">供水系统历史能耗</span>
                            <div class="noDataEcharts" v-if="!isShowEcharts1">暂无数据</div>
                            <div class="echarts" v-if="isShowEcharts1">
                                <div class="echartsInner" ref="Echarts5"></div>
                            </div>
                        </div>
                        <div class="mapRight-bottom">
                            <div class="bottomInner" v-loading="loading6">
                                <span class="span3">供电系统总能耗</span>
                                <div class="noDataEcharts" v-if="!isShowEcharts2">暂无数据</div>
                                <div class="echarts" v-if="isShowEcharts2">
                                    <div class="echartsInner" ref="Echarts6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bott">
                <div class="bott-left">
                    <div class="inner" v-loading="loading7">
                        <span class="span5">报修管理</span>
                        <div class="repair">
                            <div class="echarts" ref="Echarts7"></div>
                            <div class="echarts" ref="Echarts8"></div>
                            <div class="echarts" ref="Echarts9"></div>
                            <div class="echarts" ref="Echarts10"></div>
                        </div>
                    </div>
                </div>
                <div class="bott-center">
                    <div class="inner" v-loading="loading8">
                        <span class="span6">设备故障</span>
                        <div class="echarts" ref="Echarts11"></div>
                    </div>
                </div>
                <div class="bott-right">
                    <div class="inner" v-loading="loading9">
                        <span class="span7">设备巡检</span>
                        <div class="echarts" ref="Echarts12"></div>
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
            allnum1: 0,
            starrm1: [],
            starr1: [],
            allnum2: 0,
            starrm2: [],
            starr2: [],
            allnum3: 0,
            starrm3: [],
            starr3: [],
            allnum4: 0,
            starrm4: [],
            starr4: [],

            monthlist: [],
            water: [],
            num: [],
            valueList: [],
            personAll1: 0,
            personAll2: 0,
            personAll3: 0,
            person0: 0,
            person1: 0,
            person2: 0,
            person3: 0,
            nameListData1: [],
            nameListData2: [],

            mapLoading: false,
            mapObject: null,
            infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}),
            isShowEcharts1: true,
            isShowEcharts2: true,
            loading1: true,
            loading2: true,
            loading3: true,
            loading4: true,
            loading5: true,
            loading6: true,
            loading7: true,
            loading8: true,
            loading9: true
        }
    },
    methods:{
        init1() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '告警数',
                    subtext: this.allnum1,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: '12px',
                        fontWeight: '700'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} 条 ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: '0px',
                    data:this.starrm1
                },
                color: ['#FF908F', '#8693F3', '#08A9FE'],
                series: [
                    {
                        name:'告警类型',
                        type:'pie',
                        radius: ['60%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.starr1
                    }
                ]
            };
            myEcharts1.setOption(option1);

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                    text: '告警数',
                    subtext: this.allnum2,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: '12px',
                        fontWeight: '700'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}条 ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '0px',
                    data:this.starrm2
                },
                color: ['#FF908F', '#8693F3', '#08A9FE'],
                series: [
                    {
                        name:'告警类型',
                        type:'pie',
                        radius: ['60%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.starr2
                    }
                ]
            };
            myEcharts2.setOption(option2);

            let myEcharts3 = this.$echarts.init(this.$refs.Echarts3);
            let option3 = {
                title: {
                    text: '告警数',
                    subtext: this.allnum3,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: '12px',
                        fontWeight: '700'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}条 ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '0px',
                    data:this.starrm3
                },
                color: ['#FF908F', '#8693F3', '#08A9FE'],
                series: [
                    {
                        name:'告警类型',
                        type:'pie',
                        radius: ['60%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.starr3
                    }
                ]
            };
            myEcharts3.setOption(option3);

            let myEcharts4 = this.$echarts.init(this.$refs.Echarts4);
            let option4 = {
                title: {
                    text: '告警数',
                    subtext: this.allnum4,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: '12px',
                        fontWeight: '700'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}条 ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '0px',
                    data:this.starrm4
                },
                color: ['#FF908F', '#8693F3', '#08A9FE'],
                series: [
                    {
                        name:'告警类型',
                        type:'pie',
                        radius: ['60%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.starr4
                    }
                ]
            };
            myEcharts4.setOption(option4);
        },
        init2() {
            let myChart5 = this.$echarts.init(this.$refs.Echarts5);
            let option5 = {
                color: '#409eff',
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    },
                    formatter: "{a} <br/>{b}: {c} m³"
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '0%',
                    top: '6%',
                    containLabel: true
                },
                xAxis: {
                    axisTick: {
                        alignWithLabel: true
                    },
                    type: 'category',
                    data: this.monthlist
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} m³'
                    }
                },
                series: [
                    {
                        name:'历史能耗',
                        type:'bar',
                        stack: '总量',
                        barWidth: '60%',
                        itemStyle : {
                            normal: {
                                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#08A9FE'
                                }, {
                                    offset: 1,
                                    color: '#5C63F6'
                                }]),
                            }
                        },
                        data: this.water
                   }
               ]
            }
            myChart5.setOption(option5);

            let myChart6 = this.$echarts.init(this.$refs.Echarts6);
            let option6 = {
                color: '#8EF6D2',
                tooltip: {
                    enterable:true,
                    trigger: 'axis',
                    axisPointer : {
                        type : 'line'
                    },
                    formatter: "{a} <br/>{b}: {c} kW·h"
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '0%',
                    top: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.num
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} kW·h'
                    }
                },
                series: [
                    {
                        name:'历史用电',
                        type:'line',
                        stack: '总量',
                        data:this.valueList,
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        }
                    },
                ]
            };
            myChart6.setOption(option6);
        },
        init3() {
            let myChart7 = this.$echarts.init(this.$refs.Echarts7);
            let option7 = {
                title: {
                    text: '报修总量',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.personAll1,
                    subtextStyle:{
                        color:'#666',
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
                            {value:Number(this.personAll) - Number(this.person0), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart7.setOption(option7);

            let myChart8 = this.$echarts.init(this.$refs.Echarts8);
            let option8 = {
                title: {
                    text: '新申请',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.person1,
                    subtextStyle:{
                        color:'#666',
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
                            {value:Number(this.person1), itemStyle:{normal:{color:'#FF908F'},emphasis:{color:'#FF908F'}}},
                            {value:Number(this.personAll)-Number(this.person1), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart8.setOption(option8);

            let myChart9 = this.$echarts.init(this.$refs.Echarts9);
            let option9 = {
                title: {
                    text: '已委派',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.person2,
                    subtextStyle:{
                        color:'#666',
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
                            {value:Number(this.person2), itemStyle:{normal:{color:'#8693F3'},emphasis:{color:'#8693F3'}}},
                            {value:Number(this.personAll)-Number(this.person2), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart9.setOption(option9);

            let myChart10 = this.$echarts.init(this.$refs.Echarts10);
            let option10 = {
                title: {
                    text: '维修中',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.person3,
                    subtextStyle:{
                        color:'#666',
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
                            {value:Number(this.person3), itemStyle:{normal:{color:'#FFA740'},emphasis:{color:'#FFA740'}}},
                            {value:Number(this.personAll)-Number(this.person3), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart10.setOption(option10);
        },
        init4() {
            let myChart11 = this.$echarts.init(this.$refs.Echarts11);
		    let option11 = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} 个 ({d}%)"
                },
                color: ['#FF908F', '#8693F3'],
                series: [
                    {
                        name: '设备故障',
                        type: 'pie',
                        radius : '60%',
                        center: ['50%', '50%'],
                        data: this.nameListData1,
                        // data: [{value: 8, name: '故障'}, {value: 100, name: '正常'}],
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
		    myChart11.setOption(option11);
            let myChart12 = this.$echarts.init(this.$refs.Echarts12);
		    let option12 = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} 个 ({d}%)"
                },
                color: ['#8693F3', '#FF908F'],
                series: [
                    {
                        name: '设备巡检',
                        type: 'pie',
                        radius : '60%',
                        center: ['50%', '50%'],
                        data: this.nameListData2,
                        // data: [{value: 122, name: '已巡检'}, {value: 8, name: '未巡检'}],
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
		    myChart12.setOption(option12);
        },

        // 告警条数
        initData() {
            this.$axios.post(`BMPlatServers/warn/queryAllSystemWarning`).then((response) => {
                // console.log(response);
				if(response.data.success) {
                    this.starr1 = [];
                    this.starrm1 = [];
                    this.allnum1 = 0;
                    if(response.data.result.system1 && response.data.result.system1.length) {
                        response.data.result.system1.forEach((item)=>{
                            this.starr1.push({value: item.num, name: item.message});
                            this.starrm1.push(item.message);
                            this.allnum1 += item.num;
                        })
                        this.allnum1 = '' + this.allnum1;
                    }else{
                        this.starrm1 = ['高告警'];
                        this.starr1 = [{value: 0, name: '高告警'}];
                        this.allnum1 = '0';
                    }
                    this.loading1 = false;

                    this.starr2 = [];
                    this.starrm2 = [];
                    this.allnum2 = 0;
                    if(response.data.result.system2 && response.data.result.system2.length) {
                        response.data.result.system2.forEach((item)=>{
                            this.starr2.push({value: item.num, name: item.message});
                            this.starrm2.push(item.message);
                            this.allnum2 += item.num;
                        })
                        this.allnum2 = '' + this.allnum2;
                    }else{
                        this.starrm2 = ['高告警'];
                        this.starr2 = [{value: 0, name: '高告警'}];
                        this.allnum2 = '0';
                    }
                    this.loading2 = false;

                    this.starr3 = [];
                    this.starrm3 = [];
                    this.allnum3 = 0;
                    if(response.data.result.system3 && response.data.result.system3.length) {
                        response.data.result.system3.forEach((item)=>{
                            this.starr3.push({value: item.num, name: item.message});
                            this.starrm3.push(item.message);
                            this.allnum3 += item.num;
                        })
                        this.allnum3 = '' + this.allnum3;
                    }else{
                        this.starrm3 = ['高告警'];
                        this.starr3 = [{value: 0, name: '高告警'}];
                        this.allnum3 = '0';
                    }
                    this.loading3 = false;

                    this.starr4 = [];
                    this.starrm4 = [];
                    this.allnum4 = 0;
                    if(response.data.result.system4 && response.data.result.system4.length) {
                        response.data.result.system4.forEach((item)=>{
                            this.starr4.push({value: item.num, name: item.message});
                            this.starrm4.push(item.message);
                            this.allnum4 += item.num;
                        })
                        this.allnum4 = '' + this.allnum4;
                    }else{
                        this.starrm4 = ['高告警'];
                        this.starr4 = [{value: 0, name: '高告警'}];
                        this.allnum4 = '0';
                    }
                    this.loading4 = false;
                    this.init1();
				}else{
                    this.loading4 = false;
                    this.$message.warning({
                        message: response.data.resultMessage,
                        duration: 1000,
                        showClose: true
                    })
				}
			});

            // 供水校园历史能耗
            let data2 = {
                flag: 5,
                year: '',
                month: '',
                day: ''
            };
            this.$axios.post(`BMPlatServers/water/querySchoolHistory`, this.$qs.stringify(data2)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.water = [];
                    this.monthlist = [];
                    this.isShowEcharts1 = true;
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.water.push(item.consume);
                            this.monthlist.push(item.number)
                        })
                        this.init2();
                        this.loading5 = false;
                    }else{
                        this.isShowEcharts1 = false;
                        this.loading5 = false;
                        this.init2();
                    }
                }else{
                    this.loading5 = false;
                    this.isShowEcharts1 = false;
                    this.init2();
                }
            });

            // 供电系统校园总能耗
            this.$axios.post(`BMPlatServers/electricity/queryconsums`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.num = [];
                    this.valueList = [];
                    if(res.data.result.AllbuildCousumList && res.data.result.AllbuildCousumList.length) {
                        this.isShowEcharts2 = true;
                        res.data.result.AllbuildCousumList.forEach((item)=>{
                            this.num.push(item.time);
                            this.valueList.push(item.consum);
                        })
                        this.init2();
                    }else{
                        this.isShowEcharts2 = false;
                        this.init2();
                    }
                    this.loading6 = false;
                }else{
                    this.loading6 = false;
                    this.isShowEcharts2 = false;
                    this.init2();
                }
            })


            // 当前报修
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
                    }
                    this.init3();
                    this.loading7 = false;
                }else{
                    this.init3();
                    this.loading7 = false;
                }
            })

            // 设备巡检和故障
            this.$axios.post(`BMPlatServers/device/findexams`).then((res) => {
                // console.log(res);
                if(res.data.success){
                    this.nameListData1 = [];
                    this.nameListData2 = [];
                    if(res.data.result.listCount && res.data.result.listCount.length) {
                        res.data.result.listCount.forEach((item)=>{
                            console.log(item);
                            if(item.yzxcount != 0) {
                                this.nameListData2.push({value: item.yzxcount, name: '已巡检'});
                            }
                            this.nameListData1.push({value: item.gzs, name: '故障'});
                            this.nameListData1.push({value: item.zcs, name: '正常'});
                            this.nameListData2.push({value: item.wzxcount, name: '未巡检'});
                        })
                        this.init4();
                    }else{
                        this.init4();
                    }
                    this.loading8 = false;
                    this.loading9 = false;
                }else{
                    this.loading8 = false;
                    this.loading9 = false;
                    this.init4();
                }
            });
        },

        // 集中供暖地图
        markerClick(e) {
            let _this = this;
            if(e.target.obj_info) {
                let a = e.target.obj_info;
                _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 200px;height: 300px;justify-content: center;text-align: center">
                    <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                    <div class="el-loading-mask"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div>
                </div>`);
                _this.infoWindow.open(this.mapObject, e.target.getPosition());
                _this.$axios.post('BMPlatServers/hvacheat/queryAllRealtime',this.$qs.stringify({systemId: a.systemId,subsystemId: a.subsystemId,buildingId: a.buildingId})).then((res)=> {
                    if(res.data.success){
                        let info = res.data.result,
                            b = '';
                        if (info.list.length <= 0) {
                            b = `<div class="info-list"><div class="list-tit">楼宇名称</div><div class="list-info" style="width: auto;">${a.label}</div></div>`;
                        }
                        switch(a.subsystemId) {
                            case 1:
                                info.list.forEach(item=> {
                                    b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                })
                                this.infoWindow.setContent(`<div class="map-mark-info">${b}</div><div class="info-list info-list2"><a href="#/waterTower">查看详情</a></div>`);
                                break;
                            case 2:
                                info.list.forEach(item=> {
                                    if(item.dataType== 1 ||item.dataType== 2) {
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }else if(item.dataType== 3 ||item.dataType== 4) {
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }else if(item.dataType== 5 ||item.dataType== 6) {
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }else if(item.dataType== 7){
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }else{
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }
                                })
                                this.infoWindow.setContent(`<div class="map-mark-info">${b}</div><div class="info-list info-list2"><a href="#/heatSourceSystem?id=${a.systemId},${a.subsystemId},${a.buildingId}">查看详情</a></div>`);
                                break;
                            case 3:
                                info.list.forEach(item=> {
                                    if(item.dataType != 5&&item.dataType != 6&&item.dataType != 7&&item.dataType != 8&&item.iden !='data3x9x1'&&item.iden !='data1x8x1') {
                                        if((item.dataType== 1 ||item.dataType== 2) && item.deviceType!= 6 && item.deviceType!= 4) {
                                            b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                        }else if(item.dataType== 3 ||item.dataType== 4) {
                                            b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                        }else if(item.dataType== 1 && item.deviceType== 6) {
                                            b += `<div class="info-list"><div class="list-tit">${item.dataName}液位</div><div class="list-info">${item.dataValue}</div></div>`
                                        }else if(item.dataType== 1 && item.deviceType== 4) {
                                            b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                        }else{
                                            b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                        }
                                    }
                                })
                                this.infoWindow.setContent(`<div class="map-mark-info">${b}</div><div class="info-list info-list2"><a href="#/heatTransfer?id=${a.systemId},${a.subsystemId},${a.buildingId}">查看详情</a></div>`);
                                break;
                            case 4:
                                info.list.forEach(item=> {
                                    if(item.dataType== 1 ||item.dataType== 2) {
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }else if(item.dataType== 3 ||item.dataType== 4) {
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }else if(item.dataType== 5 ||item.dataType== 6) {
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }else if(item.dataType== 7){
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }else{
                                        b += `<div class="info-list"><div class="list-tit">${item.dataName}</div><div class="list-info">${item.dataValue}</div></div>`
                                    }
                                })
                                this.infoWindow.setContent(`<div class="map-mark-info">${b}</div><div class="info-list info-list2"><a href="#/buildingHeat?id=${a.systemId},${a.subsystemId},${a.buildingId}">查看详情</a></div>`);
                                break;
                        }
                    }else{
                        _this.mapLoading = false;
                        this.$message.warning({
                            message: res.data.resultMessage,
                            duration: 1000,
                            showClose: true
                        })
                    }
                })
            }
        },
    },
    mounted() {
        this.initData();

        // 地图
        let _this = this
            // 线路坐标
            ,lineArr = []
            ,icon = {
                type: 'image',
                image: '/static/img/marke_water.png',
                size: [16, 18],
                anchor: 'bottom-center',
                angel: 0,
                retina: true
            };
        _this.mapLoading = true;
        var map = new AMap.Map('system_index_map', {
	        zoom: 16,//级别
	        center: [116.800422,36.501566],//中心点坐标
	        zooms: [16, 18],
        });
        _this.mapObject = map;
        _this.$axios.post(`BMPlatServers/config/querymapinfo`,_this.$qs.stringify({ 'name': 'warm' }))
            .then(res=> {
                if(res.data.success) {
                    let waterArr = {
                        'warm1': '',
                        'warm2': '',
                        'scope': '',
                        'center': ''
                    }
                    res.data.result.list.forEach(item=> {
                        if(item.name == "warm"&&item.type == 0) {
                            // 入水
                            waterArr.warm1 = item;
                        }else if(item.name == "warm"&&item.type == 1) {
                            waterArr.warm2 = item;
                        } else if(item.name == 'center') {
                            waterArr.center = item;
                        } else if(item.name == "scope") {
                            waterArr.scope = item;
                        }
                    })
                    if(waterArr.center) {
                        let centerCoord = JSON.parse(waterArr.center.content)[0];
                        _this.mapObject.setZoomAndCenter(16,centerCoord);
                        let marker = new AMap.Marker({
                            position: centerCoord
                        });
                        marker.setMap(_this.mapObject);
                    }
                    if(waterArr.scope) {
                        let aaa = JSON.parse(waterArr.scope.content);
                        aaa.forEach((item,index)=> {
                            let lineRange = new AMap.Polyline({
                                path: item,
                                strokeColor: "#ff6600",
                                strokeStyle: "dashed",
                                borderWeight: 3,
                                lineCap: 'round'
                            })
                            _this.mapObject.add(lineRange);
                        })
                    }
                    if(waterArr.warm1) {
                        let aaa = JSON.parse(waterArr.warm1.content);
                        aaa.forEach((item,index)=> {
                            let lineRange = new AMap.Polyline({
                                path: item,
                                strokeColor: "#ff6600",
                                borderWeight: 3,
                                showDir:true,
                                strokeWeight: 5,
                                lineCap: 'round'
                            })
                            _this.mapObject.add(lineRange);
                        })
                    }
                    if(waterArr.warm2) {
                        let aaa = JSON.parse(waterArr.warm2.content);
                        aaa.forEach((item,index)=> {
                            let lineRange = new AMap.Polyline({
                                path: item,
                                strokeColor: "#3366ff",
                                borderWeight: 3,
                                showDir:true,
                                strokeWeight: 5,
                                lineCap: 'round'
                            })
                            _this.mapObject.add(lineRange);

                        })
                    }
                }else{
                    _this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
                    });
                }
            })
            .catch(res=> {
                _this.fullscreenLoading = false;
                // _this.get_userListLoading = false;
            })
        _this.$axios.post('BMPlatServers/hvacheat/queryHvacBuildings').then((res)=> {
            if(res.data.success){
                res.data.result.list.forEach(item=> {
                    let local = [];
                    local.push(item.longitude);
                    local.push(item.latitude);
                    lineArr.push(local);
                    var marker = new AMap.Marker({
                        position: local,
                        map: _this.mapObject,
                        icon: new AMap.Icon({
                            image: "/static/img/marke_heat.png",
                            imageSize: new AMap.Size(30,30),
                        }),
                        offset: new AMap.Pixel(-15, -30)
                    });
                    marker.obj_info = item;
                    marker.on('click', _this.markerClick, {target: marker});
                    var text = new AMap.Text({
                        text: `${item.label}`,
                        anchor:'center', // 设置文本标记锚点
                        cursor:'pointer',
                        position: local,
                        style:{
                            'z-index': '-1'
                        },
                        zIndex: '-1'
                    });
                    text.obj_info = item;
                    text.on('click', _this.markerClick, {target: text});
                    text.setMap(map);
                })
                _this.mapLoading = false;
            }else{
                _this.mapLoading = false;
                this.$message.warning({
                    message: res.data.resultMessage,
                    duration: 1000,
                    showClose: true
                })
            }
        });

        // 获取屏幕的高度付给元素
        this.$refs.index.style.height = window.screen.availHeight - 155 + 'px';
    },
    destroyed() {
        if(this.mapObject){
            this.mapObject.destroy();
        }
    }
}
</script>

<style lang="scss" scoped>
#index{
    /deep/ .map-mark-info {
        display: flex;
        flex-direction: column;
        max-height: 300px;
        overflow: auto;
        padding: 10px;
        width: 300px;
        .info-list {
            display: flex;
            line-height: 45px;
            align-items: center;
            .list-tit {
                display: flex;
                justify-content: flex-end;
                margin-right: 10px;
                font-weight: 600;
            }
            .list-info {
                flex: 1;
            }
        }
        .info-list2 {
            justify-content: center;
            >*{
                color: blue;
                font-size: 16px;
                font-weight: 600;
                text-decoration: underline;
            }
        }
    }
    /deep/ .info-list2 {
        display: flex;
        height: 45px;
        align-items: center;
        justify-content: center;
        >*{
            color: blue;
            font-size: 16px;
            font-weight: 600;
            text-decoration: underline;
        }
    }
    .index{
        background: rgba(242,242,242,1);
        padding-bottom: 10px;
        overflow: hidden;
        ul.index-header{
            overflow: hidden;
            padding: 0 12px;
            height: 22%;
            li{
                float: left;
                width: 25%;
                height: 100%;
                padding: 10px 8px;
                -webkit-box-sizing: border-box;
                -ms-box-sizing: border-box;
                -moz-box-sizing: border-box;
                -o-box-sizing: border-box;
                box-sizing: border-box;
                .inner{
                    height: 100%;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    background: #fff;
                    padding: 5px 10px;
                    span{
                        font-size: 16px;
                        font-weight: 400;
                        color: (40,40,40,1);
                        border-left: 4px solid #1296DB;
                        padding-left: 18px;
                    }
                    .echarts{
                        height: 80%;
                        width: 100%;
                        margin-top: 7px;
                    }
                }
            }
        }
        .map{
            overflow: hidden;
            padding: 5px 20px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            height: 56%;
            .map-left{
                float: left;
                width: 60%;
                height: 100%;
                padding-right: 17px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .innerMapLeft{
                    padding: 10px;
                    height: 100%;
                    background: #fff;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    .span1{
                        font-size: 16px;
                        font-weight: 400;
                        color: (40,40,40,1);
                        border-left: 4px solid #1296DB;
                        padding-left: 18px;
                    }
                    .system_index_map{
                        width: 95%;
                        height: 90%;
                        margin: 8px auto 0;
                    }
                }
            }
            .map-right{
                float: right;
                width: 40%;
                height: 100%;
                .innerMapRight{
                    height: 100%;
                    .mapRight-top{
                        height: 50%;
                        background: #fff;
                        padding: 10px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        .span2{
                            font-size: 16px;
                            font-weight: 400;
                            color: (40,40,40,1);
                            border-left: 4px solid #1296DB;
                            padding-left: 18px;
                        }
                        .noDataEcharts{
                            width: 90% !important;
                            margin: 48px auto 0px !important;
                            height: 70% !important;
                            line-height: 125px !important;
                            border-bottom: 1px solid #666 !important;
                            border-left: 1px solid #666 !important;
                            text-align: center !important;
                            font-size: 18px !important;
                            color: #666 !important;
                            position: relative !important;
                            top: -30px !important;
                        }
                        .echarts{
                            width: 100%;
                            height: 80%;
                            .echartsInner{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                    .mapRight-bottom{
                        height: 50%;
                        padding-top: 16px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        .bottomInner{
                            padding: 10px;
                            background: #fff;
                            width: 100%;
                            height: 100%;
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                            .span3{
                                font-size: 16px;
                                font-weight: 400;
                                color: (40,40,40,1);
                                border-left: 4px solid #1296DB;
                                padding-left: 18px;
                            }
                            .noDataEcharts{
                                width: 90% !important;
                                margin: 48px auto 0px !important;
                                height: 70% !important;
                                border-bottom: 1px solid #666 !important;
                                border-left: 1px solid #666 !important;
                                text-align: center !important;
                                line-height: 125px !important;
                                font-size: 18px !important;
                                color: #666 !important;
                                position: relative !important;
                                top: -30px !important;
                            }
                            .echarts{
                                width: 100%;
                                height: 80%;
                                .echartsInner{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }
            }
        }

        .bott{
            overflow: hidden;
            padding-left: 10px;
            height: 22%;
            .bott-left{
                width: 45%;
                height: 100%;
                float: left;
                padding: 10px 10px 0 10px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner{
                    background-color: #fff;
                    height: 100%;
                    width: 100%;
                    padding: 10px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    .span5{
                        font-size: 16px;
                        font-weight: 400;
                        color: (40,40,40,1);
                        border-left: 4px solid #1296DB;
                        padding-left: 18px;
                    }
                    .repair{
                        display: flex;
                        width: 100%;
                        height: 100%;
                        justify-content: space-around;
                        .echarts{
                            width: 25%;
                            height: 80%;
                        }
                    }
                }
            }
            .bott-center{
                width: 27%;
                height: 100%;
                float: left;
                padding: 10px 0 0 10px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner{
                    background: #fff;
                    height: 100%;
                    padding: 10px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    .span6{
                        font-size: 16px;
                        font-weight: 400;
                        color: (40,40,40,1);
                        border-left: 4px solid #1296DB;
                        padding-left: 18px;
                    }
                    .echarts{
                        width: 100%;
                        height: 80%;
                    }
                }
            }
            .bott-right{
                width: 28%;
                height: 100%;
                float: left;
                padding: 10px 20px 0 18px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner{
                    background: #fff;
                    height: 100%;
                    width: 100%;
                    padding: 10px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    .span7{
                        font-size: 16px;
                        font-weight: 400;
                        color: (40,40,40,1);
                        border-left: 4px solid #1296DB;
                        padding-left: 18px;
                    }
                    .echarts{
                        width: 100%;
                        height: 80%;
                    }
                }
            }
        }
    }
}
</style>
