<template>
    <div id="serviceRepair">
        <div class="serviceRepair">
            <div class="placeBreadcrumb">
                <div class="BreadcrumbBox">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/processReapir' }">报修管理</el-breadcrumb-item>
                        <el-breadcrumb-item>维修</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>

            <el-form label-width="100px"  class="repair-ruleForm">
                <el-form-item label="开始时间" :required="true">
                    <el-date-picker v-model="startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="开始时间"></el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间"  :required="true">
                    <el-date-picker v-model="endTime" @change="endtimes" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间"></el-date-picker>
                </el-form-item>

                <el-form-item label="工时" :required="true">
                    <el-input @change="changeData" v-model="ruleForm.manHour" autocomplete="off" style="width: 100px"></el-input><span style="color: #606266; margin-left: 5px;">小时</span>
                </el-form-item>

                <el-form-item label="配件名称">
                    <el-input v-model="ruleForm.fittings" style="width: 400px;"></el-input>
                </el-form-item>

                <el-form-item label="金额">
                    <el-input maxlength="8" @change="changeData" v-model="ruleForm.price" style="width: 100px"></el-input><span style="color: #606266; margin-left: 5px;">元</span>
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
            ruleForm: {manHour: '', fittings: '', price: ''},
            startTime: '',
            endTime: '',
            inds: 0,
            deviceId: 0
        }
    },
    methods: {
        changeData() {
            this.ruleForm.manHour=this.ruleForm.manHour.replace(/[^\d.]/g,'');
            this.ruleForm.price=this.ruleForm.price.replace(/[^\d.]/g,'');
        },

        // 结束时间change的时候触发的方法，为了判断结束时间大于开始时间
        endtimes() {
            let startTimeY = '', endTimeY = '';
            let startTimeM = '', endTimeM = '';
            let startTimeD = '', endTimeD = '';
            let startTimeH = '', endTimeH = '';
            let startTimem = '', endTimem = '';
            let startTimeS = '', endTimeS = '';
            if(this.startTime) {
                startTimeY = this.startTime.split(' ')[0].split('-')[0];
                startTimeM = this.startTime.split(' ')[0].split('-')[1];
                startTimeD = this.startTime.split(' ')[0].split('-')[2];
                startTimeH = this.startTime.split(' ')[1].split(':')[0];
                startTimem = this.startTime.split(' ')[1].split(':')[1];
                startTimeS = this.startTime.split(' ')[1].split(':')[2];
            }
            if(this.endTime) {
                endTimeY = this.endTime.split(' ')[0].split('-')[0];
                endTimeM = this.endTime.split(' ')[0].split('-')[1];
                endTimeD = this.endTime.split(' ')[0].split('-')[2];
                endTimeH = this.endTime.split(' ')[1].split(':')[0];
                endTimem = this.endTime.split(' ')[1].split(':')[1];
                endTimeS = this.endTime.split(' ')[1].split(':')[2];
            }
            if(startTimeY > endTimeY) {
                this.$notify.warning({
                    title: '警告',
                    message: "结束时间大于开始时间",
                    duration: 2000
                })
                this.endTime = '';
                return false;
            }
            if(startTimeY == endTimeY && startTimeM > endTimeM) {
                this.$notify.warning({
                    title: '警告',
                    message: "结束时间大于开始时间",
                    duration: 2000
                })
                this.endTime = '';
                return false;
            }
            if(startTimeY == endTimeY && startTimeM == endTimeM && startTimeD > endTimeD) {
                this.$notify.warning({
                    title: '警告',
                    message: "结束时间大于开始时间",
                    duration: 2000
                })
                this.endTime = '';
                return false;
            }
            if(startTimeY == endTimeY && startTimeM == endTimeM && startTimeD == endTimeD && startTimeH > endTimeH) {
                this.$notify.warning({
                    title: '警告',
                    message: "结束时间大于开始时间",
                    duration: 2000
                })
                this.endTime = '';
                return false;
            }
            if(startTimeY == endTimeY && startTimeM == endTimeM && startTimeD == endTimeD && startTimeH == endTimeH && startTimem > endTimem) {
                this.$notify.warning({
                    title: '警告',
                    message: "结束时间大于开始时间",
                    duration: 2000
                })
                this.endTime = '';
                return false;
            }
            if(startTimeY == endTimeY && startTimeM == endTimeM && startTimeD == endTimeD && startTimeH == endTimeH && startTimem == endTimem && startTimeS > endTimeS) {
                this.$notify.warning({
                    title: '警告',
                    message: "结束时间大于开始时间",
                    duration: 2000
                })
                this.endTime = '';
                return false;
            }
        },

        // 提交
        onSubmit() {
            if(this.startTime == '') {
                this.$notify({
                    title: '警告',
                    message: '请填写开始时间',
                    type: 'warning',
                    duration: '2000'
                });
                return false;
            }
            if(this.endTime == '') {
                this.$notify({
                    title: '警告',
                    message: '请填写结束时间',
                    type: 'warning',
                    duration: '2000'
                });
                return false;
            }
            if(this.ruleForm.manHour == '') {
                this.$notify({
                    title: '警告',
                    message: '请填写工时',
                    type: 'warning',
                    duration: '2000'
                });
                return false;
            }
            if(this.ruleForm.fittings == '') {
                this.$notify({
                    title: '警告',
                    message: '请填写配件名称',
                    type: 'warning',
                    duration: '2000'
                });
                return false;
            }
            if(this.ruleForm.price == '') {
                this.$notify({
                    title: '警告',
                    message: '请填写金额',
                    type: 'warning',
                    duration: '2000'
                });
                return false;
            }
            let data = {
                flag: 2,
                startTime: this.startTime,
                endTime: this.endTime,
                costTime: this.ruleForm.manHour,
                deviceused: this.ruleForm.fittings,
                costMoney: this.ruleForm.price,
                id: this.inds,
                deviceId: this.deviceId,
                commitId: this.$route.query.commitId,
                type_comment: this.$route.query.type_comment
            };
            this.$axios.post('BMPlatServers/repair/updateRepairItem', this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.$message.success({
                        message: '成功',
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
        // 清空
        clear() {
            this.ruleForm.date1 = null;
            this.ruleForm.date2 = null;
            this.ruleForm.date3 = null;
            this.ruleForm.date4 = null;
            this.ruleForm.manHour = '';
            this.ruleForm.fittings = '';
            this.ruleForm.price = '';
        }
    },
    mounted() {
        this.inds = this.$route.query.ids;
        this.deviceId = this.$route.query.deviceId
    },
    watch: {
        startTime(newData) {
            if(newData == null) {
                this.endTime = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#serviceRepair{
    padding: 20px 0;
    .serviceRepair{
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
        }
    }
}
</style>
