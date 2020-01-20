<template>
    <div id="statementlist">
        <div class="statementlist">

            <ul class="ul">
                <li>
                    <div class="li-top">
                        <b>电的报表</b>
                        <el-button type="success" class="btn" size="small" @click="donload2" :loading="ploading" v-hasMenu="10-1-1">下载</el-button>
                    </div>
                    <div class="li-main">
                        <b class="b2">时间：</b>
                        <el-select v-model="pli2" placeholder="请选择" class="short">
                            <el-option v-for="item in li2list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-date-picker v-if="typeTimePower==1" disabled v-model="pTime" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
                        <el-date-picker v-if="typeTimePower==2" v-model="pTime" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
                        <el-date-picker v-if="typeTimePower==3" v-model="pTime" type="month" value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
                        <b class="b2">地区：</b>
                        <el-select v-model="pli3" placeholder="请选择" class="short">
                            <el-option v-for="item in li3list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <b class="b3" v-if="pType==2 || pType==3">楼宇：</b>
                        <el-select v-model="pli4" placeholder="请选择" class="short" v-if="pType==2 || pType==3">
                            <el-option v-for="item in pli4list" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                        <b class="b4" v-if="pType==3">房间（可不选）：</b>
                        <el-select v-model="pli5" placeholder="请选择" class="short" v-if="pType==3">
                            <el-option v-for="item in pli5List" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <div class="li-top">
                        <b>水的报表</b>
                        <el-button type="success" class="btn" size="small"  @click="donload1" :loading="wloading" v-hasMenu="10-1-2">下载</el-button>
                    </div>
                    <div class="li-main">
                        <b class="b2">时间：</b>
                        <el-select v-model="li2" placeholder="请选择" class="short">
                            <el-option v-for="item in li2list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-date-picker v-if="wtypeTimePower==1" disabled v-model="wTime" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
                        <el-date-picker v-if="wtypeTimePower==2" v-model="wTime" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
                        <el-date-picker v-if="wtypeTimePower==3" v-model="wTime" type="month" value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
                        <b class="b2">地区：</b>
                        <el-select v-model="li3" placeholder="请选择" class="short">
                            <el-option v-for="item in li3list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <b class="b3" v-if="Type==2||Type==3">楼宇</b>
                        <el-select v-model="li4" placeholder="请选择" class="short" v-if="Type==2||Type==3">
                            <el-option v-for="item in li4list" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                        <b class="b4" v-if="Type==3">房间（可不选）</b>
                        <el-select v-model="li5" placeholder="请选择" class="short" v-if="Type==3">
                            <el-option v-for="item in li5List" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <div class="li-top">
                        <b>暖通能耗报表</b>
                        <el-button type="success" class="btn" size="small" @click="donload3" :loading="nloading" v-hasMenu="10-1-3">下载</el-button>
                    </div>
                    <div class="li-main">
                        <b class="b2">时间：</b>
                        <el-select v-model="nli2" placeholder="请选择" class="short">
                            <el-option v-for="item in li2list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-date-picker :key="Math.random()" v-if="ntypeTimePower==1" disabled v-model="nTime" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
                        <el-date-picker :key="Math.random()" v-if="ntypeTimePower==2" v-model="nTime" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
                        <el-date-picker :key="Math.random()" v-if="ntypeTimePower==3" v-model="nTime" type="month" value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
                        <b class="b2">子系统：</b>
                        <el-select v-model="nli3" placeholder="请选择" class="short">
                            <el-option v-for="item in nli3list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <b class="b2">站点（可不选）：</b>
                        <el-select v-model="nli3L" placeholder="请选择" class="short">
                            <el-option v-for="item in nli3Llist" :key="item.buildingId" :label="item.label" :value="item.buildingId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <div class="li-top">
                        <b>暖通数据报表</b>
                        <el-button type="success" class="btn" size="small" @click="donload4" :loading="dloading" v-hasMenu="10-1-4">下载</el-button>
                    </div>
                    <div class="li-main">
                        <b class="b2">时间：</b>
                        <el-date-picker :key="Math.random()" v-model="timeRachge" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        <b class="b2">设备：</b>
                        <el-cascader v-model="n2li3L" :options="n2li3Llist" :props="{ expandTrigger: 'hover', checkStrictly: true }" @change="dhandleChange" class="long"></el-cascader>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            li2list: [{label: '年', value: 1}, {label: '月', value: 2}, {label: '日', value: 3}],
            li2: '',
            li3list: [{label: '全校', value: 1}, {label: '楼宇', value: 2}, {label: '房间', value: 3}],
            li3: '',
            activeName: '',
            li4list: [],
            li4: '',
            li5List: [],
            li5: '',
            Type: '',
            defaultProps: {
                children: 'children',
                label: 'label',
                expandTrigger: 'hover'
            },
            buildingId: '',
            floorId: '',
            roomId: '',
            pli2: '',
            pli3: '',
            pli4list: [],
            pli4: '',
            pli5List: [],
            pli5: '',
            pType: '',
            collapseName: 1,
            pbuildingId: '',
            pfloorId: '',
            proomId: '',
            nli2: '',
            nli3: '',
            nli4list: [],
            nli4: '',
            nli5List: [],
            nli5: '',
            ploading: false,
            pTime: '',
            typeTimePower: 2,
            wtypeTimePower: 2,
            wTime: '',
            wloading: false,
            ntypeTimePower: 2,
            nTime: '',
            timeRachge: [],
            startTime: '',
            endTime: '',
            nli3list: [],
            nli3Llist: [],
            nli3L: '',
            n2li3Llist: [],
            n2li3L: '',
            subsystemId: '',
            systemId: '',
            nloading: false,
            dloading: false,
            buildingIds: '',
            dataType: '',
            deviceId: ''
        }
    },
    methods: {
        collapseChange(val) {
            if(val == 1) {
                this.collapseName = 1;
                this.pinitList();
            }else if(val == 2) {
                this.collapseName = 2;
                this.initList();
            }else if(val == 3) {
                this.collapseName = 3;
                this.subInit();
            }else if(val == 4) {
                this.collapseName = 4;
                this.devicelist();
            }
        },
        // 电的下载按钮
        donload2() {
            if(!this.pli2) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 2000
                })
                return false;
            }
            if(this.pli2 != 1) {
                if(!this.pTime || this.pTime == null) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择时间',
                        duration: 2000
                    })
                    return false;
                }
            }
            if(!this.pli3) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择地区',
                    duration: 2000
                })
                return false;
            }
            if(this.pli3 != 1) {
                if(!this.pli4) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择楼宇',
                        duration: 2000
                    })
                    return false;
                }
            }
            this.ploading = true;
            if(!this.pli4) {
                this.pli4 = this.pbuildingId
            }
            let data = {
                type: this.pli3,
                timeflag: this.pli2,
                buildingId: this.pli4,
                floorId: this.pfloorId,
                roomId: this.proomId,
                time: this.pTime
            }
            console.log(data);
            this.$axios.post('BMPlatServers/form/downloadElectricity', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success == undefined) {
                    window.location.href = `BMPlatServers/form/downloadElectricity?type=${this.pli3}&timeflag=${this.pli2}&buildingId=${this.pli4 || this.buildingId}&floorId=${this.pfloorId}&roomId=${this.proomId}&time=${this.pTime}`
                    this.ploading = false;
                }else{
                    this.ploading = false;
                    this.$message.warning({
                        message: '暂无报表',
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 水的下载按钮
        donload1() {
            if(!this.li2) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 2000
                })
                return false;
            }
            if(this.li2 != 1) {
                if(!this.wTime || this.wTime == null) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择时间',
                        duration: 2000
                    })
                    return false;
                }
            }
            if(!this.li3) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择地区',
                    duration: 2000
                })
                return false;
            }
            if(this.li3 != 1) {
                if(!this.li4) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择楼宇',
                        duration: 2000
                    })
                    return false;
                }
            }
            this.wloading = true;
            let data = {
                type: this.li3,
                timeflag: this.li2,
                buildingId: this.li4 || this.buildingId,
                floorId: this.floorId,
                roomId: this.roomId,
                time: this.wTime
            }
            console.log(data);
            this.buildingId = this.li4 || this.buildingId,
            this.$axios.post('BMPlatServers/form/downloadwater', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success == undefined) {
                    this.wloading = false;
                    window.location.href = `BMPlatServers/form/downloadwater?type=${this.li3}&timeflag=${this.li2}&buildingId=${this.buildingId}&floorId=${this.floorId}&roomId=${this.roomId}&time=${this.wTime}`
                }else{
                    this.wloading = false;
                    this.$message.warning({
                        message: '暂无报表',
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 暖通的下载按钮
        donload3() {
            if(!this.nli2) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 2000
                })
                return false;
            }
            if(this.nli2 != 1) {
                if(!this.nTime || this.nTime == null) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择时间',
                        duration: 2000
                    })
                    return false;
                }
            }
            if(!this.nli3) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择子系统',
                    duration: 2000
                })
                return false;
            }
            this.nloading = true;
            let data = {
                type: 2,
                timeflag: this.nli2,
                systemId: this.systemId,
                subsystemId: this.subsystemId,
                buildingId: this.nli3L,
                time: this.nTime
            }
            console.log(data);
            this.$axios.post('BMPlatServers/form/downloadHvac', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success == undefined) {
                    this.nloading = false;
                    window.location.href = `BMPlatServers/form/downloadHvac?type=2&timeflag=${this.nli2}&systemId=${this.systemId}&subsystemId=${this.subsystemId}&buildingId=${this.nli3L}&time=${this.nTime}`
                }else{
                    this.nloading = false;
                    this.$message.warning({
                        message: '暂无报表',
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        donload4() {
            if(this.timeRachge && this.timeRachge.length) {}else{
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 2000
                })
                return false;
            }
            if(this.n2li3L && this.n2li3L.length){}else{
                this.$notify.warning({
                    title: '警告',
                    message: '请选择设备',
                    duration: 2000
                })
                return false;
            }
            this.dloading = true;
            let data = {
                type: 3,
                startTime: this.startTime,
                endTime: this.endTime,
                buildingId: this.buildingIds,
                dataType: this.dataType,
                deviceId: this.deviceId
            }
            console.log(data);
            this.$axios.post('BMPlatServers/form/downloadHvac', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success == undefined) {
                    this.dloading = false;
                    window.location.href = `BMPlatServers/form/downloadHvac?type=3&startTime=${this.startTime}&endTime=${this.endTime}&buildingId=${this.buildingIds}&dataType=${this.dataType}&deviceId=${this.deviceId}`
                }else{
                    this.dloading = false;
                    this.$message.warning({
                        message: '暂无报表',
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 电的楼宇下拉框
        pinitList() {
            let data = {
                systemId: 4
            }
            this.$axios.post('BMPlatServers/common/querySystemBuildings', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.pli4list = res.data.result;
                }
            })
        },

        // 水楼宇下拉框
        initList() {
            this.$axios.post('BMPlatServers/common/queryWaterBuildings').then((res)=>{
                if(res.data.success) {
                    this.li4list = res.data.result;
                }
            })
        },

        // 电的房间下拉框
        pinitList2(buildingId) {
            let data = {
                buildingId: buildingId
            }
            this.$axios.post('BMPlatServers/common/queryBuildingRoom', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.pli5List = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.pli5List.push({label: item.label, value: `${item.buildingId},${item.floorId},${item.id}`});
                        })
                    }else{

                    }
                }
            })
        },

        // 水的房间下拉框
        initList2(buildingId) {
            let data = {
                buildingId: buildingId
            }
            this.$axios.post('BMPlatServers/common/queryBuildingRoom', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.li5List = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.li5List.push({label: item.label, value: `${item.buildingId},${item.floorId},${item.id}`})
                        })
                    }else{

                    }
                }
            })
        },

        // 暖通能耗子系统列表
        subInit() {
            this.$axios.post('BMPlatServers/form/queryHvacSubsystem').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.nli3list = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.nli3list.push({label: item.systemName, value: `${item.subsystemId},${item.systemId}`})
                        })
                    }else{
                        this.nli3list = [];
                    }
                }
            })
        },

        // 暖通能耗站点列表
        systemlist() {
            let data = {
                subsystemId: this.subsystemId,
                systemId: this.systemId
            }
            this.$axios.post('BMPlatServers/form/queryHvacBuilding ', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.nli3Llist = res.data.result;
                }
            })
        },

        // 暖通数据设备列表三层数组
        devicelist() {
            this.$axios.post('BMPlatServers/form/hvacDeviceTree').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result && res.data.result.length) {

                        // 遍历第一层
                        res.data.result.forEach((outItem)=>{
                            // 遍历第二层数组
                            let middleArr = [];
                            if(outItem.children && outItem.children.length) {
                                outItem.children.forEach((middleItem)=>{
                                    // 遍历第三层数组
                                    let innerArr = [];
                                    if(middleItem.children && middleItem.children.length) {
                                        middleItem.children.forEach((innerItem)=>{
                                            innerArr.push({label: innerItem.dataName, value: `${innerItem.buildingId},${innerItem.dataType},${innerItem.deviceId}`});
                                        })
                                    }
                                    middleArr.push({label: middleItem.label, value: `${middleItem.buildingId}`, children: innerArr})
                                })
                            }
                            this.n2li3Llist.push({label: outItem.systemName, value: `${outItem.subsystemId},${outItem.systemId}`, children: middleArr});
                            // console.log(this.n2li3Llist);
                        })
                    }
                }
            })
        },

        handleChange(value) {
            if(value && value.length) {
                if(value[1]) {
                    this.buildingId = value[1].split(',')[0];
                    this.floorId = value[1].split(',')[1];
                    this.roomId = value[1].split(',')[2];
                }
            }
        },
        dhandleChange(value) {
            // console.log(value);
            if(value && value.length) {
                if(value.length == 3) {
                    if(value[2]) {
                        this.buildingIds = value[2].split(',')[0];
                        this.dataType = value[2].split(',')[1];
                        this.deviceId = value[2].split(',')[2];
                    }
                }else if(value.length == 2) {
                    this.buildingIds = value[1];
                }else{
                    this.n2li3L = [];
                    this.$message.error({
                        message: '选择两层',
                        duration: 1000,
                        showClose: true
                    })
                }
            }
        },
    },
    mounted() {
        this.pinitList();
        this.initList();
        this.subInit();
        this.devicelist();
    },
    watch: {
        li3(newData) {
            this.li4 = '';
            this.li5 = '';
            if(newData == 2) {
                this.Type = 2;
            }else if(newData == 3) {
                this.Type = 3;
            }else{
                this.Type = '';
            }
        },
        li4(newData) {
            this.li5 = '';
            if(newData) {
                this.initList2(newData);
            }
        },
        li5(newData) {
            if(newData) {
                this.buildingId = newData.split(',')[0];
                this.floorId = newData.split(',')[1];
                this.roomId = newData.split(',')[2];
            }else{
                this.buildingId = '';
                this.floorId = '';
                this.roomId = '';
            }
        },
        pli3(newData) {
            this.pli4 = '';
            this.pli5 = '';
            if(newData == 2) {
                this.pType = 2;
            }else if(newData == 3) {
                this.pType = 3;
            }else{
                this.pType = '';
            }
        },
        pli2(newData) {
            this.pTime = '';
            if(newData == 1) {
                this.typeTimePower = 1;
            }else if(newData == 2) {
                this.typeTimePower = 2;
            }else if(newData == 3) {
                this.typeTimePower = 3;
            }else{
                this.typeTimePower = 2;
            }
        },
        li2(newData) {
            this.wTime = '';
            if(newData == 1) {
                this.wtypeTimePower = 1;
            }else if(newData == 2) {
                this.wtypeTimePower = 2;
            }else if(newData == 3) {
                this.wtypeTimePower = 3;
            }else{
                this.wtypeTimePower = 3;
            }
        },
        nli2(newData) {
            this.nTime = '';
            if(newData == 1) {
                this.ntypeTimePower = 1;
            }else if(newData == 2) {
                this.ntypeTimePower = 2;
            }else if(newData == 3) {
                this.ntypeTimePower = 3;
            }else{
                this.ntypeTimePower = 3;
            }
        },
        timeRachge(newData) {
            if(newData==null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = newData[0];
                this.endTime = newData[1];
            }
        },
        nli3(newData) {
            if(newData) {
                this.subsystemId = newData.split(',')[0];
                this.systemId = newData.split(',')[1];
            }
            this.systemlist();
            this.nli3L = '';
        },
        pli4(newData) {
            this.pli5 = '';
            if(newData) {
                this.pinitList2(newData);
            }
        },
        pli5(newData) {
            if(newData) {
                this.pbuildingId = newData.split(',')[0];
                this.pfloorId = newData.split(',')[1];
                this.proomId = newData.split(',')[2];
            }else{
                this.pbuildingId = '';
                this.pfloorId = '';
                this.proomId = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#statementlist{
    height: 100%;
    padding: 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
    -o-box-sizing: border-box;
    box-sizing: border-box;
    .statementlist{
        height: 100%;
        .short{
            width: 160px;
        }
        .long{
            width: 380px;
        }
        .b2{
            margin-left: 20px;
        }
        .b3{
            margin-left: 20px;
        }
        .b4{
            margin-left: 20px;
        }
        .btn{
            margin-left: 50px;
        }
        -webkit-box-shadow: 0 0 6px #ddd;
        -moz-box-shadow: 0 0 6px #ddd;
        -ms-box-shadow: 0 0 6px #ddd;
        -o-box-shadow: 0 0 6px #ddd;
        box-shadow: 0 0 6px #ddd;
        padding: 10px;
        padding-top: 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -ms-box-sizing: border-box;
        box-sizing: border-box;
        .ul{
            padding: 30px 4px 20px 4px;
            height: 100%;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            li{
                height: 130px;
                -webkit-box-shadow: 0 0 6px #ddd;
                -moz-box-shadow: 0 0 6px #ddd;
                box-shadow: 0 0 6px #ddd;
                border-left: 19px solid #6E9AF8;
                border-radius: 6px;
                .li-top{
                    padding: 30px 33px 0 22px;
                    overflow: hidden;
                    b{
                        color: #282828;
                        font-size: 16px;
                        float: left;
                    }
                    .btn{
                        float: right
                    }
                }
                .li-main{
                    margin-top: 10px;
                    padding-left: 5px;
                }
            }
            li:not(:first-child) {
                margin-top: 30px;
            }
        }
    }
}
</style>
