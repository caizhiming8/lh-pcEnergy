<template>
    <div id="deviceBuilding">
        <div class="deviceBuilding">
            <div>
                <span>查询方式</span>
                <el-select v-model="searchType" placeholder="请选择" clearable>
                    <el-option v-for="item in searchTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
				<div class="condition">
					<el-tag class="spanBlue" size="mini">设备开</el-tag>
					<el-tag class="spanRed" size="mini">设备关</el-tag>
					<el-tag class="spanGray" size="mini">设备不可用</el-tag>
				</div>

            </div>
            <div class="placeCollapse">
               <!-- <div class="placeButton">
                    <el-button @click="selectAll" type="primary" plain size="small">全选选中</el-button>
                    <el-button @click="cancelAll" type="success" plain size="small">全部取消</el-button>
                </div> -->
                <el-collapse accordion>
                    <el-collapse-item v-for="(data, k) in dataList" :key="k">
                        <template slot="title">
                            <div>
								<span class="choose"  @click.stop="messageCollapseChangeEvent(data)" v-if="on_off == 1">全选</span>
								<span class="cancel"  @click.stop="messageCollapseChangeEventCancle(data)" v-if="on_off == 2">取消</span>
                                <span class="span">第{{data.floor_name}}（点击展开）</span>
                            </div>
                        </template>
                        <div>
                            <el-checkbox id="showBlue" v-for="(item, index) in data.room_data" :key="index" @change="checkeds(item)" v-if="data.room_data && data.room_data.length && item.value == 1" v-model="item.isChecked">{{item.room_name}}</el-checkbox>
							<el-checkbox id="showRed" v-for="(item, index) in data.room_data" :key="index" @change="checkeds(item)" v-if="data.room_data && data.room_data.length && item.value == 0" v-model="item.isChecked">{{item.room_name}}</el-checkbox>
							<el-checkbox id="showGray" disabled v-for="(item, index) in data.room_data" :key="index" @change="checkeds(item)" v-if="data.room_data && data.room_data.length && item.available == 0" v-model="item.isChecked">{{item.room_name}}</el-checkbox>
						</div>
                    </el-collapse-item>
                </el-collapse>
                <div class="command">
                    <el-button type="primary" @click="commandOrder" size="small" class="Order">通 电</el-button>
					<el-button type="primary" @click="commandOcclude" size="small" class="Occlude">断 电</el-button>
                </div>
            </div>

            <div class="placeTable">
                <p>等待执行的下控的命令</p>
                <el-table :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
                    <el-table-column prop="building_id" label="建筑名称" width="120" align='center'></el-table-column>
                    <el-table-column prop="floor_id" label="楼层" align='center'></el-table-column>
                    <el-table-column prop="room_id" label="房间名称" sortable align='center' width="120"></el-table-column>
                    <el-table-column prop="device_type" label="设备类型" sortable align='center' width="120"></el-table-column>
                    <el-table-column prop="class_id" label="下控类别" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column prop="subclass_id" label="下控子类别" sortable align='center' width="150"></el-table-column>
                    <el-table-column prop="value" label="下控值" sortable align='center'></el-table-column>
                    <el-table-column prop="start_time" label="指令下发时间" :show-overflow-tooltip="true" sortable align='center' width="150"></el-table-column>
                    <el-table-column prop="operatorName" label="操作人" :show-overflow-tooltip="true" sortable align='center' width="150"></el-table-column>
                    <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" sortable align='center'></el-table-column>
                </el-table>
				<div class="bottom-pagnation">
				    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
            </div>

            <div class="placeTableHistory">
                <p>历史执行的下控指令</p>
                <el-table :data="tableDataHistory" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}" stripe>
                    <el-table-column type="index" label="序号" width="60" align='center'></el-table-column>
                    <el-table-column prop="building_id" label="建筑名称" width="120" align='center'></el-table-column>
                    <el-table-column prop="floor_id" label="楼层" align='center'></el-table-column>
                    <el-table-column prop="room_id" label="房间名称" sortable align='center' width="120"></el-table-column>
                    <el-table-column prop="device_type" label="设备类型" sortable align='center' width="120"></el-table-column>
                    <el-table-column prop="class_id" label="下控类别" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column prop="subclass_id" label="下控子类别" sortable align='center' width="150"></el-table-column>
                    <el-table-column prop="value" label="下控值" sortable align='center'></el-table-column>
                    <el-table-column prop="start_time" label="指令下发时间" :show-overflow-tooltip="true" sortable align='center' width="150"></el-table-column>
                    <el-table-column prop="end_time" label="指令完成时间" :show-overflow-tooltip="true" sortable align='center'></el-table-column>
                    <el-table-column prop="done" label="执行结果" sortable align='center'></el-table-column>
                    <el-table-column prop="operatorName" label="操作人" :show-overflow-tooltip="true" sortable align='center' width="150"></el-table-column>
                    <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align='center'></el-table-column>
                </el-table>
				<div class="bottom-pagnation">
				    <el-pagination background @current-change="handleCurrentChange1" :current-page.sync='currentPage1' :page-size='pageSize1' layout="total, prev, pager, next"  :total="pageTotal1"></el-pagination>
				</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tableData: [],
            tableDataHistory: [],
            searchTypeList: [],
            searchType: '',
            buildingList: [],
            building: '',
            device: [],
            dataList: [],
            item: {},
			value: '',
            backgroundData: []  ,// 给后台传的数组
			backData: '',
			arr: [],
			array: '',
			on_off: 1,
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			currentPage1: 1,
			pageSize1: 10,
			pageTotal1: 0
        }
    },
    methods: {
        // 查询方式下拉框
        searchTypes() {
            let data = {
                type: 1111
            };
            this.$axios.post(`BMPlatServers/electricity/qdbControlBase`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.searchTypeList = [];
        			if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.searchTypeList.push({label: item.name, value: item.control_id});
                        });
                        this.searchType = this.searchTypeList[0].value;
        				this.initdeviceData();
        				this.initTable1();
        				this.initTable2();
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

        // 获取楼层数据
        initdeviceData() {
            let data = {
                building_id: this.building,
                type: this.searchType
            };
            this.$axios.post(`BMPlatServers/electricity/querydevicecontrolist`, this.$qs.stringify(data)).then((res)=>{
                console.log(res)
				if(res.data.success) {
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((itemOut, index)=>{
                            if(itemOut.room_data && itemOut.room_data.length) {
                                itemOut.room_data.forEach((itemInner, i)=>{
                                    // 添加复选框判断标志
                                    itemInner.isChecked = false;
                                    // 把每个数据放到一个数组里面
                                    this.backgroundData.push(itemInner);
                                })
                            }
                        })
                    }
                    this.dataList = res.data.result;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },

        // 给后台传值
        commandOrder() {
			var array = JSON.stringify(this.arr)
			let data = {
				value: 1,
				type: this.searchType,
                arrList: array
			}
			this.$axios.post(`BMPlatServers/electricity/econtrolforbuild`, this.$qs.stringify(data)).then((res)=>{
			    // console.log(res);
			    if(res.data.success) {
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					});
					this.initdeviceData();
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
			    }
			})
        },
		commandOcclude() {
			var array = JSON.stringify(this.arr)
			let data = {
                value: 0,
				type: this.searchType,
                arrList: array
			}
			this.$axios.post(`BMPlatServers/electricity/econtrolforbuild`, this.$qs.stringify(data)).then((res)=>{
			    // console.log(res);
			    if(res.data.success) {
					this.$message.warning({
						message: res.data.result,
                        showClose: true,
                        duration: 1000,
					});
					this.initdeviceData();
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
			    }
			})
		},

        // 复选框的选项
        checkeds(i) {
            this.arr = [];
            this.backgroundData.forEach((items, index)=>{
                if(items.isChecked) {
                    this.arr.push(items);
                }
            });
        },

        search() {
			this.on_off = 1;
            this.initdeviceData();
			this.initTable1();
			this.initTable2();
        },

        // 全部选中
        selectAll() {
            this.dataList.forEach((itemOut, index)=>{
                if(itemOut.room_data && itemOut.room_data.length) {
                    itemOut.room_data.forEach((itemInner, i)=>{
                        itemInner.isChecked = true;
                    })
                }
            })
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
        },

        messageCollapseChangeEvent(item) {
			this.on_off = 2;
            item.room_data.forEach((i, index)=>{
                i.isChecked = true;
            })
        },
        messageCollapseChangeEventCancle(item) {
			this.on_off = 1;
            item.room_data.forEach((i, index)=>{
                i.isChecked = false;
            })
        },

        initTable1() {
			let data = {
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				building_id: this.building,
				type: this.searchType
			}
            this.$axios.post(`BMPlatServers/electricity/qdbcontrolrealtime`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.control_infos;
					this.pageTotal = res.data.result.count;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },
        initTable2() {
			let data = {
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				building_id: this.building,
				type: this.searchType
			}
            this.$axios.post(`BMPlatServers/electricity/qdbcontrolhistory`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
					this.tableDataHistory = [];
                    this.tableDataHistory = res.data.result.control_infos;
					this.pageTotal1 = res.data.result.count;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },
		/* 分页 */
		handleCurrentChange(){
			this.initTable1()
		},
		/* 分页 */
		handleCurrentChange1(){
			this.initTable2()
		}
    },
    mounted() {
		this.on_off = 1;
		this.building = window.location.href.split('=')[1];
        this.searchTypes();
        /* this.initTable1();
        this.initTable2();
        setTimeout(()=>{
            this.initdeviceData();
        }, 300); */
    },
    watch: {
        $route(to,from) {
            this.building = to.fullPath.split('=')[1];
        },
        tableData(item) {
            item.forEach((items)=>{
                items.device_type == 1 ? items.device_type = '采集器' : null;
                items.device_type == 2 ? items.device_type = '物联终端' : null;
            })
        },
        tableDataHistory(item) {
            item.forEach((items)=>{
                items.done == '0' ? items.done = '失败': null;
                items.done == '1' ? items.done = '成功': null;
            })
        },
        device(item) {
            console.log(item);
        }
    }
}
</script>

<style lang="scss" scoped>
#deviceBuilding{
    .deviceBuilding{
		.equipmentState{
			/* margin-right: 30px; */
		}
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
				background: #c5c5c5;
				color: #ffffff;
				border: none;
			}
		}
        .placeCollapse{
            margin-top: 30px;
            .placeButton{
                margin-bottom: 30px;
            }
			.span{
				margin-left: 20px;
				font-szie: 15px;
			}
			.choose{
				color: #409eff;
			}
			.cancel{
				color: #434343;
			}
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
				background: #c5c5c5;
				padding: 3px;
				color: #ffffff;
			}
            .command{
				text-align: right;
                padding: 20px;
				.Order{
					width: 80px;
					margin-right: 20px;
					border-radius: 5px;
				}
				.Occlude{
					width: 80px;
					margin-left: 20px;
					background: #ff4d4d;
					border: #ff4d4d;
					border-radius: 5px;
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
			.bottom-pagnation{
				float: right;
				text-align: right;
				padding: 20px;
			}
        }
		.el-checkbox__input.is-checked+.el-checkbox__label {
			color: #ffffff;
		}
		.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
			background-color: #a5b4c4;
			border-color: #ffffff;
		}
    }
}
</style>
