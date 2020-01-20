<template>
	<div id="examineContrast">
		<div class="examineContrast">
			<!-- 能效对比 -->
			<div class="tabs">
				<ul class="tabUl">
					<li v-for="(item, index) in List" @click="handleChange(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
				</ul>
				<div v-if="this.currentIndex==0">
					<v-effectContrast></v-effectContrast>
				</div>
				<div v-if="this.currentIndex==1">
					<v-periodicContrast></v-periodicContrast>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import effectContrast from './examineContrast/effectContrast'
import periodicContrast from './examineContrast/periodicContrast'
export default{
	data(){
		return{
			Index: 0,
			activeName:'1',
			List: [{name: '二级单位能效对比'}, {name: '二级单位周期能效对比'}],
			currentIndex: 0
		}
	},
	methods:{
		 tabClick(items) {
			 console.log(items)
		    this.Index = items.index;
		},
		handleChange(ins) {
			this.currentIndex = ins;
		}
	},
	mounted() {

	},
	components:{
		'v-effectContrast': effectContrast,
		'v-periodicContrast': periodicContrast,
	},
	watch:{
		$route(to,from) {
			this.activeName = '1'
			this.Index = 0
		}
	}
}
</script>

<style lang="scss" scoped>
#examineContrast{
	.examineContrast{
		.el-tabs{
		    width: 98%;
		    margin: 20px auto 20px;
		}
		.tabUl{
            overflow: hidden;
            padding-bottom: 0px;
			padding-top: 20px;
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
			li:first-child{
				margin-left: 10px;
			}
        }
	}
}
</style>
