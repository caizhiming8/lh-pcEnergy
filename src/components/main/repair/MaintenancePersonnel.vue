<template>
	<div id="MaintenancePersonnel">
		<div class="MaintenancePersonnel">
			<div class="placeSearch">
				<span>姓名</span>
				<el-input v-model="name" clearable></el-input>
				<el-button type="primary" icon="el-icon-search" size="small" @click="search" class="buttons">搜索</el-button>
				<el-button type="primary" icon="el-icon-zoom-in" @click="add" size="small" v-hasMenu="7-4-1" class="btn">新增</el-button>
			</div>
			<div class="placeTable" style="margin-top: 20px;">
				<el-table :data="tabledata" v-loading="loading" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column label="序号" width="80" align='center'>
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
					<el-table-column  prop="personName"  label="姓名" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column  prop="sex"  label="性别" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column  prop="age"  label="年龄" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column  prop="phone"  label="电话" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column  prop="company"  label="单位" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column  prop="job"  label="职位" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column  prop="areaName"  label="负责区域" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column  prop="startTime"  label="开始时间" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column  prop="endTime"  label="结束时间" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column  prop="money"  label="价格" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column label="评分" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<span v-if="scope.row.star">{{scope.row.star}}</span>
							<span v-if="!scope.row.star">0</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200" align='center'>
                        <template slot-scope="scope">
							<el-button type="success" @click="changeHandle(scope.row, scope.$index)" size="mini">修改</el-button>
                            <el-button type="danger" @click="deleteHandle(scope.row, scope.$index)" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
				</el-table>
			</div>
			<div class="bottom-pagnation">
			    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
			</div>

			<el-dialog :title="msg" :visible.sync="dialogVisible" width="40%">
			    <div class="dialogBody">
					<el-form ref="form" :model="form" label-width="80px">
						<el-form-item label="姓名" :class="mark==1?'xingming':''">
							<el-select v-model="userNmae" class="middle" clearable :disabled="isDisabled">
								<el-option v-for="(item, index) in nameList" :key="index" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					    <el-form-item label="性别" :class="mark==1?'xingbie':''">
							<el-radio v-model="form.sex" label="1">男</el-radio>
  							<el-radio v-model="form.sex" label="2">女</el-radio>
					    </el-form-item>
						<el-form-item label="年龄" :class="mark==1?'nianling':''">
						    <el-input v-model="age" class="short" clearable></el-input>
					    </el-form-item>
					    <el-form-item label="电话" :class="mark==1?'dianhua':''">
						    <el-input v-model="phone" disabled class="long" clearable></el-input>
					    </el-form-item>
						<el-form-item label="公司名称" :class="mark==1?'gongsi':''">
							<el-select v-model="compony" placeholder="请选择" clearable>
							    <el-option v-for="item in componyList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
							</el-select>
					    </el-form-item>
						<el-form-item label="工作" :class="mark==1?'gongzuo':''">
							<el-select v-model="jobs" placeholder="请选择" clearable @focus="focusJobs">
							    <el-option v-for="item in jobslist" :key="item.jobId" :label="item.jobName" :value="item.jobId"></el-option>
							</el-select>
					    </el-form-item>
						<el-form-item label="地区" :class="mark==1?'diqu':''">
							<el-select v-model="form.area" placeholder="请选择" clearable>
							    <el-option v-for="item in arealist" :key="item.id" :label="item.label" :value="item.id"></el-option>
							</el-select>
					    </el-form-item>
						<el-form-item label="时间" :class="mark==1?'shijian':''">
							<el-time-picker is-range v-model="time" value-format="HH:mm:ss" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
					    </el-form-item>
						<el-form-item label="金额" :class="mark==1?'jiner':''">
						    <el-input v-model="moneys" class="short" clearable></el-input>
					    </el-form-item>
					</el-form>
			    </div>
			    <span slot="footer" class="dialog-footer">
			    	<el-button @click="dialogVisible = false" size="mini">取 消</el-button>
					<el-button type="primary" @click="makeSureAdd" size="mini" v-if="mark==1">确 定</el-button>
			    	<el-button type="primary" @click="makeSureChange" size="mini" v-if="mark==2">确 定</el-button>
			    </span>
			</el-dialog>

			<!-- 删除 -->
			<div class="delete">
				<el-dialog title="提示" :visible.sync="dialogVisibledelete"  width="30%">
				    <span>确定要删除吗？</span>
				    <span slot="footer" class="dialog-footer">
				    	<el-button @click="dialogVisibledelete = false" size="mini">取 消</el-button>
				    	<el-button type="primary" @click="deleteSure" size="mini">确 定</el-button>
				    </span>
				</el-dialog>
			</div>
		</div>
    </div>
</template>

<script>
export default {
	data(){
		return{
			tabledata:[],
			name:'',
			currentPage:1,
			pageSize:10,
			val: 1,
			pageTotal: 0,
			loading: true,
			dialogVisible: false,
			form: {name: '', sex: '1', area: ''},
			jobs: '',
			age: '',
			phone: '',
			time: null,
			startTime: '',
			endTime: '',
			moneys: '',
			compony: '',
			componyList: [],
			jobslist: [],
			arealist: [],
			dialogVisibledelete: false,
			id: '',
			mark: 0,
			msg: '',
			ids: '',
			isMark: 0,
			nameList: [],
			userNmae: '',
			phones: '',
			Id: '',
			NAme: '',
			isDisabled: true
		}
	},
	methods:{
		add() {
			this.isMark = 1;
			this.mark = 1;
			this.userNmae = '';
			this.form.sex = '1';
			this.age = '';
			this.phone = '';
			this.compony = '';
			this.jobs = '';
			this.form.area = '';
			this.time = '';
			this.moneys = '';
			this.msg = '新增';
			this.dialogVisible = true;
			this.componeylist();
			this.areaList();
			this.namelist();
			this.isDisabled = false;
		},
		// 增加模态框提交按钮
		makeSureAdd() {
			if(this.userNmae=='') {
				this.$notify({
                    title: '警告',
                    message: '请填写姓名',
                    type: 'warning',
                    duration: 2000
                });
                return false;
			}
			if(this.age=='') {
				this.$notify({
                    title: '警告',
                    message: '请填写年龄',
                    type: 'warning',
                    duration: 2000
                });
                return false;
			}
			if(this.compony=='') {
				this.$notify({
                    title: '警告',
                    message: '请选择公司名称',
                    type: 'warning',
                    duration: 2000
                });
                return false;
			}
			if(this.jobs=='') {
				this.$notify({
                    title: '警告',
                    message: '请选择工作',
                    type: 'warning',
                    duration: 2000
                });
                return false;
			}
			if(this.form.area=='') {
				this.$notify({
                    title: '警告',
                    message: '请选择地区',
                    type: 'warning',
                    duration: 2000
                });
                return false;
			}
			if(this.time==null || this.time=='') {
				this.$notify({
                    title: '警告',
                    message: '请选择时间',
                    type: 'warning',
                    duration: 2000
                });
                return false;
			}
			if(this.moneys=='') {
				this.$notify({
                    title: '警告',
                    message: '请填写金额',
                    type: 'warning',
                    duration: 2000
                });
                return false;
			}
			let data = {
				Id: this.Id,
				personName: this.NAme,
				sex: this.form.sex,
				age: this.age,
				phone: this.phones,
				company: this.compony,
				job: this.jobs,
				area: this.form.area,
				startTime: this.startTime,
				endTime: this.endTime,
				money: this.moneys
			};
			this.$axios.post(`BMPlatServers/repair/addRepairPerson`, this.$qs.stringify(data)).then((response) => {
				// console.log(response);
				if(response.data.success){
					this.$message.success({
						message: '增加成功',
						showClose: true,
						duration: 1000
					})
					this.dialogVisible = false;
					this.NAme = '';
					this.Id = '';
					this.userNmae = '';
					this.form.sex = '1';
					this.jobs = '';
					this.form.area = '';
					this.age = '';
					this.phones = '';
					this.moneys = '';
					this.compony = '';
					this.time = '';
					this.val = 1;
					this.currentPage = 1;
					this.initData(1);
				}else{
					this.$message.warning({
						message: response.data.resultMessage,
						showClose: true,
						duration: 1000
					})
				}
			});
		},

		// 姓名下拉框
		namelist() {
			this.$axios.post(`BMPlatServers/repair/queryRoleList`).then((res) => {
				// console.log(res);
				if(res.data.success) {
					this.nameList = [];
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
							this.nameList.push({label: item.username, value: `${item.Id},${item.username},${item.phone}`})
						})
					}
				}else{
					this.nameList = [];
					this.$message.warning({
						message: res.data.resultMessage,
						showClose: true,
						duration: 1000
					})
				}
			});
		},

		deleteHandle(row) {
			this.dialogVisibledelete = true;
			this.id = row.id;
		},
		// 删除按钮
		deleteSure() {
			let data = {
				id: this.id,
			}
			this.$axios.post(`BMPlatServers/repair/deleteRepairPerson`, this.$qs.stringify(data)).then((response) => {
				// console.log(response);
				if(response.data.success) {
					this.$message.success({
						message: '删除成功',
						showClose: true,
						duration: 1000
					})
					this.dialogVisibledelete = false;
					this.initData(1);
					this.val = 1;
					this.currentPage = 1;
				}else{
					this.$message.warning({
						message: response.data.resultMessage,
						showClose: true,
						duration: 1000
					})
				}
			});
		},
		// 修改按钮
		changeHandle(row) {
			this.isDisabled = true;
			this.componeylist();
			this.areaList();
			this.isMark = 1;
			this.mark = 2;
			this.msg = '修改';
			this.dialogVisible = true;
			// 请求公司的列表，修改传id，显示label
			this.compony = row.companyId;
		 	this.form.area = row.areaId;
			this.jobs = row.jobId;
			this.componyList = [{companyName: row.company, companyId: row.companyId}];
			this.arealist = [{label: row.areaName, id: row.areaId}];
			this.jobslist = [{jobName: row.job, jobId: row.jobId}];
			// 赋值给模态框
			let arr = [];
			arr.push(row.startTime)
			arr.push(row.endTime);
			this.userNmae = row.personName;
			this.form.sex = row.sex == "男" ? '1' : '2';
			this.age = '' + row.age;
			this.time = arr;
			this.moneys = ''+row.money;
			this.ids = row.id;
			setTimeout(()=>{
				this.phone = row.phone;
			}, 800);
		},
		makeSureChange() {
			let data = {
				id: this.ids,
				personName: this.NAme,
				sex: this.form.sex,
				age: this.age,
				phone: this.phones,
				company: this.compony,
				job: this.jobs,
				area: this.form.area,
				startTime: this.startTime,
				endTime: this.endTime,
				money: this.moneys
			}
			this.$axios.post(`BMPlatServers/repair/updateRepairPerson`, this.$qs.stringify(data)).then((response) => {
				// console.log(response);
				if(response.data.success) {
					this.$message.success({
						message: '修改成功',
						showClose: true,
						duration: 1000
					})
					this.dialogVisible = false;
					this.initData(1);
				}else{
					this.$message.warning({
						message: response.data.resultMessage,
						showClose: true,
						duration: 1000
					})
				}
			});
		},

		initData(currentPage) {
			let param={
				name: this.name,
				currentPage,
				pageSize:this.pageSize
			};
			this.$axios.post(`BMPlatServers/repair/queryRepairPerson`,this.$qs.stringify(param)).then((response) => {
			    // console.log(response);
				if(response.data.success){
		            this.tabledata = response.data.result.list;
					this.pageTotal = response.data.result.num;
					this.loading=false;
				}else{
					this.loading=false;
					this.tabledata = [];
					this.pageTotal = 0;
					this.$message.warning({
						message: response.data.resultMessage,
						showClose: true,
						duration: 1000
					})
				}
			});
		},

		// 公司列表
		componeylist() {
			this.$axios.post(`BMPlatServers/repair/queryRepairCompany`).then((response) => {
			    // console.log(response);
				if(response.data.success){
		            this.componyList = response.data.result.list;
				}else{
					this.componyList = [];
					this.$message.warning({
						message: response.data.resultMessage,
						showClose: true,
						duration: 1000
					})
				}
			});
		},

		// 工作列表
		joblist(num) {
			let data = {
				companyId: num
			}
			this.$axios.post(`BMPlatServers/repair/queryRepairJob`, this.$qs.stringify(data)).then((response) => {
			    // console.log(response);
				if(response.data.success){
		            this.jobslist = response.data.result.list;
				}else{
					this.jobslist = [];
					this.$message.warning({
						message: response.data.resultMessage,
						showClose: true,
						duration: 1000
					})
				}
			});
		},

		// 地区列表
		areaList() {
			this.$axios.post(`BMPlatServers/repair/queryBuildings`).then((response) => {
			    // console.log(response);
				if(response.data.success){
		            this.arealist = response.data.result.list;
				}else{
					this.arealist = [];
					this.$message.warning({
						message: response.data.resultMessage,
						showClose: true,
						duration: 1000
					})
				}
			});
		},

		focusJobs() {
			if(!this.compony) {
				this.$notify({
		            title: '警告',
		            message: '请先选择公司名称',
		            type: 'warning',
					duration: 2000
		        });
			}
		},

		search() {
			this.loading = true;
			this.currentPage = 1;
			this.val = 1;
			this.initData(1);
		},
		handleCurrentChange(val) {
			this.loading = true;
			this.val = val;
			this.initData(val)
		}
	},
	mounted() {
		this.initData(1);
	},
	watch:{
		age(oldData) {
			this.age = (''+this.age).replace(/[^\d.]/g,'')
		},
		phone(oldData) {
			this.phone = (''+this.phone).replace(/[^\d.]/g,'')
		},
		moneys(oldData) {
			this.moneys = (''+this.moneys).replace(/[^\d.]/g,'')
		},
		compony(oldData) {
			if(oldData != '' && this.isMark == 1) {
				this.joblist(oldData);
			}
		},
		time(oldData) {
			if(oldData == null) {
				this.startTime = '';
				this.endTime = '';
			}else{
				this.startTime = oldData[0];
				this.endTime = oldData[1];
			}
		},
		userNmae(newData) {
			if(newData) {
				this.Id = newData.split(',')[0];
				this.NAme = newData.split(',')[1];
				this.phones = newData.split(',')[2];
				this.phone = this.phones;
			}else{
				this.Id = '';
				this.NAme = '';
				this.phones = '';
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	#MaintenancePersonnel{
		padding: 15px;
		.MaintenancePersonnel{
			box-shadow: 0 0 6px #ddd;
			-webkit-box-shadow: 0 0 6px #ddd;
			-moz-box-shadow: 0 0 6px #ddd;
			-o-box-shadow: 0 0 6px #ddd;
			padding: 20px;
			.placeSearch{
				.buttons{
					margin-left: 40px;
				}
				.btn{
					margin-left: 100px;
				}
				.el-input{
					width:200px;
					margin-left:10px;
				}
			}
			.placeTable{
				margin-top: 30px;
			}
			.bottom-pagnation{
				text-align: right;
				padding: 20px 15px 10px 0;
			}
			/deep/ .el-dialog__header{
				border-bottom: 1px solid #ddd;
			}
			/deep/ .el-dialog__footer{
				border-top: 1px solid #ddd;
			}
			.delete{
				/deep/ .el-dialog__header{
					border-bottom: none;
				}
				/deep/ .el-dialog__footer{
					border-top: 0;
				}
			}
			.dialogBody{
				position: relative;
				/deep/ .el-input.is-disabled .el-input__inner{
					background: #fff;
					color: #606262;
				}
				.short{
					width: 100px;
				}
				.long{
					width: 200px;
				}
				.middle{
					width: 130px;
				}
				.xingming:before{
					content: "*";
					color: red;
					position: absolute;
					left: 28px;
					top: 12px;
				}
				.xingbie:before{
					content: "*";
					color: red;
					position: absolute;
					left: 28px;
					top: 74px;
				}
				.nianling:before{
					content: "*";
					color: red;
					position: absolute;
					left: 28px;
					top: 135px;
				}
				.dianhua:before{
					content: "*";
					color: red;
					position: absolute;
					left: 28px;
					top: 199px;
				}
				.gongsi:before{
					content: "*";
					color: red;
					position: absolute;
					left: 1px;
					top: 260px;
				}
				.gongzuo:before{
					content: "*";
					color: red;
					position: absolute;
					left: 28px;
					top: 321px;
				}
				.diqu:before{
					content: "*";
					color: red;
					position: absolute;
					left: 28px;
					top: 383px;
				}
				.shijian:before{
					content: "*";
					color: red;
					position: absolute;
					left: 28px;
					top: 446px;
				}
				.jiner:before{
					content: "*";
					color: red;
					position: absolute;
					left: 28px;
					top: 508px;
				}
			}
		}
	}
</style>
