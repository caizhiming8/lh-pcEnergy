<template>
	<div id="secondOrderRoom">
		<div class="secondOrderRoom">
			<div class="energyTree">
				<el-tree :data="datas" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick">
					<span class="span-ellipsis" slot-scope="{ node, data }">
                        <span :title="node.label"><img src="../../../../static/img/fangjianguankong.png">{{ node.label }}</span>
                    </span>
				</el-tree>
			</div>
			<div class="tabs">
				<ul class="tabUl">
					<li v-for="(item, index) in List" @click="handleChange(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
				</ul>
				<div v-if="currentIndex==0">
					<v-underlingRoomReal :giveData="transmitData"></v-underlingRoomReal>
				</div>
				<div v-if="currentIndex==1">
					<v-underlingHistoryTime :giveData="transmitData"></v-underlingHistoryTime>
				</div>
				<div v-if="currentIndex==2">
					<v-underlingCycle :giveData="transmitData"></v-underlingCycle>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import underlingRoomReal from './secondOrderRoom/underlingRoomReal';
import underlingHistoryTime from './secondOrderRoom/underlingHistoryTime';
import underlingCycle from './secondOrderRoom/underlingCycle';
export default {
	data() {
		return {
			List: [{name: '实时能耗能效'}, {name: '历史能耗能效'}, {name: '历史周期能耗能效'}],
			Index: 0,
			datas: [],
			defaultProps: {
			  children: 'children',
			  label: 'label'
			},
			transmitData: '',
			school: '',
			currentIndex: 0
		}
	},
	methods:{
		handleChange(ins) {
			this.currentIndex = ins;
		},
		/* 系统选择 */
		system(){
			let data = {
				depart:this.school
			}
			this.$axios.post(`BMPlatServers/common/querydepartrooms`,this.$qs.stringify(data)).then((res) =>{
				if(res.data.success){
					if(res.data.result && res.data.result.length) {
					    this.datas = res.data.result;
					}else{
					    this.datas = []
					    this.$message.warning('您选择的子系统没有值');
					}
				}else{
					this.datas = []
					this.$message.warning(res.data.resultMessage)
				}
			});
		},
		tabClick(index) {
		    this.Index = index.index;
		},
		handleNodeClick(data) {
			this.transmitData = data;
		},
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.system()
	},
	components: {
	    'v-underlingRoomReal': underlingRoomReal,
	    'v-underlingHistoryTime': underlingHistoryTime,
	    'v-underlingCycle': underlingCycle,
	}
}
</script>
<style  lang="scss" scoped>
#secondOrderRoom{
	overflow: hidden;
	.energyTree{
		float: left;
		width: 15%;
		height: 700px;
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
		margin: 20px auto 20px;
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
                font-size: 12px;
                padding: 7px 15px;
            }
            li.active{
                background: #409eff;
                color: #fff;
            }
        }
	}
	.el-tabs__header{
		margin-left: 15px;
	}
}
</style>
