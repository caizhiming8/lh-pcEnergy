<template>
	<div id="TimeUnitPriceSetting">
		<div class="TimeUnitPriceSetting">
			<div class="time-serach">
				<div class="IncrementalData">
					<template>
						<span>选择时间段</span>
						<el-date-picker v-model="timeData" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
						<el-button class="btn" type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
						<el-button @click="clickAdd()" type="primary" size="small" :disabled="qualified"><i class="el-icon-plus"></i>增加</el-button>
					</template>

				</div>
				<div class="amount" style="margin-top: 20px;margin-bottom: 10px;" v-if="this.isAmount == 1">
					<template>
						<span>本月用电金额</span>
						<el-input v-model="amount" style="width: 100px;" disabled></el-input>
					</template>
				</div>
				<div class="amount" style="margin-top: 20px;margin-bottom: 10px;" v-if="this.isAmount == 0">
					<template>
						<span>当前月份用电金额账单不全暂无本月用电金额</span>
					</template>
				</div>
				<div class="middle-table">
					<el-table tooltip-effect="light" :data="tableData" stripe style="width: 100%">
						<el-table-column :show-overflow-tooltip="true" prop="startTime" label="开始时间" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="endTime" label="结束时间" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="price" label="单价" align='center'></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="consum" label="用电量" align='center'></el-table-column>
						<el-table-column label="操作" width="250" align='center'>
						    <template slot-scope="scope">
						        <el-button @click="clickModification(scope.row)" size="mini" type="success">修改</el-button>
								<el-button @click="clickDelete(scope.row)" size="mini" type="danger">删除</el-button>
						    </template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<!-- 分页 -->
			<div class="bottom-pagnation">
			    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
			</div>
			<!-- 增加模态框 -->
			<el-dialog title=增加数据 :visible.sync="dialogVisible" width="40%">
			    <div class="el-form">
			        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
			            <el-form-item label="开始时间" prop="strarTimeRange">
			                <el-date-picker v-model="strarTimeRange" type="date" value-format="yyyy-MM-dd" placeholder="请选择时间"></el-date-picker>
			            </el-form-item>
						<el-form-item label="结束时间" prop="endTimeRange">
						    <el-date-picker v-model="endTimeRange" type="date" value-format="yyyy-MM-dd" placeholder="请选择时间"></el-date-picker>
							<!-- @blur="acquisitionTime(endTimeRange)"  -->
						</el-form-item>
						<el-form-item label="单价" prop="Price">
						    <el-input v-model="prices" style="width: 400px;" maxlength="4" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
						</el-form-item>
						<el-form-item label="用电量" prop="Consum">
						    <el-input v-model="consum" style="width: 400px;" disabled></el-input>
						</el-form-item>
			        </el-form>
			    </div>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="cancel" size="small">取 消</el-button>
			        <el-button type="primary" @click="handleAlart" size="small">确 定</el-button>
			    </span>
			</el-dialog>

			<!-- 修改弹窗 -->

			<el-dialog title=修改数据 :visible.sync="dialogVisibleManage" width="40%">
				<div class="el-form">
					<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<el-form-item label="开始时间" prop="TimeRange">
						    <el-date-picker v-model="startTime1" type="date" value-format="yyyy-MM-dd" disabled ></el-date-picker>
						</el-form-item>
						<el-form-item label="结束时间" prop="TimeRange">
						    <el-date-picker v-model="endTime1" type="date" value-format="yyyy-MM-dd" disabled ></el-date-picker>
						</el-form-item>
						<el-form-item label="单价修改">
						    <el-input v-model="priceModify" style="width: 400px;" oninput ="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
						</el-form-item>
						<el-form-item label="用电量" prop="Consum">
						    <el-input v-model="consumModify" style="width: 400px;" disabled></el-input>
						</el-form-item>
					</el-form>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button @click="manageCancel" size="small">取 消</el-button>
				    <el-button type="primary" @click="handleAlartManage" size="small">确 定</el-button>
				</span>
			</el-dialog>

			<!-- 删除弹窗 -->

			 <el-dialog title="删除数据" :visible.sync="dialogVisibleFalse" width="30%">
			    <span>确定要删除吗？</span>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="dialogVisibleFalse = false" size="small">取 消</el-button>
			        <el-button type="primary" @click="trueAlermFalse" size="small">确 定</el-button>
			    </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return{
			tableData: [],
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			timeData: '',
			qualified: true,
			isAmount: 2,
			bill: false,
			alart: {TimeRange: '', Price: '', Consum: '', Amount: ''},
			dialogVisible: false,
			dialogVisibleManage: false,
			dialogVisibleFalse: false,
			timeRange: [],
			strarTimeRange: '',
			endTimeRange: '',
			prices: '',
			consum: '',
			amount: '',
			priceModify: '',
			timeRangeModify: '',
			consumModify: '',
			startTime: '',
			endTime: '',
			startTime1: '',
			endTime1: '',
			Id: '',
			amendId: '',
			delId: '',
			lastTime: '',
			start: '',
			end: '',
			start1: '',
			end2: '',
			monthly: ''
		}
	},
	methods: {
		//查询所有数据
		initData() {
			let data = {
				time:this.timeData,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			this.$axios.post(`BMPlatServers/electricity/queryenefficprice`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
				    this.tableData = res.data.result.priceInfo;
					this.Id = res.data.result.priceInfo;
					this.pageTotal = res.data.result.count;
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 添加弹窗 */
		clickAdd() {
			this.dialogVisible = true;
		},
		/* 失去焦点增加 */
		acquisitionTime(){
			if(this.endTimeRange != ''&&this.strarTimeRange != ''){
				let data = {
					start_time: this.strarTimeRange,
					end_time: this.endTimeRange,
				}
				this.$axios.post(`BMPlatServers/electricity/findconsum`, this.$qs.stringify(data)).then((res) => {
					// console.log(res);
					if(res.data.success){
					    this.consum = res.data.result.consum;
					}else{
						this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
							duration: 1000,
						})
					}
				});
			}else{
				this.$message.warning({
					message: '请选择正确的结束时间',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 评定时间 */
		judgmentTime(){
			let timeValue = {
				start_time: this.timeData,
				/* end_time: this.endTimeRange, */
			}
			console.log(timeValue)
			this.$axios.post(`BMPlatServers/electricity/judge`, this.$qs.stringify(timeValue)).then((res) => {
				if(res.data.success){
					if(res.data.result.flag){
						this.monthly = this.strarTimeRange.substring(0,7)
						if(this.monthly == this.timeData){
							var time12 = this.strarTimeRange.substring(0,10).split('-')[2]
							console.log(time12)
							if(time12 == '01'){
								console.log('开始时间是第一天')
							}else{
								this.strarTimeRange = ''
								this.$message.warning({
									message: '月初账单请填写本月1号',
									showClose: true,
									duration: 1000,
								})
							}
						}else{
							console.log(this.monthly)
							console.log(this.timeData)
							this.$message.warning({
								message: '请选择所选月份1号',
								showClose: true,
								duration: 2000,
							})
							this.strarTimeRange = ''
						}
					}else{
						this.listTime = res.data.result.lastTime.substring(0,19)
						this.strarTimeRange = this.listTime
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
		/* 修改弹窗 */
		clickModification(row) {
			this.dialogVisibleManage = true;
			this.startTime1 = row.startTime
			this.endTime1 = row.endTime
			this.priceModify = row.price
			this.consumModify = row.consum
			this.amount = row.amount
			this.Id = row.Id;
			console.log(row)
		},
		/* 删除 */
		clickDelete(row) {
			this.dialogVisibleFalse = true;
			this.delId = row.Id;
		},
		/* 确认弹窗 */
		handleAlart() {
			this.amount = (this.consum*this.prices).toFixed(2)
			let data = {
				start_time: this.strarTimeRange,
				end_time: this.endTimeRange,
				consum: this.consum,
				price: this.prices,
				amount: this.amount,
			}
			this.$axios.post(`BMPlatServers/electricity/setenefficprice`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
				    this.initData()
					console.log(res)
					this.$message.warning({
						message: res.data.result,
					    showClose: true,
					    duration: 1000,
					})
					this.dialogVisible = false
					this.strarTimeRange = '',
					this.endTimeRange = '',
					this.consum = '';
					this.prices = '';
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 修改弹窗 */
		handleAlartManage() {
			this.amount = (this.consumModify*this.priceModify).toFixed(2)
			let data = {
				start_time: this.startTime1,
				end_time: this.endTime1,
				consum: this.consumModify,
				price: this.priceModify,
				amount: this.amount,
				id: this.Id,
			}
			this.$axios.post(`BMPlatServers/electricity/updateenefficprice`, this.$qs.stringify(data)).then((res) => {
				// console.log(res);
				if(res.data.success){
				    this.initData()
					this.dialogVisibleManage = false
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 删除弹窗 */
		trueAlermFalse() {
			let data = {
				id: this.delId,
			}
			this.$axios.post(`BMPlatServers/electricity/delenefficprice`, this.$qs.stringify(data)).then((res) => {
				// console.log(res);
				if(res.data.success){
				    this.initData()
					this.dialogVisibleFalse = false
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 取消增加弹窗 */
		cancel() {
			this.dialogVisible = false;
			this.strarTimeRange = '',
			this.endTimeRange = '',
			this.consum = '';
			this.prices = '';
		},
		/* 取消修改弹窗 */
		manageCancel() {
			this.dialogVisibleManage = false;
		},
		/* 分页 */
		handleCurrentChange() {
			let data = {
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			//查询所有的价格
			this.$axios.post(`BMPlatServers/electricity/queryenefficprice`, this.$qs.stringify(data)).then((res) => {
				// console.log(res);
				if(res.data.success){
					this.tableData = res.data.result.priceInfo;
					this.Id = res.data.result.priceInfo;
					this.pageTotal = res.data.result.count;
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		search() {
			let data = {
				time: this.timeData
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/electricity/queryallprice`, this.$qs.stringify(data)).then((res) => {
				console.log(res)
				if(res.data.success){
				    if(res.data.result.amount != ''){
						this.amount = res.data.result.amount
						this.isAmount = 1
					}else{
						this.isAmount = 0
					}
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
			this.initData()
		},
	},
	mounted() {
		this.initData()
	},
	watch: {
		timeData(item) {
			if(item == null&&item == ''){
				this.qualified = true
			}else{
				this.qualified = false
				this.bill = true
			}
			this.timeData = item
		},
		strarTimeRange(item){
			this.strarTimeRange = item
			if(this.strarTimeRange != ''&&this.strarTimeRange != null){
				this.judgmentTime()
				item = item.replace("-","")
				this.start = item.replace("-","")
				console.log(this.start)
				if(this.start.startsWith("0")){
					this.start = this.start.substring(1,item.length)
				}
			}else{
				/* this.$message.warning({
					message: '请选择开始时间',
					showClose: true,
					duration: 1000,
				}) */
				this.strarTimeRange = ''
			}
		},
		endTimeRange(item){
			this.endTimeRange = item
			if(this.strarTimeRange != ''&&this.strarTimeRange != null){
				if(this.endTimeRange != ''&&this.endTimeRange != null){
					item = item.replace("-","")
					this.end = item.replace("-","")
					console.log(this.end)
					if(this.end.startsWith("0")){
						this.end = this.end.substring(1,item.length)
						console.log(this.end)
					}
					if(Number(this.start) - Number(this.end) > 0){
						this.$message.warning({
							message: '结束时间不得小于开始时间',
							showClose: true,
							duration: 1000,
						})
						this.endTimeRange = ''
					}else{
						this.start1 = this.start.substring(0,6)
						this.end1 = this.end.substring(0,6)
						console.log(this.start1)
						console.log(this.end1)
						if(this.start1 == this.end1){
							if(this.start < this.end){
								this.acquisitionTime()
							}else{
								this.$message.warning({
									message: '结束时间不应大于开始时间',
									showClose: true,
									duration: 1000,
								})
								this.endTimeRange = ''
							}
						}else{
							this.$message.warning({
								message: '请选择当年当月下日期',
								showClose: true,
								duration: 1000,
							})
							this.endTimeRange = ''
						}
					}
				}
			}else{
				/* this.$message.warning({
					message: '请选择开始时间',
					showClose: true,
					duration: 1000,
				}) */
				this.endTimeRange = ''
			}
		},
		timeRangeModify(item) {
			if(item && item.length) {
				this.startTime1 = item[0];
				this.endTime1 = item[1];
			}else{
				this.startTime1 = '';
				this.endTime1 = '';
			}
		}
	}
}
</script>

<style lang="scss" scoped>
#TimeUnitPriceSetting{
	padding: 25px 15px 30px 15px;
	.TimeUnitPriceSetting{
		box-shadow: 0 0 6px #ddd;
		.btn{
		    margin-left: 20px;
		}
		.time-serach{
			padding: 25px 0 10px 35px;
			color: #909393;
			/* .el-button{
				padding: 20px;
			} */
		}
		/* .history-table{

		} */
		.bottom-pagnation{
			text-align: right;
			padding: 20px;
		}
		.el-input.is-disabled .el-input__inner{
			background: #ffffff;
			color: #606266;
		}
	}
}

</style>
