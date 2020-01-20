<template>
    <div id="toPerson">
        <div class="toPerson">
            <div class="placeBreadcrumb">
                <div class="BreadcrumbBox">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/processReapir' }">报修管理</el-breadcrumb-item>
                        <el-breadcrumb-item>指派人员</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>

            <el-form label-width="100px"  class="repair-ruleForm">
                <el-form-item label="维修人员" class="weixiurenyuan">
                    <el-select v-model="person" placeholder="请选择" filterable>
                        <el-option v-for="item in personList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="维修人电话">
                    <el-input v-model="phone" style="width: 400px;" disabled></el-input>
                </el-form-item>

                <el-form-item label="完成时间" prop="time" class="timer">
                    <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="time" style="width: 200px;"></el-date-picker>
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
            personList: [],
            person: '',
            time: '',
            id: '',
            phone: '',
            ids: ''
        }
    },
    methods: {
        // 维修人员列表
        personlist() {
            this.$axios.post('BMPlatServers/repair/queryRepairPersonList').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.personList = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.personList.push({label: item.personName, value: `${item.id},${item.phone}`})
                        })
                    }else{
                        this.personList = [];
                    }
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        onSubmit() {
            if(this.person == '') {
                this.$notify({
                    title: '警告',
                    message: '请选择维修人员',
                    type: 'warning',
                    duration: 2000
                });
                return false;
            }
            if(this.time == '' || this.time == null) {
                this.$notify({
                    title: '警告',
                    message: '请填写完成时间',
                    type: 'warning',
                    duration: 2000
                });
                return false;
            }
            let data = {
                flag: 1,
                repairPerson: this.id,
                repairPersonPhone: this.phone,
                completeTime: this.time,
                id: this.ids,
                commitId: this.$route.query.commitId,
                type_comment: this.$route.query.type_comment
            };
            this.$axios.post('BMPlatServers/repair/updateRepairItem', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.$message.success({
                        message: '指派成功',
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
            this.person = '';
            this.phone = '';
            this.time = '';
        }
    },
    mounted() {
        this.ids = this.$route.query.ids;
        this.personlist();
    },
    watch: {
        person(item) {
            if(item!=null) {
                this.id = item.split(',')[0];
                this.phone = item.split(',')[1];
            }else{
                this.id = '';
                this.phone = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#toPerson{
    padding: 20px 0;
    .toPerson{
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
            position: relative;
            .weixiurenyuan:before{
                content: '*';
                color: red;
                position: absolute;
                left: 42px;
                top: 30px;
            }
            .timer:before{
                content: '*';
                color: red;
                position: absolute;
                left: 42px;
                top: 156px;
            }
        }
    }
    /deep/ .el-input.is-disabled .el-input__inner{
        background: #fff;
        color: #606266;
    }
}
</style>
