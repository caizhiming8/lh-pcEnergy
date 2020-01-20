<template>
    <div id="realState">
        <div class="State">
            <!-- <div class="placeBtn">
                <h4 v-for="(item, index) in lists" v-if="item.num>0" @click="handleTab(index)" :class="CurentIndex==index?'active':null">{{item.message}}</h4>
            </div> -->
            <div class="placeSearch">
                <span class="span1">设备名称：</span>
                <el-input class="middle" v-model="deviceName"></el-input>
                <el-button @click="Search" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
            </div>
            <div class="State-table" v-loading="loading">
                <el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
                    <el-table-column prop="name" label="设备名称" fixed  align='center'></el-table-column>
                    <el-table-column prop="message" label="错误信息" fixed  align='center' v-if="NBtrue && isShow"></el-table-column>
                    <el-table-column prop="voltage" label="电池电压"  align='center' v-if="NBtrue && isShow"></el-table-column>
                    <el-table-column prop="intensity" label="信号强度"  align='center' v-if="NBtrue && isShow"></el-table-column>
                    <el-table-column prop="collectTime" label="上次上数时间"  align='center'></el-table-column>
                    <el-table-column prop="connectflag" label="连接状态"  align='center'>
                        <template slot-scope="scope">
                            <span style="color: red;" v-if="scope.row.connectflag==0">离线</span>
                            <span v-if="scope.row.connectflag==1">在线</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="State-pagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            deviceName: '',
            lists: [],
            currentIndex: 0,
            NBtrue: false,
            CurentIndex: 0,
            isShow: true,
            loading: true
        }
    },
    methods: {
        // 是否nb模式
        isShowBtn() {
            this.$axios.post(`BMPlatServers/water/queryDeviceCount`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        this.lists = res.data.result.list;
                        console.log(this.lists);
                        // 初始化判断是否有nb模式
                        for(var i = 0; i < res.data.result.list.length; i++) {
                            if(res.data.result.list[i].NBflag == 0) {
                                this.NBtrue = true;
                                this.currentIndex = 0
                                break;
                            }else if(res.data.result.list[i].NBflag == 1) {
                                this.NBtrue = false;
                                this.currentIndex = 1;
                            }
                        }
                    }else{
                        this.lists = [];
                    }
                    this.initData();
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        // nb模式点击变色
        handleTab(n) {
            this.loading = true;
            this.CurentIndex = n;
            this.currentIndex = this.NBtrue ? n : n + 1;
            if(n==0) {
                this.isShow = true;
            }else{
                this.isShow = false;
            }
            this.initData();
        },
        Search() {
            this.loading = true;
            this.initData();
        },
        handleCurrentChange(val) {
            this.loading = true;
            let data = {
                name: this.deviceName,
                pageSize: this.pageSize,
                currentPage: val,
                flag: this.currentIndex+1
            }
            this.$axios.post(`BMPlatServers/water/queryDevcieState`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.array;
                    this.pageTotal = res.data.result.num;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
                this.loading = false;
            })
        },
        initData() {
            let data = {
                name: this.deviceName,
                pageSize: this.pageSize,
                currentPage: this.currentPage,
                flag: this.currentIndex+1
            }
            this.$axios.post(`BMPlatServers/water/queryDevcieState`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.array;
                    this.pageTotal = res.data.result.num;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
                this.loading = false;
            })
        }
    },
    mounted() {
        this.isShowBtn();
    }
}
</script>

<style lang="scss" scoped>
#realState{
    .State{
        box-shadow: 0 0 7px #ddd;
        -webkit-box-shadow: 0 0 7px #ddd;
        -moz-box-shadow: 0 0 7px #ddd;
        -o-box-shadow: 0 0 7px #ddd;
        width: 98%;
        margin: 20px auto;
        .placeBtn{
            padding: 20px 0 0 30px;
            h4{
                font-weight: normal;
                font-size: 12px;
                color: #333;
                display: inline-block;
                background: #E7EAED;
                padding: 8px 12px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                cursor: pointer;
            }
            h4.active{
                background: #409EFF;
                color: #fff;
            }
            h4:nth-child(2){
                margin-left: 10px;
            }
        }
        .placeSearch{
            padding: 20px 0 0 30px;
            .span1{
                color: #666;
            }
            .middle{
                width: 180px;
            }
        }
        .State-table{
            margin-top: 20px;
        }
        .State-pagination{
            text-align: right;
            padding: 20px 10px 20px 0;
        }
    }
}
</style>
