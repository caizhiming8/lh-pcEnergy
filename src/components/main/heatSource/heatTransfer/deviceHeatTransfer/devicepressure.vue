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
                            <h2 class="h2">二次供水压力：{{item.dataheat3 == undefined ? '-' : (Number(item.dataheat3.value)).toFixed(2)}}MPa</h2>
                            <h2 class="h2">二次回水压力：{{item.dataheat4 == undefined ? '-' : (Number(item.dataheat4.value)).toFixed(2)}}MPa</h2>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <el-dialog :title="row.deviceName" :visible.sync="dialogVisible" width="40%">
            <div class="dialogMain">
                <div class="isAuto">
                    <div class="xxx">
                        <span>模式：</span>
                        <s v-if="isShow1" @click="clicks"></s>
                        <s v-if="isShow2" class="s1"></s>
                    </div>
                </div>
                <div class="dialogMain-bottom" v-if="!isAuto">
                    <div class="dialogMain-bottom-right">
                        <p v-for="(item, index) in ulList" @click="isopen(index)" :class="openChange==index?'active':''">
                            <i :class="item.icon"></i>
                            <s :class="openChange==index?'active':''">{{item.name}}</s>
                        </p>
                    </div>
                </div>
                <div class="dialogMain-bottom" v-else>
                    <ul class="ul1">
                        <li class="li1">
                            <span>自动泄压开启设定</span>
                            <el-input v-model="openSheding"></el-input>MPa
                        </li>
                        <li class="li1">
                            <span>自动泄压关闭设定</span>
                            <el-input v-model="notOpenSheding"></el-input>MPa
                        </li>
                    </ul>
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
            currentLi: 0,
            openChange: 0,
            allMap: {},
            isAuto: false,
            openSheding: '',
            notOpenSheding: '',
            systemId: '',
            subsystemId: '',
            isShow1: true,
            isShow2: false,
            mark: 0
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
                console.log(res);
                if(res.data.success) {
                    if(res.data.result.xlist && res.data.result.xlist.length) {
                        this.dataList = res.data.result.xlist;
                        this.$Nprogress.done();
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
                    // this.$emit("allMap", res.data.result.allmap);
                    // this.$emit("giveFather", res.data.result.allmap.data25.value);
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
                    if(res.data.result.xlist && res.data.result.xlist.length) {
                        this.dataList = res.data.result.xlist;
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
            // this.$message.warning({
            //     message: "可在上面控制",
            //     showClose: true
            // })
            this.dialogVisible = true;
            this.row = item;
            this.openChange = item.data8.value == 1 ? 0 : 1;
            this.isShow1 = item.data3.value == 1 ? true : false;
            this.isShow2 = item.data6.value == 1 ? true : false;
        },
        clicks() {
            this.isShow2 = true;
            this.isShow1 = false;
            this.mark = 1;
        },
        handleColor(ins) {
            this.currentColoter = ins;
        },

        isopen(i) {
            this.openChange = i;
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
                let obj = {data1: {}, data4: {}, data5: {}};
                if(this.mark == 1 && !this.isShow1 && this.isShow2) {
                    obj.data1.name = this.row.data1.name;
                    obj.data1.isPulse = this.row.data1.isPulse;
                    obj.data1.value = 1;
                }
                if(this.openChange == 0) {    // 启动
                    if(this.openChange == this.row.data8.value) {
                        obj.data4.name = this.row.data4.name;
                        obj.data4.value = 1;
                        obj.data4.isPulse = this.row.data4.isPulse;
                    }
                }else{   // 停止
                    if(this.openChange == this.row.data8.value) {
                        obj.data5.value = 1;
                        obj.data5.name = this.row.data5.name;
                        obj.data5.isPulse = this.row.data5.isPulse;
                    }
                }
                for(let key in obj) {
                    if(obj[key].value == undefined) {
                        delete obj[key];
                    }
                }
                obj.buildingId = this.row.buildingId;
                obj.deviceId = this.row.deviceId;
                obj.deviceType = this.row.deviceType;
                obj.floorId = this.row.floorId;
                obj.roomId = this.row.roomId;
                let datas = {
                    map: JSON.stringify(obj)
                };
                this.$axios.post(`BMPlatServers/hvacheat/commitHvacControl`, this.$qs.stringify(datas)).then((res)=>{
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
                        }
                        h2.h2{
                            margin-top: 20px;
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
    .isAuto{
        margin-bottom: 15px;
        text-align: right;
        .xxx{
            span{

            }
            s{
                width: 47px;
                height: 21px;
                background: #DDDDDD;
                display: inline-block;
                border-radius: 3px;
                position: relative;
                top: 5px;
                cursor: pointer;
            }
            .s1{
                background: #409EFF;
            }
        }
    }
    .dialogMain-bottom{
        .ul1{
            .li1{
                margin: 10px 0;
                span{

                }
                .el-input{
                    width: 60% !important;
                    min-width: 120px !important;
                }
            }
        }
    }
}
</style>
