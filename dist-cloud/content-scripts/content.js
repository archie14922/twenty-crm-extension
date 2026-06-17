var content=(function(){"use strict";function le(t){return t}const x=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;function M(t){return t.includes("linkedin.com/in/")?"person":t.includes("linkedin.com/company/")?"company":null}function O(){try{const t=window.location.href.split("?")[0],e=document.querySelector("h1.text-heading-xlarge")||document.querySelector("h1.inline.t-24")||document.querySelector("h1.t-24.v-align-middle")||document.querySelector(".pv-top-card h1")||document.querySelector('h1[class*="break-words"]')||document.querySelector('a[href*="/in/"] h2')||document.querySelector('a[href*="/in/"] h1')||Array.from(document.querySelectorAll("h2")).find(function(el){return el.closest('a[href*="linkedin.com/in/"]')});if(!e)return console.warn("Could not find name element - tried multiple selectors"),null;const n=e.textContent?.trim()||"";console.log("Scraped name:",n);const o=W(n),l=(document.querySelector("div[data-generated-suggestion-target]")||document.querySelector("div.text-body-medium.break-words"))?.textContent?.trim()||"";console.log("Scraped headline:",l);const u=Y(),p=u?.name||j(l);console.log("Scraped company data:",u),console.log("Current company:",p);const w=V(),g=(document.querySelector("span.text-body-small.inline.t-black--light.break-words")||document.querySelector(".text-body-small.inline.t-black--light.break-words")||document.querySelector(".pv-top-card--list-bullet li:last-child"))?.textContent?.trim()||"";console.log("Scraped location:",g);const f={type:"person",linkedinUrl:t,firstName:o.firstName,lastName:o.lastName,headline:l,currentCompany:p,currentCompanyLinkedInUrl:u?.linkedinUrl,profileImageUrl:w||void 0,location:g||void 0};return console.log("Scraped profile data:",{fullName:n,firstName:f.firstName,lastName:f.lastName,headline:f.headline}),f}catch(t){return console.error("Error scraping person profile:",t),null}}function V(){const t=[".pv-top-card-profile-picture__container img",".pv-top-card-profile-picture__image","img.profile-photo-edit__preview",".pv-top-card__photo img",'button[aria-label*="image"] img',".EntityPhoto-circle-9 img","img[title]"];for(const e of t){const n=document.querySelector(e);if(n?.src&&!n.src.includes("ghost")&&n.src.includes("profile"))return console.log("Scraped profile image:",n.src),n.src}return""}function Y(){try{const t=document.querySelector('button[aria-label*="Entreprise actuelle"]')||document.querySelector('button[aria-label*="Current company"]')||document.querySelector('button[aria-label*="Empresa actual"]')||document.querySelector('button[aria-label*="Aktuelles Unternehmen"]');if(t){const s=(t.getAttribute("aria-label")||"").match(/:\s*([^.]+)/),l=s?s[1].trim():"",p=t.querySelector("img")?.src||void 0;let w;if(l)return console.log("Found company from button:",{name:l,logoUrl:p}),{name:l,linkedinUrl:w,logoUrl:p}}const e=document.querySelector('.pv-text-details__right-panel-item-text a[href*="/company/"]')||document.querySelector('a[data-field="experience_company_logo"]')||document.querySelector('.experience-item a[href*="/company/"]');if(e){const s=(e.getAttribute("href")||"").match(/\/company\/([^/?]+)/),l=s?`https://www.linkedin.com/company/${s[1]}/`:void 0,u=e.textContent?.trim()||e.closest(".pv-text-details__right-panel-item-text")?.textContent?.trim()||"";if(u)return{name:u,linkedinUrl:l}}const n=document.querySelector(".pv-text-details__right-panel-item-text")||document.querySelector('[aria-label*="Current company"]');return n?{name:n.textContent?.trim()||""}:null}catch(t){return console.error("Error scraping company from profile:",t),null}}function G(){try{const t=window.location.href.split("?")[0],e=document.querySelector("h1.org-top-card-summary__title")||document.querySelector(".org-top-card-summary-info-list__info-item")||document.querySelector("h1[title]");if(!e)return console.warn("Could not find company name element"),null;const n=e.textContent?.trim()||"",s=document.querySelector(".org-top-card-summary-info-list__info-item")?.textContent?.trim()||"",l=document.querySelectorAll(".org-top-card-summary-info-list__info-item");let u="";l.forEach(S=>{const T=S.textContent||"";(T.includes("employees")||T.includes("employee"))&&(u=T.trim())});const w=(document.querySelector('a[data-control-name="top_card_link_website"]')||document.querySelector(".link-without-visited-state.org-top-card-primary-actions__action"))?.getAttribute("href")||"",g=document.querySelector(".org-top-card-primary-content__logo")?.getAttribute("src")||"",P=document.querySelector(".org-top-card-summary__tagline")?.textContent?.trim()||"";return{type:"company",linkedinUrl:t,name:n,website:w||void 0,industry:s||void 0,employeeCount:u||void 0,logoUrl:g||void 0,description:P||void 0}}catch(t){return console.error("Error scraping company page:",t),null}}function N(){const t=M(window.location.href);return t==="person"?O():t==="company"?G():null}function W(t){const e=t.trim().split(/\s+/);if(e.length===0)return{firstName:"",lastName:""};if(e.length===1)return{firstName:e[0],lastName:""};const n=e[0],o=e.slice(1).join(" ");return{firstName:n,lastName:o}}function j(t){const e=[/\bat\s+(.+?)(?:\s*\||$)/i,/\bchez\s+(.+?)(?:\s*\||$)/i,/\bbei\s+(.+?)(?:\s*\||$)/i,/\b@\s*(.+?)(?:\s*\||$)/i,/\bfor\s+(.+?)(?:\s*\||$)/i,/\bà\s+(.+?)(?:\s*\||$)/i,/\ben\s+(.+?)(?:\s*\||$)/i];for(const n of e){const o=t.match(n);if(o){const s=o[1].trim();return console.log("Extracted company from headline:",s,"using pattern:",n),s}}return""}const K=`
  .twenty-capture-container {
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }
  
  .twenty-btn-group {
    display: flex;
    align-items: stretch;
    border-radius: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .twenty-btn-group .twenty-capture-btn {
    border-radius: 24px;
  }
  
  .twenty-btn-group.has-menu .twenty-capture-btn {
    border-radius: 24px 0 0 24px;
  }
  
  .twenty-capture-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .twenty-btn-group:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  .twenty-capture-btn--loading {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    pointer-events: none;
  }
  
  .twenty-capture-btn--ready {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
  }
  
  .twenty-capture-btn--exists {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }
  
  .twenty-capture-btn--saving {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    pointer-events: none;
  }
  
  .twenty-capture-btn--saved {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }
  
  .twenty-capture-btn--error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  }
  
  .twenty-capture-btn--idle {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
  }
  
  .twenty-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 12px;
    border: none;
    border-left: 1px solid rgba(255,255,255,0.25);
    background: linear-gradient(135deg, #5558e6 0%, #7c5ce0 100%);
    color: white;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    transition: filter 0.2s;
    border-radius: 0 24px 24px 0;
  }
  
  .twenty-menu-btn--exists {
    background: linear-gradient(135deg, #0d9668 0%, #047857 100%);
  }
  
  .twenty-menu-btn:hover {
    filter: brightness(0.9);
  }
  
  .twenty-capture-icon {
    width: 18px;
    height: 18px;
  }
  
  .twenty-capture-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: twenty-spin 0.8s linear infinite;
  }
  
  @keyframes twenty-spin {
    to { transform: rotate(360deg); }
  }
  
  .twenty-capture-toast {
    position: fixed;
    bottom: 80px;
    left: 24px;
    background: #1f2937;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 100000;
    animation: twenty-toast-in 0.3s ease;
  }
  
  @keyframes twenty-toast-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Menu Dropdown */
  .twenty-menu-dropdown {
    position: absolute;
    bottom: 100%;
    left: 0;
    margin-bottom: 8px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    min-width: 180px;
    overflow: hidden;
    animation: twenty-panel-in 0.15s ease;
  }
  
  .twenty-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-size: 13px;
    color: #374151;
    cursor: pointer;
    transition: background 0.15s;
  }
  
  .twenty-menu-item:hover {
    background: #f3f4f6;
  }
  
  .twenty-menu-item svg {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }

  /* Search Panel */
  .twenty-search-panel {
    position: fixed;
    bottom: 80px;
    left: 24px;
    width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 100001;
    overflow: hidden;
    animation: twenty-panel-in 0.2s ease;
  }
  
  @keyframes twenty-panel-in {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .twenty-search-header {
    padding: 12px 16px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .twenty-search-title {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }
  
  .twenty-search-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 4px;
    display: flex;
  }
  
  .twenty-search-close:hover {
    color: #6b7280;
  }
  
  .twenty-search-input-wrap {
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .twenty-search-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
  }
  
  .twenty-search-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  .twenty-search-results {
    max-height: 240px;
    overflow-y: auto;
  }
  
  .twenty-search-result {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.15s;
  }
  
  .twenty-search-result:hover {
    background: #f9fafb;
  }
  
  .twenty-search-result:last-child {
    border-bottom: none;
  }
  
  .twenty-search-result-name {
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
  }
  
  .twenty-search-result-sub {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  }
  
  .twenty-search-empty {
    padding: 24px 16px;
    text-align: center;
    color: #9ca3af;
    font-size: 13px;
  }
  
  .twenty-search-loading {
    padding: 24px 16px;
    text-align: center;
    color: #6b7280;
    font-size: 13px;
  }
`,y={add:'<svg class="twenty-capture-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',check:'<svg class="twenty-capture-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',link:'<svg class="twenty-capture-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>',error:'<svg class="twenty-capture-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',close:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',menu:"•••",refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>',search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>'},Q={matches:["*://*.linkedin.com/in/*","*://*.linkedin.com/company/*"],runAt:"document_idle",main(t){console.log("Twenty CRM content script loaded on:",window.location.href);let e={status:"idle",data:void 0,existingRecord:void 0,error:void 0},n=null,o=null,s=!1,l=!1,u="",p=[],w=!1,C=null,g=null,f=null;function P(){f=document.createElement("style"),f.textContent=K,document.head.appendChild(f),g=document.createElement("div"),g.id="twenty-capture-root",document.body.appendChild(g),h(),setTimeout(S,1500)}async function S(){const r=M(window.location.href);if(console.log("Checking page type:",r,"URL:",window.location.href),!r){console.log("Not a profile or company page");return}c({status:"loading"});const i=N();console.log("Scraped data for duplicate check:",i);try{const a=await x.runtime.sendMessage({type:"CHECK_DUPLICATE",payload:{linkedinUrl:window.location.href.split("?")[0],pageType:r,scrapedData:i}});if(console.log("Check duplicate response:",a),!a.success){a.error?.includes("not configured")||a.error?.includes("No authentication")?c({status:"idle",error:"Configure Twenty URL in extension popup"}):c({status:"error",error:a.error});return}a.data?.exists&&a.data.record?(console.log("Found existing record, matched by:",a.data.matchedBy),c({status:"exists",existingRecord:{id:a.data.record.id,type:a.data.record.type}})):(console.log("No duplicate found, ready to add"),c({status:"ready",data:i||void 0}))}catch(a){console.error("Error checking existing:",a),c({status:"error",error:"Failed to check CRM"})}}async function T(){if(e.status!=="ready")return;const r=e.data||N();if(!r){b("Could not extract profile data");return}c({status:"saving",data:r});try{const i=await x.runtime.sendMessage({type:"CREATE_RECORD",payload:r});if(console.log("Create record response:",i),!i.success){c({status:"error",error:i.error,data:r}),b(i.error||"Failed to save");return}c({status:"saved",existingRecord:{id:i.data.id,type:r.type},data:r}),b("Added to Twenty CRM!"),setTimeout(()=>{e.status==="saved"&&c({...e,status:"exists"})},2e3)}catch(i){console.error("Error creating record:",i),c({status:"error",error:"Failed to save",data:r})}}async function ee(){if(e.existingRecord)try{const r=await x.runtime.sendMessage({type:"GET_SETTINGS"});if(r.success&&r.data?.twentyUrl){const{id:i,type:a}=e.existingRecord,E=`https://app.twenty.com/object/${a}/${i}`;window.open(E,"_blank")}}catch(r){console.error("Error opening in Twenty:",r)}}async function te(r){if(!r.trim()){p=[],h();return}w=!0,h();try{const i=M(window.location.href),a=await x.runtime.sendMessage({type:"SEARCH_RECORDS",payload:{query:r,type:i}});a.success&&a.data?p=a.data:p=[]}catch(i){console.error("Error searching:",i),p=[]}w=!1,h()}async function ne(r){const i=e.data||N();if(!i){b("Could not extract profile data");return}l=!1,c({status:"saving",data:i});try{const a=await x.runtime.sendMessage({type:"UPDATE_RECORD",payload:{id:r.id,type:r.type,data:i}});if(!a.success){c({status:"error",error:a.error,data:i}),b(a.error||"Failed to update");return}c({status:"saved",existingRecord:{id:r.id,type:r.type},data:i}),b(`Linked & updated ${r.name}!`),setTimeout(()=>{e.status==="saved"&&c({...e,status:"exists"})},2e3)}catch(a){console.error("Error updating record:",a),c({status:"error",error:"Failed to update",data:i})}}function c(r){e={...e,...r},h()}function b(r){n=r,h(),o&&clearTimeout(o),o=setTimeout(()=>{n=null,h()},3e3)}function re(){switch(e.status){case"loading":return"Checking...";case"ready":return"Add to Twenty";case"exists":return"Open in Twenty";case"saving":return"Saving...";case"saved":return"Saved!";case"error":return e.error||"Error";default:return"Twenty CRM"}}function oe(){switch(e.status){case"loading":case"saving":return'<div class="twenty-capture-spinner"></div>';case"ready":return y.add;case"exists":return y.link;case"saved":return y.check;case"error":return y.error;default:return y.add}}function ae(){console.log("Button clicked, current state:",e.status),e.status==="ready"?T():e.status==="exists"||e.status==="saved"?ee():(e.status==="error"||e.status==="idle")&&S()}function ie(r){r.stopPropagation(),s=!s,l=!1,h()}function B(r){s=!1,r==="update"?se():r==="link"&&(l=!0,u="",p=[],h())}async function se(){if(!e.existingRecord)return;const r=N();if(!r){b("Could not extract profile data");return}const i=e.status;c({status:"saving",data:r});try{const a=await x.runtime.sendMessage({type:"UPDATE_RECORD",payload:{id:e.existingRecord.id,type:e.existingRecord.type,data:r}});if(!a.success){c({status:i,error:a.error,data:r}),b(a.error||"Failed to update");return}c({status:"saved",existingRecord:e.existingRecord,data:r}),b("Updated from LinkedIn!"),setTimeout(()=>{e.status==="saved"&&c({...e,status:"exists"})},2e3)}catch(a){console.error("Error updating record:",a),c({status:i,error:"Failed to update",data:r})}}function ce(r){u=r.target.value,C&&clearTimeout(C),C=setTimeout(()=>{te(u)},300)}function h(){if(!g)return;const r=document.createElement("div");r.className="twenty-capture-container";const i=e.status==="ready"||e.status==="exists",a=document.createElement("div");a.className=`twenty-btn-group${i?" has-menu":""}`;const E=document.createElement("button");if(E.className=`twenty-capture-btn twenty-capture-btn--${e.status}`,E.innerHTML=`${oe()}<span>${re()}</span>`,E.addEventListener("click",ae),a.appendChild(E),i){const d=document.createElement("button");d.className=`twenty-menu-btn twenty-menu-btn--${e.status}`,d.textContent=y.menu,d.title="More options",d.addEventListener("click",ie),a.appendChild(d)}if(r.appendChild(a),s){const d=document.createElement("div");if(d.className="twenty-menu-dropdown",e.status==="exists"){const m=document.createElement("button");m.className="twenty-menu-item",m.innerHTML=`${y.refresh}<span>Update from LinkedIn</span>`,m.addEventListener("click",()=>B("update")),d.appendChild(m)}if(e.status==="ready"){const m=document.createElement("button");m.className="twenty-menu-item",m.innerHTML=`${y.search}<span>Link to existing contact</span>`,m.addEventListener("click",()=>B("link")),d.appendChild(m)}r.appendChild(d)}if(l){const d=document.createElement("div");d.className="twenty-search-panel";const m=document.createElement("div");m.className="twenty-search-header",m.innerHTML=`
          <span class="twenty-search-title">Link to existing contact</span>
        `;const q=document.createElement("button");q.className="twenty-search-close",q.innerHTML=y.close,q.addEventListener("click",()=>{l=!1,h()}),m.appendChild(q),d.appendChild(m);const D=document.createElement("div");D.className="twenty-search-input-wrap";const v=document.createElement("input");v.className="twenty-search-input",v.type="text",v.placeholder="Search by name...",v.value=u,v.addEventListener("input",ce),D.appendChild(v),d.appendChild(D);const k=document.createElement("div");k.className="twenty-search-results",w?k.innerHTML='<div class="twenty-search-loading">Searching...</div>':u&&p.length===0?k.innerHTML='<div class="twenty-search-empty">No contacts found</div>':p.length>0?p.forEach(U=>{const $=document.createElement("div");$.className="twenty-search-result",$.innerHTML=`
              <div class="twenty-search-result-name">${U.name}</div>
              ${U.subtitle?`<div class="twenty-search-result-sub">${U.subtitle}</div>`:""}
            `,$.addEventListener("click",()=>ne(U)),k.appendChild($)}):k.innerHTML='<div class="twenty-search-empty">Type to search...</div>',d.appendChild(k),r.appendChild(d),setTimeout(()=>v.focus(),50)}if(n){const d=document.createElement("div");d.className="twenty-capture-toast",d.textContent=n,r.appendChild(d)}g.innerHTML="",g.appendChild(r)}let R=window.location.href;const z=new MutationObserver(()=>{window.location.href!==R&&(R=window.location.href,console.log("URL changed to:",R),M(R)&&(e={status:"idle",data:void 0,existingRecord:void 0,error:void 0},s=!1,l=!1,h(),setTimeout(S,1500)))});function H(r){r.target.closest(".twenty-capture-container")||s&&(s=!1,h())}P(),document.addEventListener("click",H),z.observe(document.body,{childList:!0,subtree:!0}),t.onInvalidated(()=>{console.log("Content script invalidated, cleaning up"),z.disconnect(),document.removeEventListener("click",H),g?.remove(),f?.remove()})}};function _(t,...e){}const J={debug:(...t)=>_(console.debug,...t),log:(...t)=>_(console.log,...t),warn:(...t)=>_(console.warn,...t),error:(...t)=>_(console.error,...t)};class A extends Event{constructor(e,n){super(A.EVENT_NAME,{}),this.newUrl=e,this.oldUrl=n}static EVENT_NAME=F("wxt:locationchange")}function F(t){return`${x?.runtime?.id}:content:${t}`}function X(t){let e,n;return{run(){e==null&&(n=new URL(location.href),e=t.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new A(o,n)),n=o)},1e3))}}}class L{constructor(e,n){this.contentScriptName=e,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=F("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=X(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(e){return this.abortController.abort(e)}get isInvalid(){return x.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(e){return this.signal.addEventListener("abort",e),()=>this.signal.removeEventListener("abort",e)}block(){return new Promise(()=>{})}setInterval(e,n){const o=setInterval(()=>{this.isValid&&e()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(e,n){const o=setTimeout(()=>{this.isValid&&e()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(e){const n=requestAnimationFrame((...o)=>{this.isValid&&e(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(e,n){const o=requestIdleCallback((...s)=>{this.signal.aborted||e(...s)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(e,n,o,s){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),e.addEventListener?.(n.startsWith("wxt:")?F(n):n,o,{...s,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),J.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:L.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(e){const n=e.data?.type===L.SCRIPT_STARTED_MESSAGE_TYPE,o=e.data?.contentScriptName===this.contentScriptName,s=!this.receivedMessageIds.has(e.data?.messageId);return n&&o&&s}listenForNewerScripts(e){let n=!0;const o=s=>{if(this.verifyScriptStartedEvent(s)){this.receivedMessageIds.add(s.data.messageId);const l=n;if(n=!1,l&&e?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function ue(){}function I(t,...e){}const Z={debug:(...t)=>I(console.debug,...t),log:(...t)=>I(console.log,...t),warn:(...t)=>I(console.warn,...t),error:(...t)=>I(console.error,...t)};return(async()=>{try{const{main:t,...e}=Q,n=new L("content",e);return await t(n)}catch(t){throw Z.error('The content script "content" crashed on startup!',t),t}})()})();
content;