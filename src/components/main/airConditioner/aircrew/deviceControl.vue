<template>
    <div id="deviceControl">
        <h6>
            <el-button type="primary" size="small" @click="refresh">刷新</el-button>
        </h6>
        <div class="deviceControl">
            <div class="circulationControl">
                <ul class="ul1">
                    <li @click.stop="circulationClick(item, index)" v-for="(item, index) in bdataList">
                        <div class="circulation-inner" :class="curren==index?'active':''">
                            <i class="iconfont icon-duihao is" v-if="curren==index"></i>
                            <div class="circula-header">
                                <p :class="curren==index?'active':''">补水泵</p>
                            </div>
                            <div class="circula-body">
                                <div class="body-tops">
                                    <a>频率： {{item.data8.value}}Hz</a>
                                    <a class="a1">功率： {{item.data9.value}}w</a>
                                    <a class="a1">补水量： {{item.data10.value}}m³</a>
                                </div>
                                <div class="body-main">
                                    <h3 class="h31 hx" v-if="item.data1.value==1">远程</h3>
                                    <h3 class="h32 hx" v-if="item.data1.value==0">本地</h3>
                                    <h3 class="h31 hl" v-if="item.data3.value==1">NO</h3>
                                    <h3 class="h32 hl" v-if="item.data3.value==0">OFF</h3>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="waterReplenishing">
                <ul class="ul2">
                    <li @click="watchCirculationClick(obj, ind)" v-for="(obj, ind) in xdataList">
                        <div class="water-inner" :class="currens==ind?'active':''">
                            <i class="iconfont icon-duihao is" v-if="currens==ind"></i>
                            <div class="water-header">
                                <p :class="currens==ind?'active':''">循环泵</p>
                            </div>
                            <div class="water-body">
                                <div class="body-top1">
                                    <a>频率：{{obj.data1.value}}Hz</a>
                                    <a class="a1">压差：{{obj.data4.value}}Mpa</a>
                                    <a class="a1">电流：{{obj.data2.value}}A</a>
                                </div>
                                <div class="body-obj">
                                    <h3 class="h3 h" v-if="obj.data5.value==1">远程</h3>
                                    <h3 class="h31 h" v-if="obj.data5.value==0">本地</h3>
                                    <h3 class="h3 s" v-if="obj.data7.value==1">NO</h3>
                                    <h3 class="h31 s" v-if="obj.data7.value==0">OFF</h3>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <el-dialog title="循环泵控制" :visible.sync="watchdialogVisible" width="30%">
            <div class="main-body">
                <div class="body-top">
                    <span>模式</span>
                    <p class="p" v-if="!Objects.data6.value">手动</p>
                    <p class="p" v-if="Objects.data6.value">自动</p>
                    <p class="switch"><el-switch v-model="Objects.data6.value" @change="handleChange" active-color="#409EFF"  inactive-color="#C1C1C1"></el-switch></p>
                </div>
                <div class="body-center" v-if="!Objects.data6.value">
                    <div class="body-center-t">
                        <div class="body-center-t-left">
                            <a>状态</a>
                            <b class="b" v-if="Objects.data7.value==1">开</b>
                            <b class="b" v-if="Objects.data7.value==0">关</b>
                        </div>
                        <div class="body-center-t-right">
                            <ul class="right">
                                <li v-for="(it, inde) in isOpenList" @click.stop="currentChange(inde)" :class="currenIndex==inde?'active': ''">
                                    <i :class="it.icon" :id="currenIndex==inde?'active': ''"></i>
                                    <b class="b2">{{it.name}}</b>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="body-center-c">
                        <div class="body-center-c-left">
                            <a>频率</a>
                            <b class="c">{{Objects.data1.value}} Hz</b>
                        </div>
                        <div class="body-center-c-right">
                            <p class="number"><el-input-number v-model="num2" :disabled="isDisabled" size="small" @change="handleChanges" :min="0" :max="50"></el-input-number></p>
                        </div>
                    </div>
                </div>
                <div class="body-center" v-if="Objects.data6.value">
                    <div class="body-center-c-left">
                        <a>压差</a>
                        <b class="c">{{Objects.data4.value}} Mpa</b>
                    </div>
                    <div class="body-center-c-right">
                        <p class="number"><el-input-number v-model="num3" size="small" @change="handleChanges" :min="0" :max="50"></el-input-number></p>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="watchdialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="cymakeSure" size="mini">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="补水泵控制" :visible.sync="dialogVisible" width="30%">
            <div class="main-body">
                <div class="body-top">
                    <span>模式</span>
                    <p class="p" v-if="!bItem.data2.value">手动</p>
                    <p class="p" v-if="bItem.data2.value">自动</p>
                    <p class="switch"><el-switch v-model="bItem.data2.value" @change="handleChange" active-color="#409EFF"  inactive-color="#C1C1C1"></el-switch></p>
                </div>
                <div class="body-center">
                    <div class="body-center-t" v-if="!bItem.data2.value">
                        <div class="body-center-t-left">
                            <a>状态</a>
                            <b class="b" v-if="bItem.data3.value==1">开</b>
                            <b class="b" v-if="bItem.data3.value==0">关</b>
                        </div>
                        <div class="body-center-t-right">
                            <ul class="right">
                                <li v-for="(it, inde) in isOpenList" @click.stop="currentChange(inde)" :class="currenIndex==inde?'active': ''">
                                    <i :class="it.icon" :id="currenIndex==inde?'active': ''"></i>
                                    <b class="b2">{{it.name}}</b>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="body-center-c" v-if="bItem.data2.value">
                        <div class="body-center-c-left">
                            <a>压差</a>
                            <b class="c">{{bItem.data6.value}} Mpa</b>
                        </div>
                        <div class="body-center-c-right">
                            <p class="number"><el-input-number v-model="num1" size="small" @change="handleChanges" :min="0" :max="1000"></el-input-number></p>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="makeSure" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return{
            buildingId: '',
            dialogVisible: false,
            watchdialogVisible: false,
            modles: true,
            num: true,
            isOpenList: [{name: '关', icon: 'iconfont icon-tubiaolunkuo-'}, {name: '开', icon: 'iconfont icon-shanguangdengdakai'}],
            currentIndexs: -1,
            num1: 1,
            num2: 1,
            num3: 1,
            currenIndex: -1,
            bdataList: [],
            xdataList: [],
            bItem: {data2: '', data3: '', data6: ''},
            Objects: {data6: '', data1: '', data4: '', data7: ''},
            curren: -1,
            currens: -1,
            isDisabled: false
        }
    },
    methods: {
        // 循环泵列表
        initData() {
            let data = {
                buildingId: this.buildingId
            };
            this.$axios.post(`BMPlatServers/conditioner/queryControlDeviceData`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.bdataList = [];
                    this.xdataList = [];
                    if(res.data.result.blist && res.data.result.blist.length) {
                        this.bdataList = res.data.result.blist;
                    }
                    if(res.data.result.xlist && res.data.result.xlist.length) {
                        this.xdataList = res.data.result.xlist;
                    }
                    this.$Nprogress.done();
                }else{
                    this.bdataList = [];
                    this.xdataList = [];
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
                buildingId: this.buildingId
            };
            this.$axios.post(`BMPlatServers/conditioner/queryControlDeviceData`, this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.bdataList = [];
                    this.xdataList = [];
                    if(res.data.result.blist && res.data.result.blist.length) {
                        this.bdataList = res.data.result.blist;
                    }
                    if(res.data.result.xlist && res.data.result.xlist.length) {
                        this.xdataList = res.data.result.xlist;
                    }
                    if(res.data.result.orderlist && res.data.result.orderlist.length) {
                        this.$message.warning({
                            message: '尚有为未完成的下空命令',
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
                    this.bdataList = [];
                    this.xdataList = [];
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 模态框确定按钮提交数据
        makeSure() {
            this.open2();
        },
        open2() {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.bItem.data2.value = this.bItem.data2.value ? 1 : 0;
                this.bItem.data6.value = this.num1;
                this.bItem.data3.value = this.currenIndex;
                this.dialogVisible = false;
                let data = {
                    map: JSON.stringify(this.bItem)
                };
                this.$axios.post(`BMPlatServers/conditioner/commitRoomControl`, this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
                            message: '设置成功',
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
        // 循环泵提交数据
        cymakeSure() {
            this.open1();
        },
        open1() {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.Objects.data6.value = this.Objects.data6.value ? "1" : "0";
                this.Objects.data7.value = this.currenIndex;
                this.Objects.data1.value = this.num2;
                this.Objects.data4.value = this.num3;
                this.watchdialogVisible = false;
                let data = {
                    map: JSON.stringify(this.Objects)
                };
                this.$axios.post(`BMPlatServers/conditioner/commitRoomControl`, this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
                            message: '设置成功',
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

        // 补水泵点击li
        circulationClick(item, ins) {
            if(item.data1.value == 0) {
                this.$notify({
                    title: '提示',
                    message: '该设备处于本地模式，不能远程修改',
                    duration: 2000,
                    type: "error"
                })
                return;
            }
            this.curren = ins;
            this.dialogVisible = true;
            item.data2.value = item.data2.value == 0 ? false : true;
            this.num1 = item.data6.value;
            this.currenIndex = Number(item.data3.value);
            this.bItem = item;
        },
        // 循环泵点击li
        watchCirculationClick(item, ins) {
            if(item.data5.value == 0) {
                this.$notify({
                    title: '提示',
                    message: '该设备处于本地模式，不能远程修改',
                    duration: 2000,
                    type: "error"
                })
                return;
            };
            this.currens = ins;
            this.watchdialogVisible = true;
            item.data6.value = item.data6.value == 1 ? true : false;
            this.num3 = item.data4.value;
            this.num2 = item.data1.value;
            this.currenIndex = Number(item.data7.value);
            this.Objects = item;
        },
        handleChange(val) {
            // console.log(val);
        },
        currentChange(i) {
            if(i== 0) {
                this.isDisabled = true;
            }else{
                this.isDisabled = false;
            }
            this.currenIndex = i;
        },
        handleChanges(val) {
            console.log(val);
        }
    },
    mounted() {
        this.$Nprogress.start();
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
        }
    }
}
</script>

<style lang="scss" scoped>
#deviceControl{
    position: relative;
    /deep/ .el-dialog__header{
        border-bottom: 1px solid #ddd;
    }
    h6{
        position: absolute;
        right: 4px;
        top: -65px;
    }
    .deviceControl{
        .circulationControl{
            ul.ul1{
                overflow: hidden;
                li{
                    float: left;
                    width: 16.5%;
                    cursor: pointer;
                    padding: 10px 15px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    .circulation-inner{
                        height: 200px;
                        border: 1px solid #ddd;
                        position: relative;
                        box-sizing: border-box;
                        overflow: hidden;
                        &.active{
                            border: 3px solid #40FF07;
                            box-sizing: border-box;
                        }
                        .is{
                            position: absolute;
                            right: 7px;
                            top: 7px;
                            font-size: 20px;
                            font-weight: 700;
                            color: #40FF07;
                            background: #fff;
                            border-radius: 50%;
                            padding: 2px;
                            z-index: 10;
                        }
                        .circula-header{
                            p{
                                height: 40px;
                                text-align: center;
                                line-height: 40px;
                                font-size: 16px;
                                color: #282828;
                                background: #F6F6F6;
                            }
                            p.active{
                                background: #40FF07;
                                color: #fff;
                            }
                        }
                        .circula-body{
                            height: 160px;
                            background: #ECECEC;
                            .body-tops{
                                padding-top: 15px;
                                padding-left: 15px;
                                a{
                                    font-size: 14px;
                                    color: #656565;
                                    display: block;
                                }
                                a.a1{
                                    margin-top: 15px;
                                }
                            }
                            .body-main{
                                text-align: center;
                                padding-top: 22px;
                                h3{
                                    padding: 2px 10px;
                                    -webkit-border-radius: 3px;
                                    -moz-border-radius: 3px;
                                    border-radius: 3px;
                                    font-size: 14px;
                                    font-weight: normal;
                                    color: #656565;
                                    display: inline-block;
                                }
                                h3.h31{
                                    background: #40FF07;
                                    color: #fff;
                                }
                                h3.h32{
                                    background: #C2C2C2;
                                    color: #fff;
                                }
                                .hx{
                                    margin-right: 10px;
                                }
                                .hl{
                                    margin-left: 10px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .waterReplenishing{
            border-top: 2px dashed #ddd;
            margin-top: 20px;
            padding-top: 20px;
            ul.ul2{
                overflow: hidden;
                padding-bottom: 30px;
                li{
                    float: left;
                    cursor: pointer;
                    width: 16.5%;
                    padding: 10px 12px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    overflow: hidden;
                    .water-inner{
                        border: 1px solid #ddd;
                        position: relative;
                        height: 200px;
                        overflow: hidden;
                        &.active{
                            border: 3px solid #40FF07;
                            overflow: hidden;
                            z-index: 1000;
                        }
                        .is{
                            position: absolute;
                            right: 7px;
                            top: 7px;
                            font-size: 20px;
                            font-weight: 700;
                            color: #fff;
                            background: #40FF07;
                            border-radius: 50%;
                            padding: 2px;
                            z-index: 10;
                        }
                        /deep/ .iconfont{
                            background: #fff;
                            color: #40FF07;;
                        }
                        .water-header{
                            p{
                                background: #F6F6F6;
                                font-size: 16px;
                                color: #282828;
                                text-align: center;
                                line-height: 40px;
                                height: 40px;
                            }
                            .active{
                                background: #40FF07;;
                                color: #fff;
                            }
                        }
                        .water-body{
                            background: #ECECEC;
                            height: 100%;
                            .body-top1{
                                padding-top: 15px;
                                padding-left: 15px;
                                a{
                                    color: #656565;
                                    display: block;
                                }
                                a.a1{
                                    margin-top: 15px;
                                }
                            }
                            .body-obj{
                                text-align: center;
                                margin-top: 16px;
                                h3{
                                    padding: 2px 10px;
                                    -webkit-border-radius: 3px;
                                    -moz-border-radius: 3px;
                                    border-radius: 3px;
                                    display: inline-block;
                                    font-size: 14px;
                                    color: #656565;
                                    font-weight: normal;
                                }
                                .h3{
                                    background: #40FF07;
                                    color: #fff;
                                }
                                .h31{
                                    background: #C2C2C2;
                                    color: #fff;
                                }
                                .h{
                                    margin-right: 10px;
                                }
                                .s{
                                    margin-left: 10px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .main-body{
        .body-top{
            overflow: hidden;
            position: relative;
            span{
                display: block;
                float: left;
                font-size: 12px;
                font-weight: 100;
                color: #666;
            }
            p.p{
                float: left;
                font-size: 16px;
                color: #409EFF;
                position: absolute;
                left: 45px;
                top: -4px;
            }
            p.switch{
                float: right;
            }
        }
        .body-center{
            overflow: hidden;
            margin-top: 20px;
            background: #F0F0F0;
            padding: 15px 5px;
            border-radius: 5px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            -o-border-radius: 5px;
            .body-center-c-left{
                float: left;
                width: 29%;
                border-right: 1px dashed #333;
                a{
                    display: block;
                    font-size: 12px;
                    color: #666;
                }
                b{
                    display: block;
                    font-size: 16px;
                    color: #409eff;
                    font-weight: 700;
                }
            }
            .body-center-c-right{
                float: left;
                width: 70%;
                p{
                    text-align: center;
                    .el-input-number--small{
                        width: 110px;
                    }
                }
            }
            .body-center-t{
                overflow: hidden;
                .body-center-t-left{
                    float: left;
                    width: 30%;
                    padding: 8px 0;
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -o-box-sizing: border-box;
                    border-right: 1px dashed #333;
                    a{
                        display: block;
                        font-size: 12px;
                        font-weight: 100;
                        color: #666666;
                    }
                    b.b{
                        display: block;
                        font-size: 16px;
                        font-weight: 700;
                        color: #409EFF;
                    }
                }
                .body-center-t-right{
                    float: left;
                    width: 70%;
                    padding: 8px 0;
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -o-box-sizing: border-box;
                    ul.right{
                        display: flex;
                        -webkit-display: flex;
                        -ms-display: flex;
                        -moz-display: flex;
                        -o-display: flex;
                        li{
                            flex: 1;
                            -webkit-flex: 1;
                            -ms-flex: 1;
                            -moz-flex: 1;
                            -o-flex: 1;
                            text-align: center;
                            cursor: pointer;
                            i{
                                display: block;
                                font-size: 20px;
                                color: #606262;
                                cursor: pointer;
                                &#active{
                                    color: #409EFF;
                                    font-weight: 700;
                                }
                            }
                            b{
                                display: block;
                            }
                            &.active{
                                color: #409EFF;
                                font-weight: 700;
                            }
                        }
                    }
                }
            }
            .body-center-c{
                overflow: hidden;
                .body-center-c-left{
                    float: left;
                    width: 30%;
                    padding: 8px 0;
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -o-box-sizing: border-box;
                    border-right: 1px dashed #333;
                    a{
                        display: block;
                        font-size: 12px;
                        font-weight: 100;
                        color: #666666;
                    }
                    b.c{
                        display: block;
                        font-size: 16px;
                        font-weight: 700;
                        color: #409EFF;
                    }
                }
                .body-center-c-right{
                    float: left;
                    width: 70%;
                    padding: 8px 0;
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -o-box-sizing: border-box;
                    p.number{
                        margin-left: 15px;
                    }
                    .el-input-number--small{
                        width: 110px;
                    }
                }
            }
            .body-center-b{
                overflow: hidden;
                margin-top: 15px;
                .body-center-b-left{
                    float: left;
                    width: 30%;
                    padding: 8px 0;
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -o-box-sizing: border-box;
                    border-right: 1px dashed #333;
                    a{
                        display: block;
                        font-size: 12px;
                        font-weight: 100;
                        color: #666666;
                    }
                    b.c{
                        display: block;
                        font-size: 16px;
                        font-weight: 700;
                        color: #409EFF;
                    }
                }
                .body-center-b-right{
                    float: left;
                    width: 70%;
                    padding: 8px 0;
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -o-box-sizing: border-box;
                    ul.li{
                        display: flex;
                        -webkit-display: flex;
                        -moz-display: flex;
                        -o-display: flex;
                        -ms-display: flex;
                        li{
                            flex: 1;
                            -webkit-flex: 1;
                            -ms-flex: 1;
                            -moz-flex: 1;
                            -o-flex: 1;
                            text-align: center;
                            display: block;
                            cursor: pointer;
                            i{
                                display: block;
                                font-size: 20px;
                                color: #606262;
                                &#active{
                                    color: #409EFF;
                                    font-weight: 700;
                                }
                            }
                            b{
                                display: block;
                            }
                            &.active{
                                color: #409EFF;
                                font-weight: 700;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
