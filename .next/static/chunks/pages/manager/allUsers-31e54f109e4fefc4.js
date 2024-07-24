(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[759],{430:function(e,l,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/manager/allUsers",function(){return s(8888)}])},2453:function(e,l,s){"use strict";var a=s(5893);s(7294),l.Z=e=>{let l,s,{children:t}=e;return"change_request"===t||"pre_production"===t||"open"===t?(l="#FBEDD9",s="#885A00"):"pending"===t||"ongoing"===t||"in_dispute"===t||"Unverified"===t?(l="#FFE9E9",s="#B50000"):"cancelled"===t||"upcoming"===t?l="#E8E8E8":("rescheduled"===t||"completed"===t)&&(l="#E6FBD9"),(0,a.jsx)("div",{className:"inline rounded-2xl border border-solid px-3 py-2",style:{backgroundColor:l},children:(0,a.jsx)("p",{className:"inline capitalize",style:{color:s},children:t})})}},4379:function(e,l,s){"use strict";var a=s(7294);l.Z=e=>{let[l,s]=(0,a.useState)(null);return(0,a.useEffect)(()=>{let l=(e=>{let l=new Date(e);console.log("\uD83D\uDE80 ~ makeDateFormat ~ date:",l);let s=["January","February","March","April","May","June","July","August","September","October","November","December"][l.getMonth()],a=l.getDate(),t=l.getFullYear(),n=l.getHours(),i=l.getMinutes(),r=n>=12?"pm":"am";n%=12,n=n||12;let d=n+":"+(i<10?"0":"")+i+" "+r,o="".concat(s," ").concat(a,", ").concat(t);return{date:o,time:d}})(e);s(l)},[e]),l}},8888:function(e,l,s){"use strict";s.r(l);var a=s(5893),t=s(3197),n=s(1664),i=s.n(n),r=s(7294),d=s(9473);s(4321);var o=s(1467),c=s(3317),m=s(2453),u=s(1355),h=s(806),x=s(4379),f=s(1163),p=s(7536),j=s(4246);l.default=()=>{let[e,l]=(0,r.useState)(!1),[s,n]=(0,r.useState)(!1),[b,v]=(0,r.useState)([]),[g,N]=(0,r.useState)(1),[w,y]=(0,r.useState)(1),[E,k]=(0,r.useState)(!0),[C,D]=(0,r.useState)(!1),[V,F]=(0,r.useState)(null),[S,_]=(0,r.useState)(),I=null==V?void 0:V.createdAt;(0,x.Z)(I),(0,r.useEffect)(()=>{getAllUsers()},[g]);let getAllUsers=async()=>{try{let e=await fetch("".concat(t.QP,"users?limit=10&page=").concat(g)),l=await e.json();y(null==l?void 0:l.totalPages),v(l.results)}catch(e){console.error(e)}},U=(0,f.useRouter)(),getUserDetails=async e=>{k(!0);try{let l=await fetch("".concat(t.QP,"users/").concat(e)),s=await l.json();if(s){if(F(s),k(!1),"cp"===s.role){let e="cp/".concat(null==s?void 0:s.id);U.push(e)}else n(!0)}else D(!0),k(!1)}catch(e){console.error(e),k(!1)}},z=(0,d.I0)();(0,r.useEffect)(()=>{z((0,o.Iw)("Client Dashboard"))}),(0,r.useEffect)(()=>{l(!0)},[]);let handleInputChange=(e,l)=>{F({...V,[e]:l})},{register:A,handleSubmit:P}=(0,p.cI)();return(0,a.jsx)(a.Fragment,{children:(0,a.jsxs)("div",{children:[(0,a.jsxs)("ul",{className:"flex space-x-2 rtl:space-x-reverse",children:[(0,a.jsx)("li",{children:(0,a.jsx)(i(),{href:"/",className:"text-warning hover:underline",children:"Dashboard"})}),(0,a.jsx)("li",{className:"before:content-['/'] ltr:before:mr-2 rtl:before:ml-2",children:(0,a.jsx)("span",{children:"All Users"})})]}),(0,a.jsx)("div",{className:"mt-5 grid grid-cols-1 lg:grid-cols-1",children:(0,a.jsxs)("div",{className:"panel",children:[(0,a.jsx)("div",{className:"mb-5 flex items-center justify-between",children:(0,a.jsx)("h5",{className:"text-lg font-semibold dark:text-white-light",children:"All Users"})}),(0,a.jsx)("div",{className:"mb-5",children:(0,a.jsx)("div",{className:"inline-block w-full",children:(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"table-responsive",children:[(0,a.jsxs)("table",{children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{className:"font-mono hidden md:block",children:"User ID"}),(0,a.jsx)("th",{className:"font-mono ltr:rounded-l-md rtl:rounded-r-md",children:"Name"}),(0,a.jsx)("th",{className:"font-mono",children:"Email"}),(0,a.jsx)("th",{className:"font-mono",children:"Role"}),(0,a.jsx)("th",{className:"font-mono ltr:rounded-r-md rtl:rounded-l-md hidden md:block",children:"Status"}),(0,a.jsx)("th",{className:"font-mono",children:"Edit"})]})}),(0,a.jsx)("tbody",{children:null==b?void 0:b.map(e=>(0,a.jsxs)("tr",{className:"group text-white-dark hover:text-black dark:hover:text-white-light/90",children:[(0,a.jsx)("td",{className:"min-w-[150px] font-sans text-black dark:text-white hidden md:block",children:(0,a.jsx)("div",{className:"flex items-center",children:(0,a.jsx)("p",{className:"whitespace-nowrap",children:null==e?void 0:e.id})})}),(0,a.jsx)("td",{children:null==e?void 0:e.name}),(0,a.jsx)("td",{children:null==e?void 0:e.email}),(0,a.jsx)("td",{className:"font-sans text-success",children:null==e?void 0:e.role}),(0,a.jsx)("td",{className:"hidden md:block",children:(0,a.jsx)("div",{className:"font-sans ",children:(0,a.jsx)(m.Z,{children:(null==e?void 0:e.isEmailVerified)===!0?"Verified":"Unverified"})})}),(0,a.jsx)("td",{children:(0,a.jsx)("button",{onClick:()=>getUserDetails(e.id),type:"button",className:"p-0",children:c.w.pencilIconForEdit})})]},e.id))})]}),(0,a.jsx)("div",{className:"mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16",children:(0,a.jsx)(j.ZP,{current:g,total:w,onPageChange:e=>{N(e)},maxWidth:400})})]}),(0,a.jsx)(u.u,{appear:!0,show:s,as:r.Fragment,children:(0,a.jsx)(h.V,{as:"div",open:s,onClose:()=>n(!1),children:(0,a.jsx)("div",{className:"fixed inset-0 z-[999] overflow-y-auto bg-[black]/60",children:(0,a.jsx)("div",{className:"flex min-h-screen items-start justify-center md:px-4",children:(0,a.jsxs)(h.V.Panel,{as:"div",className:"panel my-32 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark w-10/12 md:w-3/5 xl:w-3/6 2xl:w-2/6",children:[(0,a.jsxs)("div",{className:"flex my-2 items-center justify-between bg-[#fbfbfb] px-3 py-3 dark:bg-[#121c2c]",children:[(0,a.jsx)("div",{className:"text-[22px] font-bold capitalize leading-none text-[#000000] ms-3",children:" users details "}),(0,a.jsx)("button",{type:"button",className:"text-white-dark hover:text-dark",onClick:()=>n(!1),children:c.w.closeModalSvg})]}),(0,a.jsxs)("div",{className:"",children:[(0,a.jsxs)("h2",{className:"mx-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#ACA686]",children:["Detail Information of ",null==V?void 0:V.name," "]}),(0,a.jsx)("form",{onSubmit:P(e=>{let l={id:(null==V?void 0:V.id)||(null==e?void 0:e.id),name:(null==V?void 0:V.name)||(null==e?void 0:e.name),email:(null==V?void 0:V.email)||(null==e?void 0:e.email),role:(null==V?void 0:V.role)||(null==e?void 0:e.role),location:(null==V?void 0:V.location)||(null==e?void 0:e.location),isEmailVerified:(null==V?void 0:V.isEmailVerified)||(null==e?void 0:e.isEmailVerified)};console.log("\uD83D\uDE80 ~ onSubmit ~ updatedUserDetails:",l)}),className:"mx-6 pb-6",children:(0,a.jsxs)("div",{className:"md:flex justify-between mx-auto pb-6 space-y-5 md:space-y-0 box-border px-6",children:[(0,a.jsxs)("div",{className:"left space-y-4 ",children:[(0,a.jsxs)("div",{className:"",children:[(0,a.jsx)("label",{htmlFor:"id",className:" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize",children:"User id"}),(0,a.jsx)("input",{...A("id"),defaultValue:null==V?void 0:V.id,className:"border rounded p-3 focus:outline-none text-gray-600 focus:border-gray-400 mt-1 bg-gray-200",onChange:e=>handleInputChange("id",e.target.value),disabled:!0})]}),(0,a.jsxs)("div",{className:"",children:[(0,a.jsx)("label",{htmlFor:"name",className:" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize",children:"Name"}),(0,a.jsx)("input",{...A("name"),defaultValue:null==V?void 0:V.name,className:"border rounded p-3 focus:outline-none text-gray-600 focus:border-gray-400  mt-1",onChange:e=>handleInputChange("name",e.target.value)})]}),(0,a.jsxs)("div",{className:"",children:[(0,a.jsx)("label",{htmlFor:"email",className:" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize",children:"email"}),(0,a.jsx)("input",{...A("email"),defaultValue:null==V?void 0:V.email,className:"border rounded p-3 focus:outline-none text-gray-600 focus:border-gray-400  mt-1",onChange:e=>handleInputChange("email",e.target.value)})]})]}),(0,a.jsxs)("div",{className:"right space-y-4",children:[(0,a.jsxs)("div",{className:"",children:[(0,a.jsx)("label",{htmlFor:"isEmailVerified",className:"mb-0 font-sans text-[14px] rtl:ml-2 w-1/4 md:w-full capitalize",children:"Email Verified"}),(0,a.jsxs)("select",{className:"border rounded p-3 focus:outline-none focus:border-gray-400 ms-12 md:ms-0 mt-1 w-56",id:"isEmailVerified",defaultValue:null==V?void 0:V.isEmailVerified,...A("isEmailVerified"),onChange:e=>handleInputChange("isEmailVerified",e.target.value),children:[(0,a.jsx)("option",{value:"true",children:"Yes"}),(0,a.jsx)("option",{value:"false",children:"No"})]})]}),(0,a.jsxs)("div",{className:"",children:[(0,a.jsx)("label",{htmlFor:"role",className:" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize",children:"role"}),(0,a.jsxs)("select",{className:"border rounded p-3 focus:outline-none focus:border-gray-400 ms-12 md:ms-0 mt-1 w-56",id:"role",defaultValue:null==V?void 0:V.role,...A("role"),onChange:e=>handleInputChange("role",e.target.value),children:[(0,a.jsx)("option",{value:"manager",children:"Manager"}),(0,a.jsx)("option",{value:"user",children:"User"}),(0,a.jsx)("option",{value:"cp",children:"Cp"})]})]}),(0,a.jsxs)("div",{className:"",children:[(0,a.jsx)("label",{htmlFor:"location",className:" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize",children:"Address"}),(0,a.jsx)("input",{...A("location"),defaultValue:null==V?void 0:V.location,className:"border rounded p-3 focus:outline-none text-gray-600 focus:border-gray-400  mt-1 ",onChange:e=>handleInputChange("location",e.target.value)})]}),(0,a.jsx)("div",{className:"",children:(0,a.jsx)("button",{type:"submit",className:"btn bg-black font-sans text-white mb-4 capitalize md:block mt-5",children:"Save"})})]})]})})]})]})})})})})]})})})]})})]})})}}},function(e){e.O(0,[378,531,536,774,888,179],function(){return e(e.s=430)}),_N_E=e.O()}]);