<template>
    <div id="buildingList">
        <div class="buildingList" ref="buildingList">
            <div class="buildingList-left">
                <el-tree :data="data" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>
                            <img src="../../../../static/img/fangjianguankong.png">{{ node.label }}
                        </span>
                    </span>
                </el-tree>
            </div>
            <div class="buildingList-right">
                <ul class="tabUl">
                    <li v-for="(item, index) in liList" @click="handleChangeColor(index)" :class="currentIndex==index?'active':''">{{item.roomName}}</li>
                </ul>
                <v-buildingListReal v-if="currentIndex==0" :giveSonData="ids"></v-buildingListReal>
                <v-buildingListHistory v-if="currentIndex==1" :giveSonData="ids"></v-buildingListHistory>
            </div>
        </div>
    </div>
</template>

<script>
import buildingListReal from './buildingList/buildingListReal';
import buildingListHistory from './buildingList/buildingListHistory';
// import buildingListRoom from './buildingList/buildingListRoom';
export default {
    data() {
        return{
            ids: '',
            Index: 0,
            data: [],
			defaultProps: {
			    children: 'children',
			    label: 'label'
			},
            subSystemId: '',
            liList: [{roomName: '楼宇实时能耗'}, {roomName: '楼宇历史能耗'}],
            currentIndex:0
        }
    },
    methods: {
        tabClick(index) {
            this.Index = index.index;
        },
        handleChangeColor(ins) {
            this.currentIndex = ins;
        },
        handleNodeClick(ids) {
            this.ids = ids;
		},
        initData() {
            let param = {
                subsystemId: this.subSystemId
            };
			this.$axios.post(`BMPlatServers/common/querySubsystemBuildings`, this.$qs.stringify(param)).then((res)=>{
				if(res.data.success){
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            item.children = '';
                        })
                        this.data = res.data.result;
                    }else{
                        this.data = []
                        this.$message.warning('您选择的子系统没有值');
                    }
				}else{
					this.$message.warning(res.data.resultMessage);
				}
			})
		}
    },
    mounted() {
        let Height = document.body.clientHeight || document.documentElement.clientHeight;
        this.$refs.buildingList.style.height = Height - 180 + 'px';
        this.subSystemId = window.location.href.split('=')[1];
        this.initData();
    },
    components: {
        'v-buildingListReal': buildingListReal,
        'v-buildingListHistory': buildingListHistory,
        // 'v-buildingListRoom': buildingListRoom
    }
}
</script>

<style lang="scss" scoped>
#buildingList{
    .buildingList{
        overflow: hidden;
        .buildingList-left{
            float: left;
            width: 14%;
            height: 100%;
            overflow: auto;
            border-right: 1px solid #ddd;
            /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                font-weight: 700;
                color: #2975E6;
            }
        }
        .buildingList-right{
            float: left;
            width: 85%;
            overflow: auto;
        }
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
