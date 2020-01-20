<template>
    <div class="page-menu">
        <el-row class="page-cont">
            <el-col :span="24" :md="12" class="cont-list">
                <div class="list-title">
                    <h3>菜单-页面管理</h3>
                </div>
                <div class="list-cont">
                    <el-row>
                        <el-col :span="8">
                            <el-tree
                                :data="menuTree"
                                :props="defaultProps"
                                accordion
                                @node-click="selectOpen"
                                :highlight-current=true>
                            </el-tree>
                        </el-col>
                        <el-col :span="16" style="padding: 0 10px;border-left: 1px solid #ccc;border-right: 5px solid #ccc">
                            <el-form label-position="top" ref="ruleForm" :rules="add_menuRules" :model="req_addMenuObj" label-width="80px">
                                <el-form-item label="菜单名字" prop="menuName">
                                    <el-input v-model="req_addMenuObj.menuName"></el-input>
                                </el-form-item>
                                <el-form-item label="父级index" prop="fatherIndex">
                                    <el-input v-model="req_addMenuObj.fatherIndex"></el-input>
                                </el-form-item>
                                <el-form-item label="自身index" prop="localIndex">
                                    <el-input v-model="req_addMenuObj.localIndex"></el-input>
                                </el-form-item>
                                <el-form-item label="菜单链接">
                                    <el-input v-model="req_addMenuObj.path"></el-input>
                                </el-form-item>
                                <el-form-item label="页面名字">
                                    <el-input v-model="req_addMenuObj.name"></el-input>
                                </el-form-item>
                                <el-form-item label="页面路径">
                                    <el-input v-model="req_addMenuObj.component"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button :disabled="add_buttonState" size="small" type="primary" @click="goAddMenuEvent('ruleForm')">添加菜单页面</el-button>
                                    <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
                                    <el-button :disabled="add_buttonState" type="danger" size="small" @click="goDeleteMenuEvent('ruleForm')">删除菜单-页面</el-button>
                                    <el-button :disabled="add_buttonState" type="warning" size="small" @click="goModifyMenuEvent('ruleForm')">修改菜单-页面</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="24" :md="12" class="cont-list">
                <div class="list-title">
                    <h3>按钮管理</h3>
                </div>
                <div class="list-cont">
                    <el-row>
                        <el-col :span="8">
                            <el-tree
                                :data="menuTree"
                                :props="defaultProps"
                                accordion
                                @node-click="selectOpenButton"
                                :highlight-current=true>
                            </el-tree>
                        </el-col>
                        <el-col :span="16" style="padding: 0 10px;border-left: 1px solid #ccc">
                            <el-form label-position="top" ref="ruleFormBut" :rules="add_buttonRules" :model="req_addButObj" label-width="80px">
                                <el-form-item label="按钮名字" prop="buttonName">
                                    <el-input v-model="req_addButObj.buttonName"></el-input>
                                </el-form-item>
                                <el-form-item label="父级index" prop="fatherIndex">
                                    <el-input v-model="req_addButObj.fatherIndex"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button :disabled="add_buttonState" type="primary" @click="goAddButEvent('ruleFormBut')" size="small">添加按钮</el-button>
                                    <el-button @click="resetForm('ruleFormBut')" size="small">重置</el-button>
                                    <el-button :disabled="add_buttonState" type="danger" @click="goDeleteButEvent('ruleFormBut')" size="small">删除按钮</el-button>
                                    <el-button :disabled="add_buttonState" type="warning" @click="goModifyBtnEvent('ruleFormBut')" size="small">修改按钮</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </div>
                <!-- <div class="list-bot">1</div> -->
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            menuTree: [],
            add_buttonState: false,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            cur_menuSelect: null,
            cur_buttonSelect: null,
            req_addMenuObj: {
                menuName: '',
                fatherIndex: 0,
                localIndex: 1,
                path: '/',
                name: '',
                component: 'components/main/'
            },
            req_addButObj: {
                buttonName: '',
                fatherIndex: 0
            },
            add_menuRules: {
                menuName: [
                    { required: true, message: '菜单名字不能为空', trigger: 'blur' }
                ],
                fatherIndex: [
                    { required: true, message: '请输入菜单父级index或选择父级菜单', trigger: 'blur' }
                ],
                localIndex: [
                    { required: true, message: '请输自身index', trigger: 'blur' }
                ]
            },
            add_buttonRules: {
                buttonName: [
                    { required: true, message: '按钮名称不能为空', trigger: 'blur' }
                ],
                fatherIndex: [
                    { required: true, message: '按钮父级index不能为空', trigger: 'blur' }
                ]
            },
			currentUserInfo: this.$_globalData.$_userInfo
        }
    },
    methods: {
        goAddMenuEvent(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _this = this;
                    // if(_this.cur_menuSelect.buttonName) {
                    //     return;
                    //     _this.$message.warning('您选择的不是页面不需要添加按钮');
                    // }
                    let a = {
                        menuName: _this.req_addMenuObj.menuName,
                        fatherIndex: _this.req_addMenuObj.fatherIndex,
                        localIndex: _this.req_addMenuObj.localIndex,
                        path: _this.req_addMenuObj.name?_this.req_addMenuObj.path:'',
                        name: _this.req_addMenuObj.name,
                        component: _this.req_addMenuObj.name?_this.req_addMenuObj.component:''
                    }
                    _this.add_buttonState = true;
                    const insertMenu = new Promise((resolve,reject)=> {
                        _this.$axios.post(`BMPlatServers/authority/insertMenu`,this.$qs.stringify(a))
                            .then((res)=>{
                                if(res.data.success) {
                                    _this.$message.success(res.data.resultMessage);
                                    _this.getMenuTree();
                                }else{
                                    _this.add_buttonState = false;
                                    _this.$message.warning(res.data.resultMessage);
                                }
                            });
                    })
                    // insertMenu.then(()=> {
                    //     _this.$axios.post(`BMPlatServers/authority/insertPage`,this.$qs.stringify(b))
                    //         .then((res)=>{
                    //             if(res.data.success) {
                    //                 resetForm(formName);
                    //                 _this.$message.success(res.data.resultMessage);
                    //             }else{
                    //                 this.$message.warning(res.data.resultMessage);
                    //             }
                    //         });
                    // })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        goAddButEvent(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _this = this;
                    if(!_this.cur_buttonSelect) {
                        _this.$message.warning('请选择需要添加按钮的页面');
                        return;
                    }else if(!_this.cur_buttonSelect.component) {
                        _this.$message.warning('您选择的不是页面不需要添加按钮');
                        return;
                    }
                    let a = {
                        buttonName: _this.req_addButObj.buttonName,
                        fatherIndex: _this.req_addButObj.fatherIndex
                    }
                    _this.add_buttonState = true;
                    const insertMenu = new Promise((resolve,reject)=> {
                        _this.$axios.post(`BMPlatServers/authority/insertButton`,this.$qs.stringify(a))
                            .then((res)=>{
                                if(res.data.success) {
                                    _this.$message.success(res.data.resultMessage);
                                    _this.getMenuTree();
                                }else{
                                    _this.add_buttonState = false;
                                    _this.$message.warning(res.data.resultMessage);
                                }
                            });
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 删除页面
        goDeleteMenuEvent(formName) {
            let _this = this;
            if(!_this.cur_menuSelect) {
                _this.$message.warning('请选择需要删除的页面');
                return;
            }else if(!_this.cur_menuSelect.component) {
                _this.$message.warning('您选择的不是页面');
                return;
            }
            let a =  {map: JSON.stringify({
                list: [_this.cur_menuSelect.id]
            })}
            _this.add_buttonState = true;
            const insertMenu = new Promise((resolve,reject)=> {
                _this.$axios.post(`BMPlatServers/authority/deleteMenuButton`,this.$qs.stringify(a))
                    .then((res)=>{
                        if(res.data.success) {
                            _this.cur_menuSelect = null;
                            _this.$message.success(res.data.resultMessage);
                            _this.$refs[formName].resetFields();
                            _this.getMenuTree();
                        }else{
                            _this.add_buttonState = false;
                            _this.$message.warning(res.data.resultMessage);
                        }
                    });
            })
        },
        // 删除按钮
        goDeleteButEvent(formName) {
            let _this = this;
            if(!_this.cur_buttonSelect) {
                _this.$message.warning('请选择需要删除的按钮');
                return;
            }else if(!_this.cur_buttonSelect.buttonName) {
                _this.$message.warning('您选择的不是按钮');
                return;
            }
            let a =  {map: JSON.stringify({
                list: [ _this.cur_buttonSelect.id ]
            })}
            _this.add_buttonState = true;
            const insertMenu = new Promise((resolve,reject)=> {
                _this.$axios.post(`BMPlatServers/authority/deleteMenuButton`,this.$qs.stringify(a))
                    .then((res)=>{
                        if(res.data.success) {
                            _this.cur_buttonSelect = null;
                            _this.$message.success(res.data.resultMessage);
                            _this.$refs[formName].resetFields();
                            _this.getMenuTree();
                        }else{
                            _this.add_buttonState = false;
                            _this.$message.warning(res.data.resultMessage);
                        }
                    });
            })
        },
        // 修改页面
        goModifyMenuEvent(formName) {
            let _this = this;
            if(!_this.cur_menuSelect) {
                _this.$message.warning('请选择需要修改的页面');
                return;
            }
            let a =  JSON.stringify(_this.req_addMenuObj);
            a = JSON.parse(a);
            a.Id = _this.cur_menuSelect.id;
            _this.add_buttonState = true;
            const insertMenu = new Promise((resolve,reject)=> {
                _this.$axios.post(`BMPlatServers/authority/updateMenuButton`,this.$qs.stringify(a))
                    .then((res)=>{
                        if(res.data.success) {
                            _this.cur_menuSelect = null;
                            _this.$message.success(res.data.resultMessage);
                            _this.$refs[formName].resetFields();
                            _this.getMenuTree();
                        }else{
                            _this.add_buttonState = false;
                            _this.$message.warning(res.data.resultMessage);
                        }
                    });
            })
        },
        // 修改按钮
        goModifyBtnEvent(formName) {
            let _this = this;
            if(!_this.cur_buttonSelect) {
                _this.$message.warning('请选择需要修改的按钮');
                return;
            }
            let a =  JSON.stringify(_this.req_addButObj);
            a = JSON.parse(a);
            a.Id = _this.cur_buttonSelect.id;
            _this.add_buttonState = true;
            const insertMenu = new Promise((resolve,reject)=> {
                _this.$axios.post(`BMPlatServers/authority/updateMenuButton`,this.$qs.stringify(a))
                    .then((res)=>{
                        if(res.data.success) {
                            _this.cur_buttonSelect = null;
                            _this.$message.success(res.data.resultMessage);
                            _this.$refs[formName].resetFields();
                            _this.getMenuTree();
                        }else{
                            _this.add_buttonState = false;
                            _this.$message.warning(res.data.resultMessage);
                        }
                    });
            })
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        selectOpen(key, keyPath) {
            this.req_addMenuObj.fatherIndex = key.localIndex;
            this.cur_menuSelect = key;
            this.req_addMenuObj.menuName = key.menuName;
            this.req_addMenuObj.fatherIndex = key.fatherIndex;
            this.req_addMenuObj.localIndex = key.localIndex;
            this.req_addMenuObj.component = key.component;
            this.req_addMenuObj.name = key.name;
            this.req_addMenuObj.path = key.path;
            // this.resetForm(formName);
            // console.log(key, keyPath);
        },
        selectOpenButton(key, keyPath) {
            this.cur_buttonSelect = key;
            this.req_addButObj.fatherIndex = key.localIndex;
            this.req_addButObj.buttonName = key.buttonName;
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        getMenuTree() {
            let _this = this;
            this.$axios.post(`BMPlatServers/authority/queryMenu`,_this.$qs.stringify({
					Id: _this.currentUserInfo.Id,
					roleId: JSON.stringify(_this.currentUserInfo.roleId.split(','))}))
                .then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        _this.add_buttonState = false;
                        // _this.menuTree = res.data.result.list;
                        _this.menuTree = res.data.result.list.map(org => _this.mapTree(org));
                    }else{
                        this.$message.warning(res.data.resultMessage);
                    }
                });
        },
        mapTree (org) {
            const haveChildren = Array.isArray(org.children) && org.children.length > 0;
            if(haveChildren) {
                return {
                    label: org.buttonName?org.buttonName+org.localIndex:org.menuName+org.localIndex,
                    localIndex: org.localIndex,
                    menuName: org.menuName,
                    fatherIndex: org.fatherIndex,
                    component: org.component,
                    id: org.id,
                    name: org.name,
                    path: org.path,
                    buttonName: org.buttonName,
                    children: haveChildren ? org.children.map(i => this.mapTree(i)) : []
                };
            }else{
                return {
                    label: org.buttonName?org.buttonName+org.localIndex:org.menuName+org.localIndex,
                    localIndex: org.localIndex,
                    menuName: org.menuName,
                    fatherIndex: org.fatherIndex,
                    component: org.component,
                    id: org.id,
                    name: org.name,
                    path: org.path,
                    buttonName: org.buttonName
                };
            }
        }
    },
    mounted() {
        this.getMenuTree();
    }
}
</script>
<style lang="scss" scoped>
    .page-menu {
        position: relative;
        height: 100%;
        width: 100%;
        >.page-cont {
            position: absolute;
            overflow: auto;
            padding: 10px;
            bottom: 0;
            right: 0;
            left: 0;
            top: 0;
            >.cont-list {
                >.list-title {
                    align-items: center;
                    display: flex;
                    height: 50px;
                }
            }
        }
    }
</style>
