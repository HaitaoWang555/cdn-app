import{_ as a,g as t,a as s,l as n}from"./CardChart.vue_vue_type_script_setup_true_lang-Ca0fmksc.js";import{h as e,A as l,o,j as i,W as d,u as p}from"./lib-RIRnLom_.js";import"./index-xe9CM43D.js";import"./element-plus-ZpKcekI1.js";import"./echarts-n4onjlW5.js";import"./index-QsaRmXn2.js";const r={class:"app-content-no-padding"},u=e({__name:"Line",setup(e){let u=l(),m=l();const v=l(!1),y=l(!1);return v.value=!0,y.value=!0,t().then((a=>{var t;t=a.data,u.value=n(t.data.xData,[t.data.yData])})).finally((()=>{v.value=!1})),s().then((a=>{!function(a){const t=[a.data.yData.data1,a.data.yData.data2,a.data.yData.data3,a.data.yData.data4,a.data.yData.data5];m.value=n(a.data.xData,t,["邮件营销","联盟广告","视频广告","直接访问","搜索引擎"])}(a.data)})).finally((()=>{y.value=!1})),(t,s)=>(o(),i("div",r,[d(a,{title:"基础平滑折线图",loading:p(v),options:p(u)},null,8,["loading","options"]),d(a,{style:{"margin-top":"20px"},loading:p(y),title:"折线图堆叠",options:p(m)},null,8,["loading","options"])]))}});export{u as default};
