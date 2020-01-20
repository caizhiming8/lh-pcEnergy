<template>
  <div id="waterMeterValue">
    <div class="waterMeterValue">
      <!-- waterMeterValue -->
      <div class="placeTable">
        <el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}"
          :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
          <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
            <template slot-scope="scope">
              <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="ammeter_name" label="表名" align='center'></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="addr" label="物理地址" align='center'></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="consum" label="抄表值" align='center'></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="collect_time" label="抄表时间" align='center'></el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size='pageSize'
          layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        val: 1,
        pageSize: 10,
        currentPage: 1,
        pageTotal: 10,
        tableData: [],
      }
    },
    methods: {
      initData() {
        let data = {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        this.$axios.post(`BMPlatServers/water/queryrealconsume`, this.$qs.stringify(data)).then((res) => {
          console.log(res);
          if (res.data.success) {
            this.tableData = [];
            this.tableData = res.data.result.realConsumeList;
            this.pageTotal = res.data.result.count;
          } else {
            this.tableData = [];
            this.$message.warning({
              message: res.data.resultMessage,
              showClose: true,
              duration: 1000,
            });
          }
        })
      },
      handleCurrentChange() {
        this.initData()
      }
    },
    mounted() {
      this.initData()
    },
    watch: {

    }
  }
</script>

<style lang="scss" scoped>
  #waterMeterValue {
    padding: 15px;

    .waterMeterValue {
      box-shadow: 0 0 6px #ddd;
      padding: 8px;

      .placeTable {}

      .pagination {
        text-align: right;
        margin: 15px;
      }
    }
  }
</style>
