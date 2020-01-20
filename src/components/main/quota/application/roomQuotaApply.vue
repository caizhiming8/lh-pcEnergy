<template>
	<div id="roomQuotaApply">
		<div class="roomQuotaApply">
			<div class="applyForTree">
				<v-applyForTree @sonData="sonDatas"></v-applyForTree>
			</div>
			<div class="room">
				<div class="search">
					<span class="cycle-seach">查询申请人</span>
					<el-select v-model="peoples" placeholder="请选择申请人进行搜索" clearable style="width: 200px;">
					    <el-option v-for="item in peopleLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="cycle-seach">查询周期</span>
					<el-select v-model="cycles" placeholder="请选择" clearable style="width: 150px;margin-left: 10px;">
						<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-button type="primary" @click="search" size="small" icon="el-icon-search">搜索</el-button>
					<el-button type="primary" @click="applyfor" size="small" icon="el-icon-plus">申请房间定额</el-button>
				</div>
				<div class="section-table">
					<el-table tooltip-effect="light" :data="tableData" class="history_table" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
						<el-table-column :show-overflow-tooltip="true" prop="departName" label="申请单位" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="time" label="申请时间" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="username" label="申请人" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="buildingName" label="楼宇" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="floor_id" label="楼层" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="room_name" label="房间" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="sumquota" label="申请总额" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="periodName" label="周期" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="approUser" label="审批人" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="approve_time" label="审批日期" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="result" label="审批结果" align="center"></el-table-column>
						<el-table-column label="详情" width="100" align='center'>
							<template slot-scope="scope">
								<el-button @click="updateFiles(scope.row)" size="small" type="text">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="bottom-pagnation">
						<el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
					</div>
				</div>
			</div>
			<el-dialog title="房间申请配额" :visible.sync="applyFor" width="55%">
				<div class="applyFor">
					<el-form-item label="申请年份" prop="coding">
						<el-select v-model="years" placeholder="请选择" clearable style="width: 200px;">
						    <el-option v-for="item in yearLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
						<el-form-item label="申请周期" prop="responsiblePhone">
							<el-select v-model="cycle" placeholder="请选择" clearable style="width: 200px;">
								<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="申请楼宇" prop="coding">
							<el-select v-model="unit" placeholder="请选择" clearable style="width: 200px;">
							    <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="申请楼层" prop="coding">
							<el-select v-model="floor" placeholder="请选择" clearable style="width: 200px;">
							    <el-option v-for="item in floorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="申请房间" prop="coding">
							<el-select v-model="room" placeholder="请选择" clearable style="width: 200px;">
							    <el-option v-for="item in roomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item label="申请人" prop="coding">
						    <el-select v-model="people" placeholder="请选择" clearable style="width: 200px;">
						        <el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						    </el-select>
						</el-form-item> -->
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
					<span slot="footer" class="dialog-footer">
						<el-button @click="cancel" size="small">取 消</el-button>
						<el-button type="primary" @click="handleAlart" size="small">确 定</el-button>
					</span>
				</div>
			</el-dialog>
			<el-dialog title="配额详情" :visible.sync="particulars" width="700px">
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
						    <el-input v-model="reason_1" style="width: 500px;" type="textarea"></el-input>
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
import applyForTree from './applyForTree';
export default{
	data(){
		return{
			tableData: [],
			applyFor: false,
			particulars: false,
			unit: '',
			unitList: [],
			floor:'',
			floorList: [],
			room: '',
			roomList: [],
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
			peopleList:[],
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
			school: '',
			currentPage: 1,
			pageSize: 10,
			pageTotal: 1,
			buildingID: '',
			floorID: '',
			roomID:'',
			peoples: '',
			peopleLists: [],
			approver: '',
			approverList:[],
			cycle: '',
			cycleList: [],
			cycles: '',
			years: '',
			yearLists: []
		}
	},
	methods:{
		/* 树结构 */
		sonDatas(datas){
			console.log("接收数的参数")
			console.log(datas)
			this.buildingID = datas.buildingId
			this.floorID = datas.floorId
			this.roomID = datas.id
			if(datas.buildingId != ''&&datas.floorId != ''&&datas.buildingId != null&&datas.floorId != null){
				this.initData()
			}else{
				this.tableData = []
				this.pageTotal = 0
			}
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
		initBuilding(){
			let data ={
				departId:this.school
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/querybuildstlist`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.unitList = []
					if(res.data.result.buildsList && res.data.result.buildsList.length) {
						res.data.result.buildsList.forEach((item)=>{
						    this.unitList.push({label: item.buildName, value: item.buildId});
						});
					}
				}else{
					this.unitList = []
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		initFloor(){
			let data ={
				building_id:this.unit
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryfloors`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.floorList = []
					if(res.data.result.floorInfo && res.data.result.floorInfo.length) {
						res.data.result.floorInfo.forEach((item)=>{
						    this.floorList.push({label: item.floor_name, value: item.floor_id});
						});
					}
				}else{
					this.floorList = []
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		initRoom(){
			let data ={
				buildingId:this.unit,
				floorId:this.floor
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryfrooms`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.roomList = []
					if(res.data.result.roomsInfo && res.data.result.roomsInfo.length) {
						res.data.result.roomsInfo.forEach((item)=>{
						    this.roomList.push({label: item.roomName, value: item.roomId});
						});
					}
				}else{
					this.roomList = []
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 模态框申请人 */
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
		/* 搜索申请人 */
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
		initData(){
			let data={
				departId: this.school,
				buiding_id: this.buildingID,
				floor_id: this.floorID,
				room_id: this.roomID,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				person:this.peoples,
				period:this.cycles
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/applyquotahistory`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					if(res.data.result != ''){
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
			this.initBuilding()
			this.initPeople()
			this.initYearList()
		},
		/* 确定 */
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
				building_id: this.unit,
				floor_id: this.floor,
				room_id: this.room,
				is_zg: this.sorting,
				person:this.people,
				reason:this.reason,
				appro_person:this.approver,
				list:list,
				type: 1,
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
					this.unit = ''
					this.floor = ''
					this.room = ''
					this.special = 0
					this.lighting = 0
					this.power = 0
					this.conditioner = 0
					this.sorting = ''
					this.people = ''
					this.reason = ''
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
			this.unit = ''
			this.floor = ''
			this.room = ''
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
			this.special_1 = res.class4
			this.lighting_1 = res.class1
			this.power_1 = res.class3
			this.conditioner_1 = res.class2
			this.reason_1 = res.reason
		},
		search(){
			this.initData()
		},
		/* 确定 */
		cancel1(){

		},
		/* 取消 */
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
	components: {
	    'v-applyForTree': applyForTree
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
		},
		unit(){
			console.log(this.unit)
			this.initFloor()
		},
		floor(){
			console.log(this.unit)
			this.initRoom()
		}
	}
}
</script>

<style lang="scss" scoped>
#roomQuotaApply{
	.roomQuotaApply{
		.applyForTree{
			float: left;
			width: 15%;
			height: 550px;
			overflow: auto;
			padding-right: 10px;
			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			-o-box-sizing: border-box;
			border-right: 1px solid #ddd;
			&::-webkit-scrollbar{
			    width: 1px;
			}
		}
		.room{
			float: left;
			width: 85%;
			overflow: auto;
			padding-left: 10px;
			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			-o-box-sizing: border-box;
			&::-webkit-scrollbar{
			    width: 1px;
			}
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
	.el-input.is-disabled .el-input__inner{
		background: #ffffff;
		color: #606266;
	}
	}
}
</style>
