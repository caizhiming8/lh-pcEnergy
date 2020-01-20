<template>
    <div id="implementEquipmentInspection">
        <div class="implementEquipmentInspection">
            <div class="breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/equipmentInspection' }">设备巡检</el-breadcrumb-item>
                    <el-breadcrumb-item>执行</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="计划名称" label-width="100px">
                            <el-input v-model="projectName" disabled class="input"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="巡检人" label-width="100px">
                            <el-input v-model="people" disabled class="input"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="巡检结果" label-width="100px">
                    <el-input type="textarea" class="area" v-model="state" maxlength="200" show-word-limit></el-input>
                </el-form-item>
            </el-form>
			<!-- <el-button @click="full()">全选</el-button> -->
            <el-table :data="tableDataList" style="width: 100%" tooltip-effect="dark" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', padding: '15px 0'}">
                <el-table-column :show-overflow-tooltip="true" prop="code" label="设备编码" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="type_name" label="设备类型" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="name" label="设备名称" align='center'></el-table-column>
                <el-table-column label="操作方式" align='center' width="300">
                    <template slot-scope="scope">
                        <el-radio label="1" v-model="scope.row.checked">正常</el-radio>
                        <el-radio label="2" v-model="scope.row.checked">故障</el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="报修" align="center">
                    <template slot-scope="scope">
                        <el-button style="margin-left: 10px;" size="mini" v-if="scope.row.checked == 2" @click="repair(scope.row)">报修</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="btn">
                <el-button size="mini" @click="cancel">取 消</el-button>
                <el-button type="primary" @click="sures" size="mini">确 定</el-button>
            </div>
        </div>

        <el-dialog title="报修面板" :visible.sync="dialogVisible" width="30%">
            <div class="bodys">
                <el-form label-width="100px"  class="repair-ruleForm">
                    <el-form-item label="区域" :required="true">
                        <el-cascader v-model="areaStyle" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange"></el-cascader>
                    </el-form-item>

                    <el-form-item label="类型" :required="true">
                        <el-select v-model="types" placeholder="请选择">
                            <el-option v-for="item in typesList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="维修项目" :required="true">
                        <el-select v-model="project" placeholder="请选择">
                            <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备名称" v-if="flag==1">
                        <el-select v-model="device" placeholder="请选择">
                            <el-option v-for="item in deviceList" :key="item.deviceId" :label="item.name" :value="item.deviceId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报修原因" :required="true">
                        <el-select v-model="repairReason" placeholder="请选择">
                            <el-option v-for="item in repairReasonList" :key="item.reasonId" :label="item.reasonName" :value="item.reasonId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系方式" :required="true">
                        <el-input v-model="connection"></el-input>
                    </el-form-item>
                    <el-form-item label="详细描述">
                        <el-input type="textarea" style="width: 100%" placeholder="请输入内容" v-model="context"  maxlength="100" clearable show-word-limit></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="makeSure" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return{
            projectName: '',
            people: '',
            state: '',
            tableDataList: [],
            row: {},
            dialogVisible: false,
            areaStyle: [],
            options: [],
            repairReasonList: [],
            repairReason: '',
            types: '',
            typesList: [],
            project: '',
            projectList: [],
            device: '',
            deviceList: [],
            connection: '',
            context: '',
            flag: 0,
            area: '',
            room: '',
            ids: '',
			code: '',
			xuanze: true
        }
    },
    methods: {
        initData() {
            this.projectName = this.row.planName
			this.people = this.row.username
			let data = {
				id: this.row.id
			}
			this.$axios.post(`BMPlatServers/device/getexamdevice`, this.$qs.stringify(data)).then((res) => {
				console.log(res)
				if(res.data.success){
					res.data.result.infoList.forEach((item,index)=>{
						item.checked = '1';
					})
					this.tableDataList = res.data.result.infoList
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
        },
        repair(row) {
            this.dialogVisible = true;
            // 模态框请求数据
            this.modelKuang(row);
            this.typelist();
            this.repairReasons();
        },
        // 全部正常点击的确定按钮
        sures() {
            let num = 0;
            let Length = 0;
            if(this.tableDataList && this.tableDataList.length) {
                Length = this.tableDataList.length;
                this.tableDataList.forEach((item)=>{
                    if(item.checked != '') {
                        num += 1;
                    }
                })
            }
            if(num == Length) {
				var typeList1 = JSON.stringify(this.tableDataList)
				let data = {
					result: this.state,
					id: this.row.id,
					code: this.row.code,
					deviceList: typeList1
				}
				console.log(this.tableDataList)
				console.log(data)
				this.$axios.post(`BMPlatServers/device/doexam`, this.$qs.stringify(data)).then((res) => {
					console.log(res)
					if(res.data.success){
						this.$message.warning({
							message: res.data.result,
				            showClose: true,
				            duration: 1000,
						})
						/* this.$message.success({
						    message: '巡检已完成',
						    showClose: true,
						    duration: 1000
						}) */
						this.$router.push('/equipmentInspection');
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
                    message: '还存在未巡检的设备',
                    showClose: true,
                    duration: 1000
                })
            }
        },
		cancel(){
			this.$router.push('/equipmentInspection');
		},
        modelKuang(item) {
            // 模态框的区域级联框的下拉
            this.$axios.post(`BMPlatServers/repair/queryBuildingRoom`).then((res) => {
				// console.log(res)
				if(res.data.success){
                    this.options = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((outItem)=>{
                            outItem.value = outItem.buildingId;
                            outItem.children = outItem.roomlist;
                            if(outItem.roomlist && outItem.roomlist.length) {
                                outItem.roomlist.forEach((innerItem)=>{
                                    innerItem.value = `${innerItem.buildingId},${innerItem.floorId},${innerItem.id}`;
                                })
                            }
                        })
                        this.options = res.data.result.list;
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
        // 类型，维修项目，设备名称列表
        // 类型列表
        typelist() {
            this.$axios.post('BMPlatServers/repair/queryRepairType').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.typesList = res.data.result.list;
                }
            })
        },
        // 维修项目
        projectlist(item) {
            let data = {
                typeId: item
            };
            this.$axios.post('BMPlatServers/repair/queryRepairProject', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.projectList = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.projectList.push({label: item.label, value: `${item.value},${item.flag},${item.deviceType}`});
                        })
                    }else{
                        this.projectList = [];
                    }
                }
            })
        },
        // 设备列表
        devicelist(deviceid) {
            let data = {
                deviceType: deviceid
            };
            this.$axios.post('BMPlatServers/repair/queryDeviceList', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.deviceList = res.data.result.list
                }
            })
        },
        // 报修原因
        repairReasons() {
            this.$axios.post('BMPlatServers/device/findreasontype').then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.repairReasonList = res.data.result.reasonList
                }
            })
        },
        // 模态框提交按钮
        makeSure() {
			if(this.areaStyle==''){
				this.$notify({
				    title: '警告',
				    message: '请选择区域',
				    type: 'warning',
				    duration: '2000'
				});
				return;
			}
			if(this.types==''){
				this.$notify({
				    title: '警告',
				    message: '请选择类型',
				    type: 'warning',
				    duration: '2000'
				});
				return;
			}
			if(this.ids==''){
				this.$notify({
				    title: '警告',
				    message: '请选择项目',
				    type: 'warning',
				    duration: '2000'
				});
				return;
			}
            if(this.repairReason==''){
				this.$notify({
				    title: '警告',
				    message: '请选择报修原因',
				    type: 'warning',
				    duration: '2000'
				});
				return;
			}
			if(this.connection==''){
				this.$notify({
				    title: '警告',
				    message: '请填写电话号码',
				    type: 'warning',
				    duration: '2000'
				});
				return;
			}
            let data = {
                areaId: this.area,
                placeId: this.room,
                type: this.types,
                project: this.ids,
                details: this.context,
                commitPersonPhone: this.connection,
                commitPerson: 1,
                deviceId: this.device,
                reasonType: this.repairReason
            };
            this.$axios.post('BMPlatServers/repair/addRepairItem', this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.$message.success({
                        message: '增加成功',
                        showClose: true,
                        duration: 1000
                    })
                    this.dialogVisible = false;
                    /* this.$router.push('/equipmentInspection'); */
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        handleChange() {

        }
    },
    mounted() {
        this.row = this.$route.query.row;
		console.log(this.row)
        this.initData();
    },
    watch: {
        areaStyle(oldItem) {
            this.area = oldItem[1].split(',')[0]
            this.room = oldItem[1].split(',')[2]
        },
        types(oldData) {
            this.project = '';
            this.device = '';
            this.projectlist(oldData);
        },
        project(oldData) {
            this.ids = oldData.split(',')[0];
            this.device = '';
            let str = '';
            if(oldData) {
                str = oldData.split(',')[2];
                this.flag = oldData.split(',')[1];
            }
            this.devicelist(str);
        },
        connection(oldData) {
            this.connection = (''+this.connection).replace(/\D/g, '');
        }
    }
}
</script>

<style lang="scss" scoped>
#implementEquipmentInspection{
    padding: 15px;
    .implementEquipmentInspection{
        -webkit-box-shadow: 0 0 6px #ddd;
        -moz-box-shadow: 0 0 6px #ddd;
        box-shadow: 0 0 6px #ddd;
        padding: 30px 0px 20px;
        .breadcrumb{
            padding: 0 0 25px 15px;
            border-bottom: 3px solid #ddd;
            /deep/ .el-breadcrumb__inner.is-link, .el-breadcrumb__inner a{
                color: #606266;
                font-weight: normal;
            }
            /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover{
                color: #409eff;
            }
        }
        .el-form{
            margin-top: 40px;
            .input{
                width: 100%;
            }
            .area{
                width: 46.5%;
            }
        }
        .el-table{
            margin-top: 40px;
        }
        .btn{
            text-align: right;
            margin: 20px 10px 0 0;
        }
    }
}
</style>
