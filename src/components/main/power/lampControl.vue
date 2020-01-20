<template>
    <div id="lampControl">
        <div class="lampControl">
            <div class="headers">
                <span class="span1">任务名称</span>
                <el-input v-model="name" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" class="btn" @click="search">搜索</el-button>
                <el-button type="success" icon="el-icon-circle-plus-outline" size="small" class="btn" @click="add">新增</el-button>
            </div>
            <div class="dmaTable">
                <el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
                    <el-table-column :show-overflow-tooltip="true" prop="comment" label="任务名称" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="周期类型" align='center'>
                        <template slot-scope="scope">
                            <span v-if="scope.row.flag==0">按月</span>
                            <span v-if="scope.row.flag==1">按周</span>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="startTime" label="开始日期" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="endTime" label="结束日期" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="effective" label="是否生效" align='center'>
                        <template slot-scope="scope">
                            <span v-if="scope.row.effective==1">生效</span>
                            <span v-if="scope.row.effective==0">失效</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align='center' width="300">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="look(scope.row)">查看</el-button>
                            <el-button type="success" size="mini" @click="changes(scope.row)">修改</el-button>
                            <el-button type="danger" size="mini" @click="remove(scope.row)">删除</el-button>
                            <el-button type="warning" size="mini" @click="isOK(scope.row)" v-if="scope.row.effective==0">生效</el-button>
                            <el-button type="warning" size="mini" @click="isOKNo(scope.row)" v-if="scope.row.effective==1">失效</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dmaPagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
            </div>

            <el-dialog title="新增任务" :visible.sync="dialogVisible" width="50%">
                <div class="dialog-main">
                    <div class="top1">
                        <span class="span2">任务名称</span>
                        <el-input v-model="task" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="top2">
                        <span class="span3">选择时间方式</span>
                        <ul class="ul1">
                            <li v-for="(item, index) in TimeList" @click="handleClick(index)" :class="currentIndex==index? 'active' : ''">{{item.name}}</li>
                        </ul>
                    </div>
                    <div class="top3" v-if="currentIndex==0">
                        <span class="span4">选择时间段</span>
                        <el-date-picker v-model="startTime" type="date" placeholder="开始日期" value-format="MM-dd" format="MM-dd"></el-date-picker>
                        <el-date-picker v-model="endTime" type="date" placeholder="结束日期"  value-format="MM-dd" format="MM-dd"></el-date-picker>
                    </div>
                    <div class="top3" v-if="currentIndex==1">
                        <span class="span4">选择时间段</span>
                        <el-select v-model="startCycle" placeholder="开始时间">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="endCycle" placeholder="结束时间">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="top4">
                        <el-tooltip class="item" effect="dark" content="点击增加时间" placement="top-start">
                            <i class="el-icon-circle-plus-outline icon" @click="addTime"></i>
                        </el-tooltip>
                        <transition-group name="el-zoom-in-top">
                            <div class="times" v-for="(item, index) in list" :key="index+'1'">
                                <el-time-picker v-model="item.times" value-format="HH:mm" format="HH:mm" :clearable="false"></el-time-picker>
                                <el-switch  v-model="item.switchs" active-color="#409eff" inactive-color="#ddd" active-text="灯亮" inactive-text="熄灭"></el-switch>
                                <el-tooltip class="item" effect="dark" content="点击删除" placement="right">
                                    <i class="el-icon-circle-close delete" @click="detele(index)"></i>
                                </el-tooltip>
                            </div>
                        </transition-group>
                    </div>
                    <div class="top5">
                        <span class="span5">选择设备</span>
                        <el-cascader :options="data" :props="{multiple: true}" collapse-tags clearable @change="handleChange" v-model="device"></el-cascader>
                    </div>
                    <div class="top6">
                        <span class="span6">是否生效</span>
                        <el-radio v-model="effective" label="1">生效</el-radio>
                        <el-radio v-model="effective" label="0">失效</el-radio>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="mackSure" size="small">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog  :title="msg" :visible.sync="dialogVisible1" width="50%">
                <div class="dialog-main">
                    <div class="top1">
                        <span class="span2">任务名称</span>
                        <el-input v-model="task1" placeholder="请输入内容" :disabled="selfFlg==0"></el-input>
                    </div>
                    <div class="top2">
                        <span class="span3">选择时间方式</span>
                        <ul class="ul1">
                            <li v-for="(item, index) in TimeList" @click="handleClick1(index)" :class="currentIndex==index? 'active' : ''">{{item.name}}</li>
                        </ul>
                    </div>
                    <div class="top3" v-if="currentIndex==0">
                        <span class="span4">选择时间段</span>
                        <el-date-picker v-model="startTime1" type="date" placeholder="开始日期" :disabled="selfFlg==0" value-format="MM-dd" format="MM-dd"></el-date-picker>
                        <el-date-picker v-model="endTime1" type="date" placeholder="结束日期" :disabled="selfFlg==0"  value-format="MM-dd" format="MM-dd"></el-date-picker>
                    </div>
                    <div class="top3" v-if="currentIndex==1">
                        <span class="span4">选择时间段</span>
                        <el-select v-model="startCycle" placeholder="开始时间" :disabled="selfFlg==0">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="endCycle" placeholder="结束时间" :disabled="selfFlg==0">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="top4">
                        <el-tooltip class="item" effect="dark" content="点击增加时间" placement="top-start">
                            <i class="el-icon-circle-plus-outline icon" @click="addTime1"></i>
                        </el-tooltip>
                        <transition-group name="el-zoom-in-top">
                            <div class="times" v-for="(item, index) in list" :key="index+'1'">
                                <el-time-picker v-model="item.times" value-format="HH:mm" format="HH:mm" :disabled="selfFlg==0" :clearable="false"></el-time-picker>
                                <el-switch  v-model="item.switchs" active-color="#409eff" inactive-color="#ddd" active-text="灯亮" inactive-text="熄灭" :disabled="selfFlg==0"></el-switch>
                                <el-tooltip class="item" effect="dark" content="点击删除" placement="right">
                                    <i class="el-icon-circle-close delete" @click="detele1(index)"></i>
                                </el-tooltip>
                            </div>
                        </transition-group>
                    </div>
                    <div class="top5">
                        <span class="span5">选择设备</span>
                        <el-cascader :options="data" :props="{multiple: true}" :disabled="selfFlg==0" collapse-tags clearable  @change="handleChange" v-model="device"></el-cascader>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible1 = false" size="small" v-if="selfFlg==1">取 消</el-button>
                    <el-button type="primary" @click="sure" size="small" v-if="selfFlg==1">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            startCycle: '',
            endCycle: '',
            options: [ {label: '星期日', value: 1}, {label: '星期一', value: 2}, {label: '星期二', value: 3}, {label: '星期三', value: 4}, {label: '星期四', value: 5}, {label: '星期五', value: 6}, {label: '星期六', value: 7}],
            dialogVisible: false,
            task: '',
            TimeList: [{name: '按月', value: 1}, {name: '按周', value: 2}],
            currentIndex: 0,
            startTime: '',
            endTime: '',
            list: [],
            deviceId: '',
            deviceList: [],
            props: {multiple: true},
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            devicelist: [],
            msg: "修改",
            dialogVisible1: false,
            task1: '',
            endTime1: '',
            startTime1: '',
            selfFlg: 0,
            data: [],
            deviceid: [],
            deviceid1: [],
            taskId: '',
            name: '',
            effective: '1',
            effectiveChange: '1',
            device: []
        }
    },
    methods: {
        initList(currentPage) {
            let params = {
                pageSize: this.pageSize,
                currentPage,
                taskComment: this.name
            }
            this.$axios.post("BMPlatServers/common/queryLampTask", this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.list;
                    this.pageTotal = res.data.result.num;
                }else{
                    this.tableData = [];
                    this.pageTotal = 0;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        initData(isDisabeld) {
            this.$axios.post("BMPlatServers/conditioner/queryBuildingLampDevice").then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.data = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((outItem)=>{
                            outItem.label = outItem.name;
                            outItem.value = outItem.buildingId;
                            outItem.children = outItem.devicelist;
                            if(outItem.devicelist && outItem.devicelist.length) {
                                outItem.devicelist.forEach((middelItem)=>{
                                    middelItem.children = middelItem.datalist;
                                    middelItem.label = middelItem.deviceName;
                                    middelItem.value = middelItem.buildingId+","+middelItem.floorId+","+middelItem.roomId;
                                    if(middelItem.datalist && middelItem.datalist.length) {
                                        middelItem.datalist.forEach((innerItem)=>{
                                            innerItem.label = innerItem.dataName;
                                            innerItem.value = innerItem.buildingId+","+innerItem.dataType+","+innerItem.deviceId+","+innerItem.floorId+","+innerItem.roomId;
                                        })
                                    }else{
                                        middelItem.datalist = [];
                                    }
                                })
                            }else{
                                outItem.devicelist = [];
                            }
                        })
                        this.data = res.data.result.list;
                    }else{
                        res.data.result.list = [];
                    }
                }else{
                    this.data = [];
                }
            })
        },
        search() {
            this.initList(1);
            this.val = 1;
        },
        add() {
            this.dialogVisible = true;
            this.initData(0);
            this.task = '';
            this.currentIndex = 0;
            this.startTime = '';
            this.endTime = '';
            this.list = [];
            this.devicelist = [];
            this.deviceId = '';
            this.device = [];
        },
        mackSure() {
            this.list.forEach((item)=>{
                item.switchs ? item.switchs = 1 : item.switchs = 0;
            })
            for(let i = 0; i < this.list.length; i++) {
                for(let j = i + 1; j < this.list.length ; j++) {
                    if(this.list[i].times.split(":")[0] == this.list[j].times.split(":")[0] && this.list[i].times.split(":")[1] == this.list[j].times.split(":")[1]) {
                        this.list.splice(i, 1);
                    }
                }
            }
            if(!this.task) {
                this.$notify.warning({
                    message: '请填写任务名称',
                    title: '警告'
                })
                return false;
            }
            if(this.currentIndex == 0) {
                if(!this.startTime || !this.endTime) {
                    this.$notify.warning({
                        message: '请填写时间',
                        title: '警告'
                    })
                    return false;
                }
            }else if(this.currentIndex == 1) {
                if(!this.startCycle || !this.endCycle) {
                    this.$notify.warning({
                        message: '请填写时间',
                        title: '警告'
                    })
                    return false;
                }
            }
            if(this.list.length == 0) {
                this.$notify.warning({
                    message: '请填写时间',
                    title: '警告'
                })
                return false;
            }
            if(this.devicelist.length == 0) {
                this.$notify.warning({
                    message: '请填写设备',
                    title: '警告'
                })
                return false;
            }
            let params = {
                startTime: this.currentIndex == 0 ? this.startTime : '',
                endTime: this.currentIndex == 0 ? this.endTime : '',
                startWeek: this.currentIndex == 1 ? this.startCycle : '',
                endWeek: this.currentIndex == 1 ? this.endCycle : '',
                comment: this.task,
                flag: this.currentIndex,
                timelist: JSON.stringify(this.list),
                devicelist: JSON.stringify(this.devicelist),
                effective: this.effective
            }
            this.$axios.post("BMPlatServers/common/addLampTask", this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                this.dialogVisible = false;
                if(res.data.success) {
                    this.$message.success({
                        message: "操作成功",
                        showClose: true,
                        duration: 1000
                    })
                    this.initList(1);
                    this.currentPage = 1;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        handleChange(val) {
            this.devicelist = [];
            val.forEach((item)=>{
                this.devicelist.push({
                    buildingId: item[2].split(",")[0],
                    dataType: item[2].split(",")[1],
                    deviceId: item[2].split(",")[2],
                    floorId: item[2].split(",")[3],
                    roomId: item[2].split(",")[4]
                })
            })
        },
        handleClick(i) {
            this.currentIndex = i;
        },
        handleClick1(i) {
            if(this.selfFlg == 1) {
                this.currentIndex = i;
            }
        },
        addTime() {
            this.list.push({times: '', switchs: true});
        },
        addTime1() {
            if(this.selfFlg == 1) {
                this.list.push({times: '', switchs: true});
            }
        },
        detele(i) {
            this.list.splice(i, 1);
        },
        detele1(i) {
            if(this.selfFlg == 1) {
                this.list.splice(i, 1);
            }
        },
        handleCurrentChange(val) {
            this.initList(val);
        },
        look(row) {
            this.initData(1);
            this.selfFlg = 0;
            this.dialogVisible1 = true;
            this.msg = "查看"
            this.task1 = row.comment;
            this.effectiveChange = ""+row.effective;
            this.currentIndex = row.flag;
            if(row.flag == 0) {
                this.startTime1 = row.startTime;
                this.endTime1 = row.endTime;
            }else if(row.flag == 1) {
                switch (row.startTime) {
                case "星期日":
                    this.startCycle = 1;
                break;
                case "星期一":
                    this.startCycle = 2;
                    break;
                case "星期二":
                    this.startCycle = 3;
                    break;
                case "星期三":
                    this.startCycle = 4;
                    break;
                case "星期四":
                    this.startCycle = 5;
                    break;
                case "星期五":
                    this.startCycle = 6;
                    break;
                case "星期六":
                    this.startCycle = 7;
                    break;
                }
            switch (row.endTime) {
                case "星期日":
                    this.endCycle = 1;
                break;
                case "星期一":
                    this.endCycle = 2;
                    break;
                case "星期二":
                    this.endCycle = 3;
                    break;
                case "星期三":
                    this.endCycle = 4;
                    break;
                case "星期四":
                    this.endCycle = 5;
                    break;
                case "星期五":
                    this.endCycle = 6;
                    break;
                case "星期六":
                    this.endCycle = 7;
                    break;
                }
            }
            this.list = [];
            row.timelist.forEach((item)=>{
                this.list.push({times: item.time, switchs: item.startFlag == 1 ? true : false});
            })
            this.device = [];
            row.devicelist.forEach((item)=>{
                let arr = [];
                arr.push(item.buildingId);
                arr.push(item.buildingId+","+item.floorId+","+item.roomId);
                arr.push(item.buildingId+","+item.dataType+","+item.deviceId+","+item.floorId+","+item.roomId);
                this.device.push(arr);
            })
        },
        changes(row) {
            this.taskId = row.taskId;
            this.initData(0);
            this.selfFlg = 1;
            this.dialogVisible1 = true;
            this.msg = "修改";
            this.effectiveChange = ''+row.effective;
            this.task1 = row.comment;
            this.currentIndex = row.flag;
            if(row.flag == 0) {
                this.startTime1 = row.startTime;
                this.endTime1 = row.endTime;
            }else if(row.flag == 1) {
                switch (row.startTime) {
                case "星期日":
                    this.startCycle = 1;
                break;
                case "星期一":
                    this.startCycle = 2;
                    break;
                case "星期二":
                    this.startCycle = 3;
                    break;
                case "星期三":
                    this.startCycle = 4;
                    break;
                case "星期四":
                    this.startCycle = 5;
                    break;
                case "星期五":
                    this.startCycle = 6;
                    break;
                case "星期六":
                    this.startCycle = 7;
                    break;
                }
            switch (row.endTime) {
                case "星期日":
                    this.endCycle = 1;
                break;
                case "星期一":
                    this.endCycle = 2;
                    break;
                case "星期二":
                    this.endCycle = 3;
                    break;
                case "星期三":
                    this.endCycle = 4;
                    break;
                case "星期四":
                    this.endCycle = 5;
                    break;
                case "星期五":
                    this.endCycle = 6;
                    break;
                case "星期六":
                    this.endCycle = 7;
                    break;
                }
            }
            this.list = [];
            row.timelist.forEach((item)=>{
                this.list.push({times: item.time, switchs: item.startFlag == 1 ? true : false});
            })
            this.device = [];
            row.devicelist.forEach((item)=>{
                let arr = [];
                arr.push(item.buildingId);
                arr.push(item.buildingId+","+item.floorId+","+item.roomId);
                arr.push(item.buildingId+","+item.dataType+","+item.deviceId+","+item.floorId+","+item.roomId);
                this.device.push(arr);
            })
        },
        remove(row) {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    taskId: row.taskId
                }
                this.$axios.post("BMPlatServers/common/deleteLampTask", this.$qs.stringify(params)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.warning({
                            message: '删除成功',
                            showClose: true,
                            duration: 1000
                        })
                        this.initList(1);
                        this.currentPage = 1;
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            }).catch(() => {})
        },
        sure() {
            this.list.forEach((item)=>{
                item.switchs ? item.switchs = 1 : item.switchs = 0;
            })
            for(let i = 0; i < this.list.length; i++) {
                for(let j = i + 1; j < this.list.length ; j++) {
                    if(this.list[i].times.split(":")[0] == this.list[j].times.split(":")[0] && this.list[i].times.split(":")[1] == this.list[j].times.split(":")[1]) {
                        this.list.splice(i, 1);
                    }
                }
            }
            this.devicelist = [];
            this.device.forEach((item)=>{
                this.devicelist.push({
                    buildingId: item[2].split(",")[0],
                    dataType: item[2].split(",")[1],
                    deviceId: item[2].split(",")[2],
                    floorId: item[2].split(",")[3],
                    roomId: item[2].split(",")[4]
                })
            })
            if(!this.task1) {
                this.$notify.warning({
                    message: '请填写任务名称',
                    title: '警告'
                })
                return false;
            }
            if(this.currentIndex == 0) {
                if(!this.startTime1 || !this.endTime1) {
                    this.$notify.warning({
                        message: '请填写时间',
                        title: '警告'
                    })
                    return false;
                }
            }else if(this.currentIndex == 1) {
                if(!this.startCycle || !this.endCycle) {
                    this.$notify.warning({
                        message: '请填写时间',
                        title: '警告'
                    })
                    return false;
                }
            }
            if(this.list.length == 0) {
                this.$notify.warning({
                    message: '请填写时间',
                    title: '警告'
                })
                return false;
            }
            if(this.devicelist.length == 0) {
                this.$notify.warning({
                    message: '请填写设备',
                    title: '警告'
                })
                return false;
            }
            let params = {
                startTime: this.currentIndex == 0 ? this.startTime1 : '',
                endTime: this.currentIndex == 0 ? this.endTime1 : '',
                startWeek: this.currentIndex == 1 ? this.startCycle : '',
                endWeek: this.currentIndex == 1 ? this.endCycle : '',
                comment: this.task1,
                flag: this.currentIndex,
                timelist: JSON.stringify(this.list),
                devicelist: JSON.stringify(this.devicelist),
                taskId: this.taskId,
                effective: this.effectiveChange
            }
            this.dialogVisible1 = false;
            this.$axios.post("BMPlatServers/common/updateLampTask", this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                this.dialogVisible = false;
                if(res.data.success) {
                    this.$message.success({
                        message: "操作成功",
                        showClose: true,
                        duration: 1000
                    })
                    this.initList(1);
                    this.currentPage = 1;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        isOK(row) {
            this.$confirm('是否改为生效?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    effective: 1,
                    taskId: row.taskId
                }
                this.$axios.post("BMPlatServers/common/updateLampTaskStatus", this.$qs.stringify(params)).then((res)=>{
                   // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
                            message: "操作成功",
                            showClose: true
                        })
                        this.initList(1);
                        this.currentPage = 1;
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true
                        })
                    }
               })
            }).catch(() => {})
        },
        isOKNo(row) {
            this.$confirm('是否改为失效?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    effective: 0,
                    taskId: row.taskId
                }
                this.$axios.post("BMPlatServers/common/updateLampTaskStatus", this.$qs.stringify(params)).then((res)=>{
                   // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
                            message: "操作成功",
                            showClose: true
                        })
                        this.initList(1);
                        this.currentPage = 1;
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true
                        })
                    }
               })
            }).catch(() => {})
        }
    },
    mounted() {
        this.initList(1);
    },
    watch: {
        currentIndex(oldData) {
            if(oldData == 0) {
                this.startCycle = '';
                this.endCycle = '';
            }else if(oldData == 1) {
                this.startTime = '';
                this.endTime = '';
            }
        },
        deviceid(oldData) {
            this.devicelist = [];
            if(oldData && oldData.length) {
                oldData.forEach((item)=>{
                    this.devicelist.push({
                        buildingId: item.split(",")[0],
                        dataType: item.split(",")[1],
                        deviceId: item.split(",")[2],
                        floorId: item.split(",")[3],
                        roomId: item.split(",")[4],
                    })
                })
            }else{
                this.devicelist = [];
            }
        },
        deviceid1(oldData) {
            this.devicelist = [];
            if(oldData && oldData.length) {
                oldData.forEach((item)=>{
                    this.devicelist.push({
                        buildingId: item.split(",")[0],
                        dataType: item.split(",")[1],
                        deviceId: item.split(",")[2],
                        floorId: item.split(",")[3],
                        roomId: item.split(",")[4],
                    })
                })
            }else{
                this.devicelist = [];
            }
        },
        tableData(oldData) {
            oldData.forEach((item)=>{
                switch (item.startTime) {
                    case "1":
                        item.startTime = "星期日"
                        break;
                    case "2":
                        item.startTime = "星期一"
                        break;
                    case "3":
                        item.startTime = "星期二"
                        break;
                    case "4":
                        item.startTime = "星期三"
                        break;
                    case "5":
                        item.startTime = "星期四"
                        break;
                    case "6":
                        item.startTime = "星期五"
                        break;
                    case "7":
                        item.startTime = "星期六"
                        break;
                }
            })
            oldData.forEach((item)=>{
                switch (item.endTime) {
                    case "1":
                        item.endTime = "星期日"
                        break;
                    case "2":
                        item.endTime = "星期一"
                        break;
                    case "3":
                        item.endTime = "星期二"
                        break;
                    case "4":
                        item.endTime = "星期三"
                        break;
                    case "5":
                        item.endTime = "星期四"
                        break;
                    case "6":
                        item.endTime = "星期五"
                        break;
                    case "7":
                        item.endTime = "星期六"
                        break;
                }
            })
            this.tableData = oldData;
        },
        // effectiveChange(oldData) {
        //     console.log(this.effectiveNum);
        //     if(this.effectiveNum == 0) {
        //         this.effectiveNum++;
        //     }else {
        //         let params = {
        //             effective: oldData,
        //             taskId: this.taskId
        //         }
        //         this.$axios.post("BMPlatServers/common/updateLampTaskStatus", this.$qs.stringify(params)).then((res)=>{
        //             // console.log(res);
        //             if(res.data.success) {
        //                 console.log("成功");
        //             }else{
        //                 console.log("失败");
        //             }
        //         })
        //     }
        // }
    }
}
</script>

<style lang="scss" scoped>
#lampControl{
    .lampControl{
        .headers{
            .span1{
                color: #606266;
            }
            .el-input{
                width: 20%;
                min-width: 120px;
            }
            .btn{
                margin-left: 40px;
            }
        }
        .dmaPagination{
            text-align: right;
            padding-top: 15px
        }
        .dialog-main{
            .top1{
                .span2{
                    color: #606266;
                }
                .el-input{
                    width: 80%;
                    min-width: 80px;
                    margin-left: 15px;
                }
            }
            .top2{
                margin-top: 15px;
                .span3{
                    color: #606266;
                }
                .ul1{
                    display: inline-block;
                    margin-left: 15px;
                    overflow: hidden;
                    position: relative;
                    top: 6px;
                    li{
                        float: left;
                        padding: 5px 14px;
                        border: 1px solid #DCDFE6;
                        cursor: pointer;
                        font-size: 12px;
                    }
                    li:first-child{
                        border-right: 0;
                        border-radius: 3px 0 0px 3px;
                    }
                    li:last-child{
                        border-radius: 0px 3px 3px 0;
                    }
                    li.active{
                        background: #409eff;
                        color: #fff;
                        border: 1px solid #409eff;
                    }
                }
            }
            .top3{
                margin-top: 20px;
            }
            .top4{
                margin-top: 20px;
                .icon{
                    font-size: 28px;
                    color: #409eff;
                    font-weight: bold;
                    cursor: pointer;
                }
                .times{
                    margin-top: 20px;
                    .el-switch{
                        margin-left: 10%;
                    }
                    .delete{
                        font-size: 22px;
                        font-weight: bold;
                        color: #409eff;
                        position: relative;
                        left: 10%;
                        top: 5px;
                        cursor: pointer;
                    }
                }
            }
            .top5{
                margin-top: 20px;
                border-top: 2px dashed #DCDFE6;
                padding-top: 20px;
                .el-cascader{
                    width: 60%;
                }
            }
            .top6{
                margin-top: 20px;
                padding-top: 20px;
                border-top: 2px dashed #DCDFE6;
                .span6{
                    margin-right: 18px;
                }
                /ddep/ .el-radio{
                    margin-right: 6px !important;
                }
                /deep/ .el-radio__label{
                    padding-left: 4px !important;
                }
            }
        }
    }
}
</style>
