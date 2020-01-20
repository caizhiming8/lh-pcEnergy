<template>
    <div id="heatSupplyNetworkControlRealPicture" :style="{'height': divHeight}">
        <div id="real_heat_map"></div>
        <div class="map-shade" style="width:24rem">
            <div class="input-item">
                <button id="random-zoom-btn" class="btn" @click="goBackCenter">返回中心点</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mapLoading: false,
            mapObject: null,
            infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}),
            divHeight: 0,
            centerPoint: ''
        }
    },
    methods: {
        markerClick(e) {
            let _this = this;
            if(e.target.obj_info) {
                _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 200px;height: 300px;justify-content: center;text-align: center;display: flex;flex-direction: column;">
                    <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                    <div class="el-loading-mask"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div>
                </div>`);
                _this.infoWindow.open(this.mapObject, e.target.getPosition());
                let a = e.target.obj_info;
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
        // 返回中心点
        goBackCenter() {
            this.mapObject.setZoomAndCenter(16,this.centerPoint?this.centerPoint:[116.793115,36.537992]);
        }
    },
    mounted() {
        let heightLeft = document.documentElement.clientHeight || document.body.clientHeight;
        this.divHeight = heightLeft - 190 + "px";
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
        var map = new AMap.Map('real_heat_map', {
	        zoom: 18,//级别
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
    destroyed() {
        if(this.mapObject){
            this.mapObject.destroy();
        }
    },
}
</script>

<style lang="scss" scoped>
    #heatSupplyNetworkControlRealPicture {
        width: 100%;
        height: 100%;
        position: relative;
        height: 500px;
    }
    #real_heat_map {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
    }
    #heatSupplyNetworkControlRealPicture
        /deep/ .map-mark-info {
            display: flex;
            width: 300px;
            flex-direction: column;
            max-height: 500px;
            overflow: auto;
            padding: 10px;
            .info-list {
                display: flex;
                line-height: 30px;
                align-items: center;
                .list-tit {
                    display: flex;
                    flex: 1;
                    justify-content: flex-end;
                    margin-right: 10px;
                    font-weight: 600;
                }
                .list-info {
                    width: 70px;
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
