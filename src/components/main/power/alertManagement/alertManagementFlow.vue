<template>
    <div id="alertManagementFlow">
		<div class="alertManagementFlow">
			<div class="top-search">
			    <span>告警时间</span>
			    <el-date-picker v-model="timer" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
			    <span>告警状态</span>
			    <el-select v-model="alarmStatus" clearable placeholder="请选择" filterable>
			        <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
			    </el-select>
			    <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
			</div>

			<!-- 告警表 -->

			<div class="middle-table">
				<el-table :data="tableData" :default-sort = "{prop: 'date', order: 'descending'}" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
					<el-table-column type="index" label="序号" align='center'>
					    <template slot-scope="scope">
					        <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
					    </template>
					</el-table-column>
					<el-table-column prop="deviceName" label="设备名称" width="180" align='center'></el-table-column>
					<el-table-column prop="status" label="告警当前状态" align='center'></el-table-column>
					<el-table-column prop="typeComment" label="告警类型" sortable align='center'></el-table-column>
					<el-table-column prop="degree" label="告警级别" sortable align='center'></el-table-column>
					<el-table-column prop="warningTime" label="告警时间" :show-overflow-tooltip="true" align='center'></el-table-column>
					<el-table-column prop="warningVal" label="告警值" sortable align='center'></el-table-column>
					<el-table-column prop="maxVal" label="最大值" sortable align='center'></el-table-column>
					<el-table-column prop="minVal" label="最小值" sortable align='center'></el-table-column>
					<el-table-column label="操作" width="250" align='center'>
					    <template slot-scope="scope">
					        <el-button @click="handleClick(scope.row)" size="small" v-if="scope.row.warningStatus==1" type="confirm">确认</el-button>
					        <el-button @click="handleClickManage(scope.row)" size="small" v-if="scope.row.warningStatus==2" type="success">处理</el-button>
							<el-button @click="handleClickFalse(scope.row)" size="small" v-if="scope.row.warningStatus==1" type="warning">假告警</el-button>
					    </template>
					</el-table-column>
				</el-table>
			</div>

			<!-- 分页 -->

			<div class="bottom-pagnation">
			    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
			</div>

			<!-- 确认告警 -->

			<el-dialog title=确认告警 :visible.sync="dialogVisible" width="40%">
			    <div class="el-form">
			        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
			            <el-form-item label="告警原因" :required="true">
			                <el-input v-model="reason" style="width: 400px;"></el-input>
			            </el-form-item>
			            <el-form-item label="指派人员" :required="true">
			                <el-select v-model="idphone" placeholder="请选择" clearable filterable class="seletes" style="width: 130px;">
			                    <el-option v-for="(item, index) in person" :key="index" :label='item.label' :value="item.value"></el-option>
			                </el-select>
			            </el-form-item>
			            <el-form-item label="指派人电话" :required="true">
			                <el-input v-model="phone" disabled style="width: 200px;"></el-input>
			            </el-form-item>
			            <el-form-item label="完成时间" :required="true">
			                <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
			            </el-form-item>
			        </el-form>
			    </div>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="cancel" size="small">取 消</el-button>
			        <el-button type="primary" @click="handleAlart" size="small">确 定</el-button>
			    </span>
			</el-dialog>

			<!-- 处理弹窗 -->

			<el-dialog title=处理告警 :visible.sync="dialogVisibleManage" width="40%">
				<div class="el-form">
					<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
					    <el-form-item label="处理方法" :required="true">
					        <el-input v-model="solution" style="width: 400px;"></el-input>
					    </el-form-item>
					    <el-form-item label="处理结果" :required="true">
					        <el-input v-model="manageReason" style="width: 400px;"></el-input>
					    </el-form-item>
					</el-form>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button @click="manageCancel" size="small">取 消</el-button>
				    <el-button type="primary" @click="handleAlartManage" size="small">确 定</el-button>
				</span>
			</el-dialog>

			<!-- 非告警 -->

			 <el-dialog title="假告警" :visible.sync="dialogVisibleFalse" width="30%">
			    <span>确定要点击假告警吗？</span>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="dialogVisibleFalse = false" size="small">取 消</el-button>
			        <el-button type="primary" @click="trueAlermFalse" size="small">确 定</el-button>
			    </span>
			</el-dialog>

		</div>
    </div>
</template>

<script>
export default {
    data() {
        return{
			timer: '',
			tableData: [],
			alarmStatus: '',
			dialogVisible: false,
			dialogVisibleManage: false,
			dialogVisibleFalse: false,
			status: [],
			person: [],
			alart: {reason: '', Person: '', num: '', time: ''},
			currentPage: 1,
			pageSize: 5,
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
			val: 1,
            startTime: '',
            endTime: ''
        }

    },
    methods: {
		initData(){
			//查询所有的报警状态
            let datas = {
                flag: 1
            }
			this.$axios.post(`BMPlatServers/warn/queryAllStatus`, this.$qs.stringify(datas)).then((response) => {
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
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},

		/* 点击确认事件 */

		handleClick(row){
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
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
			this.dialogVisible = true;
			this.warningId = row.id;
		},

		/* 点击处理事件 */
		handleClickManage(row){
			this.dialogVisibleManage = true;
			this.ID = row.id;
		},

		/* 点击非告警事件 */
		handleClickFalse(row){
			this.dialogVisibleFalse = true;
			this.Id = row.id;
		},

		/* 确认-告警 */
		handleAlart(){
            if(!this.reason) {
                this.$notify.warning({
                    title: '警告',
                    message: '请填写告警原因',
                    duration: 3000
                })
                return false;
            }
            if(!this.idphone) {
                this.$notify.warning({
                    title: '警告',
                    message: '请指派人员',
                    duration: 3000
                })
                return false;
            }
            if(!this.time || this.time == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请填写完成时间',
                    duration: 3000
                })
                return false;
            }
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
						message: '您已处理该条告警',
                        showClose: true,
                        duration: 1000,
					});
			        this.dialogVisible = false;
			        // 刷新接口
			        this.initTabelData();
			        /* // 刷新兄弟的接口
			        bus.$emit('updateData', 'updateData'); */
			        // 清空模态框的值
			        this.reason = '';
			        this.idphone = '';
			        this.phone = '';
			        this.time = '';
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			});
		},

		/* 确认-处理 */
		handleAlartManage(){
            if(!this.solution) {
                this.$notify.warning({
                    title: '警告',
                    message: '请填写处理方法',
                    duration: 3000
                })
                return false;
            }
            if(!this.manageReason) {
                this.$notify.warning({
                    title: '警告',
                    message: '请填写处理结果',
                    duration: 3000
                })
                return false;
            }
			let param = {
			    flag:3,
				id:this.ID,
				solution: this.solution,
			    result: this.manageReason
			};
			this.$axios.post(`BMPlatServers/warn/updateSystemWarnings`, this.$qs.stringify(param)).then((res)=>{
			    // console.log(res);
			    if(res.data.success) {
			        this.solution = '';
			        this.manageReason = '';
			        this.$message.success({
						message: '您已处理该条告警',
                        showClose: true,
                        duration: 1000,
					});
			        this.dialogVisibleManage = false;
			        // 刷新接口
			        this.initTabelData();
			       /* // 刷新兄弟的接口
			        bus.$emit('updateData', 'updateData'); */
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
			    }
			})
		},

		/* 确认-假告警 */
		 trueAlermFalse(){
			 let param = {
			    flag:2,
			 	id:this.Id
			 };
			 this.$axios.post(`BMPlatServers/warn/updateSystemWarnings`, this.$qs.stringify(param)).then((res)=>{
			     // console.log(res);
			     if(res.data.success) {
			         this.$message.success({
						message: '您已处理该条告警',
                        showClose: true,
                        duration: 1000,
					});
			         this.dialogVisibleFalse = false;
			         // 刷新接口
			         this.initTabelData();
			        /* // 刷新兄弟的接口
			         bus.$emit('updateData', 'updateData'); */
			     }else{
			         this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
			     }
			 })
		 },

		 /* 模态框取消 */
		 cancel(){
			this.reason = '';
			this.idphone = '';
			this.phone = '';
			this.time = '';
			this.dialogVisible = false;
		 },
		 manageCancel(){
			 this.solution = '';
			 this.manageReason = '';
			 this.dialogVisibleManage = false;
		 },
		 /* 搜索*/
		 search(){
			 this.val = 1;
		     this.initTabelData();
		 },
		 /* 显示表信息*/
		 initTabelData(){
			let param = {
				systemId:2,
				status:this.alarmStatus,
				startTime:this.startTime,
				endTime:this.endTime,
				pageSize: this.pageSize,
				currentPage: this.currentPage,
                flag: 1
			}
			// console.log(param);
			this.$axios.post(`BMPlatServers/warn/querySystemWarning`,this.$qs.stringify(param)).then((response) => {
				if(response.data.success){
					this.tableData = response.data.result.array;
					this.pageTotal = response.data.result.num;
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		 },

		 /* 分页 */
		 handleCurrentChange(val){
			 this.val = val;
			 let param = {
			 	systemId:2,
			 	status:this.alarmStatus,
			 	startTime:this.startTime,
			 	endTime:this.endTime,
			    pageSize: this.pageSize,
			    currentPage: val,
                flag: 1
			 }
			this.$axios.post(`BMPlatServers/warn/querySystemWarning`,this.$qs.stringify(param)).then((response) => {
			 	if(response.data.success){
			        this.tableData = response.data.result.array;
			 		this.pageTotal = response.data.result.num;
			 	}else{
			 		this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
			 	}
			});
		}
    },
    mounted() {
		this.initData();
		this.initTabelData();
    },
    watch: {
        idphone(item){
            if(item) {
                this.personId=item.split(",")[0]
            	this.phone=item.split(",")[1]
            }else{
                this.personId = [];
                this.phone = [];
            }
        },
        timer(oldData) {
            if(oldData == '' || oldData == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = oldData[0];
                this.endTime = oldData[1];
            }
        }
    }
}
</script>

<style lang="scss">
#alertManagementFlow{
	.alertManagementFlow{
		.middle-table{
		    margin: 20px 0;
		}
		.bottom-pagnation{
		    text-align: right;
		    padding: 30px;
		}
		.el-input.is-disabled .el-input__inner{
			background: #ffffff;
			color: #606266;
		}
	}
}
</style>
