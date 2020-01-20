<template>
    <div id="manualEntry">
        <div class="manualEntry">
            <div class="btn">
                <el-button type="primary" size="small" @click="manualEntry" v-hasMenu="1-6-1">人工录入<i class="el-icon-upload el-icon--left"></i></el-button>
                <div class="uploads">
                    <el-upload class="upload-demo" action="actions" :show-file-list="false" :before-upload="beforeupload" :multiple="false" :limit="1">
                        <el-button v-hasMenu="1-6-2" size="small" type="success">导入<i class="el-icon-upload2 el-icon--left"></i></el-button>
                    </el-upload>
                </div>
                <el-button type="warning" size="small" v-hasMenu="1-6-3" @click="download">导出<i class="el-icon-download el-icon--left"></i></el-button>
            </div>
            <div v-if="isShowProgress">
                <el-progress :percentage="percentage"></el-progress>
            </div>
            <el-table tooltip-effect="light" :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
                <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
                    <template slot-scope="scope">
                        <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="name" label="楼宇名称" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="room_name" label="房间名称" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="className" label="电能分类" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="subclassName" label="电能子分类" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="consum" label="回路用电量" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="time_year" label="录入时间-年" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="time_month" label="录入时间-月" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="time_day" label="录入时间-日" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="entry_time" label="时间" align='center'></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size='pageSize'  layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
            </div>

            <el-dialog title="人工录入" :visible.sync="dialogVisible" width="60%">
                <div class="choiceType">
                    <span>选择房间</span>
                    <el-select v-model="roomType" placeholder="请选择">
                        <el-option v-for="item in roomTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span>选择电能</span>
                    <el-select v-model="powerType" placeholder="请选择">
                        <el-option v-for="item in powerTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span>选择时间</span>
                    <el-select v-model="timeType" placeholder="请选择">
                        <el-option v-for="item in timeTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>

                <div class="placeForm">
                    <el-form label-width="100px" class="demo-ruleForm">
                        <el-form-item label="录入楼宇">
                            <el-select v-model="building" placeholder="请选择" :disabled="disabeld && buildingDisabled && roomDisabled && floorDisabled">
                                <el-option v-for="item in buildingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="录入楼层">
                            <el-select v-model="floor" placeholder="请选择" :disabled="disabeld && buildingDisabled && roomDisabled">
                                <el-option v-for="item in floorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="录入房间">
                            <el-select v-model="room" placeholder="请选择" :disabled="disabeld && roomDisabled">
                                <el-option v-for="item in roomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="电能分类">
                            <el-select v-model="power" placeholder="请选择" :disabled="disabeld && powerDisabled && powerSonDisabled">
                                <el-option v-for="item in powerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="电能子分类">
                            <el-select v-model="powerSon" placeholder="请选择" :disabled="disabeld && powerSonDisabled">
                                <el-option v-for="item in powerSonList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="按年录入" v-if="Type==1">
                            <el-date-picker v-model="time" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="按月录入" v-if="Type==2">
                            <el-date-picker v-model="time" type="month" value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="按日录入" v-if="Type==3">
                            <el-date-picker v-model="time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="回路用电量">
                            <el-input v-model="count"></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="makeSure" size="small">确 定</el-button>
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
            loading: true,
            val: 1,
            pageSize: 10,
            currentPage: 1,
            pageTotal: 0,
            dialogVisible: false,
            roomType: '',
            floorId: '',
            floorList: [],
            floor: '',
            roomTypeList: [{label: '按全校录入', value: 1}, {label: '按楼宇录入', value: 2}, {label: '按房间录入', value: 3}],
            powerTypeList: [{label: '按电能分类录入', value: 1}, {label: '按电能子分类录入', value: 2}],
            powerType: '',
            timeTypeList: [{label: '按年录入', value: 1}, {label: '按月录入', value: 2}, {label: '按日录入', value: 3}],
            timeType: '',
            building: '',
            buildingList: [],
            roomList: [],
            powerList: [{label: '照明插座用电', value: 1}, {label: '空调用电', value: 2}, {label: '动力用电', value: 3}, {label: '特殊用电', value: 4}],
            powerSonList: [],
            powerSon: '',
            power: '',
            room: '',
            count: '',
            year: '',
            month: '',
            day: '',
            Type: 0,
            disabeld: true,
            buildingDisabled: true,
            floorDisabled: true,
            roomDisabled: true,
            powerSonDisabled: true,
            powerDisabled: true,
            time: '',
            percentage: 0,
            isShowProgress: false
        }
    },
    methods: {
        // table表格初始化数据
        initTableData() {
            let data = {
                currentPage: 1,
                pageSize: this.pageSize,
                system_id: 1
            };
            this.$axios.post(`BMPlatServers/electricity/findhisenterinfo`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.hisEnterInfoList;
                    this.pageTotal = res.data.result.count;
                    this.loading = false;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        // 分页
        handleCurrentChange(val) {
            this.val = val;
            this.loading = true;
            let data = {
                currentPage: val,
                pageSize: this.pageSize,
                system_id: 1
            };
            this.$axios.post(`BMPlatServers/electricity/findhisenterinfo`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.hisEnterInfoList;
                    this.pageTotal = res.data.result.count;
                    this.loading = false;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        // 楼宇列表
        buildingLists() {
            this.$axios.post(`BMPlatServers/common/queryBuildings`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.buildingList = [];
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.buildingList.push({label: item.name, value: item.Id});
                        })
                    }
                }else{
                    this.buildingList = [];
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        // 楼层列表
        floorLists() {
            let data = {
                building_id: this.building
            };
            this.$axios.post(`BMPlatServers/common/queryfloors`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.floorList = [];
                    if(res.data.result.floorInfo && res.data.result.floorInfo.length) {
                        res.data.result.floorInfo.forEach((item)=>{
                            this.floorList.push({label: item.floor_name, value: item.floor_id});
                        })
                    }
                }else{
                    this.floorList = [];
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        // 房间列表
        roomLists() {
            let data = {
                building_id: this.building,
                floor_id: this.floor
            };
            this.$axios.post(`BMPlatServers/common/queryfrooms`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.roomList = [];
                    if(res.data.result.roomsInfo && res.data.result.roomsInfo.length) {
                        res.data.result.roomsInfo.forEach((item)=>{
                            this.roomList.push({label: item.room_name, value: item.room_id});
                        });
                    }
                }else{
                    this.roomList = [];
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        // 电能子分类
        powerSons() {
            let data = {
                class_id: this.power,
                system_id: 1
            };
            this.$axios.post(`BMPlatServers/electricity/findsubclassinfo`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.powerSonList = [];
                    if(res.data.result.SubClassInfo && res.data.result.SubClassInfo.length) {
                        res.data.result.SubClassInfo.forEach((item)=>{
                            this.powerSonList.push({label: item.name, value: item.id});
                        })
                    }
                }else{
                    this.powerSonList = [];
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        // 人工录入模态框
        manualEntry() {
            this.dialogVisible = true;
            this.roomType = '';
            this.powerType = '';
            this.timeType = '';
            this.building = '';
            this.room = '';
            this.power = '';
            this.powerSon = '';
            this.year = '';
            this.month = '';
            this.day = '';
            this.count = '';
            this.floor = '';
            this.time = '';
        },

        // 模态框确认按钮
        makeSure() {
            let data = {
                building_id: this.building,
                floor_id: this.floor,
                room_id: this.room,
                class_id: this.power,
                subclass_id: this.powerSon,
                year: this.year,
                month: this.month,
                day: this.day,
                consum: this.count,
                queryFlag: this.roomType,
                timeFlag: this.timeType,
                system_id: 1
            };
            this.$axios.post(`BMPlatServers/electricity/insertHistory`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.loading = true
                    this.$message.success({
                        message: '录入成功',
						showClose: true,
						duration: 1000,
                    });
                    this.initTableData();
                    this.val = 1;
                    this.currentPage = 1;
                    this.dialogVisible = false;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        // 上传
        beforeupload(file) {
            if(file.name.split('.')[1] != 'xlsx') {
                this.$message.warning({
                        message: '只能上传xlsx文件',
                        showClose: true
                    });
                return false;
            };
            let fileFormData = new FormData();
            fileFormData.append('file', file);
            this.$axios({
                method: 'post',
                url: `BMPlatServers/common/exportExcel`,
                data: fileFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((res) => {
                this.isShowProgress = true;
                if(res.data.success) {
                    let timer = setInterval(()=>{
                        if(this.percentage >= 100) {
                            clearInterval(timer);
                            this.$message.success({
							message: '文件上传成功',
							showClose: true,
							duration: 1000,
						});
                            this.isShowProgress = false;
                        }else{
                            this.percentage = this.percentage + 2;
                        }
                    }, 100);
                }else{
                    this.isShowProgress = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },

        // 下载
        download() {
            window.location.href = `BMPlatServers/common/downloadExcel?time=1&flag=1`;
        }
    },
    mounted() {
        this.initTableData();
    },
    watch: {
        roomType(item) {
            this.buildingLists();
            if(item == 2) {
                this.floorDisabled = false;
                this.roomDisabled = true;
                this.floor = '';
                this.room = '';
            }else if(item == 3) {
                this.roomDisabled = false;
            }else if(item == 1) {
                this.floorDisabled = true;
                this.buildingDisabled = true;
                this.roomDisabled = true;
                this.building = '';
                this.floor = '';
                this.room = '';
            }
        },
        // 楼宇
        building() {
            this.floorLists();
        },
        // 楼层
        floor() {
            this.roomLists();
        },
        // 电能分类
        power() {
            this.powerSons();
        },
        powerType(item) {
            if(item == 1) {
                this.powerDisabled = false;
                this.powerSonDisabled = true;
                this.powerSon = '';
            }else if(item == 2) {
                this.powerSonDisabled = false;
            }
        },
        timeType(item) {
            if(item == 1) {
                this.Type = 1;
            }else if(item == 2) {
                this.Type = 2;
            }else if(item == 3) {
                this.Type = 3;
            }
        },
        time(item) {
            if(item) {
                this.year = item.split('-')[0];
                this.month = item.split('-')[1];
                this.day = item.split('-')[2];
            }else{
                this.year= '';
                this.month= '';
                this.day= '';
            }
        },
        count() {
            this.count = (''+this.count).replace(/[^\d.]/g, '').replace(/\.{2,}/g, '');
        }
    }
}
</script>

<style lang="scss">
#manualEntry{
    padding: 15px;
    .manualEntry{
        box-shadow: 0 0 6px #ddd;
        padding: 10px;
        .btn{
            padding: 20px;
            .uploads{
                display: inline-block;
                margin: 0 20px;
            }
        }
        .pagination{
            text-align: right;
            margin: 15px;
        }
        .choiceType{

        }
        .placeForm{
            margin-top: 40px;
            box-shadow: 0 0 6px #ddd;
            padding: 15px;
            padding-right: 40px;

        }
    }
    .el-dialog__header{
        border-bottom: 1px solid #ddd !important;
    }
}
</style>
