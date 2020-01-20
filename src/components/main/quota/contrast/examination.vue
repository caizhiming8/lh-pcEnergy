<template>
	<div id="examination">
		<div class="examination">
			<div class="top-search">
				<span>申请人查询</span>
				<el-select v-model="people" placeholder="请选择" clearable style="width: 200px;">
				    <el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span>审批状态</span>
				<el-select v-model="approval" placeholder="请选择" clearable style="width: 200px;">
				    <el-option v-for="item in approvalList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button type="primary" size="small" @click="search">搜索</el-button>
			</div>
			<div class="section-table">
				<el-table tooltip-effect="light" :data="tableData" class="history_table" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="name" label="申请单位" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="username" label="申请人" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="time" label="申请时间" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="people" label="审批人" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="resultSatus" label="审批状态" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="appro_time" label="审批时间" align="center"></el-table-column>
					<el-table-column label="操作" width="200" align='center'>
						<template slot-scope="scope">
							<el-button @click="particulars(scope.row)" size="mini" type="primary" v-if="scope.row.result1 != 0">详情</el-button>
							<el-button @click="authority(scope.row)" size="mini" type="success" v-if="scope.row.result1 == 0">审批</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="bottom-pagnation">
					<el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
			</div>
			<el-dialog title="配额详情" :visible.sync="particularsing" width="700px">
				<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
					<el-form-item label="楼宇" prop="coding" v-if="this.judging != 0">
					    <el-input v-model="building" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="楼层" prop="coding" v-if="this.judging != 0">
					    <el-input v-model="floor" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="房间" prop="coding" v-if="this.judging != 0">
					    <el-input v-model="room" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="特殊用电" prop="coding">
					    <el-input v-model="special" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="照明用电" prop="coding">
					    <el-input v-model="lighting" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="空调用电" prop="coding">
					    <el-input v-model="conditioner" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="动力用电" prop="coding">
					    <el-input v-model="power" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<div>
						<el-form-item label="申请理由" prop="coding">
						    <el-input v-model="reason" style="width: 500px;" type="textarea" disabled></el-input>
						</el-form-item>
					</div>
				</el-form>
			</el-dialog>
			<el-dialog title="审批" :visible.sync="approvalBox" width="700px">
				<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
					<el-form-item label="申请单位" prop="coding">
					    <el-input v-model="unit" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="楼宇" prop="coding" v-if="this.judging != 0">
					    <el-input v-model="building" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="楼层" prop="coding" v-if="this.judging != 0">
					    <el-input v-model="floor" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="房间" prop="coding" v-if="this.judging != 0">
					    <el-input v-model="room" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="申请时间" prop="coding">
					    <el-input v-model="time" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="申请人" prop="coding">
					    <el-input v-model="peoples" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="照明用电" prop="coding">
					    <el-input v-model="lighting" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="空调用电" prop="coding">
					    <el-input v-model="conditioner" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="动力用电" prop="coding">
					    <el-input v-model="power" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<el-form-item label="特殊用电" prop="coding">
					    <el-input v-model="special" style="width: 200px;" disabled></el-input>
					</el-form-item>
					<div>
						<el-form-item label="申请理由" prop="coding">
						    <el-input v-model="reason" style="width: 500px;" type="textarea" disabled></el-input>
						</el-form-item>
					</div>
					<div class="btn" style="text-align: right;">
						<el-button @click="determine()" size="mini" type="primary">同意</el-button>
						<el-button @click="cancel()" size="mini" type="danger">驳回</el-button>
					</div>
				</el-form>

			</el-dialog>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			people:'',
			peopleList:[],
			approval:'',
			approvalList:[{value: 0,label: '未审批'}, {value: 1,label: '同意'},{value: 2,label: '反驳'}],
			tableData:[],
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			special:'',
			lighting: '',
			conditioner:'',
			power:'',
			reason:'',
			unit: '',
			time: '',
			peoples: '',
			building: '',
			floor: '',
			room:'',
			particularsing:false,
			approvalBox:false,
			id: '',
			judging: 1,
			departId: '',
			period: '',
			is_zg: '',
			buildingId: '',
			roomId: ''
		}
	},
	methods:{
		/* 责任人 */
		initPeople(){
			this.$axios.post(`BMPlatServers/device/userList`).then((res) => {
				if(res.data.success){
					console.log(res)
					this.peopleList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						    this.peopleList.push({label: item.username, value: item.id});
						});
					}
				}else{
					this.peopleList = []
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 查询所有信息 */
		initData(){
			let data ={
				appro_person:this.people,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				is_sp:this.approval
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/queryappro`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					if(res.data.result != ''){
						this.pageTotal = res.data.result.count
						this.tableData = res.data.result.historyList
					}else{
						this.pageTotal = 0
						this.tableData = []
					}
				}else{
					this.pageTotal = 0
					this.tableData = []
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 详情 */
		particulars(res){
			this.particularsing = true
			console.log(res)
			this.special = res.class4
			this.lighting = res.class1
			this.power = res.class3
			this.conditioner = res.class2
			this.reason = res.reason
			if(res.buildName != null&&res.floor_id != null&&res.room_name != null&&res.buildName != ''&&res.floor_id != ''&&res.room_name != ''){
				this.judging = 1
			}else{
				this.judging = 0
				/* console.log(this.judging) */
			}
			this.building = res.buildName
			this.floor = res.floor_id
			this.room = res.room_name
		},
		/* 审批 */
		authority(res){
			console.log(res)
			this.unit = res.name
			this.time = res.time
			this.peoples = res.username
			this.building = res.buildName
			this.floor = res.floor_id
			this.room = res.room_name
			this.approvalBox = true
			this.special = res.class4
			this.lighting = res.class1
			this.power = res.class3
			this.conditioner = res.class2
			this.reason = res.reason
			this.id = res.id
			this.departId = res.departId
			this.period = res.period
			this.is_zg = res.is_zg
			this.buildingId = res.buildingId
			this.roomId = res.roomId
			if(res.buildName != null&&res.floor_id != null&&res.room_name != null&&res.buildName != ''&&res.floor_id != ''&&res.room_name != ''){
				this.judging = 1
			}else{
				this.judging = 0
				/* console.log(this.judging) */
			}
		},
		/* 确定 */
		determine(){
			let data = {
				id:this.id,
				value:1,
				class4:this.special,
				class1:this.lighting,
				class3:this.power,
				class2:this.conditioner,
				building:this.buildingId,
				floor:this.floor,
				room:this.roomId,
				departId:this.departId,
				period:this.period,
				is_zg:this.is_zg
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/agreeappro`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.$message.success({
						message: '成功',
                        showClose: true,
                        duration: 1000,
					});
					this.initData()
					this.approvalBox = false
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
			let data = {
				id:this.id,
				value: 2
			}
			console.log()
			this.$axios.post(`BMPlatServers/consum/agreeappro`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.initData()
					this.approvalBox = false
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		search(){
			this.initData()
		},
		handleCurrentChange(){
			this.initData()
		}
	},
	mounted() {
		this.initPeople()
		this.initData()
	},
	watch:{
		/* approval(){
			this.initData()
		} */
	}
}
</script>

<style lang="scss" scoped>
	.bottom-pagnation{
		float: right;
		text-align: right;
		padding: 20px;
	}
	.el-input.is-disabled .el-input__inner{
		background: #ffffff;
		color: #606266;
	}
</style>
