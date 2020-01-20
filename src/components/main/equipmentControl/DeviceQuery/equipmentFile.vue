<template>
	<div id="equipmentFile">
		<div class="equipmentFile">
			<div class="equipmentFile-left">
				<v-deviceTree @sonData="sonDatas"></v-deviceTree>
			</div>
			<div class="equipmentFile-right">
				<!-- 查询条件 -->
				<div class="type-serach">
					<div class="queryType">
						<span class="searchType">类型查询</span>
						<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;" @change="typeStatus">
						    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<span class="searchType" style="margin-left: 20px;" v-if="this.subjudgment == 0">楼宇查询</span>
						<el-select v-model="buildingID" placeholder="请选择" clearable style="width: 110px;" @change="typeStatus" v-if="this.subjudgment == 0">
						    <el-option v-for="item in buildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
						<el-button class="btn" @click="profiled()" type="primary" size="small" icon="el-icon-plus">设备入档</el-button>
					</div>
				</div>
				<!-- 设备表格 -->
				<div class="middle-table">
					<el-table :data="tableData" style="margin-top: 20px" :cell-style="{padding:'5px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', padding: '15px 0'}">
						<el-table-column :show-overflow-tooltip="true" prop="code" label="编码" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="name" label="名称" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="systemName" label="归属系统" align='center' width="120"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="subsystemName" label="产品类型" align='center' width="120"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="manufacturer" label="生产厂家" align='center' width="120"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="model" label="型号" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="is_out" v-if="timeValue != 2" label="是否出档" width="120" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="pro_date" label="生产日期" align='center' width="120"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="inst_date" label="安装日期" align='center' width="120"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="buildingName" label="安装楼宇" align='center' width="120"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="floor_id" label="安装楼层" align='center' width="120"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="room_name" label="安装房间" align='center' width="120"></el-table-column>
						<!-- <el-table-column :show-overflow-tooltip="true" prop="use_life" label="使用年限" align='center'></el-table-column> -->
						<el-table-column :show-overflow-tooltip="true" prop="username" label="责任人" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="phone" label="责任人联系方式" align='center' width="180"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="trouble" label="故障数" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="repair_times" label="维修次数" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="assets_attribution" v-if="timeValue != 2" label="资产归属" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="consum" v-if="timeValue == 2" label="入档时间" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="out_time" v-if="timeValue == 2" label="出档时间" align='center'></el-table-column>
						<el-table-column label="操作" width="250" align='center' v-if="timeValue == 1">
						    <template slot-scope="scope">
						        <el-button @click="updateFiles(scope.row)" size="mini" type="success" v-if="timeValue == 1">更新</el-button>
								<el-button @click="removeFile(scope.row)" size="mini" type="danger" v-if="timeValue == 1">出档</el-button>
						    </template>
						</el-table-column>
					</el-table>
					<div class="bottom-pagnation">
					    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
					</div>
				</div>
			</div>
			<!-- 入档模态框 -->
			<el-dialog title=录入设备 :visible.sync="inputDevice" width="40%">
			    <div class="el-form">
			        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
						<el-form-item label="编码" prop="coding">
						    <el-input v-model="coding" style="width: 200px;"></el-input>
						</el-form-item>
						<el-form-item label="名称" prop="nomenclature">
						    <el-input v-model="nomenclature" style="width: 200px;"></el-input>
						</el-form-item>
						<el-form-item label="归属系统" prop="ascription">
							<el-select v-model="ascription" placeholder="请选择" clearable style="width: 200px;" @change="systemSelection">
							    <el-option v-for="item in systemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="归属子系统" prop="ascription" v-if="subsystemState == 1">
							<el-select v-model="ascriptionSubsystem" placeholder="请选择" clearable style="width: 200px;">
							    <el-option v-for="item in subSystemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="产品类型" prop="product">
							<el-select v-model="product" placeholder="请选择" clearable style="width: 200px;">
							    <el-option v-for="item in TypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="生产厂家" prop="manufacturer">
						    <el-input v-model="manufacturer" style="width: 200px;"></el-input>
						</el-form-item>
						<el-form-item label="型号" prop="unitType">
						    <el-input v-model="unitType" style="width: 200px;"></el-input>
						</el-form-item>
			            <el-form-item label="生产日期" prop="productionDate">
			                <el-date-picker v-model="productionDate" type="datetime" value-format="yyyy-MM-dd HH:mm" placeholder="请选择时间" style="width: 200px;"></el-date-picker>
			            </el-form-item>
						<el-form-item label="安装日期" prop="installationDate">
						    <el-date-picker v-model="installationDate" type="datetime" value-format="yyyy-MM-dd HH:mm" placeholder="请选择时间" style="width: 200px;"></el-date-picker>
						</el-form-item>
						<!-- <el-form-item label="安装位置" prop="installationPosition">
						    <el-input v-model="installationPosition" style="width: 200px;"></el-input>
						</el-form-item> -->
						<el-form-item label="安装楼宇" prop="responsiblePerson">
							<el-select v-model="Building" placeholder="请选择归属楼宇" clearable style="width: 200px;">
							    <el-option v-for="item in buildingLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="安装楼层" prop="responsiblePerson">
							<el-select v-model="floor" placeholder="请选择归属楼层" clearable style="width: 200px;">
							    <el-option v-for="item in floorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="安装房间" prop="responsiblePerson">
							<el-select v-model="room" placeholder="请选择归属房间" clearable style="width: 200px;">
							    <el-option v-for="item in roomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="责任人" prop="responsiblePerson">
							<el-select v-model="responsiblePerson" placeholder="请选择" clearable style="width: 200px;">
							    <el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="联系方式" prop="responsiblePhone">
						    <el-input v-model="responsiblePhone" style="width: 200px;" :maxlength="16" oninput ="value=value.replace(/[^\d]/g,'')"></el-input>
						</el-form-item>
						<el-form-item label="资产归属" prop="assetOwnership">
						    <el-input v-model="assetOwnership" style="width: 200px;"></el-input>
						</el-form-item>
						<el-form-item label="使用年限" prop="years">
							<el-date-picker v-model="TimeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
			        </el-form>
			    </div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancel" size="small">取 消</el-button>
					<el-button type="primary" @click="handleAlart" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 更新模态框 -->
			<el-dialog title=更新设备 :visible.sync="updateData" width="40%">
				<div class="el-form">
					<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<el-form-item label="归属系统" prop="ascription">
							<el-select v-model="ascription" placeholder="请选择" clearable style="width: 110px;" @change="systemSelection">
							    <el-option v-for="item in systemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="归属子系统" prop="ascriptionSubsystem" v-if="subsystemState == 1">
							<el-select v-model="ascriptionSubsystem" placeholder="请选择" clearable style="width: 110px;">
							    <el-option v-for="item in subSystemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="产品类型" prop="product">
							<el-select v-model="product" placeholder="请选择" clearable style="width: 110px;">
							    <el-option v-for="item in TypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="安装楼宇" prop="Buildings">
							<el-select v-model="Buildings" placeholder="请选择归属楼宇" clearable style="width: 200px;">
							    <el-option v-for="item in buildingLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="安装楼层" prop="floors">
							<el-select v-model="floors" placeholder="请选择归属楼层" clearable style="width: 200px;">
							    <el-option v-for="item in floorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="安装房间" prop="rooms">
							<el-select v-model="rooms" placeholder="请选择归属房间" clearable style="width: 200px;">
							    <el-option v-for="item in roomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="责任人" prop="responsiblePerson">
							<el-select v-model="responsiblePerson" placeholder="请选择" clearable style="width: 110px;">
							    <el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="联系方式" prop="responsiblePhone">
						    <el-input v-model="responsiblePhone" style="width: 400px;" maxlength="16" oninput ="value=value.replace(/[^\d]/g,'')"></el-input>
						</el-form-item>
						<el-form-item label="资产归属" prop="assetOwnership">
						    <el-input v-model="assetOwnership" style="width: 400px;"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button @click="updateCancel" size="small">取 消</el-button>
				    <el-button type="primary" @click="updateManage" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 出档模态框 -->
			<el-dialog title="设备出档" :visible.sync="outGear" width="30%">
			    <span>确定设备是否出档？</span>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="outGear = false" size="small">取 消</el-button>
			        <el-button type="primary" @click="outGearConfirm" size="small">确 定</el-button>
			    </span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import deviceTree from './deviceTree';
export default {
    data() {
        return{
			systemID: '',
			typesystemID: '',
			buildingID: '',
			buildingList: [],
			tableData: [],
            choiceTime: 1,
			operatingTime: '',
			currentPage: 1,
			pageSize: 10,
			pageTotal: 1,
			inputDevice: false,
			updateData: false,
			outGear: false,
			coding: '',
			nomenclature: '',
			ascription: '',
			ascriptionSubsystem: '',
			ascriptions: '',
			ascriptionSubsystems: '',
			product: '',
			products: '',
			TypeList: [],
			manufacturer: '',
			unitType: '',
			productionDate: '',
			installationDate: '',
			installationPosition: '',
			timeValue: 0,
			startYears: '',
			endYears: '',
			responsiblePerson: '',
			responsiblePersons: '',
			peopleList: [],
			responsiblePhone: '',
			assetOwnership: '',
			subSystemList: [],
			subsystemState: 0,
			id: '',
			TimeRange: '',
			systemList: [],
			TimeList: [{
				value: 0,
				label: '全部'
			},
			{
				value: 1,
				label: '当前设备'
			},
			{
				value: 2,
				label: '已出档'
			},],
			Building: '',
			floor: '',
			room: '',
			Buildings: '',
			floors: '',
			rooms: '',
			buildingLists: [],
			floorList: [],
			roomList:[],
			subjudgment: 0
        }
    },
    methods: {
		/* 查询设备信息 */
		initData(){
			let choice = ''
			choice = this.choiceTime
			this.timeValue = choice
			/* console.log(this.timeValue) */
			let data = {
				systemId:this.systemID,
				subSystemId:this.typesystemID,
				buildingId:this.buildingID,
				queryFlag:this.choiceTime,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/findDevice`, this.$qs.stringify(data)).then((res) => {
				console.log(res)
				if(res.data.success){
					if(res.data.result != ''&&res.data.result != null){
						this.tableData = res.data.result.deviceList;
						this.pageTotal = res.data.result.count;
					}else{
						this.tableData = res.data.result.deviceList;
						this.pageTotal = res.data.result.count;
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000
						})
					}
				}else{
					this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
						duration: 1000
					})
				}
			});
		},
		/* 搜索楼宇 */
		/* building(){
			let data = {
				systemId:this.systemID,
				subSystemId:this.typesystemID,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/querySystemBuildings`, this.$qs.stringify(data)).then((res) => {
				console.log(res)
				if(res === undefined){
					this.buildingList = []
				}else{
					if(res.data.success){
						if(res.data.result.length != 0){
							this.buildingList = []
							res.data.result.forEach((item)=>{
								this.buildingList.push({label: item.label, value: item.id});
							});
						}
						this.buildingID = this.buildingList[0].value
					}else{
						this.subsystemState = 0
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000
						})
					}
				}
			});
		}, */
		/* 归属楼宇 */
		initBuilding(){
			let data ={
				departId:''
			}
			/* console.log(data) */
			this.$axios.post(`BMPlatServers/common/queryallbuilds`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					// console.log(res)
					this.buildingLists = []
					res.data.result.buildsList.forEach((item)=>{
					    this.buildingLists.push({label: item.buildName, value: item.buildId});
					});
					this.buildingList = []
					res.data.result.buildsList.forEach((item)=>{
						this.buildingList.push({label: item.buildName, value: item.buildId});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 归属楼层 */
		initFloor(){
			let data ={
				building_id:this.Building
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryfloors`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					// console.log(res)
					this.floorList = []
					res.data.result.floorInfo.forEach((item)=>{
					    this.floorList.push({label: item.floor_name, value: item.floor_id});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 归属房间 */
		initRoom(){
			let data ={
				buildingId:this.Building,
				floorId:this.floor
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryazrooms`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					// console.log(res)
					this.roomList = []
					res.data.result.roomsInfo.forEach((item)=>{
					    this.roomList.push({label: item.roomName, value: item.roomId});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 归属楼层 */
		initFloors(){
			let data ={
				building_id:this.Buildings
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryfloors`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					// console.log(res)
					this.floorList = []
					res.data.result.floorInfo.forEach((item)=>{
					    this.floorList.push({label: item.floor_name, value: item.floor_id});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 归属房间 */
		initRooms(){
			let data ={
				buildingId:this.Buildings,
				floorId:this.floors
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryazrooms`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					// console.log(res)
					this.roomList = []
					res.data.result.roomsInfo.forEach((item)=>{
					    this.roomList.push({label: item.roomName, value: item.roomId});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 系统 */
		system(){
			this.$axios.post(`BMPlatServers/common/querySystemTree`).then((res) =>{
				if(res.data.success){
					// console.log(res)
					this.systemList = []
					res.data.result.forEach((item)=>{
						this.systemList.push({label: item.name, value: item.systemId});
					});
				}else{
					this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
						duration: 1000
					})
				}
			});
		},
		/* 接收tree组件 */
		sonDatas(datas){
			/* console.log("接收数的参数")
			console.log(datas) */
			this.systemID = datas.systemId
			this.typesystemID = datas.subsystemId
			if(datas.subsystemId != ''&&datas.subsystemId != null){
				this.subjudgment = 1
			}else{
				this.subjudgment = 0
			}
			this.buildingID = ''
			/* this.building() */
			this.initBuilding()
			setTimeout(res=>{
				this.initData()
			},500)
		},
		/* 系统类型与子系统 */
		systemSelection(id){
			console.log('系统类型')
			console.log(id)
			let data = {
				systemId:id,
			}
			this.$axios.post(`BMPlatServers/device/findSubSystem`, this.$qs.stringify(data)).then((res) => {
				this.subsystemState = 0
				if(res.data.success){
					console.log(res)
					if(res.data.result.list.length != 0){
						if(res.data.result.list[0].name != ''){
							this.subsystemState = 1
						}
						this.subSystemList = []
						res.data.result.list.forEach((item)=>{
							this.subSystemList.push({label: item.name, value: item.id});
						});
					}else{
						this.subsystemState = 0
					}
				}else{
					this.subsystemState = 0
					this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
						duration: 1000
					})
				}
			});
		},
		/* 类型状态 */
		typeStatus(){
			console.log(this.choiceTime)
		},
		search(){
			this.initData()
		},
		/* 责任人与产品类型 */
		devicePeople(){
			this.$axios.post(`BMPlatServers/common/findDeviceType`).then((res) => {
				if(res.data.success){
					// console.log(res)
					this.TypeList = []
					 res.data.result.deviceTypeList.forEach((item)=>{
					    this.TypeList.push({label: item.type_name, value: item.device_type});
					});
				}else{
					this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
						duration: 1000
					})
				}
			});
			this.$axios.post(`BMPlatServers/device/userList`).then((res) => {
				if(res.data.success){
					// console.log(res)
					this.peopleList = []
					 res.data.result.list.forEach((item)=>{
					    this.peopleList.push({label: item.username, value: item.id});
					});
				}else{
					this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
						duration: 1000
					})
				}
			});
		},
		/* 入档 */
		profiled(){
			this.initBuilding()
			this.devicePeople()
			this.system()
			this.subsystemState = 0
			this.inputDevice = true
			this.coding = ''
			this.nomenclature = ''
			this.ascription = ''
			this.product = ''
			this.manufacturer = ''
			this.unitType = ''
			this.productionDate = ''
			this.installationDate = ''
			this.installationPositio = ''
			this.years = ''
			this.responsiblePerson = ''
			this.responsiblePhone = ''
			this.assetOwnership = ''
			this.ascriptionSubsystem = ''
			this.Building = '',
			this.floor = '',
			this.room = ''
		},
		/* 入档确定 */
		handleAlart(){
			if(
				this.coding != ''&&
				this.nomenclature!= ''&&
				this.ascription!= ''&&
				this.product!= ''&&
				this.manufacturer!= ''&&
				this.unitType!= ''&&
				this.productionDate!= ''&&
				this.installationDate!= ''&&
				this.startYears!= ''&&
				this.endYears!= ''&&
				this.responsiblePerson!= ''&&
				this.responsiblePhone!= ''&&
				this.assetOwnership!= ''&&
				this.Building!= ''
				// this.floor!= ''&&
				// this.room!= ''
			){
				let data = {
					code:this.coding,
					name:this.nomenclature,
					system_id:this.ascription,
					id:this.ascriptionSubsystem,
					device_type:this.product,
					manufacturer:this.manufacturer,
					model:this.unitType,
					pro_date:this.productionDate,
					inst_date:this.installationDate,
					life_start:this.startYears,
					life_end:this.endYears,
					person_liable:this.responsiblePerson,
					phone:this.responsiblePhone,
					assets_attribution:this.assetOwnership,
					building_id:this.Building,
					floor_id:this.floor,
					room_id:this.room
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/device/insertDevice`, this.$qs.stringify(data)).then((res) => {
					if(res.data.success){
						this.$message.warning({
							message: '入档成功',
							showClose: true,
							duration: 1000
						})
						this.inputDevice = false
						this.initData()
						
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000
						})
					}
				});
			}else{
				this.$message.warning({
					message: '内容信息不完整',
					showClose: true,
					duration: 1000
				})
			}

		},
		/* 入档取消 */
		cancel(){
			this.inputDevice = false
		},
		/* 更新模态框 */
		updateFiles(id){
			this.updateData = true
			console.log(id)
			this.devicePeople()
			this.system()
			this.ascription = id.system_id
			this.product = id.device_type
			this.installationPosition = id.inst_position
			this.responsiblePerson = id.person_liable
			this.responsiblePhone = id.phone
			this.assetOwnership = id.assets_attribution
			this.ascriptionSubsystem = id.subsystem_id
			this.id = id.id
			this.Buildings = id.building_id,
			this.floors = id.floor_id,
			this.rooms = id.room_id
			this.initBuilding()
			this.initFloors()
			this.initRooms()

			let data = {
				systemId:this.ascription,
			}
			this.$axios.post(`BMPlatServers/device/findSubSystem`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log(res)
					if(res.data.result.list.length != 0){
						this.subsystemState = 1
						this.subSystemList = []
						res.data.result.list.forEach((item)=>{
							this.subSystemList.push({label: item.name, value: item.id});
						});
					}
				}else{
					this.subsystemState = 0
					this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
						duration: 1000
					})
				}
			});
		},
		/* 更新确定 */
		updateManage(){

			if(this.ascription != ''){
				this.updateData = false
				let data = {
					system_id:this.ascription,
					device_type:this.product,
					inst_position:this.installationPosition,
					person_liable:this.responsiblePerson,
					phone:this.responsiblePhone,
					assets_attribution:this.assetOwnership,
					subsystem_id:this.ascriptionSubsystem,
					id:this.id,
					building_id: this.Buildings,
					floor_id: this.floors,
					room_id: this.rooms
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/device/updateDevice`, this.$qs.stringify(data)).then((res) => {
					if(res.data.success){
						this.$message.warning('更新成功')
						this.initData()
					  /* this.tableData = res.data.result.deviceList;
					   this.pageTotal = res.data.result.count; */
					}else{
						this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
						duration: 1000
					})
					}
				});
			}else{
				this.$message.warning('修改内容有空值')
			}

		},
		/* 更新取消 */
		updateCancel(){
			this.updateData = false
		},
		/* 出档设备 */
		removeFile(id){
			this.id = id.id
			this.outGear = true
		},
		/* 出档确定 */
		outGearConfirm(){
			this.outGear = false
			let data = {
				id:this.id
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/deviceOut`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					this.$message.warning('出档成功')
					this.initData()
				  /* this.tableData = res.data.result.deviceList;
				   this.pageTotal = res.data.result.count; */
				}else{
					this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
						duration: 1000
					})
				}
			});
		},
		/* 分页 */
		handleCurrentChange() {
			this.initData()
		},
		search(){
			this.initData()
		}
    },
    mounted() {
		this.initData()
		this.initBuilding()
    },
	watch:{
		TimeRange(item) {
		    this.startYears = item[0];
		    this.endYears = item[1];
		},
		Building(){
			this.initFloor()
		},
		floor(){
			this.initRoom()
		},
		Buildings(){
			this.initFloors()
		},
		floors(){
			this.initRooms()
		},
		ascription(item){
			if(item == ''&&item == null){
				this.subsystemState = 0
			}
		}
	},
	components: {
	    'v-deviceTree': deviceTree
	}
}
</script>
<style lang="scss" scoped>
#equipmentFile{
	height: 100%;
	.equipmentFile{
		height: 100%;
		overflow: hidden;
	}
}
	.equipmentFile-left{
		float: left;
		width: 15%;
		height: 100%;
		overflow: auto;
		padding-right: 10px;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		-o-box-sizing: border-box;
		&::-webkit-scrollbar{
		    width: 1px;
		}
	}
	.equipmentFile-right{
		float: left;
		width: 85%;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		.type-serach{
			border-left: 1px solid #Ddd;
			padding-left: 10px;
		}
		.middle-table{
			padding-left: 10px;
			border-left: 1px solid #Ddd;
		}
	}

	.el-input.is-disabled .el-input__inner{
		background: #ffffff;
		color: #606266;
	}
	.bottom-pagnation{
		float: right;
		text-align: right;
		padding: 20px;
	}
	.btn{
		margin-left: 40px;
	}
</style>
