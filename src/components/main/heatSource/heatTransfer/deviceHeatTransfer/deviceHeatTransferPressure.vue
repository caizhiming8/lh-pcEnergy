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
                            <el-tooltip class="item" effect="dark" :content="item.dataheat3 == undefined ? '-' : Number(item.dataheat3.value).toFixed(2)+'PMA'" placement="right">
                                <h2 class="h2">二次供水压力： {{item.dataheat3 == undefined ? '-' : Number(item.dataheat3.value).toFixed(2)}}PMA</h2>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="item.dataheat4 == undefined ? '-' : Number(item.dataheat4.value).toFixed(2)+'PMA'" placement="right">
                                <h2 class="h2">二次回水压力： {{item.dataheat4 == undefined ? '-' : Number(item.dataheat4.value).toFixed(2)}}PMA</h2>
                            </el-tooltip>
                            <h2 class="h2">频率： {{item.data8 == undefined ? '-' : item.data8.value}}Hz</h2>
                            <h2 class="h2">电流： {{item.data11 == undefined ? '-' : item.data11.value}}A</h2>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <el-dialog :title="row.deviceName" :visible.sync="dialogVisible" width="40%">
            <div class="dialogMain">
                <div class="displays">
                    <ul class="ul5">
                        <li>
                            <span>远控模式</span>
                            <a>{{row.data9==undefined?"-":row.data9.value==1? "远程" : "本地"}}</a>
                        </li>
                        <li>
                            <span>变频模式</span>
                            <a>{{row.data10==undefined?"-":row.data10.value==1? "运行" : "停止"}}</a>
                        </li>
                        <li>
                            <span>变频故障</span>
                            <a>{{row.data2==undefined?"-":row.data2.value==0? "正常" : "故障"}}</a>
                        </li>
                    </ul>
                    <div class="outLi">
                        <li class="li1">
                            <span>频率设定</span>
                            <el-input v-model="pinlv"></el-input>Hz
                        </li>
                    </div>
                </div>
                <div class="dialogMain-bottom">
                    <div class="dialogMain-bottom-right">
                        <div class="isAuto">
                            <el-switch  v-model="isAuto" active-text="自动" inactive-text="手动" active-color="#409eff" inactive-color="#13CE66"></el-switch>
                        </div>
                        <div class="pOuter" v-if="isAuto">
                            <p v-for="(item, index) in ulList" @click="isopen(index)" :class="openChange==index?'active':''">
                                <i :class="item.icon"></i>
                                <s :class="openChange==index?'active':''">{{item.name}}</s>
                            </p>
                        </div>
                        <div class="pOuter" v-if="!isAuto">
                            <p v-for="(item, index) in ulList" @click="isopen1(index)" :class="openChange1==index?'active':''">
                                <i :class="item.icon"></i>
                                <s :class="openChange1==index?'active':''">{{item.name}}</s>
                            </p>
                        </div>
                        <div class="btn">
                            <ol class="ol5">
                                <li class="li5" v-for="(item, index) in ol5List" @click="autoClick(index)" :class="autoIndex==index?'active':''">{{item.name}}</li>
                            </ol>
                        </div>
                        <ul class="dialogBottom">
                            <li class="li1">
                                <span>补水下限</span>
                                <el-input v-model="xiaxian" :disabled="isdisabled"></el-input>MPA
                            </li>
                            <li class="li1">
                                <span>补水上限</span>
                                <el-input v-model="shangxian" :disabled="isdisabled"></el-input>MPA
                            </li>
                        </ul>
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
    props: ['permissions'],
    data() {
        return{
            ol5List: [{name: '自动补水允许'}, {name: '自动补水禁止'}],
            isAuto: true,
            pulv: '',
            dialogVisible2: false,
            numberPump: 0,
            kaidu: 0,
            buildingId: '',
            dataList: [],
            dialogVisible: false,
            isOpen: true,
            ulList: [{name: '开', icon: 'iconfont icon-shanguangdengdakai'}, {name: '关', icon: 'iconfont icon-tubiaolunkuo-'}],
            currentColoter: 0,
            num: 0,
            pressure: 0,
            row: {data1: {value: ''}, data2: {value: ''}, data7: {value: ''}, data8: {value: ''}, data9: {value: ''}},
            isDisabled: false,
            currentLi: -1,
            openChange: 0,
            openChange1: 0,
            openChangeAuto: 0,
            allMap: {},
            autoIndex: 0,
            pinlv: '',
            xiaxian: '',
            shangxian: '',
            isdisabled: false,
            systemId: '',
            subsystemId: '',
            chioceDevice: 0
        }
    },
    methods: {
        // 循环泵数据
        initData() {
            let data = {
                buildingId: this.buildingId,
                flag: 3,
                systemId: this.systemId,
                subsystemId: this.subsystemId
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryHeatControlDevices`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.blist && res.data.result.blist.length) {
                        this.dataList = res.data.result.blist;
                        this.$Nprogress.done();

                        // 做选泵页面上来的时候亮起
                        let arr = res.data.result.blist;
                        for(let i=0; i<arr.length; i++) {
                            if(arr[i].data6.value == 1) {
                                this.currentLi = i;
                                break;
                            }
                        }
                    }else{
                        this.dataList = [];
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
                flag: 3,
                systemId: this.systemId,
                subsystemId: this.subsystemId
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryHeatControlDevices`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.blist && res.data.result.blist.length) {
                        this.dataList = res.data.result.blist;
                    }else{
                        this.dataList = [];
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
            // allMap.data8  手动    allMap.data9   自动
            this.isAuto = this.allMap.data8.value == 1 && this.allMap.data9.value == 0 ? false: true;
            this.openChange = this.allMap.data10.value == 1 ? 0 : 1;
            this.openChange1 = item.data7.value == 1 ? 0 : 1;
            this.openChangeAuto = this.allMap.data10.value == 1? 0 : 1;
            this.autoIndex = this.allMap.data13.value == 1 ? 0 : 1;
            this.pinlv = item.data8.value;
            this.xiaxian = this.allMap.data2.value;
            this.shangxian = this.allMap.data3.value;
            // 下控设备
            this.chioceDevice = item.data6.value;
        },

        // 自动补水允许禁止按钮点击变色
        autoClick(i) {
            this.autoIndex = i;
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
        isopenAuto(i) {
            this.openChangeAuto = i;
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
                // list里面的
                let obj = {data3: {}, data4: {}, data5: {}};
                // allMap里面的参数
                let objAll = {data1: {}, data2: {}, data3: {}, data4: {}, data5: {}, data6: {}, data7: {}, data11: {}, data12: {}};
                // 选择设备
                if(this.chioceDevice == 0) {
                    obj.data3.name = this.row.data3.name  // 选择泵
                    obj.data3.value = 1;
                    obj.data3.isPulse = this.row.data3.isPulse;
                }
                if(this.row.data8.value != this.pinlv) {
                    objAll.data1.value = this.pinlv;
                    objAll.data1.name = this.allMap.data1.name;
                    objAll.data1.isPulse = this.allMap.data1.isPulse;
                }
                if(this.isAuto ? 1 : 0 == this.allMap.data8.value) {
                    if(this.isAuto) {
                        objAll.data5.name = this.allMap.data5.name;
                        objAll.data5.value = 1;
                        objAll.data5.isPulse = this.allMap.data5.isPulse;
                    }else{
                        objAll.data4.name = this.allMap.data4.name;;
                        objAll.data4.value = 1;
                        objAll.data4.isPulse = this.allMap.data4.isPulse;
                    }
                }
                if(this.isAuto) {  // 自动
                    if(this.openChange == 0) {  // 开
                        if(this.openChange == this.allMap.data10.value) {
                            objAll.data6.value = 1;
                            objAll.data6.name = this.allMap.data6.name;
                            objAll.data6.isPulse = this.allMap.data6.isPulse;
                        }
                    }else{  // 关
                        if(this.openChange == this.allMap.data10.value) {
                            objAll.data7.value = 1;
                            objAll.data7.name = this.allMap.data7.name;
                            objAll.data7.isPulse = this.allMap.data7.isPulse;
                        }
                    }
                }else{   // 手动
                    if(this.openChange1 == 0) {
                        if(this.openChange1 == this.row.data7.value) {
                            obj.data4.name = this.row.data4.name  // 启动
                            obj.data4.value = 1;
                            obj.data4.isPulse = this.row.data4.isPulse;
                        }
                    }else{
                        if(this.openChange1 == this.row.data7.value) {
                            obj.data5.name = this.row.data5.name;  //  停止
                            obj.data5.value = 1;
                            obj.data5.isPulse = this.row.data5.isPulse;
                        }
                    }
                }
                // allMal.data11  允许    allMap.data12   禁止
                if(this.autoIndex == 0) {   // 自动补水允许
                    if(this.autoIndex == this.allMap.data13.value) {
                        objAll.data11.value = 1;
                        objAll.data11.name = this.allMap.data11.name;
                        objAll.data11.isPulse = this.allMap.data11.isPulse;
                    }
                    // 下限allMap.data2    上线  allMap.data3
                    if(this.allMap.data2.value != this.xiaxian) {
                        objAll.data2.name = this.allMap.data2.name;
                        objAll.data2.value = this.xiaxian;
                        objAll.data2.isPulse = this.allMap.data2.isPulse;
                    }
                    if(this.allMap.data3.value != this.shangxian) {
                        objAll.data3.name = this.allMap.data3.name;
                        objAll.data3.value = this.shangxian;
                        objAll.data3.isPulse = this.allMap.data3.isPulse;
                    }
                }else{   // 自动补水禁止
                    if(this.autoIndex == this.allMap.data13.value) {
                        objAll.data12.value = 1;
                        objAll.data12.name = this.allMap.data12.name;
                        objAll.data12.isPulse = this.allMap.data12.isPulse;
                    }
                }
                for(let key in obj) {
                    if(obj[key].value == undefined) {
                        delete obj[key];
                    }
                }
                for(let key in objAll) {
                    if(objAll[key].value == undefined) {
                        delete objAll[key];
                    }
                }
                obj.buildingId = this.row.buildingId;
                obj.deviceId = this.row.deviceId;
                obj.floorId = this.row.floorId;
                obj.roomId = this.row.roomId;

                objAll.buildingId = this.allMap.buildingId;
                objAll.deviceId = this.allMap.deviceId;
                objAll.floorId = this.allMap.floorId;
                objAll.roomId = this.allMap.roomId;
                let datas = {
                    map: JSON.stringify(obj),
                    allmap: JSON.stringify(objAll)
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
        num1(oldData) {
            if(oldData == 1) {
                this.dialogVisible2 = true;
                this.numberPump = this.allMap.data26.value;
            }
        },
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
        },
        autoIndex(oldData) {
            oldData == 0 ? this.isdisabled = false : this.isdisabled = true;;
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
                        h2{
                            font-weight: normal;
                            font-size: 14px;
                            color: #656565;
                            text-overflow: ellipsis;
                            white-space:nowrap;
                            overflow:hidden;
                        }
                        h2.h2{
                            margin-top: 12px !important;
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
        .displays{
            position: relative;
            .ul5{
                li{
                    margin: 5px 0;
                    a{
                        margin-left: 10px;
                    }
                }
            }
            .outLi{
                position: absolute;
                bottom: 0;
                right: -135px;
                .li1{
                    .el-input{
                        width: 20%;
                    }
                }
            }
        }
        .isAuto{
            text-align: center;
        }
        .dialogMain-bottom{
            background: #DDDDDD;
            border-radius: 3px;
            padding: 0px 0 10px 0px;
            .dialogMain-bottom-right{
                width: 100%;
                padding-left: 20px;
                padding-right: 20px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .pOuter{
                    overflow: hidden;
                    margin-top: 20px;
                    border-bottom: 2px dashed #656565;
                    padding-bottom: 20px;
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
                }
                .btn{
                    padding-top: 15px;
                    .ol5{
                        overflow: hidden;
                        .li5{
                            float: left;
                            width: 50%;
                            text-align: center;
                            padding: 3px 10px;
                            border-radius: 3px;
                            border: 1px solid #666;
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                            cursor: pointer;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            user-select: none;
                        }
                        .li5.active{
                            background: #409eff;
                            color: #fff;
                            border: 1px solid #409eff;
                        }
                    }
                }
                .dialogBottom{
                    .li1{
                        span{

                        }
                        .el-input{
                            width: 60%;
                            min-width: 120px;
                        }
                    }
                }
            }
        }
    }

    // /deep/ .el-dialog__header{
    //     border-bottom: 1px solid #ddd;
    // }

}
</style>
