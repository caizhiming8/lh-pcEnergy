<template>
    <div id="EnergySchool">
        <!-- <div class="linePadding"> -->
            <el-tabs type="border-card" @tab-click="Tabs" ref="tabs">
                <el-tab-pane label="实时能耗" style="height: 100%;" v-hasTabMenu="1-1-1-1">
                    <div id="power" v-loading="mapLoading">
                        <div id="container000"></div>
                        <div class="map-shade" style="width:24r em">
                            <div class="input-item">
                                <button id="random-zoom-btn" class="btn" @click="goBackCenter">返回中心点</button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="历史能耗" v-hasTabMenu="1-1-1-2">
                    <v-historyEnegy v-if="index==1"></v-historyEnegy>
                </el-tab-pane>
                <el-tab-pane label="能耗分布" v-hasTabMenu="1-1-1-3">
                    <v-energyDistribution v-if="index==2"></v-energyDistribution>
                </el-tab-pane>
				<el-tab-pane label="历史能耗同比" v-hasTabMenu="1-1-1-5">
					<v-energyEfficiencyRatio v-if="this.index==3"></v-energyEfficiencyRatio>
				</el-tab-pane>
            </el-tabs>
        <!-- </div> -->
    </div>
</template>

<script>
import energyDistribution from './EnergySchool/energyDistribution.vue'
import historyEnegy from './EnergySchool/historyEnegy.vue'
import energyEfficiencyRatio from './EnergySchool/energyEfficiencyRatio.vue'
export default {
    data() {
        return{
            index: 0,
            mapLoading: false,
            mapObject: null,
            infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}),
            // 中心点坐标
            centerPoint: ''
        }
    },
    methods: {
        Tabs(items) {
            this.index = items.index;
        },
        markerClick(e) {
            let _this = this;
            if(e.target.obj_info) {
                _this.mapObject.clearInfoWindow();
                _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 250px;height: 200px;justify-content: center;text-align: center">
                    <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                    <div class="el-loading-mask"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div>
                </div>`);
                _this.infoWindow.open(_this.mapObject, e.target.getPosition());
                _this.$axios.post('BMPlatServers/common/querybuildinfos',_this.$qs.stringify({building_id: e.target.obj_info.Id})).then((res)=> {// e.target.obj_info.Id
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
                        _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 250px;height: 200px;justify-content: center;text-align: center">
                            <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                        </div>`);
                        _this.$message.warning(res.data.resultMessage)
                    }
                })
            }
        },
        // 返回中心点
        goBackCenter() {
            this.mapObject.setZoomAndCenter(16,this.centerPoint?this.centerPoint:[116.793115,36.537992]);
        }
    },
    mounted() {
        console.log(this.$refs.tabs)
        // console.log(this.$router)
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
        var map = new AMap.Map('container000', {
	        zoom: 18,//级别
            expandZoomRange:true,
	        center: [116.800422,36.501566],//中心点坐标
	        zooms: [16, 20]
        });
        _this.mapObject = map;
        _this.$axios.post(`BMPlatServers/config/querymapinfo`,_this.$qs.stringify({ 'name': 'warm' }))
            .then(res=> {
                if(res.data.success) {
                    let waterArr = {
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
                        _this.centerPoint = centerCoord;
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
                        offset: new AMap.Pixel(-15, -30)
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
                // var polyline = new AMap.Polyline({
                //     path: lineArr,          //设置线覆盖物路径
                //     strokeColor: "#f00", //线颜色
                //     strokeWeight: 8,        //线宽
                //     strokeStyle: "solid",   //线样式
                //     borderWeight: 3,
                //     outlineColor: '#ffeeff',
                //     lineJoin: 'round',
                //     lineCap: 'round',
                //     showDir:true
                // });
                // _this.mapObject.add(polyline);
                _this.mapLoading = false;
            }else{
                _this.mapLoading = false;
                this.$message.warning(res.data.resultMessage)
            }
        })
    },
    components: {
        'v-energyDistribution': energyDistribution,
        'v-historyEnegy': historyEnegy,
		'v-energyEfficiencyRatio':energyEfficiencyRatio
    },
    destroyed() {
        if(this.mapObject){
            this.mapObject.destroy();
        }
    },
}
</script>

<style lang="scss" scoped>
#EnergySchool{
    height: 100%;
    position: relative;
    // .linePadding{
        .el-tabs{
            width: 98%;
            margin: 20px auto 20px;
            position: absolute;
            right: 0;
            top: 0;
            left: 0;
            bottom: 0;
            /deep/ .el-tabs__content {
                position: absolute;
                right: 0;
                top: 38px;
                left: 0;
                bottom: 0;
                overflow: auto;
            }
        }
    // }
}
#power {
    height: 100%;
    width: 100%;
    position: relative;
}
#container000 {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}
#power /deep/ .map-mark-info {
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 250px;
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
.map-shade {
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border-radius: .25rem;
    width: 22rem;
    border-width: 0;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 0.75rem 1.25rem;
}
#random-zoom-btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    background-color: transparent;
    background-image: none;
    color: #25A5F7;
    border-color: #25A5F7;
    padding: .25rem .5rem;
    line-height: 1.5;
    border-radius: 1rem;
    -webkit-appearance: button;
    cursor: pointer;
}
</style>
