<template>
    <div id="alarmSetting">
        <div class="setting-main" ref="settingMain">
            <div class="setting-tree" ref="settingTree">
                <el-tree accordion :data="data" :props="defaultProps" highlight-current @node-click="handleNodeClick">
                    <span class="span-ellipsis" slot-scope="{ node, data }">
                        <span :title="node.label"><img src="../../../../static/img/fangjianguankong.png">{{ node.label }}</span>
                    </span>
                </el-tree>
            </div>
            <div class="setting-table">
                <div class="btn">
                    <el-button @click="add" type="primary" size="small" icon="el-icon-plus">新增</el-button>
                </div>
                <div class="placeTable">
                    <el-table :data="tableData" style="margin-top: 20px;width: 100%;" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading = "loading">
                        <el-table-column prop="deviceName" label="设备名称" align='center'></el-table-column>
                        <el-table-column prop="typeName" label="数据类型" align='center'></el-table-column>
                        <el-table-column prop="minNum" label="下限" align='center'></el-table-column>
                        <el-table-column prop="maxNum" label="上限" align='center'></el-table-column>
                        <el-table-column label="告警级别" align='center'>
                            <template slot-scope="scope">
                                <span v-if="scope.row.degree==1">低告警</span>
                                <span v-if="scope.row.degree==2">中告警</span>
                                <span v-if="scope.row.degree==3">高告警</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="startTime" label="开始时间" align='center'></el-table-column>
                        <el-table-column prop="endTime" label="结束时间" align='center'></el-table-column>
                        <el-table-column label="操作" align='center' width="180">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row, scope.$index)" size="small" type="success">修改</el-button>
                                <el-button @click="deletes(scope.row, scope.$index)" size="small" type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="dialog">
            <el-dialog title="设备值预设" :visible.sync="dialogVisible" width="50%">
                <span v-if="isShow">请选择：</span>
                <el-select v-if="isShow" v-model="selectValue" placeholder="请选择" style="width: 180px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <div class="marginTop">
                    <span>下限</span>
                    <el-input v-model="LIST2" class="int"></el-input>
                    <span>上限</span>
                    <el-input v-model="LIST1" class="int"></el-input>
                    <span>开始时间</span>
                    <el-time-picker v-model="LIST3" placeholder="开始时间" class="int1" value-format="HH:mm:ss"></el-time-picker>
                    <span>结束时间</span>
                    <el-time-picker v-model="LIST4" placeholder="结束时间" class="int1" value-format="HH:mm:ss"></el-time-picker><br><br>
                    <span>告警级别</span>
                    <el-select v-model="level" style="width: 180px;">
                        <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="makeSure" size="small">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- 删除模态框 -->
        <div class="deletes">
            <el-dialog title="删除" :visible.sync="dialogVisible1" width="30%">
                <span>确定要删除吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible1 = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="makeSureDelete" size="small">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return{
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tableData: [],
            dialogVisible: false,
            dialogVisible1: false,
            deviceId:'',
            loading: false,
            deviceTypeId: '',
            selectValue: '',
            options: [],
            LIST1: '',
            LIST2: '',
            LIST3: '',
            LIST4: '',
            isShow: true,
            resultLength: 1,
            row:{},
            deleteDevideId: '',
            Id: '',
            level: '',
            levelList: [],
            rows: {}
        }
    },
    methods: {
        // 新增按钮
        add() {
            this.isShow = true;
            this.LIST1 = '';
            this.LIST2 = '';
            this.LIST3 = '00:00:00';
            this.LIST4 = '23:59:59';
            this.level = '';
            this.selectValue = '';
            if(this.resultLength == 0) {
                this.dialogVisible = false;
                if(this.deviceId == '') {
                    this.$message.warning({
                        message: '请先选择设备',
                        showClose: true,
                        duration: 1000
                    })
                }else{
                    this.$message.warning({
                        message: '该设备阈值设置已满，不能继续添加',
                        showClose: true,
                        duration: 1000
                    })
                }
            }else{
                this.dialogVisible = true;
                this.$axios.post(`BMPlatServers/warn/queryAllDegrees`).then((res)=>{
                    // console.log(res);
                    this.levelList = [];
                    if(res.data.success) {
                        if(res.data.result && res.data.result.length) {
                            res.data.result.forEach((item)=>{
                                this.levelList.push({label: item.message, value: item.degree})
                            })
                        }
                    }else{
                        // this.$message.warning(res.data.resultMessage)
                    }
                })
            }
        },
        // 模态框点击提交增加或者修改
        makeSure() {
            if(!this.LIST1) {
                this.$notify.warning({
                    title: '警告',
                    message: '请填写上限',
                    duration: 2000
                })
                return false;
            }
            if(!this.LIST2) {
                this.$notify.warning({
                    title: '警告',
                    message: '请填写下限',
                    duration: 2000
                })
                return false;
            }
            if(Number(this.LIST1) <= Number(this.LIST2)) {
                this.$notify.warning({
                    title: '警告',
                    message: '请填写的上限大于下线',
                    duration: 2000
                })
                this.LIST2 = '';
                return false;
            }
            if(!this.level) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择告警级别',
                    duration: 3000
                })
                return false;
            }
            if(this.isShow) {
                if(!this.selectValue) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择数据类型',
                        duration: 2000
                    })
                    return false;
                }
                let data = {
                    deviceType: this.deviceTypeId,
                    deviceId: this.deviceId,
                    systemId: 1,
                    dataType: this.selectValue,
                    maxNum: this.LIST1,
                    minNum: this.LIST2,
                    startTime: this.LIST3,
                    endTime: this.LIST4,
                    degree: this.level
                }
                this.$axios.post(`BMPlatServers/common/setDeviceThreshold`, this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
                            message: '增加成功',
                            showClose: true,
                            duration: 1000
                        })
                        this.dialogVisible = false;
                        this.initDataUpdata(this.deviceId, this.deviceTypeId);
                        this.deviceAttribute();
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            }else{
                let data = {
                    deviceType: this.deviceTypeId,
                    deviceId: this.deviceId,
                    systemId: 1,
                    dataType: this.row.dataType,
                    maxNum: this.LIST1,
                    minNum: this.LIST2,
                    startTime: this.LIST3,
                    endTime: this.LIST4,
                    id: this.row.id,
                    degree: this.level
                }
                // console.log(data);
                this.$axios.post(`BMPlatServers/common/updateDeviceThreshold`, this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
                            message: '修改成功',
                            showClose: true,
                            duration: 1000
                        })
                        this.dialogVisible = false;
                        this.initDataUpdata(this.deviceId, this.row.deviceType);
                        this.deviceAttribute();
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            }
        },
        // 树状结构获取id
        handleNodeClick(data) {
            if(typeof(data.children) == 'undefined') {
                this.deviceTypeId = data.deviceType;
                this.loading = true;
                this.deviceId = data.id;
                let param = {
                    deviceId:this.deviceId,
                    deviceType: data.deviceType,
                    systemId: 1
                }
                this.$axios.post(`BMPlatServers/common/queryDeviceThreshold`,this.$qs.stringify(param)).then((response) => {
                    // console.log(response);
                    if(response.data.success){
                        this.tableData = response.data.result;
                        this.loading = false;
                        setTimeout(()=>{
                            this.deviceAttribute();
                        }, 200);
                    }else{
                        this.$message.warning({
                            message: response.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                });
            }else{
                console.log(data);
                // this.deviceType = data.id;
            }
        },
        // 修改按钮
        handleClick(row, index) {
            this.$axios.post(`BMPlatServers/warn/queryAllDegrees`).then((res)=>{
                // console.log(res);
                this.levelList = [];
                if(res.data.success) {
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.levelList.push({label: item.message, value: item.degree})
                        })
                    }
                }else{
                    // this.$message.warning(res.data.resultMessage)
                }
            })
            this.dialogVisible = true;
            this.isShow = false;
            this.LIST1 = row.maxNum;
            this.LIST2 = row.minNum;
            this.LIST3 = row.startTime;
            this.LIST4 = row.endTime;
            this.level = row.degree;
            this.row = row;
        },
        makeSureDelete() {
            this.dialogVisible1 = false;
            let param = {
                deviceId: this.deleteDevideId,
                dataType: this.dataTypeId,
                id: this.Id
            };
            this.$axios.post(`BMPlatServers/common/deleteDeviceThreshold`, this.$qs.stringify(param)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.$message.success({
                        message: '删除成功',
                        showClose: true,
                        duration: 1000
                    })
                    this.initDataUpdata(this.deleteDevideId, this.rows.deviceType);
                    this.deviceAttribute();
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        // 删除按钮
        deletes(row) {
            this.dialogVisible1 = true;
            this.deleteDevideId = row.deviceId;
            this.dataTypeId = row.dataType;
            this.Id = row.id;
            this.rows = row;
        },
        // 点击提交按钮以后走的公共方法
        initDataUpdata(deviceId, deviceType) {
            let param = {
                deviceId: deviceId,
                systemId: 1,
                deviceType
            };
            this.$axios.post(`BMPlatServers/common/queryDeviceThreshold`, this.$qs.stringify(param)).then((response) => {
                if(response.data.success){
                    this.tableData = response.data.result;
                }else{
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            });
        },
        // tree列表
        initData(){
            let param = {
                systemId: 1
            }
            this.$axios.post(`BMPlatServers/common/queryDevcieType`, this.$qs.stringify(param)).then((response) => {
                console.log(response);
                if(response.data.success){
                    let dataList = [];
                    if(response.data.result && response.data.result.length) {
                        response.data.result.forEach((item, index)=>{
                            dataList.push({label: item.label, children:  item.children})
                        })
                    }else{
                            dataList = [];
                        }
                        this.data = dataList;
                    }else{
                        this.$message.warning({
                            message: response.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                });
            },
            initDom() {
                document.querySelector(".setting-tree").style.height = document.querySelector(".setting-main").offsetHeight + "px";
            },
            // 获取设备属性设备下拉框
            deviceAttribute() {
                let data = {
                    deviceTypeId: this.deviceTypeId,
                    deviceId: this.deviceId,
                    systemId: 1
                }
                this.$axios.post(`BMPlatServers/common/queryDeviceData`, this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.options = []
                        if(res.data.result && res.data.result.length) {
                            res.data.result.forEach((item)=>{
                                this.options.push({label: item.typeComment , value: item.dataType})
                            })
                        }
                        this.resultLength = res.data.result.length;
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            }
        },
        mounted() {
            this.initDom();
            this.initData();
        },
        watch: {
            LIST1(newData) {
                this.LIST1 = (''+this.LIST1).replace(/[^\-?\d.]/g, '');
            },
            LIST2(newData) {
                this.LIST2 = (''+this.LIST2).replace(/[^\-?\d.]/g, '');
            }
        }}
        </script>

        <style lang="scss" scoped>
        #alarmSetting{
            padding: 20px 15px;
            box-sizing: border-box;
            height: 100%;
            .setting-main{
                overflow: hidden;
                box-shadow: 0 0 6px #ddd;
                -webkit-box-shadow: 0 0 6px #ddd;
                -moz-box-shadow: 0 0 6px #ddd;
                -o-box-shadow: 0 0 6px #ddd;
                height: 100%;
                .setting-tree{
                    overflow: auto;
                    width: 12%;
                    float: left;
                    border-right: 1px solid #ddd;
                    padding: 5px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                        color: #0098FF;
                        font-weight: 700;
                    }
                    .span-ellipsis {
                        width: 100%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        display: block;
                    }
                }
                .setting-table{
                    width: 88%;
                    float: left;
                    padding: 20px;
                    height: 100%;
                    position: relative;
                    box-sizing: border-box;
                    .btn{
                        text-align: right;
                    }
                    .placeTable{
                        position: absolute;
                        left: 0;
                        top: 65px;
                        width: 100%;
                        height: 90%;
                        overflow: auto;
                    }
                }
            }
            .marginTop{
                margin-top: 20px;
                .int{
                    width: 100px;
                    display: inline-block;
                }
                .int1{
                    width: 150px;
                    display: inline-block;
                }
            }}
            </style>
