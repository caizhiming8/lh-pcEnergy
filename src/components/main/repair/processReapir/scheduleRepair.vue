<template>
    <div id="scheduleRepair">
        <div class="scheduleRepair">
            <div class="placeBreadcrumb">
                <div class="BreadcrumbBox">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/processReapir' }">报修管理</el-breadcrumb-item>
                        <el-breadcrumb-item>查看进度</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>

            <div class="details">
                <h4>详情介绍</h4>
                <div class="detailMain">
                    <el-form>
                        <el-row>
                            <el-col :span="4">
                                <el-form-item label="报修人："><p>{{obj.commitName}}</p></el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报修时间："><p>{{obj.commitTime}}</p></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">
                                <el-form-item label="区域："><p>{{obj.buildingName}}</p></el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="地点："><p>{{obj.roomName}}</p></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">
                                <el-form-item label="类型："><p>{{obj.typeComment}}</p></el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="维修项目："><p>{{obj.projectComment}}</p></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">
                                <el-form-item label="维修人："><p>{{obj.repairPerson}}</p></el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式："><p>{{obj.repairPersonPhone}}</p></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="设备名称："><p>{{obj.deviceName}}</p></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="详细描述："><p>{{obj.details}}</p></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="imgurl!=null">
                            <el-col :span="24">
                                <el-image :src="imgurl" class="placeImg"></el-image>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>

            <div class="progress">
                <h4>进度</h4>
                <ul class="bg">
                    <li class="li1">
                        <h6 class="h6-1" v-if="this.state<1"></h6>
                        <h6 class="h6-2" v-if="this.state>=1"></h6>
                        <b class="b1" v-if="this.state<1">报修</b>
                        <span class="span2" v-if="this.state>=1">{{obj.commitName}}通过平台申请保修</span>
                        <b class="b2" v-if="this.state>=1">报修</b>
                        <p class="p2" v-if="this.state>=1">{{obj.commitTime}}</p>
                    </li>
                    <li class="li2">
                        <h6 class="h6-1" v-if="this.state<2"></h6>
                        <h6 class="h6-2" v-if="this.state>=2"></h6>
                        <b class="b1" v-if="this.state<2">委派</b>
                        <span class="span2" v-if="this.state>=2">{{obj.assignName}}将任务分配给了{{obj.repairPerson}}</span>
                        <b class="b2" v-if="this.state>=2">委派</b>
                        <p class="p2" v-if="this.state>=2">{{obj.assignTime}}</p>
                    </li>
                    <li class="li1">
                        <h6 class="h6-1" v-if="this.state<3"></h6>
                        <h6 class="h6-2" v-if="this.state>=3"></h6>
                        <b class="b1" v-if="this.state<3">维修</b>
                        <span class="span2" v-if="this.state>=3">{{obj.repairPerson}}开始维修</span>
                        <b class="b2" v-if="this.state>=3">维修</b>
                        <p class="p2" v-if="this.state>=3">{{obj.assignTime}}</p>
                    </li>
                    <li class="li2">
                        <h6 class="h6-1" v-if="this.state<3"></h6>
                        <h6 class="h6-2" v-if="this.state>=3"></h6>
                        <b class="b1" v-if="this.state<3">完工</b>
                        <span class="span2" v-if="this.state>=3">{{obj.repairPerson}}结束维修</span>
                        <b class="b2" v-if="this.state>=3">完工</b>
                        <p class="p2" v-if="this.state>=3">{{obj.endTime}}</p>
                    </li>
                    <li class="li1">
                        <h6 class="h6-1" v-if="this.state<4"></h6>
                        <h6 class="h6-2" v-if="this.state>=4"></h6>
                        <b class="b1" v-if="this.state<4">评价</b>
                        <span class="span2" v-if="this.state>=4">{{obj.commitName}}做出了评价</span>
                        <b class="b2" v-if="this.state>=4">评价</b>
                        <p class="p2" v-if="this.state>=4">{{obj.evaluateTime}}</p>
                    </li>
                </ul>
            </div>
            <el-button type="primary" @click="goBack" size="small" class="btn">返回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            ids: '',
            obj: {},
            state: 0,
            imgurl: ''
        }
    },
    methods: {
        initData() {
            let data = {
                id: this.ids
            };
            this.$axios.post('BMPlatServers/repair/queryRepairProgress', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.obj = res.data.result.list[0];
                    this.state = res.data.result.list[0].status;
                    this.imgurl = res.data.result.list[0].repairImg;
                }else{
                    this.obj = {};
                    this.state = 0;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        goBack() {
            this.$router.go(-1);
        }
    },
    mounted() {
        this.ids = this.$route.query.inds;
        this.initData();
    }
}
</script>

<style lang="scss" scoped>
#scheduleRepair{
    padding: 20px 0;
    .scheduleRepair{
        padding-bottom: 30px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -ms-box-sizing: border-box;
        -o-box-sizing: border-box;
        width: 98%;
        margin: 0 auto;
        box-shadow: 0 0 6px #ddd;
        -webkit-box-shadow: 0 0 6px #ddd;
        -ms-box-shadow: 0 0 6px #ddd;
        -moz-box-shadow: 0 0 6px #ddd;
        -o-box-shadow: 0 0 6px #ddd;
        .placeBreadcrumb{
            border-bottom: 2px solid #ddd;
            .BreadcrumbBox{
                padding: 20px;
                /deep/ .el-breadcrumb__inner.is-link, .el-breadcrumb__inner a{
                    color: #606266;
                    font-weight: normal;
                }
                /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover{
                    color: #409eff;
                }
            }
        }
        .details{
            padding: 15px 35px 0 50px;
            h4{
                font-weight: normal;
                border-left: 3px solid #409eff;
                padding-left: 18px;
                color: #333;
                font-size: 16px;
            }
            .detailMain{
                padding-left: 35px;
                padding-top: 15px;
                .el-form-item{
                    margin-bottom: 0;
                }
                p{
                    color: #999;
                }
                .placeImg{
                    display: block;
                    width: 200px;
                }
            }
        }
        .progress{
            padding: 15px 35px 0 50px;
            margin-top: 70px;
            h4{
                font-weight: normal;
                border-left: 3px solid #409eff;
                padding-left: 18px;
                color: #333;
                font-size: 16px;
            }
            .bg{
                background: url(../../../../../static/img/jiantou2.png) no-repeat 0;
                background-size: 100% 7%;
                width: 100%;
                height: 280px;
                li{
                    display: block;
                    float: left;
                    width: 20%;
                    height: 140px;
                    text-align: center;
                    position: relative;
                }
                .li1{
                    position: relative;
                    h6.h6-1{
                        background: url(../../../../../static/img/hui2.png) no-repeat 0;
                        background-size: 100% 100%;
                        width: 35px;
                        height: 100%;
                        display: inline-block;
                        position: absolute;
                        left: 47%;
                        top: 120px;
                    }
                    h6.h6-2{
                        background: url(../../../../../static/img/xiangxia.png) no-repeat 0;
                        background-size: 100% 100%;
                        width: 35px;
                        height: 100%;
                        display: inline-block;
                        position: absolute;
                        left: 47%;
                        top: 120px;
                    }
                    .b1{
                        position: absolute;
                        left: 47%;
                        bottom: -144px;
                        color: #BCBCBC;
                    }
                    .p1{
                        position: absolute;
                        color: #BCBCBC;
                        left: 33%;
                        bottom: -164px;
                    }
                    .span1{
                        display: block;
                        color: #BCBCBC;
                        text-align: center;
                        padding-top: 70px;
                    }
                    .b2{
                        position: absolute;
                        left: 47%;
                        bottom: -144px;
                        color: #1296DB;
                        font-weight: 700;
                    }
                    .p2{
                        position: absolute;
                        color: #1296DB;
                        font-weight: 700;
                        left: 33%;
                        bottom: -164px;
                    }
                    .span2{
                        display: block;
                        color: #1296DB;
                        font-weight: 700;
                        text-align: center;
                        padding-top: 70px;
                    }
                }
                .li2{
                    h6.h6-1{
                        background: url(../../../../../static/img/hui2.png) no-repeat 0;
                        background-size: 100% 100%;
                        width: 35px;
                        height: 100%;
                        display: inline-block;
                        position: absolute;
                        left: 47%;
                        top: 20px;
                        -ms-transform:rotate(180deg);
                        -moz-transform:rotate(180deg);
                        -webkit-transform:rotate(180deg);
                        transform:rotate(180deg);
                    }
                    h6.h6-2{
                        background: url(../../../../../static/img/xiangxia.png) no-repeat 0;
                        background-size: 100% 100%;
                        width: 35px;
                        height: 100%;
                        display: inline-block;
                        position: absolute;
                        left: 47%;
                        top: 20px;
                        -ms-transform:rotate(180deg);
                        -moz-transform:rotate(180deg);
                        -webkit-transform:rotate(180deg);
                        transform:rotate(180deg);
                    }
                    .b1{
                        position: absolute;
                        left: 47%;
                        top: -25px;
                        color: #BCBCBC;
                    }
                    .p1{
                        position: absolute;
                        color: #BCBCBC;
                        left: 33%;
                        top: -5px;
                    }
                    .span1{
                        display: block;
                        color: #BCBCBC;
                        text-align: center;
                        padding-top: 175px;
                    }
                    .b2{
                        position: absolute;
                        left: 47%;
                        top: -25px;
                        color: #1296DB;
                        font-weight: 700;
                    }
                    .p2{
                        position: absolute;
                        color: #1296DB;
                        font-weight: 700;
                        left: 33%;
                        top: -5px;
                    }
                    .span2{
                        display: block;
                        color: #1296DB;
                        font-weight: 700;
                        text-align: center;
                        padding-top: 175px;
                    }
                }
            }
        }
        // .repair-ruleForm{
        //     width: 100%;
        //     margin-top: 30px;
        //     padding: 20px;
        //     box-sizing: border-box;
        //     -webkit-box-sizing: border-box;
        //     -moz-box-sizing: border-box;
        //     -ms-box-sizing: border-box;
        //     -o-box-sizing: border-box;
        //     /deep/ .el-step__title.is-process{
        //         font-size: 12px;
        //         font-weight: normal;
        //     }
        //     /deep/ .el-step__title.is-finish{
        //         font-size: 12px;
        //     }
        //     /deep/ .el-step__title.is-wait{
        //         font-size: 12px;
        //     }
        // }
        .btn{
            position: relative;
            left: 50%;
            margin-left: -30px;
            margin-top: 80px;
        }
    }
}
</style>
