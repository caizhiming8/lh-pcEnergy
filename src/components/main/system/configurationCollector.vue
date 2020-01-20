<template>
	<div id="configurationCollector">
		<div class="configurationCollector">
			<div class="type-search">
				<div class="seach_keyword">
					<span>采集器名称：</span>
					<el-input v-model="keyword" placeholder="请输入采集器名称" class="keyword"></el-input>
					<el-button type="primary" class="btn" size="small" icon="el-icon-search" @click="search()">搜索</el-button>
					<el-button type="primary" @click="addUser" class="btn" icon="el-icon-plus" size="small" v-hasMenu="9-3-6-1">添加采集器</el-button>
				</div>
			</div>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="name" label="采集器名称" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="ip" label="ip" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="NBflagName" label="网络类型" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="addr" label="地址" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="systemName" label="归属系统" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="sta" label="状态" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="isuse" label="是否可用" align='center'></el-table-column>
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
			<el-dialog title="增加采集器" :visible.sync="addCollector" width="40%">
				<div class="input_div">
					<div><span class="span_input">父采集器名称：</span></div>
					<el-select v-model="fCollectorIP" placeholder="请选择" class="character" filterable>
						<el-option v-for="item in fCollectorNameList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">采集器名称：</span></div>
					<el-select v-model="collectorName" placeholder="请选择" class="character" filterable>
						<el-option v-for="item in collectorNameList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">ip地址：</span></div>
					<el-input v-model="collectorIP" placeholder="请输入ip地址" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">网络类型：</span></div>
					<el-select v-model="network" placeholder="请选择归属系统" clearable class="character" filterable>
						<el-option v-for="item in networkList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">地理位置：</span></div>
					<el-input v-model="collectorAddr" placeholder="请输入地理位置" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">归属系统：</span></div>
					<el-select v-model="collectorSystem" placeholder="请选择归属系统" clearable class="character" filterable>
						<el-option v-for="item in collectorSystemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">是否可用：</span></div>
					<el-select v-model="collectorState" placeholder="请选择" clearable class="character" filterable>
						<el-option v-for="item in collectorStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">描述：</span></div>
					<el-input v-model="describe" placeholder="请描述" clearable class="input" type="textarea" :rows="5"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="addCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="addConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="修改采集器" :visible.sync="modifyCollector" width="40%">
				<div class="input_div">
					<div><span class="span_input">父采集器名称：</span></div>
					<el-select v-model="fCollectorIP" placeholder="请选择" class="character" filterable>
						<el-option v-for="item in fCollectorNameList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">采集器名称：</span></div>
					<el-select v-model="collectorNames" placeholder="请选择" class="character" filterable>
						<el-option v-for="item in collectorNameList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">ip地址：</span></div>
					<el-input v-model="collectorIPs" placeholder="请输入ip地址" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">网络类型：</span></div>
					<el-select v-model="networks" placeholder="请选择归属系统" clearable class="character" filterable>
						<el-option v-for="item in networkList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">地理位置：</span></div>
					<el-input v-model="collectorAddrs" placeholder="请输入地理位置" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">归属系统：</span></div>
					<el-select v-model="collectorSystems" placeholder="请选择归属系统" clearable class="character" filterable>
						<el-option v-for="item in collectorSystemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">是否可用：</span></div>
					<el-select v-model="collectorStates" placeholder="请选择" clearable class="character" filterable>
						<el-option v-for="item in collectorStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="input_div">
					<div><span class="span_input">描述：</span></div>
					<el-input v-model="describes" placeholder="请描述" clearable class="input" type="textarea" :rows="5"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="modifyCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="modifyConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="删除采集器" :visible.sync="delCollector" width="30%">
				<div class="del"><span class="del_span">是否要删除此采集器?</span></div>
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
			addCollector: false,
			modifyCollector: false,
			delCollector: false,
			collectorName: '',
			collectorIP: '',
			collectorAddr: '',
			collectorSystem: '',
			collectorState: '',
			describe: '',
			network: '',
			networks: '',
			collectorSystemList: [{label: '供水系统', value: 1},{label: '供电系统', value: 2},{label: '水电共用', value: '1,2'}],
			collectorStateList: [{label: '可用', value: 0},{label: '不可用', value: 1}],
			networkList: [{label: 'NB-Iot', value: 0},{label: '有线网络', value:1},{label: '无线电台', value: 2},{label: 'GPRS', value: 3},{label: '4G', value: 4}],
			// 父采集器
			fCollectorNameList: [],
			fCollectorIP: '',
			collectorNameList: [],
			collectorNames: '',
			collectorIPs: '',
			collectorAddrs: '',
			collectorSystems: '',
			collectorStates: '',
			describes: '',
			pageSize: 10,
			currentPage: 1,
			pageTotal: 1,
			id: '',
			ID: '',
			collector: '',
			arr: []
		}
	},
	methods: {
		/* 采集器下拉框 */
		initCollect(){
			this.$axios.post(`BMPlatServers/config/findcollector`).then((res)=>{
				if(res.data.success){
					this.fCollectorNameList = []
					res.data.result.forEach((item)=>{
						this.fCollectorNameList.push({label: item.name, value: item.ip});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
			this.$axios.post(`BMPlatServers/config/findcollectorinfo`).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.collectorNameList = []
					res.data.result.list.forEach((item)=>{
						this.collectorNameList.push({label: item.name, value: item.id});
					});
					this.arr = this.collectorNameList
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
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
			this.$axios.post(`BMPlatServers/config/querycollector`, this.$qs.stringify(data)).then((res)=>{
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
		/* 增加采集器 */
		addUser(){
			this.fCollectorIP = ''
			this.collectorSystem = ''
			this.collectorName = ''
			this.collectorIP = ''
			this.collectorAddr = ''
			this.collectorState = ''
			this.describe = ''
			this.network = ''
			this.collector = ''
			this.addCollector = true
			this.initCollect()
		},
		/* 增加确定 */
		addConfirm(){
			/* &&this.describe != '' &&this.collectorAddr != ''*/
			if(this.fCollectorIP != ''&& this.collectorSystem != ''&&this.collectorName != ''&&this.collectorIP != ''){
				let data={
					father: this.fCollectorIP,
					systemFlag:this.collectorSystem,
					device_id:this.collectorName,
					ip:this.collectorIP,
					addr:this.collectorAddr,
					is_use:this.collectorState,
					remark:this.describe,
					NBflag:this.network,
					name:this.collector
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/addcollector`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.addCollector = false
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
					message: '采集器数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 增加取消 */
		addCancel(){
			this.fCollectorIP = ''
			this.addCollector = false
			this.collectorSystem = ''
			this.collectorName = ''
			this.collectorIP = ''
			this.collectorAddr = ''
			this.collectorState = ''
			this.describe = ''
			this.network = ''
			this.collector = ''
		},
		/* 修改采集器 */
		clickPerform(item){
			this.modifyCollector = true
			console.log(item)
			this.fCollectorIP = item.ip;
			this.collectorSystems = item.systemFlag
			this.collectorNames = item.name
			this.collectorIPs = item.ip
			this.collectorAddrs = item.addr
			this.collectorStates = item.is_use
			this.id = item.id
			this.describes = item.remark
			this.networks = item.NBflag
		},
		/* 修改确定 */
		modifyConfirm(){
			/* &&this.describes != '' &&this.collectorAddrs != ''*/
			if(this.fCollectorIP != ''&&this.collectorSystems != ''&&this.collectorNames != ''&&this.collectorIPs != ''){
				let data={
					father: this.fCollectorIP,
					id:this.id,
					systemFlag:this.collectorSystems,
					name:this.collectorNames,
					ip:this.collectorIPs,
					addr:this.collectorAddrs,
					is_use:this.collectorStates,
					remark:this.describes,
					NBflag:this.networks
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/updatecollector`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.modifyCollector = false
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
					message: '修改采集器数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
			this.fCollectorIP = ''
			this.collectorSystems = ''
			this.collectorNames = ''
			this.collectorIPs = ''
			this.collectorAddrs = ''
			this.collectorStates = ''
			this.id = ''
			this.describes = ''
			this.networks = ''
		},
		/* 修改取消 */
		modifyCancel(){
			this.modifyCollector = false
		},
		/* 删除采集器 */
		deleteUser(item){
			this.ID = item.id
			this.delCollector = true
		},
		/* 删除确定 */
		delConfirm(){
			let data={
				id:this.ID
			}
			this.$axios.post(`BMPlatServers/config/deletecollector`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					})
					this.delCollector = false
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
			this.delCollector = false
		},
		search(){
			this.initData()
		},
		/* 分页 */
		handleCurrentChange(){
			this.initData()
		}
	},
	mounted(){
		this.initData()
	},
	watch: {
		collectorName(value){	
			if(value != ''&&value != null){
				let obj = {};
				obj = this.arr.find((item) => {
					return item.value === value;
				});
				/* console.log(obj) */
				this.collector = obj.label
				/* console.log(this.collector) */
			}
		}
	}
}
</script>

<style lang="scss" scoped>
#configurationCollector{
	padding: 15px;
	.configurationCollector{
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
