<template>
    <div id="lampSetting">
        <div class="lampSetting">
            <div class="box">
                <h6>控制面板</h6>
                <h2><el-button type="primary" size="small" @click="refresh">刷新</el-button></h2>
                <ol>
                    <li>
                        <i></i>
                        <h5>灯泡开</h5>
                    </li>
                    <li>
                        <i class="i"></i>
                        <h5>灯泡关</h5>
                    </li>
                </ol>
            </div>
            <el-collapse v-model="activeName">
                <el-collapse-item :name="outIndex" v-for="(outItem, outIndex) in dataNameList" :key="outIndex">
                    <template slot="title">
                        <h3 v-if="outItem.isFlag" @click.stop="checkAll(outItem, outIndex)">全选</h3>
                        <h3 v-else @click.stop="checkAllNot(outItem, outIndex)">取消</h3>
                        <span>{{outItem.deviceName}}</span>
                        <b class="b1" v-if="outItem.status == 1">在线</b>
                        <b class="b2" v-if="outItem.status == 0">离线</b>
                        <!-- <b class='b1'>{{outItem.status == 1 ? '在线' : '离线'}}</b> -->
                    </template>
                    <ul>
                        <li v-for="(innerItem, innerIndex) in outItem.datalist">
                            <el-checkbox v-model="innerItem.isChecked" @change="changeCheck(innerItem, outItem)">
                                <p :class="innerItem.dataValue==1?'':'notOpen'">
                                    <i class="iconfont icon-dengpao"></i>
                                    {{innerItem.dataName}}
                                </p>
                            </el-checkbox>
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
            <div class="bott">
                <button type="button" @click="energize" class="btn1">通电</button>
                <button type="button" @click="notEnergize" class="btn2">断电</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            activeName: -1,
            isShow: true,
            dataNameList: [],
            arr: []
        }
    },
    methods:{
        // 查控制柜和灯泡
        initData() {
            this.$axios.post(`BMPlatServers/conditioner/queryLampControlDevice`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    // 添加字段前台用于绑定复选框
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((outItem)=>{
                            outItem.isFlag = true;
                            if(outItem.datalist && outItem.datalist.length) {
                                outItem.datalist.forEach((innerItem)=>{
                                    // innerItem.isChecked = innerItem.dataValue == 1 ? true : false ;
                                    innerItem.isChecked = false;
                                })
                            }
                        })
                    }
                    this.dataNameList = res.data.result.list;
                    this.activeName = [-1];
                    this.dataNameList.forEach((item, i)=>{
                        this.activeName.push(i);
                    })
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        refresh() {
            this.$axios.post(`BMPlatServers/conditioner/queryLampControlDevice`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    // 添加字段前台用于绑定复选框
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((outItem)=>{
                            outItem.isFlag = true;
                            if(outItem.datalist && outItem.datalist.length) {
                                outItem.datalist.forEach((innerItem)=>{
                                    // innerItem.isChecked = innerItem.dataValue == 1 ? true : false ;
                                    innerItem.isChecked = false;
                                })
                            }
                        })
                    }
                    if(res.data.result.orderlist && res.data.result.orderlist.length) {
                        this.$message.warning({
    						message: '尚有为完成的设备控制',
                            showClose: true,
                            duration: 1000,
    					});
                    }else{
                        this.$message.success({
    						message: '刷新成功',
                            showClose: true,
                            duration: 1000,
    					});
                    }
                    this.dataNameList = res.data.result.list;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        checkAllNot(data) {
            data.isFlag = true;
            if(data.datalist && data.datalist.length) {
                data.datalist.forEach((item)=>{
                    item.isChecked = false;
                })
            }
            this.arr = [];
            if(this.dataNameList && this.dataNameList.length) {
                this.dataNameList.forEach((outItem)=>{
                    if(outItem.datalist && outItem.datalist.length) {
                        outItem.datalist.forEach((innerItem)=>{
                            if(innerItem.isChecked) {
                                this.arr.push({
                                    buildingId: innerItem.buildingId,
                                    dataName: innerItem.dataName,
                                    dataType: innerItem.dataType,
                                    deviceId: innerItem.deviceId,
                                    floorId: innerItem.floorId,
                                    roomId: innerItem.roomId,
                                    roomName: innerItem.roomName,
                                    dataValue: innerItem.dataValue,
                                    deviceName: outItem.deviceName
                                })
                            }
                        })
                    }
                })
            }
        },
        checkAll(data, index) {
            data.isFlag = false;
            if(data.datalist && data.datalist.length) {
                data.datalist.forEach((item)=>{
                    item.isChecked = true;
                })
            }
            this.arr = [];
            if(this.dataNameList && this.dataNameList.length) {
                this.dataNameList.forEach((outItem)=>{
                    if(outItem.datalist && outItem.datalist.length) {
                        outItem.datalist.forEach((innerItem)=>{
                            if(innerItem.isChecked) {
                                this.arr.push({
                                    buildingId: innerItem.buildingId,
                                    dataName: innerItem.dataName,
                                    dataType: innerItem.dataType,
                                    deviceId: innerItem.deviceId,
                                    floorId: innerItem.floorId,
                                    roomId: innerItem.roomId,
                                    roomName: innerItem.roomName,
                                    dataValue: innerItem.dataValue,
                                    deviceName: outItem.deviceName
                                })
                            }
                        })
                    }
                })
            }
        },
        // 下达命令通电或者断电
        // 断电
        notEnergize() {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.arr.length == 0) {
                    this.$message.warning({
                        message: '请先选择回路',
                        duration: 1000,
                        showClose: true
                    })
                    return false;
                }
                // 判断是否本来就有断电的设备
                if(this.isTong(2)) {
                    this.$message.warning({
                        message: '选中的有断电的回路',
                        showClose: true,
                        duration: 1000
                    })
                    return false;
                }
                this.glob(2)
            })
        },
        // 通电
        energize() {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.arr.length == 0) {
                    this.$message.warning({
                        message: '请先选择回路',
                        duration: 1000,
                        showClose: true
                    })
                    return false;
                }
                if(this.isTong(1)) {
                    this.$message.warning({
                        message: '选中的有通电的回路',
                        showClose: true,
                        duration: 1000
                    })
                    return false;
                }
                this.glob(1)
            })
        },
        // 通电、断电走的方法
        glob(flag) {
            let datas = {
                map: JSON.stringify(this.arr),
                flag
            }
			this.$axios.post(`BMPlatServers/conditioner/commitLampControl`, this.$qs.stringify(datas)).then((res)=>{
				// console.log(res);
				if(res.data.success) {
                    this.$message.success({
                        message: res.data.result.result,
                        showClose: true,
                        duration: 1000
                    })
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			}).catch((err)=>{
                console.log(err);
            })
        },
        // 判断通电、断电的方法
        isTong(num) {
            let arr2 = [];
            let isTrue = false;
            if(this.arr && this.arr.length) {
                this.arr.forEach((data)=>{
                    arr2.push(data.dataValue);
                })
            }
            for(var i = 0; i < arr2.length; i++) {
                if(arr2[i] == num) {
                    isTrue = true;
                    break;
                }
            }
            return isTrue;
        },
        // 点击复选框的方法
        changeCheck(item, outItem) {
            this.arr = [];
            if(this.dataNameList && this.dataNameList.length) {
                this.dataNameList.forEach((outItem)=>{
                    outItem.datalist.forEach((dataInner)=>{
                        if(dataInner.isChecked) {
                            this.arr.push({
                                buildingId: dataInner.buildingId,
                                dataName: dataInner.dataName,
                                dataType: dataInner.dataType,
                                deviceId: dataInner.deviceId,
                                floorId: dataInner.floorId,
                                roomId: dataInner.roomId,
                                roomName: dataInner.roomName,
                                dataValue: dataInner.dataValue,
                                deviceName: outItem.deviceName
                            })
                        }
                    })
                })
            }
        }
    },
    mounted() {
        this.initData();
    },
    watch: {

    }
}
</script>

<style lang="scss" scoped>
#lampSetting{
    .box{
        position: relative;
        h6{
            font-size: 18px;
            font-weight: normal;
        }
        h2{
            position: absolute;
            top: -5px;
            right: 10px;
        }
        ol{
            text-align: right;
            padding-right: 20px;
            padding-top: 15px;
            li{
                display: inline-block;
                i{
                    width: 16px;
                    height: 16px;
                    background: #409eff;
                    display: inline-block;
                }
                .i{
                    background: #F08080;
                }
                h5{
                    font-size: 14px;
                    display: inline-block;
                    font-weight: normal;
                    color: #656565;
                    position: relative;
                    top: -3px;
                }
            }
            li:first-child{
                margin-right: 15px;
            }
        }
    }
    .lampSetting{
        h3{
            color: #1296DB;
            font-size: 14px;
            font-weight: normal;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
        }
        span{
            margin-left: 15px;
            font-size: 14px;
            color: #656565;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
        }
        b{
            font-size: 12px;
            color: #656565;
            margin-left: 5px;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
        }
        .b1{
            color: #409EFF;
            margin-left: 20px;
            font-size: 14px;
            font-weight: bold;
        }
        .b2{
            color: #F96C6C;
            margin-left: 20px;
            font-size: 14px;
            font-weight: bold;
        }
        ul{
            li{
                margin: 0 20px;
                display: inline-block;
                p{
                    height: 25px;
                    line-height: 25px;
                    padding: 0 15px;
                    background: #409eff;
                    -webkit-border-radius: 16px;
                    -moz-border-radius: 16px;
                    border-radius: 16px;
                    display: inline-block;
                    color: #fff;
                    font-size: 12px;
                }
                p.notOpen{
                    background: #F08080;
                }
            }
        }
        .bott{
            position: fixed;
            z-index: 10;
            bottom: 0px;
            left: 280px;
            width: 100%;
            height: 50px;
            background: #C1C1C1;
            button{
                outline: 0;
                border: 0;
                width: 72px;
                height: 32px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                font-size: 15px;
                color: #fff;
                cursor: pointer;
            }
            .btn1{
                background: #409eff;
                position: relative;
                left: 35%;
                top: 10px;
            }
            .btn1:hover{
                background: #4ebbf4;
            }
            .btn2{
                position: relative;
                left: 40%;
                top: 10px;
                background: #f96c6c;
            }
            .btn2:hover{
                background: #f08080;
            }
        }
    }
}
</style>
