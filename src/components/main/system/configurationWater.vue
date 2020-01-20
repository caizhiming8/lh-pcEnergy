<template>
	<div id="configurationWater">
		<div class="configurationWater">
			<div class="type-search">
				<div class="seach_keyword">
					<span>水表名称：</span>
					<el-input v-model="keyword" class="keyword"></el-input>
					<el-button type="primary" class="btn" icon="el-icon-search" size="small" @click="search()">搜索</el-button>
					<el-button type="primary" class="btn" @click="addUser" icon="el-icon-plus" size="small" v-hasMenu="9-3-8-1">添加水表</el-button>
				</div>
			</div>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="wm_name" label="表名" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="NBflagName" label="模式" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="ammeterName" label="采集器" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="calflag" label="纳入总用水" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="buildingName" label="回路楼宇" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="floorId" label="回路楼层" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="roomName" label="回路房间" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="ipaddress" label="ip地址" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="macaddress" label="水表网络标识" align='center' width="140"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="ordinal" label="表号" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="enabledStatus" label="当前状态" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="initial_consume" label="初始值" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="local_dbname" label="本地数据库" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="plat_dbname" label="平台数据库" align='center'></el-table-column>
					<el-table-column label="操作" width="250" align='center'>
					    <template slot-scope="scope">
							<el-button @click="clickPerform(scope.row)" size="mini" type="success">修改</el-button>
							<el-button @click="deleteUser(scope.row)" size="mini" type="danger">删除</el-button>
					    </template>
					</el-table-column>
				</el-table>
				<div class="pagination">
				    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
			</div>
			<!-- 增加水表 -->
			<el-dialog title="增加水表" :visible.sync="addWater" width="50%">
				<div class="input_div">
					<div><span class="span_input">水表名称：</span></div>
					<el-input v-model="waterName" placeholder="请输入水表名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">模式：</span></div>
					<el-select v-model="pattern" placeholder="请选择模式" clearable class="character" filterable>
						<el-option v-for="item in patternList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.JudPattern == 2">
					<div><span class="span_input">采集器：</span></div>
					<el-select v-model="collector" placeholder="请选择采集器" clearable class="character" filterable>
						<el-option v-for="item in collectorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.JudPattern == 2">
					<div><span class="span_input">子采集器：</span></div>
					<el-select v-model="childCollector" placeholder="请选择子采集器" clearable class="character" filterable>
						<el-option v-for="item in childCollectorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">纳入总用水：</span></div>
					<el-select v-model="calculate" placeholder="请选择" clearable class="character" filterable>
						<el-option v-for="item in caculateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">是否是总表：</span></div>
					<el-select v-model="totalPower" placeholder="请选择" clearable class="character" filterable>
						<el-option v-for="item in totalPowerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇：</span></div>
					<el-select v-model="waterBuilding" placeholder="请选择楼宇" clearable class="character" filterable>
						<el-option v-for="item in waterBuildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.powerNum == 0">
					<div><span class="span_input">楼层：</span></div>
					<el-select v-model="waterFloor" placeholder="请选择楼层" clearable class="character" filterable>
						<el-option v-for="item in waterFloorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.powerNum == 0">
					<div><span class="span_input">房间：</span></div>
					<el-select v-model="waterRoom" placeholder="请选择房间" clearable class="character" filterable>
						<el-option v-for="item in waterRoomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">水表网络标识：</span></div>
					<el-input v-model="waterAddr" placeholder="请输入水表网络标识" clearable class="input"></el-input>
				</div>
				<div class="input_div" v-if="this.ip_state == 1">
					<div><span class="span_input">ip地址：</span></div>
					<el-input v-model="waterAddrIP" placeholder="请输入ip地址" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">设备：</span></div>
					<el-select v-model="waterFacility" placeholder="请选择设备" clearable class="character" filterable>
						<el-option v-for="item in waterFacilityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">表状态：</span></div>
					<el-select v-model="meter" placeholder="请选择表状态" clearable class="character" filterable>
						<el-option v-for="item in meterList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">原水表：</span></div>
					<el-select v-model="nameWater" placeholder="请选择设备" clearable class="character" filterable>
						<el-option v-for="item in nameWaterList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">原水表值：</span></div>
					<el-input v-model="waterID" placeholder="请输入原水表值" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">初始值：</span></div>
					<el-input v-model="initial" placeholder="请输入初始值" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">经度：</span></div>
					<el-input v-model="longitude" placeholder="请输入" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">纬度：</span></div>
					<el-input v-model="latitude" placeholder="请输入" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">本地数据库：</span></div>
					<el-input v-model="localData" placeholder="请输入" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">平台数据库：</span></div>
					<el-input v-model="platformData" placeholder="请输入" clearable class="input"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="addCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="addConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 修改水表 -->
			<el-dialog title="修改水表" :visible.sync="modifyWater">
				<div class="input_div">
					<div><span class="span_input">水表名称：</span></div>
					<el-input v-model="waterNames" placeholder="请输入水表名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">模式：</span></div>
					<el-select v-model="patterns" placeholder="请选择模式" clearable class="character" filterable>
						<el-option v-for="item in patternList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.JudPattern == 2">
					<div><span class="span_input">采集器：</span></div>
					<el-select v-model="collectors" placeholder="请选择采集器" clearable class="character" filterable>
						<el-option v-for="item in collectorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.JudPattern == 2">
					<div><span class="span_input">子采集器：</span></div>
					<el-select v-model="childCollectors" placeholder="请选择子采集器" clearable class="character" filterable>
						<el-option v-for="item in childCollectorLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">纳入总用水：</span></div>
					<el-select v-model="calculates" placeholder="请选择" clearable class="character" filterable>
						<el-option v-for="item in caculateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">是否是楼宇总表：</span></div>
					<el-select v-model="totalPowers" placeholder="请选择" clearable class="character" filterable>
						<el-option v-for="item in totalPowerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇：</span></div>
					<el-select v-model="waterBuildings" placeholder="请选择楼宇" clearable class="character" filterable>
						<el-option v-for="item in waterBuildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.powerNum == 0">
					<div><span class="span_input">楼层：</span></div>
					<el-select v-model="waterFloors" placeholder="请选择楼层" clearable class="character" filterable>
						<el-option v-for="item in waterFloorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.powerNum == 0">
					<div><span class="span_input">房间：</span></div>
					<el-select v-model="waterRooms" placeholder="请选择房间" clearable class="character" filterable>
						<el-option v-for="item in waterRoomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">水表网络标识：</span></div>
					<el-input v-model="waterAddrs" placeholder="请输入水表网络标识" clearable class="input"></el-input>
				</div>
				<div class="input_div" v-if="this.ip_state == 1">
					<div><span class="span_input">ip地址：</span></div>
					<el-input v-model="waterAddrIPs" placeholder="请输入ip地址" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">设备：</span></div>
					<el-select v-model="waterFacilitys" placeholder="请选择设备" clearable class="character" filterable>
						<el-option v-for="item in waterFacilityLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">表状态：</span></div>
					<el-select v-model="meters" placeholder="请选择表状态" clearable class="character" filterable>
						<el-option v-for="item in meterList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">原水表：</span></div>
					<el-select v-model="nameWaters" placeholder="请选择设备" clearable class="character" filterable>
						<el-option v-for="item in nameWaterList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">原水表值：</span></div>
					<el-input v-model="waterIDs" placeholder="请选择原水表" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">初始值：</span></div>
					<el-input v-model="initials" placeholder="请输入初始值" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">经度：</span></div>
					<el-input v-model="longitudes" placeholder="请输入" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">纬度：</span></div>
					<el-input v-model="latitudes" placeholder="请输入" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">本地数据库：</span></div>
					<el-input v-model="localDatas" placeholder="请输入" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">平台数据库：</span></div>
					<el-input v-model="platformDatas" placeholder="请输入" clearable class="input"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="modifyCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="modifyConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 删除水表 -->
			<el-dialog title="删除此水表" :visible.sync="delWater" width="30%">
				<div class="del"><span class="del_span">是否要删除此水表?</span></div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="delCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="delConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			keyword: '',
			tableData: [],
			addWater: false,
			modifyWater: false,
			delWater: false,
			waterName: '',
			totalPower: '',
			waterBuilding: '',
			waterFloor: '',
			waterRoom: '',
			waterAddr: '',
			waterAddrIP: '',
			waterFacility: '',
			waterID: '',
			meter: '',
			nameWater: '',
			initial: '',
			localData: '',
			platformData: '',
			meterList: [{label: '失效', value: 0},{label: '在用', value: 1}],
			totalPowerList: [{label:'是',value: 1},{label:'否',value: 0}],
			waterBuildingList: [],
			waterFloorList: [],
			waterRoomList: [],
			waterFacilityList: [],
			waterFacilityLists: [],
			nameWaterList: [],
			waterNames: '',
			totalPowers: '',
			waterBuildings: '',
			waterFloors: '',
			waterRooms: '',
			waterAddrs: '',
			waterAddrIPs: '',
			waterFacilitys: '',
			waterIDs: '',
			meters: '',
			nameWaters: '',
			initials: '',
			localDatas: '',
			platformDatas: '',
			pageSize: 10,
			currentPage: 1,
			pageTotal: 1,
			id: '',
			ID: '',
			powerNum: 0,
			longitude: '',
			latitude: '',
			longitudes: '',
			latitudes: '',
			collector: '',
			collectors:'',
			collectorList: [],
			pattern: '',
			patterns: '',
			patternList: [{label: 'NB模式', value: 0},{label: '普通有线模式', value: 1},{label: '普通无线模式', value: 2}],
			JudPattern: 1,
			calculate: '',
			calculates: '',
			caculateList: [{label: '是', value: 1},{label: '否', value: 0}],
			childCollectorList: [],
			childCollectorLists: [],
			childCollector: '',
			childCollectors: '',
			collectorsList: [],
			childCollectorid: '',
			childCollectorName: '',
			childCollectorNames: '',
			child_id: '',
			child_list: [],
			childIP: '',
			ip_state: 1,
			collectorName: '',
			collectorNames: ''
		}
	},
	methods:{
		/* 采集器 */
		initcollector(){
			let data ={
				NBfalg:this.pattern
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/findcollector`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.collectorList = []
					this.collectorsList = []
					this.collectorsList = res.data.result
					res.data.result.forEach((item)=>{
					    this.collectorList.push({label: item.name, value: item.ip});
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
		initcollectorS(){
			let data ={
				NBflag:this.patterns
			}
			this.$axios.post(`BMPlatServers/config/findcollector`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.collectorList = []
					this.collectorsList = []
					this.collectorsList = res.data.result
					res.data.result.forEach((item)=>{
					    this.collectorList.push({label: item.name, value: item.ip});
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
		initChildCollector(){
			let data = {
				id:this.childCollectorid
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/findsubcollector`,this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.childCollectorList = []
					res.data.result.forEach((item)=>{
					    this.childCollectorList.push({label: item.name, value: item.ip});
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
		initChildCollectors(){
			let data = {
				id:this.childCollectorid
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/findsubcollector`,this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.childCollectorLists = []
					this.child_list = []
					this.child_list = res.data.result
					res.data.result.forEach((item)=>{
					    this.childCollectorLists.push({label: item.name, value: item.ip});
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
		initBuilding(){
			let data ={
				departId:''
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryBuild`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.waterBuildingList = []
					res.data.result.buildsList.forEach((item)=>{
					    this.waterBuildingList.push({label: item.buildName, value: item.buildId});
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
		initFacility(){
			this.$axios.post(`BMPlatServers/config/selectLeftWater`).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.waterFacilityList = []
					res.data.result.list.forEach((item)=>{
					    this.waterFacilityList.push({label: item.name, value: item.id});
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
		initFacilitys(){
			this.$axios.post(`BMPlatServers/config/selectLeftWater`).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.waterFacilityLists = []
					res.data.result.list.forEach((item)=>{
					    this.waterFacilityLists.push({label: item.name, value: item.id});
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
		initFloor(){
			let data ={
				building_id:this.waterBuilding
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryfloors`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.waterFloorList = []
					res.data.result.floorInfo.forEach((item)=>{
					    this.waterFloorList.push({label: item.floor_name, value: item.floor_id});
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
		initRoom(){
			let data ={
				buildingId:this.waterBuilding,
				floorId:this.waterFloor,
				system_id: 1
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryEleOrWatRooms`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.waterRoomList = []
					res.data.result.forEach((item)=>{
					    this.waterRoomList.push({label: item.roomName, value: item.roomId});
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
		initFloors(){
			let data ={
				building_id:this.waterBuildings
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryfloors`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.waterFloorList = []
					res.data.result.floorInfo.forEach((item)=>{
					    this.waterFloorList.push({label: item.floor_name, value: item.floor_id});
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
		initRooms(){
			let data ={
				buildingId:this.waterBuildings,
				floorId:this.waterFloors,
				system_id: 1
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryEleOrWatRooms`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.waterRoomList = []
					res.data.result.forEach((item)=>{
					    this.waterRoomList.push({label: item.roomName, value: item.roomId});
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
		initWater(){
			let data ={
				building_id:this.waterBuilding,
				floor_id:this.waterFloor,
				room_id:this.waterRoom,
				flag:this.totalPower
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/selecthisWaterMeter`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.nameWaterList = []
					res.data.result.list.forEach((item)=>{
					    this.nameWaterList.push({label: item.wm_name, value: item.id});
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
		initWaterNumber(){
			let data ={
				building_id:this.waterBuilding,
				floor_id:this.waterFloor,
				room_id:this.waterRoom,
				previousId:this.nameWater
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/selecthisWaterconsum`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.waterID = res.data.result
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		initWaters(){
			let data ={
				building_id:this.waterBuildings,
				floor_id:this.waterFloors,
				room_id:this.waterRooms,
				flag:this.totalPowers
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/selecthisWaterMeter`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.nameWaterList = []
					res.data.result.list.forEach((item)=>{
					    this.nameWaterList.push({label: item.wm_name, value: item.id});
					});
					this.initWaterNumbers()
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		initWaterNumbers(){
			let data ={
				building_id:this.waterBuildings,
				floor_id:this.waterFloors,
				room_id:this.waterRooms,
				previousId:this.nameWaters
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/selecthisWaterconsum`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.waterID = res.data.result.consum
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 查询信息 */
		initData(){
			let data={
				name:this.keyword,
				pageSize:this.pageSize,
				currentPage:this.currentPage
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/selectWaterMeter`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.tableData = []
					this.tableData = res.data.result.list
					this.pageTotal = res.data.result.count
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
					this.tableData = []
					this.pageTotal = 0 
				}
			})
		},
		/* 增加水表 */
		addUser(){
			this.addWater = true
			this.waterBuilding = ''
			this.waterFloor = ''
			this.waterRoom = ''
			this.waterName = ''
			this.waterFacility = ''
			this.waterID = ''
			this.nameWater = ''
			this.initial = ''
			this.waterAddrIP = ''
			this.waterAddr = ''
			this.localData = ''
			this.platformData = ''
			this.totalPower = ''
			this.meter = ''
			this.pattern = ''
			this.collector = ''
			this.childCollector = ''
			this.calculate = ''
			this.initBuilding()
			this.initFacility()
			/* this.initcollector() */
		},
		/* 增加确定 */
		addConfirm(){
			if(this.nameWater == ''){
				this.nameWater = 0
				this.waterID = 0
			}
			/* &&this.totalPower != '' &&this.waterAddrIP != ''this.waterID != '' &&this.waterFacility != ''&&this.nameWater != ''&& &&this.waterRoom != ''&&this.waterName != '' &&this.initial != '' &&this.waterFloor != '' &&this.localData != ''&&this.platformData != ''*/
			if(this.waterBuilding != ''&&this.waterAddr != ''&&this.meter != ''){
				let data={
					buildingId:this.waterBuilding,
					floorId:this.waterFloor,
					roomId:this.waterRoom,
					wmName:this.waterName,
					deviceId:this.waterFacility,
					previousConsume:this.waterID,
					previousId:this.nameWater,
					initialConsume:this.initial,
					ipaddress:this.waterAddrIP,
					macaddress:this.waterAddr,
					localdbName:this.localData,
					platdbName:this.platformData,
					flag:this.totalPower,
					enabled:this.meter,
					coordinatex: this.longitude,
					coordinatey: this.latitude,
					ammeterId: this.collector,
					NBflag: this.pattern,
					calculate: this.calculate,
					sub_addr:this.childCollector,
					sub_name:this.childCollectorName,
					father_name: this.collectorName
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/insertWaterMeter`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.addWater = false
						this.initData()
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						})
					}
				})
			}else{
				this.$message.warning({
					message: '水表数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 增加取消 */
		addCancel(){
			this.addWater = false
		},
		/* 修改水表 */
		clickPerform(item){
			console.log(item)
			this.modifyWater = true
			this.initFacilitys()
			this.waterBuildings = item.buildingId
			this.waterFloors = item.floorId
			this.waterRooms = item.roomId
			this.waterNames = item.wm_name
			this.waterFacilitys = item.device_id
			this.initials = item.initial_consume
			this.waterAddrIPs = item.ipaddress
			this.waterAddrs = item.macaddress
			this.localDatas = item.local_dbname
			this.platformDatas = item.plat_dbname
			this.id = item.id
			this.meters = item.enabled
			this.waterIDs = item.previous_consume
			this.nameWaters = item.previous_id
			this.longitudes = item.coordinatex
			this.latitudes = item.coordinatey
			this.collectors = item.ipaddress
			this.patterns = item.NBflag
			this.calculates = item.calculate
			this.childCollectors = item.sub_addr
			this.childIP = item.sub_addr
			if(this.patterns == 1||this.patterns == 2){
				this.waterAddrIPs = ''
			}else{
				this.collectors = ''
				this.childCollectors = ''
				this.childIP = ''
			}
			if(this.waterFloors == 0){
				this.powerNum = 1
				this.totalPowers = 1
			}else{
				this.powerNum = 0
				this.totalPowers = 0
			}
			this.initWaters()
			/* this.initcollector() */
			this.initBuilding()
		},
		/* 修改确定 */
		modifyConfirm(){
			/* &&this.waterIDs != ''&&this.nameWaters != '' &&this.waterAddrIPs != '' &&this.waterNames != ''&&this.totalPowers != '' &&this.waterFacilitys != '' &&this.waterFloors != ''&&this.waterRooms != '' &&this.initials != '' &&this.localDatas != ''&&this.platformDatas != ''*/
			if(this.waterBuildings != ''&&this.waterAddrs != ''&&this.meters != ''){
				this.child_list.forEach((items)=>{
					if(items.ip == this.childCollectors){
						console.log(this.childCollectors)
						console.log(items.name)
						this.child_id = items.id
						this.childCollectorNames = items.name
					}
				})
				if(this.patterns == 1||this.patterns == 2){
					this.waterAddrIPs = ''
				}else{
					this.collectors = ''
					this.childCollectors = ''
					this.childIP = ''
					this.childCollectorNames = ''
					this.child_id = ''
				}
				let data={
					buildingId:this.waterBuildings,
					floorId:this.waterFloors,
					roomId:this.waterRooms,
					wmName:this.waterNames,
					deviceId:this.waterFacilitys,
					initialConsume:this.initials,
					ipaddress:this.waterAddrIPs,
					macaddress:this.waterAddrs,
					localdbName:this.localDatas,
					platdbName:this.platformDatas,
					previousc_onsume:this.waterID,
					previous_id:this.nameWater,
					id:this.id,
					enabled:this.meters,
					coordinatex: this.longitudes,
					coordinatey: this.latitudes,
					ammeterId: this.collectors,
					NBflag: this.patterns,
					calculate: this.calculates,
					sub_addr: this.childCollectors,
					sub_name: this.childCollectorNames,
					sub_id: this.child_id,
					old_ip: this.childIP,
					father_name: this.collectorNames
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/updateWaterMeter`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.modifyWater = false
						this.initData()
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						})
					}
				})
			}else{
				this.$message.warning({
					message: '修改水表数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 修改取消 */
		modifyCancel(){
			this.modifyWater = false
		},
		/* 删除水表 */
		deleteUser(item){
			this.delWater = true
			this.ID = item.id
		},
		/* 删除确定 */
		delConfirm(){
			let data={
				id:this.ID
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/deleteWaterMeter`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					})
					this.delWater = false
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
		/* 删除取消 */
		delCancel(){
			this.delWater = false
		},
		/* 搜索 */
		search(){
			this.initData()
		},
		/* 分页 */
		handleCurrentChange(){
			this.initData()
		}
	},
	mounted() {
		this.initData()
	},
	watch:{
		waterBuilding(item){
			if(item != ''&&item != null){
				this.initFloor()
			}	
			if(this.totalPower||this.totalPower == 0){
				if(this.totalPower == 1){
					this.initWater()
				}
			}else{
				this.waterBuilding = ''
				this.$message.warning({
					message: '请先选择是否是总表',
				    showClose: true,
				    duration: 1000,
				})
			}
		},
		waterFloor(){
			this.initRoom()
		},
		waterRoom(item){
			if(item != ''&&item!= null){
				this.initWater()
			}
		},
		nameWater(item){
			if(item != ''&&item != null){
				this.initWaterNumber()
			}
		},
		waterBuildings(){
			this.initFloors()
		},
		waterFloors(){
			this.initRooms()
		},
		totalPower(item){
			if(item == 1){
				this.powerNum = 1
			}else{
				this.powerNum = 0
			}
		},
		totalPowers(item){
			if(item == 1){
				this.powerNum = 1
			}else{
				this.powerNum = 0
			}
		},
		pattern(item){
			if(item == 1||item == 2){
				this.JudPattern = 2
				this.ip_state = 2
				this.waterAddrIP = ''
				this.initcollector()
			}else{
				this.JudPattern = 1
				this.ip_state = 1
				this.collector = ''
				this.childCollector = ''
				this.childCollectorName = ''
			}
		},
		patterns(item){
			if(item == 1||item == 2){
				this.JudPattern = 2
				this.ip_state = 2
				/* this.waterAddrIPs = '' */
				this.initcollectorS()
			}else{
				this.JudPattern = 1
				this.ip_state = 1
				/* this.collectors = ''
				this.childCollectors = ''
				this.childCollectorNames = '' */
			}
		},
		collector(i){
			if(i != ''&&i != null){
				this.collectorsList.forEach((item,index)=>{
					if(item.ip == i){
						console.log(item.id)
						this.childCollectorid = item.id
						this.collectorName = item.name
					}
				});
				this.initChildCollector()
			}
		},
		collectors(i){
			this.collectorsList.forEach((item,index)=>{
				if(item.ip == i){
					console.log(item.id)
					this.childCollectorid = item.id
					this.collectorNames = item.name
				}
			});
			this.initChildCollectors()
		},
		childCollector(i){
			this.childCollectorList.forEach((item)=>{
				if(item.value == i){
					console.log(item.label)
					this.childCollectorName = item.label
				}
			})
		},
		childCollectors(i){
			this.child_list.forEach((item)=>{
				if(item.ip == i){
					console.log(item.name)
					this.childCollectorNames = item.name
					this.child_id = item.id
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
#configurationWater{
	padding: 15px;
	.configurationWater{
		.AddUser{
			margin-top: 5px;
			width: 94%;
			margin-left: 3%;
			zoom:1;
			border-bottom: 1px solid #ececec;
			.headline{
				float: left;
				margin-left: 3%;
				padding: 12px;
				font-size: 15px;
				color: #434343;
				margin-top: 5px;
			}
			.add_button{
				float: right;
				margin-right: 5%;
				padding: 10px;
			}
		}
		.AddUser:after {
			clear:both;
			content:'.';
			display:block;
			width: 0;
			height: 0;
			visibility:hidden;
		}
		.type-search{
			padding: 20px 15px 0;
			.seach_keyword{
				width: 96%;
				.keyword{
					width: 160px;
				}
				.btn{
					margin-left: 40px;
				}
			}
		}
		.type-table{
			.pagination{
			    text-align: right;
			    padding: 10px 20px;
			}
		}
		/deep/ .el-dialog__body{
			float: left;
			.input_div{
				width: 47%;
				margin-left: 3%;
				float: left;
				.span_input{
					margin-left: 5px;
					margin-top: 5px;
					font-size: 15px;
					color: #434343;
					font-weight: 400;
				}
				.input{
					margin-top: 10px;
					width: 90%;
				}
				.character{
					margin-top: 10px;
					width: 90%;
				}
			}
		}
		/deep/ .el-dialog__footer{
			padding: 60px 20px 20px;
		}
		.del{
			text-align: center;
			.del_span{
				color: #434343;
				font-weight: 500;
				font-size: 16px;
			}
		}
		box-shadow: 0 0 6px #ddd;
		-webkit-box-shadow: 0 0 6px #ddd;
		-ms-box-shadow: 0 0 6px #ddd;
		-moz-box-shadow: 0 0 6px #ddd;
		-o-box-shadow: 0 0 6px #ddd;
	}
}
</style>
