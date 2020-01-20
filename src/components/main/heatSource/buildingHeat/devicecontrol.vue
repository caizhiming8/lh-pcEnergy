<template>
    <div id="devicecontrol">
        <div class="devicecontrol">
            <h4>
                <el-button type="primary" size="small" @click="refresh">刷新</el-button>
            </h4>
            <ul>
                <li v-for="(item, index) in datalist" @click.stop="handleClick(item, index)">
                    <div class="innerLi" :class="liIndex==index?'active':''">
                        <i class="iconfont icon-duihao icon" v-if="liIndex==index"></i>
                        <div class="li-top">
                            <p :class="liIndex==index? 'active' : '' ">
                                <el-tooltip class="item" effect="dark" :content="item.deviceName" placement="top-start">
                                    <b>{{item.deviceName}}</b>
                                </el-tooltip>
                            </p>
                        </div>
                        <div class="li-main">
                            <div class="li-main-left">
                                <p>模式：{{item.data50 == undefined ? "-" : item.data50.value == 1 ? "自动" : item.data50.value == 0 ? "手动" : "-"}}</p>
                                <p class="p1">温度：{{item.temdata1 == undefined ? "-" : item.temdata1.value}}℃</p>
                                <p class="p1">湿度：{{item.temdata2 == undefined ? "-" :  item.temdata2.value}}%RH</p>
                            </div>
                            <div class="li-main-right">
                                <p>开度：{{item.data1 == undefined ? "-" : item.data1.value}}%</p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <el-dialog title="电动阀控制面板" :visible.sync="dialogVisible" width="50%">
                <div class="dialog-main">
                    <div>
                        <p>当前模式： {{objData.data50 == undefined ? "-" : objData.data50.value == 1 ? "自动模式" : objData.data50.value == 0 ? "手动模式" : "-"}}</p>
                    </div>
                    <div class="dialog-main-top">
                        <p>模式</p>
                        <div class="btns">
                            <span v-for="(item, index) in List" @click="modle(index)" :class="currentIndexs==index?'active':''">{{item.name}}</span>
                        </div>
                    </div>
                    <ol class="ol3" v-if="isShow">
                        <li v-for="(item, index) in modlelist" @click="innerClick(item, index)" :class="innerIndex==index?'active':''">{{item.name}}</li>
                    </ol>
                    <!-- 手动模式下 -->
                    <div class="dialog-main-border" v-if="currentIndexs==0">
                        <div class="Dleft">
                            <div class="Dleft-bott">
                                <a>开度反馈</a>
                                <i>{{Number(objData.data1 == undefined ? "-" : objData.data1.value)}}%</i>
                            </div>
                        </div>
                        <div class="Dright">
                            <div class="Dright-bott">
                                <el-slider v-model="sliderValue" :disabled="isDisabled"></el-slider>
                            </div>
                        </div>
                    </div>

                    <!-- 时间段开度模式下 -->
                    <div class="dialog-main-border" v-if="currentIndexs==1">
                        <div v-if="show1==1">
                            <span class="span1">自动控温：</span>
                            <el-input v-model="templatrue"></el-input>
                        </div>
                        <div v-if="show1==2">
                            <ol class="ol1">
                                <li>时段</li>
                                <li>时段启动</li>
                                <li>时段停止</li>
                                <li>设定值</li>
                                <li>开启</li>
                            </ol>
                            <ol class="ol2">
                                <li>一时段</li>
                                <li class="li2"> <el-time-picker class="timePicker" clear-icon="" v-model="startTime1" :picker-options="{selectableRange: `00:00:00 -${endTime1 ? endTime1+':00' : '23:59:59'}`}" value-format="HH:mm" format='HH:mm' placeholder="开始时间"></el-time-picker> </li>
                                <li class="li2"> <el-time-picker class="timePicker" clear-icon="" v-model="endTime1" :picker-options="{selectableRange:`${startTime1 ? startTime1+':00' : '00:00:00'}-23:59:59`}" value-format="HH:mm" format='HH:mm' placeholder="结束时间"></el-time-picker> </li>
                                <li class="li2"> <el-input class="timePicker inputs" v-model="input1" placeholder="设定值"></el-input>℃ </li>
                                <li><el-checkbox v-model="checked1"></el-checkbox></li>
                            </ol>
                            <ol class="ol2">
                                <li>二时段</li>
                                <li class="li2"> <el-time-picker class="timePicker" clear-icon="" v-model="startTime2" :picker-options="{selectableRange: `00:00:00 -${endTime2 ? endTime2+':00' : '23:59:59'}`}" value-format="HH:mm" format='HH:mm' placeholder="开始时间"></el-time-picker> </li>
                                <li class="li2"> <el-time-picker class="timePicker" clear-icon="" v-model="endTime2" :picker-options="{selectableRange:`${startTime2 ? startTime2+':00' : '00:00:00'}-23:59:59`}" value-format="HH:mm" format='HH:mm' placeholder="结束时间"></el-time-picker> </li>
                                <li class="li2"> <el-input class="timePicker inputs" v-model="input2" placeholder="设定值"></el-input>℃ </li>
                                <li><el-checkbox v-model="checked2"></el-checkbox></li>
                            </ol>
                            <ol class="ol2">
                                <li>三时段</li>
                                <li class="li2"> <el-time-picker class="timePicker" clear-icon="" v-model="startTime3" :picker-options="{selectableRange: `00:00:00 -${endTime3 ? endTime3+':00' : '23:59:59'}`}" value-format="HH:mm" format='HH:mm' placeholder="开始时间"></el-time-picker> </li>
                                <li class="li2"> <el-time-picker class="timePicker" clear-icon="" v-model="endTime3" :picker-options="{selectableRange:`${startTime3 ? startTime3+':00' : '00:00:00'}-23:59:59`}" value-format="HH:mm" format='HH:mm' placeholder="结束时间"></el-time-picker> </li>
                                <li class="li2"> <el-input class="timePicker inputs" v-model="input3" placeholder="设定值"></el-input>℃ </li>
                                <li><el-checkbox v-model="checked3"></el-checkbox></li>
                            </ol>
                            <ol class="ol2">
                                <li>四时段</li>
                                <li class="li2"> <el-time-picker class="timePicker" clear-icon="" v-model="startTime4" :picker-options="{selectableRange: `00:00:00 -${endTime4 ? endTime4+':00' : '23:59:59'}`}" value-format="HH:mm" format='HH:mm' placeholder="开始时间"></el-time-picker> </li>
                                <li class="li2"> <el-time-picker class="timePicker" clear-icon="" v-model="endTime4" :picker-options="{selectableRange:`${startTime4 ? startTime4+':00' : '00:00:00'}-23:59:59`}" value-format="HH:mm" format='HH:mm' placeholder="结束时间"></el-time-picker> </li>
                                <li class="li2"> <el-input class="timePicker inputs" v-model="input4" placeholder="设定值"></el-input>℃ </li>
                                <li><el-checkbox v-model="checked4"></el-checkbox></li>
                            </ol>
                        </div>
                        <div v-if="show1==3">
                            <div class="ul1">
                                <p class="li1"> &nbsp; </p>
                                <p class="li1">室外温度</p>
                                <p class="li1">供水温度</p>
                                <p class="li1">室外温度</p>
                                <p class="li1">供水温度</p>
                            </div>
                            <div class="ul3">
                                <p class="li3">曲线1</p>
                                <p class="li3">
                                    <el-input v-model="in1"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in2"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in3"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in4"></el-input>
                                </p>
                            </div>
                            <div class="ul3">
                                <p class="li3">曲线2</p>
                                <p class="li3">
                                    <el-input v-model="in5"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in6"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in7"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in8"></el-input>
                                </p>
                            </div>
                            <div class="ul3">
                                <p class="li3">曲线3</p>
                                <p class="li3">
                                    <el-input v-model="in9"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in10"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in11"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in12"></el-input>
                                </p>
                            </div>
                            <div class="ul3">
                                <p class="li3">曲线4</p>
                                <p class="li3">
                                    <el-input v-model="in13"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in14"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in15"></el-input>
                                </p>
                                <p class="li3">
                                    <el-input v-model="in16"></el-input>
                                </p>
                            </div>
                            <div class="ul4">
                                <span>气候补偿温度：</span>
                                <el-input v-model="in17"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="makeSure" size="small">确 定</el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
export default{
    data() {
        return{
            dialogVisible: false,
            openList: [{name: '开', icon: 'iconfont icon-shanguangdengdakai'}, {name: '关', icon: 'iconfont icon-tubiaolunkuo-'}],
            currenIndex: 0,
            sliderValue: 0,
            backwater: '',
            pressure: '',
            startTime: '',
            endTime: '',
            buildingId: '',
            datalist: [],
            objData: {data1: {value: ''}, data2: {value: ''}, data3: {value: ''}, data4: {value: ''}, data5: {value: ''}, data6: {value: ''}, data7: {value: ''}, data8: {value: ''}, data9: {value: ''}},
            modlelist: [{name: '自动控制'}, {name: '分时段控制'}, {name: '气候补偿'}],
            isOpen: 0,
            isDisabled: false,
            rangeTime: '',
            liIndex: 0,
            currentIndex: 0,
            List: [{name: '手动'}, {name: '自动模式'}],
            startTime1: '',
            endTime1: '',
            input1: '',
            checked1: false,
            startTime2: '',
            endTime2: '',
            input2: '',
            checked2: false,
            startTime3: '',
            endTime3: '',
            input3: '',
            checked3: false,
            startTime4: '',
            endTime4: '',
            input4: '',
            checked4: false,
            startTime5: '',
            endTime5: '',
            input5: '',
            checked5: false,
            startTime6: '',
            endTime6: '',
            input6: '',
            checked6: false,
            templatrue: '',

            StartTime1: '',
            EndTime1: '',
            Input1: '',
            Checked1: false,
            StartTime2: '',
            EndTime2: '',
            Input2: '',
            Checked2: false,
            StartTime3: '',
            EndTime3: '',
            Input3: '',
            Checked3: false,
            StartTime4: '',
            EndTime4: '',
            Input4: '',
            Checked4: false,
            StartTime5: '',
            EndTime5: '',
            Input5: '',
            Checked5: false,
            StartTime6: '',
            EndTime6: '',
            Input6: '',
            Checked6: false,
            currentIndexs: -1,
            innerIndex: -1,
            isShow: false,
            show1: 0,

            temperature: '',
            notTime: '',
            openingFeedback: '',
            returnWaterTemperature: '',
            objData1: {data23: {}, data24: {}, data25: {}, data26: {},
                            data29: {}, data30: {}, data31: {}, data32: {},
                            data33: {}, data34: {}, data35: {}, data36: {}, data37: {}, data38: {},
                            data39: {}, data40: {}, data41: {}, data42: {}, data43: {}, data44: {},data46: {}, data48: {},
                            data54: {},data55: {}, data56: {}, data57: {}},  //重新拼好的对象扔给后台
            objData2: {
                data6: {}, data7: {}, data8: {}, data9: {}, data10: {}, data11: {}, data12: {},
                data13: {}, data14: {}, data15: {}, data16: {}, data17: {}, data18: {},
                data19: {}, data20: {}, data21: {}, data22: {}, data46: {}, data49: {}
            },
            starttimeNum1: 0,
            starttimeNum2: 0,
            starttimeNum3: 0,
            starttimeNum4: 0,
            endtimeNum1: 0,
            endtimeNum2: 0,
            endtimeNum3: 0,
            endtimeNum4: 0,
            inputNum1: 0,
            inputNum2: 0,
            inputNum3: 0,
            inputNum4: 0,
            in1: '',
            in2: '',
            in3: '',
            in4: '',
            in5: '',
            in6: '',
            in7: '',
            in8: '',
            in9: '',
            in10: '',
            in11: '',
            in12: '',
            in13: '',
            in14: '',
            in15: '',
            in16: '',
            in17: '',

            inNum1: 0,
            inNum2: 0,
            inNum3: 0,
            inNum4: 0,
            inNum5: 0,
            inNum6: 0,
            inNum7: 0,
            inNum8: 0,
            inNum9: 0,
            inNum10: 0,
            inNum11: 0,
            inNum12: 0,
            inNum13: 0,
            inNum14: 0,
            inNum15: 0,
            inNum16: 0,
            inNum17: 0,
            systemId: '',
            subsystemId: ''
        }
    },
    methods: {
        initData() {
            let data = {
                buildingId: this.buildingId,
                flag: 5,
                systemId: this.systemId,
                subsystemId: this.subsystemId
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryHvacControlDevices`, this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        this.datalist = res.data.result.list;
                        this.$Nprogress.done();
                    }else{
                        this.datalist = [];
                    }
                }else{
                    this.datalist = [];
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            });
        },

        // 页面刷新
        refresh() {
            this.$Nprogress.done();
            this.$Nprogress.start();
            let data = {
                buildingId: this.buildingId,
                flag: 5,
                systemId: this.systemId,
                subsystemId: this.subsystemId
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryHvacControlDevices`, this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        this.datalist = res.data.result.list;
                    }else{
                        this.datalist = [];
                    }
                    if(res.data.result.orderlist && res.data.result.orderlist.length) {
                        this.$message.warning({
                            message: '含有为完成的下空命令',
                            showClose: true,
                            duration: 1000
                        })
                    }
                    this.$Nprogress.done();
                }else{
                    this.$Nprogress.done();
                    this.datalist = [];
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            });
        },

        // 设备提交按钮
        makeSure() {
            this.open();
        },
        open() {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                switch (Number(this.currentIndexs)) {
                    case 0:     // 手动模式
                        let obj = {data2: {}, data45: {}};
                        if(this.sliderValue != this.objData.data2.value) {
                            obj.data2.isPulse = this.objData.data2.isPulse;
                            obj.data2.name = this.objData.data2.name;
                            obj.data2.value = Number(this.sliderValue);
                        }
                        if(this.currentIndexs != this.objData.data50.value) {
                            obj.data45.name = this.objData.data45.name;
                            obj.data45.isPulse = this.objData.data45.isPulse;
                            obj.data45.value = 1;
                        }
                        for(let key in obj) {
                            if(obj[key].value == undefined) {
                                delete obj[key];
                            }
                        }
                        this.submit(obj);
                        break;
                    case 1:
                        if(this.show1 == 1) {     //自动控制模式
                            let obj = {data5: {}, data46: {}, data47: {}, data48: {}, data49:{}};
                            if(this.objData.data50.value != 1) {
                                obj.data46.name = this.objData.data46.name;
                                obj.data46.isPulse = this.objData.data46.isPulse;
                                obj.data46.value = 1;
                            }
                            if(this.objData.data51.value != 1) {
                                obj.data47.name = this.objData.data47.name;
                                obj.data47.isPulse = this.objData.data47.isPulse;
                                obj.data47.value = 1;
                            }
                            if(this.templatrue != this.objData.data5.value) {
                                obj.data5.name = this.objData.data5.name;
                                obj.data5.isPulse = this.objData.data5.isPulse;
                                obj.data5.value = this.templatrue;
                            }
                            for(let key in obj) {
                                if(obj[key].value == undefined) {
                                    delete obj[key];
                                }
                            }
                            this.submit(obj);
                        }else if(this.show1 == 2) {   // 分时段控制模式
                            if(this.objData.data50.value != 1) {
                                this.objData1.data46.name = this.objData.data46.name;
                                this.objData1.data46.isPulse = this.objData.data46.isPulse;
                                this.objData1.data46.value = 1;
                            }
                            if(this.objData.data52.value != 1) {
                                this.objData1.data48.name = this.objData.data48.name;
                                this.objData1.data48.isPulse = this.objData.data48.isPulse;
                                this.objData1.data48.value = 1;
                            }

                            if(this.objData.data54.value != this.checked1 ? 1 : 0) {
                                this.objData1.data54.value = this.checked1 ? 1 : 0;
                                this.objData1.data54.name = this.objData.data54.name;
                                this.objData1.data54.isPulse = this.objData.data54.isPulse;
                            }
                            if(this.objData.data55.value != this.checked2 ? 1 : 0) {
                                this.objData1.data55.value = this.checked2 ? 1 : 0;
                                this.objData1.data55.name = this.objData.data55.name;
                                this.objData1.data55.isPulse = this.objData.data55.isPulse;
                            }
                            if(this.objData.data56.value != this.checked3 ? 1 : 0) {
                                this.objData1.data56.value = this.checked3 ? 1 : 0;
                                this.objData1.data56.name = this.objData.data56.name;
                                this.objData1.data56.isPulse = this.objData.data56.isPulse;
                            }
                            if(this.objData.data57.value != this.checked4 ? 1 : 0) {
                                this.objData1.data57.value = this.checked4 ? 1 : 0;
                                this.objData1.data57.name = this.objData.data57.name;
                                this.objData1.data57.isPulse = this.objData.data57.isPulse;
                            }
                            for(let key in this.objData1) {
                                if(this.objData1[key].value == undefined) {
                                    delete this.objData1[key];
                                }
                            }
                            this.submit(this.objData1);
                        }else if(this.show1 == 3) {   // 气候补偿模式
                            if(this.objData.data50.value != 1) {
                                this.objData2.data46.name = this.objData.data46.name;
                                this.objData2.data46.isPulse = this.objData.data46.isPulse;
                                this.objData2.data46.value = 1;
                            }
                            if(this.objData.data53.value != 1) {
                                this.objData2.data49.name = this.objData.data49.name;
                                this.objData2.data49.isPulse = this.objData.data49.isPulse;
                                this.objData2.data49.value = 1;
                            }
                            for(let key in this.objData2) {
                                if(this.objData2[key].value == undefined) {
                                    delete this.objData2[key];
                                }
                            }
                            this.submit(this.objData2);
                        }
                        break;
                }
            })
        },
        submit(obj) {
            this.dialogVisible = false;
            obj.buildingId = this.objData.buildingId;
            obj.deviceId = this.objData.deviceId;
            obj.deviceType = this.objData.deviceType;
            obj.floorId = this.objData.floorId;
            obj.roomId = this.objData.roomId;
            let params = {
                map: JSON.stringify(obj)
            }
            this.$axios.post(`BMPlatServers/hvacheat/commitHvacControl`, this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                this.objData1 = {data23: {}, data24: {}, data25: {}, data26: {},
                        data29: {}, data30: {}, data31: {}, data32: {},
                        data33: {}, data34: {}, data35: {}, data36: {}, data37: {}, data38: {},
                        data39: {}, data40: {}, data41: {}, data42: {}, data43: {}, data44: {},data46: {}, data48: {},
                        data54: {},data55: {}, data56: {}, data57: {}
                    };
                this.objData2 = {
                    data6: {}, data7: {}, data8: {}, data9: {}, data10: {}, data11: {}, data12: {},
                    data13: {}, data14: {}, data15: {}, data16: {}, data17: {}, data18: {},
                    data19: {}, data20: {}, data21: {}, data22: {}, data46: {}, data49: {}
                };
                this.starttimeNum1 = 0;
                this.endtimeNum1 = 0;
                this.inputNum1 = 0;
                this.starttimeNum2 = 0;
                this.endtimeNum2 = 0;
                this.inputNum2 = 0;
                this.starttimeNum3 = 0;
                this.endtimeNum3 = 0;
                this.inputNum3 = 0;
                this.starttimeNum4 = 0;
                this.endtimeNum4 = 0;
                this.inputNum4 = 0;
                this.inNum1 = 0;
                this.inNum2 = 0;
                this.inNum3 = 0;
                this.inNum4 = 0;
                this.inNum5 = 0;
                this.inNum6 = 0;
                this.inNum7 = 0;
                this.inNum8 = 0;
                this.inNum9 = 0;
                this.inNum10 = 0;
                this.inNum11 = 0;
                this.inNum12 = 0;
                this.inNum13 = 0;
                this.inNum14 = 0;
                this.inNum15 = 0;
                this.inNum16 = 0;
                this.inNum17 = 0;
                if(res.data.success) {
                    this.$message.success({
                        message: res.data.result.result,
                        showClose: true,
                        duration: 1000
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
        },

        // 点击li标签触发的方法
        handleClick(item, i) {
            this.liIndex = i;
            this.dialogVisible = true;
            this.objData = item;  //用于拼对象传给后台
            //开度
            this.sliderValue = item.data2 == undefined ? 0 : Number(item.data2.value);
            // 控温
            this.templatrue = this.objData.data5 == undefined ? "-" : this.objData.data5.value;
            // 分时段控制
            this.startTime1 = `${this.objData.data29.value}:${this.objData.data30.value}`;
            this.endTime1 = `${this.objData.data31.value}:${this.objData.data32.value}`;
            this.input1 = this.objData.data23.value;
            this.checked1 = this.objData.data58.value == 1 ? true : false;
            this.startTime2 = `${this.objData.data33.value}:${this.objData.data34.value}`;
            this.endTime2 = `${this.objData.data35.value}:${this.objData.data36.value}`;
            this.input2 = this.objData.data24.value;
            this.checked2 = this.objData.data59.value == 1 ? true : false;
            this.startTime3 = `${this.objData.data37.value}:${this.objData.data38.value}`;
            this.endTime3 = `${this.objData.data39.value}:${this.objData.data40.value}`;
            this.input3 = this.objData.data15.value;
            this.checked3 = this.objData.data60.value == 1 ? true : false;
            this.startTime4 = `${this.objData.data41.value}:${this.objData.data42.value}`;
            this.endTime4 = `${this.objData.data43.value}:${this.objData.data44.value}`;
            this.input4 = this.objData.data26.value;
            this.checked4 = this.objData.data61.value == 1 ? true : false;
            // 气候补偿控制
            this.in1 = this.objData.data6.value;
            this.in2 = this.objData.data7.value;
            this.in3 = this.objData.data8.value;
            this.in4 = this.objData.data9.value;
            this.in5 = this.objData.data10.value;
            this.in6 = this.objData.data11.value;
            this.in7 = this.objData.data12.value;
            this.in8 = this.objData.data13.value;
            this.in9 = this.objData.data14.value;
            this.in10 = this.objData.data15.value;
            this.in11 = this.objData.data16.value;
            this.in12 = this.objData.data17.value;
            this.in13 = this.objData.data18.value;
            this.in14 = this.objData.data19.value;
            this.in15 = this.objData.data20.value;
            this.in16 = this.objData.data21.value;
            this.in17 = this.objData.data22.value;
            if(item.data50 == undefined) {
                this.currentIndexs = -1
            }else if(item.data50.value == 0) {
                this.currentIndexs = 0;
            }else if(item.data50.value == 1) {
                this.currentIndexs = 1;
                if(item.data51.value == 1) {
                    this.innerIndex = 0;
                    this.show1 = 1;
                }else if(item.data52.value == 1) {
                    this.innerIndex = 1;
                    this.show1 = 2;
                }else if(item.data53.value == 1) {
                    this.innerIndex = 2;
                    this.show1 = 3;
                }
            }
        },
        innerClick(item, i) {
            this.innerIndex = i;
            if(i == 0) {
                this.show1 = 1;
            }else if(i == 1) {
                this.show1 = 2;
            }else if(i == 2) {
                this.show1 = 3;
            }
        },

        modle(i) {
            this.currentIndexs = i;
            this.isOpen = i;
        }
    },
    mounted() {
        this.$Nprogress.start();
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.initData();
    },
    beforeDestroy() {
        this.$Nprogress.done();
    },
    watch: {
        pressure(oldData) {
            this.pressure = this.pressure.toString().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, '');
        },
        backwater(oldData) {
            this.backwater = this.backwater.toString().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, '');
        },
        temperature() {
            this.temperature = (''+this.temperature).replace(/[^\d.]/g,'');
        },
        notTime() {
            this.notTime = (''+this.notTime).replace(/[^\d.]/g,'');
        },
        input1() {
            this.input1 = (''+this.input1).replace(/[^\d.]/g,'');
        },
        currenIndex(newData) {
            if(newData == 0) {
                this.isDisabled = false;
            }else{
                this.isDisabled = true;
            }
        },
        rangeTime(newData) {
            if(newData == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = newData[0];
                this.endTime = newData[1];
            }
        },

        sliderValue(oldData) {
            this.openingFeedback = oldData;
        },
        currentIndexs(oldData) {
            if(oldData == 0) {
                this.isShow = false;
            }else if(oldData == 1) {
                this.isShow = true;
            }
        },

        startTime1(oldData) {
            if(this.starttimeNum1 == 0) {
                this.starttimeNum1++;
            }else{
                this.objData1.data29.name = this.objData.data29.name;
                this.objData1.data29.value = oldData.split(":")[0];
                this.objData1.data29.isPulse = this.objData.data29.isPulse;
                this.objData1.data30.name = this.objData.data30.name;
                this.objData1.data30.value = oldData.split(":")[1];
                this.objData1.data30.isPulse = this.objData.data30.isPulse;
            }
        },
        endTime1(oldData) {
            if(this.endtimeNum1 == 0) {
                this.endtimeNum1++;
            }else{
                this.objData1.data31.value = oldData.split(":")[0];
                this.objData1.data31.name = this.objData.data31.name;
                this.objData1.data31.isPulse = this.objData.data31.isPulse;
                this.objData1.data32.value = oldData.split(":")[1];
                this.objData1.data32.name = this.objData.data32.name;
                this.objData1.data32.isPulse = this.objData.data32.isPulse;
            }
        },
        input1(oldData) {
            if(this.inputNum1 == 0) {
                this.inputNum1++;
            }else{
                this.objData1.data23.value = oldData;
                this.objData1.data23.name = this.objData.data23.name;
                this.objData1.data23.isPulse = this.objData.data23.isPulse;
            }
        },

        startTime2(oldData) {
            if(this.starttimeNum2 == 0) {
                this.starttimeNum2++;
            }else{
                this.objData1.data33.value = oldData.split(":")[0];
                this.objData1.data33.name = this.objData.data33.name;
                this.objData1.data33.isPulse = this.objData.data33.isPulse;
                this.objData1.data34.name = this.objData.data34.name;
                this.objData1.data34.isPulse = this.objData.data34.isPulse;
                this.objData1.data34.value = oldData.split(":")[1];
            }
        },
        endTime2(oldData) {
            if(this.endtimeNum2 == 0) {
                this.endtimeNum2++;
            }else{
                this.objData1.data35.value = oldData.split(":")[0];
                this.objData1.data35.name = this.objData.data35.name;
                this.objData1.data35.isPulse = this.objData.data35.isPulse;
                this.objData1.data36.value = oldData.split(":")[1];
                this.objData1.data36.name = this.objData.data36.name;
                this.objData1.data36.isPulse = this.objData.data36.isPulse;
            }
        },
        input2(oldData) {
            if(this.inputNum2 == 0) {
                this.inputNum2++;
            }else{
                this.objData1.data24.value = oldData;
                this.objData1.data24.name = this.objData.data24.name;
                this.objData1.data24.isPulse = this.objData.data24.isPulse;
            }
        },
        startTime3(oldData) {
            if(this.starttimeNum3 == 0) {
                this.starttimeNum3++;
            }else{
                this.objData1.data37.value = oldData.split(":")[0];
                this.objData1.data37.name = this.objData.data37.name;
                this.objData1.data37.isPulse = this.objData.data37.isPulse;
                this.objData1.data38.value = oldData.split(":")[1];
                this.objData1.data38.name = this.objData.data38.name;
                this.objData1.data38.isPulse = this.objData.data38.isPulse;
            }
        },
        endTime3(oldData) {
            if(this.endtimeNum3 == 0) {
                this.endtimeNum3++;
            }else{
                this.objData1.data39.value = oldData.split(":")[0];
                this.objData1.data39.name = this.objData.data39.name;
                this.objData1.data39.isPulse = this.objData.data39.isPulse;
                this.objData1.data40.value = oldData.split(":")[1];
                this.objData1.data40.name = this.objData.data40.name;
                this.objData1.data40.isPulse = this.objData.data40.isPulse;
            }
        },
        input3(oldData) {
            if(this.inputNum3 == 0) {
                this.inputNum3++;
            }else{
                this.objData1.data25.value = oldData;
                this.objData1.data25.name = this.objData.data25.name;
                this.objData1.data25.isPulse = this.objData.data25.isPulse;
            }
        },
        startTime4(oldData) {
            if(this.starttimeNum4 == 0) {
                this.starttimeNum4++;
            }else{
                this.objData1.data41.value = oldData.split(":")[0];
                this.objData1.data41.name = this.objData.data41.name;
                this.objData1.data41.isPulse = this.objData.data41.isPulse;
                this.objData1.data42.value = oldData.split(":")[1];
                this.objData1.data42.name = this.objData.data42.name;
                this.objData1.data42.isPulse = this.objData.data42.isPulse;
            }
        },
        endTime4(oldData) {
            if(this.endtimeNum4 == 0) {
                this.endtimeNum4++;
            }else{
                this.objData1.data43.value = oldData.split(":")[0];
                this.objData1.data43.name = this.objData.data43.name;
                this.objData1.data43.isPulse = this.objData.data43.isPulse;
                this.objData1.data44.value = oldData.split(":")[1];
                this.objData1.data44.name = this.objData.data44.name;
                this.objData1.data44.isPulse = this.objData.data44.isPulse;
            }
        },
        input4(oldData) {
            if(this.inputNum4 == 0) {
                this.inputNum4++;
            }else{
                this.objData1.data26.value = oldData;
                this.objData1.data26.name = this.objData.data26.name;
                this.objData1.data26.isPulse = this.objData.data26.isPulse;
            }
        },

        in1(oldData) {
            if(this.inNum1 == 0) {
                this.inNum1++;
            }else{
                this.objData2.data6.value = oldData;
                this.objData2.data6.name = this.objData.data6.name;
                this.objData2.data6.isPulse = this.objData.data6.isPulse;
            }
        },
        in2(oldData) {
            if(this.inNum2 == 0) {
                this.inNum2++;
            }else{
                this.objData2.data7.value = oldData;
                this.objData2.data7.name = this.objData.data7.name;
                this.objData2.data7.isPulse = this.objData.data7.isPulse;
            }
        },
        in3(oldData) {
            if(this.inNum3 == 0) {
                this.inNum3++;
            }else{
                this.objData2.data8.value = oldData;
                this.objData2.data8.name = this.objData.data8.name;
                this.objData2.data8.isPulse = this.objData.data8.isPulse;
            }
        },
        in4(oldData) {
            if(this.inNum4 == 0) {
                this.inNum4++;
            }else{
                this.objData2.data9.value = oldData;
                this.objData2.data9.name = this.objData.data9.name;
                this.objData2.data9.isPulse = this.objData.data9.isPulse;
            }
        },
        in5(oldData) {
            if(this.inNum5 == 0) {
                this.inNum5++;
            }else{
                this.objData2.data10.value = oldData;
                this.objData2.data10.name = this.objData.data10.name;
                this.objData2.data10.isPulse = this.objData.data10.isPulse;
            }
        },
        in6(oldData) {
            if(this.inNum6 == 0) {
                this.inNum6++;
            }else{
                this.objData2.data11.value = oldData;
                this.objData2.data11.name = this.objData.data11.name;
                this.objData2.data11.isPulse = this.objData.data11.isPulse;
            }
        },
        in7(oldData) {
            if(this.inNum7 == 0) {
                this.inNum7++;
            }else{
                this.objData2.data12.value = oldData;
                this.objData2.data12.name = this.objData.data12.name;
                this.objData2.data12.isPulse = this.objData.data12.isPulse;
            }
        },
        in8(oldData) {
            if(this.inNum8 == 0) {
                this.inNum8++;
            }else{
                this.objData2.data13.value = oldData;
                this.objData2.data13.name = this.objData.data13.name;
                this.objData2.data13.isPulse = this.objData.data13.isPulse;
            }
        },
        in9(oldData) {
            if(this.inNum9 == 0) {
                this.inNum9++;
            }else{
                this.objData2.data14.value = oldData;
                this.objData2.data14.name = this.objData.data14.name;
                this.objData2.data14.isPulse = this.objData.data14.isPulse;
            }
        },
        in10(oldData) {
            if(this.inNum10 == 0) {
                this.inNum10++;
            }else{
                this.objData2.data15.value = oldData;
                this.objData2.data15.name = this.objData.data15.name;
                this.objData2.data15.isPulse = this.objData.data15.isPulse;
            }
        },
        in11(oldData) {
            if(this.inNum11 == 0) {
                this.inNum11++;
            }else{
                this.objData2.data16.value = oldData;
                this.objData2.data16.name = this.objData.data16.name;
                this.objData2.data16.isPulse = this.objData.data16.isPulse;
            }
        },
        in12(oldData) {
            if(this.inNum12 == 0) {
                this.inNum12++;
            }else{
                this.objData2.data17.value = oldData;
                this.objData2.data17.name = this.objData.data17.name;
                this.objData2.data17.isPulse = this.objData.data17.isPulse;
            }
        },
        in13(oldData) {
            if(this.inNum13 == 0) {
                this.inNum13++;
            }else{
                this.objData2.data18.value = oldData;
                this.objData2.data18.name = this.objData.data18.name;
                this.objData2.data18.isPulse = this.objData.data18.isPulse;
            }
        },
        in14(oldData) {
            if(this.inNum14 == 0) {
                this.inNum14++;
            }else{
                this.objData2.data19.value = oldData;
                this.objData2.data19.name = this.objData.data19.name;
                this.objData2.data19.isPulse = this.objData.data19.isPulse;
            }
        },
        in15(oldData) {
            if(this.inNum15 == 0) {
                this.inNum15++;
            }else{
                this.objData2.data20.value = oldData;
                this.objData2.data20.name = this.objData.data20.name;
                this.objData2.data20.isPulse = this.objData.data20.isPulse;
            }
        },
        in16(oldData) {
            if(this.inNum16 == 0) {
                this.inNum16++;
            }else{
                this.objData2.data21.value = oldData;
                this.objData2.data21.name = this.objData.data21.name;
                this.objData2.data21.isPulse = this.objData.data21.isPulse;
            }
        },
        in17(oldData) {
            if(this.inNum17 == 0) {
                this.inNum17++;
            }else{
                this.objData2.data22.value = oldData;
                this.objData2.data22.name = this.objData.data22.name;
                this.objData2.data22.isPulse = this.objData.data22.isPulse;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#devicecontrol{
    .devicecontrol{
        h4{
            text-align: right;
        }
        ul{
            overflow: hidden;
            li{
                width: 16.6%;
                min-width: 250px;
                float: left;
                padding: 10px 20px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                -ms-box-sizing: border-box;
                -o-box-sizing: border-box;
                box-sizing: border-box;
                border-radius: 3px;
                .innerLi{
                    border-radius: 3px;
                    overflow: hidden;
                    height: 200px;
                    border: 1px solid #ddd;
                    position: relative;
                    cursor: pointer;
                    -webkit-transition: all .5s;
                    -moz-transition: all .5s;
                    -ms-transition: all .5s;
                    -o-transition: all .5s;
                    transition: all .5s;
                    position: relative;
                    &.active{
                        border: 1px solid #40FF07;
                        margin-left: -1px;
                        margin-top: -1px;
                    }
                    .icon{
                        position: absolute;
                        color: #40FF07;
                        background: #fff;
                        border-radius: 50%;
                        padding: 4px;
                        right: 6px;
                        top: 7px;
                        z-index: 10;
                    }
                    .li-top{
                        p{
                            text-align: center;
                            font-size: 16px;
                            color: #282828;
                            height: 40px;
                            line-height: 40px;
                            background: #F6F6F6;
                            b{
                                width: 70%;
                                display: block;
                                margin: 0 auto;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            }
                        }
                        p.active{
                            background: #40FF07;
                            color: #fff;
                        }
                    }
                    .li-main{
                        overflow: hidden;
                        background: #ECECEC;
                        height: 160px;
                        font-size: 14px;
                        color: #656565;
                        padding-top: 20px;
                        .li-main-left{
                            float: left;
                            margin-left: 4px;
                            p{
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                                width: 98px;
                            }
                            .p1{
                                margin-top: 20px;
                            }
                        }
                        .li-main-right{
                            float: right;
                            margin-right: 4px;
                            text-align: right;
                            .p1{
                                margin-top: 20px;
                            }
                        }
                    }
                }
            }
        }

        /deep/ .el-dialog__header{
            border-bottom: 1px solid #ddd;
        }
        .dialog-main{
            .dialog-main-top{
                overflow: hidden;
                margin-top: 20px;
                p{
                    float: left;
                }
                .btns{
                    float: right;
                    margin-right: 10px;
                    overflow: hidden;
                    span{
                        float: left;
                        padding: 6px 8px;
                        font-size: 12px;
                        border: 1px solid #409eff;
                        color: #409eff;
                        border-left: 0;
                        cursor: pointer;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        user-select: none;
                    }
                    span:first-child{
                        border-left: 1px solid #409eff;
                        border-radius: 3px 0 0 3px;
                    }
                    span:last-child{
                        border-radius: 0 3px 3px 0;
                    }
                    span:hover{
                        background: #409eff;
                        color: #fff;
                    }
                    span.active{
                        background: #409eff;
                        color: #fff;
                    }
                }
                b{
                    float: left;
                    display: block;
                    margin-left: 20px;
                    color: #409EFF;
                    font-size: 16px;
                    font-weight: bold;
                }
                .el-switch{
                    float: right;
                }
            }
            .ol3{
                text-align: right;
                padding: 15px 10px 0 0;
                li{
                    display: inline-block;
                    border: 1px solid #409eff;
                    color: #409eff;
                    padding: 6px 9px;
                    font-size: 12px;
                    cursor: pointer;
                }
                li:first-child{
                    border-radius: 3px 0 0 3px;
                    border-right: 0;
                }
                li:last-child{
                    border-radius: 0 3px 3px 0;
                    border-left: 0;
                }
                li.active{
                    background: #409eff;
                    color: #fff;
                }
                li:hover{
                    background: #409eff;
                    color: #fff;
                }
            }
            .dialog-main-middel{
                padding-right: 10px;
                margin-top: 18px;
                p{
                    text-align: right;
                    .middleInput{
                        width: 120px;
                    }
                }
            }
            .dialog-main-border{
                overflow: hidden;
                background: #ddd;
                width: 96%;
                margin: 18px auto 0;
                -webkit-border-radius: 6px;
                -moz-border-radius: 6px;
                -ms-border-radius: 6px;
                -o-border-radius: 6px;
                border-radius: 6px;
                padding: 10px 8px;
                .short{
                    width: 120px;
                }
                .Dleft{
                    float: left;
                    width: 29%;
                    border-right: 1px dashed #333;
                    .Dleft-bott{
                        margin-top: 10px;
                        a{
                            display: block;
                        }
                        i{
                            display: block;
                            display: block;
                            color: #409eff;
                            font-weight: normal;
                            font-size: 18px;
                        }
                    }
                }
                .Dright{
                    float: left;
                    width: 70%;
                    .Dright-bott{
                        padding-top: 10px;
                        padding-left: 18px;
                        padding-right: 10px;
                    }
                }
                .ol1{
                    overflow: hidden;
                    li{
                        float: left;
                        width: 20%;
                        text-align: center;
                    }
                }
                .ol2{
                    overflow: hidden;
                    margin-top: 20px;
                    li{
                        float: left;
                        width: 20%;
                        text-align: center;
                    }
                    .li2{
                        .timePicker{
                            width: 90% !important;
                            min-width: 100px !important;
                        }
                        .inputs{
                            width: 70% !important;
                            min-width: 60px !important;
                        }
                    }
                }
                .ul1{
                    overflow: hidden;
                    .li1{
                        float: left;
                        width: 20%;
                        text-align: center;
                    }
                }
                .ul3{
                    overflow: hidden;
                    padding: 8px 0;
                    .li3{
                        float: left;
                        width: 20%;
                        text-align: center;
                        padding: 0 10px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                    }
                }
                .ul4{
                    text-align: right;
                    padding-top: 13px;
                    padding-right: 10px;
                    .el-input{
                        width: 120px;
                    }
                }
                .inputs{
                    width: 70%;
                    margin-left: 10px;
                    min-width: 100px;
                }
            }
        }
    }
}
</style>
