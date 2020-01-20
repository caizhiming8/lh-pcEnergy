<template>
    <div id="hotIndex">
        <div class="hotIndex">
            <div class="hotIndex-top">
                <div class="hotIndex-top-left">
                    <div class="inner-hotIndex-top-left" v-loading="loading1">
                        <span>供暖系统实时告警（等级统计）</span>
                        <div class="echarts" ref="Echarts1"></div>
                    </div>
                </div>
                <div class="hotIndex-top-center">
                    <div class="inner-hotIndex-top-center" v-loading="loading2">
                        <span>供暖系统实时告警（状态统计）</span>
                        <div class="echarts" ref="Echarts2"></div>
                    </div>
                </div>
                <div class="hotIndex-top-right">
                    <div class="inner-hotIndex-top-right" v-loading="loading3">
                        <span>当前室外温度</span>
                        <div class="echarts" ref="Echarts3"></div>
                    </div>
                </div>
            </div>
            <div class="Middle">
                <div class="hotIndex-middle">
                    <div class="inner-hotIndex-middle">
                        <span>供暖管网</span>
                        <div class="placeIcon" @click="toMaxMap">
                            <img src="../../../../static/img/quan.png" class="img1">
                        </div>
                        <div id="heat_index_map" ref="heat_index_map"></div>
                    </div>
                </div>
                <div class="hotIndex-middle-right">
                    <div class="hotIndex-bottom-top">
                        <div class="inner-hotIndex-bottom-top" >
                            <span>热量历史能耗</span>
                            <div class="noDataEcharts" v-if="!isShowEcharts1">暂无数据</div>
                            <div class="echarts" v-if="isShowEcharts1">
                                <div class="echartsInner" ref="Echarts4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="hotIndex-bottom-bottom">
                        <div class="inner-hotIndex-bottom-bottom" >
                            <span>楼宇能耗对比</span>
                            <div class="noDataEcharts" v-if="!isShowEcharts2">暂无数据</div>
                            <div class="echarts" v-if="isShowEcharts2">
                                <div class="echartsInner" ref="Echarts5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hotIndex-bottom">
                <div class="inner-hotIndex-bottom">
                    <span>楼宇热量表</span>
                    <el-table :data="tableData" style="100%" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px'}">
                        <el-table-column prop="buildingName" label="楼宇" align='center'></el-table-column>
                        <el-table-column prop="supplyWaterTemperature" label="供水温度" align='center'></el-table-column>
                        <el-table-column prop="returnWaterTemperature" label="回水温度" align='center'></el-table-column>
                        <el-table-column prop="pressureOfSupplyWater" label="供水压力" align='center'></el-table-column>
                        <el-table-column prop="pressureOfReturnWater" label="回水压力" align='center'></el-table-column>
                        <el-table-column prop="InstantaneousWaterSupplyFlow" label="瞬时流量" align='center'></el-table-column>
                        <el-table-column prop="CumulativeFlowOfWaterSupply" label="累计流量" align='center'></el-table-column>
                        <el-table-column prop="instantaneousHeat" label="瞬时热量" align='center'></el-table-column>
                        <el-table-column prop="totalQuantityOfHeat" label="累计热量" align='center'></el-table-column>
                    </el-table>
                    <div class="bottom-pagnation">
                        <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
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
            currentPage: 1,
            pageSize: 2,
            pageTotal: 0,
            tableData: [],
            allnum: 0,
            arrm: [],
            arr: [],
            starrm: [],
            starr: [],
            water: [],
            month:[],
            buildings: [],
            consume1: [],
            mapLoading: false,
            mapObject: null,
            windowThermometer: [],
            infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}),
            loading1: true,
            loading2: true,
            loading3: true,
            loading4: true,
            loading5: true,
            isShowEcharts1: true,
            isShowEcharts2: true,
            allnum2: 0
        }
    },
    methods: {
        init1() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '总告警条数',
                    subtext: this.allnum,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'normal'
                    }
                },
                color: ['#FF908F', '#8693F3', '#08A9FE'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}条 ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    y: '10px',
                    data:this.arrm
                },
                series: [
                    {
                        name:'告警级别',
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
                        data:this.arr
                    }
                ]
            };
            myEcharts1.setOption(option1);

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                    text: '总告警条数',
                    subtext: this.allnum2,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'normal'
                    }
                },
                color: ['#08A9FE', '#8693F3', '#FCC667', '#FF908F'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}条 ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '15px',
                    y: '10px',
                    data:this.starrm
                },
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
                        data:this.starr
                    }
                ]
            };
            myEcharts2.setOption(option2);
        },

        init2() {
            let myEcharts3 = this.$echarts.init(this.$refs.Echarts3);
            let option3 = {
                tooltip: {
                    formatter: "{a} {b} : {c} ℃"
                },
                series: [{
                    name: '室外温度',
                    type: 'gauge',
                    detail: {
                        formatter: '{value}℃',
                        textStyle: {
                            fontSize: 15,
                            fontWeight: 700
                        }
                    },
                    data: this.windowThermometer,
                    min: 0,
                    max: 50,
                    splitNumber:5,
                    pointer: {   // 指针的宽度和长度
                        width:3,//指针的宽度
                        length:"80%", //指针长度，按照半圆半径的百分比
                        shadowColor : '#ccc', //默认透明
                        shadowBlur: 25
                    },
                    splitLine: {   //分割线的长度
                        length: 12
                    },
                    axisLine: {
                        show: true,
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
                    }
                }]
            };
            myEcharts3.setOption(option3);
        },

        init3() {
            let myChart4 = this.$echarts.init(this.$refs.Echarts4);
            let option4 = {
                tooltip: {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c} GJ"
                },
                color: '#8EF6D2',
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    top: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.month
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} GJ'
                    }
                },
                series: [
                    {
                        name:'历史能耗',
                        type:'line',
                        stack: '总量',
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        },
                        data: this.water
                   }
               ]
            }
            myChart4.setOption(option4);
        },

        init4() {
            let myChart5 = this.$echarts.init(this.$refs.Echarts5);
            let option5 = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    },
                    formatter: "{a} <br/>{b}: {c} GJ"
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    top: '15%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.buildings,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel: {
                            formatter: '{value} GJ'
                        }
                    }
                ],
                series : [
                    {
                        name:'历史能耗',
                        type:'bar',
                        barWidth: '60%',
                        data: this.consume1,
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
                        }
                    }
                ]
            };
            myChart5.setOption(option5);
        },

        // 跳转地图
        toMaxMap() {
            this.fullScreen();
        },
        fullScreen() {
            let selfDom = document.querySelector('#heat_index_map');
            let Dom = document.querySelector('.hotIndex');
            let Width = selfDom.offsetWidth;
            let Height = selfDom.offsetHeight;
            selfDom.style.position = 'fixed';
            selfDom.style.left = '280px';
            selfDom.style.top = '73px';
            selfDom.style.width = Dom.offsetWidth + 'px';
            selfDom.style.height = Dom.offsetHeight + 'px';
            selfDom.style.zIndex = 1000000;
            // 生成一个关闭的dom
            let  newDom = document.createElement('p');
            newDom.style.width = '60px';
            newDom.style.height = '60px';
            newDom.style.background  = '#fff';
            newDom.style.borderRadius = '50%';
            newDom.style.position = 'fixed';
            newDom.style.right = '20px';
            newDom.style.top = '88px';
            newDom.style.zIndex = '10000100';
            newDom.style.cursor = 'pointer';
            let parents = document.querySelector('#hotIndex');
            parents.appendChild(newDom);
            // 生成一个图标，放到p标签里面
            let Icon = document.createElement('img');
            Icon.src = '../../../../static/img/suoxiao.png';
            Icon.style.width = '40px';
            Icon.style.height = '40px';
            Icon.style.position = 'relative';
            Icon.style.left = '10px';
            Icon.style.top = '10px';
            newDom.appendChild(Icon);
            // 恢复地图
            newDom.onclick = ()=>{
                let NewDoms = document.querySelector('.inner-hotIndex-middle');
                newDom.removeChild(Icon);
                parents.removeChild(newDom);
                selfDom.style.width = Width + 'px';
                selfDom.style.height = Height + 'px';
                selfDom.style.position = 'absolute';
                NewDoms.style.position = 'relative';
                selfDom.style.left = '18px';
                selfDom.style.top = '34px';
                selfDom.style.zIndex = '5';
            }
        },

        // 地图
        markerClick(e) {
            let _this = this;
            if(e.target.obj_info) {
                let a = e.target.obj_info;
                _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 200px;height: 300px;justify-content: center;text-align: center;display: flex;flex-direction: column;">
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
                        _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 200px;height: 300px;justify-content: center;text-align: center;display: flex;flex-direction: column;">
                            <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                        </div>`);
                        this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
                            duration: 1000
						})
                    }
                })
            }
        },

        initData() {
            let param = {
				systemId:3
			}
		    //查询各等级的报警数量
		    this.$axios.post(`BMPlatServers/warn/queryWarningDegree`,this.$qs.stringify(param)).then((response) => {
				if(response.data.success){
                    this.arr = [];
                    this.arrm = [];
                    this.allnum = 0;
                    if(response.data.result && response.data.result.length) {
                        response.data.result.forEach((item)=>{
    						this.arr.push({value:item.number,name:item.message});
    						this.arrm.push(item.message);
    						this.allnum = item.allnum;
    					})
                        this.allnum = ""+this.allnum;
                    }else{
                        response.data.result = [];
                        this.arr.push({value:0,name:'没有告警'});
                        this.arrm.push('没有告警');
                        this.allnum = '0';
                    }
                    this.init1();
                    this.loading1 = false;
				}else{
                    this.init1();
                    this.loading1 = false;
				}
			});
			//查询各状态的报警数量
		    this.$axios.post(`BMPlatServers/warn/queryWarningStatus`,this.$qs.stringify(param)).then((response) => {
                // console.log(response);
				if(response.data.success){
                    this.starr = [];
                    this.starrm = [];
                    this.allnum2 = 0;
                    if(response.data.result && response.data.result.length) {
                        response.data.result.forEach((item)=>{
    						this.starr.push({value:item.number,name:item.message});
    						this.starrm.push(item.message);
    						this.allnum2 = item.allnum;
    					})
                        this.allnum2 = "" + this.allnum2;
                    }else{
                        response.data.result = [];
                        this.starr.push({value:0,name:'没有告警'});
                        this.starrm.push('没有告警');
                        this.allnum2 = '0';
                    }
                    this.init1();
                    this.loading2 = false;
				}else{
                    this.init1();
                    this.loading2 = false;
				}
			});

            // 室外温度
            this.$axios.post(`BMPlatServers/hvacheat/queryTemperature`).then((res)=>{
                if(res.data.success) {
                    this.windowThermometer = [];
                    this.windowThermometer.push({value: res.data.result.result.VALUE == undefined ? 0 : res.data.result.result.VALUE});
                    this.init2();
                    this.loading3 = false;
                }else{
                    this.init2();
                    this.loading3 = false;
                }
            });

            // 历史数据
            let date = new Date(new Date().getTime() - 24*60*60*1000);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let dates = date.getDate();
            let data = {
                flag: 4,
                time:`${year}-${month}-${dates}`,
                query: 1,
                systemId: 3,
                subsystemId: 3,
                // buildingId:115
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryCityHeatHistory`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.water = [];
                    this.month = [];
                    if(res.data.result.list&&res.data.result.list.length){
                        res.data.result.list.forEach((item)=>{
                            this.water.push(item.consume);
                            this.month.push(item.number);
                        })
                        this.init3();
                        this.loading4 = false;
                        this.isShowEcharts1 = true;
                    }else {
                        this.init3();
                        this.loading4 = false;
                        this.isShowEcharts1 = false;
                    }
                }else{
                    this.loading4 = false;
                    this.init3();
                    this.isShowEcharts1 = false;
                }
            });

            // 楼宇能耗对比
            let datas={
                systemId: 3,
                subsystemId: 4,
                flag: 1
            }
            this.$axios.post(`BMPlatServers/hvacheat/queryBuildingsConsume`, this.$qs.stringify(datas)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.consume1 = [];
                    this.buildings = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.consume1.push(item.consume);
                            this.buildings.push(item.buildingName);
                        });
                        this.init4();
                        this.loading5 = false;
                        this.isShowEcharts2 = true;
                    }else {
                        this.isShowEcharts2 = false;
                        this.loading5 = false;
                        this.init4();
                    }
                }else{
                    this.isShowEcharts2 = false;
                    this.loading5 = false;
                    this.init4();
                }
            });

            // 楼宇热量表
            this.buildingList(1);
        },
        buildingList(currentPage) {
            let data1 = {
                pageSize: 2,
                currentPage
            }
            this.$axios.post('BMPlatServers/hvacheat/queryBuildingHeatRealtime', this.$qs.stringify(data1)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((outItem)=>{
                            outItem.supplyWaterTemperature = 0;
                            outItem.returnWaterTemperature = 0;
                            outItem.pressureOfSupplyWater = 0;
                            outItem.pressureOfReturnWater = 0;
                            outItem.InstantaneousWaterSupplyFlow = 0;
                            outItem.CumulativeFlowOfWaterSupply = 0;
                            outItem.instantaneousHeat = 0;
                            outItem.totalQuantityOfHeat = 0;
                            if(outItem.datalist && outItem.datalist.length) {
                                outItem.datalist.forEach((innerItem)=>{
                                    if(innerItem.dataType==1) {
                                        outItem.supplyWaterTemperature = innerItem.dataValue;
                                    }else if(innerItem.dataType==2) {
                                        outItem.returnWaterTemperature = innerItem.dataValue;
                                    }else if(innerItem.dataType==3) {
                                        outItem.pressureOfSupplyWater = innerItem.dataValue;
                                    }else if(innerItem.dataType==4) {
                                        outItem.pressureOfReturnWater = innerItem.dataValue;
                                    }else if(innerItem.dataType==5) {
                                        outItem.InstantaneousWaterSupplyFlow = innerItem.dataValue;
                                    }else if(innerItem.dataType==6) {
                                        outItem.CumulativeFlowOfWaterSupply = innerItem.dataValue;
                                    }else if(innerItem.dataType==7) {
                                        outItem.instantaneousHeat = innerItem.dataValue;
                                    }else if(innerItem.dataType==8) {
                                        outItem.totalQuantityOfHeat = innerItem.dataValue;
                                    }
                                })
                            }
                        })
                    }
                    this.tableData = res.data.result.list;
                    this.pageTotal = res.data.result.num;
                }
            })
        },
        handleCurrentChange(val) {
            this.buildingList(val);
        }
    },
    mounted() {
        this.initData();

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
        var map = new AMap.Map('heat_index_map', {
	        zoom: 16,//级别
            expandZoomRange:true,
	        center: [116.800422,36.501566],//中心点坐标
	        zooms: [16, 20],
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
                    showClose: true,
                    duration: 1000
                })
            }
        })
    },
    watch: {

    },
    destroyed() {
        if(this.mapObject){
            this.mapObject.destroy();
        }
    }
}
</script>

<style lang="scss" scoped>
#hotIndex{
    height: 100%;
    background: rgba(242,242,242,1);
    /deep/ .map-mark-info {
        display: flex;
        flex-direction: column;
        max-height: 300px;
        overflow: auto;
        padding: 10px;
        width: 300px;
        .info-list {
            display: flex;
            line-height: 40px;
            align-items: center;
            .list-tit {
                display: flex;
                // width: 90px;
                justify-content: flex-end;
                margin-right: 10px;
                font-weight: 600;
            }
            .list-info {
                flex: 1;
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
    .hotIndex{
        height: 100%;
        padding: 10px 16px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .hotIndex-top{
            overflow: hidden;
            height: 28%;
            .hotIndex-top-left{
                height: 100%;
                width: 35%;
                float: left;
                padding-right: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-hotIndex-top-left{
                    background: #fff;
                    height: 100%;
                    padding: 10px 0 0 20px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    span{
                        font-size: 16px;
                        font-weight: 400;
                        color: (40,40,40,1);
                        border-left: 4px solid #1296DB;
                        padding-left: 18px;
                    }
                    .echarts{
                        width: 98%;
                        height: 88%;
                    }
                }
            }
            .hotIndex-top-center{
                height: 100%;
                width: 35%;
                float: left;
                padding: 0 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-hotIndex-top-center{
                    background: #fff;
                    height: 100%;
                    padding: 10px 0 0 20px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    span{
                        font-size: 16px;
                        font-weight: 400;
                        color: (40,40,40,1);
                        border-left: 4px solid #1296DB;
                        padding-left: 18px;
                    }
                    .echarts{
                        width: 98%;
                        height: 88%;
                    }
                }
            }
            .hotIndex-top-right{
                height: 100%;
                width: 30%;
                float: left;
                padding-left: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-hotIndex-top-right{
                    background: #fff;
                    height: 100%;
                    padding: 10px 0 0 20px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    span{
                        font-size: 16px;
                        font-weight: 400;
                        color: (40,40,40,1);
                        border-left: 4px solid #1296DB;
                        padding-left: 18px;
                    }
                    .echarts{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        .Middle{
            height: 42%;
            overflow: hidden;
            .hotIndex-middle{
                height: 100%;
                width: 60%;
                float: left;
                padding: 16px 0 0 0;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-hotIndex-middle{
                    height: 100%;
                    background: #fff;
                    padding: 10px 0 0 20px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    position: relative;
                    span{
                        font-size: 16px;
                        font-weight: 400;
                        color: (40,40,40,1);
                        border-left: 4px solid #1296DB;
                        padding-left: 18px;
                    }
                    .placeIcon{
                        position: absolute;
                        right: 45px;
                        top: 48px;
                        width: 40px;
                        height: 40px;
                        z-index: 100;
                        background: #fff;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 40px;
                        cursor: pointer;
                        .img1{
                            display: inline-block;
                            width: 30px;
                            height: 30px;
                        }
                    }
                    #heat_index_map{
                        width: 98%;
                        height: 87%;
                        margin-top: 10px;
                    }
                }
            }
            .hotIndex-middle-right{
                width: 40%;
                float: left;
                height: 100%;
                .hotIndex-bottom-top{
                    height: 50%;
                    padding: 16px 0 8px 16px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    .inner-hotIndex-bottom-top{
                        background-color: #fff;
                        height: 100%;
                        padding: 10px 0 0px 20px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        span{
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
                            width: 98%;
                            height: 88%;
                            .echartsInner{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
                .hotIndex-bottom-bottom{
                    height: 50%;
                    padding: 10px 0 0 16px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    .inner-hotIndex-bottom-bottom{
                        background: #fff;
                        height: 100%;
                        padding: 10px 0 0 20px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        span{
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
                            width: 98%;
                            height: 88%;
                            .echartsInner{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }

        .hotIndex-bottom{
            height: 30%;
            overflow: hidden;
            padding-top: 16px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .inner-hotIndex-bottom{
                background: #fff;
                height: 100%;
                padding: 10px 0 0 0px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                span{
                    font-size: 16px;
                    font-weight: 400;
                    color: (40,40,40,1);
                    border-left: 4px solid #1296DB;
                    padding-left: 18px;
                    position: relative;
                    left: 20px;
                }
                .el-table{
                    margin-top: 10px;
                }
                .bottom-pagnation{
                    text-align: right;
                    padding-top: 10px;
                }
            }
        }
    }
}
</style>
