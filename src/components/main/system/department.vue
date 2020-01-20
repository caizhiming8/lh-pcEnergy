<template>
	<div id="department">
		<div class="department">
			<div class="type-search">
				<div class="seach_keyword">
					<span>房间名称：</span>
					<el-input v-model="keyword" placeholder="请输入房间名称" class="keyword"></el-input>
					<el-button type="primary" size="small" class="btn" icon="el-icon-search" @click="search()">搜索</el-button>
					<el-button type="primary" @click="addUser" icon="el-icon-plus" class="btn" size="small" v-hasMenu="9-3-2-1">添加房间</el-button>
				</div>
			</div>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="tableData" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="buildName" label="楼宇名称" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="floor_id" label="楼宇层数" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="room_id" label="房间号" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="room_name" label="房间名称" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="is_zg" label="房间类型" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="departNmae" label="归属单位" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="preson_number" label="房间人数" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="area" label="面积" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="username" label="责任人" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="phone" label="联系方式" align='center'></el-table-column>
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
			<el-dialog title="增加房间" :visible.sync="addRoom" width="40%">
				<div class="input_div">
					<div><span class="span_input">楼宇名称：</span></div>
					<el-select v-model="building" placeholder="请选择楼宇" clearable class="character" filterable>
					    <el-option v-for="item in buildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇层数：</span></div>
					<!-- <el-select v-model="floor" placeholder="请选择楼层" clearable class="character">
					    <el-option v-for="item in floorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select> -->
					<el-input v-model="floor" placeholder="请输入楼层" clearable class="input" oninput ="value=value.replace(/[^\-?\d.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间号：</span></div>
					<el-input v-model="rooms" placeholder="请输入房间号" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间名称：</span></div>
					<el-input v-model="roomName" placeholder="请输入房间名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间类型：</span></div>
					<el-select v-model="roomType" placeholder="请选择房间类型" clearable class="character">
					    <el-option v-for="item in roomTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.roomType != 2">
					<div><span class="span_input">归属单位：</span></div>
					<el-select v-model="attributionUnit" placeholder="请选择归属单位" clearable class="character" filterable>
					    <el-option-group v-for="group in attributionUnitList" :key="group.groupname" :label="group.groupname">
							<el-option v-for="item in group.chilList" :key="item.Id" :label="item.name" :value="item.Id"></el-option>
						</el-option-group>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间面积：</span></div>
					<el-input v-model="roomArea" placeholder="请输入房间面积" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间人数：</span></div>
					<el-input v-model="roomPeople" placeholder="请输入房间人数" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">责任人：</span></div>
					<el-select v-model="people" placeholder="请选择责任人" clearable class="character" filterable>
					    <el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">联系方式：</span></div>
					<el-input v-model="contact" placeholder="请输入联系方式" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="addCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="addConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="修改房间" :visible.sync="modifyRoom" width="40%">
				<div class="input_div">
					<div><span class="span_input">楼宇名称：</span></div>
					<el-select v-model="buildings" placeholder="请选择楼宇" clearable class="character">
					    <el-option v-for="item in buildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇层数：</span></div>
					<!-- <el-select v-model="floors" placeholder="请选择楼层" clearable class="character">
					    <el-option v-for="item in floorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select> -->
					<el-input v-model="floors" placeholder="请输入楼层" clearable class="input"  oninput ="value=value.replace(/[^\-?\d.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间号：</span></div>
					<el-input v-model="roomss" placeholder="请输入房间号" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间名称：</span></div>
					<el-input v-model="roomNames" placeholder="请输入房间名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间类型：</span></div>
					<el-select v-model="roomTypes" placeholder="请选择房间类型" clearable class="character">
					    <el-option v-for="item in roomTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div" v-if="this.roomTypes1 != 2">
					<div><span class="span_input">归属单位：</span></div>
					<el-select v-model="attributionUnits" placeholder="请选择归属单位" clearable class="character">
						<el-option-group v-for="group in attributionUnitList" :key="group.groupname" :label="group.groupname">
							<el-option v-for="item in group.chilList" :key="item.Id" :label="item.name" :value="item.Id"></el-option>
						</el-option-group>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间面积：</span></div>
					<el-input v-model="roomAreas" placeholder="请输入房间面积" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">房间人数：</span></div>
					<el-input v-model="roomPeoples" placeholder="请输入房间面积" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">责任人：</span></div>
					<el-select v-model="peoples" placeholder="请选择归属单位" clearable class="character">
					    <el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">联系方式：</span></div>
					<el-input v-model="contacts" placeholder="请输入联系方式" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="modifyCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="modifyConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="删除房间" :visible.sync="delRoom" width="30%">
				<div class="del"><span class="del_span">是否要删除此房间?</span></div>
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
			building: '',
			buildingList: [],
			floor: '',
			floorList: [],
			rooms: '',
			roomName: '',
			roomArea: '',
			roomPeople: '',
			roomType: '',
			roomTypeList: [{label: '自管',value: 1},{label: '公共',value: 2}],
			attributionUnit: '',
			attributionUnitList: [],
			buildingType: '',
			people: '',
			peopleList: [],
			contact: '',
			addRoom: false,
			modifyRoom: false,
			delRoom: false,
			pageSize: 10,
			currentPage: 1,
			pageTotal: 1,
			buildings: '',
			floors: '',
			roomss: '',
			roomNames: '',
			roomAreas: '',
			roomPeoples: '',
			roomTypes: '',
			peoples: '',
			contacts: '',
			attributionUnits: '',
			buildings1: '',
			floors1: '',
			roomss1: '',
			roomNames1: '',
			roomAreas1: '',
			roomPeoples1: '',
			roomTypes1: '',
			peoples1: '',
			contacts1: '',
			attributionUnits1: '',
			id: '',
			ID: ''
		}
	},
	methods:{
		initBuilding(){
			let data ={
				departId:''
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryBuild`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
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
		/* initFloor(){
			let data ={
				building_id:this.building
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryfloors`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.floorList = []
					res.data.result.floorInfo.forEach((item)=>{
					    this.floorList.push({label: item.floor_name, value: item.floor_id});
					});
				}else{
					this.$message.warning(res.data.resultMessage)
				}
			})
		}, */
		initUnit(){
			this.$axios.post(`BMPlatServers/common/departlist`).then((res)=>{
				console.log(res)
				this.attributionUnitList = []
				this.attributionUnitList = res.data.result.infos
			})
		},
		initPeoples(){
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
		initPeopleNumber(){
			let data={
				id:this.people
			}
			this.$axios.post(`BMPlatServers/device/usertell`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log(res)
					this.contact = res.data.result
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		initPeopleNumbers(){
			let data={
				id:this.peoples
			}
			this.$axios.post(`BMPlatServers/device/usertell`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log(res)
					this.contacts = res.data.result
				}else{
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
			let data={
				roomName:this.keyword,
				pageSize:this.pageSize,
				currentPage:this.currentPage
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/queryroom`, this.$qs.stringify(data)).then((res)=>{
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
		/* 添加房间 */
		addUser(){
			this.addRoom = true
			this.building = ''
			this.floor = ''
			this.rooms = ''
			this.roomName = ''
			this.roomArea = ''
			this.buildingPeople = ''
			this.roomType = ''
			this.people = ''
			this.contact = ''
			this.attributionUnit = ''
		},
		/* 添加确定 */
		/* &&this.roomArea != ''&&this.roomPeople != '' &&this.people != ''&&this.contact != '' &&this.attributionUnit != ''*/
		addConfirm(){
			if(this.roomType == 1){
				if(this.building != ''&&this.floor != ''&&this.rooms != ''&&this.roomName != ''&&this.roomType != ''){
					let data ={
						building_id: this.building,
						floor_id: this.floor,
						room_id: this.rooms,
						room_name: this.roomName,
						area: this.roomArea,
						preson_number: this.roomPeople,
						is_zg: this.roomType,
						uid: this.people,
						phone: this.contact,
						depart_id: this.attributionUnit
					}
					console.log(data)
					this.$axios.post(`BMPlatServers/config/addroom`, this.$qs.stringify(data)).then((res)=>{
						if(res.data.success){
							this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
							this.addRoom = false
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
						message: '房间数据存在空值',
						showClose: true,
						duration: 1000,
					})
				}
			}else{
				/* &&this.roomArea != ''&&this.roomPeople != '' &&this.people != ''&&this.contact != ''*/
				if(this.building != ''&&this.floor != ''&&this.rooms != ''&&this.roomName != ''&&this.roomType != ''){
					let data ={
						building_id: this.building,
						floor_id: this.floor,
						room_id: this.rooms,
						room_name: this.roomName,
						area: this.roomArea,
						preson_number: this.roomPeople,
						is_zg: this.roomType,
						uid: this.people,
						phone: this.contact,
						depart_id: this.attributionUnit
					}
					console.log(data)
					this.$axios.post(`BMPlatServers/config/addroom`, this.$qs.stringify(data)).then((res)=>{
						if(res.data.success){
							this.$message.warning({
								message: res.data.result,
								showClose: true,
								duration: 1000,
							})
							this.addRoom = false
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
						message: '房间数据存在空值',
						showClose: true,
						duration: 1000,
					})
				}
			}
		},
		/* 取消确定 */
		addCancel(){
			this.addRoom = false
		},
		/* 修改房间 */
		clickPerform(item){
			this.modifyRoom = true
			console.log(item)
			this.id = item.Id
			this.buildings = item.buildName
			this.floors = item.floor_id
			this.roomss = item.room_id
			this.roomNames = item.room_name
			this.roomAreas = item.area
			this.roomPeoples = item.preson_number
			this.roomTypes = item.is_zg
			this.peoples = item.username
			this.contacts = item.phone
			this.attributionUnits = item.departNmae
			let data ={
				id: this.id,
			}
			this.$axios.post(`BMPlatServers/config/findroom`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.buildings = res.data.result.list[0].building_id
					/* this.floors1 = res.data.result.list[0].floor_id
					this.roomss1 = res.data.result.list[0].room_id
					this.roomNames1 = res.data.result.list[0].room_name
					this.roomAreas1 = res.data.result.list[0].area
					this.roomPeoples1 = res.data.result.list[0].preson_number */
					this.roomTypes = res.data.result.list[0].is_zg
					this.peoples = res.data.result.list[0].uid
					/* this.contacts1 = res.data.result.list[0].phone */
					this.attributionUnits = res.data.result.list[0].depart_id
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 确定修改 */
		modifyConfirm(){
			/* &&this.roomAreas1 != ''&&this.roomPeoples1 != '' &&this.peoples1 != ''&&this.contacts1 != '' &&this.attributionUnits1 != ''*/
			if(this.roomTypes == 1){
				if(this.buildings != ''&&this.floors != ''&&this.roomss != ''&&this.roomNames != ''&&this.roomTypes != ''){
					let data ={
						id: this.id,
						building_id: this.buildings,
						floor_id: this.floors,
						room_id: this.roomss,
						room_name: this.roomNames,
						area: this.roomAreas,
						preson_number: this.roomPeoples,
						is_zg: this.roomTypes,
						uid: this.peoples,
						phone: this.contacts,
						depart_id: this.attributionUnits
					}
					console.log(data)
					this.$axios.post(`BMPlatServers/config/updateroom`, this.$qs.stringify(data)).then((res)=>{
						if(res.data.success){
							this.$message.warning({
								message: res.data.result,
								showClose: true,
								duration: 1000,
							})
							this.initData()
							this.modifyRoom = false
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
						message: '修改房间数据存在空值',
						showClose: true,
						duration: 1000,
					})
				}
			}else{
				/* &&this.roomAreas1 != ''&&this.roomPeoples1 != '' &&this.peoples1 != ''&&this.contacts1 != ''*/
				if(this.buildings != ''&&this.floors != ''&&this.roomss != ''&&this.roomNames != ''&&this.roomTypes != ''){
					let data ={
						id: this.id,
						building_id: this.buildings,
						floor_id: this.floors,
						room_id: this.roomss,
						room_name: this.roomNames,
						area: this.roomAreas,
						preson_number: this.roomPeoples,
						is_zg: this.roomTypes,
						uid: this.peoples,
						phone: this.contacts,
						depart_id: this.attributionUnits
					}
					console.log(data)
					this.$axios.post(`BMPlatServers/config/updateroom`, this.$qs.stringify(data)).then((res)=>{
						if(res.data.success){
							this.$message.warning({
								message: res.data.result,
								showClose: true,
								duration: 1000,
							})
							this.initData()
							this.modifyRoom = false
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
						message: '修改房间数据存在空值',
						showClose: true,
						duration: 1000,
					})
				}
			}
		},
		/* 取消修改 */
		modifyCancel(){
			this.modifyRoom = false
		},
		/* 删除房间 */
		deleteUser(item){
			this.delRoom = true
			this.ID = item.Id
		},
		/* 确认删除 */
		delConfirm(){
			let data={
				id:this.ID
			}
			this.$axios.post(`BMPlatServers/config/deleteroom`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					})
					this.delRoom = false
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
		delCancel(){
			this.delRoom = false
		},
		/* 搜索房间 */
		search(){
			this.initData()
		},
		/* 分页 */
		handleCurrentChange(){
			this.initData()
		}
	},
	mounted() {
		this.initBuilding()
		/* this.initFloor() */
		this.initPeoples()
		this.initUnit()
		this.initData()
	},
	watch:{
		/* building(){
			console.log(this.building)
			this.initFloor()
		}, */
		people(){
			this.initPeopleNumber()
		},
		peoples(){
			this.initPeopleNumbers()
		}
		/* roomType(roomType){
			if(roomType == 2){

			}
		} */
	}
}
</script>

<style lang="scss" scoped>
#department{
	padding: 15px;
	.department{
		.AddUser{
			mmargin-top: 5px;
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
		.input_div{
			width: 94%;
			margin-left: 3%;
			.span_input{
				margin-left: 5%;
				margin-top: 5px;
				font-size: 15px;
				color: #434343;
				font-weight: 400;
			}
			.input{
				margin-top: 10px;
				width: 90%;
				margin-left: 5%;
			}
			.character{
				margin-top: 10px;
				width: 90%;
				margin-left: 5%;
			}
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
