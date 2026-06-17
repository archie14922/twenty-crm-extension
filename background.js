var background=(function(){"use strict";const $=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,A=$;function Z(n){return n==null||typeof n=="function"?{main:n}:n}const ee=`
  query FindPersonByLinkedIn($filter: PersonFilterInput) {
    people(filter: $filter, first: 1) {
      edges {
        node {
          id
          name {
            firstName
            lastName
          }
          linkedinLink {
            primaryLinkUrl
            primaryLinkLabel
          }
          jobTitle
          avatarUrl
          city
          company {
            id
            name
          }
        }
      }
    }
  }
`,te=`
  query FindCompanyByLinkedIn($filter: CompanyFilterInput) {
    companies(filter: $filter, first: 1) {
      edges {
        node {
          id
          name
          linkedinLink {
            primaryLinkUrl
            primaryLinkLabel
          }
          domainName {
            primaryLinkUrl
            primaryLinkLabel
          }
          employees
        }
      }
    }
  }
`,re=`
  query FindCompanyByName($filter: CompanyFilterInput) {
    companies(filter: $filter, first: 5) {
      edges {
        node {
          id
          name
          linkedinLink {
            primaryLinkUrl
          }
        }
      }
    }
  }
`,ne=`
  query FindPersonByName($filter: PersonFilterInput) {
    people(filter: $filter, first: 5) {
      edges {
        node {
          id
          name {
            firstName
            lastName
          }
          linkedinLink {
            primaryLinkUrl
          }
          jobTitle
          company {
            id
            name
          }
        }
      }
    }
  }
`,ae=`
  query SearchPeople($filter: PersonFilterInput) {
    people(filter: $filter, first: 10) {
      edges {
        node {
          id
          name {
            firstName
            lastName
          }
          jobTitle
          company {
            id
            name
          }
        }
      }
    }
  }
`,oe=`
  query SearchCompanies($filter: CompanyFilterInput) {
    companies(filter: $filter, first: 10) {
      edges {
        node {
          id
          name
          domainName {
            primaryLinkUrl
          }
        }
      }
    }
  }
`,ie=`
  mutation UpdatePerson($id: UUID!, $input: PersonUpdateInput!) {
    updatePerson(id: $id, data: $input) {
      id
      name {
        firstName
        lastName
      }
    }
  }
`,se=`
  mutation UpdateCompany($id: UUID!, $input: CompanyUpdateInput!) {
    updateCompany(id: $id, data: $input) {
      id
      name
    }
  }
`,le=`
  mutation CreatePerson($input: PersonCreateInput!) {
    createPerson(data: $input) {
      id
      name {
        firstName
        lastName
      }
      linkedinLink {
        primaryLinkUrl
      }
      company {
        id
        name
      }
    }
  }
`,W=`
  mutation CreateCompany($input: CompanyCreateInput!) {
    createCompany(data: $input) {
      id
      name
      linkedinLink {
        primaryLinkUrl
      }
    }
  }
`;class ce{baseUrl;token=null;constructor(e){this.baseUrl=e.replace(/\/$/,"")}setToken(e){this.token=e}async uploadImageViaGraphQL(e,t){if(!this.token)return console.error("[Twenty] No authentication token set for image upload"),null;console.log("[Twenty] Starting image upload from:",e);try{console.log("[Twenty] Fetching image...");const r=await fetch(e);if(!r.ok)return console.error("[Twenty] Failed to fetch image:",r.status,r.statusText),null;const a=await r.blob();console.log("[Twenty] Image fetched, size:",a.size,"type:",a.type);const c=t||`profile-${Date.now()}.jpg`,d=JSON.stringify({query:`
          mutation UploadImage($file: Upload!, $fileFolder: FileFolder) {
            uploadImage(file: $file, fileFolder: $fileFolder) {
              path
              token
            }
          }
        `,variables:{file:null,fileFolder:"PersonPicture"}}),y=JSON.stringify({0:["variables.file"]}),f=new FormData;f.append("operations",d),f.append("map",y),f.append("0",a,c);const I=`${this.baseUrl}/graphql`;console.log("[Twenty] Uploading via GraphQL to:",I);const p=await fetch(I,{method:"POST",headers:{Authorization:`Bearer ${this.token}`},body:f});if(console.log("[Twenty] Upload response status:",p.status),!p.ok){const L=await p.text();return console.error("[Twenty] Failed to upload image:",p.status,L),null}const v=await p.json();if(console.log("[Twenty] Upload result:",v),v.errors?.length)return console.error("[Twenty] GraphQL errors:",v.errors),null;const P=v.data?.uploadImage;if(P?.path){const L=P.path;return console.log("[Twenty] Image uploaded successfully, path:",L),L}return console.warn("[Twenty] Upload succeeded but no path/token in response:",v),null}catch(r){return console.error("[Twenty] Error uploading image:",r),null}}async graphqlRequest(e,t){if(!this.token)throw new Error("No authentication token set");const r=await fetch(`${this.baseUrl}/graphql`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.token}`},body:JSON.stringify({query:e,variables:t})});if(!r.ok)throw new Error(`HTTP error: ${r.status}`);return r.json()}async findPersonByLinkedInUrl(e){const t=this.normalizeLinkedInUrl(e),r=await this.graphqlRequest(ee,{filter:{linkedinLink:{primaryLinkUrl:{ilike:`%${t}%`}}}});if(r.errors?.length)throw new Error(r.errors[0].message);return r.data?.people.edges[0]?.node||null}async findCompanyByLinkedInUrl(e){const t=this.normalizeLinkedInUrl(e),r=await this.graphqlRequest(te,{filter:{linkedinLink:{primaryLinkUrl:{ilike:`%${t}%`}}}});if(r.errors?.length)throw new Error(r.errors[0].message);return r.data?.companies.edges[0]?.node||null}async findCompanyByName(e){const t=await this.graphqlRequest(re,{filter:{name:{ilike:`%${e}%`}}});if(t.errors?.length)throw new Error(t.errors[0].message);const r=t.data?.companies.edges||[],a=r.find(c=>c.node.name.toLowerCase()===e.toLowerCase());return a?a.node:r[0]?.node||null}async findPersonByName(e,t){const r=await this.graphqlRequest(ne,{filter:{and:[{name:{firstName:{ilike:`%${e}%`}}},{name:{lastName:{ilike:`%${t}%`}}}]}});if(r.errors?.length)throw new Error(r.errors[0].message);const a=r.data?.people.edges||[],c=a.find(d=>d.node.name.firstName.toLowerCase()===e.toLowerCase()&&d.node.name.lastName.toLowerCase()===t.toLowerCase());return c?c.node:a[0]?.node||null}async findOrCreateCompany(e){const t=await this.findCompanyByName(e);if(t)return console.log("Found existing company:",t.name),{id:t.id,name:t.name,created:!1};console.log("Creating new company:",e);const r=await this.createCompanySimple(e);return{id:r.id,name:r.name,created:!0}}async createCompanySimple(e){const t=await this.graphqlRequest(W,{input:{name:e}});if(t.errors?.length)throw new Error(t.errors[0].message);if(!t.data?.createCompany)throw new Error("Failed to create company");return t.data.createCompany}async createPerson(e){let t,r=!1;if(console.log("[Twenty] createPerson - currentCompany:",e.currentCompany),e.currentCompany){console.log("[Twenty] Attempting to find or create company:",e.currentCompany);try{const d=await this.findOrCreateCompany(e.currentCompany);t=d.id,r=d.created,console.log(`[Twenty] Company ${d.created?"created":"found"}:`,d.name,"id:",t)}catch(d){console.error("[Twenty] Error finding/creating company:",d)}}else console.log("[Twenty] No currentCompany in data, skipping company creation");let a=e.profileImageUrl||"";if(e.profileImageUrl){console.log("[Twenty] Attempting to upload profile image...");try{const d=await this.uploadImageViaGraphQL(e.profileImageUrl,`${e.firstName}-${e.lastName}-profile.jpg`);d?(a=d,console.log("[Twenty] Profile image uploaded, using:",a)):console.log("[Twenty] Upload failed, using LinkedIn URL directly")}catch(d){console.error("[Twenty] Error uploading profile image:",d)}}const c=await this.graphqlRequest(le,{input:{name:{firstName:e.firstName,lastName:e.lastName},linkedinLink:{primaryLinkUrl:e.linkedinUrl,primaryLinkLabel:"LinkedIn"},jobTitle:e.headline||"",avatarUrl:a,city:e.location||"",companyId:t}});if(c.errors?.length)throw new Error(c.errors[0].message);if(!c.data?.createPerson)throw new Error("Failed to create person");return{...c.data.createPerson,companyCreated:r}}async createCompany(e){const t=await this.graphqlRequest(W,{input:{name:e.name,linkedinLink:{primaryLinkUrl:e.linkedinUrl,primaryLinkLabel:"LinkedIn"},domainName:e.website?{primaryLinkUrl:e.website,primaryLinkLabel:"Website"}:void 0,employees:e.employeeCount?this.parseEmployeeCount(e.employeeCount):void 0}});if(t.errors?.length)throw new Error(t.errors[0].message);if(!t.data?.createCompany)throw new Error("Failed to create company");return t.data.createCompany}async testConnection(){try{const e=await this.graphqlRequest("query { people(first: 1) { edges { node { id } } } }");return!e.errors?.length&&e.data?.people!==void 0}catch{return!1}}async searchRecords(e,t){if(t==="person"){const r=await this.graphqlRequest(ae,{filter:{or:[{name:{firstName:{ilike:`%${e}%`}}},{name:{lastName:{ilike:`%${e}%`}}}]}});if(r.errors?.length)throw new Error(r.errors[0].message);return(r.data?.people.edges||[]).map(a=>({id:a.node.id,name:`${a.node.name.firstName} ${a.node.name.lastName}`,subtitle:a.node.jobTitle||a.node.company?.name||void 0,type:"person"}))}else{const r=await this.graphqlRequest(oe,{filter:{name:{ilike:`%${e}%`}}});if(r.errors?.length)throw new Error(r.errors[0].message);return(r.data?.companies.edges||[]).map(a=>({id:a.node.id,name:a.node.name,subtitle:a.node.domainName?.primaryLinkUrl||void 0,type:"company"}))}}async updateRecordWithLinkedInData(e,t,r){if(t==="person"&&r.type==="person"){const a=r;let c;if(a.currentCompany)try{c=(await this.findOrCreateCompany(a.currentCompany)).id}catch(f){console.error("Error finding/creating company:",f)}let d=a.profileImageUrl||void 0;if(a.profileImageUrl)try{const f=await this.uploadImageViaGraphQL(a.profileImageUrl,`${a.firstName}-${a.lastName}-profile.jpg`);f&&(d=f,console.log("[Twenty] Profile image uploaded for update:",d))}catch(f){console.error("[Twenty] Error uploading profile image:",f)}const y=await this.graphqlRequest(ie,{id:e,input:{name:{firstName:a.firstName,lastName:a.lastName},linkedinLink:{primaryLinkUrl:a.linkedinUrl,primaryLinkLabel:"LinkedIn"},jobTitle:a.headline||void 0,avatarUrl:d,city:a.location||void 0,companyId:c}});if(y.errors?.length)throw new Error(y.errors[0].message)}else if(t==="company"&&r.type==="company"){const a=r,c=await this.graphqlRequest(se,{id:e,input:{name:a.name,linkedinLink:{primaryLinkUrl:a.linkedinUrl,primaryLinkLabel:"LinkedIn"},domainName:a.website?{primaryLinkUrl:a.website,primaryLinkLabel:"Website"}:void 0,employees:a.employeeCount?this.parseEmployeeCount(a.employeeCount):void 0}});if(c.errors?.length)throw new Error(c.errors[0].message)}}normalizeLinkedInUrl(e){const t=e.match(/linkedin\.com\/(in|company)\/([^/?]+)/);return t?t[2]:e}parseEmployeeCount(e){const t=e.match(/(\d+(?:,\d+)?)/);if(t)return parseInt(t[1].replace(/,/g,""),10)}}function G(n){try{return JSON.parse(n).accessOrWorkspaceAgnosticToken?.token||null}catch{return null}}var z=Object.prototype.hasOwnProperty;function F(n,e){var t,r;if(n===e)return!0;if(n&&e&&(t=n.constructor)===e.constructor){if(t===Date)return n.getTime()===e.getTime();if(t===RegExp)return n.toString()===e.toString();if(t===Array){if((r=n.length)===e.length)for(;r--&&F(n[r],e[r]););return r===-1}if(!t||typeof n=="object"){r=0;for(t in n)if(z.call(n,t)&&++r&&!z.call(e,t)||!(t in e)||!F(n[t],e[t]))return!1;return Object.keys(e).length===r}}return n!==n&&e!==e}const ue=new Error("request for lock canceled");var de=function(n,e,t,r){function a(c){return c instanceof t?c:new t(function(d){d(c)})}return new(t||(t=Promise))(function(c,d){function y(p){try{I(r.next(p))}catch(v){d(v)}}function f(p){try{I(r.throw(p))}catch(v){d(v)}}function I(p){p.done?c(p.value):a(p.value).then(y,f)}I((r=r.apply(n,e||[])).next())})};class me{constructor(e,t=ue){this._value=e,this._cancelError=t,this._queue=[],this._weightedWaiters=[]}acquire(e=1,t=0){if(e<=0)throw new Error(`invalid weight ${e}: must be positive`);return new Promise((r,a)=>{const c={resolve:r,reject:a,weight:e,priority:t},d=Y(this._queue,y=>t<=y.priority);d===-1&&e<=this._value?this._dispatchItem(c):this._queue.splice(d+1,0,c)})}runExclusive(e){return de(this,arguments,void 0,function*(t,r=1,a=0){const[c,d]=yield this.acquire(r,a);try{return yield t(c)}finally{d()}})}waitForUnlock(e=1,t=0){if(e<=0)throw new Error(`invalid weight ${e}: must be positive`);return this._couldLockImmediately(e,t)?Promise.resolve():new Promise(r=>{this._weightedWaiters[e-1]||(this._weightedWaiters[e-1]=[]),pe(this._weightedWaiters[e-1],{resolve:r,priority:t})})}isLocked(){return this._value<=0}getValue(){return this._value}setValue(e){this._value=e,this._dispatchQueue()}release(e=1){if(e<=0)throw new Error(`invalid weight ${e}: must be positive`);this._value+=e,this._dispatchQueue()}cancel(){this._queue.forEach(e=>e.reject(this._cancelError)),this._queue=[]}_dispatchQueue(){for(this._drainUnlockWaiters();this._queue.length>0&&this._queue[0].weight<=this._value;)this._dispatchItem(this._queue.shift()),this._drainUnlockWaiters()}_dispatchItem(e){const t=this._value;this._value-=e.weight,e.resolve([t,this._newReleaser(e.weight)])}_newReleaser(e){let t=!1;return()=>{t||(t=!0,this.release(e))}}_drainUnlockWaiters(){if(this._queue.length===0)for(let e=this._value;e>0;e--){const t=this._weightedWaiters[e-1];t&&(t.forEach(r=>r.resolve()),this._weightedWaiters[e-1]=[])}else{const e=this._queue[0].priority;for(let t=this._value;t>0;t--){const r=this._weightedWaiters[t-1];if(!r)continue;const a=r.findIndex(c=>c.priority<=e);(a===-1?r:r.splice(0,a)).forEach((c=>c.resolve()))}}}_couldLockImmediately(e,t){return(this._queue.length===0||this._queue[0].priority<t)&&e<=this._value}}function pe(n,e){const t=Y(n,r=>e.priority<=r.priority);n.splice(t+1,0,e)}function Y(n,e){for(let t=n.length-1;t>=0;t--)if(e(n[t]))return t;return-1}var ye=function(n,e,t,r){function a(c){return c instanceof t?c:new t(function(d){d(c)})}return new(t||(t=Promise))(function(c,d){function y(p){try{I(r.next(p))}catch(v){d(v)}}function f(p){try{I(r.throw(p))}catch(v){d(v)}}function I(p){p.done?c(p.value):a(p.value).then(y,f)}I((r=r.apply(n,e||[])).next())})};class fe{constructor(e){this._semaphore=new me(1,e)}acquire(){return ye(this,arguments,void 0,function*(e=0){const[,t]=yield this._semaphore.acquire(1,e);return t})}runExclusive(e,t=0){return this._semaphore.runExclusive(()=>e(),1,t)}isLocked(){return this._semaphore.isLocked()}waitForUnlock(e=0){return this._semaphore.waitForUnlock(1,e)}release(){this._semaphore.isLocked()&&this._semaphore.release()}cancel(){return this._semaphore.cancel()}}const Q=he();function he(){const n={local:q("local"),session:q("session"),sync:q("sync"),managed:q("managed")},e=i=>{const s=n[i];if(s==null){const o=Object.keys(n).join(", ");throw Error(`Invalid area "${i}". Options: ${o}`)}return s},t=i=>{const s=i.indexOf(":"),o=i.substring(0,s),l=i.substring(s+1);if(l==null)throw Error(`Storage key should be in the form of "area:key", but received "${i}"`);return{driverArea:o,driverKey:l,driver:e(o)}},r=i=>i+"$",a=(i,s)=>{const o={...i};return Object.entries(s).forEach(([l,u])=>{u==null?delete o[l]:o[l]=u}),o},c=(i,s)=>i??s??null,d=i=>typeof i=="object"&&!Array.isArray(i)?i:{},y=async(i,s,o)=>{const l=await i.getItem(s);return c(l,o?.fallback??o?.defaultValue)},f=async(i,s)=>{const o=r(s),l=await i.getItem(o);return d(l)},I=async(i,s,o)=>{await i.setItem(s,o??null)},p=async(i,s,o)=>{const l=r(s),u=d(await i.getItem(l));await i.setItem(l,a(u,o))},v=async(i,s,o)=>{if(await i.removeItem(s),o?.removeMeta){const l=r(s);await i.removeItem(l)}},P=async(i,s,o)=>{const l=r(s);if(o==null)await i.removeItem(l);else{const u=d(await i.getItem(l));[o].flat().forEach(m=>delete u[m]),await i.setItem(l,u)}},L=(i,s,o)=>i.watch(s,o);return{getItem:async(i,s)=>{const{driver:o,driverKey:l}=t(i);return await y(o,l,s)},getItems:async i=>{const s=new Map,o=new Map,l=[];i.forEach(m=>{let h,w;typeof m=="string"?h=m:"getValue"in m?(h=m.key,w={fallback:m.fallback}):(h=m.key,w=m.options),l.push(h);const{driverArea:E,driverKey:g}=t(h),C=s.get(E)??[];s.set(E,C.concat(g)),o.set(h,w)});const u=new Map;return await Promise.all(Array.from(s.entries()).map(async([m,h])=>{(await n[m].getItems(h)).forEach(E=>{const g=`${m}:${E.key}`,C=o.get(g),U=c(E.value,C?.fallback??C?.defaultValue);u.set(g,U)})})),l.map(m=>({key:m,value:u.get(m)}))},getMeta:async i=>{const{driver:s,driverKey:o}=t(i);return await f(s,o)},getMetas:async i=>{const s=i.map(u=>{const m=typeof u=="string"?u:u.key,{driverArea:h,driverKey:w}=t(m);return{key:m,driverArea:h,driverKey:w,driverMetaKey:r(w)}}),o=s.reduce((u,m)=>(u[m.driverArea]??=[],u[m.driverArea].push(m),u),{}),l={};return await Promise.all(Object.entries(o).map(async([u,m])=>{const h=await $.storage[u].get(m.map(w=>w.driverMetaKey));m.forEach(w=>{l[w.key]=h[w.driverMetaKey]??{}})})),s.map(u=>({key:u.key,meta:l[u.key]}))},setItem:async(i,s)=>{const{driver:o,driverKey:l}=t(i);await I(o,l,s)},setItems:async i=>{const s={};i.forEach(o=>{const{driverArea:l,driverKey:u}=t("key"in o?o.key:o.item.key);s[l]??=[],s[l].push({key:u,value:o.value})}),await Promise.all(Object.entries(s).map(async([o,l])=>{await e(o).setItems(l)}))},setMeta:async(i,s)=>{const{driver:o,driverKey:l}=t(i);await p(o,l,s)},setMetas:async i=>{const s={};i.forEach(o=>{const{driverArea:l,driverKey:u}=t("key"in o?o.key:o.item.key);s[l]??=[],s[l].push({key:u,properties:o.meta})}),await Promise.all(Object.entries(s).map(async([o,l])=>{const u=e(o),m=l.map(({key:g})=>r(g)),h=await u.getItems(m),w=Object.fromEntries(h.map(({key:g,value:C})=>[g,d(C)])),E=l.map(({key:g,properties:C})=>{const U=r(g);return{key:U,value:a(w[U]??{},C)}});await u.setItems(E)}))},removeItem:async(i,s)=>{const{driver:o,driverKey:l}=t(i);await v(o,l,s)},removeItems:async i=>{const s={};i.forEach(o=>{let l,u;typeof o=="string"?l=o:"getValue"in o?l=o.key:"item"in o?(l=o.item.key,u=o.options):(l=o.key,u=o.options);const{driverArea:m,driverKey:h}=t(l);s[m]??=[],s[m].push(h),u?.removeMeta&&s[m].push(r(h))}),await Promise.all(Object.entries(s).map(async([o,l])=>{await e(o).removeItems(l)}))},clear:async i=>{await e(i).clear()},removeMeta:async(i,s)=>{const{driver:o,driverKey:l}=t(i);await P(o,l,s)},snapshot:async(i,s)=>{const l=await e(i).snapshot();return s?.excludeKeys?.forEach(u=>{delete l[u],delete l[r(u)]}),l},restoreSnapshot:async(i,s)=>{await e(i).restoreSnapshot(s)},watch:(i,s)=>{const{driver:o,driverKey:l}=t(i);return L(o,l,s)},unwatch(){Object.values(n).forEach(i=>{i.unwatch()})},defineItem:(i,s)=>{const{driver:o,driverKey:l}=t(i),{version:u=1,migrations:m={},onMigrationComplete:h,debug:w=!1}=s??{};if(u<1)throw Error("Storage item version cannot be less than 1. Initial versions should be set to 1, not 0.");const E=async()=>{const k=r(l),[{value:_},{value:S}]=await o.getItems([l,k]);if(_==null)return;const b=S?.v??1;if(b>u)throw Error(`Version downgrade detected (v${b} -> v${u}) for "${i}"`);if(b===u)return;w===!0&&console.debug(`[@wxt-dev/storage] Running storage migration for ${i}: v${b} -> v${u}`);const Te=Array.from({length:u-b},(x,j)=>b+j+1);let T=_;for(const x of Te)try{T=await m?.[x]?.(T)??T,w===!0&&console.debug(`[@wxt-dev/storage] Storage migration processed for version: v${x}`)}catch(j){throw new we(i,x,{cause:j})}await o.setItems([{key:l,value:T},{key:k,value:{...S,v:u}}]),w===!0&&console.debug(`[@wxt-dev/storage] Storage migration completed for ${i} v${u}`,{migratedValue:T}),h?.(T,u)},g=s?.migrations==null?Promise.resolve():E().catch(k=>{console.error(`[@wxt-dev/storage] Migration failed for ${i}`,k)}),C=new fe,U=()=>s?.fallback??s?.defaultValue??null,X=()=>C.runExclusive(async()=>{const k=await o.getItem(l);if(k!=null||s?.init==null)return k;const _=await s.init();return await o.setItem(l,_),_});return g.then(X),{key:i,get defaultValue(){return U()},get fallback(){return U()},getValue:async()=>(await g,s?.init?await X():await y(o,l,s)),getMeta:async()=>(await g,await f(o,l)),setValue:async k=>(await g,await I(o,l,k)),setMeta:async k=>(await g,await p(o,l,k)),removeValue:async k=>(await g,await v(o,l,k)),removeMeta:async k=>(await g,await P(o,l,k)),watch:k=>L(o,l,(_,S)=>k(_??U(),S??U())),migrate:E}}}}function q(n){const e=()=>{if($.runtime==null)throw Error(["'wxt/storage' must be loaded in a web extension environment",`
 - If thrown during a build, see https://github.com/wxt-dev/wxt/issues/371`,` - If thrown during tests, mock 'wxt/browser' correctly. See https://wxt.dev/guide/go-further/testing.html
`].join(`
`));if($.storage==null)throw Error("You must add the 'storage' permission to your manifest to use 'wxt/storage'");const r=$.storage[n];if(r==null)throw Error(`"browser.storage.${n}" is undefined`);return r},t=new Set;return{getItem:async r=>(await e().get(r))[r],getItems:async r=>{const a=await e().get(r);return r.map(c=>({key:c,value:a[c]??null}))},setItem:async(r,a)=>{a==null?await e().remove(r):await e().set({[r]:a})},setItems:async r=>{const a=r.reduce((c,{key:d,value:y})=>(c[d]=y,c),{});await e().set(a)},removeItem:async r=>{await e().remove(r)},removeItems:async r=>{await e().remove(r)},clear:async()=>{await e().clear()},snapshot:async()=>await e().get(),restoreSnapshot:async r=>{await e().set(r)},watch(r,a){const c=d=>{const y=d[r];y!=null&&(F(y.newValue,y.oldValue)||a(y.newValue??null,y.oldValue??null))};return e().onChanged.addListener(c),t.add(c),()=>{e().onChanged.removeListener(c),t.delete(c)}},unwatch(){t.forEach(r=>{e().onChanged.removeListener(r)}),t.clear()}}}class we extends Error{constructor(e,t,r){super(`v${t} migration failed for "${e}"`,r),this.key=e,this.version=t}}const H=Q.defineItem("sync:twentyUrl",{fallback:""}),O=Q.defineItem("local:lastCaptured",{fallback:[]});async function V(){return{twentyUrl:await H.getValue()}}async function ge(n){n.twentyUrl!==void 0&&await H.setValue(n.twentyUrl)}async function J(n){const e=await O.getValue(),t={...n,capturedAt:Date.now()},r=e.filter(c=>c.linkedinUrl!==n.linkedinUrl),a=[t,...r].slice(0,10);await O.setValue(a)}async function ke(){return O.getValue()}let N=null,D=null;async function R(){const n=await V();if(!n.twentyUrl)throw new Error("Twenty URL not configured");(D!==n.twentyUrl||!N)&&(N=new ce(n.twentyUrl),D=n.twentyUrl);const e=await K(n.twentyUrl);if(!e)throw new Error("No authentication token found. Please log in to Twenty CRM.");return N.setToken(e),N}async function K(n){try{const e=await A.cookies.get({url:n,name:"tokenPair"});if(console.log("Cookie lookup for",n,":",e?"found":"not found"),e?.value){const a=decodeURIComponent(e.value);return G(a)}const t=n.includes("://www.")?n.replace("://www.","://"):n.replace("://","://www."),r=await A.cookies.get({url:t,name:"tokenPair"});if(console.log("Alt cookie lookup for",t,":",r?"found":"not found"),r?.value){const a=decodeURIComponent(r.value);return G(a)}}catch(e){console.error("Error getting auth token:",e)}console.log("No cookie found, using API key");return"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA1YzVlYjFkLWUwNDctNDI3Ni04N2UzLThmZmZkMDQxNDVmYyJ9.eyJzdWIiOiI2YjI3ZDM0Yy04ODlhLTQzNzYtOTIzZi1mOWM5OWViYmIzM2UiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNmIyN2QzNGMtODg5YS00Mzc2LTkyM2YtZjljOTllYmJiMzNlIiwiaWF0IjoxNzc5Njc3MjUwLCJleHAiOjQ5MzMyNzcyNDgsImp0aSI6IjZmMWM3NDAwLWY2MDItNGE2NS1iYjc1LWFiN2EwNzdlNTczOSJ9.2WY8yhYa_l2st08suvpQ-vOT6lQSuEH7V-bL8taa_ELdyO_6IhZiZ2NTWlZZUAvD_qKfxeEt_cWAuZLXYzG28w"}async function ve(n,e,t,r){try{const a=await n.findPersonByLinkedInUrl(e);if(a)return console.log("Found person by LinkedIn URL:",a.id),{exists:!0,record:{id:a.id,type:"person"},matchedBy:"linkedin"}}catch(a){console.error("Error searching by LinkedIn URL:",a)}if(t&&r)try{const a=await n.findPersonByName(t,r);if(a)return console.log("Found person by name:",a.id,a.name),{exists:!0,record:{id:a.id,type:"person"},matchedBy:"name"}}catch(a){console.error("Error searching by name:",a)}return{exists:!1}}async function Ie(n,e,t){try{const r=await n.findCompanyByLinkedInUrl(e);if(r)return console.log("Found company by LinkedIn URL:",r.id),{exists:!0,record:{id:r.id,type:"company"},matchedBy:"linkedin"}}catch(r){console.error("Error searching company by LinkedIn URL:",r)}if(t)try{const r=await n.findCompanyByName(t);if(r)return console.log("Found company by name:",r.id,r.name),{exists:!0,record:{id:r.id,type:"company"},matchedBy:"name"}}catch(r){console.error("Error searching company by name:",r)}return{exists:!1}}async function Ee(n,e,t){const r=await R();if(e==="person"){const a=t;return ve(r,n,a?.firstName,a?.lastName)}else return Ie(r,n,t?.name)}async function Ce(n){const e=await R();if(n.type==="person"){const t=await e.createPerson(n);return await J({linkedinUrl:n.linkedinUrl,name:`${n.firstName} ${n.lastName}`,type:"person",twentyId:t.id}),{id:t.id}}else{const t=await e.createCompany(n);return await J({linkedinUrl:n.linkedinUrl,name:n.name,type:"company",twentyId:t.id}),{id:t.id}}}async function Ue(){try{return await(await R()).testConnection()}catch(n){return console.error("Test connection failed:",n),!1}}async function Le(n){console.log("Received message:",n.type);try{switch(n.type){case"GET_AUTH_TOKEN":{const e=await V();if(!e.twentyUrl)return{success:!1,error:"Twenty URL not configured"};const t=await K(e.twentyUrl);return{success:t!==null,data:{hasToken:t!==null}}}case"CHECK_DUPLICATE":{const{linkedinUrl:e,pageType:t,scrapedData:r}=n.payload;return{success:!0,data:await Ee(e,t,r)}}case"CREATE_RECORD":{const e=n.payload;return{success:!0,data:await Ce(e)}}case"GET_SETTINGS":{const e=await V(),t=e.twentyUrl?(await K(e.twentyUrl))!==null:!1;return{success:!0,data:{...e,hasToken:t}}}case"SAVE_SETTINGS":{const e=n.payload;return console.log("Saving settings:",e),await ge(e),e.twentyUrl&&(N=null,D=null),console.log("Settings saved successfully"),{success:!0}}case"TEST_CONNECTION":return{success:!0,data:{connected:await Ue()}};case"GET_RECENT_CAPTURES":return{success:!0,data:await ke()};case"SEARCH_RECORDS":{const{query:e,type:t}=n.payload;return{success:!0,data:await(await R()).searchRecords(e,t)}}case"UPDATE_RECORD":{const{id:e,type:t,data:r}=n.payload;return await(await R()).updateRecordWithLinkedInData(e,t,r),{success:!0,data:{id:e}}}default:return{success:!1,error:"Unknown message type"}}}catch(e){return console.error("Background error:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}const _e=Z(()=>{A.runtime.onMessage.addListener((n,e,t)=>(Le(n).then(t),!0)),console.log("Twenty CRM Extension background loaded")});function $e(){}function M(n,...e){}const be={debug:(...n)=>M(console.debug,...n),log:(...n)=>M(console.log,...n),warn:(...n)=>M(console.warn,...n),error:(...n)=>M(console.error,...n)};let B;try{B=_e.main(),B instanceof Promise&&console.warn("The background's main() function return a promise, but it must be synchronous")}catch(n){throw be.error("The background crashed on startup!"),n}return B})();
