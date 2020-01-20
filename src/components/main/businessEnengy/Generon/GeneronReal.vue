<template>
    <div id="GeneronReal">
        <div class="GeneronReal">
            <div class="placeSearch">
                <span>商户编码</span>
                <el-input v-model="manaCode" clearable class="manaMain"></el-input>
                <span class="name">商户名称</span>
                <el-input v-model="manaName" clearable class="manaMain"></el-input>
                <span class="principal">负责人</span>
                <el-input v-model="manaPrincipal" clearable class="manaMain"></el-input>
                <span class="phone">联系方式</span>
                <el-input v-model="manaPhone" clearable class="manaMain"></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search" class="btn">搜索</el-button>
            </div>
            <div class="placeTable">
                <el-table :data="tableData" style="width: 100%;margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading="loading">
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
                    <el-table-column prop="deviceName" label="表名称" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="nowCosume" label="当前电（水）量" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="leftAmount" label="剩余电（水）量" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column label="商户状态" align='center' show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>正常</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="switch" label="开关状态" align='center' show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
            </div>
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
            pageTotal: 0
        }
    },
    methods: {
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
                // console.log(res);
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
        }
    },
    mounted() {
        this.initData(1);
    },
    watch: {

    }
}
</script>

<style lang="scss" scoped>
#GeneronReal{
    .GeneronReal{
        padding: 20px 10px;
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
                width: 160px;
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
    }
}
</style>
