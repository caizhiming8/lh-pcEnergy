import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            component: resolve => require(['../components/page/login.vue'], resolve)
        },
        {
            path: '/err',
            component: resolve => require(['../components/page/err.vue'], resolve)
        },
        {
            path: '/outIndex',
            component: resolve => require(['../components/page/outIndex.vue'], resolve)
        },
        {
            path: '/header',
            component: resolve => require(['../components/page/header.vue'], resolve),
            children: [
                {
                    path: '/',
                    name: 'EnergySchool',
                    component: resolve => require(['../components/main/power/EnergySchool.vue'], resolve)
                },
                {
                    path: '/index',
                    component: resolve => require(['../components/page/index.vue'], resolve)
                },
                {
                    path: '/WaterIndex',
                    component: resolve => require(['../components/main/water/WaterIndex.vue'], resolve)
                },
                {
                    path: '/evaluate',
                    component: resolve => require(['../components/main/repair/analyze/evaluate.vue'], resolve)
                },

                {
                    path: '/implementEquipmentInspection',
                    component: resolve => require(['../components/main/equipmentControl/equipmentInspection/implementEquipmentInspection.vue'], resolve)
                },
                {
                    path: '/analyze',
                    component: resolve => require(['../components/main/repair/analyze.vue'], resolve),
                    children: [{
                        path: '/evaluate',
                        component: resolve => require(['../components/main/repair/analyze/evaluate.vue'], resolve)
                    }]
                },
                {
                    path: '/lampSetting',
                    component: resolve => require(['../components/main/power/lampSetting.vue'], resolve)
                },
                {
                    path: '/hotIndex',
                    component: resolve => require(['../components/main/heatSource/hotIndex.vue'], resolve)
                },
                {
                    path: '/powerIndex',
                    component: resolve => require(['../components/main/power/powerIndex.vue'], resolve)
                },
                {
                    path: '/alertManagementHistory',
                    component: resolve => require(['../components/main/power/alertManagement/alertManagementHistory.vue'], resolve)
                },
                {
                    path: '/alertManagementSetting',
                    component: resolve => require(['../components/main/power/alertManagement/alertManagementSetting.vue'], resolve)
                },
                {
                    path: '/tenantAdd',
                    name: 'tenantAdd',
                    component: resolve => require(['../components/main/businessEnengy/tenant/tenantAdd.vue'],resolve)
                },
                {
                    path: '/tenantChange',
                    name: 'tenantChange',
                    component: resolve => require(['../components/main/businessEnengy/tenant/tenantChange.vue'],resolve)
                },
                {
                    path: '/lamp',
                    name: 'lamp',
                    component: resolve => require(['../components/main/power/lamp.vue'],resolve)
                },
                {
                    path: '/tenantDetail',
                    name: 'tenantDetail',
                    component: resolve => require(['../components/main/businessEnengy/tenant/tenantDetail.vue'],resolve)
                },
                {
                    path: '/drageableConfig',
                    name: 'drageableConfig',
                    component: resolve => require(['../components/main/system/drageableConfig.vue'],resolve)
                },
                {
					path: '/tenant',
					name: 'tenant',
					component: resolve => require(['../components/main/businessEnengy/tenant.vue'],resolve),
                    children: [

                        {
                            path: '/tenantReal',
        					name: 'tenantReal',
        					component: resolve => require(['../components/main/businessEnengy/tenant/tenantReal.vue'],resolve)
                        },
                        {
                            path: '/tenant',
                            redirect: "/tenantReal"
                        }
                    ]
				},
                {
                    path: '/pipelineConfig',
                    component: resolve => require(['../components/main/system/pipelineConfig.vue'], resolve)
                },
                {
                    path: '/lampRecord',
                    component: resolve => require(['../components/main/power/lampRecord.vue'], resolve)
                },
                {
                    path: '/energyConservationAssessment',
                    component: resolve => require(['../components/main/energyConservationAssessment.vue'], resolve)
                },
                {
                    path: '/energyTolte',
                    component: resolve => require(['../components/main/energyTolte.vue'], resolve)
                },
            ]
        },
        {
            path: '/slider',
            component: resolve => require(['../components/page/slider.vue'], resolve)
        },
        {
            path: '/test',
            component: resolve => require(['../components/page/test.vue'], resolve)
        },
        {
            path: '*',
            redirect: "/index"
        },
    ]
})
