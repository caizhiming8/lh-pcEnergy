<template>
	<div id="jobs">
		<div class="jobs">
			<div class="type-search">
				<div class="seach_keyword">
					<span>单位名称：</span>
					<el-input v-model="keyword" class="keyword"></el-input>
					<el-button type="primary" size="small" icon="el-icon-search" class="btn" @click="search()">搜索</el-button>
					<el-button type="primary" @click="addUser" icon="el-icon-plus" class="btn" size="small" v-hasMenu="9-3-3-1">添加二级单位</el-button>
				</div>
			</div>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="in_name" label="单位类别" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="departName" label="单位名称" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="username" label="责任人" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="phone" label="联系方式" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="people_cnt" label="人数" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="area" label="面积" align='center'></el-table-column>
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
			<el-dialog title="添加单位" :visible.sync="addUnit" width="40%">
				<div class="input_div">
					<div><span class="span_input">单位类别：</span></div>
					<el-select v-model="unitType" placeholder="请选择单位类别" clearable class="character" filterable>
						<el-option v-for="item in unitTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">单位名称：</span></div>
					<el-input v-model="unitName" placeholder="请输入单位名称" clearable class="input"></el-input>
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
				<div class="input_div">
					<div><span class="span_input">人数：</span></div>
					<el-input v-model="people_number" placeholder="请输入人数" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">面积：</span></div>
					<el-input v-model="area" placeholder="请输入面积" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="addCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="addConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="修改单位i" :visible.sync="modifyUnit" width="40%">
				<div class="input_div">
					<div><span class="span_input">单位类别：</span></div>
					<el-select v-model="unitTypes" placeholder="请选择单位类别" clearable class="character" filterable>
						<el-option v-for="item in unitTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">单位名称：</span></div>
					<el-input v-model="unitNames" placeholder="请输入单位名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">责任人：</span></div>
					<el-select v-model="peoples" placeholder="请选择责任人" clearable class="character" filterable>
						<el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">联系方式：</span></div>
					<el-input v-model="contacts" placeholder="请输入联系方式" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">人数：</span></div>
					<el-input v-model="people_numbers" placeholder="请输入人数" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">面积：</span></div>
					<el-input v-model="areas" placeholder="请输入面积" clearable class="input" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="modifyCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="modifyConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="删除单位" :visible.sync="delUnit" width="30%">
				<div class="del"><span class="del_span">是否要删除单位?</span></div>
				<span></span>
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
			unitType: '',
			unitTypeList: [],
			unitName: '',
			people: '',
			peopleList: [],
			contact: '',
			people_number: '',
			area: '',
			addUnit: false,
			modifyUnit: false,
			delUnit: false,
			unitTypes: '',
			unitNames: '',
			peoples: '',
			contacts: '',
			people_numbers: '',
			areas: '',
			unitTypes_id: '',
			unitNames_id: '',
			peoples_id: '',
			pageSize: 10,
			currentPage: 1,
			pageTotal: 1,
			ID: ''
		}
	},
	methods:{
		initUnitType(){
			this.$axios.post(`BMPlatServers/config/querydepartclass`).then((res) => {
				if(res.data.success){
					console.log(res)
					this.unitTypeList = []
					 res.data.result.list.forEach((item)=>{
						this.unitTypeList.push({label: item.in_name, value: item.in_id});
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
		/* 查询所有单位 */
		initData(){
			let data={
				roomName:this.keyword,
				pageSize:this.pageSize,
				currentPage:this.currentPage
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/querydepart`, this.$qs.stringify(data)).then((res)=>{
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
		/* 添加单位 */
		addUser(){
			this.unitType = ''
			this.unitName = ''
			this.area = ''
			this.people_number = ''
			this.people = ''
			this.contact = ''
			this.addUnit = true
		},
		/* 确定添加单位 */
		addConfirm(){
			/* &&this.area != ''&&this.people_number != ''&&this.people != ''&&this.contact != '' */
			if(this.unitType != ''&&this.unitName != ''){
				let data={
					class_id:this.unitType,
					name:this.unitName,
					area:this.area,
					people_cnt:this.people_number,
					uid:this.people,
					phone:this.contact
				}
				this.$axios.post(`BMPlatServers/config/adddepart`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.addUnit = false
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
					message: '二级单位数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 取消添加单位 */
		addCancel(){
			this.unitType = ''
			this.unitName = ''
			this.area = ''
			this.people_number = ''
			this.people = ''
			this.contact = ''
			this.addUnit = false
		},
		/* 修改单位 */
		clickPerform(item){
			this.modifyUnit = true
			console.log(item)
			this.unitTypes = item.in_name
			this.unitNames = item.departName
			this.areas = item.area
			this.people_numbers = item.people_cnt
			this.peoples = item.username
			this.contacts = item.phone
			this.unitTypes_id = item.class_id
			this.unitNames_id = item.depart_id
			this.peoples_id = item.uid
		},
		/* 确定修改 */
		modifyConfirm(){
			/* &&this.areas != ''&&this.people_numbers != ''&&this.peoples != ''&&this.contacts != '' */
			if(this.unitTypes != ''&&this.unitNames != ''){
				let data ={
					class_id:this.unitTypes_id,
					name:this.unitNames_id,
					area:this.areas,
					people_cnt:this.people_numbers,
					uid:this.peoples_id,
					phone:this.contacts
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/updatedepart`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.modifyUnit = false
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
					message: '二级单位修改数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 取消修改 */
		modifyCancel(){
			this.modifyUnit = false
		},
		deleteUser(item){
			this.delUnit = true
			this.ID = item.depart_id
		},
		/* 确定删除 */
		delConfirm(){
			let data={
				id:this.ID
			}
			this.$axios.post(`BMPlatServers/config/deletedepart`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					})
					this.delUnit = false
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
		/* 取消删除 */
		delCancel(){
			this.delUnit = false
		},
		search(){
			this.initData()
		},
		/* 分页 */
		handleCurrentChange(){
			this.initData()
		}
	},
	mounted() {
		this.initPeoples()
		this.initUnitType()
		this.initData()
	},
	watch:{
		people(){
			this.initPeopleNumber()
		},
		peoples(){
			this.initPeopleNumbers()
		}
	}
}
</script>

<style lang="scss" scoped>
	#jobs{
		padding: 15px;
		.jobs{
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
