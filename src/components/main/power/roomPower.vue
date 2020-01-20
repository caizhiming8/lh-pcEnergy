<template>
    <div id="roomPower">
        <div class="commonTree">
            <el-tree :data="datas" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                        <img src="../../../../static/img/fangjianguankong.png">{{ node.label }}
                    </span>
                </span>
            </el-tree>
        </div>
        <div class="tabs">
            <ul class="tabUl">
                <li v-for="(item, index) in liList" @click="handleChangeColor(index)" :class="currentIndex==index?'active':''">{{item.roomName}}</li>
            </ul>
            <div v-if="currentIndex==0">
                <v-roomPowerReal :giveData="transmitData"></v-roomPowerReal>
            </div>
            <div v-if="currentIndex==1">
                <v-roomPowerHistory :giveData="transmitData"></v-roomPowerHistory>
            </div>
            <div v-if="currentIndex==2">
                <v-roomPowerDevice :giveData="transmitData"></v-roomPowerDevice>
            </div>
            <div v-if="currentIndex==3">
                <v-roomEnegy :giveData="transmitData"></v-roomEnegy>
            </div>
        </div>
    </div>
</template>

<script>
import roomPowerReal from './roomPower/roomPowerReal';
import roomPowerHistory from './roomPower/roomPowerHistory';
import roomPowerDevice from './roomPower/roomPowerDevice';
import roomPowerError from './roomPower/roomPowerError';
import roomEnegy from './roomPower/roomEnegy';
import roomPowerDeviceDetil from './roomPower/roomPowerDeviceDetil'
export default {
    data() {
        return{
            Index: 0,
            isShow: true,
            datas: [],
            defaultProps: {
               children: 'children',
               label: 'roomName'
           },
           buildingId: '',
           transmitData: '',
           liList: [{roomName: '房间实时用电'}, {roomName: '房间历史用电'}, {roomName: '房间设备管控'}, {roomName: '房间能效'}],
           currentIndex: 0
        }
    },
    methods: {
        initTree() {
            let data = {
                buildingId: this.buildingId
            };
            this.$axios.post(`BMPlatServers/common/queryElecRooms`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.datas = res.data.result;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true
                    });
                }
            })
        },
        handleChangeColor(ins) {
            this.currentIndex = ins;
        },
        tabClick(index) {
            this.Index = index.index;
        },
        handleNodeClick(id) {
            this.transmitData = id;
        }
    },
    mounted() {
        this.buildingId = window.location.href.split('=')[1];
        this.isShow = true;
        this.initTree();
    },
    components: {
        'v-roomPowerReal': roomPowerReal,
        'v-roomPowerHistory': roomPowerHistory,
        'v-roomPowerDevice': roomPowerDevice,
        'v-roomPowerError': roomPowerError,
        'v-roomEnegy': roomEnegy,
        'v-roomPowerDeviceDetil': roomPowerDeviceDetil
    }
}
</script>

<style lang="scss" scoped>
#roomPower{
    overflow: hidden;
    .commonTree{
        float: left;
        width: 15%;
        height: 800px;
        overflow: auto;
        border-right: 1px solid #ddd;
        /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
            font-weight: 700;
            color: #3194F8;
        }
    }
    .tabs{
        float: left;
        width: 84%;
        .tabUl{
            overflow: hidden;
            padding-bottom: 20px;
            li{
                float: left;
                margin: 0 20px;
                cursor: pointer;
                border: 1px solid #409eff;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                color: #409eff;
                font-size: 14px;
                padding: 5px 10px;
            }
            li.active{
                background: #409eff;
                color: #fff;
            }
        }
    }
}
</style>
