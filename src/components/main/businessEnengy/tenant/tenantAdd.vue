<template>
    <div id="tenantAdd">
        <div class="tenantAdd">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/tenantReal' }">当前商户</el-breadcrumb-item>
                <el-breadcrumb-item>新增</el-breadcrumb-item>
            </el-breadcrumb>

            <div class="placeForm">
                <el-form label-width="100px">
                    <el-form-item label="商户名称" :required="true" v-if="mark==1">
                        <el-input v-model="tenantName" class="short"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" :required="true" v-if="mark==1">
                        <el-input v-model="tenantPerson" class="short"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" :required="true" v-if="mark==1">
                        <el-input v-model="tenantPhone" class="long" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="表类型" :required="true" v-if="mark==2">
                        <el-select v-model="tenantType" placeholder="请选择" class="middle" clearable filterable>
                            <el-option v-for="(item, index) in tenantTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="表名称" :required="true" v-if="mark==2">
                        <el-select v-model="tenantNumber" placeholder="请选择" class="middle" clearable filterable>
                            <el-option v-for="(item, index) in tenantNumberList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价格" :required="true" v-if="mark==2">
                        <el-input v-model="tenantMoney" class="short"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" size="small" @click="submit">提交</el-button>
                        <el-button type="primary" size="small" @click="goBack">返回</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tenantName: '',
            tenantPerson: '',
            tenantPhone: '',
            buildingId: '',
            floorId: '',
            roomId: '',
            ammeterId: '',
            mark: 0,
            tenantTypeList: [{label: '水表', value: 1}, {label: '电表', value: 2}],
            tenantType: '',
            tenantNumberList: [],
            tenantNumber: '',
            tenantMoney: '',
            buildingId: '',
            floorId: '',
            roomId: '',
            meterId: '',
            classId: '',
            subClassId: '',
            userId: 0
        }
    },
    methods:{
        submit() {
            if(this.mark == 1) {
                if(!this.tenantName) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请填写商户名称',
                        duration: 2000
                    });
                    return false;
                }
                if(!this.tenantPerson) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请填写负责人',
                        duration: 2000
                    });
                    return false;
                }
                if(!this.tenantPhone) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请填写联系方式',
                        duration: 2000
                    });
                    return false;
                }
            }

            if(this.mark == 2) {
                if(!this.tenantType) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择表类型',
                        duration: 2000
                    });
                    return false;
                }
                if(!this.tenantNumber) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择表号',
                        duration: 2000
                    });
                    return false;
                }
                if(!this.tenantMoney) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请填写价格',
                        duration: 2000
                    });
                    return false;
                }
            }
            if(this.mark == 1) {
                let data = {
                    userName: this.tenantName,
                    owner: this.tenantPerson,
                    phone: this.tenantPhone
                };
                this.$axios.post('BMPlatServers/commercial/addUser', this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
							message: '成功',
							showClose: true,
                            duration: 1000
						})
                        this.$router.push('/tenantReal');
                    }else{
                        this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
                            duration: 1000
						})
                    }
                })
            }else {
                let data = {
                    meterType: this.tenantType,
                    buildingId: this.buildingId,
                    floorId: this.floorId,
                    roomId: this.roomId,
                    meterId: this.meterId,
                    price: this.tenantMoney,
                    userId: this.userId,
                    classId: this.classId,
                    subclassId: this.subClassId
                };
                this.$axios.post('BMPlatServers/commercial/addUserInfo', this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
							message: '增加成功',
							showClose: true,
                            duration: 1000
						})
                        this.$router.push({path: '/tenantDetail', query: {userId: this.userId}});
                    }else{
                        this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
                            duration: 1000
						})
                    }
                })
            }
        },

        typeNumber(meterType) {
            let data = {
                meterType,
                userId: this.userId
            };
            this.$axios.post('BMPlatServers/commercial/queryAmmeterList', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    res.data.result.list
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.tenantNumberList.push({label: item.ammeterName, value: `${item.buildingId},${item.floorId},${item.roomId},${item.ammeterId},${item.classId},${item.subclassId}`})
                        })
                    }else{
                        this.tenantNumberList = [];
                    }
                }else{
                    this.tenantNumberList = [];
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        goBack() {
            this.$router.push('/tenantReal');
        }
    },
    mounted() {
        this.userId = this.$route.query.userId;
        this.mark = this.$route.query.mark;
    },
    watch: {
        tenantPhone() {
            this.tenantPhone = (''+this.tenantPhone).replace(/[^\d.]/g,'');
        },
        tenantMoney() {
            this.tenantMoney = (''+this.tenantMoney).replace(/[^\d^\.]+/g, '').replace('.','$#$').replace(/\./g,'').replace('$#$','.');
        },
        tenantType(oldData) {
            this.tenantNumberList = [];
            this.tenantNumber = '';
            if(oldData) {
                this.typeNumber(oldData);
            }
        },
        tenantNumber(oldData) {
            if(oldData) {
                this.buildingId =  oldData.split(',')[0];
                this.floorId = oldData.split(',')[1];
                this.roomId = oldData.split(',')[2];
                this.meterId = oldData.split(',')[3];
                this.classId = oldData.split(',')[4];
                this.subClassId = oldData.split(',')[5];
            }else{
                this.buildingId =  '';
                this.floorId = '';
                this.roomId = '';
                this.meterId = '';
                this.classId = '';
                this.subClassId = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#tenantAdd{
    padding: 15px;
    .tenantAdd{
        padding-bottom: 10px;
        -webkit-box-shadow: 0 0 6px #ddd;
        -moz-box-shadow: 0 0 6px #ddd;
        box-shadow: 0 0 6px #ddd;
        .el-breadcrumb{
            padding: 20px 15px;
            background: #F6F7FB;
            /deep/ .el-breadcrumb__inner.is-link, .el-breadcrumb__inner a{
                font-weight: normal;
                color: #606266;
                &:hover{
                    color: #409EFF;
                }
            }
            /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover{
                color: #409EFF;
            }
        }
        .placeForm{
            margin-top: 25px;
            .short{
                width: 200px;
            }
            .middle{
                width: 300px;
            }
            .long{
                width: 410px;
                min-width: 100px;
            }
        }
    }
}
</style>
