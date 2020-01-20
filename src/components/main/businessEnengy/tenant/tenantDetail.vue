<template>
    <div id="tenantDetail">
        <div class="tenantDetail">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/tenantReal' }">当前商户</el-breadcrumb-item>
                <el-breadcrumb-item>详情</el-breadcrumb-item>
            </el-breadcrumb>

            <div class="boxBtn">
                <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addDetail" class="btn">增加</el-button>
            </div>

            <div class="placeTable">
                <el-table :data="tableData" style="width: 100%;margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px'}" v-loading="loading">
                    <el-table-column label="序号" width="80" align='center'>
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userId" label="商户信息" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userName" label="商户名称" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="owner" label="负责人" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="phone" label="联系方式" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="meterTypeName" label="表类型" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column prop="deviceName" label="表名称" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column prop="price" label="价格" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column prop="registerTime" label="注册时间" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column label="操作" align='center' width="160">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini" @click="deleteData(scope.row)">注销</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
            </div>

            <el-dialog title="删除" :visible.sync="dialogVisible" width="30%">
                <span>账户存有余额，请先去退费？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="sureDelete" size="small">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tableData: [],
            loading: true,
            pageSize: 10,
            val: 1,
            currentPage: 1,
            pageTotal: 0,
            userId: 0,
            id: 0,
            dialogVisible: false
        }
    },
    methods: {
        initData(currentPage) {
            let data = {
                currentPage: currentPage,
                pageSize: this.pageSize,
                userId: this.userId
            };
            this.$axios.post('BMPlatServers/commercial/queryUserInfo', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.list;
                    this.pageTotal = res.data.result.num;
                    this.loading = false;
                }else{
                    this.tableData = [];
                    this.pageTotal = 0;
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
            this.val = val;
            this.loading  = true;
            this.initData(val);
        },

        sureDelete() {
            this.$store.commit('changeSlider', 'recharge');
            this.$router.push('/recharge');
        },

        // 增加按钮
        addDetail() {
            this.$router.push({path: '/tenantAdd', query: {mark: 2, userId: this.userId}});
        },

        // 删除按钮
        deleteData(row) {
            this.dialogVisible = true;
            this.id = row.id;
        }
    },
    mounted() {
        this.userId = this.$route.query.userId;
        this.initData(1);
    },
    watch: {

    }
}
</script>

<style lang="scss" scoped>
#tenantDetail{
    padding: 15px;
    .tenantDetail{
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
        .boxBtn{
            text-align: right;
            position: relative;
            right: 20px;
            top: 10px;
        }

        .placeTable{
            margin-top: 20px;
            padding: 0 20px;
        }
        .pagination{
            text-align: right;
            margin: 20px 10px 0 10px;
        }
    }
}
</style>
