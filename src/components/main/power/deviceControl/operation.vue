<template>
    <div id="operation">
        <div class="operation">
            <div class="placeTable">
				<template>
				  <div class="block">
					<span class="demonstration">带快捷选项</span>
					<el-date-picker
					  v-model="value1"
					  align="right"
					  type="dates"
					  placeholder="手动选择多个"
					  :picker-options="pickerOptions1">
					</el-date-picker>
				  </div>
				</template>
                <el-table tooltip-effect="light" :data="tableData" stripe style="width: 100%">
                    <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
						
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dictCode" label="建筑" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dictName" label="楼层" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dictKey" label="房间" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dictVal" label="操作人员" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dictVal" label="命令" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dictVal" label="时间" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dictVal" label="是否成功" align='center'></el-table-column>
    			</el-table>
            </div>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size='pageSize'  layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tableData: [{}, {}, {}, {}, {}],
            val: 1,
            pageSize: 10,
            currentPage: 1,
            pageTotal: 1,
			pickerOptions1: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			  shortcuts: [{
				text: '周一',
				onClick(picker) {
					var date=new Date();
					var end=new Date().getTime()+60*24*3600*1000;//60天内的周一
					var day = date.getDay() || 7;
					var basenum=1;//1到7代表周一到周日
					var weekstart = new Date(date.getFullYear(), date.getMonth(), date.getDate() + basenum - day).getTime();
					var dates=[];
					if (weekstart >= date.getTime()) {
						dates.push(weekstart)
					}
					while (weekstart<end){
						weekstart=weekstart+7*24*3600*1000;
						dates.push(weekstart)
					}
					picker.$emit('pick', dates);
				}
			  },]
			},
        }
    },
    methods: {
		initData(){
			let data = {
				
			}
			this.$axios.post(`...`,this.$qs.stringify(data)).then((res)=>{
				console.log(res);
			    if(res.data.success) {
					
			    }else{
					console.log('失败')
			    }
			});
		},
        handleCurrentChange(val) {

        },
    },
    mounted() {
		this.initData()
    }
}
</script>

<style lang="scss" scoped>
#operation{
    .operation{
        .pagination{
            text-align: right;
            margin: 15px;
        }
    }
}
</style>
