<template>
    <div id="energyTolte">
        <div class="energyTolte">
            <!-- <div class="placeSearch">
                <span>模块查询</span>
                <el-select v-model="modleId" placeholder="请选择">
                   <el-option  v-for="item in modleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                 </el-select>
            </div> -->
            <div class="table">
                <el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 5px'}" v-loading = "loading">
                    <el-table-column label="能源类型" prop="systemName" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column label="表名称" prop="name" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="consume" label="年用量" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="monthconsume" label="月用量" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dayconsume" label="日用量" align='center' show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            // modleList: [],
            // modleId: '',
            tableData: [],
            loading: false
        }
    },
    methods: {
        initTableData() {
            this.$axios.post("BMPlatServers/electricity/queryAllBuildingsElec").then((res)=>{  //电
                // console.log(res);
                if(res.data.success) {
                    this.tableData = this.tableData.concat(res.data.result.devicelist);
                }else{
                    this.$message.warning({
                        message: "电"+res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            });

            this.$axios.post("BMPlatServers/water/queryAllBuildingWater").then((res)=>{  //水
                // console.log(res);
                if(res.data.success) {
                    this.tableData = this.tableData.concat(res.data.result.buildinglist);
                }else{
                    this.$message.warning({
                        message: "水"+res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            });

            this.$axios.post("BMPlatServers/hvacheat/queryAllCityHeat").then((res)=>{  //暖
                // console.log(res);
                if(res.data.success) {
                    this.tableData = this.tableData.concat(res.data.result.buildinglist);
                }else{
                    this.$message.warning({
                        message: "暖"+res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            });
        }
    },
    mounted() {
        this.initTableData();
    }
}
</script>
