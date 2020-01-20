<template>
    <div id="tenantReal">
        <div class="tenantReal">
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

                <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="add" class="btn">增加</el-button>
            </div>
            <div class="placeTable">
                <el-table :data="tableData" style="width: 100%;margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'3px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading="loading">
                    <el-table-column label="序号" width="80" align='center'>
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userId" label="商户信息" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userName" label="商户名称" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="owner" label="负责人" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="phone" label="联系方式" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column label="详情" align='center' width="160">
                        <template slot-scope="scope">
                            <el-button type="text" @click="detail(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align='center' width="260">
                        <template slot-scope="scope">
                            <el-button type="success" size="mini" @click="changeData(scope.row)">修改</el-button>
                            <el-button type="danger" size="mini" @click="deleteData(scope.row)">注销</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
            </div>

            <el-dialog title="删除" :visible.sync="dialogVisible" width="30%">
                <span v-if="effective==0">确定要注销此商户吗？</span>
                <span v-if="effective!=0">此商户存在有效的表，请先去注销表</span>
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
            dialogVisible: false,
            datas: {},
            effective: 0
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
                flag: 0
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
            this.val = val;
            this.loading = true;
            this.initData(val);
        },
        search() {
            this.loading = true;
            this.val = 1;
            this.currentPage = 1;
            this.initData(1);
        },

        // 表格里面的修改按钮
        changeData(row) {
            this.$router.push({path: '/tenantChange', query: {row: row}});
        },

        // 详情按钮
        detail(row) {
            this.$router.push({path: '/tenantDetail', query: {userId: row.userId}});
        },

        // 增加按钮
        add() {
            this.$router.push({path: '/tenantAdd', query: {mark: 1}});
        },

        // 表格里面的注销按钮
        deleteData(row) {
            this.dialogVisible = true;
            this.datas = row;
            let data  = {
                userId: row.userId
            };
            this.$axios.post('BMPlatServers/commercial/queryUserDeviceCount', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.effective = res.data.result.count;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        sureDelete() {
            if(this.effective == 0) {
                let data  = {
                    id: this.datas.id
                };
                this.$axios.post('BMPlatServers/commercial/deleteUser', this.$qs.stringify(data)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.$message.success({
                            message: '删除成功',
                            showClose: true,
                            duration: 1000
                        })
                        this.val = 1;
                        this.currentPage = 1;
                        this.dialogVisible = false;
                        this.initData(1);
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            }else{
                this.dialogVisible = false;
                this.$message.warning({
                    message: '此商户存在有效的表，请先去注销表',
                    duration: 1000,
                    showClose: true
                })
            }
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
#tenantReal{
    .tenantReal{
        padding: 0px 10px;
        .el-breadcrumb{
            padding: 10px 8px;
            border-radius: 6px;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            -ms-border-radius: 6px;
            -o-border-radius: 6px;
            background: #F1F1F1;
        }
        .placeSearch{
            margin-top: 25px;
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
