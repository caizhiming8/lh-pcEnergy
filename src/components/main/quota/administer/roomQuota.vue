<template>
	<div id="roomQuota">
		<div class="roomQuota">
			<div class="ratingTree">
				<v-ratingTrees @sonData="sonDatas"></v-ratingTrees>
			</div>
			<div class="topSelfTube">
				<div class="search">
					<span class="cycle-seach">查询年份</span>
					<el-select v-model="year" placeholder="请选择" clearable style="width: 150px;margin-left: 10px;">
						<el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="cycle-seach">查询周期</span>
					<el-select v-model="cycle" placeholder="请选择" clearable style="width: 150px;margin-left: 10px;">
						<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
				</div>
				<div class="top">
					<div class="top-total">
						<span class="dinges">房间定额配置:      {{selfTube}}</span>
					</div>
					<div class="top-points">
						<span class="dinge">特殊用电：</span>
						<span>{{special}}</span>
						<span class="dinge">照明用电：</span>
						<span>{{apparatus}}</span>
						<span class="dinge">动力用电：</span>
						<span>{{power}}</span>
						<span class="dinge">空调用电：</span>
						<span>{{conditioner}}</span>
						<el-button type="primary" @click="allocation" size="small" class="allot" v-if="this.control == 1">分 配</el-button>
					</div>
				</div>
				<!-- <div class="top-judging">
					<el-button @click="confirm" type="primary">确认</el-button>
					<el-button @click="cancel">取消</el-button>
				</div> -->
			</div>
			<div class="center">
				<span class="table-center">单位自管房间已分配定额</span>
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="time" label="时间" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="sum" label="房间总能额" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="1" label="房间特殊用电" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="4" label="房间照明用电" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="3" label="房间动力用电" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="2" label="房间空调用电" align="center"></el-table-column>
				</el-table>
			</div>
			<el-dialog title=自管房间分配定额 :visible.sync="maleData" width="60%">
				<div class="el-form">
					<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<div class="selectQuery">
							<span class="query">查询周期</span>
							<el-select v-model="cycles" placeholder="请选择" clearable class="select">
								<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<span class="query">查询年份</span>
							<el-select v-model="years" placeholder="请选择" clearable class="select">
								<el-option v-for="item in yearLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div>
						<div class="zongshiyan">
							<div class="shiyan">
								<span class="mingcheng">今年定额</span>
								<div><span class="span_name">特殊用电: </span></div>
								<el-input v-model="special3" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name"></el-input>
								<div><span class="span_name">空调用电: </span></div>
								<el-input v-model="conditioner3" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name"></el-input>
								<div><span class="span_name">动力用电: </span></div>
								<el-input v-model="power3" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name"></el-input>
								<div><span class="span_name">照明用电: </span></div>
								<el-input v-model="apparatus3" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name"></el-input>
							</div>
							<div class="shiyan">
								<span class="mingcheng">去年能耗</span>
								<div><span class="span_name">特殊用电: </span></div>
								<el-input v-model="special3_past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">空调用电: </span></div>
								<el-input v-model="conditioner3_past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">动力用电: </span></div>
								<el-input v-model="power3_past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">照明用电: </span></div>
								<el-input v-model="apparatus3_past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
							</div>
							<div class="shiyan">
								<span class="mingcheng">去年定额</span>
								<div><span class="span_name">特殊用电: </span></div>
								<el-input v-model="special3Past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">空调用电: </span></div>
								<el-input v-model="conditioner3Past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">动力用电: </span></div>
								<el-input v-model="power3Past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">照明用电: </span></div>
								<el-input v-model="apparatus3Past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
							</div>
						</div>
						<div class="top-judging">
							<el-button @click="confirm" type="primary" size="small">确认</el-button>
							<el-button @click="cancel" size="small">取消</el-button>
						</div>
					</el-form>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import ratingTrees from './ratingTrees'
export default{
	data(){
		return{
			buildingId: '',
			floorId: '',
			id: '',
			selfTube: 0,
			special: 0,
			apparatus: 0,
			power: 0,
			conditioner: 0,
			special3: 0,
			apparatus3: 0,
			power3: 0,
			conditioner3: 0,
			tableData: [],
			shcool: '',
			cycle: '',
			cycleList: [],
			maleData: false,
			cycles:'',
			special3_past: 0,
			apparatus3_past: 0,
			power3_past: 0,
			conditioner3_past: 0,
			special3Past: 0,
			apparatus3Past: 0,
			power3Past: 0,
			conditioner3Past: 0,
			year: '',
			yearList: [],
			years: '',
			yearLists: [],
			control: 1
		}
	},
	methods:{
		sonDatas(datas){
			console.log("接收数的参数")
			console.log(datas)
			this.buildingId = datas.buildingId
			this.floorId = datas.floorId
			this.id = datas.id
			if(datas.buildingId != ''&&datas.floorId != ''&&datas.buildingId != null&&datas.floorId != null){
				this.initData()
			}else{
				this.tableData = []
				this.special = 0
				this.conditioner = 0
				this.power = 0
				this.apparatus = 0
				this.selfTube = 0
			}
		},
		initDataList(){
			this.$axios.post(`BMPlatServers/consum/queryperiod`).then((res)=>{
				if(res.data.success) {
					console.log(res)
					this.cycleList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						   this.cycleList.push({label: item.name, value: item.Id});
					   });
					   this.cycle = this.cycleList[0].value
					   this.initData()
					}
				}else{
					this.cycleList = []
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		initYearList(){
			let datas = {
				is_fp: 1
			}
			/* console.log(datas) */
			this.$axios.post(`BMPlatServers/consum/queryyearinfo`, this.$qs.stringify(datas)).then((res)=>{
				if(res.data.success) {
					/* console.log(res) */
					this.yearList = []
					if(res.data.result.yearlist && res.data.result.yearlist.length) {
						res.data.result.yearlist.forEach((item)=>{
						   this.yearList.push({label: item.time, value: item.time});
					   });
					   this.year = this.yearList[3].value
					}
				}else{
					this.yearList = []
					this.$message.warning({
						message: res.data.resultMessage,
			            showClose: true,
			            duration: 1000,
					});
				}
			})
		},
		initData(){
			let data ={
				periodId: this.cycle,
				departId: this.school,
				building_id: this.buildingId,
				floor_id: this.floorId,
				room_id: this.id,
				year: this.year
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/queryroomquotaallocation`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.tableData = []
					this.tableData = res.data.result.quotaList
					if(res.data.result.roomQuotaList != []&&res.data.result.roomQuotaList.length != 0){
						this.special = res.data.result.roomQuotaList[0].quota
						this.conditioner = res.data.result.roomQuotaList[1].quota
						this.power = res.data.result.roomQuotaList[2].quota
						this.apparatus = res.data.result.roomQuotaList[3].quota
						this.numAdd()
					}else{
						this.special = 0
						this.conditioner = 0
						this.power = 0
						this.apparatus = 0
						this.selfTube = 0
					}		
					/* this.selfTube = parseFloat(res.data.result.roomQuotaList[0].quota)+ parseFloat(res.data.result.roomQuotaList[1].quota)+parseFloat(res.data.result.roomQuotaList[2].quota)+parseFloat(res.data.result.roomQuotaList[3].quota) */
				}else{
					this.special = 0
					this.conditioner = 0
					this.power = 0
					this.apparatus = 0
					this.selfTube = 0
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		initFangJian(){
			let data ={
				periodId: this.cycles,
				departId: this.school,
				building_id: this.buildingId,
				floor_id: this.floorId,
				room_id: this.id,
				year: this.years
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/queryroomquotaallocation`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					if(res.data.result.roomQuotaList != []&&res.data.result.roomQuotaList.length != 0){
						this.special3 = res.data.result.roomQuotaList[0].quota
						this.conditioner3 = res.data.result.roomQuotaList[1].quota
						this.power3 = res.data.result.roomQuotaList[2].quota
						this.apparatus3 = res.data.result.roomQuotaList[3].quota
					}else{
						this.special3 = 0
						this.conditioner3 = 0
						this.power3 = 0
						this.apparatus3 = 0
					}		
				}else{
					this.special3 = 0
					this.conditioner3 = 0
					this.power3 = 0
					this.apparatus3 = 0
					this.$message.warning({
						message: res.data.resultMessage,
			            showClose: true,
			            duration: 1000,
					});
				}
			})
		},
		numAdd() {  
			var baseNum, baseNum1, baseNum2,baseNum3, baseNum4;  
			try {  
				baseNum1 = this.special.toString().split(".")[1].length;  
			} catch (e) {  
				baseNum1 = 0;  
			}  
			try {  
				baseNum2 = this.conditioner.toString().split(".")[1].length;  
			} catch (e) {  
				baseNum2 = 0;  
			}
			try {  
				baseNum3 = this.power.toString().split(".")[1].length;  
			} catch (e) {  
				baseNum3 = 0;  
			}  
			try {  
				baseNum4 = this.apparatus.toString().split(".")[1].length;  
			} catch (e) {  
				baseNum4 = 0;  
			}  
				baseNum = Math.pow(10, Math.max(baseNum1, baseNum2, baseNum3, baseNum4)); 
			this.selfTube = (this.special * baseNum + this.conditioner * baseNum + this.power * baseNum + this.apparatus * baseNum) / baseNum;
			console.log(this.selfTube)
	    },
		initNengHao(){
			let data={
				departId: this.school,
				periodId: this.cycles,
				is_zg: '1',
				year: this.years,
				building_id: this.buildingId,
				floor_id: this.floorId,
				room_id: this.id,
			}
			/* console.log(data) */
			this.$axios.post(`BMPlatServers/consum/queryroomconsum`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					if(res.data.result.consumInfo&&res.data.result.consumInfo.length){
						this.special3_past = res.data.result.consumInfo[0].csm1
						this.conditioner3_past = res.data.result.consumInfo[0].csm2
						this.power3_past = res.data.result.consumInfo[0].csm3
						this.apparatus3_past = res.data.result.consumInfo[0].csm4
					}else{
						this.special3_past = 0
						this.conditioner3_past = 0
						this.power3_past = 0
						this.apparatus3_past = 0
					}
				}else{
					this.special3_past = 0
					this.conditioner3_past = 0
					this.power3_past = 0
					this.apparatus3_past = 0
					this.$message.warning({
				        message: res.data.resultMessage,
				        showClose: true,
				        duration: 1000
					});
				}
			})
		},
		initDingE(){
			let datas={
				departId: this.school,
				periodId: this.cycles,
				is_zg: '1',
				year: this.years,
				building_id: this.buildingId,
				floor_id: this.floorId,
				room_id: this.id
			}
			/* console.log(datas) */
			this.$axios.post(`BMPlatServers/consum/queryconsum`, this.$qs.stringify(datas)).then((res)=>{
				console.log(res)
				if(res.data.success){
					if(res.data.result.consumInfo&&res.data.result.consumInfo.length){
						this.special3Past = res.data.result.consumInfo[0].csm1
						this.conditioner3Past = res.data.result.consumInfo[0].csm2
						this.power3Past = res.data.result.consumInfo[0].csm3
						this.apparatus3Past = res.data.result.consumInfo[0].csm4
					}else{
						this.special3Past = 0
						this.conditioner3Past = 0
						this.power3Past = 0
						this.apparatus3Past = 0
					}
				}else{
					this.special3Past = 0
					this.conditioner3Past = 0
					this.power3Past = 0
					this.apparatus3Past = 0
					this.$message.warning({
				        message: res.data.resultMessage,
				        showClose: true,
				        duration: 1000
					});
				}
			})
		},
		/* 分配 */
		allocation(){
			this.cycles = this.cycle
			this.years = this.year
			this.maleData = true
			this.special3 = this.special
			this.conditioner3 = this.conditioner
			this.power3 = this.power
			this.apparatus3 = this.apparatus
			this.$axios.post(`BMPlatServers/consum/queryyearinfo`).then((res)=>{
				if(res.data.success) {
					/* console.log(res) */
					this.yearLists = []
					if(res.data.result.yearlist && res.data.result.yearlist.length) {
						res.data.result.yearlist.forEach((item)=>{
						   this.yearLists.push({label: item.time, value: item.time});
					   });
					   this.initData()
					}
				}else{
					this.yearLists = []
					this.$message.warning({
						message: res.data.resultMessage,
			            showClose: true,
			            duration: 1000,
					});
				}
			})
			this.initNengHao()
			this.initDingE()
		},
		/* 确定 */
		confirm(){
			let list = [
				{'class1':this.special3,
				'class4':this.apparatus3,
				'class3':this.power3,
				'class2':this.conditioner3}
				]
			list = JSON.stringify(list)
			let data ={
				departId: this.school,
				list: list,
				building_id: this.buildingId,
				floor_id: this.floorId,
				room_id: this.id,
				period: this.cycles
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/setroomquotaallocation`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				this.initData()
			})
			this.maleData = false
		},
		cancel(){
			this.maleData = false
			this.special3 = ''
			this.apparatus3 = ''
			this.power3 = ''
			this.conditioner3 = ''
			this.cycles = ''
		},
		search(){
			if(this.year < this.yearList[3].value){
				this.control = 2
			}else{
				this.control = 1
			}
			this.initData()
		}

	},
	mounted() {
		this.initDataList()
		this.initYearList()
		this.school =  window.location.href.split('=')[1];
		console.log(this.school)
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData()
		},
		cycles(item){
			if(item != ''&&item != null){
				this.initNengHao()
				this.initDingE()
				this.initFangJian()
			}
		},
		years(item){
			if(item != ''&&item != null){
				this.initNengHao()
				this.initDingE()
				this.initFangJian()
			}
		},
	},
	components:{
		'v-ratingTrees':ratingTrees
	}
}
</script>

<style lang="scss" scoped>
#roomQuota{
	.roomQuota{
		overflow: hidden;
		.ratingTree{
			float: left;
			width: 15%;
			height: 550px;
			overflow: auto;
			padding-right: 10px;
			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			-o-box-sizing: border-box;
			border-right: 1px solid #ddd;
			&::-webkit-scrollbar{
				width: 1px;
			}
		}
		.topSelfTube{
			float: right;
			width: 84%;
			.top{
				border-left: 10px solid #257fff;
				border-radius: 5px;
				box-shadow: 3px 3px 3px #e6e6e6;
				padding-bottom: 15px;
				padding-top: 15px;
				margin-top: 15px;
				.top-total{
					margin-top: 10px;
					.dinges{
						margin-left: 20px;
						font-size: 16px;
						color: #434343;
					}
					.selfTube{
						width: 200px;
					}
				}
				.top-points{
					margin-top: 15px;
					.dinge{
						color: #434343;
						margin-left: 20px;
					}
					.fourItems{
						margin-left: 10px;
						width: 100px;
					}
					.allot{
						width: 80px;
						margin-left: 30%;
					}
				}
			}
		}
		.center{
			float: right;
			width: 83%;
			.table-center{
				font-size: 16px;
				color: #434343;
			}
			margin-top: 50px;
		}
		.selectQuery{
			width: 100%;
			padding-bottom: 20px;
			.query{
				margin-left: 6%;
				font-size: 15px;
				color: #434343;
				font-weight: 400;
			}
			.select{
				margin-left: 2%;
				width: 30%;
			}
		}
		.zongshiyan{
			width: 100%;
			height: 350px;
			.shiyan{
				width: 30%;
				float: left;
				margin-left: 3%;
				.mingcheng{
					font-size: 15px;
					color: #c1c1c1;
					font-weight: 600;
					padding: 5px;
				}
				.iput_name{
					float: left;
					margin-top: 3%;
					margin-left: 15px;
					width: 88%;
				}
				.span_name{
					margin-left: 5px;
					font-size: 15px;
					color: #434343;
					font-weight: 400;
					float: left;
					margin-top: 5%;
				}
			}
			.shiyan:nth-child(1){
				border-right: 1px solid #d4d4d4;
			}
		}
		.top-judging{
			margin-left: 3%;
		}
	}
}
</style>
