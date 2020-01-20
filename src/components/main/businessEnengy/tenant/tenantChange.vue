<template>
    <div id="tenantChange">
        <div class="tenantChange">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/tenantReal' }">当前商户</el-breadcrumb-item>
                <el-breadcrumb-item>修改</el-breadcrumb-item>
            </el-breadcrumb>

            <div class="placeForm">
                <el-form label-width="100px">
                    <el-form-item label="商户名称" :required="true">
                        <el-input v-model="tenantName" class="short"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" :required="true">
                        <el-input v-model="tenantPerson" class="short"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" :required="true">
                        <el-input v-model="tenantPhone" class="long" clearable></el-input>
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
            row: {}
        }
    },
    methods: {
        submit() {
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

            let data = {
                id: this.row.id,
                userName: this.tenantName,
                owner: this.tenantPerson,
                phone: this.tenantPhone
            };
            console.log(data);
            this.$axios.post('BMPlatServers/commercial/updateUser', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.$message.warning({
                        message: '修改成功',
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
        },

        // 修改数据页面上来待参显示
        initData() {
            this.tenantName = this.row.userName;
            this.tenantPerson = this.row.owner;
            this.tenantPhone = this.row.phone;
        },

        goBack() {
            this.$router.push('/tenantReal');
        }
    },
    mounted() {
        this.row = this.$route.query.row;
        this.initData();
    },
    watch: {
        tenantPhone() {
            this.tenantPhone = (''+this.tenantPhone).replace(/[^\d^\.]+/g,'');
        }
    }
}
</script>

<style lang="scss" scoped>
#tenantChange{
    padding: 15px;
    .tenantChange{
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
