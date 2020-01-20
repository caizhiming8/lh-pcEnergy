<template>
    <div id="WaterIndex">
        <div class="WaterIndex">
            <div class="WaterIndex-top">
                <div class="WaterIndex-top-left">
                    <div class="innder" v-loading="loading1">
                        <span>供水系统实时告警（等级统计）</span>
                        <div class="echarts" ref="Echarts1"></div>
                    </div>
                </div>
                <div class="WaterIndex-top-right">
                    <div class="innder" v-loading="loading2">
                        <span>供水系统实时告警（状态统计）</span>
                        <div class="echarts" ref="Echarts2"></div>
                    </div>
                </div>
            </div>
            <div class="WaterIndex-middle">
                <div class="WaterIndex-middle-left">
                    <div class="innerWaterIndex-middle-left">
                        <span>供水管网</span>
                        <div class="placeIcon" @click="toMaxMap">
                            <img src="../../../../static/img/quan.png" class="img1">
                        </div>
                        <div id="water_index_map" ref="water_index_map"></div>
                    </div>
                </div>
                <div class="WaterIndex-middle-right">
                    <div class="innerWaterIndex-middle-right">
                        <div class="WaterIndex-middle-right-top">
                            <div class="innerWaterIndex-middle-right-top" v-loading="loading3">
                                <span>医院历史能耗</span>
                                <div class="noDataEcharts" v-if="!isShowEcharts1">暂无数据</div>
                                <div class="echarts" v-if="isShowEcharts1">
                                    <div class="echartsInner" ref="Echarts3"></div>
                                </div>
                            </div>
                        </div>
                        <div class="WaterIndex-middle-right-bottom">
                            <div class="innerWaterIndex-middle-right-bottom" v-loading="loading4">
                                <span>夜间小流量</span>
                                <div class="noDataEcharts" v-if="!isShowEcharts2">暂无数据</div>
                                <div class="echarts" v-if="isShowEcharts2">
                                    <div class="echartsInner" ref="Echarts4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="WaterIndex-bottom">
                <div class="WaterIndex-bottom-left">
                    <div class="innerWaterIndex-bottom-left" v-loading="loading5">
                        <span>采集设备管理</span>
                        <div class="echarts" ref="Echarts5"></div>
                    </div>
                </div>
                <div class="WaterIndex-bottom-right">
                    <div class="innerWaterIndex-bottom-right">
                        <span>DMA分区数据</span>
                        <el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
                            <el-table-column prop="areaComment" label="分区名称" fixed sortable align='center'></el-table-column>
                            <el-table-column prop="inconsume" label="总供水量" fixed sortable align='center'></el-table-column>
                            <el-table-column prop="outconsume" label="总用水量" sortable align='center'></el-table-column>
                            <el-table-column prop="percent" label="漏损率" sortable align='center'></el-table-column>
                            <el-table-column prop="diff" label="漏损量" sortable align='center'></el-table-column>
                            <el-table-column prop="maxNum" label="阈值" sortable align='center'></el-table-column>
                            <el-table-column label="是否告警" sortable align='center'>
                                <template slot-scope="scope">
                                    <b v-if="scope.row.maxNum==null?false :  scope.row.diff >= scope.row.maxNum" style="color: red;">是</b>
                                    <b v-if="scope.row.maxNum==null? true:  scope.row.diff < scope.row.maxNum">否</b>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="bottom-pagnation">
                            <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
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
            allnum: 0,
            allnum2: 0,
            arrm: [],
            arr: [],
            starrm: [],
            currentPage: 1,
            pageSize: 2,
            pageTotal: 0,
            starr: [],
            mapLoading: false,
            mapObject: null,
            infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}),
            monthlist: [],
            water1: [],
            deviceName: [],
            dayConsume: [],
            nightConsume: [],
            tableData: [],
            dataName: [],
            dataValue: [],
            allNumber: 0,
            loading1: true,
            loading2: true,
            loading3: true,
            loading4: true,
            isShowEcharts1: true,
            isShowEcharts2: true,
            loading5: true
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
                        fontSize: 12,
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
                        radius: ['50%', '70%'],
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
                        fontSize: 12,
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
                        radius: ['50%', '70%'],
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
            let myChart3 = this.$echarts.init(this.$refs.Echarts3);
            let option3 = {
                tooltip: {
                    trigger: 'axis'
                },
                color: '#8EF6D2',
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '12%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
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
                        type:'line',
                        stack: '总量',
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        },
                        data: this.water1
                   }
               ]
            }
            myChart3.setOption(option3);
        },

        init3() {
            let myEchart4 = this.$echarts.init(this.$refs.Echarts4);
            let option4 = {
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    top: '12%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.deviceName
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel: {
                            formatter: '{value} m³'
                        }
                    }
                ],
                series : [
                    {
                        name:'夜间流量',
                        type:'bar',
                        data:this.nightConsume,
                        itemStyle : {
                            normal: {
                                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#29C8B1'
                                }, {
                                    offset: 1,
                                    color: '#78DB95'
                                }]),
                            }
                        }
                    },
                    {
                        name:'整日流量',
                        type:'bar',
                        data:this.dayConsume,
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
            myEchart4.setOption(option4);
        },

        init4() {
            let myEcharts5 = this.$echarts.init(this.$refs.Echarts5);
            let option5 = {
                title: {
                    text: '数量',
                    subtext: this.allNumber,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: 12,
                        fontWeight: 'normal'
                    }
                },
                color: ['#08A9FE', '#8693F3', '#FF908F'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}条 ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    y: '10px',
                    data: this.dataName
                },
                series: [
                    {
                        name:'设备管理',
                        type:'pie',
                        radius: ['50%', '70%'],
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
                        data: this.dataValue
                    }
                ]
            };
            myEcharts5.setOption(option5);
        },

        markerClick(e) {
            let _this = this;
            if(e.target.obj_info) {
                _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 150px;height: 200px;justify-content: center;text-align: center;display: flex;flex-direction: column;">
                    <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                    <div class="el-loading-mask"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div>
                </div>`);
                _this.infoWindow.open(this.mapObject, e.target.getPosition());
                _this.$axios.post('BMPlatServers/water/queryBuildingRealtime',this.$qs.stringify({deviceId: e.target.obj_info.id})).then((res)=> {
                    if(res.data.success){
                        let info = res.data.result;
                        this.infoWindow.setContent(`<div class="map-mark-info">
                            <div class="info-list"><div class="list-tit">楼宇名称</div><div class="list-info">${e.target.obj_info.name}</div></div>
                            <div class="info-list"><div class="list-tit">设备位置</div><div class="list-info">${info.buildingInfo.position}</div></div>
                            <div class="info-list"><div class="list-tit">信号强度</div><div class="list-info">${info.buildingInfo.strength}dB</div></div>
                            <div class="info-list"><div class="list-tit">电池电压</div><div class="list-info">${info.buildingInfo.voltage}V</div></div>
                            <div class="info-list"><div class="list-tit">月累计流量</div><div class="list-info">${info.monthconsume}立方米</div></div>
                            <div class="info-list"><div class="list-tit">年累计流量</div><div class="list-info">${info.yearconsume}立方米</div></div>
                            <div class="info-list"><div class="list-tit">实时抄表值</div><div class="list-info">${info.buildingInfo.consume}立方米</div></div>
                            <div class="info-list"><div class="list-tit">压力</div><div class="list-info">${info.buildingInfo.pressure!='-1'?info.buildingInfo.pressure+'MPa':'--'}</div></div>
                            <div class="info-list"><div class="list-tit">设备状态</div><div class="list-info">${info.buildingInfo.status}</div></div>
                            <div class="info-list info-list2"><a href="#/waterTower?buildingId=${e.target.obj_info.buildingId}">查看详情</a></div>
                        </div>`)
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

        toMaxMap() {
            this.fullScreen();
        },
        fullScreen() {
            let selfDom = document.querySelector('#water_index_map');
            let Dom = document.querySelector('.WaterIndex');
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
            let parents = document.querySelector('#WaterIndex');
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
                let NewDoms = document.querySelector('.innerWaterIndex-middle-left');
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

        initData() {
			let param = {
				systemId:1
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
                    }
					this.init1();
                    this.loading1 = false;
				}else{
                    this.loading1 = false;
                    this.init1();
				}
			});
			//查询各状态的报警数量
		    this.$axios.post(`BMPlatServers/warn/queryWarningStatus`,this.$qs.stringify(param)).then((response) => {
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
                        this.allnum2 = ""+this.allnum2;
                    }
					this.init1();
                    this.loading2 = false;
				}else{
                    this.loading2 = false;
                    this.init1();
				}
			});

            // 校园历史能耗
            let data = {
                flag: '5',
                year: '',
                month: '',
                day: ''
            };
            this.$axios.post(`BMPlatServers/water/querySchoolHistory`, this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.water1 = [];
                    this.monthlist = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.water1.push(item.consume);
                            this.monthlist.push(item.number)
                        })
                        this.isShowEcharts1 = true;
                    }else{
                        this.isShowEcharts1 = false;
                        this.$message.warning({
                            message: '暂无数据',
                            showClose: true,
                            duration: 1000
                        })
                    }
                    this.loading3 = false;
                    this.init2();
                }else{
                    this.isShowEcharts1 = false;
                    this.loading3 = false;
                    this.init2();
                }
            });

            // 夜间小流量
            let date = new Date(new Date().getTime() - 24*60*60*1000);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let dates = date.getDate();
            let data1 = {
                year,
                month,
                day: dates
            };
            this.$axios.post(`BMPlatServers/water/queryNightLeak`, this.$qs.stringify(data1)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.deviceName = [];
                    this.dayConsume = [];
                    this.nightConsume = [];
                    if(res.data.result.array && res.data.result.array.length) {
                        res.data.result.array.forEach((item)=>{
                            this.deviceName.push(item.deviceName);
                            this.dayConsume.push(item.dayConsume);
                            this.nightConsume.push(item.nightConsume);
                        })
                        this.loading4 = false;
                        this.isShowEcharts2 = true;
                    }else{
                        this.loading4 = false;
                        this.isShowEcharts2 = false;
                    }
                    this.init3();
                }else{
                    this.init3();
                    this.loading4 = false;
                    this.isShowEcharts2 = false;
                }
            });

            // 采集设备管理
            let data3 = {
                systemId: 1
            };
            this.$axios.post(`BMPlatServers/common/queryConnectedDevice`, this.$qs.stringify(data3)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataValue = [];
                    this.dataName = [];
                    this.allNumber = 0;
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.allNumber += item.num;
                            if(item.status == 0) {
                                this.dataValue.push({name: item.message, value: item.num});
                                this.dataName.push(item.message);
                            }else if(item.status == 1) {
                                this.dataValue.push({name: item.message, value: item.num});
                                this.dataName.push(item.message);
                            }
                        })
                        this.init4();
                        this.loading5 = false;
                    }else{
                        this.dataValue.push({name: '在线', value: 0});
                        this.dataName.push('在线');
                        this.allNumber = '0';
                        this.init4();
                        this.loading5 = false;
                    }
                }else{
                    this.init4();
                    this.loading5 = false;
                }
            })

            // DMA分区
            this.initTable(1);
		},
        initTable(currentPage) {
            let now = new Date();
            let endYear = now.getFullYear();
            let endMonth = now.getMonth() + 1;
            let endDate = now.getDate();
            let otherDay = new Date(new Date().getTime() - 5*24*60*60*1000);
            let startYear = otherDay.getFullYear();
            let startMonth = otherDay.getMonth()+1;
            let startDate = otherDay.getDate();
            let data2 = {
                startTime: `${startYear}-${startMonth}-${startDate}`,
                endTime: `${endYear}-${endMonth}-${endDate}`,
                pageSize: 2,
                currentPage
            };
            this.$axios.post(`BMPlatServers/water/queryWaterAreaInfo`, this.$qs.stringify(data2)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.array;
                    this.pageTotal = res.data.result.num;
                }else{
                    this.tableData = [];
                    this.pageTotal = 0;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        handleCurrentChange(val) {
            this.initTable(val);
        }
    },
    mounted() {

        this.initData();

        let _this = this
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
        var map = new AMap.Map('water_index_map', {
            zoom: 16,
            expandZoomRange:true,
	        center: [116.800422,36.501566],
	        zooms: [16, 20]
        });
        _this.mapObject = map;
        _this.$axios.post(`BMPlatServers/config/querymapinfo`,_this.$qs.stringify({ 'name': 'water' }))
            .then(res=> {
                if(res.data.success) {
                    let waterArr = {
                        'center': '',
                        'water': '',
                        'scope': ''
                    }
                    res.data.result.list.forEach(item=> {
                        if(item.name == 'center') {
                            waterArr.center = item;
                        } else if(item.name == "water") {
                            waterArr.water = item;
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
                    if(waterArr.water) {
                        let aaa = JSON.parse(waterArr.water.content);
                        aaa.forEach((item1,index)=> {
                            let lineRange = new AMap.Polyline({
                                path: item1,
                                strokeColor: "#3366FF",
                                borderWeight: 3,
                                showDir:true,
                                strokeWeight: 5,
                                lineCap: 'round'
                            })
                            _this.mapObject.add(lineRange);
                        })
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
        _this.$axios.post('BMPlatServers/common/queryBuildingsInfo', this.$qs.stringify({systemId: '1'})).then((res)=> {
            if(res.data.success){
                res.data.result.forEach(item=> {
                    let local = [];
                    local.push(item.longitude);
                    local.push(item.latitude);
                    lineArr.push(local);
                    var marker = new AMap.Marker({
                        position: local,
                        map: _this.mapObject,
                        icon: new AMap.Icon({
                            image: "/static/img/marke_water.png",
                            imageSize: new AMap.Size(30,30),
                        }),
                        offset: new AMap.Pixel(-15, -35)
                    });
                    marker.obj_info = item;
                    marker.on('click', _this.markerClick, {target: marker});
                    var text = new AMap.Text({
                        text: `${item.name}`,
                        anchor:'center',
                        cursor:'pointer',
                        position: local,
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
        .catch(res=> {
            console.log(res)
            _this.mapLoading = false;
        })
    },
    watch:{

    },
    destroyed() {
        if(this.mapObject){
            this.mapObject.destroy();
        }
    }
}
</script>

<style lang="scss" scoped>
#WaterIndex{
    height: 100%;
    /deep/ .amap-marker:hover {
        z-index: 100 !important;
    }
    /deep/ .amap-icon {
        width: 30px !important;
        height: 30px !important;
    }
    /deep/ .map-mark-info {
        display: flex;
        flex-direction: column;
        padding: 10px;
        width: 300px;
        .info-list {
            display: flex;
            height: 30px;
            align-items: center;
            .list-tit {
                display: flex;
                width: 90px;
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
    .WaterIndex{
        background: rgba(242,242,242,1);
        height: 100%;
        .WaterIndex-top{
            overflow: hidden;
            padding: 3px 6px;
            height: 28%;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .WaterIndex-top-left{
                float: left;
                width: 50%;
                height: 100%;
                padding: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .innder{
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
                        height: 86%;
                    }
                }
            }
            .WaterIndex-top-right{
                float: left;
                width: 50%;
                height: 100%;
                padding: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .innder{
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
                        height: 86%;
                    }
                }
            }
        }
        .WaterIndex-middle{
            overflow: hidden;
            height: 44%;
            padding: 5px 6px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .WaterIndex-middle-left{
                float: left;
                width: 50%;
                height: 100%;
                padding: 0 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .innerWaterIndex-middle-left{
                    background: #fff;
                    height: 100%;
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
                        right: 25px;
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
                    #water_index_map{
                        width: 98%;
                        height: 86%;
                        margin-top: 10px;
                    }
                }
            }
            .WaterIndex-middle-right{
                float: left;
                width: 50%;
                height: 100%;
                padding: 0 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                .innerWaterIndex-middle-right{
                    height: 100%;
                    .WaterIndex-middle-right-top{
                        height: 50%;
                        padding-bottom: 3px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        .innerWaterIndex-middle-right-top{
                            background: #fff;
                            height: 100%;
                            padding: 5px 0 0 20px;
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
                                width: 98%;
                                height: 86%;
                                .echartsInner{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                    .WaterIndex-middle-right-bottom{
                        height: 50%;
                        padding-bottom: 10px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        .innerWaterIndex-middle-right-bottom{
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
                                width: 98%;
                                height: 86%;
                                .echartsInner{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                    .WaterIndex-middle-right-bottom:before{
                        content: "";
                        background: rgba(242,242,242,1);
                        width: 100%;
                        height: 6%;
                        display: block;
                    }
                }
            }
        }
        .WaterIndex-bottom{
            height: 28%;
            overflow: hidden;
            padding: 10px 14px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .WaterIndex-bottom-left{
                float: left;
                width: 30%;
                height: 100%;
                padding-right: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .innerWaterIndex-bottom-left{
                    height: 100%;
                    background: #fff;
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
                        height: 86%;
                    }
                }
            }
            .WaterIndex-bottom-right{
                float: left;
                height: 100%;
                width: 70%;
                padding-left: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .innerWaterIndex-bottom-right{
                    height: 100%;
                    background: #Fff;
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
                        margin-left: 20px;
                    }
                    .bottom-pagnation{
                        padding-top: 5px;
                        text-align: right;
                    }
                }
            }
        }
    }
}
</style>
