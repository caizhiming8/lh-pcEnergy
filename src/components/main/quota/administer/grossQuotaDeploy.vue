<template>
	<div id="grossQuotaDeploy">
		<div class="grossQuotaDeploy">
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
						<span class="dinges">总自管定额配置:      {{selfTube}}</span>
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
					<!-- <el-input v-model="special" class="fourItems" placeholder="请输入" oninput ="value=value.replace(/[^\d^\.]+/g,'')" disabled></el-input> -->
					<!-- <el-input v-model="apparatus" class="fourItems" placeholder="请输入" oninput ="value=value.replace(/[^\d^\.]+/g,'')" disabled></el-input> -->
					<!-- <el-input v-model="power" class="fourItems" placeholder="请输入" oninput ="value=value.replace(/[^\d^\.]+/g,'')" disabled></el-input> -->
					<!-- <el-input v-model="conditioner" class="fourItems" placeholder="请输入" oninput ="value=value.replace(/[^\d^\.]+/g,'')" disabled></el-input> -->
				</div>
				<div class="topFairShare">
					<div class="top-total">
						<span class="dinges">总公摊定额配置：     {{fairShare}}</span>
					</div>
					<div class="top-points">
						<span class="dinge">特殊用电：</span>
						<span>{{special1}}</span>
						<span class="dinge">照明用电：</span>
						<span>{{apparatus1}}</span>
						<span class="dinge">动力用电：</span>
						<span>{{power1}}</span>
						<span class="dinge">空调用电：</span>
						<span>{{conditioner1}}</span>
						<el-button type="primary" @click="allocation1" size="small" class="allot" v-if="this.control == 1">分 配</el-button>
					</div>
				</div>
			</div>
			<div class="center">
				<span class="table-center">单位自管房间已分配定额</span>
				<el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="sum" label="自管总能额" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="1" label="自管特殊用电" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="2" label="自管照明用电" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="3" label="自管动力用电" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="4" label="自管空调用电" align="center"></el-table-column>
				</el-table>
			</div>
			<div class="bottom">
				<span class="table-center">单位公摊房间已分配定额</span>
				<el-table tooltip-effect="light" :data="tableData1" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column :show-overflow-tooltip="true" prop="sum" label="公摊总能额" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="1" label="公摊特殊用电" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="2" label="公摊照明用电" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="3" label="公摊动力用电" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="4" label="公摊空调用电" align="center"></el-table-column>
				</el-table>
			</div>
			<el-dialog title=自管分配定额 :visible.sync="maleData" width="60%">
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
			<el-dialog title=公摊分配定额 :visible.sync="sinceData" width="60%">
				<div class="el-form">
					<el-form ref="ruleForm" label-width="100px" 
						<div class="selectQuery">
							<span class="query">查询周期</span>
							<el-select v-model="cycles1" placeholder="请选择" clearable class="select">
								<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<span class="query">查询年份</span>
							<el-select v-model="years1" placeholder="请选择" clearable class="select">
								<el-option v-for="item in yearLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div>
						<div class="zongshiyan">
							<div class="shiyan">
								<span class="mingcheng">今年定额</span>
								<div><span class="span_name">特殊用电: </span></div>
								<el-input v-model="special2" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name"></el-input>
								<div><span class="span_name">空调用电: </span></div>
								<el-input v-model="conditioner2" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name"></el-input>
								<div><span class="span_name">动力用电: </span></div>
								<el-input v-model="power2" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name"></el-input>
								<div><span class="span_name">照明用电: </span></div>
								<el-input v-model="apparatus2" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name"></el-input>
							</div>
							<div class="shiyan">
								<span class="mingcheng">去年能耗</span>
								<div><span class="span_name">特殊用电: </span></div>
								<el-input v-model="special2_past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">空调用电: </span></div>
								<el-input v-model="conditioner2_past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">动力用电: </span></div>
								<el-input v-model="power2_past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">照明用电: </span></div>
								<el-input v-model="apparatus2_past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
							</div>
							<div class="shiyan">
								<span class="mingcheng">去年定额</span>
								<div><span class="span_name">特殊用电: </span></div>
								<el-input v-model="special2Past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">空调用电: </span></div>
								<el-input v-model="conditioner2Past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">动力用电: </span></div>
								<el-input v-model="power2Past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
								<div><span class="span_name">照明用电: </span></div>
								<el-input v-model="apparatus2Past" oninput ="value=value.replace(/[^\d^\.]+/g,'')" class="iput_name" disabled></el-input>
							</div>
						</div>
						<div class="top-judging">
							<el-button @click="confirm1" type="primary" size="small">确认</el-button>
							<el-button @click="cancel1" size="small">取消</el-button>
						</div>
					</el-form>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			selfTube: 0,
			special: 0,
			apparatus: 0,
			power: 0,
			conditioner: 0,
			fairShare: 0,
			special1: 0,
			apparatus1: 0,
			power1: 0,
			conditioner1: 0,
			special2: 0,
			apparatus2: 0,
			power2: 0,
			conditioner2: 0,
			special3: 0,
			apparatus3: 0,
			power3: 0,
			conditioner3: 0,
			special3_past: 0,
			apparatus3_past: 0,
			power3_past: 0,
			conditioner3_past: 0,
			special3Past: 0,
			apparatus3Past: 0,
			power3Past: 0,
			conditioner3Past: 0,
			special2_past: 0,
			apparatus2_past: 0,
			power2_past: 0,
			conditioner2_past: 0,
			special2Past: 0,
			apparatus2Past: 0,
			power2Past: 0,
			conditioner2Past: 0,
			tableData: [],
			tableData1: [],
			shcool: '',
			maleData: false,
			sinceData: false,
			tube: '',
			cycle: '',
			cycleList: [],
			year: '',
			yearList: [],
			years: '',
			yearLists: [],
			years1: '',
			cycles: '',
			cycles1: '',
			control: 1
		}
	},
	methods:{
		/* 周期 */
		initDataList(){
			this.$axios.post(`BMPlatServers/consum/queryperiod`).then((res)=>{
				if(res.data.success) {
					/* console.log(res) */
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
					console.log(res)
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
		/* 查询信息 */
		initData(){
			let data ={
				departId: this.school,
				periodId: this.cycle,
				year: this.year
			}
			/* console.log(data) */
			this.$axios.post(`BMPlatServers/consum/queryquotaallocation`, this.$qs.stringify(data)).then((res)=>{
				/* console.log(res) */
				if(res.data.success){
					this.tableData = []
					this.tableData1 = []
					this.tableData = res.data.result.zgQuotaList
					this.tableData1 = res.data.result.ggQuotaList
					if(res.data.result.xjZgQuotaList&&res.data.result.xjZgQuotaList.length){
						this.special = res.data.result.xjZgQuotaList[0].quota
						this.conditioner = res.data.result.xjZgQuotaList[1].quota
						this.power = res.data.result.xjZgQuotaList[2].quota
						this.apparatus = res.data.result.xjZgQuotaList[3].quota
					}else{
						this.special = 0
						this.conditioner = 0
						this.power = 0
						this.apparatus = 0
					}
					if(res.data.result.xjGgQuotaList&&res.data.result.xjGgQuotaList.length){
						this.special1 = res.data.result.xjGgQuotaList[0].quota
						this.conditioner1 = res.data.result.xjGgQuotaList[1].quota
						this.power1 = res.data.result.xjGgQuotaList[2].quota
						this.apparatus1 = res.data.result.xjGgQuotaList[3].quota
					}else{
						this.special1 = 0
						this.conditioner1 = 0
						this.power1 = 0
						this.apparatus1 = 0
					}
					/* this.selfTube = parseFloat(res.data.result.xjZgQuotaList[0].quota)+ parseFloat(res.data.result.xjZgQuotaList[1].quota)+parseFloat(res.data.result.xjZgQuotaList[2].quota)+parseFloat(res.data.result.xjZgQuotaList[3].quota) */
					/* this.fairShare = parseFloat(res.data.result.xjGgQuotaList[0].quota)+ parseFloat(res.data.result.xjGgQuotaList[1].quota)+parseFloat(res.data.result.xjGgQuotaList[2].quota)+parseFloat(res.data.result.xjGgQuotaList[3].quota) */
					this.numAdd()
					this.numAdds()
				}else{
					this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
					});
				}
			})
		},
		initZiGuan(){
			let data ={
				departId: this.school,
				periodId: this.cycles,
				year: this.years
			}
			this.$axios.post(`BMPlatServers/consum/queryquotaallocation`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					if(res.data.result.xjZgQuotaList&&res.data.result.xjZgQuotaList.length){
						this.special3 = res.data.result.xjZgQuotaList[0].quota
						this.conditioner3 = res.data.result.xjZgQuotaList[1].quota
						this.power3 = res.data.result.xjZgQuotaList[2].quota
						this.apparatus3 = res.data.result.xjZgQuotaList[3].quota
					}else{
						this.special3 = 0
						this.conditioner3 = 0
						this.power3 = 0
						this.apparatus3 = 0
					}
				}else{
					this.$message.warning({
			            message: res.data.resultMessage,
			            showClose: true,
			            duration: 1000
					});
				}
			})
		},
		initGongTan(){
			let data ={
				departId: this.school,
				periodId: this.cycles1,
				year: this.years1
			}
			this.$axios.post(`BMPlatServers/consum/queryquotaallocation`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					if(res.data.result.xjGgQuotaList&&res.data.result.xjGgQuotaList.length){
						this.special2 = res.data.result.xjGgQuotaList[0].quota
						this.conditioner2 = res.data.result.xjGgQuotaList[1].quota
						this.power2 = res.data.result.xjGgQuotaList[2].quota
						this.apparatus2 = res.data.result.xjGgQuotaList[3].quota
					}else{
						this.special2 = 0
						this.conditioner2 = 0
						this.power2 = 0
						this.apparatus2 = 0
					}
				}else{
					this.$message.warning({
			            message: res.data.resultMessage,
			            showClose: true,
			            duration: 1000
					});
				}
			})
		},
		/* 加法相加 */
		numAdds() {  
			var baseNum, baseNum1, baseNum2,baseNum3, baseNum4;  
			try {  
				baseNum1 = this.special1.toString().split(".")[1].length;  
			} catch (e) {  
				baseNum1 = 0;  
			}  
			try {  
				baseNum2 = this.conditioner1.toString().split(".")[1].length;  
			} catch (e) {  
				baseNum2 = 0;  
			}
			try {  
				baseNum3 = this.power1.toString().split(".")[1].length;  
			} catch (e) {  
				baseNum3 = 0;  
			}  
			try {  
				baseNum4 = this.apparatus1.toString().split(".")[1].length;  
			} catch (e) {  
				baseNum4 = 0;  
			}  
				baseNum = Math.pow(10, Math.max(baseNum1, baseNum2, baseNum3, baseNum4));  
			this.fairShare = (this.special1 * baseNum + this.conditioner1 * baseNum + this.power1 * baseNum + this.apparatus1 * baseNum) / baseNum;
			/* console.log(this.fairShare) */
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
			/* console.log(this.selfTube) */
	    },
		/* 自管确认 */
		confirm(){
			let zglist = [
				{'class1':this.special3,
				'class4':this.apparatus3,
				'class3':this.power3,
				'class2':this.conditioner3}
				]
			zglist = JSON.stringify(zglist)
			let data ={
				depart: this.school,
				zglist: zglist,
				typeFlag: 1,
				period: this.cycles
			}
			/* console.log(data) */
			this.$axios.post(`BMPlatServers/consum/setquotaallocation`, this.$qs.stringify(data)).then((res)=>{
				/* console.log(res) */
				this.initData()
			})
			this.maleData = false
		},
		/* 公摊确认 */
		confirm1(){
			let gglist = [
				{'class1':this.special2,
				'class4':this.apparatus2,
				'class3':this.power2,
				'class2':this.conditioner2}
				]
			gglist = JSON.stringify(gglist)
			let data ={
				depart: this.school,
				gglist: gglist,
				typeFlag: '',
				period: this.cycles1
			}
			/* console.log(data) */
			this.$axios.post(`BMPlatServers/consum/setquotaallocation`, this.$qs.stringify(data)).then((res)=>{
				/* console.log(res) */
				this.initData()
			})
			this.sinceData = false
		},
		/* 自管分配 */
		allocation(){
			this.cycles = this.cycle
			this.years = this.year
			this.maleData = true
			this.special3 = this.special
			this.apparatus3 = this.apparatus
			this.power3 = this.power
			this.conditioner3 = this.conditioner
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
		initNengHao(){
			let data={
				departID: this.school,
				period: this.cycles,
				is_zg: '1',
				year: this.years
			}
			/* console.log(data) */
			this.$axios.post(`BMPlatServers/consum/querylastyear`, this.$qs.stringify(data)).then((res)=>{
				/* console.log(res) */
				if(res.data.success){
					if(res.data.result.lastYearInfo&&res.data.result.lastYearInfo.length){
						this.special3Past = res.data.result.lastYearInfo[0].quota
						this.conditioner3Past = res.data.result.lastYearInfo[1].quota
						this.power3Past = res.data.result.lastYearInfo[2].quota
						this.apparatus3Past = res.data.result.lastYearInfo[3].quota
					}else{
						this.special3Past = 0
						this.conditioner3Past = 0
						this.power3Past = 0
						this.apparatus3Past = 0
					}
				}else{
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
				year: this.years
			}
			/* console.log(datas) */
			this.$axios.post(`BMPlatServers/consum/queryconsum`, this.$qs.stringify(datas)).then((res)=>{
				/* console.log(res) */
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
					this.$message.warning({
				        message: res.data.resultMessage,
				        showClose: true,
				        duration: 1000
					});
				}
			})
		},
		initNengHao1(){
			let data={
				departID: this.school,
				period: this.cycles1,
				is_zg: '1',
				year: this.years1
			}
			/* console.log(data) */
			this.$axios.post(`BMPlatServers/consum/querylastyear`, this.$qs.stringify(data)).then((res)=>{
				/* console.log(res) */
				if(res.data.success){
					if(res.data.result.lastYearInfo&&res.data.result.lastYearInfo.length){
						this.special2Past = res.data.result.lastYearInfo[0].quota
						this.conditioner2Past = res.data.result.lastYearInfo[1].quota
						this.power2Past = res.data.result.lastYearInfo[2].quota
						this.apparatus2Past = res.data.result.lastYearInfo[3].quota
					}else{
						this.special2Past = 0
						this.conditioner2Past = 0
						this.power2Past = 0
						this.apparatus2Past = 0
					}
				}else{
					this.$message.warning({
				        message: res.data.resultMessage,
				        showClose: true,
				        duration: 1000
					});
				}
			})
		},
		initDingE1(){
			let datas={
				departId: this.school,
				periodId: this.cycles1,
				is_zg: '1',
				year: this.years1
			}
			/* console.log(datas) */
			this.$axios.post(`BMPlatServers/consum/queryconsum`, this.$qs.stringify(datas)).then((res)=>{
				/* console.log(res) */
				if(res.data.success){
					if(res.data.result.consumInfo&&res.data.result.consumInfo.length){
						this.special2_past = res.data.result.consumInfo[0].csm1
						this.conditioner2_past = res.data.result.consumInfo[0].csm2
						this.power2_past = res.data.result.consumInfo[0].csm3
						this.apparatus2_past = res.data.result.consumInfo[0].csm4
					}else{
						this.special2_past = 0
						this.conditioner2_past = 0
						this.power2_past = 0
						this.apparatus2_past = 0
					}
				}else{
					this.$message.warning({
				        message: res.data.resultMessage,
				        showClose: true,
				        duration: 1000
					});
				}
			})
		},
		/* 公摊分配 */
		allocation1(){
			this.cycles1 = this.cycle
			this.years1 = this.year
			this.sinceData = true
			this.special2 = this.special1
			this.apparatus2 = this.apparatus1
			this.power2 = this.power1
			this.conditioner2 = this.conditioner1
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
			this.initNengHao1()
			this.initDingE1()
		},
		/* 自管取消 */
		cancel(){
			this.maleData = false
			this.special3 = ''
			this.apparatus3 = ''
			this.power3 = ''
			this.conditioner3 = ''
		},
		/*公摊取消  */
		cancel1(){
			this.sinceData = false
			this.special2 = ''
			this.apparatus2 = ''
			this.power2 = ''
			this.conditioner2 = ''
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
	computed:{

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
				this.initZiGuan()
			}
		},
		years(item){
			if(item != ''&&item != null){
				this.initNengHao()
				this.initDingE()
				this.initZiGuan()
			}
		},
		cycles1(item){
			if(item != ''&&item != null){
				this.initNengHao1()
				this.initDingE1()
				this.initGongTan()
			}
		},
		years1(item){
			if(item != ''&&item != null){
				this.initNengHao1()
				this.initDingE1()
				this.initGongTan()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
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
	.topFairShare{
		margin-top: 20px;
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
	.top-judging{
		margin-left: 3%;
	}
	.center{
		.table-center{
			font-size: 15px;
			color: #434343;
		}
		margin-top: 50px;
	}
	.bottom{
		.table-center{
			font-size: 15px;
			color: #434343;
		}
		margin-top: 20px;
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
</style>
