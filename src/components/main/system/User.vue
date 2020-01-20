<template>
	<div id="user" v-loading="get_userListLoading">
		<div class="user">
			<!-- 用户管理 -->
			<span>姓名：</span>
			<el-input v-model="req_getUsersList.username" style="width: 180px;"></el-input>
			<el-button type="primary" class="btn" icon="el-icon-search" @click="getUserListEvent" size="small">查询</el-button>
			<el-button type="primary" class="btn" @click="addUser" size="small" v-hasMenu="9-1-1" icon="el-icon-plus">添加用户</el-button>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="users_listArr" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="username" label="姓名" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="login_name" label="登录名" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="phone" label="手机号" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="userState" label="激活状态" align='center'></el-table-column>
					<el-table-column label="操作" width="320" align='center'>
					    <template slot-scope="scope">
							<el-button @click="addUser(scope.row)" size="mini" type="success" v-hasMenu="9-1-2" >修改</el-button>
							<el-button @click="authorityEvent(scope.row)" size="mini" type="primary" v-hasMenu="9-1-3">权限</el-button>
							<el-button @click="goOpenDeleteuserModel(scope.row)" :disabled="add_userLoading" size="mini" type="danger" v-hasMenu="9-1-4">删除</el-button>
							<el-button @click="goResetuserModel(scope.row)" :disabled="add_userLoading" size="mini" type="warning" v-hasMenu="9-1-5">重置密码</el-button>
					    </template>
					</el-table-column>
				</el-table>
				<div class="pagination">
				    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='req_getUsersList.currentPage' :page-size='req_getUsersList.pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
			</div>
			<!-- 用户/修改-添加 -->
			<el-dialog :title="req_addUserInfo.Id?'修改用户':'添加用户'" :visible.sync="userControl" width="50%">
				<el-form :model="req_addUserInfo" :rules="add_roleRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="姓名" prop="username">
						<el-input v-model="req_addUserInfo.username" placeholder="请输入姓名" clearable class="input"></el-input>
					</el-form-item>
					<el-form-item label="登录名" prop="login_name">
						<el-input v-model="req_addUserInfo.login_name" placeholder="请输入登录名" clearable></el-input>
					</el-form-item>
					<el-form-item label="手机号码" prop="phone">
						<el-input v-model="req_addUserInfo.phone" placeholder="请输入手机号码" clearable class="input"></el-input>
					</el-form-item>
					<el-form-item label="是否激活" prop="is_del">
						<el-switch
							v-model="req_addUserInfo.is_del1"
							active-text="激活"
							inactive-text="未激活">
						</el-switch>
					</el-form-item>
					<el-form-item label="角色" prop="name">
						<el-select v-model="req_addUserInfo.roleList1" multiple placeholder="请选择" style="width: 100%;"
						@change="roleSelectChange">
							<el-option
							v-for="item in roles_listArr"
							:key="item.id"
							:label="item.roleName"
							:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer">
					<el-button @click="userControl = false" size="small">取消</el-button>
					<el-button type="primary" :disabled="add_userLoading" @click="goAddUser('ruleForm')" size="small">保存</el-button>
				</span>
			</el-dialog>
			<!-- 权限分配 -->
			<el-dialog title="权限分配" :visible.sync="control_modelShow" width="50%">
				<el-tree
					:data="control_dataList"
					:props="defaultProps"
					accordion
					show-checkbox
					:highlight-current=true
					ref="controlTree"
					node-key="id"
					:default-checked-keys='resourceCheckedKey'>
				</el-tree>
				<span slot="footer">
					<el-button @click="control_modelShow = false" size="small">取消</el-button>
					<el-button type="primary" :disabled="add_userLoading" @click="goAddUserAuthority()" size="small">保存</el-button>
				</span>
			</el-dialog>
			<el-dialog
				title="提示"
				:visible.sync="delete_userModelShow"
				width="30%"
				center>
				<span>确定删除该用户？</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="delete_userModelShow = false" size="small">取 消</el-button>
					<el-button type="primary" :disabled="add_userLoading" @click="deleteUser()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog
				title="提示"
				:visible.sync="reset_userModelShow"
				width="30%"
				center>
				<span>确定重置该用户密码？</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="reset_userModelShow = false" size="small">取 消</el-button>
					<el-button type="primary" :disabled="add_userLoading" @click="resetPassword()" size="small">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		let validatemouseCode  = (rule,value,callback ) =>{
			value = this.req_addUserInfo.phone;
			if(!(/^(((13[0-9])|(14[5-7])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8})$/.test(value))){
				callback(new Error('手机号格式不正确'))
			}else{
				callback()
			}
		}
		return{
			senior: '0',
			userControl: false,
			control_modelShow: false,
			delete_userModelShow: false,
			reset_userModelShow: false,
			license: '',
			licenseList: [],
			character: '',
			characterList: [],
			req_addUserInfo: {
				username: '',
				login_name: '',
				phone: '',
				is_del: false,
				is_del1: false,
				roleList: [],
				Id: this.$_globalData.$_userInfo.Id,
				roleList1: [],
			},
			options:[],
			pageTotal: 0,
			add_roleRules: {
				username: [
                    { required: true, message: '用户姓名不能为空', trigger: 'blur' }
				],
				login_name: [
                    { required: true, message: '登录名不能为空', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '手机号不能为空', trigger: 'blur' },
					{ required:true, validator: validatemouseCode, trigger:'change'}
				]
			},
			req_getUsersList: {
				currentPage: 1,
				pageSize:15,
				username: '',
				Id: this.$_globalData.$_userInfo.Id,
				roleId: JSON.stringify(this.$_globalData.$_userInfo.roleId.split(','))
			},
			// 获取角色和用户列表的loading
			get_userListLoading: false,
			add_userLoading: false,
			roles_listArr: [],
			users_listArr: [],
			// 权限树 数据
			control_dataList: [],
			defaultProps: {
			  	children: 'children',
				label: 'label'
			},
			resourceCheckedKey: [],
			// 当前选择的用户信息
			current_userInfo: null,
			projectList: [],
			currentUserInfo: this.$_globalData.$_userInfo
		}
	},
	methods:{
		addUser(e){
			let _this = this;
			_this.userControl = true;
			_this.req_addUserInfo.Id = e.Id;
			_this.req_addUserInfo.username = e.username;
			_this.req_addUserInfo.phone = e.phone;
			_this.req_addUserInfo.login_name = e.login_name;
			_this.req_addUserInfo.roleList = e.role_id;
			_this.req_addUserInfo.roleList1 = e.role_id;
			_this.req_addUserInfo.is_del1 = e.is_del=="1"? true: false;
			if(_this.roles_listArr.length>0) {
				return;
			}
			this.$axios.post(`BMPlatServers/authority/queryRoles`, _this.$qs.stringify({pageSize: 50, currentPage: 1,
				Id: _this.$_globalData.$_userInfo.Id}))
				.then(res=> {
					_this.get_userListLoading = false;
					if(res.data.success) {
						_this.roles_listArr = res.data.result.list;
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						});
					}
				})
				.catch(res=> {
					_this.get_userListLoading = false;
				})
		},
		// 添加用户按钮保存事件
		goAddUser(formName) {
			let _this = this;
			_this.$refs[formName].validate((valid) => {
                if (valid) {
					_this.add_userLoading = true;
					_this.req_addUserInfo.roleList = JSON.stringify(_this.req_addUserInfo.roleList1);
					_this.req_addUserInfo.is_del = _this.req_addUserInfo.is_del1? 1: 0;
					if(_this.req_addUserInfo.Id) {
						_this.$axios.post(`BMPlatServers/authority/updateuser`, _this.$qs.stringify(_this.req_addUserInfo))
							.then(res=> {
								_this.add_userLoading = false;
								if(res.data.success) {
									_this.getUserListEvent();
									_this.userControl = false;
									_this.$refs[formName].resetFields();
								}else{
									_this.$message.warning({
										message: res.data.resultMessage,
										showClose: true,
										duration: 1000,
									});
								}
							})
							.catch(res=> {
								_this.add_userLoading = false;
								_this.get_userListLoading = false;
							})
					}else{
						const addUserPromise = new Promise((rej)=> {
							const a = JSON.stringify(_this.req_addUserInfo);
							let b = JSON.parse(a);
							b.remote = 1;
							_this.$axios.post(`BMPlatServers/authority/addRemoteUser`, _this.$qs.stringify(b))
									.then(res=> {
										if(res.data.success) {
											rej();
											// _this.$refs[formName].resetFields();
										}else{
											this.$message.warning({
												message: res.data.resultMessage,
												showClose: true,
												duration: 1000,
											});
										}
									})
									.catch(res=> {
										_this.add_userLoading = false;
										_this.get_userListLoading = false;
									})
						})
						addUserPromise
							.then(()=> {
								_this.$axios.post(`BMPlatServers/authority/addUser`, _this.$qs.stringify(_this.req_addUserInfo))
									.then(res=> {
										_this.add_userLoading = false;
										if(res.data.success) {
											_this.getUserListEvent();
											_this.userControl = false;
											// _this.$refs[formName].resetFields();
										}else{
											this.$message.warning({
												message: res.data.resultMessage,
												showClose: true,
												duration: 1000,
											});
										}
									})
									.catch(res=> {
										_this.add_userLoading = false;
										_this.get_userListLoading = false;
									})
							})
					}
				}
			});
		},
		// 重置密码
		resetPassword(e) {
			let _this = this;
			_this.add_userLoading = true;
			_this.$axios.post(`BMPlatServers/authority/resetpassword`, _this.$qs.stringify({uid: _this.current_userInfo.Id, flag: true}))
				.then((res)=>{
					_this.add_userLoading = false;
					if(res.data.success){
						_this.reset_userModelShow = false;
						_this.$message.success('重置成功');
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						});
					}
				})
				.catch(()=> {
					_this.add_userLoading = false;
					_this.get_userListLoading = false;
				})
		},
		/* 分页 */
		handleCurrentChange(){
			this.getUserListEvent()
		},
		// 用户列表----权限按钮
		authorityEvent(e){
			let _this = this;
			// 获取用户所有权限
			_this.get_userListLoading = true;
			_this.current_userInfo = e;
			const userAuthority = new Promise(resolve=> {
				_this.$axios.post(`BMPlatServers/authority/queryuserrole`,_this.$qs.stringify({Id:e.Id}))
					.then(res=> {
						if(res.data.success) {
							let e = res.data.result;
							resolve(e);
						}else{
							this.$message.warning({
								message: res.data.resultMessage,
								showClose: true,
								duration: 1000,
							});
							_this.get_userListLoading = false;
						}
					})
					.catch(res=> {
						// _this.get_userListLoading = false;
						_this.get_userListLoading = false;
					})
			})
			userAuthority.then((e)=> {
				_this.$axios.post(`BMPlatServers/authority/queryMenu`,_this.$qs.stringify({
					Id: _this.currentUserInfo.Id,
					roleId: JSON.stringify(_this.currentUserInfo.roleId.split(','))}))
					.then((res)=>{
						_this.control_modelShow = true;
						if(res.data.success) {
							_this.control_dataList = res.data.result.list;
							// .map(org => _this.mapTree(org,e.infolist.list))
							_this.get_userListLoading = false;
							setTimeout(res=> {
								_this.$refs.controlTree.setCheckedNodes(e.list);
							},50)
						}else{
							_this.get_userListLoading = false;
							this.$message.warning({
								message: res.data.resultMessage,
								showClose: true,
								duration: 1000,
							});
						}
					})
					.catch(res=> {
						_this.get_userListLoading = false;
					})
			})
		},
		// 打开删除用户的模态框
		goOpenDeleteuserModel(e) {
			this.delete_userModelShow = true;
			this.current_userInfo = e;
		},
		// 打开重置用户密码模态窗
		goResetuserModel(e) {
			this.reset_userModelShow = true;
			this.current_userInfo = e;
		},
		// 保存修改的权限
		goAddUserAuthority() {
			let _this = this;
			if(!_this.current_userInfo) {
				return;
			}
			_this.add_userLoading = true;
			let data= {
				roleId: _this.current_userInfo.Id,
				iden: 'person',
				list: _this.$refs.controlTree.getCheckedKeys(),
				list1: _this.$refs.controlTree.getHalfCheckedKeys()
			}
			var data1 = {
				map:JSON.stringify(data)
			}
			_this.$axios.post(`BMPlatServers/authority/insertRoleAuthority`, _this.$qs.stringify(data1))
				.then((res)=>{
					_this.add_userLoading = false;
					if(res.data.success){
						_this.current_userInfo = null;
						_this.control_modelShow = false;
						_this.$message.success(res.data.resultMessage);
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						});
					}
				})
				.catch(()=> {
					_this.add_userLoading = false;
					_this.get_userListLoading = false;
				})
		},
        mapTree (org,e) {
            const haveChildren = Array.isArray(org.children) && org.children.length > 0;
			e.forEach(item=> {
				if(item.id == org.id){
					org.disabled = true;
				}
			})
			org.children= haveChildren ? org.children.map(i => this.mapTree(i,e)) : [];
            return org
		},
		// 删除用户
		deleteUser(e){
			let _this = this;
			_this.add_userLoading = true;
			_this.$axios.post(`BMPlatServers/authority/deleteuser`, _this.$qs.stringify({uid: _this.current_userInfo.Id}))
				.then((res)=>{
					_this.add_userLoading = false;
					if(res.data.success){
						_this.delete_userModelShow = false
						_this.$message.success('删除成功');
						_this.getUserListEvent()
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						});
					}
				})
				.catch(()=> {
					_this.add_userLoading = false;
					_this.get_userListLoading = false;
				})
		},
		// 角色变化事件
		roleSelectChange(e) {
			this.req_addUserInfo.roleList1 = e;
		},
		// 获取用户列表事件
		getUserListEvent() {
			let _this = this;
			_this.get_userListLoading = true;
			this.$axios.post(`BMPlatServers/authority/queryuser`,_this.$qs.stringify(_this.req_getUsersList))
				.then(res=> {
					console.log(res)
					_this.get_userListLoading = false;
					if(res.data.success) {
						_this.pageTotal =  res.data.result.count;
						res.data.result.list.forEach(item=> {
							item.userState = item.is_del=='1'? '激活': '未激活';
						})
						_this.users_listArr = res.data.result.list;
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						});
					}
				})
				.catch(res=> {
					_this.get_userListLoading = false;
					console.log(res)
				})
		}
	},
	mounted() {
		let _this = this;
		_this.get_userListLoading = true;
		const mountedApi = new Promise(resolve=> {
			this.$axios.post(`BMPlatServers/authority/queryRoles`, _this.$qs.stringify({pageSize: 50, currentPage: 1,
				Id: _this.$_globalData.$_userInfo.Id}))
				.then(res=> {
					_this.getUserListEvent()
					_this.get_userListLoading = false;
					if(res.data.success) {
						// resolve();
						_this.roles_listArr = res.data.result.list;
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						});
					}
				})
				.catch(res=> {
					_this.get_userListLoading = false;
				})
		})
	}
}
</script>

<style lang="scss" scoped>
	#user{
		padding: 15px;
		.user{
			padding: 20px 0;
			.btn{
				margin-left: 40px;
			}
			span{
				padding-left: 20px;
			}
			.AddUser{
				margin-top: 5px;
				width: 94%;
				margin-left: 3%;
				zoom:1;
			}
			width: 98%;
			margin: 0 auto;
			box-shadow: 0 0 6px #ddd;
			-webkit-box-shadow: 0 0 6px #ddd;
			-ms-box-shadow: 0 0 6px #ddd;
			-moz-box-shadow: 0 0 6px #ddd;
			-o-box-shadow: 0 0 6px #ddd;
		}
		/deep/ .el-dialog__body {
			max-height: 500px;
			overflow-y: auto;
		}
		.type-table {
			margin-top: 20px;
		}
		.pagination {
			text-align: right;
			padding: 10px 0;
		}
	}
</style>
