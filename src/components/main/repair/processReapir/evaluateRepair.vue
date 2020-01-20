<template>
    <div id="evaluateRepair">
        <div class="evaluateRepair">
            <div class="placeBreadcrumb">
                <div class="BreadcrumbBox">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/processReapir' }">报修管理</el-breadcrumb-item>
                        <el-breadcrumb-item>回访评价</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>

            <el-form label-width="100px"  class="repair-ruleForm">
                <el-form-item label="评分" :required="true">
                    <el-rate show-text v-model="evaluate" :colors="colors"></el-rate>
                </el-form-item>
                <el-form-item label="评价" >
                    <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容" v-model="context"  maxlength="100" clearable show-word-limit></el-input>
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
            context: '',
            evaluate: null,
            colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
            ids: ''
        }
    },
    methods: {
        onSubmit() {
            if(!this.evaluate) {
                this.$notify({
                    title: '警告',
                    message: '请点亮评分',
                    type: 'warning',
                    duration: '2000'
                });
                return false;
            }
            let data = {
                flag: 3,
                evaluation: this.context,
                result: this.evaluate,
                id: this.ids
            };
            this.$axios.post('BMPlatServers/repair/updateRepairItem', this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.$message.success({
                        message: '评价成功',
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
            this.context = '';
            this.evaluate = null;
        }
    },
    mounted() {
        this.ids = this.$route.query.inds;
    }
}
</script>

<style lang="scss" scoped>
#evaluateRepair{
    padding: 20px 0;
    .evaluateRepair{
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
			//position:relative;
            .el-rate{
                margin-top: 12px;
            }
            /deep/ .el-textarea__inner{
                font-family: 'Microsoft YaHei';
            }
        }

    }
}
</style>
