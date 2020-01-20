<template>
    <div id="airHistory">
        <div class="airHistory">
            <div class="top-search">
                <span>告警时间</span>
                <el-date-picker v-model="timer" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
                <span>告警状态</span>
                <el-select v-model="alarmStatus" clearable placeholder="请选择" filterable>
                    <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            </div>

            <div class="middle-table">
                <el-table :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}"   :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
                    <el-table-column prop="deviceName" label="设备名称" width="180" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="status" label="告警状态" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="typeComment" label="告警类型"  align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="degree" label="告警级别"  align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="warningTime" label="告警时间" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column prop="warningVal" label="告警值"  align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="maxVal" label="最大值"  align='center' :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="minVal" label="最小值"  align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="personName" label="处理人"  align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="completeTime" label="处理时间" :show-overflow-tooltip="true"  align='center' width="120"></el-table-column>
                    <el-table-column prop="reason" label="告警原因"  align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="solution" label="解决方法"  align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="result" label="处理结果"  align='center' :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </div>

            <div class="bottom-pagnation">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../../../../static/js/bus.js';
export default {
    data() {
        return{
            timer: '',
            tableData: [],
            alarmStatus: '',
            status: [],
            person: [],
            alart: {reason: '', Person: '', num: '', time: ''},
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
			nowStatus:1,
			warningId:'',
			idphone:'',
			personId:'',
			phone:'',
			reason:'',
			time:'',
            ID: 0,
            Id: 0,
            solution: '',
            manageReason: '',
			startTime:'',
			endTime:''
        }
    },
    methods: {
		initData() {
    		//查询所有的报警状态
            let data = {
                flag: 2
            }
    		this.$axios.post(`BMPlatServers/warn/queryAllStatus`, this.$qs.stringify(data)).then((response) => {
				if(response.data.success){
                    this.status = [];
                    if(response.data.result && response.data.result.length) {
                        response.data.result.forEach((item)=>{
    						this.status.push({value:item.status,label:item.message});
    					})
                    }
				}else{
                    this.status = [];
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
				}
		   });
		},
        handleClick(row) {
			this.$axios.post(`BMPlatServers/warn/queryAllPersons`).then((response) => {
				if(response.data.success){
                    this.person = [];
                    if(response.data.result && response.data.result.length) {
                        response.data.result.forEach((item)=>{
    						this.person.push({label:item.name,value:item.id+","+item.phone})
    					})
                    }
				}else{
                    this.person = [];
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
				}
			});
            this.dialogVisible = true;
			this.warningId = row.id;
        },

        // 处理按钮
        handleClickManage(row) {
            this.dialogVisibleManage = true;
            this.ID = row.id;
        },

        // 假告警按钮
        handleClickFalse(row) {
            this.Id = row.id;
            this.dialogVisibleFalse = true;
        },

        // 告警确认按钮
        handleAlart() {
			let param = {
				flag:1,
				id:this.warningId,
				reason:this.reason,
				personId:this.personId,
				phone:this.phone,
				complete:this.time
			}
			this.$axios.post(`BMPlatServers/warn/updateSystemWarnings`,this.$qs.stringify(param)).then((response) => {
				if(response.data.success){
                    this.$message.success({
                        message: '您已经处理了该条告警',
                        showClose: true,
                        duration: 1000
                    })
                    this.dialogVisible = false;
                    // 刷新接口
                    this.initTabelData();
                    // 刷新兄弟的接口
                    bus.$emit('updateData', 'updateData');
                    // 清空模态框的值
                    this.reason = '';
                    this.idphone = '';
                    this.phone = '';
                    this.time = '';
				}else{
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
				}
			});
        },

        // 处理确认按钮
        handleAlartManage() {
            let param = {
                flag:3,
				id:this.ID,
				solution: this.solution,
                result: this.manageReason
            };
            this.$axios.post(`BMPlatServers/warn/updateSystemWarnings`, this.$qs.stringify(param)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.solution = '';
                    this.manageReason = '';
                    this.$message.success({
                        message: '您已经处理了该条告警',
                        showClose: true,
                        duration: 1000
                    })
                    this.dialogVisibleManage = false;
                    // 刷新接口
                    this.initTabelData();
                    // 刷新兄弟的接口
                    bus.$emit('updateData', 'updateData');
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 假告警确认按钮
        trueAlermFalse() {
            let param = {
                flag:2,
				id:this.Id
            };
            this.$axios.post(`BMPlatServers/warn/updateSystemWarnings`, this.$qs.stringify(param)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.$message.success({
                        message: '您已经处理了该条告警',
                        showClose: true,
                        duration: 1000
                    })
                    this.dialogVisibleFalse = false;
                    // 刷新接口
                    this.initTabelData();
                    // 刷新兄弟的接口
                    bus.$emit('updateData', 'updateData');
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 模态框里面的取消按钮
        cancel() {
            this.reason = '';
            this.idphone = '';
            this.phone = '';
            this.time = '';
            this.dialogVisible = false;
        },
        manageCancel() {
            this.solution = '';
            this.manageReason = '';
            this.dialogVisibleManage = false;
        },
		search(){
            this.currentPage = 1;
            this.initTabelData();
		},

        initTabelData() {
            let param = {
				systemId:4,
				status:this.alarmStatus,
				startTime:this.startTime,
				endTime:this.endTime,
                pageSize: this.pageSize,
                currentPage: this.currentPage,
                flag: 2
			}
            // console.log(param);
			this.$axios.post(`BMPlatServers/warn/querySystemWarning`,this.$qs.stringify(param)).then((response) => {
                // console.log(response);
				if(response.data.success){
                    this.tableData = response.data.result.array;
					this.pageTotal = response.data.result.num;
				}else{
                    this.tableData = [];
                    this.pageTotal = 0;
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
				}
			});
        },

        handleCurrentChange(val) {
            let param = {
				systemId:4,
				status:this.alarmStatus,
				startTime:this.startTime,
				endTime:this.endTime,
                pageSize: this.pageSize,
                currentPage: val,
                flag: 2
			}
			this.$axios.post(`BMPlatServers/warn/querySystemWarning`,this.$qs.stringify(param)).then((response) => {
                // console.log(response);
				if(response.data.success){
                    this.tableData = response.data.result.array;
					this.pageTotal = response.data.result.num;
				}else{
                    this.tableData = [];
                    this.pageTotal = 0;
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
				}
			});
        }
    },
    mounted() {
		this.initData();
        this.initTabelData();
    },
	watch:{
		idphone(item){
			this.personId=item.split(",")[0]
			this.phone=item.split(",")[1]
		},
		timer(item){
			if(item==null){
				this.startTime = "";
				this.endTime = "";
			}else {
				this.startTime = item[0];
				this.endTime = item[1];
			}
		}
	}
}
</script>

<style lang="scss" scoped>
#airHistory{
	padding:20px 15px;
    .airHistory{
		padding:20px 10px;
		box-shadow: 0 0 6px #ddd;
		-webkit-box-shadow: 0 0 6px #ddd;
		-moz-box-shadow: 0 0 6px #ddd;
		-o-box-shadow: 0 0 6px #ddd;
        .top-search{
            .el-input{
                width: 200px;
            }
        }
        .middle-table{
            margin: 20px 0;
        }
        .bottom-pagnation{
            text-align: right;
            padding: 30px;
        }
        /deep/ .el-input.is-disabled .el-input__inner{
            background: #fff;
            color: #333;
        }
        .el-input{
            // width: 300px;
        }
        .el-input.is-disabled .el-input__inner{
            background: #fff;
            color: #606266;
        }
    }
}
</style>
