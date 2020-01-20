<template>
    <div id="rechargeOperation">
        <div class="rechargeOperation">
            <div class="placeSearch">
                <span>商户编码</span>
                <el-input v-model="manaCode" placeholder="商户编码" clearable class="manaMain"></el-input>
                <span class="name">商户名称</span>
                <el-input v-model="manaName" placeholder="商户名称" clearable class="manaMain"></el-input>
                <span class="principal">负责人</span>
                <el-input v-model="manaPrincipal" placeholder="负责人" clearable class="manaMain"></el-input>
                <span class="phone">联系方式</span>
                <el-input v-model="manaPhone" placeholder="联系方式" clearable class="manaMain"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search" class="btn" size="small">搜索</el-button>
            </div>
            <div class="placeTable">
                <el-table :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}"  v-loading="loading">
                    <el-table-column label="序号" width="80" align='center'>
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userId" label="商户编码" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userName" label="商户名称" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="owner" label="负责人" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="phone" label="联系方式" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="meterType" label="表类型" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column prop="meter_id" label="表号" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="nowCosume" label="当前电（水）量" align='center' show-overflow-tooltip width="140"></el-table-column>
                    <el-table-column prop="leftAmount" label="剩余电（水）量" align='center' show-overflow-tooltip width="140"></el-table-column>
                    <el-table-column label="商户状态" align='center' show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>正常</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="switch" label="开关状态" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="price" label="价格" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" width="250" align='center'>
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="recharge(scope.row, scope.$index)">充值</el-button>
                            <el-button type="success" size="mini" @click="premium(scope.row, scope.$index)">退费</el-button>
                            <el-button type="warning" size="mini" @click="switchs(scope.row, scope.$index)">开关</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
            </div>

            <el-dialog :title="content" :visible.sync="dialogVisible" width="30%">
                <div class="moneyBody">
                    <el-form label-width="100px" v-if="isOk==1">
                        <el-form-item label="充值金额">
                            <el-input v-model="money" style="width: 120px;"></el-input>
                        </el-form-item>
                    </el-form>

                    <el-form label-width="100px" v-if="isOk==2">
                        <el-form-item label="退费金额">
                            <el-input v-model="returnMoney" style="width: 120px;" disabled></el-input>
                        </el-form-item>
                    </el-form>

                    <el-form label-width="100px" v-if="isOk==3">
                        <el-form-item label="回路通断">
                            <el-radio v-model="onOff" label="1">通</el-radio>
                            <el-radio v-model="onOff" label="0">断</el-radio>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                    <el-button type="primary" @click="makeSure" size="mini">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            manaCode: '',
            manaName: '',
            manaPrincipal: '',
            manaPhone: '',
            tableData: [],
            loading: true,
            val: 1,
            pageSize: 10,
            currentPage: 1,
            pageTotal: 0,
            content: '充值',
            dialogVisible: false,
            money: '',
            isOk: 1,
            returnMoney: '',
            onOff: '1',
            row1: {},
            row2: {},
            row3: {}
        }
    },
    methods:{
        initData(currentPage) {
            let data = {
                currentPage: currentPage,
                pageSize: this.pageSize,
                userId: this.manaCode,
                userName: this.manaName,
                phone: this.manaPhone,
                owner: this.manaPrincipal
            };
            this.$axios.post('BMPlatServers/commercial/queryCurrentConsume', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.list;
                    this.pageTotal = res.data.result.num;
                }else{
                    this.tableData = [];
                    this.pageTotal = 0;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
                this.loading = false;
            })
        },

        handleCurrentChange(val) {
            this.loading = true;
            this.val = val;
            this.initData(val);
        },
        search() {
            this.loading = true;
            this.val = 1;
            this.currentPage = 1;
            this.initData(1);
        },

        // 模态框确定按钮
        makeSure() {
            if(this.isOk==1) {
                let data = {
                    buildingId: this.row1.buildingId,
                    floorId: this.row1.floorId,
                    roomId: this.row1.roomId,
                    fee: this.money,
                    ammeterId: this.row1.meter_id
                };
                this.$axios.post('BMPlatServers/commercial/chargeElectricFee', this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
							message: '充值成功',
							showClose: true,
                            duration: 1000
						})
                        this.dialogVisible = false;
                    }else{
                        this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
                            duration: 1000
						})
                    }
                })
            }else if(this.isOk==2) {
                let data = {
                    buildingId: this.row2.buildingId,
                    floorId: this.row2.floorId,
                    roomId: this.row2.roomId,
                    ammeterId: this.row2.meter_id
                };
                this.$axios.post('BMPlatServers/commercial/refoundElectricFee', this.$qs.stringify(data)).then((res)=>{
                    console.log(res);
                    if(res.data.success) {
                        this.$message.success({
							message: '退费成功',
							showClose: true,
                            duration: 1000
						})
                        this.dialogVisible = false;
                    }else{
                        this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
                            duration: 1000
						})
                    }
                })
            }else if(this.isOk==3) {
                if(this.onOff == this.row3.onoff) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请改变回路通断',
                        duration: 2000
                    })
                    return false;
                }
                let data = {
                    buildingId: this.row3.buildingId,
                    floorId: this.row3.floorId,
                    roomId: this.row3.roomId,
                    ammeterId: this.row3.meter_id,
                    value: this.onOff,
                    meterType: this.row3.meterName,
                    classId: this.row3.classId,
                    subclassId: this.row3.subclassId
                };
                this.$axios.post('BMPlatServers/commercial/ammeterControl', this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
							message: '成功',
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
                    this.dialogVisible = false;
                })
            }
        },

        // 充值按钮
        recharge(row) {
            this.dialogVisible = true;
            this.content = '充值';
            this.isOk = 1;
            this.money = '';
            this.row1 = row;
        },

        // 退费按钮
        premium(row) {
            this.dialogVisible = true;
            this.content = '退费';
            this.isOk = 2;
            this.returnMoney = (Number(row.leftAmount) * Number(row.price)).toFixed(2);
            this.row2 = row;
        },

        // 开关按钮
        switchs(row) {
            this.dialogVisible = true;
            this.content = '开关';
            this.isOk = 3;
            this.row3 = row;
            if(row.onoff == '1') {
                this.onOff = '1';
            }else{
                this.onOff = '0';
            }
        }
    },
    mounted() {
        this.initData(1);
    },
    watch: {
        money(oldData) {
            this.money = this.money.replace(/[^\d.]/g,'');
        }
    }
}
</script>

<style lang="scss" scoped>
#rechargeOperation{
    .rechargeOperation{
        .placeSearch{
            span{
                color: #666;
            }
            .name{
                margin-left: 20px;
            }
            .principal{
                margin-left: 20px;
            }
            .phone{
                margin-left: 20px;
            }
            .manaMain{
                width: 200px;
            }
            .btn{
                margin-left: 40px;
            }
        }
        .placeTable{
            margin-top: 40px;
        }
        .pagination{
            text-align: right;
            margin: 10px;
        }
        .moneyBody{
            /deep/ .el-input.is-disabled .el-input__inner{
                background: #fff;
                color: #666;
            }
            .el-input{
                width: 280px;
            }
        }
    }
}
</style>
