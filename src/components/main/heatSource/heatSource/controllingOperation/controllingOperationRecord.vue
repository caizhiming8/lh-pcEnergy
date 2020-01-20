<template>
    <div id="controllingOperationRecord">
        <div class="controllingOperationRecord">
            <el-table :data="tableData" style="100%" :default-sort = "{prop: 'date', order: 'descending'}" stripe>
                <el-table-column label="序号" align='center'>
                    <template slot-scope="scope">
                        <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="deviceName" label="设备名称" align='center'></el-table-column>
                <el-table-column prop="maxNum" label="最大阈值" sortable align='center'></el-table-column>
                <el-table-column prop="startTime" label="开始时间" align='center'></el-table-column>
                <el-table-column prop="endTime" label="结束时间" align='center'></el-table-column>
                <el-table-column prop="dayConsume" label="日流量" sortable align='center'></el-table-column>
                <el-table-column prop="nightConsume" label="夜流量" sortable align='center'></el-table-column>
            </el-table>
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
            tableData: [
                {deviceName: '设备名称1', maxNum: 322, startTime: '2019-4-12 8:33:12', endTime: '2019-4-12 8:33:12', dayConsume: 200, nightConsume: 100},
                {deviceName: '设备名称2', maxNum: 322, startTime: '2019-4-12 8:33:12', endTime: '2019-4-12 8:33:12', dayConsume: 300, nightConsume: 200},
                {deviceName: '设备名称3', maxNum: 322, startTime: '2019-4-12 8:33:12', endTime: '2019-4-12 8:33:12', dayConsume: 400, nightConsume: 100},
            ],
            val: 1,
            pageSize: 10,
            currentPage: 1,
            pageTotal: 3
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.val = val;
        }
    }
}
</script>

<style lang="scss" scoped>
#controllingOperationRecord{
    .controllingOperationRecord{
        .pagination{
            text-align: right;
            margin: 15px;
        }
    }
}
</style>
