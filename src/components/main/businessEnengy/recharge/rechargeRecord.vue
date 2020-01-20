<template>
    <div id="rechargeRecord">
        <div class="rechargeRecord">
            <ul>
                <li v-for="(item, index) in manaList" @click="handleClick(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
            </ul>

            <div class="placeSearch">
                <span>商户编码</span>
                <el-input v-model="manaCode" clearable class="manaMain"></el-input>
                <span class="name">商户名称</span>
                <el-input v-model="manaName" clearable class="manaMain"></el-input>
                <span class="principal">负责人</span>
                <el-input v-model="manaPrincipal" clearable class="manaMain"></el-input>
                <span class="phone">联系方式</span>
                <el-input v-model="manaPhone" clearable class="manaMain"></el-input>
                <span class="phone">充值时间</span>
                <el-date-picker v-model="moneyTime" type="daterange" range-separator="至" class="timePicker" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="search" class="btn" size="small">搜索</el-button>
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
                    <el-table-column prop="ammeterId" label="表号" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="operType" label="操作类型" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="money" label="充值金额" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="amount" label="充值电（水）量" align='center' show-overflow-tooltip width="140"></el-table-column>
                    <el-table-column prop="time" label="充值时间" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="结果" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="memo" label="备注" align='center' show-overflow-tooltip></el-table-column>
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
            currentIndex: 0,
            manaList: [{name: '当前商户', id: 1}, {name: '历史商户', id: 2}],
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
            moneyTime: null,
            startTime: '',
            endTime: ''
        }
    },
    methods: {
        // 初始化数据
        initData(currentPage) {
            let data = {
                currentPage: currentPage,
                pageSize: this.pageSize,
                userId: this.manaCode,
                userName: this.manaName,
                phone: this.manaPhone,
                owner: this.manaPrincipal,
                startTime: this.startTime,
                endTime: this.endTime,
                flag: this.currentIndex
            };
            // console.log(data);
            this.$axios.post('BMPlatServers/commercial/queryChargeHistory', this.$qs.stringify(data)).then((res)=>{
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

        // 点击变色
        handleClick(i) {
            this.currentIndex = i;
            this.loading = true;
            this.initData(1);
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
        }
    },
    mounted() {
        this.initData(1);
    },
    watch: {
        moneyTime(oldData) {
            if(oldData==null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = oldData[0];
                this.endTime = oldData[1];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#rechargeRecord{
    .rechargeRecord{
        ul{
            overflow: hidden;
            li{
                float: left;
                padding: 5px 15px;
                border-radius: 3px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                -ms-border-radius: 3px;
                -o-border-radius: 3px;
                color: #409eff;
                border: 1px solid #409eff;
                margin: 0 10px;
                cursor: pointer;
                &.active{
                    background: #409EFF;
                    color: #fff;
                }
            }
            li:first-child{
                margin-left: 0;
            }
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
                width: 90px;
            }
            .timePicker{
                width: 260px;
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
