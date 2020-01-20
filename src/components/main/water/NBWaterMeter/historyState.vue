<template>
    <div id="historyState">
        <div class="State" ref="State">
            <div class="State-tree" ref="StateTree">
                <el-tree accordion ref="treeBox" :expand-on-click-node="false" :default-expanded-keys="[IndexId]" node-key="id" :data="datas" highlight-current :props="defaultProps" @node-click="handleNodeClick">
                    <span class="span-ellipsis" slot-scope="{ node, data }">
                        <span :title="node.label"><img src="../../../../../static/img/treeIcon.png">{{ node.label }}</span>
                    </span>
                </el-tree>
            </div>
            <div class="State-main">
                <div class="State-time">
                    <span>时间查询：</span>
                    <el-date-picker v-model="TimeChange" value-format="yyyy-MM-dd HH" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    <el-button type="primary" size="small" icon="el-icon-search" @click="search" class="btn">搜索</el-button>
                </div>
                <div class="overAuto">
                    <div class="State-right">
                        <el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}" v-loading = "loading">
                            <el-table-column label="名称" prop="name" align='center'></el-table-column>
                            <el-table-column prop="message" label="错误信息" sortable align='center'></el-table-column>
                            <el-table-column prop="voltage" label="电池电压" sortable align='center'></el-table-column>
                            <el-table-column prop="intensity" label="信号强度" align='center'></el-table-column>
                            <el-table-column prop="collectTime" label="时间" align='center'></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="State-pagination">
                    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            TimeChange: [],
            datas: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tableData: [],
            startTime: '',
            endTime: '',
            id: '',
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            val: 1,
            loading: true,
            IndexId: 0
        }
    },
    methods: {
        search() {
            this.loading = true;
            this.val = 1;
            this.currentPage = 1;
            this.initData();
        },
        handleNodeClick(data) {
            this.id = data.id;
            if(data.id) {
                this.initData();
            }
        },

        //tabel表格的数据
        initData() {
            let data = {
                watermeterId: this.id,
                startTime: this.startTime,
                endTime: this.endTime,
                currentPage: 1,
                pageSize: this.pageSize
            };
            // console.log(data);
            this.$axios.post(`BMPlatServers/water/queryDevcieStateHistory`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.array;
                    this.pageTotal = res.data.result.num;
                    this.loading = false;
                }else{
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
            let data = {
                watermeterId: this.id,
                startTime: this.startTime,
                endTime: this.endTime,
                currentPage: val,
                pageSize: this.pageSize
            };
            // console.log(data);
            this.$axios.post(`BMPlatServers/water/queryDevcieStateHistory`,  this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.array;
                    this.pageTotal = res.data.result.num;
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 设备列表
        initDivice() {
            let childrens = [];
            this.$axios.post(`BMPlatServers/common/queryDeviceSList`).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            childrens.push({id: item.watermeterId, label: item.deviceName});
                        })
                    }
                    this.IndexId = res.data.result[0].watermeterId;
                    this.$nextTick(()=>{
                        this.$refs.treeBox.setCurrentKey(res.data.result[0].watermeterId)
                    })
                    this.initData();
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
            this.datas.push({id: 'xxoo', label: 'NB模式', children: childrens});
        },

        //初始化Dom
        initDom() {
            let Height = window.screen.availHeight
            this.$refs.State.style.height = Height - 250 + 'px';
            this.$refs.StateTree.style.height = Height - 250 + 'px';
        }
    },
    mounted() {
        let date = new Date();
        let endYear = date.getFullYear();
        let endMonth = date.getMonth() + 1;
        let endDay = date.getDate();
        let endHours = date.getHours();
        let endMinutes = date.getMinutes();
        let endSeconds = date.getSeconds();

        let startdate = new Date(new Date().getTime() - 3*24*60*60*1000);
        let startYear = startdate.getFullYear();
        let startMonth = startdate.getMonth() + 1;
        let startDay = startdate.getDate();
        let startHours = startdate.getHours();
        let startMinutes = startdate.getMinutes();
        let startSeconds = startdate.getSeconds();
        this.startTime = `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}:${startSeconds}`;
        this.endTime = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}`;
        this.TimeChange = [];
        this.TimeChange.push(this.startTime);
        this.TimeChange.push(this.endTime);
        this.initDivice();
        this.initDom();
    },
    watch: {
        TimeChange(item) {
            if(item == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = item[0];
                this.endTime = item[1];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#historyState{
    padding: 20px 15px;
    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
        color: #0098FF;
        font-weight: 700;
    }
    .State{
        box-shadow: 0 0 6px #ddd;
        -webkit-box-shadow: 0 0 6px #ddd;
        -moz-box-shadow: 0 0 6px #ddd;
        -o-box-shadow: 0 0 6px #ddd;
        display: flex;
        .State-tree{
            width: 15%;
            overflow: auto;
            border-right: 1px solid #ddd;
            padding-top: 10px;
            box-sizing: border-box;
            .span-ellipsis {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: block;
            }
        }
        .State-main{
            width: 85%;
            padding: 15px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -ms-box-sizing: border-box;
            -o-box-sizing: border-box;
            box-sizing: border-box;
            overflow-y: auto;
            .State-time{
                span{
                    color: #666;
                }
                .btn{
                    margin-left: 20px;
                }
            }
            .overAuto{
                margin-top: 15px;
                .State-right{

                }
            }
            .State-pagination{
                text-align: right;
                margin-top: 15px;
            }
        }
    }
}
</style>
