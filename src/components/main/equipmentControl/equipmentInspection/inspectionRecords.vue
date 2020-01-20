<template>
	<div id="inspectionRecords">
		<div class="inspectionRecords">
			<div class="type-serach">
				<div class="queryType">
					<span class="searchType">类型查询</span>
					<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
					    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="searchType">巡检人</span>
					<el-select v-model="responsiblePerson" placeholder="请选择" clearable style="width: 200px;">
					    <el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="searchType">计划名称</span>
					<el-input v-model="nomenclature" style="width: 250px;"></el-input>
					<el-button class="btn" type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
				</div>
			</div>
			<div class="middle-table">
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<!-- <el-table-column :show-overflow-tooltip="true" prop="id" label="序号" align='center'></el-table-column> -->
					<el-table-column :show-overflow-tooltip="true" prop="code" label="巡检编号" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="planName" label="巡检计划" align='center'></el-table-column>
					<!-- <el-table-column :show-overflow-tooltip="true" prop="deviceName" label="巡检设备" align='center'></el-table-column> -->
					<el-table-column :show-overflow-tooltip="true" prop="username" label="巡检人" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="plan_time" label="计划巡检日期" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="examine_time" label="巡检日期" align='center'></el-table-column>
					<!-- <el-table-column :show-overflow-tooltip="true" prop="next_time" label="实际巡检日期" align='center'></el-table-column> -->
					<el-table-column :show-overflow-tooltip="true" prop="zcount" label="设备总数" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="gcount" label="设备故障数" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="status1" label="巡检状态" align='center'></el-table-column>
					<el-table-column label="操作" width="150" align='center'>
					    <template slot-scope="scope">
					        <el-button @click="clickDetail(scope.row)" size="mini" type="success" v-if="scope.row.status1 != '未巡检'">详细</el-button>
					    </template>
					</el-table-column>
				</el-table>
			</div>
			<div class="bottom-pagnation">
			    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
			</div>
			<el-dialog title="巡检计划明细" :visible.sync="planDetails" width="52%">
				<div class="el-from">
					<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<el-form-item label="计划名称" prop="nomenclature" style="float: left;">
							<el-input v-model="projectName" style="width: 300px;" disabled></el-input>
						</el-form-item>
						<el-form-item label="巡检人" prop="people" disabled style="float: left;">
							<el-input v-model="people" style="width: 300px;" disabled></el-input>
						</el-form-item>
						<el-form-item label="巡检结果" label-width="100px" disabled>
						    <el-input type="textarea" class="area" v-model="state" maxlength="200" show-word-limit disabled></el-input>
						</el-form-item>
					</el-form>
					<el-table tooltip-effect="dark" :data="tableDataList" style="width: 100%" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
						<el-table-column :show-overflow-tooltip="true" prop="code" label="设备编码" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="type_name" label="设备类型" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="name" label="设备名称" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="status" label="设备状态" align='center'></el-table-column>
					</el-table>
				</div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
export default{
	data() {
		return{
			tableData: [],
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			choiceTime: '',
			TimeList: [],
			responsiblePerson: '',
			peopleList: [],
			nomenclature: '',
			planDetails: false,
			projectName: '',
			people: '',
			tableDataList: [],
			id: '',
			state: ''
		}
	},
	methods:{
		initData(){
			this.$axios.post(`BMPlatServers/common/findDeviceType`).then((res) => {
				if(res.data.success){
					console.log(res)
					this.TimeList = []
					 res.data.result.deviceTypeList.forEach((item)=>{
					    this.TimeList.push({label: item.type_name, value: item.device_type});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
			this.$axios.post(`BMPlatServers/device/userList`).then((res) => {
				if(res.data.success){
					console.log(res)
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
		initDataList(){
			let data = {
				deviceType: this.choiceTime,
				Uid: this.responsiblePerson,
				planName: this.nomenclature,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/getexamlog`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log(res)
					this.tableData = []
					this.tableData = res.data.result.infoList;
					this.pageTotal = res.data.result.count;
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 详细 */
		clickDetail(row){
			/* debugger */
			this.planDetails = true
			console.log(row)
			this.projectName = row.planName
			this.people = row.username
			this.id = row.examine_id
			this.state = row.result
			let data = {
				id:this.id,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/getexamdevicedetail`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log(res)
					this.tableDataList = []
					this.tableDataList = res.data.result.infoList;
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		handleCurrentChange(){
			this.initDataList()
		},
		search(){
			this.initDataList()
		}
	},
	mounted() {
		this.initData()
		this.initDataList()
	}

}
</script>

<style lang="scss" scoped>
#inspectionRecords{
	.inspectionRecords{
		.type-serach{
			.queryType{
				.searchType{
					margin-left: 20px;
				}
				.btn{
					margin-left: 40px;
				}
			}
		}
	}
}
	.bottom-pagnation{
		text-align: right;
		margin-top: 15px;
		/deep/ .el-pagination{
			display: inline-block;
		}
	}
</style>
