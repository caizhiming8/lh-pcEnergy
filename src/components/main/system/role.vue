<template>
	<div id="role">
		<div class="role">
			<div class="type-search">
				<span>角色名称：</span>
				<el-input v-model="license" clearable class="license"></el-input>
				<el-button type="primary" class="btn" size="small" @click="search()" icon="el-icon-search">查询</el-button>
				<el-button type="primary" class="btn" size="small" v-hasMenu="9-2-1" icon="el-icon-plus" @click="addUser">添加角色</el-button>
			</div>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="roleName" label="角色名称" align='center'></el-table-column>
					<el-table-column label="操作" width="450" align='center'>
					    <template slot-scope="scope">
							<el-button @click="allocation(scope.row)" size="mini" type="primary" v-hasMenu="9-2-4">配置 </el-button>
							<el-button @click="modifyRoles(scope.row)" size="mini" type="success" v-hasMenu="9-2-2">修改角色</el-button>
							<!-- <el-button @click="modifyPermissionss(scope.row)" size="small" type="success" plain>修改权限</el-button> -->
							<el-button @click="deleteUser(scope.row)" size="mini" type="danger" v-hasMenu="9-2-3">删除</el-button>
					    </template>
					</el-table-column>
				</el-table>
				<div class="pagination">
				    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
			</div>
			<!-- 角色增加 -->
			<el-dialog title="增加角色" :visible.sync="addRole" width="30%">
				<span class="span_input">角色：</span>
				<el-input v-model="roleNames" clearable style="width: 160px;"></el-input>
				<div class="input_button">
					<el-button class="button_cancel" @click="cancelAdd()" size="small">取消</el-button>
					<el-button type="primary" class="button_confirm" @click="confirmAdd()" size="small">保存</el-button>
				</div>
			</el-dialog>
			<!-- 配置权限 -->
			<el-dialog title="配置权限" :visible.sync="Permissions" width="30%">
				<el-tree :data="data" :props="defaultProps" highlight-current show-checkbox @check="handleNodeClick" node-key="id" ref="tree"></el-tree>
				<div class="input_button">
					<el-button class="button_cancel" @click="cancelPermissions()" size="small">取消</el-button>
					<el-button type="primary" class="button_confirm" @click="confirmPermissions()" size="small">保存</el-button>
				</div>
			</el-dialog>
			<!-- 角色修改 -->
			<el-dialog title="修改角色" :visible.sync="modifyRole" width="30%">
				<span>角色：</span>
				<el-input v-model="modifyname" clearable style="width: 160px;"></el-input>
				<div class="input_button">
					<el-button class="button_cancel" @click="cancelModify()" size="small">取消</el-button>
					<el-button type="primary" class="button_confirm" @click="confirmModify()" size="small">保存</el-button>
				</div>
			</el-dialog>
			<!-- 修改权限 -->
			<el-dialog title="修改权限" :visible.sync="modifyPermissions" width="50%">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="权限管理" name="2">
						<div class="input_div">
							<span>权限树待定</span>
						</div>
					</el-tab-pane>
				</el-tabs>
				<div class="input_button">
					<el-button class="button_cancel" size="small">取消</el-button>
					<el-button type="primary" class="button_confirm" size="small">保存</el-button>
				</div>
			</el-dialog>
			<!-- 角色删除 -->
			<el-dialog title="删除角色" :visible.sync="deleteRoles" width="30%">
				<span>是否要删除此角色</span>
				<span slot="footer" class="dialog-footer">
				    <el-button @click="cancelDel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="confirmDel()" size="small">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			license: '',
			licenseList: [],
			tableData: [],
			addRole: false,
			Permissions: false,
			modifyRole: false,
			modifyPermissions: false,
			deleteRoles: false,
			activeName: '1',
			roleNames: '',
			modifyname: '',
			modifyID: '',
			deleteID: '',
			pageSize: 10,
			currentPage: 1,
			pageTotal: 0,
			treeData: '',
			treeData1: '',
			PermissionsID: '',
			treeList: [],
			data: [],
			true: true,
			defaultProps: {
			  children: 'children',
			  label: 'label'
			},
			currentUserInfo: this.$_globalData.$_userInfo
		}
	},
	methods:{
		/* 查询所有角色 */
		initData(){
			let data={
				roleName:this.license,
				pageSize:this.pageSize,
				currentPage:this.currentPage,
				Id: this.$_globalData.$_userInfo.Id
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/authority/queryRoles`, this.$qs.stringify(data)).then((res)=>{
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
		initTree(){
			let _this = this;
			this.$axios.post(`BMPlatServers/authority/queryMenu`,_this.$qs.stringify({
					Id: _this.currentUserInfo.Id,
					roleId: JSON.stringify(_this.currentUserInfo.roleId.split(','))})).then((res) =>{
				if(res.data.success){
					console.log(res)
					if(res.data.result.list && res.data.result.list.length) {
						// debugger
						this.data = res.data.result.list;
						this.initTrees()
					}else{
						this.data = []
						this.$message.warning({
							message: '权限树暂无数据',
							showClose: true,
							duration: 1000,
						});
					}
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		initTrees(){
			let data={
				roleId:this.PermissionsID,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/authority/queryRoleAuthority`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.treeList = []
					this.treeList = res.data.result.list
					setTimeout(res=> {
						console.log(this.treeList)
						this.$refs.tree.setCheckedNodes(this.treeList)
					},100)
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		/* 添加角色 */
		addUser(){
			this.addRole = true
		},
		/* 确定增加 */
		confirmAdd(){
			if(this.roleNames != ''&&this.roleNames != null){
				let data={
					roleName:this.roleNames,
					Id: this.$_globalData.$_userInfo.Id
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/authority/insertRole`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.addRole = false
						this.roleNames = ''
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
					message: '请输入角色名称',
					showClose: true,
					duration: 1000,
				});
			}
		},
		/* 取消添加 */
		cancelAdd(){
			this.addRole = false
			this.roleNames = ''
		},
		/* 配置权限 */
		allocation(item){
			this.Permissions = true
			this.initTree()
			this.PermissionsID = item.id
		},
		/* 确定配置 */
		confirmPermissions(){
			let data={
				roleId:this.PermissionsID,
				iden:'role',
				list:this.treeData,
				list1:this.treeData1
			}
			var data1 = {
				map:JSON.stringify(data)
			}
			console.log(data1)
			this.$axios.post(`BMPlatServers/authority/insertRoleAuthority`, this.$qs.stringify(data1)).then((res)=>{
				if(res.data.success){
					this.Permissions = false
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
		cancelPermissions(){
			this.Permissions = false
		},
		/* 修改角色 */
		modifyRoles(item){
			this.modifyRole = true
			this.modifyname = item.roleName
			this.modifyID = item.id
		},
		/* 确定修改 */
		confirmModify(){
			let data={
				roleName:this.modifyname,
				roleId:this.modifyID
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/authority/updateRoles`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.modifyRole = false
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
		/* 取消修改 */
		cancelModify(){
			this.modifyRole = false
		},
		modifyPermissionss(){
			this.modifyPermissions = true
		},
		/* 删除角色 */
		deleteUser(item){
			this.deleteRoles = true
			this.deleteID = item.id
		},
		/* 确定删除 */
		confirmDel(){
			let data={
				roleId:this.deleteID
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/authority/deleteRole`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.deleteRoles = false
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
		/* 取消删除 */
		cancelDel(){
			this.deleteRoles = false
		},
		/* 搜索 */
		search(){
			this.initData()
		},
		/* 权限树 */
		handleNodeClick() {
			this.treeData = this.$refs.tree.getCheckedKeys()
			this.treeData1 = this.$refs.tree.getHalfCheckedKeys()
			console.log(this.treeData)
			console.log(this.treeData1)
		},
		/* 分页 */
		handleCurrentChange(){
			this.initData()
		},
		/* tab切换 */
		handleClick(tab,event){
			console.log(tab,event)
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
	#role{
		padding: 15px;
		.role{
			.AddUser{
				margin-top: 5px;
				width: 94%;
				margin-left: 3%;
				zoom:1;
				border-bottom: 1px solid #ececec;
				.headline{
					float: left;
					margin-left: 3%;
					margin-top: 19px;
					font-size: 15px;
					color: #434343;
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
				padding: 20px 15px;
				.license{
					width: 180px;
				}
				.seach{
					margin-left: 40px;
				}
				.btn{
					margin-left: 40px;
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
					width: 160px;
				}
			}
			.input_button{
				margin-top: 20px;
				margin-left: 70%;
			}
			.input_tree{
				width: 94%;
				margin-left: 3%;
				height: 500px;
				overflow: auto;
				border-right: 1px solid #ddd;
				/deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
				    font-weight: 700;
				    color: #2975E6;
				}
			}
			width: 98%;
			margin: 0 auto;
			box-shadow: 0 0 6px #ddd;
			-webkit-box-shadow: 0 0 6px #ddd;
			-ms-box-shadow: 0 0 6px #ddd;
			-moz-box-shadow: 0 0 6px #ddd;
			-o-box-shadow: 0 0 6px #ddd;
		}
	}
</style>
