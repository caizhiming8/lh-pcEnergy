<template>
	<div id="checkingList">
		<div class="checkingList">
			<div class="type-serach">
				<div class="queryType">
					<span class="searchType">类型查询</span>
					<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
					    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="searchType">巡检人</span>
					<el-select v-model="responsiblePerson" placeholder="请选择" clearable style="width: 200px;">
					    <el-option v-for="item in peopleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="searchType">计划名称</span>
					<el-input v-model="nomenclature" style="width: 250px;"></el-input>
					<el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
				</div>
			</div>
			<div class="bottom-echarts">
				<div class="bottom-Echarts-l" ref="bottomEchartsRight" v-loading="loading2"></div>
                <div class="bottom-Echarts-r" ref="bottomEchartsLeft" v-loading="loading1"></div>
            </div>
			<div class="middle-table">
				<div class="">
					<el-button type="primary" @click="profiled()" size="small" icon="el-icon-plus">制定巡检计划</el-button>
					<el-button type="primary" @click="enable" size="small" icon="el-icon-check">启用</el-button>
					<el-button type="primary" @click="disable" size="small"><i class="iconfont icon-ban" style="font-size: 12px;margin-right: 5px;"></i>禁用</el-button>
					<el-button type="primary" @click="eliminate" size="small" icon="el-icon-close">删除</el-button>
				</div>
				<el-table tooltip-effect="light" :data="tableData" @selection-change="maneuvering" style="width: 100%; margin-top: 20px;" :row-style="{height:0}" :cell-style="{padding:'5px 0px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column type="selection" width="45"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="code" label="巡检编号" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="planName" label="巡检计划" align='center'></el-table-column>
					<!-- <el-table-column :show-overflow-tooltip="true" prop="deviceName" label="巡检设备" align='center'></el-table-column> -->
					<el-table-column :show-overflow-tooltip="true" prop="username" label="巡检人" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="time" label="本次巡检日期" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="next_time" label="下次巡检日期" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="本次超期" align='center'><!-- prop="exceed_time"  -->
						<template slot-scope="scope">
							<div style="color: red;">{{scope.row.exceed_count}}</div>
						</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="period" label="周期" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="status1" label="是否巡检" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="flag" label="计划状态" align='center'></el-table-column>
					<!-- <el-table-column :show-overflow-tooltip="true" prop="coding" label="巡检结果" align='center'></el-table-column> -->
					<el-table-column label="操作" width="250" align='center'>
					    <template slot-scope="scope">
					        <el-button @click="clickPerform(scope.row)" size="mini" type="success" v-if="(scope.row.flag == '启用' && roleId ==1) || (scope.row.flag == '启用' && uId != scope.row.id)">执行</el-button>
					    </template>
					</el-table-column>
				</el-table>
			</div>
			<div class="bottom-pagnation">
			    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
			</div>
			<!-- 执行计划 -->
			<el-dialog title="执行巡检计划" :visible.sync="perform" width="52%">
			    <div class="el-form">
			        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<el-form-item label="计划名称" prop="nomenclature" style="float: left;">
						    <el-input v-model="projectName" style="width: 300px;" disabled></el-input>
						</el-form-item>
						<el-form-item label="巡检人" prop="people" disabled style="float: left;">
						    <el-input v-model="people" style="width: 300px;" disabled></el-input>
						</el-form-item>
						<el-form-item label="巡检结果" prop="state">
						    <el-input v-model="state" type="textarea" maxlength="200" show-word-limit style="width: 700px;"></el-input>
						</el-form-item>
			        </el-form>
					<el-table tooltip-effect="dark" :data="tableDataList" stripe style="width: 100%; margin-top: 20px;" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
						<el-table-column :show-overflow-tooltip="true" prop="code" label="设备编码" align='center' width="150"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="type_name" label="设备类型" align='center' width="200"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="name" label="设备名称" align='center' width="200"></el-table-column>
						<el-table-column label="操作方式" align='center'width="300">
							<template slot-scope="scope">
								<el-radio label="1" v-model="scope.row.checked">正常</el-radio>
								<el-radio label="2" v-model="scope.row.checked">故障</el-radio>
								<el-button style="margin-left: 10px;" v-if="scope.row.checked == 2" @click="repair(scope.row)" size="small">报修</el-button>
							</template>
						</el-table-column>
					</el-table>
			    </div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="performCancel">取 消</el-button>
					<el-button type="primary" @click="performDetermine">确 定</el-button>
				</span>
			</el-dialog>
			<!-- <el-dialog title=详细巡检计划 :visible.sync="particulars" width="52%"></el-dialog> -->
		</div>
	</div>
</template>
<script>
import bus from '../../../../../static/js/bus.js'
export default {
	data() {
		return{
			tableData: [],
			tableDataList: [],
			choiceTime: '',
			TimeList: [{label: '年巡检', value: 0}, {label: '月巡检', value: 1},{label: '日巡检', value: 2}],
			currentPage: 1,
			pageSize: 6,
			pageTotal: 1,
			patrol: false,
			perform: false,
			performResult: false,
			nomenclature: '',
			equipment: '',
			people: '',
			state: '',
			inspectionTime: '',
			plannedState: '',
			plannedStateList: [{label: '正常', value: 0}, {label: '故障', value: 1}],
			subsystemState: 0,
			ascription: '',
			ascriptionSubsystem: '',
			systemList: [{value: 0,label: '供水系统'},{value: 1,label: '供电系统'},{value: 2,label: '供暖系统'},{value: 3,label: '空调系统'},],
			subSystemList: [],
			selectEquipment: false,
			multipleSelection: [],
			responsiblePerson: '',
			peopleList: [],
			dataList: [],
			dataName: [],
			nameListData: [],
			loading1: true,
			loading2: true,
			typeArray: [],
			performID: '',
			projectName: '',
			radio: '',
			radios: '',
			baoxiu: 0,
			sttusCodes: [{label: "正常",value: "0",selected: "1"},{label: "故障",value: "1",selected: "0"}],
			particulars: false,
			allnum: '',
			allnum1: '',
			all: '',
			allnum2: '',
			allnum3: '',
			all1: '',
			uId: '',
			roleId: ''
		}
	},
	methods: {
		init() {
		    let myEchartsLeftB = this.$echarts.init(this.$refs.bottomEchartsLeft);
		    let optionLeftB = {
		        title: {
		            text: '巡检数占比',
					subtext: this.all,
		            x: 'center',
		            y: 'center'
		        },
				color: ['#8693F3', '#FF908F'],
		        tooltip: {
		            trigger: 'item',
		            formatter: "{a} <br/>{b}: {c}个 ({d}%)"
		        },
		        legend: {
		            orient: 'vertical',
		            x: 'left',
		            data:['正常','故障']
		        },
		        series: [
		            {
		                name:'巡检数占比',
		                type:'pie',
		                radius: ['50%', '70%'],
		                avoidLabelOverlap: false,
		                label: {
		                    normal: {
		                        show: false,
		                        position: 'center'
		                    },
		                    emphasis: {
		                        show: false,
		                        textStyle: {
		                            fontSize: '30',
		                            fontWeight: 'bold'
		                        }
		                    }
		                },
		                labelLine: {
		                    normal: {
		                        show: false
		                    }
		                },
		                data:this.dataList
		            }
		        ]
		    };
		    myEchartsLeftB.setOption(optionLeftB);

		    let EcgartsRightB = this.$echarts.init(this.$refs.bottomEchartsRight);
		    let optionRightB = {
		        title: {
		            text: '状态占比',
		            subtext: this.all1,
		            x: 'center',
		            y: 'center'
		        },
				color: ['#8693F3', '#FF908F'],
		        tooltip: {
		            trigger: 'item',
		            formatter: "{a} <br/>{b}: {c}个 ({d}%)"
		        },
		        legend: {
		            orient: 'vertical',
		            x: 'left',
		            data:['已执行','未执行']
		        },
		        series: [
		            {
		                name:'状态占比',
		                type:'pie',
		                radius: ['50%', '70%'],
		                avoidLabelOverlap: false,
		                label: {
		                    normal: {
		                        show: false,
		                        position: 'center'
		                    },
		                    emphasis: {
		                        show: false,
		                        textStyle: {
		                            fontSize: '16',
		                            fontWeight: 'bold'
		                        }
		                    }
		                },
		                labelLine: {
		                    normal: {
		                        show: false
		                    }
		                },
		                data: this.nameListData
		            }
		        ]
		    };
		    EcgartsRightB.setOption(optionRightB);
		},
		/* 查询类型 */
		initData(){
			this.$axios.post(`BMPlatServers/device/userList`).then((res) => {
				if(res.data.success){
					console.log(res)
					this.peopleList = []
					 res.data.result.list.forEach((item)=>{
					    this.peopleList.push({label: item.username, value: item.id});
					});
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		/* 查询表格 */
		initDataList(){
			let data = {
				period_flag: this.choiceTime,
				Uid: this.responsiblePerson,
				planName: this.nomenclature,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/findexam`, this.$qs.stringify(data)).then((res) => {
				if(res.data.success){
					console.log(res)
					if(res.data.success){
						this.tableData = []
						this.dataList = []
						this.nameListData = []
						/* this.tableData = res.data.result.resultList; */
						if(res.data.result != '' ){
							const lists = res.data.result.resultList // 后端返回数组
							this.tableData = lists.map(i => {
								this.$set(i, 'period' , i.period + i.timename)
								return i
							})
							console.log(this.tableData)
							this.pageTotal = res.data.result.count;
							let num = res.data.result.listCount;
							res.data.result.listCount.forEach((item)=>{
							    this.dataList.push({value:item.zcs,name: '正常' });
								this.dataList.push({value:item.gzs,name: '故障' });
								this.allnum += item.zcs;
								this.allnum1 += item.gzs;
							    this.nameListData.push({value: item.yzxcount,name: '已执行'});
								this.nameListData.push({value: item.wzxcount,name: '未执行'});
								this.allnum2 += item.yzxcount;
								this.allnum3 += item.wzxcount;
							})
							this.allnum = ''+this.allnum;
							this.allnum1 = ''+this.allnum1;
							this.all = Number(this.allnum)+ Number(this.allnum1)
							this.allnum2 = ''+this.allnum2;
							this.allnum3 = ''+this.allnum3;
							this.all1 = Number(this.allnum2)+ Number(this.allnum3)
						}
						setTimeout(()=>{
						    this.init()
						    this.loading1 = false;
						    this.loading2 = false;
						}, 300);
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
		toggleSelection(rows) {
			if (rows) {
				rows.forEach(row => {
					this.$refs.multipleTable.toggleRowSelection(row);
				});
			} else {
				this.$refs.multipleTable.clearSelection();
			}
		},

		/* 搜索按钮 */
		search(){
			this.initDataList()
		},
		/* 多选框 */
		maneuvering(val){
			console.log(val)
			this.typeArray = []
			val.forEach((item,index)=>{
				this.typeArray.push(item.id)
				console.log(this.typeArray)
			})
		},
		/* 删除 */
		eliminate(){
			if(this.typeArray != ''){
				var typeArray = JSON.stringify(this.typeArray)
				let data = {
					ids: typeArray
				}
				this.$axios.post(`BMPlatServers/device/deleteExam`, this.$qs.stringify(data)).then((res) => {
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.initDataList()
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
                        message: '请选择数据',
						showClose: true,
						duration: 1000,
					})
			}
		},
		/* 启用提交 */
		enable(){
			if(this.typeArray != ''){
				var typeArray = JSON.stringify(this.typeArray)
				let data = {
					value: 0,
					ids: typeArray
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/device/startexam`, this.$qs.stringify(data)).then((res) => {
					if(res.data.success){
						this.$message.warning(res.data.result)
						this.initDataList()
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
					message: '请选择数据',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 禁用提交 */
		disable(){
			if(this.typeArray != ''){
				var typeArray = JSON.stringify(this.typeArray)
				let data = {
					value: 1,
					ids: typeArray
				}
				console.log(data)
				this.$axios.post(`BMPlatServers/device/startexam`, this.$qs.stringify(data)).then((res) => {
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
							showClose: true,
							duration: 1000,
						})
						this.initDataList()
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
					message: '请选择数据',
					showClose: true,
					duration: 1000,
				})
			}
		},
		/* 制定巡检计划 */
		profiled(items) {
			/* this.patrol = true */
			this.$emit('emits', items);
		},
		/* 报修事件 */
		repair(row){
			this.$router.push('/addRepairs');
			// 跳转到报修里面导航栏高亮显示
			this.$store.commit('changeColorRouter', 'realRepair');
		},
		/* 详情展示 */
		clickDetails(item){
			console.log(item)
			this.particulars = true
		},
		/* 执行计划 */
		clickPerform(item) {
			this.$router.push({path: '/implementEquipmentInspection', query: {row: item}});
		},
		performDetermine() {
			console.log(this.tableDataList)
			var typeList = JSON.stringify(this.tableDataList)
			let data = {
				/* status: this.plannedState, */
				result: this.state,
				id: this.performID,
				deviceList: typeList
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/device/doexam`, this.$qs.stringify(data)).then((res) => {
				console.log(res)
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					})
					this.initDataList()
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
			this.perform = false
			this.radio = ''
			this.baoxiu = 1
		},
		performCancel() {
			this.perform = false
			this.radio = ''
			this.baoxiu = 1
		},
		/* 分页 */
		handleCurrentChange() {
			this.initDataList()
		}
	},
	mounted() {
		this.uId = this.$session.get('USER_INFO').Id;
		this.roleId = this.$session.get('USER_INFO').roleId;
		this.initData()
		this.initDataList()
	},
	watch:{
		radio(){
			this.baoxiu = this.radio
			console.log(this.radio)
		}
	}
}
</script>
<style lang="scss" scoped>
	.bottom-echarts{
	    overflow: hidden;
	    padding-top: 30px;
	    .bottom-Echarts-l{
	        width: 50%;
	        float: left;
	        height: 300px;
	    }
	    .bottom-Echarts-r{
	        width: 50%;
	        float: left;
	        height: 300px;
	    }
	}
	.bottom-pagnation{
		float: right;
		text-align: right;
		padding: 20px;
	}
	.checkingList{
		.type-serach{
			.queryType{
				.searchType{
					margin-left: 20px;
				}
				.searchType:first-child{
					margin-left: 0;
				}
				.btn{
					margin-left: 40px;
				}
			}
		}
	}
</style>
