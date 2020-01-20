<template>
	<div id="unitQuotaApply">
		<div class="unitQuotaApply">
			<div class="search">
				<span class="cycle-seach">查询申请人</span>
				<el-select v-model="peoples" placeholder="请选择申请人进行搜索" clearable style="width: 200px;">
				    <el-option v-for="item in peopleLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="cycle-seach">查询周期</span>
				<el-select v-model="cycles" placeholder="请选择" clearable style="width: 150px;margin-left: 10px;">
					<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="cycle-seach">查询年份</span>
				<el-select v-model="year" placeholder="请选择" clearable style="width: 150px;margin-left: 10px;">
					<el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button type="primary" @click="search" size="small">搜索</el-button>
				<el-button type="primary" @click="applyfor" size="small" icon="el-icon-plus">申请单位定额</el-button>
			</div>
			<div class="section-table">
				<span class="table-center">二级单位定额申请表</span>
				<el-table tooltip-effect="light" :data="tableData" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
					<el-table-column :show-overflow-tooltip="true" prop="departName" label="申请单位" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="time" label="申请时间" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="username" label="申请人" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="sumquota" label="申请总额" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="periodName" label="周期" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="approUser" label="审批人" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="approve_time" label="审批日期" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="result" label="审批结果" align="center"></el-table-column>
					<el-table-column label="详情" width="100" align='center'>
					    <template slot-scope="scope">
					        <el-button @click="updateFiles(scope.row)" size="mini" type="text">查看</el-button>
					    </template>
					</el-table-column>
				</el-table>
				<div class="bottom-pagnation">
				    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
			</div>
			<el-dialog title="二级单位配额" :visible.sync="applyFor" width="40%">
				<div class="applyFor">
					<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
						<el-form-item label="申请年份" prop="coding">
							<el-select v-model="years" placeholder="请选择" clearable style="width: 200px;">
							    <el-option v-for="item in yearLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="申请周期" prop="responsiblePhone">
							<el-select v-model="cycle" placeholder="请选择" clearable style="width: 200px;">
								<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="审批人" prop="coding">
						    <el-select v-model="approver" placeholder="请选择" clearable style="width: 200px;">
						        <el-option v-for="item in approverList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						    </el-select>
						</el-form-item>
						<el-form-item label="用电分类" prop="coding">
							<el-select v-model="sorting" placeholder="请选择" clearable style="width: 200px;">
							    <el-option v-for="item in sortList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="特殊用电" prop="coding">
						    <el-input v-model="special" style="width: 200px;"></el-input>
						</el-form-item>
						<el-form-item label="照明用电" prop="coding">
						    <el-input v-model="lighting" style="width: 200px;"></el-input>
						</el-form-item>
						<el-form-item label="空调用电" prop="coding">
						    <el-input v-model="conditioner" style="width: 200px;"></el-input>
						</el-form-item>
						<el-form-item label="动力用电" prop="coding">
						    <el-input v-model="power" style="width: 200px;"></el-input>
						</el-form-item>
						<div>
							<el-form-item label="申请理由" prop="coding">
							    <el-input v-model="reason" style="width: 500px;" type="textarea"></el-input>
							</el-form-item>
						</div>
					</el-form>
					<span slot="footer" class="dialog-footer" style="text-align: right;display: block;">
						<el-button type="primary" @click="handleAlart" size="small">确 定</el-button>
						<el-button @click="cancel" size="small">取 消</el-button>
					</span>
				</div>
			</el-dialog>
			<el-dialog title="配额详情" :visible.sync="particulars" width="55%">
				<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
					<el-form-item label="特殊用电" prop="coding">
					    <el-input v-model="special_1" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="照明用电" prop="coding">
					    <el-input v-model="lighting_1" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="空调用电" prop="coding">
					    <el-input v-model="conditioner_1" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="动力用电" prop="coding">
					    <el-input v-model="power_1" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<div>
						<el-form-item label="申请理由" prop="coding">
						    <el-input v-model="reason_1" style="width: 500px;" type="textarea" disabled></el-input>
						</el-form-item>
					</div>
				</el-form>
				<!-- <span slot="footer" class="dialog-footer">
					<el-button @click="cancel1">取 消</el-button>
					<el-button type="primary" @click="handleAlart1">确 定</el-button>
				</span> -->
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			tableData: [],
			applyFor: false,
			particulars: false,
			sorting: '',
			sortList: [{
				value: 1,
				label: '自管'
			},
			{
				value: 2,
				label: '公共'
			},],
			people:'',
			peopleList: [],
			special:0,
			lighting: 0,
			conditioner:0,
			power:0,
			reason: '',
			special_1:'',
			lighting_1: '',
			conditioner_1:'',
			power_1:'',
			reason_1: '',
			currentPage: 1,
			pageSize: 10,
			pageTotal: 1,
			peoples: '',
			peopleLists: [],
			approver: '',
			approverList:[],
			cycle: '',
			cycleList: [],
			cycles: '',
			year: '',
			yearList: [],
			years: '',
			yearLists: []
		}
	},
	methods:{
		initPeople(){
			this.$axios.post(`BMPlatServers/device/userList`).then((res) => {
				if(res.data.success){
					console.log(res)
					this.approverList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
							this.approverList.push({label: item.username, value: item.id});
						});
					}
				}else{
					this.approverList = []
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		initPeoples(){
			this.$axios.post(`BMPlatServers/device/userList`).then((res) => {
				if(res.data.success){
					console.log(res)
					this.peopleLists = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
							this.peopleLists.push({label: item.username, value: item.id});
						});
					}
				}else{
					this.peopleLists = []
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 周期 */
		initDataList(){
			this.$axios.post(`BMPlatServers/consum/queryperiod`).then((res)=>{
				if(res.data.success) {
					console.log(res)
					this.cycleList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						   this.cycleList.push({label: item.name, value: item.Id});
					   });
					}
				}else{
					this.cycleList = []
					this.$message.warning({
						message: res.data.resultMessage,
		                showClose: true,
		                duration: 1000,
					});
				}
			})
		},
		initDataYear(){
			let data={
				period:this.cycles
			}
			this.$axios.post(`BMPlatServers/consum/queryyear`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success) {
					console.log(res)
					this.year = ''
					this.yearList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						   this.yearList.push({label: item.time_year, value: item.time_year});
					   });
					}else{
						this.year = ''
						this.yearList = []
					}
				}else{
					this.yearList = []
					this.$message.warning({
						message: res.data.resultMessage,
			            showClose: true,
			            duration: 1000,
					});
				}
			})
		},
		initYearList(){
			/* console.log(datas) */
			this.$axios.post(`BMPlatServers/consum/queryyearinfo`).then((res)=>{
				if(res.data.success) {
					/* console.log(res) */
					this.yearLists = []
					if(res.data.result.yearlist && res.data.result.yearlist.length) {
						res.data.result.yearlist.forEach((item)=>{
						   this.yearLists.push({label: item.time, value: item.time});
					   });
					}
				}else{
					this.yearLists = []
					this.$message.warning({
						message: res.data.resultMessage,
			            showClose: true,
			            duration: 1000,
					});
				}
			})
		},
		/* 查询历史纪录 */
		initData(){
			let data={
				uid:this.peoples,
				departId: this.school,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				building_id: '',
				period:this.cycles,
				year:this.year
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/applyquotahistory`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					if(res.data.result.historyList != []){
						this.tableData = []
						this.tableData = res.data.result.historyList
						this.pageTotal = res.data.result.count
					}else{
						this.tableData = []
						this.pageTotal = 0
					}
					
				}else{
					this.tableData = []
					this.pageTotal = 0
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 申请模态框 */
		applyfor(){
			this.applyFor = true
			this.initPeople()
			this.initYearList()
		},
		search(){
			this.initData()
		},
		/* 确认 */
		handleAlart(){
			this.applyFor = false
			let list = [
				{'class1':this.special,
				'class4':this.lighting,
				'class3':this.power,
				'class2':this.conditioner}
				]
			list = JSON.stringify(list)
			let data ={
				periodId: this.cycle,
				departId: this.school,
				is_zg: this.sorting,
				person:this.people,
				reason:this.reason,
				appro_person:this.approver,
				list:list,
				type: 0,
				years:this.years
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/applyquota`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.$message.success({
						message: '申请已提交',
                        showClose: true,
                        duration: 1000,
					})
					this.initData()
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 取消 */
		cancel(){
			this.applyFor = false
			this.special = 0
			this.lighting = 0
			this.power = 0
			this.conditioner = 0
			this.sorting = ''
			this.people = ''
			this.reason = ''
		},
		/* 详情模态框 */
		updateFiles(res){
			this.particulars = true
			console.log(res)
			this.special_1 = res.class1
			this.lighting_1 = res.class4
			this.power_1 = res.class3
			this.conditioner_1 = res.class2
			this.reason_1 = res.reason
		},
		cancel1(){

		},
		handleAlart1(){

		},
		/* 分页 */
		handleCurrentChange(){
			this.initData()
		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		console.log(this.school)
		this.initData()
		this.initPeoples()
		this.initDataList()
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
		},
		cycles(){
			this.initDataYear()
		}
	}
}
</script>

<style lang="scss" scoped>
#unitQuotaApply{
	.unitQuotaApply{
		.type-search{
			mergin-top: 10px;
			float: right;
			margin-right: 20px;
		}
		.section-table{
			margin-top: 20px;
			.table-center{
				margin-left: 30px;
				font-size: 16px;
				font-weight: 700;
				color: #434343;
			}
			.history_table{
				margin-top: 25px;
			}
			.bottom-pagnation{
				float: right;
				text-align: right;
				padding: 20px;
			}
		}
	}
}
</style>
