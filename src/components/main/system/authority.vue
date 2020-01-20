<template>
	<div id="authority">
		<div class="authority">
			<div class="type-search">
				<div class="seach_keyword">
					<span>楼宇名称：</span>
					<el-input v-model="keyword" class="keyword"></el-input>
					<el-button type="primary" size="small" class="btn" icon="el-icon-search" @click="search()">搜索</el-button>
					<el-button type="primary" size="small" class="btn" icon="el-icon-plus"  @click="addUser" v-hasMenu="9-3-1-1">添加楼宇</el-button>
				</div>
			</div>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="name" label="楼宇名称" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="floor" label="楼宇层数" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="room" label="楼宇房间数" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="area" label="楼宇面积" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="person_number" label="楼宇人数" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="type" label="楼宇类型" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="详情" align='center'>
						<template slot-scope="scope">
							<el-button type="text" @click="details(scope.row)" size="mini">查看</el-button>
						</template>
					</el-table-column>
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
			<el-dialog title="楼宇详情" :visible.sync="detailsBuilding">
				<div class="input_div">
					<div><span class="span_input">楼宇信息：</span></div>
					<el-input v-model="buildingInfor1" placeholder="请输入楼宇信息" clearable class="input" type="textarea" :rows="5" disabled></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇经度：</span></div>
					<el-input v-model="buildingLongitude1" placeholder="请输入楼宇经度" clearable class="input" disabled></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇纬度：</span></div>
					<el-input v-model="buildingLatitude1" placeholder="请输入楼宇纬度" clearable class="input" disabled></el-input>
				</div>
			</el-dialog>
			<el-dialog title="增加楼宇" :visible.sync="addBuilding" width="40%">
				<div class="input_div">
					<div><span class="span_input">楼宇名称：</span></div>
					<el-input v-model="buildingName" placeholder="请输入楼宇名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">归属系统：</span></div>
					<el-select v-model="systemid" placeholder="请选择系统类型" clearable class="character" multiple>
					    <el-option v-for="item in systemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇层数：</span></div>
					<el-input v-model="floor" placeholder="请输入楼层" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇房间数：</span></div>
					<el-input v-model="rooms" placeholder="请输入房间数" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇面积：</span></div>
					<el-input v-model="area" placeholder="请输入楼宇面积" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇人数：</span></div>
					<el-input v-model="people" placeholder="请输入楼宇人数" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇经度：</span></div>
					<el-input v-model="buildingLongitude" placeholder="请输入楼宇经度" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇纬度：</span></div>
					<el-input v-model="buildingLatitude" placeholder="请输入楼宇纬度" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇类型：</span></div>
					<el-select v-model="buildingType" placeholder="请选择楼宇类型" clearable class="character">
					    <el-option v-for="item in buildingTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇信息：</span></div>
					<el-input v-model="buildingInfor" placeholder="请输入楼宇信息" clearable class="input" type="textarea" :rows="5"></el-input>
				</div>
				<!-- <div class="input_div">
					<div><span class="span_input">楼宇图片：</span></div>
					<el-input v-model="buildingImg" placeholder="请输入楼宇类型" clearable class="input"></el-input>
				</div> -->
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="cancelBuilding()" size="small">取 消</el-button>
				    <el-button type="primary" @click="confirmBuilding()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="修改楼宇" :visible.sync="modifyBuilding" width="40%">
				<div class="input_div">
					<div><span class="span_input">楼宇名称：</span></div>
					<el-input v-model="buildingNames" placeholder="请输入楼宇名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">归属系统：</span></div>
					<el-select v-model="systemids" placeholder="请选择系统类型" clearable class="character" multiple>
					    <el-option v-for="item in systemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇层数：</span></div>
					<el-input v-model="floors" placeholder="请输入楼层" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇房间数：</span></div>
					<el-input v-model="roomss" placeholder="请输入房间数" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇面积：</span></div>
					<el-input v-model="areas" placeholder="请输入楼宇面积" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇人数：</span></div>
					<el-input v-model="peoples" placeholder="请输入楼宇人数" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇经度：</span></div>
					<el-input v-model="buildingLongitudes" placeholder="请输入楼宇经度" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇纬度：</span></div>
					<el-input v-model="buildingLatitudes" placeholder="请输入楼宇纬度" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇类型：</span></div>
					<el-select v-model="buildingTypes" placeholder="请选择楼宇类型" clearable class="character">
					    <el-option v-for="item in buildingTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">楼宇信息：</span></div>
					<el-input v-model="buildingInfors" placeholder="请输入楼宇信息" clearable class="input" type="textarea" :rows="5"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="modifyCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="modifyConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="删除楼宇" :visible.sync="delBuilding" width="30%">
				<div class="del"><span class="del_span">是否要删除此楼宇?</span></div>
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
			detailsBuilding: false,
			addBuilding: false,
			modifyBuilding: false,
			delBuilding: false,
			buildingName: '',
			floor: '',
			rooms: '',
			area: '',
			people: '',
			buildingType: '',
			buildingTypeList:[{label: '办公建筑', value: '办公建筑'}, {label: '体育建筑', value: '体育建筑'},
			{label: '商场建筑', value: '商场建筑'},{label: '通信建筑', value:'通信建筑'},{label: '宾馆饭店建筑', value: '宾馆饭店建筑'},
			{label: '交通建筑', value: '交通建筑'},{label: '文化教育建筑', value: '文化教育建筑'},{label: '医疗卫生建筑', value: '医疗卫生建筑'},
			{label: '其他', value: '其他'}],
			buildingInfor: '',
			buildingLongitude: '',
			buildingLatitude: '',
			buildingImg: '',
			pageSize: 10,
			currentPage: 1,
			pageTotal: 1,
			buildingInfor1: '',
			buildingLongitude1: '',
			buildingLatitude1: '',
			buildingNames: '',
			floors: '',
			roomss: '',
			areas: '',
			peoples: '',
			buildingTypes: '',
			buildingInfors: '',
			buildingLongitudes: '',
			buildingLatitudes: '',
			id: '',
			ID: '',
			systemid: [],
			systemids: [],
			systemList: []
		}
	},
	methods:{
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
						duration: 1000
					})
				}
			});
		},
		/* 增加楼宇 */
		addUser(){
			this.buildingName = ''
			this.area = ''
			this.floor = ''
			this.rooms = ''
			this.buildingType = ''
			this.buildingInfor = ''
			this.people = ''
			this.buildingLongitude = ''
			this.buildingLatitude = ''
			this.systemid = ''
			this.addBuilding = true
			this.system()
		},
		/* 确定添加楼宇 */
		/* &&this.buildingLongitude != ''&&this.buildingLatitude != '' &&this.people != '' &&this.buildingInfor != ''*/
		confirmBuilding(){
			if(this.buildingName != ''&&this.floor != ''&&this.rooms != ''&&this.buildingType != ''&&this.systemid != ''){
				let arr = JSON.stringify(this.systemid)
				let data = {
					name:this.buildingName,
					area:this.area,
					floor:this.floor,
					room:this.rooms,
					type:this.buildingType,
					intro:this.buildingInfor,
					person_number:this.people,
					longitude:this.buildingLongitude,
					latitude:this.buildingLatitude,
					system_id:arr
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/addbuilding`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						});
						this.initData()
						this.addBuilding = false
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
					message: '数据填写不能为空',
					showClose: true,
					duration: 1000,
				});
			}
		},
		/* 取消添加楼宇 */
		cancelBuilding(){
			this.buildingName = ''
			this.area = ''
			this.floor = ''
			this.rooms = ''
			this.buildingType = ''
			this.buildingInfor = ''
			this.people = ''
			this.buildingLongitude = ''
			this.buildingLatitude = ''
			this.addBuilding = false
		},
		/* 详情页面 */
		details(item){
			this.detailsBuilding = true
			console.log(item)
			this.buildingInfor1 = item.intro,
			this.buildingLongitude1 =  item.longitude,
			this.buildingLatitude1 =  item.latitude
		},
		/* 修改楼宇 */
		clickPerform(item){
			console.log(item)
			this.modifyBuilding  = true
			this.system()
			this.id = item.Id
			this.buildingNames = item.name
			this.areas = item.area
			this.floors = item.floor
			this.roomss = item.room
			this.buildingTypes = item.type
			this.buildingInfors = item.intro
			this.peoples = item.person_number
			this.buildingLongitudes = item.longitude
			this.buildingLatitudes = item.latitude
			this.systemids = item.system_id
		},
		/* 确定修改 */
		/* &&this.buildingLongitudes != ''&&this.buildingLatitudes != '' &&this.peoples != '' &&this.buildingInfors != ''*/
		modifyConfirm(){
			if(this.buildingNames != ''&&this.floors != ''&&this.roomss != ''&&this.buildingTypes != ''){
				let data ={
					id:this.id,
					buildName:this.buildingNames,
					area:this.areas,
					floor:this.floors,
					room:this.roomss,
					type:this.buildingTypes,
					intro:this.buildingInfors,
					person_number:this.peoples,
					longitude:this.buildingLongitudes,
					latitude:this.buildingLatitudes
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/updatebuilding`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						});
						this.modifyBuilding = false
						this.initData()
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						});
					}
				})
			}else{
				this.$message.warning({
					message: '修改楼宇数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 取消修改 */
		modifyCancel(){
			this.modifyBuilding = false
		},
		/* 删除楼宇 */
		deleteUser(item){
			this.delBuilding = true
			this.ID = item.Id
		},
		/* 确定楼宇 */
		delConfirm(){
			let data ={
				id: this.ID
			}
			this.$axios.post(`BMPlatServers/config/deletebuilding`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					});
					this.delBuilding = false
					this.initData()
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		/* 取消楼宇 */
		delCancel(){
			this.delBuilding = false
		},
		/* 查询楼宇 */
		initData(){
			let data ={
				buildName:this.keyword,
				pageSize:this.pageSize,
				currentPage:this.currentPage
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/querybuilding`, this.$qs.stringify(data)).then((res)=>{
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
		/* 分页 */
		handleCurrentChange(){
			this.initData()
		},
		/* 详情 */
		search(){
			this.initData()
		}
	},
	mounted() {
		this.initData()
	},
	watch:{

	}
}
</script>

<style lang="scss" scoped>
#authority{
	padding: 15px;
	.authority{
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
			.el-input.is-disabled .el-input__inner{
				background-color: #ffffff;
				color: #434343;
			}
			.el-textarea.is-disabled .el-textarea__inner{
				background-color: #ffffff;
				color: #434343;
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
