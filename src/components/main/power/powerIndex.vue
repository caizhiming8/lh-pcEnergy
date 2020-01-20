<template>
    <div id="powerIndex">
        <div class="powerIndex">
            <div class="powerIndex-top">
                <div class="powerIndex-top-left">
                    <div class="inner-powerIndex-top-left" v-loading="loading1">
                        <span>供电系统实时告警（等级统计）</span>
                        <div class="echarts" ref="Echarts1"></div>
                    </div>
                </div>
                <div class="powerIndex-top-right">
                    <div class="inner-powerIndex-top-right" v-loading="loading2">
                        <span>供电系统实时告警（状态统计）</span>
                        <div class="echarts" ref="Echarts2"></div>
                    </div>
                </div>
            </div>
            <div class="powerIndex-middle">
                <div class="powerIndex-middle-left">
                    <div class="inner-powerIndex-middle-left">
                        <span>医院能耗实时用电</span>
                        <div class="placeIcon" @click="toMaxMap">
                            <img src="../../../../static/img/quan.png" class="img1">
                        </div>
                        <div class="placeMap">
                            <div id="power_index_map" ref="power_index_map"></div>
                        </div>
                    </div>
                </div>
                <div class="powerIndex-middle-right">
                    <div class="inner-powerIndex-middle-right" v-loading="loading3">
                        <span>采集设备管理</span>
                        <div class="echarts" ref="Echarts3"></div>
                    </div>
                </div>
            </div>
            <div class="powerIndex-bottom">
                <div class="powerIndex-bottom-left">
                    <div class="inner-powerIndex-bottom-left" v-loading="loading4">
                        <span>供电系统医院总能效（人均）</span>
                        <div class="noDataEcharts" v-if="!isShowEcharts1">暂无数据</div>
                        <div class="echarts" v-if="isShowEcharts1">
                            <div class="echarts" ref="Echarts4"></div>
                        </div>
                    </div>
                </div>
                <div class="powerIndex-bottom-right">
                    <div class="inner-powerIndex-bottom-right" v-loading="loading5">
                        <span>供电系统医院历史能耗</span>
                        <div class="noDataEcharts" v-if="!isShowEcharts2">暂无数据</div>
                        <div class="echarts" v-if="isShowEcharts2">
                            <div class="echarts" ref="Echarts5"></div>
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
            arr: [],
            arrm: [],
            allnum: 0,
            starr: [],
            starrm: [],
            allnum: 0,
            index: 0,
            mapLoading: false,
            mapObject: null,
            infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}),
            dataName: [],
            dataValue: [],
            num: [],
            valueList: [],
            dataName1: [],
            dataValue1: [],
            allNumber: 0,
            isShowEcharts1: true,
            isShowEcharts2: true,
            loading1: true,
            loading2: true,
            loading3: true,
            loading4: true,
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
                        fontSize: '12px'
                    }
                },
                color: ['#FF908F', '#8693F3', '#08A9FE'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
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
                    subtext: this.allnum,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: '12px'
                    }
                },
                color: ['#08A9FE', '#8693F3', '#FCC667', '#FF908F'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '0px',
                    top: '10px',
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
                title: {
                    text: '设备管理',
                    subtext: this.allNumber,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: 12
                    }
                },
                color: ['#08A9FE', '#8693F3', '#FF908F'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} 条 ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    y: '10px',
                    data: this.dataName1
                },
                series: [
                    {
                        name:'告警级别',
                        type:'pie',
                        radius: ['40%', '50%'],
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
                        data: this.dataValue1
                    }
                ]
            };
            myEcharts3.setOption(option3);
        },

        init3() {
            let myEcharts4 = this.$echarts.init(this.$refs.Echarts4);
            let option4 = {
                tooltip: {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c} kW·h/人"
                },
                color: '#8EF6D2',
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.dataName
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} kW·h/人'
                    }
                },
                series: [
                    {
                        name:'医院总能效',
                        type:'line',
                        stack: '总量',
                        data:this.dataValue,
                        symbol: 'circle',
                        symbolSize: 16,
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        }
                    },
                ]
            };
            myEcharts4.setOption(option4);

            let myEcharts5 = this.$echarts.init(this.$refs.Echarts5);
            let option5 = {
                tooltip: {
                    enterable:true,
                    trigger: 'axis',
                    axisPointer : {
                        type : 'line'
                    },
                    formatter: "{a} <br/>{b}: {c} kW·h"
                },
                color: '#8EF6D2',
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '10%',
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
                        symbol: 'circle',
                        symbolSize: 16,
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        }
                    }
                ]
            };
            myEcharts5.setOption(option5);
        },

        // 地图
        markerClick(e) {
            let _this = this;
            if(e.target.obj_info) {
                _this.mapObject.clearInfoWindow();
                _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 150px;height: 200px;justify-content: center;text-align: center;display: flex;flex-direction: column;">
                    <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                    <div class="el-loading-mask"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div>
                </div>`);
                _this.infoWindow.open(_this.mapObject, e.target.getPosition());
                _this.$axios.post('BMPlatServers/common/querybuildinfos',_this.$qs.stringify({building_id: e.target.obj_info.Id}))
                    .then((res)=> {// e.target.obj_info.Id
                        if(res.data.success){
                            let info = res.data.result;
                            _this.infoWindow.setContent(`<div class="map-mark-info">
                                <div class="info-list"><div class="list-tit">日累计用电量</div><div class="list-info">${info.dayConsum} kWh</div></div>
                                <div class="info-list"><div class="list-tit">月累计用电量</div><div class="list-info">${info.monthConsum} kWh</div></div>
                                <div class="info-list"><div class="list-tit">年累计用电量</div><div class="list-info">${info.yearConsum} kWh</div></div>
                                <div class="info-list"><div class="list-tit">电表状态</div><div class="list-info"><span style="color: green">正常${info.normalAmmeterSum}</span>/总数${info.ammeterSum}</div></div>
                                <div class="info-list info-list2"><a href="#/buildingPower?buildingId=${e.target.obj_info.Id}">查看详情</a></div>
                            </div>`);
                            _this.infoWindow.open(_this.mapObject, e.target.getPosition());
                        }else{
                            _this.mapLoading = false;
                            _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 150px;height: 200px;justify-content: center;text-align: center;display: flex;flex-direction: column;">
                                <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                            </div>`);
                            _this.$message.warning(res.data.resultMessage)
                        }
                    })
                    .catch(res=> {
                        _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 150px;height: 200px;justify-content: center;text-align: center">
                            <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                        </div>`);
                    })
            }
        },

        // 跳转map地图
        toMaxMap() {
            this.fullScreen();
        },

        fullScreen() {
            let selfDom = document.querySelector('#power_index_map');
            let Dom = document.querySelector('.powerIndex');
            let DomOffset = document.querySelector('#power_index_map');
            let Width = DomOffset.offsetWidth;
            let Height = DomOffset.offsetHeight;
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
            let parents = document.querySelector('#powerIndex');
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
                let NewDoms = document.querySelector('.placeMap');
                newDom.removeChild(Icon);
                parents.removeChild(newDom);
                selfDom.style.width = Width + 'px';
                selfDom.style.height = Height + 'px';
                selfDom.style.position = 'absolute';
                NewDoms.style.position = 'relative';
                selfDom.style.left = '0px';
                selfDom.style.top = '0px';
                selfDom.style.zIndex = '5';
            }
        },

        // 告警等级、状态查询
        initData() {
			let param = {
				systemId:2
			}
    		//查询各等级的报警数量
    		this.$axios.post(`BMPlatServers/warn/queryWarningDegree`,this.$qs.stringify(param)).then((response) => {
                // console.log(response);
    			if(response.data.success){
                    this.arr = [];
                    this.arrm = [];
    				if(response.data.result&&response.data.result.length){
    					response.data.result.forEach((item)=>{
    						this.arr.push({value:item.number,name:item.message});
    						this.arrm.push(item.message);
    						this.allnum = item.allnum;
    					})
                        this.allnum = ""+this.allnum;
                        this.init1();
        				this.loading1 = false;
    				}else{
    					this.arr.push({value:0,name:'没有告警'});
    					this.arrm.push('没有告警');
    					this.allnum = '0';
                        this.init1();
        				this.loading1 = false;
    				}
    			}else{
                    this.loading1 = false;
    				this.$message.warning(response.data.resultMessage);
                    this.init1();
    			}
    		});
    		//查询各状态的报警数量
    		this.$axios.post(`BMPlatServers/warn/queryWarningStatus`,this.$qs.stringify(param)).then((response) => {
				if(response.data.success){
                    this.starr = [];
                    this.starrm = [];
					if(response.data.result&&response.data.result.length){
						response.data.result.forEach((item)=>{
							this.starr.push({value:item.number,name:item.message});
							this.starrm.push(item.message);
							this.allnum = item.allnum;
						})
                        this.allnum = ""+this.allnum;
					}else{
						this.starr.push({value:0,name:'没有告警'});
						this.starrm.push('没有告警');
						this.allnum = '0';
					}
                    this.loading2 = false;
					this.init1();
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                    this.init1();
                    this.loading2 = false;
				}
			});

            // 设备管理
            let data3 = {
                systemId: 2
            };
            this.$axios.post(`BMPlatServers/common/queryConnectedDevice`, this.$qs.stringify(data3)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.dataValue1 = [];
                    this.dataName1 = [];
                    this.allNumber = 0;
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.allNumber += item.num;
                            if(item.status == 0) {
                                this.dataValue1.push({name: item.message, value: item.num});
                                this.dataName1.push(item.message);
                            }else if(item.status == 1) {
                                this.dataValue1.push({name: item.message, value: item.num});
                                this.dataName1.push(item.message);
                            }
                        })
                        this.allNumber=""+this.allNumber;
                        this.loading3 = false;
                        this.init2();
                    }else{
                        this.dataValue1.push({name: '在线', value: 0});
                        this.dataName1.push('在线');
                        this.allNumber = '0';
                        this.loading3 = false;
                        this.init2();
                    }
                }else{
                    this.init2();
                    this.loading3 = false;
                }
            })

            // 校园总能耗
            let data = {
                queryFlag: 1,
                year: '',
                month: '',
                day: ''
            };
            this.$axios.post(`BMPlatServers/electricity/queryenergyefficiency`, this.$qs.stringify(data)).then((res)=>{
                this.dataName = [];
                this.dataValue = [];
                if(res.data.success) {
                    // 校园总能耗人均
                    this.isShowEcharts1 = true;
                    if(res.data.result.TjnConsumByPepleList && res.data.result.TjnConsumByPepleList.length) {
                        res.data.result.TjnConsumByPepleList.forEach((item)=>{
                            this.dataName.push(item.time);
                            this.dataValue.push(item.rate);
                        });
                        this.init3();
                    }else{
                        this.init3();
                    }
                    this.loading4 = false;
                }else{
                    this.isShowEcharts1 = false;
                    this.loading4 = false;
                    this.init3();
                }
            })

            // 校园历史能耗
            let params = {
                classId: '',
                queryFlag: '',
                year: '',
                month: '',
                day: ''
            };
            this.$axios.post(`BMPlatServers/electricity/queryhistoryconsum`, this.$qs.stringify(params)).then((res)=>{
                this.num = [];
                this.valueList = [];
                if(res.data.success) {
                    if(res.data.result.AllbuildCousumList && res.data.result.AllbuildCousumList.length) {
                        this.isShowEcharts2 = true;
                        res.data.result.AllbuildCousumList.forEach((item)=>{
                            this.num.push(item.time);
                            this.valueList.push(item.consum);
                        })
                    }else{
                        this.isShowEcharts2 = false;
                    }
                    this.init3();
                    this.loading5 = false;
                }else{
                    this.isShowEcharts2 = false;
                    this.loading5 = false;
                    this.init3();
                }
            })
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
        var map = new AMap.Map('power_index_map', {
	        zoom: 16,//级别
            expandZoomRange:true,
	        center: [116.800422,36.501566],//中心点坐标
	        zooms: [16, 20]
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
                        if(item.name == 'center') {
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
                }else{
                    _this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
                    });
                }
            })
            .catch(res=> {
                // _this.get_userListLoading = false;
            })
        _this.$axios.post('BMPlatServers/common/queryBuildingsInfo', this.$qs.stringify({systemId: '2'})).then((res)=> {
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
                            image: "/static/img/marke_ele.png",
                            imageSize: new AMap.Size(30,30),
                        }),
                        offset: new AMap.Pixel(-15, -35)
                    });
                    marker.obj_info = item;
                    marker.on('click', _this.markerClick, {target: marker});
                    var text = new AMap.Text({
                        text: `${item.name}`,
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
					duration: 1000,
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
#powerIndex{
    background: rgba(242,242,242,1);
    height: 100%;
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
    /deep/ .amap-marker:hover{
        z-index: 500 !important;
    }
    /deep/ .amap-icon {
        width: 30px !important;
        height: 30px !important;
    }
    .powerIndex{
        height: 100%;
        padding: 10px 16px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .powerIndex-top{
            height: 22%;
            overflow: hidden;
            .powerIndex-top-left{
                float: left;
                width: 50%;
                height: 100%;
                padding-right: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-powerIndex-top-left{
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
            .powerIndex-top-right{
                float: left;
                width: 50%;
                height: 100%;
                padding-left: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-powerIndex-top-right{
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
        .powerIndex-middle{
            height: 48%;
            overflow: hidden;
            padding-top: 16px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .powerIndex-middle-left{
                float: left;
                width: 60%;
                height: 100%;
                padding-right: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-powerIndex-middle-left{
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
                    .placeMap{
                        position: relative;
                        height: 100%;
                        #power_index_map {
                            height: 86%;
                            width: 98%;
                            margin-top: 10px;
                        }
                        .exitFullScreen{
                            width: 40px;
                            height: 40px;
                            z-index: 100;
                            background: #fff;
                            border-radius: 50%;
                            text-align: center;
                            line-height: 40px;
                            cursor: pointer;
                            position: absolute;
                            top: 20px;
                            right: 20px;
                            .img2{
                                display: inline-block;
                                width: 30px;
                                height: 30px;
                            }
                        }
                    }
                }
            }
            .powerIndex-middle-right{
                float: left;
                height: 100%;
                width: 40%;
                padding-left: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-powerIndex-middle-right{
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
                        height: 91%;
                    }
                }
            }
        }
        .powerIndex-bottom{
            height: 30%;
            overflow: hidden;
            padding-top: 16px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .powerIndex-bottom-left{
                float: left;
                width: 50%;
                height: 100%;
                padding-right: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-powerIndex-bottom-left{
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
                        height: 86%;
                        .echartsInner{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
            .powerIndex-bottom-right{
                float: left;
                width: 50%;
                height: 100%;
                padding-left: 8px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .inner-powerIndex-bottom-right{
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
                        height: 86%;
                    }
                }
            }
        }
    }
}
</style>
