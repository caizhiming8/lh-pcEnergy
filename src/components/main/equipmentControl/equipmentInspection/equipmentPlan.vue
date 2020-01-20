<template>
	<div id="equipmentPlan">
		<div class="equipmentPlan">
			<div class="addPlan">
				<template>
					<span>计划名称</span>
					<el-input v-model="nomenclature" style="width: 250px;"></el-input>
					<span class="span">归属系统</span>
					<el-select v-model="ascription" placeholder="请选择" clearable style="width: 120px;" @change="systemSelection">
					    <el-option v-for="item in systemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span v-if="subsystemState == 1" class="span">归属子系统</span>
					<el-select v-model="ascriptionSubsystem" placeholder="请选择" clearable style="width: 180px;" v-if="subsystemState == 1">
						<el-option v-for="item in subSystemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="span">巡检人</span>
					<el-select v-model="people" placeholder="请选择" clearable style="width: 110px;">
					    <el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="span">计划状态</span>
					<el-select v-model="plannedState" placeholder="请选择" clearable style="width: 110px;">
					    <el-option v-for="item in plannedStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<div style="margin-top: 20px;">
						<span>巡检周期</span>
						<el-input v-model="sunday" style="width: 70px;" :maxlength="3" oninput ="value=value.replace(/[^\d]/g,'')"></el-input>
						<el-select v-model="period" placeholder="周期" clearable style="width: 80px;">
						    <el-option v-for="item in periodList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<span class="span">巡检时间</span>
						<el-date-picker v-model="inspectionTime" type="datetime" value-format="yyyy-MM-dd HH:mm" placeholder="请选择时间"></el-date-picker>
						<el-button @click="selection()" type="primary" size="small" class="btn">设备选择</el-button>
						<el-button @click="deleteAll()" type="danger" size="small" class="btn">删除</el-button>
					</div>
				</template>
				<template>
					<!-- 设备展示 -->
					<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px;" @selection-change="selectRow" :cell-style="{padding:'8px 0px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="id" label="设备编码" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="type_name" label="设备类型" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="name" label="设备名称" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="systemName" label="归属系统" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="subSystemName" label="归属子系统" align='center'></el-table-column>
						<!-- <el-table-column label="操作" align='center'>
						    <template slot-scope="scope">
								<el-button @click="executionResult(scope.row)" size="small" type="warning">删除</el-button>
						    </template>
						</el-table-column> -->
					</el-table>
					<div class="returnPlan">
						<el-button @click="definitePlan" type="primary" size="small">确定</el-button>
						<el-button @click="cancelPlan" size="small">取消</el-button>
					</div>
				</template>
			</div>
			<!-- 设备选择 -->
			<div class="selection">
				<el-dialog title=设备选择 :visible.sync="selectEquipment" width="60%">
					<div style="float: left;">
						<span>设备系统</span>
						<el-select v-model="equipmentSystem" placeholder="请选择" clearable style="width: 180px;" @change="systemSelection">
						    <el-option v-for="item in systemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
					<div v-if="subsystemState == 1" style="float: left;">
						<span>设备子系统</span>
						<el-select v-model="equipmentSubsystem" placeholder="请选择" clearable style="width: 180px;">
						    <el-option v-for="item in subSystemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
					<el-button @click="search" style="margin-left: 10px;" type="primary" plain size="small">搜索</el-button>
					<div class="el-form">
						<el-table tooltip-effect="dark" :data="tableDataList" stripe style="width: 100%;" @selection-change="handleSelectionChange" ref="multipleTable" row-key="id">
							<el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="code" label="设备编码" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="type_name" label="设备类型" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="name" label="设备名称" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="systemName" label="归属系统" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="subSystemName" label="归属子系统" align='center'></el-table-column>
						</el-table>
						<div slot="footer" class="dialog-footer" style="margin-top: 10px;">
							<el-button type="primary" @click="handleAlart" size="small">确 定</el-button>
							<el-button @click="cancel" size="small">取 消</el-button>
							<div class="bottom-pagnation">
							    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
							</div>
						</div>
					</div>
				</el-dialog>
			</div>
		</div>
	</div>
</template>
<script>
import sesstion from '../../../../../static/js/session.js';
export default {
	data() {
		return{
			tableData: [],
			tableDataList: [],
			currentPage: 1,
			pageSize: 5,
			pageTotal: 1,
			people: '',
			nomenclature: '',
			subSystemList: [],
			inspectionTime: '',
			plannedState: '',
			plannedStateList: [{label: '启用', value: '0'}, {label: '禁用', value: '1'}],
			ascription: '',
			ascriptionSubsystem: '',
			subsystemState: 0,
			selectEquipment: false,
			multipleSelection: [],
			selectlistRow: [],
			systemList: [],
			equipmentSystem: '',
			equipmentSubsystem: '',
			peopleList: [],
			period: '',
			periodList:  [{value: 0,label: '年'},{value: 1,label: '月'},{value: 2,label: '日'}],
			sunday: '',
			yeshu: '',

		}
	},
	methods:{
		/* 系统选择 */
		system(){
			this.$axios.post(`BMPlatServers/common/querySystemTree`).then((res) =>{
				if(res.data.success){
					console.log(res)
					this.systemList = []
					res.data.result.forEach((item)=>{
						this.systemList.push({label: item.name, value: item.systemId});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 子系统选择 */
		systemSelection(id){
			let data = {
				systemId:id,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/findSubSystem`, this.$qs.stringify(data)).then((res) => {
				console.log(res)
				if(res.data.success){
					if(res.data.result.list[0].name != 0&&res.data.result.list[0].name != null){
						this.subsystemState = 1
						this.subSystemList = []
						res.data.result.list.forEach((item)=>{
							this.subSystemList.push({label: item.name, value: item.id});
						});
					}else{
						this.subSystemList = []
						this.subsystemState = 0
					}
				}else{
					this.subsystemState = 0
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 系统设备展现 */
		selection(){
			this.selectEquipment = true
			let data = {
				system_id: this.equipmentSystem,
				subsystem_id: this.equipmentSubsystem,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			this.$axios.post(`BMPlatServers/common/findDeviceinfo`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					if(res.data.success){
						this.tableDataList = []
						this.tableDataList = res.data.result.deviceTypeList;
						this.pageTotal = res.data.result.count;

						this.$nextTick(()=>{

							let newArr = this.$storage.get('multipleSelection');
							if(newArr && newArr.length) {
								newArr.forEach((outItem)=>{
									if(this.tableDataList && this.tableDataList.length) {
										this.tableDataList.forEach((innerItem)=>{
											if(innerItem.id == outItem.id) {
												// this.$refs.multipleTable.toggleRowSelecetion(outItem, true);
											}
										})
									}
								})
							}
						});
					}
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 责任人 */
		devicePeople(){
			this.$axios.post(`BMPlatServers/device/userList`).then((res) => {
				if(res.data.success){
					this.peopleList = []
					 res.data.result.list.forEach((item)=>{
					    this.peopleList.push({label: item.username, value: item.id});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 搜索 */
		search(){
			this.selection()
		},
		/* 分页 */
		handleCurrentChange(val){
			this.yeshu = val
			this.selection()
		},
		/* 设备添加 */
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.$storage.set('multipleSelection', val);
		},
		/* 设备展示 */
		selectRow (val) {
			this.selectlistRow = val
		},
		/* 全部删除 */
		deleteAll() {
			this.tableData
			this.selectlistRow
			this.selectlistRow.forEach((item, index)=>{
				this.tableData.forEach((innerItem, innerIndex)=>{
					if(item.id == innerItem.id) {
						this.tableData.splice(innerIndex, 1);
					}
				})
			})
		},
		/* 取消 */
		cancel() {
			this.tableDataList = []
			this.equipmentSystem = ''
			this.equipmentSubsystem = ''
			this.selectEquipment = false
		},
		/* 点击确定增加到页面数据表格 */
		handleAlart() {
			this.selectEquipment = false;
			this.tableData = this.tableData.concat(this.multipleSelection);
			let result = [];
		    let obj = {};
		    for(var i =0; i<this.tableData.length; i++) {
		        if(!obj[this.tableData[i].id]){
		            result.push(this.tableData[i]);
		            obj[this.tableData[i].id] = true;
		        }
		    }
			this.tableData = result;
			this.equipmentSystem = ''
			this.equipmentSubsystem = ''
		},
		/* 确定 */
		definitePlan() {
			/* &&this.plannedState != '' this.period != ''&& */
			if(this.sunday != ''&&this.nomenclature != ''&&this.ascription != ''&&this.inspectionTime != ''&&this.people != ''&&this.plannedState != ''){
				if(this.tableData != ''){
					console.log(this.tableData)
					 var json = JSON.stringify(this.tableData);
					let data = {
						period: this.sunday,
						period_flag: this.period,
						deviceInfo:json,
						name:this.nomenclature,
						system_id:this.ascription,
						subsystem_id:this.ascriptionSubsystem,
						time:this.inspectionTime,
						uid:this.people,
						status:this.plannedState
					}
					console.log(data)
					this.$axios.post(`BMPlatServers/device/insertexm`, this.$qs.stringify(data)).then((res) => {
						if(res.data.success){
							this.$message.warning({
								message: res.data.result,
								showClose: true,
								duration: 1000,
							})
							this.$emit('detailEmits');
						}else{
							this.$message.warning({
								message: res.data.resultMessage,
								showClose: true,
								duration: 1000,
							})
						}
					});
				}else{
					this.$message.warning({
                        message: '请选择装备',
						showClose: true,
						duration: 1000,
					})
				}
			}else{
				this.$message.warning({
					message: '计划内容存在空值',
					showClose: true,
					duration: 1000,
				})
			}

		},
		/* 取消 */
		cancelPlan() {
			this.$emit('detailEmits');
		}
	},
	mounted() {
		this.devicePeople()
		this.system()
	},
	watch:{

	}
}
</script>
<style lang="scss" scoped>
#equipmentPlan{
	.equipmentPlan{
		.addPlan{
			.span{
				margin-left: 20px;
			}
			.btn{
				margin-left: 40px;
			}
			.returnPlan{
				text-align: right;
				margin-top: 20px;
			}
		}
	}
}
	.bottom-pagnation{
		float: right;
		text-align: right;
		padding: 20px;
	}
</style>
