<template>
	<div id="configurationWarm">
		<div class="configurationWarm">
			<div class="type-search">
				<div class="seach_keyword">
					<span>供热区域：</span>
					<el-input v-model="keyword" class="keyword"></el-input>
					<el-button type="primary" size="small" class="btn" icon="el-icon-search" @click="search()">搜索</el-button>
					<el-button type="primary" size="small" class="btn" icon="el-icon-plus" @click="addUser">添加暖分区</el-button>
				</div>
			</div>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="tableData" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="buildingName" label="供热管网" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="area_position" label="区域" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="area_comment" label="描述" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="inName" label="入表" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="outName" label="出表" align='center'></el-table-column>
					<el-table-column label="操作" width="250" align='center'>
					    <template slot-scope="scope">
							<el-button @click="clickPerform(scope.row)" size="mini" type="success" v-hasMenu="9-3-9-2">修改</el-button>
							<el-button @click="deleteUser(scope.row)" size="mini" type="danger" v-hasMenu="9-3-9-3">删除</el-button>
					    </template>
					</el-table-column>
				</el-table>
				<div class="pagination">
					<el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
			</div>
			<el-dialog title="增加暖分区" :visible.sync="addWarm">
				<div class="input_div">
					<div><span class="span_input">供热管网：</span></div>
					<el-select v-model="heatNet" placeholder="请选择" class="character" filterable>
						<el-option v-for="item in heatNetList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">区域地址：</span></div>
					<el-input v-model="addr" placeholder="请输入区域地址" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">入表：</span></div>
					<el-select v-model="intoTable" placeholder="请选择" class="character"  multiple>
						<el-option v-for="item in intoTableList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">出表：</span></div>
					<el-select v-model="outTable" placeholder="请选择" class="character"  multiple>
						<el-option v-for="item in outTableList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">区域描述：</span></div>
					<el-input v-model="areaName" placeholder="请输入区域描述" clearable class="input" type="textarea" :rows="5"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="addCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="addConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="修改暖分区" :visible.sync="modifyWarm">
				<div class="input_div">
					<div><span class="span_input">供热管网：</span></div>
					<el-select v-model="heatNets" placeholder="请选择" class="character" filterable>
						<el-option v-for="item in heatNetList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">区域地址：</span></div>
					<el-input v-model="addrs" placeholder="请输入区域地址" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">入表：</span></div>
					<el-select v-model="intoTables" placeholder="请选择" class="character"  multiple>
						<el-option v-for="item in intoTableList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">出表：</span></div>
					<el-select v-model="outTables" placeholder="请选择" class="character"  multiple>
						<el-option v-for="item in outTableList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">区域描述：</span></div>
					<el-input v-model="areaNames" placeholder="请输入区域描述" clearable class="input" type="textarea" :rows="5"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="modifyCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="modifyConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="删除此分区" :visible.sync="delWarm" width="30%">
				<div class="del"><span class="del_span">是否要删除此分区?</span></div>
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
			addWarm: false,
			modifyWarm: false,
			delWarm:false,
			areaName: '',
			addr: '',
			heatNet: '',
			heatNetList: [],
			intoTable: [],
			outTable: [],
			intoTableList: [],
			outTableList: [],
			areaNames: '',
			addrs: '',
			heatNets: '',
			intoTables: [],
			outTables: [],
			warmList: [],
			ID: '',
			id: '',
			pageSize: 10,
			currentPage: 1,
			pageTotal: 0,
		}
	},
	methods:{
		/* 供热管网获取 */
		initWarm(){
			this.$axios.post(`BMPlatServers/config/selectHeatGrid`).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.heatNetList = []
					res.data.result.list.forEach((item)=>{
						this.heatNetList.push({label: item.buildingName, value: item.buildingId});
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
		/* 供热设备获取 */
		initWarmList(){
			this.$axios.post(`BMPlatServers/config/selectHeatDevice`).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.intoTableList = []
					this.outTableList = []
					res.data.result.forEach((item)=>{
						this.intoTableList.push({label: item.name, value: item.id});
						this.outTableList.push({label: item.name, value: item.id});
						this.warmList.push({label: item.name, value: item.id});
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
		initData(){
			let data={
				name:this.keyword,
				pageSize:this.pageSize,
				currentPage:this.currentPage
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/selectHeatArea`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.tableData = []
					this.tableData = res.data.result.list
					this.pageTotal = res.data.result.num
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
		/* 添加暖分区 */
		addUser(){
			this.addr = ''
			this.areaName = ''
			this.intoTable = ''
			this.outTable = ''
			this.heatNet = ''
			this.addWarm = true
		},
		/* 确定增加 */
		addConfirm(){
			if(this.addr != ''&&this.areaName != ''&&this.intoTable != []&&this.intoTable != null&&this.intoTable != ''&&this.outTable != []&&this.outTable != ''&&this.outTable != null&&this.heatNet != ''){
				var inList = JSON.stringify(this.intoTable)
				var outList = JSON.stringify(this.outTable)
				let data={
					area_position:this.addr,
					area_comment:this.areaName,
					inList:inList,
					outList:outList,
					buildingId:this.heatNet
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/insertHeatArea`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.addWarm = false
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
					message: '暖分区数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 确定取消 */
		addCancel(){
			this.addWarm = false
			this.addr = ''
			this.areaName = ''
			this.intoTable = ''
			this.outTable = ''
			this.heatNet = ''
		},
		/* 修改暖分区 */
		clickPerform(item){
			console.log(item)
			this.modifyWarm = true
			this.addrs = item.area_position
			this.areaNames = item.area_comment
			this.intoTables = item.inList
			this.outTables =item.outList
			this.id = item.id
			this.heatNets = item.buildingId
		},
		/* 修改确定 */
		modifyConfirm(){
			if(this.addrs != ''&&this.areaNames != ''&&this.intoTables != []&&this.intoTables != ''&&this.intoTables != null&&this.outTables != []&&this.outTables != ''&&this.outTables != null&&this.heatNets != ''){
				this.modifyWater = false
				var inList = JSON.stringify(this.intoTables)
				var outList = JSON.stringify(this.outTables)
				let data={
					area_position:this.addrs,
					area_comment:this.areaNames,
					inList:inList,
					outList:outList,
					id:this.id,
					buildingId:this.heatNets
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/updateHeatArea`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.modifyWarm = false
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
					message: '修改暖分区数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 修改取消 */
		modifyCancel(){
			this.modifyWarm = false
		},
		/* 删除暖分区 */
		deleteUser(item){
			this.delWarm = true
			this.ID = item.id
		},
		/* 删除确定 */
		delConfirm(){
			let data={
				id: this.ID
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/deleteHeatArea`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					})
					this.delWarm = false
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
			this.delWarm = false
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
		this.initWarm()
		this.initWarmList()
	},
	watch:{
		intoTable(item){
			let a = JSON.stringify(item)
			this.outTableList = [];
			for(var i = 0;i<this.warmList.length;i++){
				if(a.indexOf(this.warmList[i].value) < 0){
					this.outTableList.push(this.warmList[i])
				}
			}
		},
		outTable(item){
			let a = JSON.stringify(item)
			this.intoTableList = [];
			for(var i = 0;i<this.warmList.length;i++){
				if(a.indexOf(this.warmList[i].value) < 0){
					this.intoTableList.push(this.warmList[i])
				}
			}
		},
		intoTables(item){
			let a = JSON.stringify(item)
			this.outTableList = [];
			for(var i = 0;i<this.warmList.length;i++){
				if(a.indexOf(this.warmList[i].value) < 0){
					this.outTableList.push(this.warmList[i])
				}
			}
		},
		outTables(item){
			let a = JSON.stringify(item)
			this.intoTableList = [];
			for(var i = 0;i<this.warmList.length;i++){
				if(a.indexOf(this.warmList[i].value) < 0){
					this.intoTableList.push(this.warmList[i])
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	#configurationWarm{
		padding: 15px;
		.configurationWarm{
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
