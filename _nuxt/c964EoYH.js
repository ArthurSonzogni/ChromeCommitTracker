import{g as f,m as v,i as w,h as _,C as m,s as g,r as h,o as y,j as C,x,Q as L}from"./BYXYRwLn.js";import{r as j}from"./CTRyl4Lp.js";const k=f({__name:"DevelopersInput",props:v({size:{type:String,required:!1}},{modelValue:{},modelModifiers:{}}),emits:["update:modelValue"],setup(r){const i=w(null),a=_(r,"modelValue"),u=m([]),c=m([]);(async()=>{const e=s=>fetch(`/data/${s.dirname}/usernames.json`).then(n=>n.json()),l=(await Promise.all(j.map(e))).reduce((s,n)=>s.concat(n),[]),o=[...new Set(l)];u.value=o,a.value=a.value.filter(s=>o.includes(s))})();const p=e=>{e=e.trim().toLowerCase();const t=o=>o.toLowerCase().indexOf(e)==0,l=(o,s)=>o.toLowerCase().indexOf(e)-s.toLowerCase().indexOf(e);c.value=u.value.filter(t).sort(l)},{$color:d}=L();return g(a,()=>{setTimeout(()=>{let e=0;for(const t of i.value.$el.querySelectorAll(".tag"))t.style.backgroundColor=d(a.value[e]),++e},0)}),(e,t)=>{const l=h("b-taginput");return y(),C(l,{ref_key:"input",ref:i,modelValue:a.value,"onUpdate:modelValue":t[0]||(t[0]=o=>a.value=o),onTyping:p,data:x(c),"allow-new":!1,autocomplete:"",icon:"label",field:"this",placeholder:"developer username",type:"is-primary",size:r.size||"is-medium","open-on-focus":""},null,8,["modelValue","data","size"])}}});export{k as _};