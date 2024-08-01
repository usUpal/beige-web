"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[151],{1151:function(e,s,t){t.r(s);var l=t(5893),a=t(1664),r=t.n(a),i=t(3211),d=t(2453),n=t(3197),c=t(7294),o=t(5152),h=t.n(o),x=t(9078),m=t(3317);let p=h()(()=>Promise.all([t.e(279),t.e(229)]).then(t.bind(t,7229)),{loadableGenerated:{webpack:()=>[7229]},ssr:!1});s.default=e=>{let{isDark:s,isRtl:t,isMounted:a}=e,{userData:o}=(0,x.a)(),h={series:[{name:"Income",data:[16800,16800,15500,17800,15500,17e3,19e3,16e3,15e3,17e3,14e3,17e3]},{name:"Expenses",data:[16500,17500,16200,17300,16e3,19500,16e3,17e3,16e3,19e3,18e3,19e3]}],options:{chart:{height:325,type:"area",fontFamily:"Nunito, sans-serif",zoom:{enabled:!1},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{show:!0,curve:"smooth",width:2,lineCap:"square"},dropShadow:{enabled:!0,opacity:.2,blur:10,left:-7,top:22},colors:s?["#2196F3","#E7515A"]:["#1B55E2","#E7515A"],markers:{discrete:[{seriesIndex:0,dataPointIndex:6,fillColor:"#1B55E2",strokeColor:"transparent",size:7},{seriesIndex:1,dataPointIndex:5,fillColor:"#E7515A",strokeColor:"transparent",size:7}]},labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],xaxis:{axisBorder:{show:!1},axisTicks:{show:!1},crosshairs:{show:!0},labels:{offsetX:t?2:0,offsetY:5,style:{fontSize:"12px",cssClass:"apexcharts-xaxis-title"}}},yaxis:{tickAmount:7,labels:{formatter:e=>e/1e3+"K",offsetX:t?-30:-10,offsetY:0,style:{fontSize:"12px",cssClass:"apexcharts-yaxis-title"}},opposite:!!t},grid:{borderColor:s?"#191E3A":"#E0E6ED",strokeDashArray:5,xaxis:{lines:{show:!1}},yaxis:{lines:{show:!0}},padding:{top:0,right:0,bottom:0,left:0}},legend:{position:"top",horizontalAlign:"right",fontSize:"16px",markers:{width:10,height:10,offsetX:-2},itemMargin:{horizontal:10,vertical:5}},tooltip:{marker:{show:!0},x:{show:!1}},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:s?.19:.28,opacityTo:.05,stops:s?[100,100]:[45,100]}}}},b={series:[985,737,270],options:{chart:{type:"donut",height:460,fontFamily:"Nunito, sans-serif"},dataLabels:{enabled:!1},stroke:{show:!0,width:25,colors:s?"#0e1726":"#fff"},colors:s?["#5c1ac3","#ACA686","#e7515a","#ACA686"]:["#ACA686","#5c1ac3","#e7515a"],legend:{position:"bottom",horizontalAlign:"center",fontSize:"14px",markers:{width:10,height:10,offsetX:-2},height:50,offsetY:20},plotOptions:{pie:{donut:{size:"65%",background:"transparent",labels:{show:!0,name:{show:!0,fontSize:"29px",offsetY:-10},value:{show:!0,fontSize:"26px",color:s?"#bfc9d4":void 0,offsetY:16,formatter:e=>e},total:{show:!0,label:"Total",color:"#888ea8",fontSize:"29px",formatter:e=>e.globals.seriesTotals.reduce(function(e,s){return e+s},0)}}}}},labels:["Commercial","Wedding","Personal"],states:{hover:{filter:{type:"none",value:.15}},active:{filter:{type:"none",value:.15}}}}},j={series:[{name:"Sales",data:[44,55,41,67,22,43,21,56,97,88,12,67]},{name:"Last Week",data:[13,23,20,8,13,27,33,44,55,41,67,22]}],options:{chart:{height:160,type:"bar",fontFamily:"Nunito, sans-serif",toolbar:{show:!1},stacked:!0,stackType:"100%"},dataLabels:{enabled:!1},stroke:{show:!0,width:1},colors:["#ACA686","#e0e6ed"],responsive:[{breakpoint:480,options:{legend:{position:"bottom",offsetX:-10,offsetY:0}}}],xaxis:{labels:{show:!1},categories:["January","February","March","April","May","June","July","August","September","October","November","December"]},yaxis:{show:!1},fill:{opacity:1},plotOptions:{bar:{horizontal:!1,columnWidth:"25%"}},legend:{show:!1},grid:{show:!1,xaxis:{lines:{show:!1}},padding:{top:10,right:-20,bottom:-20,left:-20}}}},g={series:[{name:"Sales",data:[28,40,36,52,38,60,38,52,36,40,28,40,36,52,38,60,38,52,36,40]}],options:{chart:{height:290,type:"area",fontFamily:"Nunito, sans-serif",sparkline:{enabled:!0}},stroke:{curve:"smooth",width:2},colors:["#00ab55"],labels:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],yaxis:{min:0,show:!1},grid:{padding:{top:125,right:0,bottom:0,left:0}},fill:{opacity:1,type:"gradient",gradient:{type:"vertical",shadeIntensity:1,inverseColors:!1,opacityFrom:.3,opacityTo:.05,stops:[100,100]}},tooltip:{x:{show:!1}}}},[u,f]=(0,c.useState)([]),[w,N]=(0,c.useState)("");(0,c.useEffect)(()=>{getAllMyShoots()},[w]);let getAllMyShoots=async()=>{try{if(w){let e=await fetch("".concat(n.QP,"orders?sortBy=createdAt:desc&limit=5&cp_id=").concat(null==o?void 0:o.id)),s=await e.json();f(e=>{let t=s.results.filter(s=>!e.some(e=>e.id===s.id));return[...e,...t]})}}catch(e){console.error(e)}};return(0,l.jsxs)("div",{children:[(0,l.jsxs)("ul",{className:"flex space-x-2 rtl:space-x-reverse",children:[(0,l.jsx)("li",{children:(0,l.jsx)(r(),{href:"/",className:"text-primary hover:underline",children:"Dashboard"})}),(0,l.jsx)("li",{className:"before:content-['/'] ltr:before:mr-2 rtl:before:ml-2",children:(0,l.jsx)("span",{children:"CP"})})]}),(0,l.jsxs)("div",{className:"pt-5",children:[(0,l.jsxs)("div",{className:"mb-6 grid gap-6 xl:grid-cols-3",children:[(0,l.jsxs)("div",{className:"panel h-full xl:col-span-2",children:[(0,l.jsxs)("div",{className:"mb-5 flex items-center justify-between dark:text-white-light",children:[(0,l.jsx)("h5",{className:"text-lg font-semibold",children:"Revenue"}),(0,l.jsx)("div",{className:"dropdown",children:(0,l.jsx)(i.Z,{offset:[0,1],placement:"".concat(t?"bottom-start":"bottom-end"),button:m.w.revenueDayWkMonthSortBtnSvg,children:(0,l.jsxs)("ul",{children:[(0,l.jsx)("li",{children:(0,l.jsx)("button",{type:"button",children:"Weekly"})}),(0,l.jsx)("li",{children:(0,l.jsx)("button",{type:"button",children:"Monthly"})}),(0,l.jsx)("li",{children:(0,l.jsx)("button",{type:"button",children:"Yearly"})})]})})})]}),(0,l.jsxs)("p",{className:"text-lg dark:text-white-light/90",children:["Total Profit ",(0,l.jsx)("span",{className:"ml-2 text-[#ACA686]",children:"$10,840"})]}),(0,l.jsx)("div",{className:"relative",children:(0,l.jsx)("div",{className:"rounded-lg bg-white dark:bg-black",children:a?(0,l.jsx)(p,{series:h.series,options:h.options,type:"area",height:325,width:"100%"}):(0,l.jsx)("div",{className:"grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ",children:(0,l.jsx)("span",{className:"inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"})})})})]}),(0,l.jsxs)("div",{className:"panel h-full",children:[(0,l.jsx)("div",{className:"mb-5 flex items-center",children:(0,l.jsx)("h5",{className:"text-lg font-semibold dark:text-white-light",children:"Orders By Category"})}),(0,l.jsx)("div",{children:(0,l.jsx)("div",{className:"rounded-lg bg-white dark:bg-black",children:a?(0,l.jsx)(p,{series:b.series,options:b.options,type:"donut",height:460,width:"100%"}):(0,l.jsx)("div",{className:"grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ",children:(0,l.jsx)("span",{className:"inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"})})})})]})]}),(0,l.jsx)("div",{className:"mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-1",children:(0,l.jsxs)("div",{className:"panel h-full p-0",children:[(0,l.jsxs)("div",{className:"absolute flex w-full items-center justify-between p-5",children:[(0,l.jsx)("div",{className:"relative",children:(0,l.jsx)("div",{className:"flex h-11 w-11 items-center justify-center rounded-lg bg-success-light text-success dark:bg-success dark:text-success-light",children:m.w.cartIconSvg})}),(0,l.jsxs)("h5",{className:"text-2xl font-semibold ltr:text-right rtl:text-left dark:text-white-light",children:["3,192",(0,l.jsx)("span",{className:"block text-sm font-normal",children:"Total Orders"})]})]}),(0,l.jsx)("div",{className:"rounded-lg bg-transparent",children:a?(0,l.jsx)(p,{series:g.series,options:g.options,type:"area",height:290,width:"100%"}):(0,l.jsx)("div",{className:"grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ",children:(0,l.jsx)("span",{className:"inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"})})})]})}),(0,l.jsxs)("div",{className:"mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-2",children:[(0,l.jsxs)("div",{className:"panel h-full sm:col-span-2 xl:col-span-1",children:[(0,l.jsxs)("div",{className:"mb-5 flex items-center",children:[(0,l.jsxs)("h5",{className:"text-lg font-semibold dark:text-white-light",children:["Monthly Orders",(0,l.jsx)("span",{className:"block text-sm font-normal text-white-dark",children:"Go to columns for details."})]}),(0,l.jsx)("div",{className:"relative ltr:ml-auto rtl:mr-auto",children:(0,l.jsx)("div",{className:"grid h-11 w-11 place-content-center rounded-full bg-[#ffeccb] text-warning dark:bg-warning dark:text-[#ffeccb]",children:m.w.dolarIconSvg})})]}),(0,l.jsx)("div",{children:(0,l.jsx)("div",{className:"rounded-lg bg-white dark:bg-black",children:a?(0,l.jsx)(p,{series:j.series,options:j.options,type:"bar",height:160,width:"100%"}):(0,l.jsx)("div",{className:"grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ",children:(0,l.jsx)("span",{className:"inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"})})})})]}),(0,l.jsxs)("div",{className:"panel h-full sm:col-span-2 xl:col-span-1",children:[(0,l.jsxs)("div",{className:"mb-5 flex items-center justify-between dark:text-white-light",children:[(0,l.jsx)("h5",{className:"text-lg font-semibold",children:"Summary"}),(0,l.jsx)("div",{className:"dropdown",children:(0,l.jsx)(i.Z,{placement:"".concat(t?"bottom-start":"bottom-end"),button:m.w.threeDotDropDown,children:(0,l.jsxs)("ul",{children:[(0,l.jsx)("li",{children:(0,l.jsx)("button",{type:"button",children:"View Report"})}),(0,l.jsx)("li",{children:(0,l.jsx)("button",{type:"button",children:"Edit Report"})}),(0,l.jsx)("li",{children:(0,l.jsx)("button",{type:"button",children:"Mark as Done"})})]})})})]}),(0,l.jsxs)("div",{className:"space-y-9",children:[(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)("div",{className:"h-9 w-9 ltr:mr-3 rtl:ml-3",children:(0,l.jsx)("div",{className:"grid h-9 w-9 place-content-center  rounded-full bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light",children:m.w.summaryIncomeIconSvg})}),(0,l.jsxs)("div",{className:"flex-1",children:[(0,l.jsxs)("div",{className:"mb-2 flex font-semibold text-white-dark",children:[(0,l.jsx)("h6",{children:"Income"}),(0,l.jsx)("p",{className:"ltr:ml-auto rtl:mr-auto",children:"$92,600"})]}),(0,l.jsx)("div",{className:"h-2 rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]",children:(0,l.jsx)("div",{className:"h-full w-11/12 rounded-full bg-gradient-to-r from-[#7579ff] to-[#b224ef]"})})]})]}),(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)("div",{className:"h-9 w-9 ltr:mr-3 rtl:ml-3",children:(0,l.jsx)("div",{className:"grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light",children:m.w.summaryProfitIconSvg})}),(0,l.jsxs)("div",{className:"flex-1",children:[(0,l.jsxs)("div",{className:"mb-2 flex font-semibold text-white-dark",children:[(0,l.jsx)("h6",{children:"Profit"}),(0,l.jsx)("p",{className:"ltr:ml-auto rtl:mr-auto",children:"$37,515"})]}),(0,l.jsx)("div",{className:"h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]",children:(0,l.jsx)("div",{className:"h-full w-full rounded-full bg-gradient-to-r from-[#3cba92] to-[#0ba360]",style:{width:"65%"}})})]})]}),(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)("div",{className:"h-9 w-9 ltr:mr-3 rtl:ml-3",children:(0,l.jsx)("div",{className:"grid h-9 w-9 place-content-center rounded-full bg-warning-light text-warning dark:bg-warning dark:text-warning-light",children:m.w.summaryExpensesIconSvg})}),(0,l.jsxs)("div",{className:"flex-1",children:[(0,l.jsxs)("div",{className:"mb-2 flex font-semibold text-white-dark",children:[(0,l.jsx)("h6",{children:"Expenses"}),(0,l.jsx)("p",{className:"ltr:ml-auto rtl:mr-auto",children:"$55,085"})]}),(0,l.jsx)("div",{className:"h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]",children:(0,l.jsx)("div",{className:"h-full w-full rounded-full bg-gradient-to-r from-[#f09819] to-[#ff5858]",style:{width:"80%"}})})]})]})]})]})]}),(0,l.jsxs)("div",{className:"mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-2",children:[(0,l.jsxs)("div",{className:"panel h-full",children:[(0,l.jsxs)("div",{className:"mb-5 flex items-center justify-between dark:text-white-light",children:[(0,l.jsx)("h5",{className:"text-lg font-semibold",children:"Transactions"}),(0,l.jsx)("div",{className:"dropdown",children:(0,l.jsx)(i.Z,{placement:"".concat(t?"bottom-start":"bottom-end"),button:m.w.threeDotDropDown,children:(0,l.jsxs)("ul",{children:[(0,l.jsx)("li",{children:(0,l.jsx)("button",{type:"button",children:"View Report"})}),(0,l.jsx)("li",{children:(0,l.jsx)("button",{type:"button",children:"Edit Report"})}),(0,l.jsx)("li",{children:(0,l.jsx)("button",{type:"button",children:"Mark as Done"})})]})})})]}),(0,l.jsx)("div",{children:(0,l.jsxs)("div",{className:"space-y-6",children:[(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("span",{className:"grid h-9 w-9 shrink-0 place-content-center rounded-md bg-success-light text-base text-success dark:bg-success dark:text-success-light",children:"VS"}),(0,l.jsxs)("div",{className:"flex-1 px-3",children:[(0,l.jsx)("div",{children:"Video Shoot"}),(0,l.jsx)("div",{className:"text-xs text-white-dark dark:text-gray-500",children:"10 Jan 1:00PM"})]}),(0,l.jsx)("span",{className:"whitespace-pre px-1 text-base text-success ltr:ml-auto rtl:mr-auto",children:"+$36.11"})]}),(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("span",{className:"grid h-9 w-9 shrink-0 place-content-center rounded-md bg-warning-light text-warning dark:bg-warning dark:text-warning-light",children:"IS"}),(0,l.jsxs)("div",{className:"flex-1 px-3",children:[(0,l.jsx)("div",{children:"Image Shoot"}),(0,l.jsx)("div",{className:"text-xs text-white-dark dark:text-gray-500",children:"04 Jan 1:00PM"})]}),(0,l.jsx)("span",{className:"whitespace-pre px-1 text-base text-danger ltr:ml-auto rtl:mr-auto",children:"-$16.44"})]}),(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("span",{className:"grid h-9 w-9 shrink-0 place-content-center rounded-md bg-danger-light text-danger dark:bg-danger dark:text-danger-light",children:"IS"}),(0,l.jsxs)("div",{className:"flex-1 px-3",children:[(0,l.jsx)("div",{children:"Image Shoot"}),(0,l.jsx)("div",{className:"text-xs text-white-dark dark:text-gray-500",children:"10 Jan 1:00PM"})]}),(0,l.jsx)("span",{className:"whitespace-pre px-1 text-base text-success ltr:ml-auto rtl:mr-auto",children:"+$66.44"})]}),(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("span",{className:"grid h-9 w-9 shrink-0 place-content-center rounded-md bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light",children:"WS"}),(0,l.jsxs)("div",{className:"flex-1 px-3",children:[(0,l.jsx)("div",{children:"Wedding Shoot"}),(0,l.jsx)("div",{className:"text-xs text-white-dark dark:text-gray-500",children:"04 Jan 1:00PM"})]}),(0,l.jsx)("span",{className:"whitespace-pre px-1 text-base text-danger ltr:ml-auto rtl:mr-auto",children:"-$32.00"})]}),(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("span",{className:"grid h-9 w-9 shrink-0 place-content-center rounded-md bg-info-light text-base text-info dark:bg-info dark:text-info-light",children:"CS"}),(0,l.jsxs)("div",{className:"flex-1 px-3",children:[(0,l.jsx)("div",{children:"Commercial Shoot"}),(0,l.jsx)("div",{className:"text-xs text-white-dark dark:text-gray-500",children:"10 Jan 1:00PM"})]}),(0,l.jsx)("span",{className:"whitespace-pre px-1 text-base text-success ltr:ml-auto rtl:mr-auto",children:"+$10.08"})]}),(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("span",{className:"grid h-9 w-9 shrink-0 place-content-center rounded-md bg-primary-light text-primary dark:bg-primary dark:text-primary-light",children:"VS"}),(0,l.jsxs)("div",{className:"flex-1 px-3",children:[(0,l.jsx)("div",{children:"Video Shoot"}),(0,l.jsx)("div",{className:"text-xs text-white-dark dark:text-gray-500",children:"04 Jan 1:00PM"})]}),(0,l.jsx)("span",{className:"whitespace-pre px-1 text-base text-danger ltr:ml-auto rtl:mr-auto",children:"-$22.00"})]})]})})]}),(0,l.jsxs)("div",{className:"panel h-full overflow-hidden border-0 p-0",children:[(0,l.jsxs)("div",{className:"min-h-[190px] bg-gradient-to-r from-[#EEBE43] to-[#6B510F] p-6",children:[(0,l.jsxs)("div",{className:"mb-6 flex items-center justify-between",children:[(0,l.jsxs)("div",{className:"flex items-center rounded-full bg-black/50 p-1 font-semibold text-white ltr:pr-3 rtl:pl-3",children:[(0,l.jsx)("img",{className:"block h-8 w-8 rounded-full border-2 border-white/50 object-cover ltr:mr-1 rtl:ml-1",src:"/assets/images/profile-34.jpeg",alt:"avatar"}),"Alan Green"]}),(0,l.jsx)("button",{type:"button",className:"flex h-9 w-9 items-center justify-between rounded-md bg-[#164F57] text-white hover:opacity-80 ltr:ml-auto rtl:mr-auto",children:m.w.plusIconSvg})]}),(0,l.jsxs)("div",{className:"flex items-center justify-between text-white",children:[(0,l.jsx)("p",{className:"text-xl",children:"Wallet Balance"}),(0,l.jsxs)("h5",{className:"text-2xl ltr:ml-auto rtl:mr-auto",children:[(0,l.jsx)("span",{className:"text-white-light",children:"$"}),"2953"]})]})]}),(0,l.jsxs)("div",{className:"-mt-12 grid grid-cols-2 gap-2 px-8",children:[(0,l.jsxs)("div",{className:"rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]",children:[(0,l.jsxs)("span",{className:"mb-4 flex items-center justify-between dark:text-white",children:["Received",(0,l.jsx)("svg",{className:"h-4 w-4 text-success",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,l.jsx)("path",{d:"M19 15L12 9L5 15",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),(0,l.jsx)("div",{className:"btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]",children:"$97.99"})]}),(0,l.jsxs)("div",{className:"rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]",children:[(0,l.jsxs)("span",{className:"mb-4 flex items-center justify-between dark:text-white",children:["Spent",(0,l.jsx)("svg",{className:"h-4 w-4 text-danger",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,l.jsx)("path",{d:"M19 9L12 15L5 9",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),(0,l.jsx)("div",{className:"btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]",children:"$53.00"})]})]}),(0,l.jsxs)("div",{className:"p-5",children:[(0,l.jsx)("div",{className:"mb-5",children:(0,l.jsx)("span",{className:"rounded-full bg-[#1b2e4b] px-4 py-1.5 text-xs text-white before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-white ltr:before:mr-2 rtl:before:ml-2",children:"Pending"})}),(0,l.jsxs)("div",{className:"mb-5 space-y-1",children:[(0,l.jsxs)("div",{className:"flex items-center justify-between",children:[(0,l.jsx)("p",{className:"font-semibold text-[#515365]",children:"Photo Shoot"}),(0,l.jsxs)("p",{className:"text-base",children:[(0,l.jsx)("span",{children:"$"})," ",(0,l.jsx)("span",{className:"font-semibold",children:"13.85"})]})]}),(0,l.jsxs)("div",{className:"flex items-center justify-between",children:[(0,l.jsx)("p",{className:"font-semibold text-[#515365]",children:"Video Shoot"}),(0,l.jsxs)("p",{className:"text-base",children:[(0,l.jsx)("span",{children:"$"})," ",(0,l.jsx)("span",{className:"font-semibold ",children:"15.66"})]})]})]}),(0,l.jsxs)("div",{className:"flex justify-around px-2 text-center",children:[(0,l.jsx)("button",{type:"button",className:"btn btn-secondary ltr:mr-2 rtl:ml-2",children:"View Details"}),(0,l.jsx)("button",{type:"button",className:"btn btn-success",children:"Pay Now $29.51"})]})]})]})]}),(0,l.jsxs)("div",{className:"grid grid-cols-1 gap-6 lg:grid-cols-2",children:[(0,l.jsxs)("div",{className:"panel h-full w-full",children:[(0,l.jsx)("div",{className:"mb-5 flex items-center justify-between",children:(0,l.jsx)("h5",{className:"text-lg font-semibold dark:text-white-light",children:"Recent Orders"})}),(0,l.jsx)("div",{className:"table-responsive",children:(0,l.jsxs)("table",{children:[(0,l.jsx)("thead",{children:(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{className:"ltr:rounded-l-md rtl:rounded-r-md",children:"Order Name"}),(0,l.jsx)("th",{children:"Price"}),(0,l.jsx)("th",{children:"Flie Status"}),(0,l.jsx)("th",{className:"ltr:rounded-r-md rtl:rounded-l-md",children:"Status"})]})}),(0,l.jsx)("tbody",{children:null==u?void 0:u.map(e=>{var s;return(0,l.jsxs)("tr",{className:"group text-white-dark hover:text-black dark:hover:text-white-light/90",children:[(0,l.jsx)("td",{className:"min-w-[150px] text-black dark:text-white",children:(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)("span",{className:"inline-block h-[32px] w-[32px] rounded-[8px] bg-[#BAE7FF] text-center text-[12px] uppercase leading-[32px] leading-none text-[#2196F3] ltr:mr-3 rtl:ml-3",children:null==e?void 0:e.order_name.slice(0,2)}),(0,l.jsxs)("p",{className:"whitespace-nowrap",children:[null==e?void 0:e.order_name,(0,l.jsx)("span",{className:"block text-xs text-[#888EA8]",children:new Date(null==e?void 0:null===(s=e.shoot_datetimes[0])||void 0===s?void 0:s.shoot_date_time).toDateString()})]})]})}),(0,l.jsx)("td",{children:"$56.07"}),(0,l.jsx)("td",{className:"text-success",children:"Available"}),(0,l.jsx)("td",{children:(0,l.jsx)("div",{className:"",children:(0,l.jsx)(d.Z,{children:null==e?void 0:e.order_status})})})]},e.id)})})]})})]}),(0,l.jsxs)("div",{className:"panel h-full w-full",children:[(0,l.jsx)("div",{className:"mb-5 flex items-center justify-between",children:(0,l.jsx)("h5",{className:"text-lg font-semibold dark:text-white-light",children:"Top Rated Producer"})}),(0,l.jsx)("div",{className:"table-responsive",children:(0,l.jsxs)("table",{children:[(0,l.jsx)("thead",{children:(0,l.jsxs)("tr",{className:"border-b-0",children:[(0,l.jsx)("th",{className:"ltr:rounded-l-md rtl:rounded-r-md",children:"Name"}),(0,l.jsx)("th",{children:"Ratings"}),(0,l.jsx)("th",{children:"Complition Rate"}),(0,l.jsx)("th",{children:"Completed"})]})}),(0,l.jsxs)("tbody",{children:[(0,l.jsxs)("tr",{className:"group text-white-dark hover:text-black dark:hover:text-white-light/90",children:[(0,l.jsx)("td",{className:"min-w-[150px] text-black dark:text-white",children:(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("img",{className:"h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3",src:"/assets/images/is.svg",alt:"avatar"}),(0,l.jsxs)("p",{className:"whitespace-nowrap",children:["Photo Shoot",(0,l.jsx)("span",{className:"block text-xs text-primary",children:"Digital"})]})]})}),(0,l.jsx)("td",{children:"$168.09"}),(0,l.jsx)("td",{children:"$60.09"}),(0,l.jsx)("td",{children:"170"})]}),(0,l.jsxs)("tr",{className:"group text-white-dark hover:text-black dark:hover:text-white-light/90",children:[(0,l.jsx)("td",{className:"text-black dark:text-white",children:(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("img",{className:"h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3",src:"/assets/images/ps.svg",alt:"avatar"}),(0,l.jsxs)("p",{className:"whitespace-nowrap",children:["Video Shoot ",(0,l.jsx)("span",{className:"block text-xs text-warning",children:"Faishon"})]})]})}),(0,l.jsx)("td",{children:"$126.04"}),(0,l.jsx)("td",{children:"$47.09"}),(0,l.jsx)("td",{children:"130"})]}),(0,l.jsxs)("tr",{className:"group text-white-dark hover:text-black dark:hover:text-white-light/90",children:[(0,l.jsx)("td",{className:"text-black dark:text-white",children:(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("img",{className:"h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3",src:"/assets/images/ws.svg",alt:"avatar"}),(0,l.jsxs)("p",{className:"whitespace-nowrap",children:["Wedding Shoot ",(0,l.jsx)("span",{className:"block text-xs text-danger",children:"Accessories"})]})]})}),(0,l.jsx)("td",{children:"$56.07"}),(0,l.jsx)("td",{children:"$20.00"}),(0,l.jsx)("td",{children:"66"})]}),(0,l.jsxs)("tr",{className:"group text-white-dark hover:text-black dark:hover:text-white-light/90",children:[(0,l.jsx)("td",{className:"text-black dark:text-white",children:(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("img",{className:"h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3",src:"/assets/images/cs.svg",alt:"avatar"}),(0,l.jsxs)("p",{className:"whitespace-nowrap",children:["Commercial Shoot ",(0,l.jsx)("span",{className:"block text-xs text-primary",children:"Digital"})]})]})}),(0,l.jsx)("td",{children:"$110.00"}),(0,l.jsx)("td",{children:"$33.00"}),(0,l.jsx)("td",{children:"35"})]}),(0,l.jsxs)("tr",{className:"group text-white-dark hover:text-black dark:hover:text-white-light/90",children:[(0,l.jsx)("td",{className:"text-black dark:text-white",children:(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("img",{className:"h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3",src:"/assets/images/is.svg",alt:"avatar"}),(0,l.jsxs)("p",{className:"whitespace-nowrap",children:["Photo Shoot ",(0,l.jsx)("span",{className:"block text-xs text-primary",children:"Digital"})]})]})}),(0,l.jsx)("td",{children:"$56.07"}),(0,l.jsx)("td",{children:"$26.04"}),(0,l.jsx)("td",{children:"30"})]})]})]})})]})]})]})]})}},2453:function(e,s,t){var l=t(5893);t(7294),s.Z=e=>{let s,t,{children:a}=e;return"change_request"===a||"pre_production"===a||"open"===a?(s="#FBEDD9",t="#885A00"):"pending"===a||"ongoing"===a||"in_dispute"===a||"Unverified"===a?(s="#FFE9E9",t="#B50000"):"cancelled"===a||"upcoming"===a?s="#E8E8E8":("rescheduled"===a||"completed"===a)&&(s="#E6FBD9"),(0,l.jsx)("div",{className:"inline rounded-2xl border border-solid px-3 py-2",style:{backgroundColor:s},children:(0,l.jsx)("p",{className:"inline capitalize",style:{color:t},children:a})})}}}]);