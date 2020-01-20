<template>
    <div id="water" v-loading="mapLoading">
        <div id="container111"></div>
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
            infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})
        }
    },
    methods: {
        markerClick(e) {
            let _this = this;
            if(e.target.obj_info) {
                _this.infoWindow.setContent(`<div class="map-mark-info" style="width: 150px;height: 200px;justify-content: center;text-align: center">
                    <div style="font-weight: 800;font-size: 18px">暂无信息</div>
                    <div class="el-loading-mask"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div>
                </div>`);
                _this.infoWindow.open(this.mapObject, e.target.getPosition());
                _this.$axios.post('BMPlatServers/water/queryBuildingRealtime',this.$qs.stringify({buildingId: e.target.obj_info.Id})).then((res)=> {
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
                            <div class="info-list info-list2"><a href="#/waterTower">查看详情</a></div>
                        </div>`)
                    }else{
                        _this.mapLoading = false;
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            }
        },
        goBackCenter() {
            this.mapObject.setZoomAndCenter(16,[116.800422,36.501566]);
        }
    },
    destroyed() {
        if(this.mapObject){
            this.mapObject.destroy();
        }
    },
    mounted() {
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
        var map = new AMap.Map('container111', {
	        zoom:16	,
	        center: [116.800422,36.501566],
	        zooms: [16, 18],
        });
        _this.mapObject = map;
        _this.$axios.post('BMPlatServers/common/queryBuildingsInfo').then((res)=> {
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
                        offset: new AMap.Pixel(-15, -30)
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
    }
}
</script>

<style lang="scss" scoped>
    #water {
        height: 100%;
        width: 100%;
        position: relative;
    }
    #container111 {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
    }
    #water /deep/ .map-mark-info {
        display: flex;
        flex-direction: column;
        padding: 10px;
        .info-list {
            display: flex;
            height: 30px;
            align-items: center;
            .list-tit {
                display: flex;
                width: 80px;
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
