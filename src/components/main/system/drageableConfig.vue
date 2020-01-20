<template>
    <div class="outer_box">
        <!-- <div class="outerDiv" ref="outerDiv">
            <span v-drag v-for="(item, index) in ArrayList" class="box" ref="box" @mousedown="imgClick">
                <img src="../../../../static/img/874955A0-EDB9-4881-854A-1424B455D7DD.png" class="img2">
            </span>
        </div> -->
        <div id="preview" style="width:200px; height:200px; border:1px solid gray; position:absolute; left:600px; top:300px;cursor: pointer" v-drag>
            <div class="upBtn" id="upBtn"></div>
            <div class="downBtn" id="downBtn"></div>
            <div class="upLeftBtn" id="upLeftBtn"></div>
            <div class="upRightBtn" id="upRightBtn"></div>
            <div class="downLeftBtn" id="downLeftBtn"></div>
            <div class="downRightBtn" id="downRightBtn"></div>
            <div class="centerLeftBtn" id="centerLeftBtn"></div>
            <div class="centerRightBtn" id="centerRightBtn"></div>
        </div>
        <!-- 测试红绿灯 -->
        <ul>
            <li class="red" v-show="isShow==1"></li>
            <li class="green" v-show="isShow==2"></li>
            <li class="yellow" v-show="isShow==3"></li>
        </ul>
        <el-button @click="test">测试</el-button>
     </div>
</template>
<script>
    export default{
        data(){
            return{
                ArrayList: 1,
                isShow: 1
            }
        },
        methods:{
            test() {
                let timer = setInterval(()=>{
                    if(this.isShow >= 3) {
                        this.isShow = 1;
                    }else{
                        this.isShow++;
                    }
                }, 3000);
            },
            imgClick() {
                this.ArrayList++;
            },
            initDom() {
                function $(id) {
                    return document.getElementById(id);
                }
                function getEvent(e) {
                    return e || window.event;
                }
                function getLocation(e) {
                    return {
                        x: e.x || e.clientX,
                        y: e.y || e.clientY
                    }
                }
                var obj = {operateType: ''}; // 当前操作的对象
                var preview = null; // 要处理的对象
                var clickX = 0; // 保留上次的X轴位置
                var clickY = 0; // 保留上次的Y轴位置
                // 鼠标点击
                var onDragDown = function (e, type) {
                    e = getEvent(e);
                    var location = getLocation(e);
                    clickY = location.y;
                    clickX = location.x;
                    obj = e;
                    obj.operateType = type;
                    preview = $("preview");
                    return false;
                };
                var onUpBtnDown = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    onDragDown(e, "n");
                };
                var onDownBtnDown = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    onDragDown(e, "s");
                };
                var onCenterLeftBtnDown = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    onDragDown(e, "w");
                };
                var onCenterRightBtnDown = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    onDragDown(e, "e");
                };
                var onUpLeftBtnDown = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    onDragDown(e, "nw");
                };
                var onUpRightBtnDown = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    onDragDown(e, "ne");
                };
                var onDownLeftBtnDown = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    onDragDown(e, "sw");
                };
                var onDownRightBtnDown = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    onDragDown(e, "se");
                };
                var onDragUp = function () {
                    document.body.style.cursor = "auto";
                    obj = null;
                };
                var move = function (operateType, location, preview) {
                    document.body.style.cursor = location + "_resize";
                    switch (operateType) {
                        case "e":
                            var add_length = clickX - location.x;
                            clickX = location.x;
                            var length = parseInt(preview.style.width) - add_length;
                            preview.style.width = length + "px";
                            break;
                        case "s":
                            var add_length = clickY - location.y;
                            clickY = location.y;
                            var length = parseInt(preview.style.height) - add_length;
                            preview.style.height = length + "px";
                            break;
                        case "w":
                            var add_length = clickX - location.x;
                            clickX = location.x;
                            var length = parseInt(preview.style.width) + add_length;
                            preview.style.width = length + "px";
                            preview.style.left = clickX + "px";
                            break;
                        case "n":
                            var add_length = clickY - location.y;
                            clickY = location.y;
                            var length = parseInt(preview.style.height) + add_length;
                            preview.style.height = length + "px";
                            preview.style.top = clickY + "px";
                            break;
                    }
                };
                var onDragMove = function (e) {
                    if (obj) {
                        e = getEvent(e);
                        var location = getLocation(e);
                        switch (obj.operateType) {
                            case "n":
                                move("n", location, preview);
                                break;
                            case "s":
                                move("s", location, preview);
                                break;
                            case "w":
                                move("w", location, preview);
                                break;
                            case "e":
                                move("e", location, preview);
                                break;
                            case "nw":
                                move("n", location, preview);
                                move("w", location, preview);
                                break;
                            case "ne":
                                move("n", location, preview);
                                move("e", location, preview);
                                break;
                            case "sw":
                                move("s", location, preview);
                                move("w", location, preview);
                                break;
                            case "se":
                                move("s", location, preview);
                                move("e", location, preview);
                                break;
                        }
                    }
                    return false;
                };
                setTimeout(()=>{
                    $("upBtn").onmousedown = onUpBtnDown;
                    $("downBtn").onmousedown = onDownBtnDown;
                    $("centerLeftBtn").onmousedown = onCenterLeftBtnDown;
                    $("centerRightBtn").onmousedown = onCenterRightBtnDown;
                    $("upLeftBtn").onmousedown = onUpLeftBtnDown;
                    $("upRightBtn").onmousedown = onUpRightBtnDown;
                    $("downLeftBtn").onmousedown = onDownLeftBtnDown;
                    $("downRightBtn").onmousedown = onDownRightBtnDown;
                    document.onmousemove = onDragMove;
                    document.onmouseup = onDragUp;
                }, 300);
            }
        },
        mounted() {
            this.initDom();
        }
    }
</script>
<style scoped lang="scss">
    .outer_box{
        height: 100%;
        .upBtn,.downBtn,.upLeftBtn,.upRightBtn,.downLeftBtn,.downRightBtn,.centerLeftBtn,.centerRightBtn{
            position:absolute;
            background:yellow;
            width:9px;
            height:9px;
            z-index:5;
        }
        .upBtn{
            top:-4px;
            left:50%;
            cursor:n-resize;
        }
        .downBtn{
            bottom:-4px;
            left:50%;
            cursor:s-resize;
        }
        .upLeftBtn{
            top:-4px;
            left:-4px;
            cursor:nw-resize;
        }
        .upRightBtn{ top:-4px;
            right:-4px;
            cursor:ne-resize;
        }
        .downLeftBtn{ bottom:-4px;
            left:-4px;
            cursor:sw-resize;
        }
        .downRightBtn{ bottom:-4px;
            right:-4px;
            cursor:se-resize;
        }
        .centerLeftBtn{ top:50%;
            left:-4px;
            cursor:w-resize;
        }
        .centerRightBtn{
            top:50%;
            right:-4px;
            cursor:e-resize;
        }

        ul{
            overflow: hidden;
            padding: 150px 0 0 300px;
            li{
                width: 20px;
                height: 20px;
                border-radius: 50%;
                float: left;
                margin: 0 10px;
            }
            li:first-child{
                margin-left: 0;
            }
            li.red{
                background: red;
            }
            li.yellow{
                background: yellow;
            }
            li.green{
                background: green;
            }
        }
    }
</style>
