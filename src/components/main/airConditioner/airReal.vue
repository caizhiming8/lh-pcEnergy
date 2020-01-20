<template>
    <div id="airReal">
        <div class="airReal">
            <div class="alarmLeft" v-loading="loading">
                <div class="echarts" ref="Echarts1"></div>
            </div>
            <div class="alarmRight" v-loading="loading">
                <div class="echarts" ref="Echarts2"></div>
            </div>
        </div>

		<div id="flowAlart">
		    <div class="flowAlart">
		        <div class="top-search">
		            <span>告警时间</span>
		            <el-date-picker v-model="timer" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
		            <span>告警状态</span>
		            <el-select v-model="alarmStatus" clearable placeholder="请选择" filterable>
		                <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
		            </el-select>
		            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
		        </div>

		        <div class="middle-table">
		            <el-table :data="tableData" style="width: 100%; margin-top:20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
		                <el-table-column prop="deviceName" label="设备名称" width="180" align='center'></el-table-column>
		                <el-table-column prop="status" label="告警当前状态" align='center'></el-table-column>
		                <el-table-column prop="typeComment" label="告警类型"  align='center'></el-table-column>
		                <el-table-column prop="degree" label="告警级别"  align='center'></el-table-column>
		                <el-table-column prop="warningTime" label="告警时间" :show-overflow-tooltip="true" align='center'></el-table-column>
		                <el-table-column prop="warningVal" label="告警值"  align='center'></el-table-column>
		                <el-table-column prop="maxVal" label="最大值"  align='center'></el-table-column>
						<el-table-column prop="minVal" label="最小值"  align='center'></el-table-column>
		                <el-table-column label="操作" width="200" align='center'>
		                    <template slot-scope="scope">
		                        <el-button @click="handleClick(scope.row)" size="small" v-if="scope.row.warningStatus==1" type="danger">告警</el-button>
		                        <el-button @click="handleClickManage(scope.row)" size="small" v-if="scope.row.warningStatus==2" type="success">处理</el-button>
								<el-button @click="handleClickFalse(scope.row)" size="small" v-if="scope.row.warningStatus==1" type="warning">误告警</el-button>
		                    </template>
		                 </el-table-column>
		            </el-table>
		        </div>

		        <div class="bottom-pagnation">
		            <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
		        </div>

		        <!-- 告警模态框 -->
		        <el-dialog title=告警提示 :visible.sync="dialogVisible" width="40%">
		            <div class="el-form">
		                <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
		                    <el-form-item label="告警原因" required>
		                        <el-input v-model="reason" style="width: 400px;"></el-input>
		                    </el-form-item>
		                    <el-form-item label="指派人员" required>
		                        <el-select v-model="idphone" placeholder="请选择" clearable filterable class="seletes" style="width: 130px;">
		                            <el-option v-for="(item, index) in person" :key="index" :label='item.label' :value="item.value"></el-option>
		                        </el-select>
		                    </el-form-item>
		                    <el-form-item label="指派人电话" required>
		                        <el-input v-model="phone" disabled style="width: 200px;"></el-input>
		                    </el-form-item>
		                    <el-form-item label="完成时间" required>
		                        <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
		                    </el-form-item>
		                </el-form>
		            </div>
		            <span slot="footer" class="dialog-footer">
		                <el-button @click="cancel" size="small">取 消</el-button>
		                <el-button type="primary" @click="handleAlart" size="small">确 定</el-button>
		            </span>
		        </el-dialog>

		        <!-- 处理模态框 -->
		        <el-dialog title=告警提示 :visible.sync="dialogVisibleManage" width="40%">
		            <div class="el-form">
		                <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
		                    <el-form-item label="处理方法" required>
		                        <el-input v-model="solution" style="width: 400px;"></el-input>
		                    </el-form-item>
		                    <el-form-item label="处理结果" required>
		                        <el-input v-model="manageReason" style="width: 400px;"></el-input>
		                    </el-form-item>
		                </el-form>
		            </div>
		            <span slot="footer" class="dialog-footer">
		                <el-button @click="manageCancel" size="small">取 消</el-button>
		                <el-button type="primary" @click="handleAlartManage" size="small">确 定</el-button>
		            </span>
		        </el-dialog>

		        <!-- 假告警模态框 -->
		        <el-dialog title="提示" :visible.sync="dialogVisibleFalse" width="30%">
                    <span>原因：</span>
                    <el-input v-model="alertReason"></el-input>
		            <span slot="footer" class="dialog-footer">
		                <el-button @click="dialogVisibleFalse = false" size="small">取 消</el-button>
		                <el-button type="primary" @click="trueAlermFalse" size="small">确 定</el-button>
		            </span>
		        </el-dialog>
		    </div>
		</div>
    </div>

</template>

<script>
import bus from '../../../../static/js/bus.js';
import QS from 'qs'
export default {
    data() {
        return{
			arr:[],
			arrm:[],
			starr:[],
			starrm:[],
			loading:true,
            allnum:0,
			allnum1:0,

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
			endTime:'',
            alertReason: ''
		}
    },
    methods: {
        init() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '总告警条数',
                    subtext: this.allnum,
                    x: 'center',
                    y: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} 条 ({d}%)"
                },
                color: ['#FF908F', '#8693F3', '#08A9FE'],
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:this.arrm
                },
                series: [
                    {
                        name:'告警级别',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.arr
                    }
                ]
            };
            myEcharts1.setOption(option1);

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                    text: '总告警条数',
                    subtext: this.allnum1,
                    x: 'center',
                    y: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} 条 ({d}%)"
                },
                color: ['#08A9FE', '#8693F3', '#FCC667', '#FF908F'],
                legend: {
                    orient: 'vertical',
                    x: '15px',
                    data:this.starrm
                },
                series: [
                    {
                        name:'告警类型',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.starr
                    }
                ]
            };
            myEcharts2.setOption(option2);
        },
		initData() {
			let param = {
				systemId:4
			}
		    //查询各等级的报警数量
		    this.$axios.post(`BMPlatServers/warn/queryWarningDegree`,this.$qs.stringify(param)).then((response) => {
                // console.log(response);
				if(response.data.success){
                    this.arr = [];
                    this.arrm = [];
                    this.allnum = 0;
                    if(response.data.result && response.data.result.length) {
                        response.data.result.forEach((item)=>{
    						this.arr.push({value:item.number,name:item.message});
    						this.arrm.push(item.message);
    						this.allnum += item.number;
    					})
                        this.allnum = "" + this.allnum;
                        this.init();
            			this.loading=false;
                    }else{
                        this.arr.push({value:0,name:'没有告警'});
                        this.arrm.push('没有告警');
                        this.allnum = "0";
                        this.init();
            			this.loading=false;
                    }
				}else{
                    this.loading=false;
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
				}
			});
			//查询各状态的报警数量
		    this.$axios.post(`BMPlatServers/warn/queryWarningStatus`,this.$qs.stringify(param)).then((response) => {
                // console.log(response);
				if(response.data.success){
                    this.starr = [];
                    this.starrm = [];
                    this.allnum1 = 0;
                    if(response.data.result && response.data.result.length) {
                        response.data.result.forEach((item)=>{
    						this.starr.push({value:item.number,name:item.message});
    						this.starrm.push(item.message);
    						this.allnum1 += item.number;
    					})
                        this.allnum1 = "" + this.allnum1;
                        this.init();
            			this.loading=false;
                    }else{
                        this.starr.push({value:0,name:'没有告警'});
                        this.starrm.push('没有告警');
                        this.allnum1 = "0";
                        this.init();
            			this.loading=false;
                    }
				}else{
                    this.loading=false;
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
				}
			});
		},
		initAllStatus() {
		    //查询所有的报警状态
            let data = {
                flag: 1
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
            this.alertReason = '';
		},

		// 告警确认按钮
		handleAlart() {
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
            if(this.time == '' || this.time == null) {
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
				id:this.Id,
                alertReason: this.alertReason
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
                flag: 1
			}
		    // console.log(param);
			this.$axios.post(`BMPlatServers/warn/querySystemWarning`,this.$qs.stringify(param)).then((response) => {
		        // console.log(response);
				if(response.data.success){
		            this.tableData = response.data.result.array;
					this.pageTotal = response.data.result.num;
				}else{
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
                flag: 1
			}
			this.$axios.post(`BMPlatServers/warn/querySystemWarning`,this.$qs.stringify(param)).then((response) => {
				// console.log(response);
				if(response.data.success){
					this.tableData = response.data.result.array;
					this.pageTotal = response.data.result.num;
				}else{
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
		this.initAllStatus();
		this.initTabelData();
        bus.$on('updateData', (updateData)=>{
            this.initData();
        })
    },
	watch:{
		idphone(item){
			this.personId=item.split(",")[0]
			this.phone=item.split(",")[1]
		},
		timer(item){
			if(item==null){
				this.startTime = '';
				this.endTime = '';
			}else {
				this.startTime = item[0];
				this.endTime = item[1];
			}
		}
	}
}
</script>

<style lang="scss" scoped>
#airReal{
	padding:20px 15px;
    .airReal{
		padding:20px 10px;
		box-shadow: 0 0 6px #ddd;
		-webkit-box-shadow: 0 0 6px #ddd;
		-moz-box-shadow: 0 0 6px #ddd;
		-o-box-shadow: 0 0 6px #ddd;
        overflow: hidden;
        .alarmLeft{
            float: left;
            width: 49%;
            border-right: 1px solid #ddd;
        }
        .alarmRight{
            float: left;
            width: 50%;
        }
        .echarts{
            width: 100%;
            height: 300px;
        }
    }
	.flowAlart{
	    margin-top: 40px;
		.bottom-pagnation{
			float:right;
			padding: 30px;
		}
        /deep/ .el-input.is-disabled .el-input__inner{
            background: #fff;
            color: #333;
        }
	}

}
</style>
