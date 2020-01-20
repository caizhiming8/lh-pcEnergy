<template>
    <div id="buldingRoom" v-loading="loading">
        <div class="buldingRoom">
            <el-collapse v-model="activeNames" @change="handleChangeFloor" accordion>
                <el-collapse-item :title="item.floorId+'层'" :name="item.floorId" v-for="(item, index) in floorList" :key="index">
                    <ul class="ul">
                        <li v-for="(item, index) in dataList" @click.stop="handleClick(item, index)">
                            <div class="liInner" :class="Index==index?'active':''">
                                <div class="li-top" :class="Index==index?'active':''">
                                    <p>{{item.deviceName}}</p>
                                    <i class="iconfont icon-duihao is" v-if="Index==index"></i>
                                </div>
                                <div class="li-main1">
                                    <h4>温度：</h4>
                                    <span>{{item.data2.value}}℃</span>
                                </div>
                                <div class="li-main2">
                                    <h4>模式：</h4>
                                    <span v-if="item.data3.value==1">制冷</span>
                                    <span v-if="item.data3.value==2">除湿</span>
                                    <span v-if="item.data3.value==4">送风</span>
                                    <span v-if="item.data3.value==8">制热</span>
                                </div>
                                <div class="li-main3">
                                    <h4>风速：</h4>
                                    <span v-if="item.data4.value==1">高风</span>
                                    <span v-if="item.data4.value==2">中风</span>
                                    <span v-if="item.data4.value==4">低风</span>
                                </div>
                                <div class="li-bottom">
                                    <span class="span3" v-if="item.data1.value==1 || item.data1.value==0">正常</span>
                                    <span class="span4" v-if="item.data1.value==2 || item.data1.value==3">故障</span>
                                    <span v-if="item.data1.value==1 || item.data1.value==3" class="span1">ON</span>
                                    <span v-if="item.data1.value==2 || item.data1.value==0" class="span2">OFF</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>

            <el-dialog title="空调控制" :visible.sync="dialogVisible" width="30%">
                <div class="main-body">
                    <div class="body-top">
                        <span>状态</span>
                        <p class="p" v-if="items.data1.value==1 || items.data1.value==3">开</p>
                        <p class="p" v-if="items.data1.value==2 || items.data1.value==0">关</p>
                        <p class="switch"><el-switch v-model="isOpen" @change="changeDatas" active-color="#409EFF"  inactive-color="#C1C1C1"></el-switch></p>
                    </div>
                    <div class="body-center">
                        <div class="body-center-t">
                            <div class="body-center-t-left">
                                <a>模式</a>
                                <b class="b" v-if="items.data3.value==8">制热</b>
                                <b class="b" v-if="items.data3.value==4">送风</b>
                                <b class="b" v-if="items.data3.value==2">除湿</b>
                                <b class="b" v-if="items.data3.value==1">制冷</b>
                            </div>
                            <div class="body-center-t-right">
                                <ul class="right">
                                    <li v-for="(it, inde) in list1" @click.stop="currentChange(it, inde)" :class="currenIndex==inde?'active': ''">
                                        <i :class="it.icon" :id="currenIndex==inde?'active': ''"></i>
                                        <b class="b2">{{it.type}}</b>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="body-center-c">
                            <div class="body-center-c-left">
                                <a>温度</a>
                                <b class="c">{{items.data2.value}}℃</b>
                            </div>
                            <div class="body-center-c-right">
                                <p class="number"><el-input-number v-model="num" :disabled="isDisabled" size="small" @change="handleChange" :min="16" :max="30" label="描述文字"></el-input-number></p>
                            </div>
                        </div>
                        <div class="body-center-b">
                            <div class="body-center-b-left">
                                <a>风速</a>
                                <b class="c" v-if="items.data4.value==4">低风</b>
                                <b class="c" v-if="items.data4.value==2">中风</b>
                                <b class="c" v-if="items.data4.value==1">高风</b>
                            </div>
                            <div class="body-center-b-right">
                                <ul class="li">
                                    <li v-for="(titles, k) in list2" @click.stop="changeData(k)" :class="currenIndexs==k?'active': ''">
                                        <i :class="titles.icon" :id="currenIndexs==k?'active': ''"></i>
                                        <b class="b2">{{titles.type}}</b>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="makeSure" size="small">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            buildingId: '',
            dataList: [],
            dialogVisible: false,
            open1: false,
            open2: true,
            num: '',
            items: {data1: '', data2: true, data3: '', data5: '', data4: '', data6: '', data7: '', data8: '', daya9: '', daya10: ''},
            list1: [{type: '制冷',n: 1,icon: 'iconfont icon-zhileng'}, {type: '除湿',n: 2,icon: 'iconfont icon-hekriconchushi'}, {type: '送风',n: 4, icon: 'iconfont icon-songfeng'}, {type: '制热',n: 8, icon: 'iconfont icon-caozuozhire'}],
            list2: [{type: '高风', icon: 'iconfont icon-fengsu1'}, {type: '中风', icon: 'iconfont icon-fengsu2'}, {type: '低风', icon: 'iconfont icon-fengsu'}],
            currenIndex: '',
            currenIndexs: '',
            Index: -1,
            changeColor: true,
            isDisabled: true,
            isOpen: true,
            isObj: {data7: {value: ''}, data8: {value: ''}, data9: {value: ''}, data10: {value: ''}},
            // activeNames: ["0"],
            activeNames: "0",
            floorList: [],
            loading: true
        }
    },
    methods: {
        // 初始化数据
        initData() {
            let params = {
                buildingId: this.buildingId
            }
            this.$axios.post("BMPlatServers/conditioner/queryFloorList", this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.floorList = res.data.result.list;
                    this.loading = false;
                }else{
                    this.floorList = [];
                    this.loading = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 折叠面板
        handleChangeFloor(val) {
            // console.log(val);
            this.dataList = [];
            this.Index = -1;
            this.loading = true;
            let data = {
                buildingId: this.buildingId,
                floorId: val
            };
            if(val) {
                this.$axios.post(`BMPlatServers/conditioner/queryRoomList`, this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.dataList = res.data.result.list;
                        this.loading = false;
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                        this.loading = false;
                    }
                })
            }else{
                this.loading = false;
            }
        },

        makeSure() {
            this.open();
        },
        open(){
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dialogVisible = false;
                this.isObj.data7.value = this.isOpen ? 1 : 2;
                this.isObj.data7.name = this.items.data7.name;
                this.isObj.data8.name = this.items.data8.name;
                this.isObj.data9.name = this.items.data9.name;
                this.isObj.data10.name = this.items.data10.name;
                this.isObj.data8.value = this.num;
                this.isObj.data9.value = this.currenIndex == 0 ? 1 : (this.currenIndex == 1 ? 2 : (this.currenIndex == 2 ? 4 : 8));
                this.isObj.data10.value = this.currenIndexs == 0 ? 1 : (this.currenIndexs == 1 ? 2 : 4);
                this.isObj.deviceId = this.items.deviceId;
                this.isObj.buildingId = this.items.buildingId;
                this.isObj.floorId = this.items.floorId;
                this.isObj.roomId = this.items.roomId;
                let data = {
                    map: JSON.stringify(this.isObj)
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

        handleClick(item, index) {
            this.dialogVisible = true;
            this.items = item;
            this.isOpen = this.items.data1.value == 0 ? false : (this.items.data1.value == 1 ? true : (this.items.data1.value == 2 ? false : true));
            this.currenIndex = this.items.data3.value == 1 ? 0 : (this.items.data3.value == 2 ? 1 : (this.items.data3.value == 4 ? 2 : 3));
            this.currenIndexs = this.items.data4.value == 1 ? 0: (this.items.data4.value == 2 ? 1 : 2);
            this.num = item.data2.value;
            this.Index = index;
        },

        // 处理点击变色（制冷， 制热等）
        currentChange(item, ins) {
            // console.log(item);
            if(this.changeColor) {
                this.currenIndex = ins;
            }else{
                this.$notify.warning({
                    title: '警告',
                    message: '该设备已经关闭，不能修改模式'
                });
                return false;
            }
            this.currenIndex = ins;
        },
        // 点击变色（高风，中风）
        changeData(ins) {
            if(this.changeColor) {
                this.currenIndexs = ins;
            }else{
                this.$notify.warning({
                    title: '警告',
                    message: '该设备已经关闭，不能修改风速'
                });
                return false;
            }
            this.currenIndexs = ins;
        },

        handleChange(val) {

        },
        changeDatas() {

        }
    },
    mounted() {
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.initData();
    },
    components: {

    },
    watch: {
        $route(to, from) {
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
            this.initData();
        },
        isOpen(newData) {
            if(newData) {
                this.changeColor = true;
                this.isDisabled = false;
            }else{
                this.changeColor = false;
                this.isDisabled = true;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#buldingRoom{
    .buldingRoom{
        .ul{
            overflow: hidden;
            li{
                width: 16.5%;
                height: 200px;
                float: left;
                display: block;
                padding: 10px 20px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                -ms-box-sizing: border-box;
                -o-box-sizing: border-box;
                box-sizing: border-box;
                .liInner{
                    border: 1px solid #ddd;
                    height: 100%;
                    -webkit-border-radius: 4px;
                    -moz-border-radius: 4px;
                    border-radius: 4px;
                    position: relative;
                    cursor: pointer;
                    background: #ECECEC;
                    transition: border .5s;
                    .is{
                        position: absolute;
                        right: 4px;
                        width: 25px;
                        height: 25px;
                        line-height: 25px;
                        top: 5px;
                        z-index: 10;
                        background: #fff;
                        border-radius: 50%;
                        color: #4CE257;
                    }
                    &.active{
                        border: 3px solid #4CE257;
                        margin-left: -1px;
                        margin-top: -1px;
                    }
                    .li-top{
                        height: 40px;
                        background: #F6F6F6;
                        text-align: center;
                        line-height: 40px;
                        font-size: 16px;
                        color: #282828;
                        position: relative;
                    }
                    .li-top.active{
                        background: #4CE257;
                        color: #fff;
                        font-size: 16px;
                    }
                    .li-main1{
                        font-size: 14px;
                        color: #656565;
                        padding: 20px 0 0 18px;
                        h4{
                            font-weight: normal;
                            display: inline-block;
                        }
                        span{
                            display: inline-block;
                            margin-left: 0;
                        }
                    }
                    .li-main2{
                        font-size: 14px;
                        color: #656565;
                        padding: 10px 0 0 18px;
                        h4{
                            font-weight: normal;
                            display: inline-block;
                        }
                        span{
                            display: inline-block;
                            margin-left: 0;
                        }
                    }
                    .li-main3{
                        font-size: 14px;
                        color: #656565;
                        padding: 10px 0 0 18px;
                        h4{
                            font-weight: normal;
                            display: inline-block;
                        }
                        span{
                            display: inline-block;
                            margin-left: 0;
                        }
                    }
                    .li-bottom{
                        position: relative;
                        text-align: center;
                        span{
                            display: inline-block;
                            padding: 2px 7px;
                            font-size: 12px;
                            color: #fff;
                            border-radius: 4px;
                        }
                        .span3{
                            background: #3AA0FB;
                            margin-right: 10px;
                        }
                        .span4{
                            background: #F57676;
                            margin-right: 10px;
                        }
                        .span1{
                            background: #3AA0FB;
                            margin-left: 10px;
                        }
                        .span2{
                            background: #F57676;
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
        /deep/ .el-dialog__header{
            border-bottom: 1px solid #ddd;
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
                margin-top: 20px;
                background: #F0F0F0;
                padding: 15px 5px;
                border-radius: 5px;
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                -o-border-radius: 5px;
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
                    margin-top: 15px;
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
}
</style>
