<template>
    <div id="evaluate">
        <div class="evaluate">
            <div class="evaluate-left">
                <el-table :data="tableData" border style="width: 100%;margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px'}">
                    <el-table-column label="回访评价" align='center' show-overflow-tooltip>
                        <template slot-scope="scope">
                            <img :src="'../../../../../static/img/'+scope.row.icon">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="person" label="人数" align='center' show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="evaluate-right">
                <div class="echarts" ref="Echarts"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tableData: [],
            numbers: 0,
            dataName: [],
            dataValue: []
        }
    },
    methods:{
        init() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts);
            let option1 = {
                title: {
                    top: '45%',
                    left: 'center',
                    text: '评价数',
                    textStyle: {
                        color: '#666',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 14
                    },
                    subtext: ''+this.numbers,
                    subtextStyle: {
                        color: '#666',
                        fontSize: 12
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: '15px',
                    data: this.dataName
                },
                tooltip: {
                    trigger: 'item',
                    // formatter: function(res) {
                    //     if (res.componentSubType == 'liquidFill') {
                    //         return res.seriesName + ': ' + (res.value * 10000 / 100).toFixed(2) + '%';
                    //     } else {
                    //         return '<span class="ii" style="background:' + res.color + ' "></span>' + res.name + ':<br/> ' + res.data.value + '人';
                    //     }
                    // }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['45%', '75%'],
                        color: ['#FCC667', '#BC8DEE','#F66F6F', '#2DA8E8', '#B5B5B5'],
                        hoverAnimation: false,
                        label: {
                            show: true,
                            normal: {
                                formatter: '{b}: {c}人\n {d}%',
                                show: true,
                                position: ''
                            },
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: '#fff',
                            },
                            emphasis: {
                                borderWidth: 0,
                                shadowBlur: 2,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: this.dataValue
                    }
                ]
            }
            myEcharts1.setOption(option1);
        },
        initData() {
            this.$axios.post('BMPlatServers/repair/queryRepairStar').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableData = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            // table表格的数据
                            if(item.result!='all') {
                                if(item.result ==1) {
                                    this.tableData.push({person: item.num, name: '极差', icon: 'jicha2.png'});
                                }else if(item.result ==2) {
                                    this.tableData.push({person: item.num, name: '失望', icon: 'shiwang2.png'});
                                }else if(item.result ==3) {
                                    this.tableData.push({person: item.num, name: '一般', icon: 'yiban2.png'});
                                }else if(item.result ==4) {
                                    this.tableData.push({person: item.num, name: '满意', icon: 'manyi2.png'});
                                }else if(item.result ==5) {
                                    this.tableData.push({person: item.num, name: '惊喜', icon: 'jingxi2x.png'});
                                };
                            }else{
                                this.numbers = item.num;
                            }
                        })
                    }
                    this.pieInit();
                }
            })
        },
        pieInit() {
            this.dataName = [];
            this.dataValue = [];
            if(this.tableData && this.tableData.length) {
                this.tableData.forEach((item)=>{
                    this.dataName.push(item.name);
                    this.dataValue.push({name: item.name, value: item.person})
                })
            }else{
                this.dataName.push('无人评价');
                this.dataValue.push({name: '无人评价', value: 0})
            }
            this.init();
        }
    },
    mounted() {
        this.initData();
    }
}
</script>

<style lang="scss" scoped>
#evaluate{
    .evaluate{
        .evaluate-left{
            float: left;
            width: 50%;
            height: 100%;
            padding: 50px 20px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            img{
                width: 20px;
                height: 20px;
            }
        }
        .evaluate-right{
            float: left;
            width: 50%;
            padding: 50px 20px;
            border-left: 1px solid #ddd;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .echarts{
                width: 100%;
                height: 300px;
            }
        }
    }
}
</style>
