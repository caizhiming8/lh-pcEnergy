<template>
    <div id="deviceHeatTransferPump">
        <h6>
            <el-button type="primary" size="small" @click="refresh">刷新</el-button>
        </h6>
        <ul class="deviceHeatTransferPump">
            <li v-for="(item, index) in dataList">
                <div class="innerLi" @click="handleClick(item, index)" :class="currentLi==index?'active':''">
                    <i class="iconfont icon-duihao isOk" v-if="currentLi==index"></i>
                    <div class="innerLi-top">
                        <p :class="currentLi==index ? 'active' : ''">{{item.deviceName}}</p>
                    </div>
                    <div class="innerLi-main">
                        <div class="innerLi-main-bott">
                            <div class="h2">电流： {{item.data2 == undefined ? '-' : item.data2.value}}A</div>
                            <div class="h2">频率： {{item.data1 == undefined ? "-" : item.data1.value}}Hz</div>
                            <div class="h2">启停： {{item.data12 == undefined ? "-" : item.data12.value == 1 ? "启动" : "停止"}}</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <ul class="deviceHeatTransferPump">
            <li v-for="(item, index) in dataList1">
                <div class="innerLi" @click="handleClick1(item, index)" :class="currentLi1==index?'active':''">
                    <i class="iconfont icon-duihao isOk" v-if="currentLi1==index"></i>
                    <div class="innerLi-top">
                        <p :class="currentLi1==index ? 'active' : ''">{{item.deviceName}}</p>
                    </div>
                    <div class="innerLi-main">
                        <div class="innerLi-main-bott">
                            <div class="h2">电流： {{item.data2 == undefined ? '-' : item.data2.value}}A</div>
                            <div class="h2">频率： {{item.data1 == undefined ? "-" : item.data1.value}}Hz</div>
                            <div class="h2">启停： {{item.data12 == undefined ? "-" : item.data12.value == 1 ? "启动" : "停止"}}</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <el-dialog :title="row.deviceName" :visible.sync="dialogVisible" width="40%">
            <div class="dialogMain">
                <div class="tops">
                    <div class="top1">
                        <a>远控模式</a>
                        <span>{{row.data11 == undefined ? "-" : row.data11.value == 0 ? "本地" : "远程"}}</span>
                    </div>
                    <div class="top1">
                        <a>变频模式</a>
                        <span>{{row.data12 == undefined ? "-" : row.data12.value == 0 ? "停止" : "运行"}}</span>
                    </div>
                    <div class="top1">
                        <a>变频故障</a>
                        <span>{{row.data13 == undefined ? "-" : row.data13.value == 0 ? "正常" : "故障"}}</span>
                    </div>
                </div>
                <div class="switchs">
                    <el-switch  v-model="isAuto" active-text="自动" inactive-text="手动" active-color="#409eff" inactive-color="#13CE66"></el-switch>
                </div>
                <div class="dialogMain-bottom">
                    <div class="dialogMain-bottom-right" v-if="isAuto">
                        <p v-for="(item, index) in ulList" @click="isopen(index)" :class="openChange==index?'active':''">
                            <i :class="item.icon"></i>
                            <s :class="openChange==index?'active':''">{{item.name}}</s>
                        </p>
                    </div>
                    <div class="dialogMain-bottom-right" v-if="!isAuto">
                        <p v-for="(item, index) in ulList" @click="isopen1(index)" :class="openChange1==index?'active':''">
                            <i :class="item.icon"></i>
                            <s :class="openChange1==index?'active':''">{{item.name}}</s>
                        </p>
                    </div>
                    <div class="btnRadio">
                        <el-radio-group v-model="radio1" size="small">
                            <el-radio-button label="手动模式"></el-radio-button>
                            <el-radio-button label="自动模式"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="pv">
                        <span class="span3">自动设定</span>
                        <el-input v-model="yacha" class="pinlv"></el-input>MPA
                    </div>
                    <div class="pv">
                        <span class="span3">手动设定</span>
                        <el-input v-model="pinlv" class="pinlv"></el-input>Hz
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="makeSure" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: ["permissions"],
    data() {
        return{
            pulv: '',
            dialogVisible2: false,
            numberPump: 0,
            kaidu: 0,
            buildingId: '',
            dataList: [],
            dataList1: [],
            dialogVisible: false,
            isOpen: true,
            ulList: [{name: '开', icon: 'iconfont icon-shanguangdengdakai'}, {name: '关', icon: 'iconfont icon-tubiaolunkuo-'}],
            currentColoter: 0,
            num: 0,
            pressure: 0,
            row: {data1: {value: ''}, data2: {value: ''}, data7: {value: ''}, data8: {value: ''}, data9: {value: ''}},
            isDisabled: false,
            currentLi: 0,
            currentLi1: 0,
            openChange: 0,
            openChange1: 0,
            allMap: {},
            isAuto: true,
            pinlv: '',
            yacha: '',
            systemId: '',
            subsystemId: '',
            radio1: '手动模式',
            choiceDevice: 0,
            choiceDevice1: 0
        }
    },
    methods: {
        // 循环泵数据
        initData() {
            let data = {
                buildingId: this.buildingId,
                flag: 1,
                systemId: this.systemId,
                subsystemId: this.subsystemId
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryHeatControlDevices`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        this.dataList = [];
                        this.dataList1 = [];
                        res.data.result.list.forEach((item, index)=>{
                            if(item.deviceType == 5) {
                                this.dataList.push(item);
                                if(item.data8.value == 1) {
                                    this.currentLi = index;
                                }
                            }else if(item.deviceType == 20) {
                                this.dataList1.push(item);
                            }
                        })
                        if(this.dataList1 && this.dataList1.length) {
                            this.dataList1.forEach((item, index)=>{
                                if(item.data8.value == 1) {
                                    this.currentLi1 = index;
                                }
                            })
                        }else{
                            this.currentLi1 = -1;
                        }
                        this.$Nprogress.done();
                    }else{
                        this.dataList = [];
                        this.dataList1 = [];
                        this.$Nprogress.done();
                        this.$message.warning({
                            message: '暂无数据',
                            showClose: true,
                            duration: 1000
                        })
                    }
                    this.allMap = res.data.result.allmap;
                }else{
                    this.dataList = [];
                    this.dataList1 = [];
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        refresh() {
            this.$Nprogress.done();
            this.$Nprogress.start();
            let data = {
                buildingId: this.buildingId,
                flag: 1,
                systemId: this.systemId,
                subsystemId: this.subsystemId
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryHeatControlDevices`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        this.dataList = [];
                        this.dataList1 = [];
                        res.data.result.list.forEach((item, index)=>{
                            if(item.deviceType == 5) {
                                this.dataList.push(item);
                                if(item.data8.value == 1) {
                                    this.currentLi = index;
                                }
                            }else if(item.deviceType == 20) {
                                this.dataList1.push(item);
                            }
                        })
                        if(this.dataList1 && this.dataList1.length) {
                            this.dataList1.forEach((item, index)=>{
                                if(item.data8.value == 1) {
                                    this.currentLi1 = index;
                                }
                            })
                        }else{
                            this.currentLi1 = -1;
                        }
                        this.$Nprogress.done();
                    }else{
                        this.dataList = [];
                        this.dataList1 = [];
                        this.allMap = res.data.result.allmap;
                    }


                    if(res.data.result.orderlist && res.data.result.orderlist.length) {
                        this.$message.warning({
                            message: '含有未完成的下控命令',
                            showClose: true,
                            duration: 1000
                        })
                    }else{
                        this.$message.success({
                            message: '刷新成功',
                            showClose: true,
                            duration: 1000
                        })
                    }
                    this.$Nprogress.done();
                }else{
                    this.$Nprogress.done();
                    this.dataList = [];
                    this.dataList1 = [];
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 点击li，把值给模态框
        handleClick(item, i) {
            this.dialogVisible = true;
            this.row = item;
            this.currentLi = i;
            this.isAuto = this.allMap.data7.value == 1 && this.allMap.data8.value == 0 ? false : true;
            this.pinlv = this.allMap.data1.value;
            this.yacha = this.allMap.data2.value;
            this.openChange = this.allMap.data9.value == 1 ? 0 : 1;
            this.openChange1 = item.data9.value == 1 ? 0 : 1;
            this.radio1 = this.allMap.data12.value == 1 ? '手动模式' : '自动模式';

            this.choiceDevice = item.data8.value;
        },
        handleClick1(item, i) {
            this.dialogVisible = true;
            this.row = item;
            this.currentLi1 = i;
            this.isAuto = this.allMap.data19.value == 1 && this.allMap.data20 == 0 ? false : true;
            this.pinlv = this.allMap.data13.value;
            this.yacha = this.allMap.data14.value;
            this.openChange = item.data10.value == 1 ? 0 : 1;
            this.openChange1 = item.data9.value == 1 ? 0 : 1;
            this.radio1 = this.allMap.data24.value == 1 ? '手动模式' : '自动模式';
            this.choiceDevice1 = item.data8.value;
        },
        handleColor(ins) {
            this.currentColoter = ins;
        },

        isopen(i) {
            this.openChange = i;
        },
        isopen1(i) {
            this.openChange1 = i;
        },

        // 提交代码
        makeSure() {
            if(this.permissions == 1) {
                this.open();
            }else{
                this.$message.warning({
                    message: '请先点击权限按钮获取权限',
                    showClose: true,
                    duration: 4000
                })
            }
        },
        // 二次确认提交按钮
        open() {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dialogVisible = false;
                let obj = {data1: {}, data2: {}, data3: {}, data4: {}, data5: {}, data6: {}, data13: {}, data14: {}, data15: {}, data16: {}, data17: {}, data18: {},
                            data10: {}, data11: {}, data22: {}, data23: {}};  // 通配里面的参数
                let listMap = {data5: {}, data6: {}, data7: {}};   // 具体到每个设备的里面的参数
                if(this.row.deviceType == 5) {  // 前三个系统泵
                    // 选择泵
                    if(this.choiceDevice != 1) {
                        listMap.data5.name = this.row.data5.name;
                        listMap.data5.isPulse = this.row.data5.isPulse;
                        listMap.data5.value = 1;
                    }
                    if(this.allMap.data7.value == this.isAuto?1:0) {
                        if(this.isAuto) {
                            obj.data4.name = this.allMap.data4.name;
                            obj.data4.isPulse = this.allMap.data4.isPulse;
                            obj.data4.value = 1   // 开启自动模式
                        }else{
                            obj.data3.name = this.allMap.data3.name;
                            obj.data3.isPulse = this.allMap.data3.isPulse;
                            obj.data3.value = 1   // 开启手动模式
                        }
                    }
                    if(this.isAuto) {   // 自动
                        if(this.openChange == 0) {  // 自动开启
                            if(this.openChange == this.allMap.data9.value) {
                                obj.data5.name = this.allMap.data5.name;
                                obj.data5.isPulse = this.allMap.data5.isPulse;
                                obj.data5.value = 1;
                            }
                        }else{   //自动关闭
                            if(this.openChange == this.allMap.data9.value) {
                                obj.data6.name = this.allMap.data6.name;
                                obj.data6.isPulse = this.allMap.data6.isPulse;
                                obj.data6.value = 1;
                            }
                        }
                    }else{    // 手动
                        if(this.openChange1 == 0) {  // 手动开启
                            if(this.openChange1 == this.row.data9.value) {
                                listMap.data6.name = this.row.data6.name;
                                listMap.data6.isPulse = this.row.data6.isPulse;
                                listMap.data6.value = 1;
                            }
                        }else{   // 手动关闭
                            if(this.openChange1 == this.row.data9.value) {
                                listMap.data7.name = this.row.data7.name;
                                listMap.data7.isPulse = this.row.data7.isPulse;
                                listMap.data7.value = 1;
                            }
                        }
                    }
                    if(this.radio1 != (this.allMap.data12.value==0?'自动模式':'手动模式')) {
                        if(this.radio1 == '自动模式') {
                            obj.data11.name = this.allMap.data11.name;
                            obj.data11.isPulse = this.allMap.data11.isPulse;
                            obj.data11.value = 1;
                        }else if(this.radio1 == '手动模式') {
                            obj.data10.name = this.allMap.data10.name;
                            obj.data10.isPulse = this.allMap.data10.isPulse;
                            obj.data10.value = 1;
                        }
                    }
                    if(this.allMap.data2.value != this.yacha) {
                        obj.data2.name = this.allMap.data2.name;
                        obj.data2.isPulse = this.allMap.data2.isPulse;
                        obj.data2.value = this.yacha;   // 自动控制下的压差
                    }

                    if(this.allMap.data1.value != this.pinlv) {
                        obj.data1.name = this.allMap.data1.name;
                        obj.data1.isPulse = this.allMap.data1.isPulse;
                        obj.data1.value = this.pinlv;
                    }
                }else if(this.row.deviceType == 20) {   //后三个主机泵
                    // 选择泵
                    if(this.choiceDevice1 != 1) {
                        listMap.data5.name = this.row.data5.name;
                        listMap.data5.isPulse = this.row.data5.isPulse;
                        listMap.data5.value = 1;
                    }
                    if(this.isAuto?0:1 == this.allMap.data19.value) {
                        if(this.isAuto) {
                            obj.data16.name = this.allMap.data16.name;
                            obj.data16.isPulse = this.allMap.data16.isPulse;
                            obj.data16.value = 1;
                        }else{
                            obj.data15.name = this.allMap.data15.name;
                            obj.data15.isPulse = this.allMap.data15.isPulse;
                            obj.data15.value = 1;
                        }
                    }
                    if(this.isAuto) {   // 自动
                        if(this.openChange == 0) {  // 自动开启
                            if(this.openChange == this.row.data10.value) {
                                obj.data17.value = 1;
                                obj.data17.name = this.allMap.data17.name;
                                obj.data17.isPulse = this.allMap.data17.isPulse;
                            }
                        }else{  // 自动关闭
                            if(this.openChange == this.row.data10.value) {
                                obj.data18.value = 1;
                                obj.data18.name = this.allMap.data18.name;
                                obj.data18.isPulse = this.allMap.data18.isPulse;
                            }
                        }
                    }else{  // 手动
                        if(this.openChange1 == 0) {   // 手动开启
                            if(this.openChange1 == this.row.data9.value) {
                                listMap.data6.value = 1;
                                listMap.data6.name = this.row.data6.name;
                                listMap.data6.isPulse = this.row.data6.isPulse;
                            }
                        }else{ // 手动停止
                            if(this.openChange1 == this.row.data9.value) {
                                listMap.data7.value = 1;
                                listMap.data7.name = this.row.data7.name;
                                listMap.data7.isPulse = this.row.data7.isPulse;
                            }
                        }
                    }
                    if(this.radio1 == (this.allMap.data24.value == 0?'手动模式':'自动模式')) {
                        if(this.radio1 == '手动模式') {
                            obj.data22.value = 1;
                            obj.data22.name = this.allMap.data22.name;
                            obj.data22.isPulse = this.allMap.data22.isPulse;
                        }else if(this.radio1 == '自动模式') {
                            obj.data23.value = 1;
                            obj.data23.name = this.allMap.data23.name;
                            obj.data23.isPulse = this.allMap.data23.isPulse;
                        }
                    }
                    if(this.yacha != this.allMap.data14.value) {
                        obj.data14.value = this.yacha;
                        obj.data14.name = this.allMap.data14.name;
                        obj.data14.isPulse = this.allMap.data14.isPulse;
                    }
                    if(this.pinlv != this.allMap.data13.value) {
                        obj.data13.value = this.pinlv;
                        obj.data13.name = this.allMap.data13.name;
                        obj.data13.isPulse = this.allMap.data13.isPulse;
                    }
                }
                for(let key in obj) {
                    if(obj[key].value == undefined) {
                        delete obj[key];
                    }
                }
                for(let key in listMap) {
                    if(listMap[key].value == undefined) {
                        delete listMap[key];
                    }
                }
                obj.buildingId = this.allMap.buildingId;
                obj.deviceId = this.allMap.deviceId;
                obj.floorId = this.allMap.floorId;
                obj.roomId = this.allMap.roomId;
                listMap.buildingId = this.row.buildingId;
                listMap.deviceType = this.row.deviceType;
                listMap.floorId = this.row.floorId;
                listMap.roomId = this.row.roomId;
                listMap.deviceId = this.row.deviceId;
                let datas = {
                    map: JSON.stringify(listMap),
                    allmap: JSON.stringify(obj)
                };
                this.$axios.post(`BMPlatServers/hvacheat/commitAllControl`, this.$qs.stringify(datas)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
                            message: '修改成功',
                            showClose: true,
                            duration: 1000
                        })
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            })
        },

        data1() {
            this.pulv = (""+this.pulv).replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g,".", '.').replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        }
    },
    mounted() {
        this.$Nprogress.start();
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.initData();
    },
    beforeDestroy() {
        this.$Nprogress.done();
    },
    watch: {
        $route(to, from) {
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
            this.initData();
        },
        pressure() {
            this.pressure = (''+this.pressure).replace(/[^\d^\.]+/g, '');
        },
        currentColoter(newData) {
            if(newData == 1) {
                this.isDisabled = true;
                this.num = 0;
            }else{
                this.isDisabled = false;
                this.num = this.row.data1.value;
            }
        }
    }
}
</script>

<style lang="scss">
#deviceHeatTransferPump{
    // position: relative;
    h6{
        position: absolute;
        right: 15px;
        top: 20px;
    }
    ul.deviceHeatTransferPump{
        overflow: hidden;
        li{
            float: left;
            display: block;
            width: 16.6%;
            padding: 15px 8px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -ms-box-sizing: border-box;
            -o-box-sizing: border-box;
            box-sizing: border-box;
            .innerLi{
                border: 1px solid #ddd;
                height: 200px;
                position: relative;
                cursor: pointer;
                transition: border .5s;
                position: relative;
                overflow: hidden;
                .isOk{
                    position: absolute;
                    right: 6px;
                    top: 7px;
                    z-index: 10;
                    background: #fff;
                    border-radius: 50%;
                    color: #40FF07;
                    padding-right: 1px;
                }
                // /deep/ .iconfont{
                //     font-size: 24px !important;
                // }
                &.active{
                    border: 3px solid #40FF07;
                    margin-left: -1px;
                    margin-top: -1px;
                }
                .innerLi-top{
                    overflow: hidden;
                    p{
                        height: 40px;
                        text-align: center;
                        line-height: 40px;
                        color: #282828;
                        font-size: 16px;
                        background: #F6F6F6;
                    }
                    p.active{
                        background: #40FF07;
                        color: #fff;
                    }
                }
                .innerLi-main{
                    background: #ECECEC;
                    padding-top: 5px;
                    height: 160px;
                    overflow: hidden;
                    p{
                        margin-top: 10px;
                        font-size: 16px;
                        font-weight: bold;
                        text-align: center;
                    }
                    .innerLi-main-bott{
                        overflow: hidden;
                        padding-left: 10px;
                        padding-top: 6px;
                        .h2{
                            font-weight: normal;
                            font-size: 14px;
                            color: #656565;
                            margin: 10px 0;
                        }
                    }
                    .pox{
                        padding-top: 35px;
                        text-align: center;
                        position: relative;
                        span{
                            padding: 0px 12px;
                            border-radius: 2px;
                        }
                        .span1{
                            background: #409eff;
                            color: #fff;
                            position: absolute;
                            left: 30px;
                        }
                        .span2{
                            background: #666;
                            color: #fff;
                            position: absolute;
                            right: 30px;
                        }
                    }
                }
            }
        }
    }
    .dialogMain{
        .tops{
            padding: 0 15px;
            .top1{
                margin-bottom: 10px;
                a{
                    display: inline-block;
                }
                span{
                    display: inline-block;
                    margin-left: 15px;
                }
            }
        }
        .switchs{
            text-align: right;
            padding-bottom: 20px;
        }
        .dialogMain-bottom{
            background: #DDDDDD;
            border-radius: 3px;
            padding: 10px 0;
            .dialogMain-bottom-right{
                padding-left: 20px;
                padding-top: 20px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                overflow: hidden;
                padding-bottom: 20px;
                border-bottom: 2px dashed #656565;
                p{
                    float: left;
                    width: 50%;
                    cursor: pointer;
                    text-align: center;
                    s{
                        display: block;
                    }
                    s.active{
                        color: #409eff;
                    }
                    i{
                        display: block;
                    }
                }
                p.active{
                    color: #409eff;
                }
                .el-input{
                    width: 97%;
                    margin-top: 20px;
                }
            }
            .btnRadio{
                text-align: center;
                margin-top: 20px;
            }
            .pv{
                text-align: center;
                padding-top: 20px;
                .span3{
                    display: inline-block;
                }
                .pinlv{
                    width: 60%;
                    min-width: 120px;
                    display: inline-block;
                }
            }
        }
    }

    // /deep/ .el-dialog__header{
    //     border-bottom: 1px solid #ddd;
    // }

}
</style>
