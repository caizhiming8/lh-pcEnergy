<template>
    <div id="addRepairs">
        <div class="addRepairs">
            <div class="placeBreadcrumb">
                <div class="BreadcrumbBox">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item><a @click="goback">报修管理</a></el-breadcrumb-item>
                        <el-breadcrumb-item>新增报修</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>

            <el-form label-width="100px"  class="repair-ruleForm">
                <el-form-item label="区域" :required="true">
                    <el-select v-model="area" placeholder="请选择">
                        <el-option v-for="item in areaList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="地点" :required="true">
                    <el-select v-model="room" placeholder="请选择" @focus="focusRoom" v-if="isSelect">
                        <el-option v-for="item in roomList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                    <el-input v-model="roomInput" placeholder="请选择" style="width: 216px;" v-if="!isSelect" v-focus></el-input>
                </el-form-item>

                <el-form-item label="类型" :required="true">
                    <el-select v-model="types" placeholder="请选择">
                        <el-option v-for="item in typesList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="维修项目" :required="true">
                    <el-select v-model="project" placeholder="请选择" @focus="focusProject">
                        <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="设备名称" v-if="isShowDevice">
                    <el-select v-model="device" placeholder="请选择">
                        <el-option v-for="item in deviceList" :key="item.deviceId" :label="item.name" :value="item.deviceId"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="报修原因" v-if="isShowDevice">
                    <el-select v-model="repairReason" placeholder="请选择">
                        <el-option v-for="item in repairReasonList" :key="item.reasonId" :label="item.reasonName" :value="item.reasonId"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="联系方式" :required="true">
                    <el-input v-model="connection" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="上传图片">
                    <div class="uploads">
                        <el-upload class="upload-demo" action="" :before-upload="beforeupload" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove"
                                    :multiple="true" :file-list="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
                        </el-upload>
                    </div>
                    <p class="placeImg" v-if="isShowImg">
                        <img :src="urls" class="imgs">
                        <img src="../../../../../static/img/1567756113(1).jpg" class="close" @click="deleteImg">
                    </p>

                </el-form-item>

                <el-form-item label="详细描述">
                    <el-input type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="context"  maxlength="100" clearable show-word-limit></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="small">提交</el-button>
                    <el-button @click="clear" size="small">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            areaList: [],
            roomList: [],
            typesList: [],
            projectList: [],
            deviceList: [],
            device: '',
            project: '',
            types: '',
            room: '',
            area: '',
            connection: '',
            context: '',
            buildingId: '',
            typeId: '',
            isShowDevice: false,
            ids: '',

            fileList: [],
            urls: '',
            filename: '',
            nums: 1,
            isShowImg: false,
            repairReasonList: [],
            repairReason: '',
            isSelect: true,
            roomInput: ''
        }
    },
    methods: {
        goback() {
            this.$router.push('/processReapir');
            let data = {
                filename: this.filename
            };
            this.$axios.post('BMPlatServers/repair/deletePicture', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
            })
        },
        // 区域列表
        arealist() {
            this.$axios.post('BMPlatServers/repair/queryBuildings').then((res)=>{
                if(res.data.success) {
                    this.areaList = res.data.result.list;
                }
            })
        },

        // 房间获取焦点
        focusRoom() {
            if(!this.area) {
                this.$message.warning({
                    message: '请先选择区域',
                    showClose: true,
                    duration: 1000
                })
            }
        },

        focusProject() {
            if(!this.types) {
                this.$message.warning({
                    message: '请先选择类型',
                    showClose: true,
                    duration: 1000
                })
            }
        },

        // 地点列表
        roomlist() {
            let data = {
                buildingId: this.buildingId
            };
            this.$axios.post('BMPlatServers/repair/queryRooms', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.roomList = [];
                    this.roomList = res.data.result.list;
                    this.roomList.push({buildingId: -1, floorId: -1, id: -1, label: '手动输入'});
                }
            })
        },

        // 类型列表
        typelist() {
            this.$axios.post('BMPlatServers/repair/queryRepairType').then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.typesList = res.data.result.list;
                }
            })
        },

        // 维修项目
        projectlist() {
            let data = {
                typeId: this.typeId
            };
            this.$axios.post('BMPlatServers/repair/queryRepairProject', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.projectList = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.projectList.push({label: item.label, value: `${item.value},${item.flag},${item.deviceType}`});
                        })
                        // console.log(this.projectList);
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
                console.log(res);
                if(res.data.success) {
                    this.deviceList = res.data.result.list
                }
            })
        },

        // 报修原因
        repairReasons() {
            this.$axios.post('BMPlatServers/device/findreasontype').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.repairReasonList = res.data.result.reasonList
                }
            })
        },

        onSubmit() {
			if(this.area==''){
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
                placeId: this.room == -1 ? this.roomInput : this.room.split(",")[1],
                type: this.types,
                project: this.ids,
                details: this.context,
                commitPersonPhone: this.connection,
                commitPerson: 1,
                deviceId: this.device,
                repairImg: this.urls,
                reasonType: this.repairReason
            };
            this.$axios.post('BMPlatServers/repair/addRepairItem', this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.$message.success({
                        message: '增加成功',
                        showClose: true,
                        duration: 1000
                    })
                    this.$router.push('/processReapir');
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        clear() {
            this.area = '';
            this.room = '';
            this.types = '';
            this.project = '';
            this.connection = '';
            this.context = '';
        },

        // 上传按钮
        beforeupload (file) {
            var _this = this;
            var repeatFile = false;
            this.fileList.forEach((item, index) => {
                console.log(item);
                if(item.title == file.name){
                    repeatFile = true;
                }
            })
            if(repeatFile === true) {
                this.$message.error({
                    message: '该文件已经上传',
                    showClose: true,
                    duration: 1000
                })
                return false;
            }
            const isJPG = file.name.split('.')[1] === 'jpg' || file.name.split('.')[1] === 'png';
             if (!isJPG) {
                    this.fileList = [];
                    this.$message.error({
                        message: '上传的文件只能是png/jpg格式的图片',
                        showClose: true,
                        duration: 1000
                    })
                    return false;
                }else{
                    // if(this.nums == 1) {
                    // }else{
                    //     this.$message.warning({
					// 		message: '只能上传一张图片',
					// 		showClose: true,
                    //         duration: 1000
					// 	})
                    //     return false;
                    // }
                    this.nums += 1;
                    var timer = '';
                    let fileFormData = new FormData();
                    fileFormData.append('file', file);
                    //设置progress参数
                    //this.objAddItem(this.tempArr, file);
                    this.$axios({
                        method: 'post',
                        url: `http://47.93.46.81:8086/BMPlatServers/repair/uploadPicture`,
                        data: fileFormData,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then((res) => {
                        if(res.data.success) {
                            this.$message.success({
    							message: '图片上传成功',
    							showClose: true,
                                duration: 1000
    						})
                            this.isShowImg = true;
                            this.urls = '';
                            this.urls = res.data.result.filepath;
                            this.filename = res.data.result.filename;
                        }
                    })
                }
                return false;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            beforeRemove(file, fileList) {
                // return this.$confirm(`确定移除 ${ file.name }？`);
            },
            // 删除图片
            deleteImg() {
                let data = {
                    filename: this.filename
                };
                this.$axios.post('http://47.93.46.81:8086/BMPlatServers/repair/deletePicture', this.$qs.stringify(data)).then((res)=>{
                    if(res.data.success) {
                        this.$message.success({
                            message: '删除成功',
                            showClose: true,
                            duration: 1000
                        })
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
                this.isShowImg = false;
            }
    },
    mounted() {
        this.arealist();
        this.typelist();
        this.repairReasons();
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.querySelector('.el-input__inner').focus()
            }
        }
    },
    watch: {
        room(oldData) {
            if(oldData == -1) {   // 手动录入模式
                this.isSelect = false;
                this.roomInput = '';
            }else{  // 选择模式
                this.isSelect = true;
            }
        },
        area(item) {
            this.buildingId = item;
            this.room = '';
            this.roomlist();
        },
        types(item) {
            this.typeId = item;
            this.project = '';
            this.device = '';
            this.projectlist();
        },
        connection(item) {
            this.connection = this.connection.replace(/[^0-9.]+/g, '');
        },
        project(item) {
            this.ids = item.split(',')[0];
            if(item.split(',')[1] == "1") {
                this.isShowDevice = true;
                this.devicelist(item.split(',')[2]);
            }else{
                this.isShowDevice = false;
            }
            this.device = '';
            // this.project = item.split(',')[0];
        }
    }
}
</script>

<style lang="scss" scoped>
#addRepairs{
    padding: 20px 0;
    .addRepairs{
        width: 98%;
        margin: 0 auto;
        box-shadow: 0 0 6px #ddd;
        -webkit-box-shadow: 0 0 6px #ddd;
        -ms-box-shadow: 0 0 6px #ddd;
        -moz-box-shadow: 0 0 6px #ddd;
        -o-box-shadow: 0 0 6px #ddd;
        .placeBreadcrumb{
            border-bottom: 2px solid #ddd;
            .BreadcrumbBox{
                padding: 20px;
                /deep/ .el-breadcrumb__inner.is-link, .el-breadcrumb__inner a{
                    color: #606266;
                    font-weight: normal;
                }
                /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover{
                    color: #409eff;
                }
            }
        }
        .repair-ruleForm{
            width: 800px;
            padding: 20px;

            /deep/ .el-textarea__inner{
                color: #606266;
                font-family: 'Microsoft YaHei';
            }
            .uploads{
                display: inline-block;
            }
            .placeImg{
                display: inline-block;
                position: relative;
                .imgs{
                    display: block;
                    width: 200px;
                    margin-left: 20px;
                }

                .close{
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    top: 4px;
                    right: 4px;
                    display: none;
                    cursor: pointer;
                }
            }
            .placeImg:hover .close{
                display: block;
            }
        }
    }
}
</style>
