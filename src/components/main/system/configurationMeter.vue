<template>
<div id="configurationMeter">
	<div class="configurationMeter">
		<div class="type-search">
			<div class="seach_keyword">
				<span>楼宇名称：</span>
				<el-input v-model="keyword" class="keyword"></el-input>
				<el-button type="primary" size="small" class="btn" icon="el-icon-search" @click="search()">搜索</el-button>
			</div>
		</div>
		<div class="type-table">
			<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
				<!-- <el-table-column :show-overflow-tooltip="true" prop="departName" label="二级单位" align='center'></el-table-column> -->
				<el-table-column :show-overflow-tooltip="true" prop="buildName" label="楼宇" align='center'></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="floor_id" label="楼层" align='center'></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="room_name" label="房间" align='center'></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="room_name" label="详情" align='center'>
					<template slot-scope="scope">
						<el-button type="text" @click="modify(scope.row)" size="mini">查看</el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="250" align='center'>
				    <template slot-scope="scope">
						<el-button @click="modifyMeter(scope.row)" size="mini" type="success">配置</el-button>
				    </template>
				</el-table-column>
			</el-table>
			<div class="pagination">
			    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
			</div>
		</div>
		<el-dialog title="公共房间配置" :visible.sync="modifyEnergy" width="40%">
			<div class="input_div">
				<div><span class="span_input">单位名称：</span></div>
				<el-input v-model="units" placeholder="请输入单位名称" clearable class="input" disabled></el-input>
			</div>
			<div class="input_div">
				<div><span class="span_input">楼宇名称：</span></div>
				<el-input v-model="building" placeholder="请输入楼宇名称" clearable class="input" disabled></el-input>
			</div>
			<div class="input_div">
				<div><span class="span_input">楼层名称：</span></div>
				<el-input v-model="floor" placeholder="请输入楼层名称" clearable class="input" disabled></el-input>
			</div>
			<div class="input_div">
				<div><span class="span_input">公共房间：</span></div>
				<el-input v-model="room" placeholder="请输入公共房间" clearable class="input" disabled></el-input>
			</div>
			<div class="input_div">
				<el-button type="primary" @click="modifyAdd()" size="small">添加二级单位比例</el-button>
			</div>
			<div class="input_div" v-for="(item,index) in inputData" :key ="index">
				<div><span class="span_input">比例：</span></div>
				<el-input v-model="item.rate" placeholder="请输入能耗比例" class="inputs" oninput ="value=value.replace(/[^\d^\.]+/g,'')">
					<el-select v-model="item.depart_id" placeholder="选择单位" class="inputs" slot="prepend">
						<el-option-group v-for="group in UnitList" :key="group.groupname" :label="group.groupname">
							<el-option v-for="item in group.chilList" :key="item.Id" :label="item.name":value="item.Id"></el-option>
						</el-option-group>
					</el-select>
				</el-input>
				<span class="close" @click="delInput(index,item.id)">删除</span>
			</div>
			<span slot="footer" class="dialog-footer">
			    <el-button type="success" plain @click="modifyCancel()" size="small">取 消</el-button>
			    <el-button type="primary" @click="modifyConfirm()" size="small">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="详情" :visible.sync="modifys" width="40%">
			<div class="input_div" v-for="(item,index) in numberData" :key ="index">
				<div><span class="span_input">单位比例：</span></div>
				<el-input v-model="item.rate" placeholder="请输入能耗比例" class="inputs" disabled>
					<el-select v-model="item.depart_id" placeholder="选择单位" class="inputs" slot="prepend" disabled>
						<el-option-group v-for="group in UnitList" :key="group.groupname" :label="group.groupname">
							<el-option v-for="item in group.chilList" :key="item.Id" :label="item.name":value="item.Id"></el-option>
						</el-option-group>
					</el-select>
				</el-input>
			</div>
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
			modifyEnergy: false,
			modifys: false,
			units: '',
			building: '',
			floor: '',
			room: '',
			units_id: '',
			building_id: '',
			room_id: '',
			total: '',
			proportion: '',
			pageSize: 10,
			currentPage: 1,
			pageTotal: 1,
			inputData: [],
			Unit: '',
			UnitList: [],
			numberData: []
		}
	},
	methods:{
		initUnit(){
			this.$axios.post(`BMPlatServers/common/departlist`).then((res)=>{
				console.log(res)
				this.UnitList = []
				this.UnitList = res.data.result.infos
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
			this.$axios.post(`BMPlatServers/config/queryroomConsum`, this.$qs.stringify(data)).then((res)=>{
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
		/* 详情 */
		modify(item){
			console.log(item)
			let data={
				building_id:item.building_id,
				floor_id:item.floor_id,
				room_id:item.room_id,
				cru_depart_id:item.depart_id,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/queryroomggconsum`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.initUnit()
					this.modifys = true
					console.log(res)
					this.numberData = []
					this.numberData = res.data.result.list
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 配置单位 */
		modifyMeter(item){
			this.initUnit()
			this.modifyEnergy = true
			console.log(item)
			this.units = item.departName
			this.building = item.buildName
			this.floor = item.floor_id
			this.room = item.room_name
			this.building_id = item.building_id
			this.units_id = item.depart_id
			this.room_id = item.room_id
			let data={
				building_id:item.building_id,
				floor_id:item.floor_id,
				room_id:item.room_id,
				cru_depart_id:item.depart_id,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/queryroomggconsum`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					console.log(res)
					this.inputData = []
					this.inputData = res.data.result.list
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 添加单位比例 */
		modifyAdd(){
			var input = {}
			input.id = this.inputData.length
			input.rate = ""
			input.depart_id = ""
			this.inputData.push(input)
		},
		/* 删除单位比例 */
		delInput (index,id) {
			console.log(id)
			console.log(index)
			let data={
				id:id
			}
			this.$axios.post(`BMPlatServers/config/deleteroomggconsum`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.inputData.splice(index, 1);
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 确定配置 */
		modifyConfirm(){
			console.log(this.inputData)
			var list = JSON.stringify(this.inputData)
			let data={
				building_id:this.building_id,
				floor_id:this.floor,
				room_id:this.room_id,
				cru_depart_id:this.units_id,
				list:list
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/config/updateroomConsum`, this.$qs.stringify(data)).then((res)=>{
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					})
					this.modifyEnergy = false
					/* this.initData() */
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		/* 取消配置 */
		modifyCancel(){
			this.modifyEnergy = false
			this.inputData = []
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
	},
	watch:{

	}
}
</script>

<style lang="scss" scoped>
	#configurationMeter{
		padding: 15px;
		.configurationMeter{
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
				margin-top: 10px;
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
				.inputs{
					width: 90%;
				}
				div.el-select.inputs{
					width: 150px;
				}
				/* .close{
					display: inline-block;
					width: 30px;
					height: 4px;
					background: #333;
					transform: rotate(45deg);
				}
				.close::after{
					content: '';
					display: block;
					width: 30px;
					height: 4px;
					background: #333;
					transform: rotate(-90deg);
				} */
			}
			box-shadow: 0 0 6px #ddd;
			-webkit-box-shadow: 0 0 6px #ddd;
			-ms-box-shadow: 0 0 6px #ddd;
			-moz-box-shadow: 0 0 6px #ddd;
			-o-box-shadow: 0 0 6px #ddd;
		}
	}
</style>
