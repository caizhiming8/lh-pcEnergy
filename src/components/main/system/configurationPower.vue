<template>
	<div id="configurationPower">
		<div class="configurationPower">
			<div class="type-search">
				<div class="seach_keyword">
					<span>电表名称：</span>
					<el-input v-model="keyword" placeholder="请输入电表名称" class="keyword"></el-input>
					<el-button type="primary" size="small" class="btn" icon="el-icon-search" @click="search()">搜索</el-button>
					<el-button type="primary" size="small" class="btn" @click="addUser" icon="el-icon-plus" v-hasMenu="9-3-7-1">添加电表</el-button>
				</div>
			</div>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="tableData" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="ip" label="采集器IP" align='center' width="150"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="ammeter_name" label="电表名称" align='center' width="130"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="addr" label="物理地址" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="buildName" label="所在楼宇" align='center' width="130"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="floor_id" label="所在楼层" align='center' width="130"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="room_name" label="所在房间" align='center' width="130"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="class_name" label="分项" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="systemName" label="子分项" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="ammeter_id" label="表号" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="ele_type" label="表类型" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="contact_name" label="是否可控" align='center' width="130"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="rate" label="比例" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="init_consum" label="初始值" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="status_name" label="当前状态" align='center' width="130"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="local_dbname" label="本地数据库" align='center' width="130"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="plat_dbname" label="平台数据库" align='center' width="130"></el-table-column>
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
			<el-dialog title="增加电表" :visible.sync="addPower">
				<div class="input_div">
					<div><span class="span_input">采集器：</span></div>
					<el-select v-model="collector" placeholder="请选择采集器" clearable class="character" filterable>
						<el-option v-for="item in collectorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">子采集器：</span></div>
					<el-select v-model="childCollector" placeholder="请选择子采集器" clearable class="character" filterable>
						<el-option v-for="item in childCollectorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">电表名称：</span></div>
					<el-input v-model="powerName" placeholder="请输入电表名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">电表物理地址：</span></div>
					<el-input v-model="powerAddr" placeholder="请输入地址" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">是否是总表：</span></div>
					<el-select v-model="totalPower" placeholder="请选择" clearable class="character" filterable>
						<el-option v-for="item in totalPowerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇：</span></div>
					<el-select v-model="powerBuilding" placeholder="请选择楼宇" clearable class="character" filterable>
						<el-option v-for="item in powerBuildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.powerNum == 0">
					<div><span class="span_input">楼层：</span></div>
					<el-select v-model="powerFloor" placeholder="请选择楼宇" clearable class="character" filterable>
						<el-option v-for="item in powerFloorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.powerNum == 0">
					<div><span class="span_input">房间：</span></div>
					<el-select v-model="powerRoom" placeholder="请选择房间" clearable class="character" filterable>
						<el-option v-for="item in powerRoomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">分项：</span></div>
					<el-select v-model="itemized" placeholder="请选择分项" clearable class="character" filterable>
						<el-option v-for="item in itemizedList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">子分项：</span></div>
					<el-select v-model="subitem" placeholder="请选择子分项" clearable class="character" filterable>
						<el-option v-for="item in subitemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">设备：</span></div>
					<el-select v-model="facility" placeholder="请选择设备" clearable class="character" filterable>
						<el-option v-for="item in facilityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">表号：</span></div>
					<el-input v-model="powerNumber" placeholder="请输入表号" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">电表类型：</span></div>
					<el-select v-model="powerType" placeholder="请选择类型" clearable class="character" filterable>
						<el-option v-for="item in powerTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">控制状态：</span></div>
					<el-select v-model="control" placeholder="请选择状态" clearable class="character" filterable>
						<el-option v-for="item in controlList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">表状态：</span></div>
					<el-select v-model="meter" placeholder="请选择表状态" clearable class="character" filterable>
						<el-option v-for="item in meterList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">比例：</span></div>
					<el-input v-model="proportion" placeholder="请输入比例" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">初始值：</span></div>
					<el-input v-model="initial" placeholder="请输入初始值" clearable class="input"></el-input>
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
			<el-dialog title="修改电表" :visible.sync="modifyPower">
				<div class="input_div">
					<div><span class="span_input">采集器：</span></div>
					<el-select v-model="collectors" placeholder="请选择采集器" clearable class="character" filterable>
						<el-option v-for="item in collectorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">子采集器：</span></div>
					<el-select v-model="childCollectors" placeholder="请选择子采集器" clearable class="character" filterable>
						<el-option v-for="item in childCollectorLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">电表名称：</span></div>
					<el-input v-model="powerNames" placeholder="请输入电表名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">电表物理地址：</span></div>
					<el-input v-model="powerAddrs" placeholder="请输入电表物理地址" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">是否是总表：</span></div>
					<el-select v-model="totalPowers" placeholder="请选择" clearable class="character" filterable>
						<el-option v-for="item in totalPowerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇：</span></div>
					<el-select v-model="powerBuildings" placeholder="请选择楼宇" clearable class="character" filterable>
						<el-option v-for="item in powerBuildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.powerNum == 0">
					<div><span class="span_input">楼层：</span></div>
					<el-select v-model="powerFloors" placeholder="请选择楼层" clearable class="character" filterable>
						<el-option v-for="item in powerFloorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.powerNum == 0">
					<div><span class="span_input">房间：</span></div>
					<el-select v-model="powerRooms" placeholder="请选择房间" clearable class="character" filterable>
						<el-option v-for="item in powerRoomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">分项：</span></div>
					<el-select v-model="itemizeds" placeholder="请选择分项" clearable class="character" filterable>
						<el-option v-for="item in itemizedList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">子分项：</span></div>
					<el-select v-model="subitems" placeholder="请选择子分项" clearable class="character" filterable>
						<el-option v-for="item in subitemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">设备：</span></div>
					<el-select v-model="facilitys" placeholder="请选择设备" clearable class="character" filterable>
						<el-option v-for="item in facilityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">表号：</span></div>
					<el-input v-model="powerNumbers" placeholder="请输入表号" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">电表类型：</span></div>
					<el-select v-model="powerTypes" placeholder="请选择类型" clearable class="character" filterable>
						<el-option v-for="item in powerTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">控制状态：</span></div>
					<el-select v-model="controls" placeholder="请选择状态" clearable class="character" filterable>
						<el-option v-for="item in controlList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">表状态：</span></div>
					<el-select v-model="meters" placeholder="请选择表状态" clearable class="character" filterable>
						<el-option v-for="item in meterList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">比例：</span></div>
					<el-input v-model="proportions" placeholder="请输入比例" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">初始值：</span></div>
					<el-input v-model="initials" placeholder="请输入初始值" clearable class="input"></el-input>
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
			<el-dialog title="删除此电表" :visible.sync="delPower" width="30%">
				<div class="del"><span class="del_span">是否要删除此电表?</span></div>
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
			addPower: false,
			modifyPower: false,
			delPower: false,
			pageSize: 10,
			currentPage: 1,
			pageTotal: 1,
			collector: '',
			powerName: '',
			powerIP: '',
			powerAddr: '',
			totalPower: '',
			powerBuilding: '',
			powerFloor: '',
			powerRoom: '',
			itemized: '',
			subitem: '',
			facility: '',
			powerNumber: '',
			powerType: '',
			control: '',
			meter: '',
			proportion: '',
			initial: '',
			localData: '',
			platformData: '',
			meterList: [{label: '废弃', value: 0},{label: '在用', value: 1}],
			controlList: [{label: '不可控', value: 0},{label: '可控', value: 1}],
			powerTypeList: [{label: '单项表', value: 0},{label: '三项表', value: 1}],
			subitemList: [],
			itemizedList: [{label: '照明插座用电', value: 1},{label: '空调', value: 2},{label: '动力用电', value: 3},{label: '特殊用电', value: 4}],
			facilityList: [],
			powerRoomList: [],
			powerFloorList: [],
			powerBuildingList: [],
			totalPowerList: [{label:'是',value: 1},{label:'否',value: 0}],
			collectorList: [],
			collectors: '',
			powerNames: '',
			powerIPs: '',
			powerAddrs: '',
			totalPowers: '',
			powerBuildings: '',
			powerFloors: '',
			powerRooms: '',
			itemizeds: '',
			subitems: '',
			facilitys: '',
			powerNumbers: '',
			powerTypes: '',
			controls: '',
			meters: '',
			proportions: '',
			initials: '',
			localDatas: '',
			platformDatas: '',
			id: '',
			ID: '',
			powerNum: 0,
			childCollector: '',
			childCollectorid: '',
			childCollectorList: [],
			collectorsList: [],
			childCollectors: '',
			childCollectorLists: [],
			childCollectorName: '',
			childCollectorNames: '',
			child_id: '',
			child_list: [],
			childIP: '',
			childID: '',
			childName: '',
			collectorName: '',
			collectorNames: ''
		}
	},
	methods: {
		initBuilding(){
			let data ={
				departId:''
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryBuild`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.powerBuildingList = []
					res.data.result.buildsList.forEach((item)=>{
					    this.powerBuildingList.push({label: item.buildName, value: item.buildId});
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
				building_id:this.powerBuilding
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryfloors`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.powerFloorList = []
					res.data.result.floorInfo.forEach((item)=>{
					    this.powerFloorList.push({label: item.floor_name, value: item.floor_id});
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
				buildingId:this.powerBuilding,
				floorId:this.powerFloor,
				system_id: 2
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryEleOrWatRooms`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.powerRoomList = []
					res.data.result.forEach((item)=>{
					    this.powerRoomList.push({label: item.roomName, value: item.roomId});
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
		initSubitemList(){
			let data ={
				class_id:this.itemized,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/findsubclass`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.subitemList = []
					res.data.result.forEach((item)=>{
					    this.subitemList.push({label: item.name, value: item.subclass_id});
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
				building_id:this.powerBuildings
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryfloors`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.powerFloorList = []
					res.data.result.floorInfo.forEach((item)=>{
					    this.powerFloorList.push({label: item.floor_name, value: item.floor_id});
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
				buildingId:this.powerBuildings,
				floorId:this.powerFloors,
				system_id: 2
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryEleOrWatRooms`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.powerRoomList = []
					res.data.result.forEach((item)=>{
					    this.powerRoomList.push({label: item.roomName, value: item.roomId});
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
		initSubitemLists(){
			let data ={
				class_id:this.itemizeds,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/findsubclass`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.subitemList = []
					res.data.result.forEach((item)=>{
					    this.subitemList.push({label: item.name, value: item.subclass_id});
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
		initcollector(){
			this.$axios.post(`BMPlatServers/config/findcollector`).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.collectorList = []
					this.collectorsList = []
					this.collectorsList = res.data.result
					res.data.result.forEach((item)=>{
					    this.collectorList.push({label: item.name, value: item.ip, key: item.id+'k'});
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
		/* 设备 */
		initfacility(){
			this.$axios.post(`BMPlatServers/config/findammeter`).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.facilityList = []
					res.data.result.forEach((item)=>{
					    this.facilityList.push({label: item.name, value: item.device_id});
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
		/* 查询信息 */
		initData(){
			let data={
				name:this.keyword,
				pageSize:this.pageSize,
				currentPage:this.currentPage
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/queryelecmeter`, this.$qs.stringify(data)).then((res)=>{
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
		/* 添加电表 */
		addUser(){
			this.initcollector()
			this.initBuilding()
			this.initfacility()
			this.addPower = true
			this.collector = ''
			this.powerAddr = ''
			this.powerBuilding = ''
			this.powerFloor = ''
			this.powerRoom = ''
			this.itemized = ''
			this.subitem = ''
			this.powerNumber = ''
			this.powerName = ''
			this.control = ''
			this.proportion = ''
			this.initial = ''
			this.powerType = ''
			this.meter = ''
			this.localData = ''
			this.platformData = ''
			this.childCollector = ''
		},
		/* 确定电表 */
		addConfirm(){
			/*  this.platformData != ''&& this.localData != ''&& this.initial != ''&& &&this.totalPower != ''this.powerType != ''&& &&this.powerFloor != ''&&this.powerRoom != '' this.control != ''&& this.meter != ''&& &&this.proportion != ''*/
			if(this.collector != ''&&this.powerAddr != ''&&this.powerBuilding != ''&&this.itemized != ''&&this.subitem != ''&&this.powerNumber != ''&&this.powerName != ''&&this.facility != ''){
				let data={
					ip:this.collector,
					addr:this.powerAddr,
					building_id:this.powerBuilding,
					floor_id:this.powerFloor,
					room_id:this.powerRoom,
					class_id:this.itemized,
					subclass_id:this.subitem,
					ammeter_id:this.powerNumber,
					ammeter_name:this.powerName,
					control_en:this.control,
					rate:this.proportion,
					init_consum:this.initial,
					ele_falg:this.powerType,
					status:this.meter,
					local_dbname: this.localData,
					plat_dbname: this.platformData,
					device_id: this.facility,
					flag:this.totalPower,
					sub_addr:this.childCollector,
					sub_name:this.childCollectorName,
					father_name:this.collectorName
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/addelecmeter`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.addPower = false
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
					message: '电表数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 取消增加 */
		addCancel(){
			this.addPower = false
		},
		/* 修改电表 */
		clickPerform(item){
			this.initcollector()
			console.log(item)
			this.modifyPower = true
			this.collectors = item.ip
			this.powerAddrs = item.addr
			this.powerBuildings = item.building_id
			this.powerFloors = item.floor_id
			this.powerRooms = item.room_id
			this.itemizeds = item.class_id
			this.subitems = item.subclass_id
			this.powerNumbers = item.ammeter_id
			this.powerNames = item.ammeter_name
			this.controls = item.control_en
			this.proportions = item.rate
			this.initials = item.init_consum
			this.powerTypes = item.ele_falg
			this.meters = item.status
			this.localDatas = item.local_dbname
			this.platformDatas = item.plat_dbname
			this.id = item.id
			this.facilitys = item.device_id
			this.childCollectors = item.sub_addr
			this.childIP = item.sub_addr
			if(this.powerFloors == 0){
				this.powerNum = 1
				this.totalPowers = 1
			}else{
				this.powerNum = 0
				this.totalPowers = 0
			}
		},
		/* 修改确定 */
		modifyConfirm(){
			this.child_list.forEach((items)=>{
				if(items.ip == this.childCollectors){
					console.log(items.name)
					this.child_id = items.id
					this.childCollectorNames = items.name
				}
			})
			/*  this.platformData != ''&& this.localData != ''&& this.initial != ''&& &&this.totalPower != ''this.powerTypes != ''&&this.powerFloors != ''&&this.powerRooms != '' this.controls != ''&& this.meters != ''&& &&this.proportions != ''*/
			if(this.collectors != ''&&this.powerAddrs != ''&&this.powerBuildings != ''&&this.itemizeds != ''&&this.subitems != ''&&this.powerNumbers != ''&&this.powerNames != ''&&this.facilitys != ''){
				let data ={
					ip:this.collectors,
					addr:this.powerAddrs,
					building_id:this.powerBuildings,
					floor_id:this.powerFloors,
					room_id:this.powerRooms,
					class_id:this.itemizeds,
					subclass_id:this.subitems,
					ammeter_id:this.powerNumbers,
					ammeter_name:this.powerNames,
					control_en:this.controls,
					rate:this.proportions,
					init_consum:this.initials,
					ele_falg:this.powerTypes,
					status:this.meters,
					local_dbname: this.localDatas,
					plat_dbname: this.platformDatas,
					id: this.id,
					device_id: this.facilitys,
					flag: this.totalPowers,
					sub_addr: this.childCollectors,
					sub_name: this.childCollectorNames,
					sub_id: this.child_id,
					old_ip: this.childIP,
					father_name:this.collectorNames
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/updateelecmeter`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.modifyPower = false
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
				let data ={
					ip:this.collectors,
					addr:this.powerAddrs,
					building_id:this.powerBuildings,
					floor_id:this.powerFloors,
					room_id:this.powerRooms,
					class_id:this.itemizeds,
					subclass_id:this.subitems,
					ammeter_id:this.powerNumbers,
					ammeter_name:this.powerNames,
					control_en:this.controls,
					rate:this.proportions,
					init_consum:this.initials,
					ele_falg:this.powerTypes,
					status:this.meters,
					local_dbname: this.localDatas,
					plat_dbname: this.platformDatas,
					id: this.id,
					device_id: this.facilitys,
					flag: this.totalPowers,
					sub_addr: this.childCollectors,
					sub_name: this.childCollectorNames
				}
				console.log(data)
				this.$message.warning({
					message: '修改电表数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 修改取消 */
		modifyCancel(){
			this.modifyPower = false
		},
		/* 删除电表 */
		deleteUser(item){
			this.ID = item.id
			this.delPower = true
		},
		/* 删除确定 */
		delConfirm(){
			let data={
				id:this.ID
			}
			this.$axios.post(`BMPlatServers/config/deleteelecmeter`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					})
					this.delPower = false
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
			this.delPower = false
		},
		/* 查询 */
		search(){
			this.initData()
		},
		/* 分页 */
		handleCurrentChange(){
			this.initData()
		}
	},
	mounted(){
		this.initBuilding()
		this.initfacility()
		this.initData()
	},
	watch:{
		powerBuilding(){
			this.initFloor()
		},
		powerFloor(){
			this.initRoom()
		},
		itemized(){
			this.initSubitemList()
		},
		powerBuildings(){
			this.initFloors()
		},
		powerFloors(){
			this.initRooms()
		},
		itemizeds(){
			this.initSubitemLists()
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
#configurationPower{
	padding: 15px;
	.configurationPower{
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
