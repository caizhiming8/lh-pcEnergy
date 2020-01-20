<template>
    <div id="tenantHistory">
        <div class="tenantHistory">
            <div class="placeSearch">
                <span>商户信息</span>
                <el-input v-model="manaCode" clearable class="manaMain"></el-input>
                <span class="name">商户名称</span>
                <el-input v-model="manaName" clearable class="manaMain"></el-input>
                <span class="principal">负责人</span>
                <el-input v-model="manaPrincipal" clearable class="manaMain"></el-input>
                <span class="phone">联系方式</span>
                <el-input v-model="manaPhone" clearable class="manaMain"></el-input>
                <el-button type="primary" size="small" icon="el-icon-search" @click="search" class="btn">搜索</el-button>
            </div>
            <div class="placeTable">
                <el-table :data="tableData" style="width: 100%;margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading="loading">
                    <el-table-column label="序号" width="80" align='center'>
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userId" label="商户信息" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userName" label="商户名称" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="owner" label="负责人" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="phone" label="联系方式" align='center' show-overflow-tooltip></el-table-column>
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
    methods:{
        initData(currentPage) {
            let data = {
                currentPage: currentPage,
                pageSize: this.pageSize,
                userId: this.manaCode,
                userName: this.manaName,
                phone: this.manaPhone,
                owner: this.manaPrincipal,
                flag: 1
            };
            this.$axios.post('BMPlatServers/commercial/queryUser', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.list;
                    this.pageTotal = res.data.result.num;
                    this.loading = false;
                }else{
                    this.tableData = [];
                    this.loading = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
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
    watch:{

    }
}
</script>

<style lang="scss" scoped>
#tenantHistory{
    .tenantHistory{
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
                width: 120px;
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
