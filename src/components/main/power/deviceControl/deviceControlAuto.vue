<template>
    <div id="deviceControlAuto">
        <div class="deviceControlAuto">
			<!-- 操纵栏 -->
			<div>
				<span>选择楼宇</span>
				<el-select v-model="building" placeholder="请选择楼宇" clearable>
				    <el-option v-for="item in buildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
				<el-button class="btn" size="small" type="primary" @click="newTask">新增</el-button>
				<div class="condition" style="float:right"  v-if="this.task == 1">
					<el-tag class="spanBlue" size="mini">设备开</el-tag>
					<el-tag class="spanRed" size="mini">设备关</el-tag>
					<el-tag class="spanGray" size="mini">设备不可用</el-tag>
				</div>
			</div>
			<!-- 选项栏 -->
			<div class="placeCollapse" v-if="this.task == 1">
				 <div class="placeButton">
				    <!-- <el-button @click="selectAll" type="primary" plain size="medium">全选选中</el-button>
				    <el-button @click="cancelAll" type="success" plain size="medium">全部取消</el-button> -->
				</div>
			    <el-collapse accordion>
			        <el-collapse-item v-for="(data, k) in dataList" :key="k">
			            <template slot="title">
			                <div>
								<span class="choose"  @click.stop="messageCollapseChangeEvent(data)" v-if="on_off == 1">全选</span>
								<span class="cancel"  @click.stop="messageCollapseChangeEventCancle(data)" v-if="on_off == 2">取消</span>
			                    <span class="span">第{{data.floor_name}}（点击展开）</span>
			                    <!-- <el-button size="mini" round type="primary" @click.stop="messageCollapseChangeEvent(data)">全选</el-button>
			                    <el-button size="mini" round type="warning" @click.stop="messageCollapseChangeEventCancle(data)">取消</el-button> -->
			                </div>
			            </template>
			            <div>
			                <el-checkbox id="showBlue" v-for="(item, index) in data.room_data" :key="index" @change="checkeds(item)" v-if="data.room_data && data.room_data.length && item.value == 1" v-model="item.isChecked" :label="item.room_name"></el-checkbox>
			                <el-checkbox id="showRed" v-for="(item, index) in data.room_data" :key="index" @change="checkeds(item)" v-if="data.room_data && data.room_data.length && item.value == 0" v-model="item.isChecked" :label="item.room_name"></el-checkbox>
			                <el-checkbox id="showGray" disabled v-for="(item, index) in data.room_data" :key="index" @change="checkeds(item)" v-if="data.room_data && data.room_data.length && item.available == 0" v-model="item.isChecked" :label="item.room_name"></el-checkbox>
			            </div>
			        </el-collapse-item>
			    </el-collapse>
			    <div class="command">
					<span>任务名称</span>
					<el-input v-model="taskName" placeholder="请输入任务名称" class="task_input"></el-input>
					<span>选择周期时段</span>
					<el-select v-model="startWeek" style="width: 110px;" placeholder="开始周期" @change="staWeek">
						<el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value" ></el-option>
					</el-select>
					<span>~</span>
					<el-select v-model="endWeek" collapse-tags style="width: 110px;" placeholder="结束周期">
						<el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span>设置周期时间</span>
					<el-time-picker v-model="timeRange" type="datetimerange" value-format="HH:mm" placeholder="选择时段"></el-time-picker>
			        <el-button type="primary" @click="connected" size="small">通</el-button>
					<el-button type="danger" @click="disconnect" size="small">断</el-button>
			    </div>
			</div>
			<!-- 修改时间 -->
				<div class="placeTable">
				    <p>定时任务表</p>
				    <el-table :data="tableData1" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
				        <el-table-column type="index" label="序号" align='center'></el-table-column>
				        <el-table-column prop="name" label="任务名称" align='center'></el-table-column>
				        <el-table-column prop="startWeek" label="开始周期" :show-overflow-tooltip="true" align='center'></el-table-column>
				        <el-table-column prop="endWeek" label="结束周期" sortable align='center'></el-table-column>
				        <el-table-column prop="run_time" label="定时时间" sortable align='center'></el-table-column>
				       <!-- <el-table-column prop="run_time" label="定时时间(关)" :show-overflow-tooltip="true" sortable align='center'></el-table-column> -->
				        <el-table-column prop="status" label="状态" :show-overflow-tooltip="true" sortable align='center'></el-table-column>
						<el-table-column label="操作" align='center'>
						    <template slot-scope="scope">
						        <el-button @click="updateFiles(scope.row)" size="mini" type="success">详情</el-button>
								<el-button @click="delFiles(scope.row)" size="mini" type="danger">删除</el-button>
						    </template>
						</el-table-column>
				    </el-table>
					<div class="bottom-pagnation">
					    <el-pagination background @current-change="handleCurrentChange1" :current-page.sync='currentPage1' :page-size='pageSize1' layout="total, prev, pager, next"  :total="pageTotal1"></el-pagination>
					</div>
				</div>
			<!-- 命令栏 -->
			<div class="placeTable">
			    <p>等待控制命令</p>
			    <el-table :data="tableData" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
			        <el-table-column type="index" label="序号" width="60" align='center'></el-table-column>
			        <el-table-column prop="building_id" label="建筑名称" width="120" align='center'></el-table-column>
			        <el-table-column prop="floor_id" label="楼层" align='center'></el-table-column>
			        <el-table-column prop="room_id" label="房间名称" sortable align='center' width="120"></el-table-column>
			        <el-table-column prop="device_type" label="设备类型" sortable align='center' width="120"></el-table-column>
			        <el-table-column prop="class_id" label="下控类别" :show-overflow-tooltip="true" align='center'></el-table-column>
			        <el-table-column prop="subclass_id" label="下控子类别" sortable align='center' width="150"></el-table-column>
			        <el-table-column prop="value" label="下控值" sortable align='center'></el-table-column>
			        <el-table-column prop="start_time" label="指令下发时间" :show-overflow-tooltip="true" sortable align='center' width="150"></el-table-column>
                    <el-table-column prop="operatorName" label="操作人" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" sortable align='center'></el-table-column>
			    </el-table>
				<div class="bottom-pagnation">
				    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
			</div>
			<el-dialog title="修改定时" :visible.sync="powering" width="30%" @close='closeDialog'>
				<div class="power">
					<div class="shei_div">
						<span class="shei_span">设备名称： </span><span class="shei_span">{{timeName}}</span>
					</div>
					<div class="shei_div">
						<span>周期时段</span>
						<el-select v-model="startWeeks" style="width: 110px;" placeholder="开始周期" @change="staWeek">
							<el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value" ></el-option>
						</el-select>
						<span>~</span>
						<el-select v-model="endWeeks" collapse-tags style="width: 110px;" placeholder="结束周期">
							<el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="shei_div">
						<span>周期时间</span>
						<el-time-picker v-model="timeRanges" type="datetimerange" value-format="HH:mm" placeholder="选择设备"></el-time-picker>
					</div>
					<div class="shei_div">
						<span class="span_input">设备：</span>
						<div class="powerTask">
							<el-tag class="tally" v-for="(item, index) in deviceList" :key="index" v-if="deviceList && deviceList.length" v-model="item.isChecked" disabled>{{item.room_name}}</el-tag>
						</div>
						<el-button class="btn" size="mini" type="primary" @click="adjust">调整设备</el-button>
					</div>
					<div class="shei_divs" v-if="this.Adjust == 2">
						<div class="powerTask">
							<el-checkbox id="showBlues" v-for="(item, index) in adjustList" :key="index" @change="checkedss(item)" v-if="adjustList && adjustList.length && item.value == 1" v-model="item.isChecked" :label="item.room_name"></el-checkbox>
						</div>
						<div class="shei_commands">
						    <el-button type="success" @click="finishing" size="mini">调整</el-button>
							<el-button type="warning" @click="cancels" size="mini">取消</el-button>
						</div>
					</div>
				</div>
				<div class="shei_command">
				    <el-button type="primary" @click="determine" size="small">确定</el-button>
					<el-button type="danger" @click="cancel" size="small">取消</el-button>
				</div>
			</el-dialog>
			<el-dialog title="删除此任务" :visible.sync="delRenWu" width="30%">
				<div class="del"><span class="del_span">是否要删除此任务?</span></div>
				<span slot="footer" class="dialog-footer">
				    <el-button type="success" plain @click="delCancel()" size="small">取 消</el-button>
				    <el-button type="primary" @click="delConfirm()" size="small">确 定</el-button>
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
			tableData1: [],
			tableDataHistory: [],
			searchTypeList: [],
			searchType: '',
			buildingList: [],
			building: '',
			timeRange: '',
			timeRanges: '',
			dataList: [],
			item: {},
			value: '',
			backgroundData: []  ,// 给后台传的数组
			backData: '',
			arr: [],
			array: '',
			searchType: '',
			subsystem: '',
			Time: '',
			startWeek: '',
			endWeek: '',
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			currentPage1: 1,
			pageSize1: 10,
			pageTotal1: 0,
			on_off: 1,
			options: [{
				key: 1,
				value: '1',
				label: '周一'
			},
			{
				key: 2,
				value: '2',
				label: '周二'
			},
			{
				key: 3,
				value: '3',
				label: '周三'
			},
			{
				key: 4,
				value: '4',
				label: '周四'
			},
			{
				key: 5,
				value: '5',
				label: '周五'
			},
			{
				key: 6,
				value: '6',
				label: '周六'
			},
			{
				key: 7,
				value: '7',
				label: '周天'
			},
			],
			startWeek: [],
			endWeek: [],
			startWeeks: [],
			endWeeks: [],
			powering: false,
			timeName: '',
			buildingID: '',
			floorID: '',
			roomID: '',
			controlID: '',
			ammeterID: '',
			taskName: '',
			task: 2,
			device: '',
			deviceList: [],
			adjustList: [],
			Adjust: 1,
			arrs: [],
			end: '',
			start: '',
			delRenWu: false
        }
    },
    methods: {
		// 楼宇列表
		buildingListType() {
		    this.$axios.post(`BMPlatServers/common/queryBuildings`).then((res)=>{
		        // console.log(res);
		        if(res.data.success) {
                    this.buildingList = [];
                    this.building = 0;
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
    		                this.buildingList.push({label: item.name, value: item.Id});
    		            });
    		            this.building = this.buildingList[0].value;
						this.initdeviceData();
						this.initTable1();
						this.initTable2();
                    }
		        }else{
                    this.buildingList = [];
                    this.building = 0;
		            this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
		        }
		    })
		},
		initdeviceData() {
		    let data = {
		        building_id: this.building,
		        type: this.subsystem,
		    };
		    this.$axios.post(`BMPlatServers/electricity/querydevicecontrolist`, this.$qs.stringify(data)).then((res)=>{
		        // console.log(res)
				if(res.data.success) {
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((itemOut, index)=>{
    		                if(itemOut.room_data && itemOut.room_data.length) {
    		                    itemOut.room_data.forEach((itemInner, i)=>{
    		                        this.backgroundData.push(itemInner);
    		                    })
    		                }
    		            })
    		            this.dataList = res.data.result;
                    }
		        }else{
		            this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
		        }
		    })
		},
		/* 转换数字 */
		convertDigital() {
			switch(this.startWeek){
				case 1:
				this.startWeek = 'MON';
				break;
				case 2:
				this.startWeek = 'TUE';
				break;
				case 3:
				this.startWeek = 'WED';
				break;
				case 4:
				this.startWeek = 'THU';
				break;
				case 5:
				this.startWeek = 'FRI';
				break;
				case 6:
				this.startWeek = 'SAT';
				break;
				case 7:
				this.startWeek = 'SUN';
				break;
			}
			switch(this.endWeek){
				case 1:
				this.endWeek = 'MON';
				break;
				case 2:
				this.endWeek = 'TUE';
				break;
				case 3:
				this.endWeek = 'WED';
				break;
				case 4:
				this.endWeek = 'THU';
				break;
				case 5:
				this.endWeek = 'FRI';
				break;
				case 6:
				this.endWeek = 'SAT';
				break;
				case 7:
				this.endWeek = 'SUN';
				break;
			}
		},
		/* 连通 */
		connected() {
			var array = JSON.stringify(this.arr)
			let data = {
				value: 1,
				type: this.subsystem,
			    arrList: array,
				startWeek: this.startWeek,
				endWeek: this.endWeek,
				time: this.Time,
				control: 'timing',
				timingName: this.taskName
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/electricity/e_controlfordingshi`, this.$qs.stringify(data)).then((res)=>{
			    console.log(res);
			    if(res.data.success) {
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 3000,
					});
					/* this.initdeviceData(); */
					this.initTable2();
					this.task = 2;
					this.startWeek = [];
					this.endWeek = [];
					this.timeRange = '';
					this.taskName = '';
					this.initdeviceData()
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 3000,
					});
			    }
			})
		},
		/* 断开 */
		disconnect() {
			var array = JSON.stringify(this.arr)

			let data = {
				value: 0,
				type: this.subsystem,
			    arrList: array,
				startWeek: this.startWeek,
				endWeek: this.endWeek,
				time: this.Time,
				control: 'timing',
				timingName: this.taskName
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/electricity/e_controlfordingshi`, this.$qs.stringify(data)).then((res)=>{
			    // console.log(res);
			    if(res.data.success) {
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 3000,
					});
					/* this.initdeviceData(); */
					this.initTable2();
					this.task = 2;
					this.startWeek = [];
					this.endWeek = [];
					this.timeRange = '';
					this.taskName = '';
					this.initdeviceData()
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 3000,
					});
			    }
			})
		},
		//多选框
		checkeds(i) {
			console.log(i)
			/* this.timeName = i.room_name
			this.buildingID = i.building_id
			this.floorID = i.floor_id
			this.roomID = i.room_id
			this.controlID = i.control_id
			this.ammeterID = i.ammeter_id */
		    this.arr = [];
            if(this.backgroundData && this.backgroundData.length) {
                this.backgroundData.forEach((items, index)=>{
    		        if(items.isChecked) {
    		            this.arr.push(items);
    		        }
    		    });
            }
		},
		/* 设备定时 */
		initDevice(){
			let data ={
				building_id:this.buildingID,
				floor_id:this.floorID,
				room_id:this.roomID,
				control_id:this.subsystem,
				ammeter_id:this.ammeterID
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/electricity/getroomtiming`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					if(res.data.result.infoList&&res.data.result.infoList.length){
						this.startWeeks = res.data.result.infoList[0].startWeek
						this.endWeeks = res.data.result.infoList[0].endWeek
						this.timeRanges = res.data.result.infoList[0].run_time
					}else{
						this.$message.warning({
							message: '当前设备暂无定时',
						    showClose: true,
						    duration: 3000,
						});
					}
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
					    showClose: true,
					    duration: 3000,
					});
				}
			})
		},
		determine(){
			let data ={
				code:this.controlID,
				startWeek: this.startWeeks,
				endWeek: this.endWeeks,
				run_time: this.timeRanges
			}
			this.$axios.post(`BMPlatServers/electricity/updateroomtiming`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.$message.warning({
						message: res.data.result,
					    showClose: true,
					    duration: 3000,
					});
					this.powering = false
					this.initTable2()
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
					    showClose: true,
					    duration: 3000,
					});
				}
			})
		},
		cancel(){
			this.powering = false
			this.Adjust = 1
			/* this.adjust() */
		},
		/* 关闭选项框 */
		closeDialog(){
			console.log(this.dataList)
			/* for( var i = 0;i<this.dataList.length;i++){
				this.dataList[i].room_data.forEach((i, index)=>{
					i.isChecked = false;
				})
			}	 */
		},
		/* //全部删除
		selectAll() {
            if(this.dataList && this.dataList.length) {
                this.dataList.forEach((itemOut, index)=>{
    		        if(itemOut.room_data && itemOut.room_data.length) {
    		            itemOut.room_data.forEach((itemInner, i)=>{
    		                itemInner.isChecked = true;
    		            })
    		        }
    		    })
            }
		},
		// 全部删除
		cancelAll() {
		    this.dataList.forEach((itemOut, index)=>{
		        if(itemOut.room_data && itemOut.room_data.length) {
		            itemOut.room_data.forEach((itemInner, i)=>{
		                itemInner.isChecked = false;
		            })
		        }
		    })
		}, */

		/* 新增任务 */
		newTask(){
			this.task = 1
		},
		updateFiles(item){
			console.log(item)
			this.powering = true
			this.controlID = item.code
			this.timeName = item.name
			this.end = item.end
			this.start = item.start
			this.endWeeks = item.end
			this.startWeeks = item.start
			this.timeRanges = item.run_time
			this.initTDeviceList()
		},
		delFiles(item){
			this.controlID = item.code
			this.delRenWu = true
		},
		delConfirm(){
			let data = {
				code: this.controlID
			}
			this.$axios.post(`BMPlatServers/electricity/deleteTimingInfo`, this.$qs.stringify(data)).then((res)=>{
			    console.log(res);
			    if(res.data.success) {
					/* console.log(res); */
			    	this.initTable2()
					this.delRenWu = false
			    }else{
			        this.$message.warning({
			    		message: res.data.resultMessage,
			    		showClose: true,
			    		duration: 1000,
			    	});
			    }
			})
		},
		delCancel(){
			this.delRenWu = false
		},
		/* 设备列表 */
		initTDeviceList(){
			let data = {
				code:this.controlID,
				building_id:this.building,
				type: this.subsystem
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/electricity/gettiminginfo`, this.$qs.stringify(data)).then((res)=>{
			    console.log(res);
			    if(res.data.success) {
					/* console.log(res); */
			    	this.deviceList = []
					this.deviceList = res.data.result.controlList
			    }else{
			    	/* this.tableData = [];
			    	this.pageTotal = 0; */
			        this.$message.warning({
			    		message: res.data.resultMessage,
			    		showClose: true,
			    		duration: 1000,
			    	});
			    }
			})
		},
		/* 调整 */
		adjust(){
			let data = {
				building_id:this.building,
				type: this.subsystem,
				code: this.controlID,
			}
			this.$axios.post(`BMPlatServers/electricity/getdeviceinfo`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success) {
					/* console.log(res); */
					this.adjustList = []
					this.adjustList = res.data.result.room_data
					if(this.adjustList && this.adjustList.length) {
					    this.adjustList.forEach((items, index)=>{
							this.deviceList.forEach((itemss, indexs)=>{
								if(items.room_name == itemss.room_name) {
									items.isChecked = true
								}
							})
					    });
					}
					this.checkedss()
					this.Adjust = 2
				}else{
				    this.$message.warning({
						message: res.data.resultMessage,
						showClose: true,
						duration: 1000,
					});
				}
			})
		},
		/* 设备选择 */
		checkedss(item){
			this.arrs = [];
			if(this.adjustList && this.adjustList.length) {
			    this.adjustList.forEach((items, index)=>{
			        if(items.isChecked) {
			            this.arrs.push(items);
			        }
			    });
			}
			console.log(this.arrs)
		},
		/* 调整确定 */
		finishing(){
			var array = JSON.stringify(this.arrs)
			let data = {
				timingName: this.timeName,
				code: this.controlID,
				arrList: array,
				endWeek: this.end,
				startWeek: this.start,
				run_time: this.timeRanges
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/electricity/addtiminginfo`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success) {
					/* console.log(res); */
					this.Adjust = 2
					this.initTDeviceList()

				}else{
				    this.$message.warning({
						message: res.data.resultMessage,
						showClose: true,
						duration: 1000,
					});
				}
			})
		},
		cancels(){
			this.Adjust = 1
			/* this.adjust() */
		},
		messageCollapseChangeEvent(item) {
			this.on_off = 2;
			console.log(item)
		    item.room_data.forEach((i, index)=>{
		        i.isChecked = true;
		    })
		},
		messageCollapseChangeEventCancle(item) {
			this.on_off = 1;
			console.log(item)
		    item.room_data.forEach((i, index)=>{
		        i.isChecked = false;
		    })
		},
		initTable1() {
			let data={
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				building_id: this.building,
				type: this.subsystem
			}
			console.log(data)
		    this.$axios.post(`BMPlatServers/electricity/qdbcontrolrealtime`, this.$qs.stringify(data)).then((res)=>{
		        console.log(res);
		        if(res.data.success) {
		        	this.tableData = [];
		            this.tableData = res.data.result.control_infos;
		        	this.pageTotal = res.data.result.count;
		        }else{
		        	this.tableData = [];
		        	this.pageTotal = 0;
		            this.$message.warning({
		        		message: res.data.resultMessage,
		        		showClose: true,
		        		duration: 1000,
		        	});
		        }
		    })
		},
		/* 修改列表 */
		initTable2() {
			let data={
				currentPage: this.currentPage1,
				pageSize: this.pageSize1,
				building_id: this.building,
				type: this.subsystem
			}
			console.log(data)
		    this.$axios.post(`BMPlatServers/electricity/gettimings`, this.$qs.stringify(data)).then((res)=>{
		        console.log(res);
		        if(res.data.success) {
		        	this.tableData1 = [];
		            this.tableData1 = res.data.result.TimingList
		        	this.pageTotal1 = res.data.result.count;
		        }else{
		        	this.tableData1 = [];
		        	this.pageTotal1 = 0;
		            this.$message.warning({
		        		message: res.data.resultMessage,
		        		showClose: true,
		        		duration: 1000,
		        	});
		        }
		    })
		},
		/* 点击事件 */
		staWeek(item){
			console.log(item)
		},
		/* 分页 */
		handleCurrentChange(){
			this.initTable1()
		},
		handleCurrentChange1(){
			this.initTable2()
		},
		search() {
			this.on_off = 1;
			if(this.endWeek < this.startWeek){
				this.$message.warning({
					message: '当前选择时间不正确',
					showClose: true,
					duration: 1000,
				});
				this.startWeek = ''
				this.endWeek = ''
			}else{
				this.convertDigital();
				this.initdeviceData();
				this.initTable1()
				this.initTable2()
			}
		}
    },
    mounted() {
		this.on_off = 1;
        this.subsystem = window.location.href.split('=')[1];
        this.buildingListType()
        /* setTimeout(()=>{
            this.initdeviceData();
        }, 300); */
    },
	watch: {
		timeRange(item) {
		    this.Time = item;
		},
		endWeek(endWeek,oldEndWeek){
			if(this.endWeek < this.startWeek){
					this.$message.warning('当前时间选择不正确');
					this.startWeek = ''
					this.endWeek = ''
			}else{
				this.convertDigital();
			}
		}
	},
}
</script>

<style lang="scss" scoped>
	#deviceControlAuto{
	    .deviceControlAuto{
	        .btn{
	            margin-left: 20px;
	        }
			.condition{
				float: right;
				margin-right: 30px;
				.spanBlue{
					background: #409eff;
					color: #ffffff;
					border: none;
				}
				.spanRed{
					background: #f08080;
					color: #ffffff;
					border: none;
				}
				.spanGray{
					background: #dcdcdc;
					color: #ffffff;
					border: none;
				}
			}
	        .placeCollapse{
	            margin-top: 30px;
				#showBlue{
					border-radius: 5px;
					background: #409eff;
					padding: 3px;
					color: #ffffff;
					/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
						color: #ffffff;
					}
					/deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
						background-color: #D67121;
						border-color: #D67121;
					}
					/deep/ .el-checkbox__inner :hover{
						border-color: #D67121;
					}
					/deep/ .el-checkbox__input.is-focus .el-checkbox__inner{
						border-color: #D67121;
					}
				}
				#showRed{
					border-radius: 5px;
					background: #f08080;
					padding: 3px;
					color: #ffffff;
					/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
						color: #ffffff;
					}
					/deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
						background-color: #D67121;
						border-color: #D67121;
					}
					/deep/ .el-checkbox__inner :hover{
						border-color: #D67121;
					}
					/deep/ .el-checkbox__input.is-focus .el-checkbox__inner{
						border-color: #D67121;
					}
				}
				#showGray{
					border-radius: 5px;
					background: #dcdcdc;
					padding: 3px;
					color: #ffffff;
				}
	            .command{
	                text-align: right;
	                padding: 20px;
					.task_input{
						width: 200px;
					}
	            }
	        }
	        .placeTable{
	            margin-top: 40px;
	            p{
	                font-size: 12px;
	                color: #666;
	            }
				.bottom-pagnation{
					float: right;
					text-align: right;
					padding: 20px;
				}
	        }
	        .placeTableHistory{
	            margin-top: 40px;
	            p{
	                font-size: 12px;
	                color: #666;
	            }
	        }
			/* .el-checkbox__input.is-checked+.el-checkbox__label {
				color: #ffffff;
			}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
				background-color: #a5b4c4;
				border-color: #ffffff;
			} */
			.shei_div{
				padding: 15px;
				.shei_span{
					color: #434343;
					font-weight: 400;
					font-size: 15px;
				}
				.powerTask{
					padding: 10px;
					.tally{
						margin-left: 10px;
					}
				}
			}
			.shei_divs{
				padding: 10px;
				border: 1px solid #7574747a;
				border-radius: 5px;
				.shei_span{
					color: #434343;
					font-weight: 400;
					font-size: 15px;
				}
				.powerTask{
					padding: 15px;
					.tally{
						margin-left: 10px;
					}
					#showBlues{
						border-radius: 5px;
						background: #409eff;
						padding: 2px;
						color: #ffffff;
						margin-top: 5px;
						/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
							color: #ffffff;
						}
						/deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
							background-color: #D67121;
							border-color: #D67121;
						}
						/deep/ .el-checkbox__inner :hover{
							border-color: #D67121;
						}
						/deep/ .el-checkbox__input.is-focus .el-checkbox__inner{
							border-color: #D67121;
						}
					}
				}
				.shei_commands{
					width: 30%;
					margin-left: 35%;
					/* margin-top:10px; */
				}
			}
			.shei_command{
				width: 38%;
				margin-top: 20px;
				margin-left:70%;
			}
			.del{
				text-align: center;
				.del_span{
					color: #434343;
					font-weight: 500;
					font-size: 16px;
				}
			}
	    }
	}
</style>
