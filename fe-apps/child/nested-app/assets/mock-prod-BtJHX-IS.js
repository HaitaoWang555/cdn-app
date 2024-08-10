import{_ as e}from"./index-ad63XEva.js";import"./lib-BT0Fiig6.js";import"./element-plus-CxHaf73Y.js";async function r(r){const{mocks:t}=await e((()=>import("./index-1SvfTSQl.js")),__vite__mapDeps([0,1])),n=t.find((e=>{var t;return e.url===r.url&&e.type===(null==(t=r.method)?void 0:t.toLocaleLowerCase())||function(e,r){if(r.indexOf("${")){const t=r.replace(/\$\{[^}]+\}/g,"(.+)"),n=new RegExp(`^${t}$`);return e.match(n)}return!1}(r.url,e.url)}));return n?{data:n.response({query:r.params,body:r.data&&JSON.parse(r.data)})}:Promise.reject()}export{r as getMockData};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/index-1SvfTSQl.js","assets/faker-CK-JNVuk.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
