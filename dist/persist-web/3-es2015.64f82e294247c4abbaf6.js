(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"5Bek":function(e,n,t){"use strict";t.d(n,"b",function(){return d}),t.d(n,"a",function(){return r}),t.d(n,"c",function(){return c});var l=t("KCVW"),i=t("8Y7J"),s=t("XNiG"),a=t("quSY");let o=0;class r{constructor(){this._stateChanges=new s.a,this._openCloseAllActions=new s.a,this.id=`cdk-accordion-${o++}`,this._multi=!1}get multi(){return this._multi}set multi(e){this._multi=Object(l.c)(e)}openAll(){this._openCloseAll(!0)}closeAll(){this._openCloseAll(!1)}ngOnChanges(e){this._stateChanges.next(e)}ngOnDestroy(){this._stateChanges.complete()}_openCloseAll(e){this.multi&&this._openCloseAllActions.next(e)}}let u=0;class d{constructor(e,n,t){this.accordion=e,this._changeDetectorRef=n,this._expansionDispatcher=t,this._openCloseAllSubscription=a.a.EMPTY,this.closed=new i.m,this.opened=new i.m,this.destroyed=new i.m,this.expandedChange=new i.m,this.id=`cdk-accordion-child-${u++}`,this._expanded=!1,this._disabled=!1,this._removeUniqueSelectionListener=()=>{},this._removeUniqueSelectionListener=t.listen((e,n)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===n&&this.id!==e&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}get expanded(){return this._expanded}set expanded(e){e=Object(l.c)(e),this._expanded!==e&&(this._expanded=e,this.expandedChange.emit(e),e?(this.opened.emit(),this._expansionDispatcher.notify(this.id,this.accordion?this.accordion.id:this.id)):this.closed.emit(),this._changeDetectorRef.markForCheck())}get disabled(){return this._disabled}set disabled(e){this._disabled=Object(l.c)(e)}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(e=>{this.disabled||(this.expanded=e)})}}class c{}},A4xj:function(e,n,t){"use strict";t.d(n,"a",function(){return l});class l{}},AyJq:function(e,n,t){"use strict";t.d(n,"a",function(){return a}),t.d(n,"d",function(){return r}),t.d(n,"b",function(){return u}),t.d(n,"c",function(){return c});var l=t("8Y7J"),i=(t("c9fC"),t("SVse")),s=(t("5Bek"),t("zMNK")),a=(t("8bJo"),t("omvX"),t("5GAg"),l.pb({encapsulation:2,styles:[".mat-expansion-panel{box-sizing:content-box;display:block;margin:0;border-radius:4px;overflow:hidden;transition:margin 225ms cubic-bezier(.4,0,.2,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:4px;border-top-left-radius:4px}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:4px;border-bottom-left-radius:4px}@media (-ms-high-contrast:active){.mat-expansion-panel{outline:solid 1px}}.mat-expansion-panel._mat-animation-noopable,.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button{margin-left:8px}[dir=rtl] .mat-action-row button.mat-button{margin-left:0;margin-right:8px}"],data:{animation:[{type:7,name:"bodyExpansion",definitions:[{type:0,name:"collapsed, void",styles:{type:6,styles:{height:"0px",visibility:"hidden"},offset:null},options:void 0},{type:0,name:"expanded",styles:{type:6,styles:{height:"*",visibility:"visible"},offset:null},options:void 0},{type:1,expr:"expanded <=> collapsed, void => collapsed",animation:{type:4,styles:null,timings:"225ms cubic-bezier(0.4,0.0,0.2,1)"},options:null}],options:{}}]}}));function o(e){return l.Kb(0,[(e()(),l.gb(0,null,null,0))],null,null)}function r(e){return l.Kb(2,[l.Gb(671088640,1,{_body:0}),l.Ab(null,0),(e()(),l.rb(2,0,[[1,0],["body",1]],null,5,"div",[["class","mat-expansion-panel-content"],["role","region"]],[[24,"@bodyExpansion",0],[1,"aria-labelledby",0],[8,"id",0]],[[null,"@bodyExpansion.done"]],function(e,n,t){var l=!0;return"@bodyExpansion.done"===n&&(l=!1!==e.component._bodyAnimationDone.next(t)&&l),l},null,null)),(e()(),l.rb(3,0,null,null,3,"div",[["class","mat-expansion-panel-body"]],null,null,null,null,null)),l.Ab(null,1),(e()(),l.gb(16777216,null,null,1,null,o)),l.qb(6,212992,null,0,s.c,[l.j,l.P],{portal:[0,"portal"]},null),l.Ab(null,2)],function(e,n){e(n,6,0,n.component._portal)},function(e,n){var t=n.component;e(n,2,0,t._getExpandedState(),t._headerId,t.id)})}var u=l.pb({encapsulation:2,styles:[".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:0}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-description,.mat-expansion-panel-header-title{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-description,[dir=rtl] .mat-expansion-panel-header-title{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:'';display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}"],data:{animation:[{type:7,name:"indicatorRotate",definitions:[{type:0,name:"collapsed, void",styles:{type:6,styles:{transform:"rotate(0deg)"},offset:null},options:void 0},{type:0,name:"expanded",styles:{type:6,styles:{transform:"rotate(180deg)"},offset:null},options:void 0},{type:1,expr:"expanded <=> collapsed, void => collapsed",animation:{type:4,styles:null,timings:"225ms cubic-bezier(0.4,0.0,0.2,1)"},options:null}],options:{}},{type:7,name:"expansionHeight",definitions:[{type:0,name:"collapsed, void",styles:{type:6,styles:{height:"{{collapsedHeight}}"},offset:null},options:{params:{collapsedHeight:"48px"}}},{type:0,name:"expanded",styles:{type:6,styles:{height:"{{expandedHeight}}"},offset:null},options:{params:{expandedHeight:"64px"}}},{type:1,expr:"expanded <=> collapsed, void => collapsed",animation:{type:3,steps:[{type:11,selector:"@indicatorRotate",animation:{type:9,options:null},options:{optional:!0}},{type:4,styles:null,timings:"225ms cubic-bezier(0.4,0.0,0.2,1)"}],options:null},options:null}],options:{}}]}});function d(e){return l.Kb(0,[(e()(),l.rb(0,0,null,null,0,"span",[["class","mat-expansion-indicator"]],[[24,"@indicatorRotate",0]],null,null,null,null))],null,function(e,n){e(n,0,0,n.component._getExpandedState())})}function c(e){return l.Kb(2,[(e()(),l.rb(0,0,null,null,3,"span",[["class","mat-content"]],null,null,null,null,null)),l.Ab(null,0),l.Ab(null,1),l.Ab(null,2),(e()(),l.gb(16777216,null,null,1,null,d)),l.qb(5,16384,null,0,i.k,[l.P,l.M],{ngIf:[0,"ngIf"]},null)],function(e,n){e(n,5,0,n.component._showToggle())},null)}},LtqA:function(e,n,t){"use strict";t.d(n,"a",function(){return i});var l=t("8Y7J");t("SZKu"),t("0+4O");class i{constructor(e,n,t){this.simulationService=e,this.resultsService=n,this.router=t,this.modelSetupId=null,this.parameterSetId=null,this.isCompact=!1,this.showNoneOption=!1,this.selected=new l.m,this.complete=new l.m,this.setup=new l.m,this.message="",this.runId=null,this.showChart=!1,this.outputSize="small",this.isRunning=!1,this.showPerformanceStatistics=!1,this.goToEdit=!0,this.hasObserved=!1,this.showRunProgress=!1,this.showSaveProgress=!1}ngOnInit(){this.runProgressSub=this.simulationService.runProgressSubject.subscribe(e=>this.runProgress=e),this.saveProgressSub=this.simulationService.saveProgressSubject.subscribe(e=>this.saveProgress=e)}ngOnDestroy(){this.runProgressSub.unsubscribe(),this.saveProgressSub.unsubscribe()}ngOnChanges(e){e.modelSetupId&&this.onRunSetupIdSelect(this.modelSetupId)}onRunClick(){this.runId&&(this.isRunning=!0,this.initializeModelRun())}onRunSetupSelect(e){e?(this.hasObserved=!!e.observed_input_file_id,this.onRunSetupIdSelect(+e.id),this.setup.emit(e)):(this.setup.emit(null),this.hasObserved=!1)}onRunSetupIdSelect(e){this.runId=e,this.message="",this.selected.emit(this.runId)}onOutputSizeSelect(e){this.outputSize=e}onClosed(){this.showPerformanceStatistics=!1,this.goToEdit&&this.router.navigate(["/pages/parameters"],{queryParams:{modelSetupId:this.runId}})}onRunProgressAnimationEnd(e){this.runProgress>99&&(this.showRunProgress=!1,this.message="Storing results...",this.simulationService.stopRunProgressPolling(),this.saveProgress=0,this.showSaveProgress=!0,this.simulationService.startSaveProgressPolling(this.runId))}onSaveProgressAnimationEnd(e){this.saveProgress>99&&(this.showSaveProgress=!1,this.message="Model run complete",this.simulationService.stopSaveProgressPolling())}initializeModelRun(){this.message="Archiving previous results...",this.resultsService.deleteResultsSet(this.runId).subscribe(e=>{this.startModelRun()})}startModelRun(){this.message="Running model...",this.runProgress=0,this.showRunProgress=!0,this.simulationService.startRunProgressPolling(this.runId),this.simulationService.run(this.runId,this.outputSize).subscribe(e=>this.runComplete(),()=>this.isRunning=!1)}runComplete(){this.isRunning=!1,this.complete.emit(!0),this.showPerformanceStatistics=this.hasObserved,this.goToEdit&&this.router.navigate(["/pages/parameters"],{queryParams:{modelSetupId:this.runId}})}}},c9fC:function(e,n,t){"use strict";t.d(n,"d",function(){return B}),t.d(n,"c",function(){return w}),t.d(n,"a",function(){return f}),t.d(n,"b",function(){return x}),t.d(n,"e",function(){return v}),t.d(n,"g",function(){return S}),t.d(n,"f",function(){return y});var l=t("8Y7J"),i=(t("GS7A"),t("5Bek")),s=t("KCVW"),a=t("zMNK"),o=t("XNiG"),r=t("quSY"),u=t("EY2u"),d=t("VRyK"),c=t("/uUt"),p=t("JX91"),h=t("pLZG"),b=t("IzEk"),m=t("5GAg"),g=t("dvZr");const f=new l.p("MAT_ACCORDION");let _=0;const x=new l.p("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS");class v extends i.b{constructor(e,n,t,i,s,a,r){super(e,n,t),this._viewContainerRef=i,this._animationMode=a,this._hideToggle=!1,this.afterExpand=new l.m,this.afterCollapse=new l.m,this._inputChanges=new o.a,this._headerId=`mat-expansion-panel-header-${_++}`,this._bodyAnimationDone=new o.a,this.accordion=e,this._document=s,this._bodyAnimationDone.pipe(Object(c.a)((e,n)=>e.fromState===n.fromState&&e.toState===n.toState)).subscribe(e=>{"void"!==e.fromState&&("expanded"===e.toState?this.afterExpand.emit():"collapsed"===e.toState&&this.afterCollapse.emit())}),r&&(this.hideToggle=r.hideToggle)}get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(e){this._hideToggle=Object(s.c)(e)}_hasSpacing(){return!!this.accordion&&"default"===(this.expanded?this.accordion.displayMode:this._getExpandedState())}_getExpandedState(){return this.expanded?"expanded":"collapsed"}ngAfterContentInit(){this._lazyContent&&this.opened.pipe(Object(p.a)(null),Object(h.a)(()=>this.expanded&&!this._portal),Object(b.a)(1)).subscribe(()=>{this._portal=new a.h(this._lazyContent._template,this._viewContainerRef)})}ngOnChanges(e){this._inputChanges.next(e)}ngOnDestroy(){super.ngOnDestroy(),this._bodyAnimationDone.complete(),this._inputChanges.complete()}_containsFocus(){if(this._body){const e=this._document.activeElement,n=this._body.nativeElement;return e===n||n.contains(e)}return!1}}class S{constructor(e,n,t,l,i){this.panel=e,this._element=n,this._focusMonitor=t,this._changeDetectorRef=l,this._parentChangeSubscription=r.a.EMPTY;const s=e.accordion?e.accordion._stateChanges.pipe(Object(h.a)(e=>!!e.hideToggle)):u.a;this._parentChangeSubscription=Object(d.a)(e.opened,e.closed,s,e._inputChanges.pipe(Object(h.a)(e=>!(!e.hideToggle&&!e.disabled)))).subscribe(()=>this._changeDetectorRef.markForCheck()),e.closed.pipe(Object(h.a)(()=>e._containsFocus())).subscribe(()=>t.focusVia(n,"program")),t.monitor(n).subscribe(n=>{n&&e.accordion&&e.accordion._handleHeaderFocus(this)}),i&&(this.expandedHeight=i.expandedHeight,this.collapsedHeight=i.collapsedHeight)}get disabled(){return this.panel.disabled}_toggle(){this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_keydown(e){switch(e.keyCode){case g.l:case g.d:Object(g.q)(e)||(e.preventDefault(),this._toggle());break;default:return void(this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(e))}}focus(e="program"){this._focusMonitor.focusVia(this._element,e)}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}}class y{}class w extends i.a{constructor(){super(...arguments),this._hideToggle=!1,this.displayMode="default"}get hideToggle(){return this._hideToggle}set hideToggle(e){this._hideToggle=Object(s.c)(e)}ngAfterContentInit(){this._keyManager=new m.g(this._headers).withWrap()}_handleHeaderKeydown(e){const{keyCode:n}=e,t=this._keyManager;n===g.f?Object(g.q)(e)||(t.setFirstItemActive(),e.preventDefault()):n===g.c?Object(g.q)(e)||(t.setLastItemActive(),e.preventDefault()):this._keyManager.onKeydown(e)}_handleHeaderFocus(e){this._keyManager.updateActiveItem(e)}}class B{}},l90l:function(e,n,t){"use strict";t.d(n,"c",function(){return l}),t.d(n,"a",function(){return i}),t.d(n,"b",function(){return s});class l{constructor(e,n,t){this._name=e,this._id=n,this._modelVersionId=t}get name(){return this._name}get id(){return this._id}}class i{constructor(e,n){this._reference=e,this._id=n}get id(){return this._id}get reference(){return this._reference}}class s{constructor(e){this._name=e,this._indexes=[]}*[Symbol.iterator](){for(let e of this._indexes)yield e}addIndex(e){this._indexes.push(e)}get name(){return this._name.name}findIndexById(e){return this._indexes.find(n=>n.id===e)}}},voY7:function(e,n,t){"use strict";var l=t("8Y7J"),i=t("Z5h4"),s=t("r0V8"),a=t("5GAg"),o=t("omvX"),r=t("s7LF"),u=t("bujt"),d=t("Fwaw"),c=t("SVse"),p=t("MBfO"),h=t("8P0U"),b=t("0+4O"),m=t("k47T");class g{constructor(e,n,t){this.resultsService=e,this.bottomSheet=n,this._snackBar=t,this.modelSetupId=null,this.closed=new l.m}ngOnInit(){this.getStatistics()}ngOnChanges(e){}getStatistics(){this.resultsService.getPerformanceStatistics(this.modelSetupId).subscribe(e=>{this.openSnackBar(e)})}openBottomSheet(e){this.bottomSheet.open(m.a,{data:{performanceStatistics:e,modelSetupId:this.modelSetupId}}).afterDismissed().subscribe(()=>{this.closed.emit()})}openSnackBar(e){this._snackBar.openFromComponent(m.a,{data:{performanceStatistics:e,modelSetupId:this.modelSetupId},panelClass:["white-snackbar"]})}}var f=t("lwm9"),_=t("dFDH"),x=l.pb({encapsulation:2,styles:[[".mat-snack-bar-container{max-width:100%!important;max-height:250px!important;overflow:auto!important}"]],data:{}});function v(e){return l.Kb(0,[],null,null)}var S=t("CtHq"),y=t("nZgh"),w=t("SZKu"),B=t("MlvX"),I=t("Xd0L"),C=t("dJrM"),O=t("HsOI"),P=t("IP0z"),k=t("/HVE"),A=t("Azqq"),z=t("JjoW"),q=t("hOhj");class E{constructor(e){this.simulationService=e,this.disabled=!1,this.size=new l.m,this.sizeOptions=null,this.selectedSize=null}ngOnInit(){this.getOptions()}getOptions(){this.simulationService.getResultsLevels().subscribe(e=>{this.sizeOptions=e,this.selectedSize=this.sizeOptions[0]})}onSizeSelect(e){const n=+e.value;this.selectedSize=this.sizeOptions.find(e=>+e.id===n),this.size.emit(this.selectedSize.model_size_name)}}var R=l.pb({encapsulation:0,styles:[[""]],data:{}});function M(e){return l.Kb(0,[(e()(),l.rb(0,0,null,null,2,"mat-option",[["class","mat-option"],["role","option"]],[[1,"tabindex",0],[2,"mat-selected",null],[2,"mat-option-multiple",null],[2,"mat-active",null],[8,"id",0],[1,"aria-selected",0],[1,"aria-disabled",0],[2,"mat-option-disabled",null]],[[null,"click"],[null,"keydown"]],function(e,n,t){var i=!0;return"click"===n&&(i=!1!==l.Bb(e,1)._selectViaInteraction()&&i),"keydown"===n&&(i=!1!==l.Bb(e,1)._handleKeydown(t)&&i),i},B.c,B.a)),l.qb(1,8568832,[[10,4]],0,I.r,[l.k,l.h,[2,I.l],[2,I.q]],{value:[0,"value"]},null),(e()(),l.Ib(2,0,[" "," "]))],function(e,n){e(n,1,0,n.context.$implicit.id)},function(e,n){e(n,0,0,l.Bb(n,1)._getTabIndex(),l.Bb(n,1).selected,l.Bb(n,1).multiple,l.Bb(n,1).active,l.Bb(n,1).id,l.Bb(n,1)._getAriaSelected(),l.Bb(n,1).disabled.toString(),l.Bb(n,1).disabled),e(n,2,0,n.context.$implicit.model_size_name)})}function T(e){return l.Kb(0,[(e()(),l.rb(0,0,null,null,22,"mat-form-field",[["class","mat-form-field"]],[[2,"mat-form-field-appearance-standard",null],[2,"mat-form-field-appearance-fill",null],[2,"mat-form-field-appearance-outline",null],[2,"mat-form-field-appearance-legacy",null],[2,"mat-form-field-invalid",null],[2,"mat-form-field-can-float",null],[2,"mat-form-field-should-float",null],[2,"mat-form-field-has-label",null],[2,"mat-form-field-hide-placeholder",null],[2,"mat-form-field-disabled",null],[2,"mat-form-field-autofilled",null],[2,"mat-focused",null],[2,"mat-accent",null],[2,"mat-warn",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null],[2,"_mat-animation-noopable",null]],null,null,C.b,C.a)),l.qb(1,7520256,null,9,O.c,[l.k,l.h,[2,I.j],[2,P.b],[2,O.a],k.a,l.y,[2,o.a]],null,null),l.Gb(603979776,1,{_controlNonStatic:0}),l.Gb(335544320,2,{_controlStatic:0}),l.Gb(603979776,3,{_labelChildNonStatic:0}),l.Gb(335544320,4,{_labelChildStatic:0}),l.Gb(603979776,5,{_placeholderChild:0}),l.Gb(603979776,6,{_errorChildren:1}),l.Gb(603979776,7,{_hintChildren:1}),l.Gb(603979776,8,{_prefixChildren:1}),l.Gb(603979776,9,{_suffixChildren:1}),(e()(),l.rb(11,0,null,1,8,"mat-select",[["class","mat-select"],["placeholder","Output size"],["role","listbox"]],[[1,"id",0],[1,"tabindex",0],[1,"aria-label",0],[1,"aria-labelledby",0],[1,"aria-required",0],[1,"aria-disabled",0],[1,"aria-invalid",0],[1,"aria-owns",0],[1,"aria-multiselectable",0],[1,"aria-describedby",0],[1,"aria-activedescendant",0],[2,"mat-select-disabled",null],[2,"mat-select-invalid",null],[2,"mat-select-required",null],[2,"mat-select-empty",null]],[[null,"selectionChange"],[null,"keydown"],[null,"focus"],[null,"blur"]],function(e,n,t){var i=!0,s=e.component;return"keydown"===n&&(i=!1!==l.Bb(e,13)._handleKeydown(t)&&i),"focus"===n&&(i=!1!==l.Bb(e,13)._onFocus()&&i),"blur"===n&&(i=!1!==l.Bb(e,13)._onBlur()&&i),"selectionChange"===n&&(i=!1!==s.onSizeSelect(t)&&i),i},A.b,A.a)),l.Fb(6144,null,I.l,null,[z.c]),l.qb(13,2080768,null,3,z.c,[q.e,l.h,l.y,I.d,l.k,[2,P.b],[2,r.q],[2,r.j],[2,O.c],[8,null],[8,null],z.a,a.j],{disabled:[0,"disabled"],placeholder:[1,"placeholder"],value:[2,"value"]},{selectionChange:"selectionChange"}),l.Gb(603979776,10,{options:1}),l.Gb(603979776,11,{optionGroups:1}),l.Gb(603979776,12,{customTrigger:0}),l.Fb(2048,[[1,4],[2,4]],O.d,null,[z.c]),(e()(),l.gb(16777216,null,1,1,null,M)),l.qb(19,278528,null,0,c.j,[l.P,l.M,l.r],{ngForOf:[0,"ngForOf"]},null),(e()(),l.rb(20,0,null,7,2,"mat-hint",[["align","end"],["class","mat-hint"]],[[2,"mat-right",null],[1,"id",0],[1,"align",0]],null,null,null,null)),l.qb(21,16384,[[7,4]],0,O.f,[],{align:[0,"align"]},null),(e()(),l.Ib(22,null,["",""]))],function(e,n){var t=n.component;e(n,13,0,t.disabled,"Output size",null==t.selectedSize?null:t.selectedSize.id),e(n,19,0,t.sizeOptions),e(n,21,0,"end")},function(e,n){var t=n.component;e(n,0,1,["standard"==l.Bb(n,1).appearance,"fill"==l.Bb(n,1).appearance,"outline"==l.Bb(n,1).appearance,"legacy"==l.Bb(n,1).appearance,l.Bb(n,1)._control.errorState,l.Bb(n,1)._canLabelFloat,l.Bb(n,1)._shouldLabelFloat(),l.Bb(n,1)._hasFloatingLabel(),l.Bb(n,1)._hideControlPlaceholder(),l.Bb(n,1)._control.disabled,l.Bb(n,1)._control.autofilled,l.Bb(n,1)._control.focused,"accent"==l.Bb(n,1).color,"warn"==l.Bb(n,1).color,l.Bb(n,1)._shouldForward("untouched"),l.Bb(n,1)._shouldForward("touched"),l.Bb(n,1)._shouldForward("pristine"),l.Bb(n,1)._shouldForward("dirty"),l.Bb(n,1)._shouldForward("valid"),l.Bb(n,1)._shouldForward("invalid"),l.Bb(n,1)._shouldForward("pending"),!l.Bb(n,1)._animationsEnabled]),e(n,11,1,[l.Bb(n,13).id,l.Bb(n,13).tabIndex,l.Bb(n,13)._getAriaLabel(),l.Bb(n,13)._getAriaLabelledby(),l.Bb(n,13).required.toString(),l.Bb(n,13).disabled.toString(),l.Bb(n,13).errorState,l.Bb(n,13).panelOpen?l.Bb(n,13)._optionIds:null,l.Bb(n,13).multiple,l.Bb(n,13)._ariaDescribedby||null,l.Bb(n,13)._getAriaActiveDescendant(),l.Bb(n,13).disabled,l.Bb(n,13).errorState,l.Bb(n,13).required,l.Bb(n,13).empty]),e(n,20,0,"end"==l.Bb(n,21).align,l.Bb(n,21).id,null),e(n,22,0,null==t.selectedSize?null:t.selectedSize.description)})}function F(e){return l.Kb(0,[(e()(),l.gb(16777216,null,null,1,null,T)),l.qb(1,16384,null,0,c.k,[l.P,l.M],{ngIf:[0,"ngIf"]},null)],function(e,n){var t=n.component;e(n,1,0,t.sizeOptions&&t.sizeOptions.length>0)},null)}t("LtqA"),t("iInd"),t.d(n,"a",function(){return j}),t.d(n,"b",function(){return L});var j=l.pb({encapsulation:0,styles:[[".content[_ngcontent-%COMP%]{margin-top:auto;margin-bottom:auto;text-align:center}"]],data:{}});function D(e){return l.Kb(0,[(e()(),l.rb(0,0,null,null,7,"div",[["class","flex-row end"]],null,null,null,null,null)),(e()(),l.rb(1,0,null,null,6,"mat-checkbox",[["class","mat-checkbox"]],[[8,"id",0],[1,"tabindex",0],[2,"mat-checkbox-indeterminate",null],[2,"mat-checkbox-checked",null],[2,"mat-checkbox-disabled",null],[2,"mat-checkbox-label-before",null],[2,"_mat-animation-noopable",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"]],function(e,n,t){var l=!0;return"ngModelChange"===n&&(l=!1!==(e.component.goToEdit=t)&&l),l},i.b,i.a)),l.qb(2,8568832,null,0,s.b,[l.k,l.h,a.h,l.y,[8,null],[2,s.a],[2,o.a]],{labelPosition:[0,"labelPosition"]},null),l.Fb(1024,null,r.m,function(e){return[e]},[s.b]),l.qb(4,671744,null,0,r.r,[[8,null],[8,null],[8,null],[6,r.m]],{model:[0,"model"]},{update:"ngModelChange"}),l.Fb(2048,null,r.n,null,[r.r]),l.qb(6,16384,null,0,r.o,[[4,r.n]],null,null),(e()(),l.Ib(-1,0,["Edit parameters after run"]))],function(e,n){var t=n.component;e(n,2,0,"before"),e(n,4,0,t.goToEdit)},function(e,n){e(n,1,1,[l.Bb(n,2).id,null,l.Bb(n,2).indeterminate,l.Bb(n,2).checked,l.Bb(n,2).disabled,"before"==l.Bb(n,2).labelPosition,"NoopAnimations"===l.Bb(n,2)._animationMode,l.Bb(n,6).ngClassUntouched,l.Bb(n,6).ngClassTouched,l.Bb(n,6).ngClassPristine,l.Bb(n,6).ngClassDirty,l.Bb(n,6).ngClassValid,l.Bb(n,6).ngClassInvalid,l.Bb(n,6).ngClassPending])})}function K(e){return l.Kb(0,[(e()(),l.rb(0,0,null,null,6,null,null,null,null,null,null,null)),(e()(),l.rb(1,0,null,null,3,"div",[["class","flex-row end gutter-top"]],null,null,null,null,null)),(e()(),l.rb(2,0,null,null,2,"button",[["color","primary"],["mat-raised-button",""]],[[1,"disabled",0],[2,"_mat-animation-noopable",null]],[[null,"click"]],function(e,n,t){var l=!0;return"click"===n&&(l=!1!==e.component.onRunClick()&&l),l},u.d,u.b)),l.qb(3,180224,null,0,d.b,[l.k,a.h,[2,o.a]],{disabled:[0,"disabled"],color:[1,"color"]},null),(e()(),l.Ib(-1,0,[" Run model "])),(e()(),l.gb(16777216,null,null,1,null,D)),l.qb(6,16384,null,0,c.k,[l.P,l.M],{ngIf:[0,"ngIf"]},null),(e()(),l.gb(0,null,null,0))],function(e,n){var t=n.component;e(n,3,0,!t.runId||t.isRunning,"primary"),e(n,6,0,t.runId)},function(e,n){e(n,2,0,l.Bb(n,3).disabled||null,"NoopAnimations"===l.Bb(n,3)._animationMode)})}function G(e){return l.Kb(0,[(e()(),l.rb(0,0,null,null,2,"div",[],null,null,null,null,null)),(e()(),l.rb(1,0,null,null,1,"mat-progress-bar",[["aria-valuemax","100"],["aria-valuemin","0"],["class","mat-progress-bar"],["mode","determinate"],["role","progressbar"]],[[1,"aria-valuenow",0],[1,"mode",0],[2,"_mat-animation-noopable",null]],[[null,"animationEnd"]],function(e,n,t){var l=!0;return"animationEnd"===n&&(l=!1!==e.component.onRunProgressAnimationEnd(t)&&l),l},p.b,p.a)),l.qb(2,4374528,null,0,h.b,[l.k,l.y,[2,o.a],[2,h.a]],{value:[0,"value"],mode:[1,"mode"]},{animationEnd:"animationEnd"})],function(e,n){e(n,2,0,n.component.runProgress,"determinate")},function(e,n){e(n,1,0,"indeterminate"===l.Bb(n,2).mode||"query"===l.Bb(n,2).mode?null:l.Bb(n,2).value,l.Bb(n,2).mode,l.Bb(n,2)._isNoopAnimation)})}function N(e){return l.Kb(0,[(e()(),l.rb(0,0,null,null,2,"div",[],null,null,null,null,null)),(e()(),l.rb(1,0,null,null,1,"mat-progress-bar",[["aria-valuemax","100"],["aria-valuemin","0"],["class","mat-progress-bar"],["mode","determinate"],["role","progressbar"]],[[1,"aria-valuenow",0],[1,"mode",0],[2,"_mat-animation-noopable",null]],[[null,"animationEnd"]],function(e,n,t){var l=!0;return"animationEnd"===n&&(l=!1!==e.component.onSaveProgressAnimationEnd(t)&&l),l},p.b,p.a)),l.qb(2,4374528,null,0,h.b,[l.k,l.y,[2,o.a],[2,h.a]],{value:[0,"value"],mode:[1,"mode"]},{animationEnd:"animationEnd"})],function(e,n){e(n,2,0,n.component.saveProgress,"determinate")},function(e,n){e(n,1,0,"indeterminate"===l.Bb(n,2).mode||"query"===l.Bb(n,2).mode?null:l.Bb(n,2).value,l.Bb(n,2).mode,l.Bb(n,2)._isNoopAnimation)})}function H(e){return l.Kb(0,[(e()(),l.rb(0,0,null,null,2,null,null,null,null,null,null,null)),(e()(),l.rb(1,0,null,null,1,"slu-performance-statistics",[],null,[[null,"closed"]],function(e,n,t){var l=!0;return"closed"===n&&(l=!1!==e.component.onClosed()&&l),l},v,x)),l.qb(2,638976,null,0,g,[b.a,f.a,_.b],{modelSetupId:[0,"modelSetupId"]},{closed:"closed"})],function(e,n){e(n,2,0,n.component.runId)},null)}function L(e){return l.Kb(0,[(e()(),l.rb(0,0,null,null,4,"div",[["class","flex-row space"]],null,null,null,null,null)),(e()(),l.rb(1,0,null,null,1,"slu-simulation-run-select",[],null,[[null,"run"]],function(e,n,t){var l=!0;return"run"===n&&(l=!1!==e.component.onRunSetupSelect(t)&&l),l},S.b,S.a)),l.qb(2,638976,null,0,y.a,[w.a],{modelSetupId:[0,"modelSetupId"],parameterSetId:[1,"parameterSetId"],showNoneOption:[2,"showNoneOption"],disabled:[3,"disabled"]},{run:"run"}),(e()(),l.rb(3,0,null,null,1,"slu-output-size-select",[],null,[[null,"size"]],function(e,n,t){var l=!0;return"size"===n&&(l=!1!==e.component.onOutputSizeSelect(t)&&l),l},F,R)),l.qb(4,114688,null,0,E,[w.a],{disabled:[0,"disabled"]},{size:"size"}),(e()(),l.gb(16777216,null,null,1,null,K)),l.qb(6,16384,null,0,c.k,[l.P,l.M],{ngIf:[0,"ngIf"]},null),(e()(),l.rb(7,0,null,null,1,"p",[],null,null,null,null,null)),(e()(),l.Ib(8,null,["",""])),(e()(),l.gb(16777216,null,null,1,null,G)),l.qb(10,16384,null,0,c.k,[l.P,l.M],{ngIf:[0,"ngIf"]},null),(e()(),l.gb(16777216,null,null,1,null,N)),l.qb(12,16384,null,0,c.k,[l.P,l.M],{ngIf:[0,"ngIf"]},null),(e()(),l.gb(16777216,null,null,1,null,H)),l.qb(14,16384,null,0,c.k,[l.P,l.M],{ngIf:[0,"ngIf"]},null)],function(e,n){var t=n.component;e(n,2,0,t.modelSetupId,t.parameterSetId,t.showNoneOption,t.isRunning),e(n,4,0,t.isRunning),e(n,6,0,!t.isCompact),e(n,10,0,t.showRunProgress),e(n,12,0,t.showSaveProgress),e(n,14,0,t.showPerformanceStatistics)},function(e,n){e(n,8,0,n.component.message)})}}}]);