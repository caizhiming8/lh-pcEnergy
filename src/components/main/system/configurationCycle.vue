<template>
	<div id="configurationCycle">
		<div class="configurationCycle">
			<div class="type-search">
				<div class="seach_keyword">
					<span>周期名称：</span>
					<el-input v-model="keyword" class="keyword"></el-input>
					<el-button type="primary" size="small" class="btn" @click="search()" icon="el-icon-search">搜索</el-button>
					<el-button type="primary" @click="addUser" class="btn" size="small" icon="el-icon-plus" v-hasMenu="9-3-4-1">添加定额周期</el-button>
				</div>
			</div>
			<div class="type-table">
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="name" label="周期名称" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="start" label="开始时间" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="end" label="结束时间" align='center'></el-table-column>
					<el-table-column label="操作" width="250" align='center'>
					    <template slot-scope="scope">
							<el-button @click="clickPerform(scope.row)" size="mini" type="success" v-hasMenu="9-3-4-2">修改</el-button>
							<el-button @click="deleteUser(scope.row)" size="mini" type="danger" v-hasMenu="9-3-4-3">删除</el-button>
					    </template>
					</el-table-column>
				</el-table>
			</div>
			<el-dialog title="增加周期" :visible.sync="addCycle" width="40%">
				<div class="input_div">
					<div><span class="span_input">周期名称：</span></div>
					<el-input v-model="unitName" placeholder="请输入周期名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">开始时间：</span></div>
					<el-date-picker v-model="startTime" value-format="MM-dd" type="date" placeholder="选择日期" class="character"></el-date-picker>
				</div>
				<div class="input_div">
					<div><span class="span_input">结束时间：</span></div>
					<el-date-picker v-model="endTime" value-format="MM-dd" type="date" placeholder="选择日期" class="character"></el-date-picker>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="addCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="addConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="修改周期" :visible.sync="modifyUnit" width="40%">
				<div class="input_div">
					<div><span class="span_input">周期名称：</span></div>
					<el-input v-model="unitNames" placeholder="请输入周期名称" clearable class="input"></el-input>
				</div>
				<div class="input_div">
					<div><span class="span_input">开始时间：</span></div>
					<el-date-picker v-model="startTimes" value-format="MM-dd" type="date" placeholder="选择日期" class="character"></el-date-picker>
				</div>
				<div class="input_div">
					<div><span class="span_input">结束时间：</span></div>
					<el-date-picker v-model="endTimes" value-format="MM-dd" type="date" placeholder="选择日期" class="character"></el-date-picker>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="modifyCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="modifyConfirm()" size="small">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="删除周期" :visible.sync="delUnit" width="30%">
				<div class="del"><span class="del_span">是否要删除此周期?</span></div>
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
			people: '',
			peopleList: [],
			contact: '',
			addCycle: false,
			modifyUnit: false,
			delUnit: false,
			unitName: '',
			startTime: '',
			endTime: '',
			unitNames: '',
			startTimes: '',
			endTimes: '',
			time: '',
			start: '',
			end: '',
			starts: '',
			ends: '',
			ID: '',
			id: ''
		}
	},
	methods:{
		initData(){
			let data={
				name:this.keyword
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/queryperiod`, this.$qs.stringify(data)).then((res)=>{
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
		/* 添加周期 */
		addUser(){
			this.unitName = ''
			this.startTime = ''
			this.endTime = ''
			this.addCycle = true
		},
		/* 添加确定 */
		addConfirm(){
			if(this.unitName != ''&&this.startTime != ''&&this.endTime){
				let data={
					name: this.unitName,
					start: this.startTime,
					end: this.endTime
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/addperiod`, this.$qs.stringify(data)).then((res)=>{
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.addCycle = false
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
					message: '周期数据存在空值',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 添加取消 */
		addCancel(){
			this.unitName = ''
			this.startTime = ''
			this.endTime = ''
			this.addCycle = false
		},
		/* 修改 */
		clickPerform(item){
			console.log(item)
			this.id = item.Id
			this.modifyUnit = true
			this.unitNames = item.name
			this.startTimes = item.start
			this.endTimes = item.end
		},
		/* 修改确定 */
		modifyConfirm(){
			if(this.unitNames != ''&&this.startTimes != ''&&this.endTimes){
				let data={
					id: this.id,
					name: this.unitNames,
					start: this.startTimes,
					end: this.endTimes
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/updateperiod`, this.$qs.stringify(data)).then((res)=>{
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
					message: '修改周期数据不能为空',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 修改取消 */
		modifyCancel(){
			this.modifyUnit = false
		},
		/* 删除周期 */
		deleteUser(item){
			console.log(item)
			this.delUnit = true
			this.ID = item.Id
		},
		/* 删除确定 */
		delConfirm(){
			let data ={
				id:this.ID
			}
			this.$axios.post(`BMPlatServers/config/deleteperiod`, this.$qs.stringify(data)).then((res)=>{
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
		/* 删除取消 */
		delCancel(){
			this.delUnit = false
		},
		search(){
			this.initData()
		}
	},
	mounted() {
		this.initData()
	},
	watch:{
		startTime(item){
			if(this.startTime != ''&&this.startTime != null){
				let data ={
					start: this.startTime
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/checkperiod`, this.$qs.stringify(data)).then((res)=>{
					console.log(res)
					if(res.data.success){
						this.start = item.replace("-","")
						if(this.start.startsWith("0")){
							this.start = this.start.substring(1,item.length)
						}
						console.log(this.start)
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						})
						this.startTime = ''
					}
				})
			}
		},
		endTime(items){
			if(this.startTime != ''&&this.startTime != null){
				if(this.endTime != ''&&this.endTime != null){
					/* this.end = items.replace("-","")
					if(this.end.startsWith("0")){
						this.end = this.end.substring(1,items.length)
						console.log(this.end)
					} */
					let data ={
						start: this.endTime
					}
					console.log(data)
					this.$axios.post(`BMPlatServers/config/checkperiod`, this.$qs.stringify(data)).then((res)=>{
						console.log(res)
						if(res.data.success){
							this.end = items.replace("-","")
							if(this.end.startsWith("0")){
								this.end = this.end.substring(1,items.length)
							}
							if(Number(this.start) - Number(this.end) > 0){
								this.$message.warning({
									message: '结束时间不得小于开始时间',
									showClose: true,
									duration: 1000,
								})
								this.endTime = ''
							}
							console.log(this.end)
						}else{
							this.$message.warning({
								message: res.data.resultMessage,
								showClose: true,
								duration: 1000,
							})
							this.endTime = ''
						}
					})
				}
			}else{
				this.$message.warning({
					message: '请选择开始时间',
					showClose: true,
					duration: 1000,
				})
				this.endTime = ''
			}
		},
		startTimes(item){
			if(this.startTimes != ''&&this.startTimes != null){
				this.starts = item.replace("-","")
				if(this.starts.startsWith("0")){
					this.starts = this.starts.substring(1,item.length)
				}
				console.log(this.starts)
				let data ={
					start: this.startTimes
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/config/checkperiod`, this.$qs.stringify(data)).then((res)=>{
					console.log(res)
					if(res.data.success){
						this.starts = item.replace("-","")
						if(this.starts.startsWith("0")){
							this.starts = this.starts.substring(1,item.length)
						}
						console.log(this.starts)
					}else{
						this.$message.warning({
						message: res.data.resultMessage,
		                showClose: true,
		                duration: 1000,
					})
						this.startTimes = ''
					}
				})
			}
		},
		endTimes(items){
			if(this.startTimes != ''&&this.startTimes != null){
				if(this.endTimes != ''&&this.endTimes != null){
					let data ={
						start: this.endTimes
					}
					console.log(data)
					this.$axios.post(`BMPlatServers/config/checkperiod`, this.$qs.stringify(data)).then((res)=>{
						console.log(res)
						if(res.data.success){
							this.ends = items.replace("-","")
							if(this.ends.startsWith("0")){
								this.ends = this.ends.substring(1,items.length)
							}
							console.log(this.ends)
							if(Number(this.starts) - Number(this.ends) > 0){
								this.$message.warning({
									message: '结束时间不得小于开始时间',
									showClose: true,
									duration: 1000,
								})
								this.endTimes = ''
							}
						}else{
							this.$message.warning({
								message: res.data.resultMessage,
								showClose: true,
								duration: 1000,
							})
							this.endTimes = ''
						}
					})
					/* this.ends = items.replace("-","")
					if(this.ends.startsWith("0")){
						this.ends = this.ends.substring(1,items.length)
					} */
				}
			}else{
				this.$message.warning({
					message: '请选择开始时间',
					showClose: true,
					duration: 1000,
				})
				this.endTimes = ''
			}
		}
	}
}
</script>

<style lang="scss" scoped>
#configurationCycle{
	padding: 15px;
	.configurationCycle{
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
