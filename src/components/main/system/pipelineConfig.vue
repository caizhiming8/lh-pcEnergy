<template>
    <div class="pipe-config" v-loading="fullscreenLoading">
        <div class="config-cont">
            <div class="cont-left">
                <div class="left-cont">
                    <div id="pipeline-map"></div>
                    <div class="map-shade" style="width:24rem">
                        <div class="input-item">
                            <button id="random-zoom-btn" class="btn" @click="goBackCenter">返回中心点</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cont-right">
                <div class="right-tabs">
                    <el-tabs style="width: 100%;" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="水管道" name="first">
                            <el-table
                                :data="creatWaterLineArray2"
                                style="width: 100%">
                                <el-table-column
                                    type="index"
                                    width="50">
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="deleteWaterLie(scope)" type="text" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="暖管道" name="second">
                            <el-switch
                                v-model="waterpoint"
                                active-text="供水线路"
                                inactive-text="回水线路"
                                @change="switchChange"
                                :disabled="currentLineState">
                            </el-switch>
                            <div>&nbsp;</div>
                            <div style="color: blue">回水线路</div>
                            <el-table
                                :data="creatHeatOutLineArray2"
                                style="width: 100%">
                                <el-table-column
                                    type="index"
                                    width="50">
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="deleteHeatOutLie(scope)" type="text" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div>&nbsp;</div>
                            <div style="color: red">供水线路</div>
                            <el-table
                                :data="creatHeatInLineArray2"
                                style="width: 100%">
                                <el-table-column
                                    type="index"
                                    width="50">
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="deleteHeatInLie(scope)" type="text" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="范围" name="thirdly">
                            <el-table
                                :data="creatProjectScopeLineArray2"
                                style="width: 100%">
                                <el-table-column
                                    type="index"
                                    width="50">
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="deleteScopeLie(scope)" type="text" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="中心点" name="fourthly">
                            <el-table
                                :data="creatCentralPoint2"
                                style="width: 100%">
                                <el-table-column
                                    type="index"
                                    width="50">
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="deleteCenterlPoint(scope)" type="text" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            mapObject: null,
            activeName: 'first',
            // 进水还是回水
            waterpoint: false,
            // 1 添加水管线 2 添加暖管线 3 添加范围线 4 添加中心点
            addPipeModel: 1,
            pipeColor: '#3366FF', // 供水的颜色 #3366FF, 供暖的颜色 #ff6600;
            // 水管线的总数组
            creatWaterLineArray: [],
            creatWaterLineArray2: [],
            
            // 一条水管线的临时数组
            cur_waterLineArray: [],
            // 进水-暖管线的总数组
            creatHeatInLineArray: [],
            creatHeatInLineArray2: [],
            // 进水-一条暖管线的临时数组
            cur_heatInLineArray: [],
            // 回水-暖管线的总数组
            creatHeatOutLineArray: [],
            creatHeatOutLineArray2: [],
            // 回水-一条暖管线的临时数组
            cur_heatOutLineArray: [],

            // 项目范围线
            creatProjectScopeLineArray: [],
            creatProjectScopeLineArray2: [],
            cur_ProjectScopeLineArray: [],

            // 中心点-位置
            creatCentralPoint: [],
            creatCentralPoint2: [],

            currentLineState: false,
            responseWaterArr: {},

            // 加载中
            fullscreenLoading: false
        }
    },
    methods: {
        goBackCenter() {
            this.mapObject.setZoomAndCenter(16,this.creatCentralPoint.length>0?this.creatCentralPoint[0]:[116.793115,36.537992]);
        },
        handleClick(tab, event) {
            this.waterpoint = false;
            this.switchChange(false);
            if(tab.paneName == "first") {
                this.addPipeModel = 1;
            } else if(tab.paneName == "second") {
                this.addPipeModel = 2;
            } else if(tab.paneName == "thirdly") {
                this.addPipeModel = 3;
            } else {
                this.addPipeModel = 4;
                this.mapMouseToolObj.marker({
                //同Marker的Option设置
                });
            }
        },
        // 供水回水switch切换
        switchChange(e) {
            let _this = this;
            if(e) {
                this.pipeColor = '#ff6600';
            }else {
                this.pipeColor = '#3366FF';
            }
            _this.mapMouseToolObj.polyline({
                lineJoin: 'round',
                lineCap: 'round',
                strokeWeight: 3,
                showDir: true,
                strokeColor: this.pipeColor,
                strokeStyle:"solid",
                showDir: true,
            });
        },
        // 添加管线的接口
        goAddPipeLineEvent() {
            let _this = this;
            if(_this.activeName == 'first') {
                if(_this.creatWaterLineArray.length==0) {
                    return;
                }
                // 调用添加水管道的接口
                let a = {
                    name: 'water',
                    type: 0,
                    content: JSON.stringify(_this.creatWaterLineArray)
                }
                _this.fullscreenLoading = true;
                _this.$axios.post(`BMPlatServers/config/addmapinfo`,_this.$qs.stringify(a))
					.then(res=> {
						if(res.data.success) {
                            _this.goGetMysqlLineData();
                            _this.$message.success({
								message: res.data.result,
								showClose: true,
								duration: 1000,
                            });
						}else{
                            _this.fullscreenLoading = false;
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
            } else if(_this.activeName == "second") {
                if(_this.creatHeatInLineArray.length==0) {
                    return;
                }
                // 调用添加水管道的接口
                let a = {
                    name: 'warm',
                    type: 0,
                    content: JSON.stringify(_this.creatHeatInLineArray)
                }
                _this.fullscreenLoading = true;
                _this.$axios.post(`BMPlatServers/config/addmapinfo`,_this.$qs.stringify(a))
                    .then(res=> {
                        if(res.data.success) {
                            _this.goGetMysqlLineData();
                            _this.$message.success({
                                message: res.data.result,
                                showClose: true,
                                duration: 1000,
                            });
                        }else{
                            _this.fullscreenLoading = false;
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
                // 调用添加暖管道的接口
            } else if(_this.activeName == "thirdly") {
                // 调用添加范围管道的接口
                if(_this.creatProjectScopeLineArray.length==0) {
                    return;
                }
                let a = {
                    name: 'scope',
                    type: 0,
                    content: JSON.stringify(_this.creatProjectScopeLineArray)
                }
                _this.fullscreenLoading = true;
                _this.$axios.post(`BMPlatServers/config/addmapinfo`,_this.$qs.stringify(a))
                    .then(res=> {
                        if(res.data.success) {
                            _this.goGetMysqlLineData();
                            _this.$message.success({
                                message: res.data.result,
                                showClose: true,
                                duration: 1000,
                            });
                        }else{
                            _this.fullscreenLoading = false;
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
            } else {
                if(_this.creatCentralPoint.length==0) {
                    return;
                }
                let a = {
                    name: 'center',
                    type: 0,
                    content: JSON.stringify(_this.creatCentralPoint)
                }
                _this.fullscreenLoading = true;
                _this.$axios.post(`BMPlatServers/config/addmapinfo`,_this.$qs.stringify(a))
                    .then(res=> {
                        if(res.data.success) {
                            _this.goGetMysqlLineData();
                            _this.$message.success({
                                message: res.data.result,
                                showClose: true,
                                duration: 1000,
                            });
                        }else{
                            _this.fullscreenLoading = false;
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
            }
            _this.goGetMysqlLineData();
        },
        // 添加暖出水管道
        goAddPipeLineEvent2() {
            let _this = this;
            if(_this.creatHeatOutLineArray.length==0) {
                return;
            }
            // 调用添加水管道的接口
            _this.fullscreenLoading = true;
            let a = {
                name: 'warm',
                type: 1,
                content: JSON.stringify(_this.creatHeatOutLineArray)
            }
            _this.$axios.post(`BMPlatServers/config/addmapinfo`,_this.$qs.stringify(a))
                .then(res=> {
                    if(res.data.success) {
                        _this.goGetMysqlLineData();
                        _this.$message.success({
                            message: res.data.result,
                            showClose: true,
                            duration: 1000,
                        });
                    }else{
                        _this.fullscreenLoading = false;
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
        },
        // 删除水的管线
        deleteWaterLie(e) {
            let _this = this;
            console.log(JSON.parse(_this.responseWaterArr.water.content)[e.$index])
            this.mapObject.remove([e.row]);
            this.creatWaterLineArray.splice(e.$index,1);
            this.creatWaterLineArray2.splice(e.$index,1);
            _this.updateWaterLie('water');
        },
        // 修改管线的接口
        updateWaterLie(e) {
            let _this = this;
            let a = {
                'id': '',
                'content': ''
            }
            a.id = _this.responseWaterArr[e].id;
            if(e == 'water') {
                a.content = _this.creatWaterLineArray;
            } else if (e == 'warm1') {
                a.content = _this.creatHeatInLineArray;
            } else if (e == 'warm2') {
                a.content = _this.creatHeatOutLineArray;
            } else if (e == 'scope') {
                a.content = _this.creatProjectScopeLineArray;
            } else {
                a.content = _this.creatCentralPoint;
            }
            _this.fullscreenLoading = true;
            _this.$axios.post(`BMPlatServers/config/updatemapinfo`,_this.$qs.stringify({ 'id': a.id, 'content': JSON.stringify(a.content)}))
                .then(res=> {
                    if(res.data.success) {
                        _this.fullscreenLoading = false;
                        _this.$message.success({
                            message: res.data.result,
                            showClose: true,
                            duration: 1000,
                        });
                    }else{
                        _this.fullscreenLoading = false;
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
        },
        // 进水-删除暖管线
        deleteHeatInLie(e) {
            this.mapObject.remove([e.row]);
            this.creatHeatInLineArray.splice(e.$index,1);
            this.creatHeatInLineArray2.splice(e.$index,1);
            this.updateWaterLie('warm1');
        },
        // 回水-删除暖管线
        deleteHeatOutLie(e) {
            this.mapObject.remove([e.row]);
            this.creatHeatOutLineArray.splice(e.$index,1);
            this.creatHeatOutLineArray2.splice(e.$index,1);
            this.updateWaterLie('warm2');
        },
        // 范围线-删除
        deleteScopeLie(e) {
            this.mapObject.remove([e.row]);
            this.creatProjectScopeLineArray.splice(e.$index,1);
            this.creatProjectScopeLineArray2.splice(e.$index,1);
            this.updateWaterLie('scope');
        },
        // 中心点-删除
        deleteCenterlPoint(e) {
            this.mapObject.remove([e.row]);
            this.creatCentralPoint = [];
            this.creatCentralPoint2 = [];
            this.updateWaterLie('center');
        },
        // 获取数据库的数据
        goGetMysqlLineData(e) {
            let _this = this;
            _this.fullscreenLoading = true;
            const waterPromise = new Promise(rej=> {
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
                            if(e) {
                                if(waterArr.center) {
                                    let centerCoord = JSON.parse(waterArr.center.content)[0];
                                    _this.mapObject.setZoomAndCenter(16,centerCoord);
                                    let marker = new AMap.Marker({
                                        position: centerCoord
                                    });
                                    marker.setMap(_this.mapObject);
                                    _this.creatCentralPoint = [centerCoord];
                                    _this.creatCentralPoint2 = [marker]
                                }
                                if(waterArr.water) {
                                    let ccc = waterArr.water.content;
                                    let ddd = JSON.parse(ccc);
                                    let aaa = JSON.parse(waterArr.water.content);
                                    aaa.forEach((item1,index)=> {
                                        let lineRange = new AMap.Polyline({
                                            path: item1,
                                            strokeColor: "#3366FF",
                                            borderWeight: 3,
                                            lineCap: 'round'
                                        })
                                        _this.mapObject.add(lineRange);
                                        _this.creatWaterLineArray.push(ddd[index]);
                                        _this.creatWaterLineArray2.push(lineRange);
                                    })
                                }
                                if(waterArr.scope) {
                                    let ccc = waterArr.scope.content;
                                    let ddd = JSON.parse(ccc);
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
                                        _this.creatProjectScopeLineArray.push(aaa[index]);
                                        _this.creatProjectScopeLineArray2.push(lineRange);
                                    })
                                }
                            }
                            _this.responseWaterArr = waterArr;
                            rej()
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
            })
            waterPromise
                .then(()=> {
                    _this.$axios.post(`BMPlatServers/config/querymapinfo`,_this.$qs.stringify({ 'name': 'warm' }))
                        .then(res=> {
                            if(res.data.success) {
                                let waterArr = {
                                    'warm1': '',
                                    'warm2': ''
                                }
                                res.data.result.list.forEach(item=> {
                                    if(item.name == "warm"&&item.type == 0) {
                                        // 入水
                                        waterArr.warm1 = item;
                                    }else if(item.name == "warm"&&item.type == 1) {
                                        waterArr.warm2 = item;
                                    }
                                })
                                if(e) {
                                    if(waterArr.warm1) {
                                        let ccc = waterArr.warm1.content;
                                        let ddd = JSON.parse(ccc);
                                        let aaa = JSON.parse(waterArr.warm1.content);
                                        aaa.forEach((item,index)=> {
                                            let lineRange = new AMap.Polyline({
                                                path: item,
                                                strokeColor: "#ff6600",
                                                borderWeight: 3,
                                                lineCap: 'round'
                                            })
                                            _this.mapObject.add(lineRange);
                                            _this.creatHeatInLineArray.push(aaa[index]);
                                            _this.creatHeatInLineArray2.push(lineRange);
                                        })
                                    }
                                    if(waterArr.warm2) {
                                        let ccc = waterArr.warm2.content;
                                        let ddd = JSON.parse(ccc);
                                        let aaa = JSON.parse(waterArr.warm2.content);
                                        aaa.forEach((item,index)=> {
                                            let lineRange = new AMap.Polyline({
                                                path: item,
                                                strokeColor: "#3366ff",
                                                borderWeight: 3,
                                                lineCap: 'round'
                                            })
                                            _this.mapObject.add(lineRange);
                                            _this.creatHeatOutLineArray.push(aaa[index]);
                                            _this.creatHeatOutLineArray2.push(lineRange);

                                        })
                                    }
                                }
                                _this.responseWaterArr.warm1 = waterArr.warm1;
                                _this.responseWaterArr.warm2 = waterArr.warm2;
                                _this.fullscreenLoading = false;
                            }else{
                                _this.fullscreenLoading = false;
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
                })
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
        var map = new AMap.Map('pipeline-map', {
	        zoom:16	,
            center: [117.047714,36.667417],
            expandZoomRange:true,
	        zooms: [10, 20],
        });
        _this.mapObject = map;
        _this.goGetMysqlLineData(true);
        var mouseTool = new AMap.MouseTool(map);
        _this.mapMouseToolObj = mouseTool;
        _this.switchChange(false)
        
        _this.mapObject.on('click', function(e) {
            console.log(e.lnglat.getLng()+','+e.lnglat.getLat())
            if(_this.activeName == 'first') {
                _this.cur_waterLineArray.push([e.lnglat.getLng(),e.lnglat.getLat()]);
            } else if(_this.activeName == 'second') {
                if(_this.waterpoint) {
                    // 进水
                    _this.cur_heatInLineArray.push([e.lnglat.getLng(),e.lnglat.getLat()]);
                } else {
                    // 回水
                    _this.cur_heatOutLineArray.push([e.lnglat.getLng(),e.lnglat.getLat()]);
                }
            } else  if(_this.activeName == 'thirdly') {
                _this.cur_ProjectScopeLineArray.push([e.lnglat.getLng(),e.lnglat.getLat()]);
            } else {
                _this.creatCentralPoint = [];
                _this.creatCentralPoint.push([e.lnglat.getLng(),e.lnglat.getLat()]);
            }
        });
        AMap.event.addListener(mouseTool, 'draw', function(e) {
            if(_this.activeName == 'first') {
                if(_this.cur_waterLineArray.length > 1) {
                    console.log(_this.responseWaterArr.water)
                    _this.creatWaterLineArray.push(_this.cur_waterLineArray);
                    _this.creatWaterLineArray2.push(e.obj);
                    if(_this.responseWaterArr.water) {
                        // 修改
                        _this.updateWaterLie('water')
                    }else {
                        // 添加
                        _this.goAddPipeLineEvent()
                    }
                }
                _this.cur_waterLineArray = [];
            } else if(_this.activeName == 'second') {
                if(_this.waterpoint) {
                    // 进水
                    if(_this.cur_heatInLineArray.length > 1) {
                        _this.creatHeatInLineArray.push(_this.cur_heatInLineArray);
                        _this.creatHeatInLineArray2.push(e.obj);
                    }
                    _this.cur_heatInLineArray = [];
                    if(_this.responseWaterArr.warm1) {
                        // 修改
                        _this.updateWaterLie('warm1')
                    }else {
                        // 添加
                        _this.goAddPipeLineEvent()
                    }
                } else {
                    // 回水
                    if(_this.cur_heatOutLineArray.length > 1) {
                        _this.creatHeatOutLineArray.push(_this.cur_heatOutLineArray);
                        _this.creatHeatOutLineArray2.push(e.obj);
                    }
                    _this.cur_heatOutLineArray = [];
                    if(_this.responseWaterArr.warm2) {
                        // 修改
                        _this.updateWaterLie('warm2')
                    }else {
                        // 添加
                        _this.goAddPipeLineEvent2()
                    }
                }
            } else  if(_this.activeName == 'thirdly') {
                // 范围线
                if(_this.cur_ProjectScopeLineArray.length > 1) {
                    _this.creatProjectScopeLineArray.push(_this.cur_ProjectScopeLineArray);
                    _this.creatProjectScopeLineArray2.push(e.obj);
                }
                _this.cur_ProjectScopeLineArray = [];
                if(_this.responseWaterArr.scope) {
                    // 修改
                    _this.updateWaterLie('scope')
                }else {
                    // 添加
                    _this.goAddPipeLineEvent()
                }
            } else {
                if(_this.creatCentralPoint2.length > 0) {
                    // 先删除再添加
                    _this.mapObject.remove(_this.creatCentralPoint2);
                    _this.creatCentralPoint2 = [];
                    _this.creatCentralPoint2.push(e.obj);
                    if(_this.responseWaterArr.center) {
                        // 修改
                        _this.updateWaterLie('center')
                    }else {
                        // 添加
                        _this.goAddPipeLineEvent()
                    }
                } else {
                    // 直接添加
                    _this.creatCentralPoint2.push(e.obj);
                    if(_this.responseWaterArr.center) {
                        // 修改
                        _this.updateWaterLie('center')
                    }else {
                        // 添加
                        _this.goAddPipeLineEvent()
                    }
                }
            }
        });
    },
    destroyed() {
        if(this.mapObject){
            this.mapObject.destroy();
        }
    }
}
</script>
<style lang="scss" scoped>
.pipe-config {
    position: relative;
    width: 100%;
    height: 100%;
    >.config-cont {
        position: absolute;
        left: 10px;
        right: 10px;
        top: 10px;
        bottom: 10px;
        >.cont-left {
            position: relative;
            float: left;
            width: 100%;
            height: 100%;
            >.left-cont {
                margin-right: 310px;
                height: 100%;
                position: relative;
                >#pipeline-map {
                    width: 100%;
                    height: 100%;
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
                    position: absolute;
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
            }
        }
        >.cont-right {
            float: right;
            width: 300px;
            margin-left: -300px;
            height: 100%;
            overflow: auto;
            position: relative;
            /deep/ .el-tabs__nav-scroll {
                justify-content: center;
                display: flex;
            }
            >.right-tabs {
                position: absolute;
                width: 100%;
                top: 0;
                display: flex;
                bottom: 80px;
            }
            >.right-bot {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 60px;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
            }
        }
    }
}
</style>
