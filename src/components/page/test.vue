<template>
    <div class="">
        <div class="test1" ref="test1"></div>
        <el-button @click="show">显示</el-button>
        <el-button @click="hidden">隐藏</el-button>

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first"></el-tab-pane>
            <el-tab-pane label="配置管理" name="second"></el-tab-pane>
            <el-tab-pane label="角色管理" name="third"></el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth"></el-tab-pane>
        </el-tabs>

        <br>
        <hr>

        <div class="echarts" ref="Echarts1"></div>


        <div class="">
            <el-collapse>
                <el-collapse-item title="一致性 Consistency" name="1">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                    <!-- <el-collapse-item title="内层" name="1-1"> -->
                        <div>内层的数据1</div>
                        <div>内层的数据2</div>
                        <div>内层的数据3</div>
                    <!-- </el-collapse-item> -->
                </el-collapse-item>
                <el-collapse-item title="反馈 Feedback" name="2">
                    <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                    <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
                <el-collapse-item title="效率 Efficiency" name="3">
                    <div>简化流程：设计简洁直观的操作流程；</div>
                    <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                    <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
                </el-collapse-item>
                <el-collapse-item title="可控 Controllability" name="4">
                    <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                    <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
                </el-collapse-item>
            </el-collapse>
        </div>

        <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
            <el-table-column  prop="address" label="地址"></el-table-column>
        </el-table>

        <hr>

        <el-transfer style="text-align: left; display: inline-block" v-model="value" filterable :render-content="renderFunc" :titles="['Source', 'Target']"
            :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
            }" @change="handleChange" :data="data"></el-transfer>

            <hr>
            <hr>

            <el-cascader :options="options" :props="{ multiple: true }" clearable></el-cascader>
            <el-cascader-panel :options="options" :props="{ multiple: true }"></el-cascader-panel>

            <hr><hr><hr>
            <el-button @click="test">测试</el-button>
            <transition-group name="el-zoom-in-top">
                <!-- <div v-show="show2" class="transition-box">.el-zoom-in-top</div> -->
                <div class="box" v-if="isShow" key="1"></div>
                <div class="box" v-if="isShow" key="2"></div>
            </transition-group>

        <div class="test0">
            大家好
        </div>
    </div>
</template>

<script>
export default {
    data() {
        const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`
          });
        }
        return data;
      };
        return{
            isShow: true,
            data: generateData(),
            value: [1],
            value4: [1],
            renderFunc(h, option) {
              return <span>{ option.key } - { option.label }</span>;
            },


            activeName: 'first',
            personAll: "",
            person1: "",


            personAll1: "",
            tableData: [{
                id: 1,
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                id: 2,
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                id: 3,
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄',
                children: [{
                    id: 44,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    id: 45,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }]
            }, {
                id: 4,
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            options: [{label: '张三', value: 1}, {label: '李四', value: 2, children: [{label: "王五", value: 3}, {label: "找一", value: 4}]}, {label: 'wangke', value: 5}]
        }
    },
    methods:{
        init() {
            let myChart1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '报修总量',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.personAll1,
                    subtextStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        type:'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person1), itemStyle:{normal:{color:'#08A9FE'},emphasis:{color:'#08A9FE'}}},
                            {value:Number(this.personAll)-Number(this.person1), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart1.setOption(option1);
        },
        show() {
            startMove(this.$refs.test1, {width: 500, height: 700, left: 200}, function() {

            });
        },
        hidden() {
            startMove(this.$refs.test1, {width: 0, height: 0, left: 0});
        },
        handleClick() {

        },
        handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
        },

        test() {
            this.isShow = !this.isShow;
        }
    },
    mounted() {
        this.personAll = 5;
        this.person1 = 2;
        if(this.personAll == 0) {
            this.person1 = 0
            this.personAll = 1;
            this.personAll1 = 0;
        }else{
            this.personAll1 = this.personAll;
        }
        setTimeout(()=>{
            this.init();
        }, 2000);
    }
}
</script>

<style lang="scss" scoped>
.test1{
    width: 0px;
    height: 0px;
    background: yellow;
    position: relative;
}
/deep/ .el-tabs__nav-wrap:after{
    background: none;
}
.echarts{
    width: 100%;
    height: 300px;
}
.box{
    width: 100px;
    height: 100px;
    background: red;
}
.test0{

}
</style>
