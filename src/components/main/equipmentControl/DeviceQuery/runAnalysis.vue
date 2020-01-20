<template>
	<div id="runAnalysis">
		<div class="runAnalysis">
			<div class="type-serach">
				<div class="queryType">
					<span class="searchType">类型查询</span>
					<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
					    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
				</div>
			</div>
			<div class="frequency">
				<div class="frequency-left" style="border-bottom: 1px solid #EBEEF5;">
					<div class="middle-table">
						<span>质保期限内设备故障</span>
						<div style="margin-top:20px;"></div>
						<el-table tooltip-effect="light" :data="tableDataInside" style="width: 100%; margin-top: 20px" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
							<el-table-column :show-overflow-tooltip="true" prop="manufacturer" label="厂家信息" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="zzCount" label="年限内故障数" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="rate" label="年限内故障率" align='center'></el-table-column>
						</el-table>
					</div>
					<div class="bottom-pagnation">
					    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
					</div>
				</div>
				<div class="frequency-right" style="border-bottom: 1px solid #EBEEF5;">
					<div class="middle-table">
						<span>质保期限外设备故障</span>
						<div style="margin-top:20px;"></div>
						<el-table tooltip-effect="light" :data="tableDataOutside" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
							<el-table-column :show-overflow-tooltip="true" prop="manufacturer" label="厂家信息" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="zzCount" label="年限外故障数" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="rate" label="年限外故障率" align='center'></el-table-column>
						</el-table>
					</div>
					<div class="bottom-pagnation">
					    <el-pagination background @current-change="handleCurrentChange1" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal1"></el-pagination>
					</div>
				</div>
			</div>
			<div class="reasonRepair"  style="border-bottom: 1px solid #EBEEF5;">
				<!-- <div class="queryType">
					<span class="searchType">故障原因查询</span>
					<el-select v-model="malfunction" placeholder="请选择" clearable style="width: 110px;">
					    <el-option v-for="item in malfunctionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-button class="btn" type="primary" icon="el-icon-search" @click="searchFault">搜索</el-button>
				</div> -->
				<div class="faultCause">
					<div class="middle-table">
						<span>设备故障原因</span>
						<div style="margin-top:20px;"></div>
						<el-table tooltip-effect="light" :data="tableCause" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
							<el-table-column :show-overflow-tooltip="true" prop="details" label="故障原因" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="count" label="设备数量" align='center'></el-table-column>
						</el-table>
					</div>
					<div class="bottom-pagnation">
					    <el-pagination background @current-change="handleCurrentChange2" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal2"></el-pagination>
					</div>
				</div>
				<div class="equipment" style="border-bottom: 1px solid #EBEEF5;">
					<div class="middle-table">
						<span>设备维修次数</span>
						<div style="margin-top:20px;"></div>
						<el-table tooltip-effect="light" :data="tableNumber" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
							<el-table-column :show-overflow-tooltip="true" prop="name" label="设备名称" align='center'></el-table-column>
							<el-table-column :show-overflow-tooltip="true" prop="maxtime" label="维修次数" align='center'></el-table-column>
						</el-table>
					</div>
					<div class="bottom-pagnation">
					    <el-pagination background @current-change="handleCurrentChange3" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal3"></el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return{
			tableDataInside: [],
			tableDataOutside: [],
			tableCause: [],
			tableNumber: [],
			malfunction: '',
			malfunctionList: [],
			choiceTime: '',
			TimeList: [],
			currentPage: 1,
			pageSize: 5,
			pageTotal: 0,
			pageTotal1: 0,
			pageTotal2: 0,
			pageTotal3: 0,
		}
	},
	methods: {
		/* 查询 */
		initDataType(){
			/* 类型查询 */
			this.$axios.post(`BMPlatServers/common/findDeviceType`).then((res) => {
				if(res.data.success){
					console.log(res)
					this.TimeList = []
					 res.data.result.deviceTypeList.forEach((item)=>{
					    this.TimeList.push({label: item.type_name, value: item.device_type});
					});
					this.choiceTime = this.TimeList[0].value
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
			/* 原因查询 */
			/* this.$axios.post(`BMPlatServers/device/findreasontype`).then((res) => {
				if(res.data.success){
					console.log(res)
					this.malfunctionList = []
					res.data.result.reasonList.forEach((item)=>{
					    this.malfunctionList.push({label: item.reasonName, value: item.reasonId});
					});
				}else{
					this.$message.warning(res.data.resultMessage)
				}
			}); */
		},
		/* 查询结果 */
		initData(){
			let data = {
				device_type:this.choiceTime,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/findnxnbroken`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log('年限内')
					console.log(res)
				   this.tableDataInside = res.data.result.brokenList;
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
		initDataList(){
			let data = {
				device_type:this.choiceTime,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/findnxwbroken`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log('年限外')
					console.log(res)
				   this.tableDataOutside = res.data.result.brokenList;
				   this.pageTotal1 = res.data.result.count;
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 故障原因 */
		initDataFault(){
			let data = {
				device_type: this.choiceTime,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/findreason`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log(res)
				   this.tableCause = res.data.result.reasonList;
				   this.pageTotal2 = res.data.result.count;
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 维修 */
		initDataRepair(){
			let data = {
				device_type: this.choiceTime,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/findMax`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log(res)
				   this.tableNumber = res.data.result.reasonList;
				   this.pageTotal3 = res.data.result.count;
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
			this.initData()
		},
		handleCurrentChange1(){
			this.initDataList()
		},
		handleCurrentChange2(){
			this.initDataFault()
		},
		handleCurrentChange3(){
			this.initDataRepair()
		},
		/* 搜索故障 */
		searchFault(){
			this.initDataFault()
		},
		search(){
			this.initData()
			this.initDataList()
			this.initDataFault()
			this.initDataRepair()
		},
	},
	computed: {
		rowClass(row,index){
			/* return{"height":"55px"} */
		}
	},
	mounted() {
		this.initDataType()
		setTimeout(res=> {
			this.initData()
			this.initDataFault()
			this.initDataRepair()
			this.initDataList()
		},300)
	},
}

</script>
<style lang="scss" scoped>
	.frequency{
		margin: 20px 0;
		width: 100%;
		height: 400px;
		.frequency-left{
			width: 49%;
			float: left;
			border-right: 2px solid #ffffff;
			text-align: center;
			overflow: auto;
			.middle-table{
				height: 320px;
			}
		}
		.frequency-right{
			width: 49%;
			float: right;
			border-left: 2px solid #ffffff;
			text-align: center;
			overflow: auto;
			.middle-table{
				height: 320px
			}
		}
	}
	.reasonRepair{
		width: 100%;
		margin: 20px 0;
		float: left;
		.faultCause{
			width: 49%;
			float: left;
			border-right: 2px solid #ffffff;
			text-align: center;
			overflow: auto;
			.middle-table{
				height: 320px
			}
		}
		.equipment{
			width: 49%;
			float: right;
			border-left: 2px solid #ffffff;
			text-align: center;
			overflow: auto;
			.middle-table{
				height: 320px
			}
		}

	}
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
</style>
