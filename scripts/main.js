this.MyOD&&"object"==typeof this.MyOD||(this.MyOD={}),function(){"use strict";MyOD=new Backbone.Marionette.Application,MyOD.on("before:start",function(){this.searchModel=new MyOD.Models.SearchModel,this.appLayout=new MyOD.Main.Layout}),MyOD.on("start",function(){Backbone.history&&(Backbone.history.start({pushState:!1,root:"/OpenData-Backbone"})||MyOD.navigate("404",{trigger:!0})),Backbone.history.on("route",this.appLayout.setClasses),this.appLayout.setClasses()}),MyOD.navigate=function(e,t){Backbone.history.navigate(e,t)},MyOD.search=function(){var e=MyOD.searchModel.getRoute();MyOD.navigate(e,{trigger:!0})},MyOD.navigate404=function(){MyOD.navigate("404",{trigger:!0,replace:!0})},MyOD.queryStringToObject=function(){var e={},t=Backbone.history.getFragment().split("?")[1];if(t){var n=t.split("&");_.each(n,function(t){t=t.split("="),e[t[0]]="q"===t[0]?t[1].replace(/\+/," ")||"":decodeURIComponent(t[1]||"")})}return e},MyOD.onBeforeDestroy=function(){Backbone.history.stop()}}(),function(){"use strict";MyOD.module("Utils",function(e,t,n,a,o){e.MapManager=a.Object.extend({initialize:function(){this.globalChannel=n.Wreqr.radio.channel("global");var e=o.Deferred();this.dojoReady=e.promise(),require(["esri/map","esri/layers/FeatureLayer","dojo/domReady!"],function(){e.resolve()})},onBeforeDestroy:function(){this.map&&this.map.destroy()},proxyEvent:function(e,t){this.globalChannel.vent.trigger(e,t)},createMap:function(e,t){var n={center:[-56.049,38.485],zoom:3,basemap:"dark-gray"};if(this.map=new esri.Map(e,n),t.coords){var a=new esri.geometry.Extent(t.coords[0][0],t.coords[0][1],t.coords[1][0],t.coords[1][1],new esri.SpatialReference({wkid:4326}));this.map.setExtent(a)}this.map.on("load",dojo.hitch(this,this.proxyEvent,"map:load")),this.map.on("extent-change",dojo.hitch(this,this.proxyEvent,"map:extent-change")),this.map.on("layer-add",dojo.hitch(this,this.proxyEvent,"map:layer-add"))},addDataset:function(e){this.datasetLayer=new esri.layers.FeatureLayer(e.get("url"),{mode:esri.layers.FeatureLayer.MODE_AUTO}),this.datasetLayer.on("load",this.onLoadDataset),this.datasetLayer.on("load",dojo.hitch(this,this.proxyEvent,"map:datasetlayer:load")),this.datasetLayer.on("click",dojo.hitch(this,this.proxyEvent,"map:datasetlayer:click")),this.datasetLayer.on("query-limit-exceeded",dojo.hitch(this,this.proxyEvent,"map:datasetlayer:query-limit-exceeded")),this.datasetLayer.on("update-end",dojo.hitch(this,this.proxyEvent,"map:datasetlayer:update-end")),this.map.addLayer(this.datasetLayer)},onLoadDataset:function(e){e.layer.minScale=0,e.layer.maxScale=0}})})}(),function(){"use strict";MyOD.module("Base",function(e,t,n,a){e.SearchView=a.ItemView.extend({onKeyDown:function(e){if(13===e.which){e.preventDefault();var t=this.ui.search.val();this.model.set({q:t,page:1}),this.search()}},onKeyUp:function(){var e=this.ui.search.val();this.model.set({q:e,page:1})},search:function(){t.search()}})})}(),function(){"use strict";MyOD.module("Models",function(e,t,n,a,o,r){e.SearchModel=n.Model.extend({defaults:{q:"",page:1,per_page:20,total_count:0,sort_by:"relevance"},queryStringParams:["q","page","per_page","sort_by"],getRoute:function(e){var t=r.pick(this.toJSON(),this.queryStringParams),n="datasets";return n+=e?".json?":"?",n+=o.param(t)},getUrl:function(){return t.config.api+this.getRoute(!0)}})})}(),MyOD.config={api:"//umb.dcdev.staging.datacommunity.io/"},this.JST={"datasets/templates/dataset":function(obj){obj||(obj={});{var __t,__p="";_.escape}with(obj)__p+='<h2 class="clearfix"><img class="left" src="'+(null==(__t=thumbnail_url)?"":__t)+'"><span class="left">'+(null==(__t=name)?"":__t)+'</span></h2>\n\n<dl class="dl-horizontal">\n  \n  <dt>Description:</dt>\n  <dd>'+(null==(__t=description)?"":__t)+"</dd>\n  \n  <dt>Owner:</dt>\n  <dd>"+(null==(__t=owner)?"":__t)+"</dd>\n\n  <dt>Created:</dt>\n  <dd>"+(null==(__t=moment(created_at).calendar())?"":__t)+"</dd>\n  \n  <dt>Updated:</dt>\n  <dd>"+(null==(__t=moment(updated_at).calendar())?"":__t)+'</dd>\n\n  <dt>Metadata:</dt>\n  <dd><a href="'+(null==(__t=arcgis_online_item_url)?"":__t)+'">'+(null==(__t=arcgis_online_item_url)?"":__t)+'</a></dd>\n  \n  <dt>Url:</dt>\n  <dd><a href="'+(null==(__t=url)?"":__t)+'">'+(null==(__t=url)?"":__t)+"</a></dd>\n\n  <dt>Tags:</dt>\n  <dd>"+(null==(__t=tags.join(" | "))?"":__t)+"</dd>\n  \n  <dt>Views:</dt>\n  <dd>"+(null==(__t=views)?"":__t)+'</dd>\n\n</dl>\n\n<div id="map"></div>\n';return __p},"error/templates/404":function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<h2 class="clearfix">The page you are looking for doesn\'t exist.</h2>';return __p},"error/templates/500":function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<h2 class="clearfix">An error ocurred.</h2>';return __p},"home/templates/home":function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<div class="jumbotron">\n  <h1 class="page-header">My Open Data</h1>\n\n  <p>\n    <div class="input-group input-group-lg">\n      <label class="sr-only" for="search">Search</label>\n      <input type="search" name="search" id="search" class="form-control" placeholder="search for open data">\n      <span class="input-group-btn">\n        <button id="search-btn" class="btn btn-default" type="button">\n          <span class="glyphicon glyphicon-search" aria-hidden="true"></span>\n        </button>\n      </span>\n    </div>\n  </p>\n\n</div>\n';return __p},"results/templates/results-item":function(obj){obj||(obj={});{var __t,__p="";_.escape}with(obj)__p+="<td>"+(null==(__t=name)?"":__t)+"</td>\n<td>"+(null==(__t=owner)?"":__t)+"</td>\n<td>"+(null==(__t=record_count)?"":__t)+"</td>\n<td>"+(null==(__t=layer_type)?"":__t)+"</td>\n<td>"+(null==(__t=views)?"":__t)+"</td>\n<td>"+(null==(__t=moment(created_at).fromNow())?"":__t)+"</td>\n<td>"+(null==(__t=moment(updated_at).fromNow())?"":__t)+"</td>";return __p},"results/templates/results":function(obj){obj||(obj={});{var __t,__p="";_.escape,Array.prototype.join}with(obj)__p+="<h2>Your search for <em>"+(null==(__t=q)?"":__t)+"</em> yielded "+(null==(__t=total_count)?"":__t)+' datasets</h2>\n<div class="table-responsive">  \n  <table class="table table-striped table-bordered table-hover">\n    <thead>\n      <tr>\n        <th>NAME</th>\n        <th>OWNER</th>\n        <th>RECORDS</th>\n        <th>LAYER TYPE</th>\n        <th>VIEWS</th>\n        <th>CREATED</th>\n        <th>UPDATED</th>\n      </tr>\n    </thead>\n    <tbody></tbody>\n  </table>\n</div>\n<nav>\n  <ul class="pagination">\n    ',pages.length>1&&(__p+='\n      <li id="page-prev" class="'+(null==(__t=firstPage)?"":__t)+'"><a href="'+(null==(__t=prevUrl)?"":__t)+'" data-page="'+(null==(__t=prevPage)?"":__t)+'"><span aria-hidden="true">&laquo;</span></a></li>\n      \n      ',_.each(pages,function(e){__p+='\n        <li class="'+(null==(__t=e.active)?"":__t)+'"><a href="'+(null==(__t=e.url)?"":__t)+'" class="page-number" data-page="'+(null==(__t=e.page)?"":__t)+'">'+(null==(__t=e.page)?"":__t)+"</a></li>\n      "}),__p+='\n\n      <li id="page-next" class="'+(null==(__t=lastPage)?"":__t)+'"><a href="'+(null==(__t=nextUrl)?"":__t)+'" data-page="'+(null==(__t=nextPage)?"":__t)+'"><span aria-hidden="true">&raquo;</span></a></li>\n    '),__p+="\n  </ul>\n</nav>";return __p}},function(){"use strict";MyOD.module("Main",function(e){e.HeaderSearchView=MyOD.Base.SearchView.extend({initialize:function(){this.listenTo(this.model,"change:q",this.onQueryChanged)},el:"#header-search-container",template:!1,events:{"keydown #header-search":"onKeyDown","keyup #header-search":"onKeyUp","click #header-search-btn":"search"},ui:{search:"#header-search"},onQueryChanged:function(){this.ui.search.val(this.model.get("q"))}})})}(),function(){"use strict";MyOD.module("Main",function(e,t,n,a,o,r){e.Layout=a.LayoutView.extend({initialize:function(){r.bindAll(this,"setClasses"),this.headerSearchView=new e.HeaderSearchView({model:t.searchModel}).render()},el:"body",regions:{main:"#main-region"},setClasses:function(){var e=this;0===n.history.getFragment().indexOf("datasets")?e.$el.removeClass("page-home"):e.$el.addClass("page-home")}})})}(),function(){"use strict";MyOD.module("HomeModule",function(e,t){e.View=MyOD.Base.SearchView.extend({initialize:function(){this.model=t.searchModel},template:JST["home/templates/home"],events:{"keydown #search":"onKeyDown","keyup #search":"onKeyUp","click #search-btn":"search"},ui:{search:"#search"},id:"home",onDomRefresh:function(){this.ui.search.focus()}})})}(),function(){"use strict";MyOD.module("HomeModule",function(e,t,n,a){e.Controller=a.Controller.extend({initUi:function(){var n=new e.View;t.appLayout.getRegion("main").show(n)}})})}(),function(){"use strict";MyOD.module("HomeModule",function(e,t,n){e.Router=n.Marionette.AppRouter.extend({appRoutes:{"":"show"}}),e.addInitializer(function(){new e.Router({controller:e.API})}),e.API={show:function(t){this.homeController||(this.homeController=new e.Controller(t)),this.homeController.initUi(t)}}})}(),function(){"use strict";MyOD.module("Models",function(e,t,n){e.DatasetModel=n.Model.extend({defaults:{id:"",name:"",description:"",tags:[],arcgis_online_item_url:"",owner:"",url:"",created_at:"",updated_at:"",views:0,thumbnail_url:""},parse:function(e){return e.data||e},url:function(){return MyOD.config.api+"datasets/"+this.get("id")+".json"}})})}(),function(){"use strict";MyOD.module("Models",function(e,t,n,a,o,r){e.DatasetCollection=n.Collection.extend({model:e.DatasetModel,url:function(){return t.searchModel.getUrl(!0)},parse:function(e){return t.searchModel.set(r.extend(e.metadata.query_parameters,e.metadata.stats)),e.data}})})}(),function(){"use strict";MyOD.module("ResultsModule",function(e,t,n,a,o){e.ItemView=a.ItemView.extend({template:JST["results/templates/results-item"],model:MyOD.Models.DatasetModel,tagName:"tr",events:{click:"onClick"},onClick:function(){this.trigger("result:clicked",this.model)}}),e.View=a.CompositeView.extend({initialize:function(){this.listenTo(this,"childview:result:clicked",this.selectDataset)},template:JST["results/templates/results"],childView:e.ItemView,childViewContainer:"tbody",events:{"click ul.pagination a":"onPageClicked"},modelEvents:{"change:total_count":"render"},id:"results",selectDataset:function(e,n){t.navigate("/datasets/"+n.get("id"),{trigger:!0})},onPageClicked:function(e){if(!e.metaKey&&!e.ctrlKey){e.stopPropagation(),e.preventDefault();var n=o(e.target).closest("a").data("page"),a=t.searchModel.clone();a.set("page",n),t.navigate(a.getRoute(!1),{trigger:!0})}},templateHelpers:function(){for(var e,n=t.searchModel.toJSON(),a=Math.round(n.total_count),o=+n.page,r=0===o?o+1:o,i=n.per_page,s=Math.ceil(a/i),l=[],d=s>10&&r>6?r-5:1,c=s>d+9?d+9:s,u=this.model.clone(),h=d;c>=h;h++)e=h===r?"active":"",u.set("page",h),l.push({url:u.getRoute(!1),page:h,active:e});var p=this.model.getRoute(!1),_=o;1!==r&&(_=o-1,u.set("page",_),p=u.getUrl());var m=this.model.getRoute(!1),f=o;return s!==r&&(f=o+1,u.set("page",f),m=u.getUrl()),{firstPage:1===r?"disabled":"",lastPage:s===r?"disabled":"",prevUrl:p,nextUrl:m,prevPage:_,nextPage:f,pages:l}}})})}(),function(){"use strict";MyOD.module("ResultsModule",function(e,t,n,a){e.Controller=a.Controller.extend({initUi:function(){this.collection=new t.Models.DatasetCollection,this.collection.fetch({cache:!0});var n=new e.View({model:t.searchModel,collection:this.collection});t.appLayout.getRegion("main").show(n)}})})}(),function(){"use strict";MyOD.module("ResultsModule",function(e,t,n){e.Router=n.Marionette.AppRouter.extend({appRoutes:{"datasets(/)":"show"}}),e.addInitializer(function(){new e.Router({controller:e.API})}),e.API={show:function(n){var a=t.queryStringToObject();t.searchModel.set(a),this.resultsController||(this.resultsController=new e.Controller(n)),this.resultsController.initUi(n)}}})}(),function(){"use strict";MyOD.module("DatasetsModule",function(e,t,n,a){e.View=a.ItemView.extend({initialize:function(e){this.mapManager=e.mapManager},template:JST["datasets/templates/dataset"],id:"dataset",ui:{mapDiv:"#map"},modelEvents:{change:"render"},onDomRefresh:function(){if("table"!==this.model.get("layer_type").toLowerCase()){var e=this;this.ui.mapDiv.show(),this.mapManager.dojoReady.done(function(){e.mapManager.createMap("map",{coords:e.model.get("extent").coordinates}),e.mapManager.addDataset(e.model)})}},onDestroy:function(){this.mapManager.destroy()}})})}(),function(){"use strict";MyOD.module("DatasetsModule",function(e,t,n,a,o,r){e.Controller=a.Controller.extend({initialize:function(){r.bindAll(this,"onModelFetched")},initUi:function(e){this.mapManager=new t.Utils.MapManager,this.model=new t.Models.DatasetModel({id:e}),this.model.fetch().done(this.onModelFetched).fail(function(){t.navigate404()})},onModelFetched:function(){var n=new e.View({model:this.model,mapManager:this.mapManager});t.appLayout.getRegion("main").show(n)},onBeforeDestroy:function(){this.mapManager&&this.mapManager.destroy()}})})}(),function(){"use strict";MyOD.module("DatasetsModule",function(e,t,n){e.Router=n.Marionette.AppRouter.extend({appRoutes:{"datasets/:id(/)":"show"}}),e.addInitializer(function(){new e.Router({controller:e.API})}),e.API={show:function(t){this.resultsController||(this.datasetsController=new e.Controller(t)),this.datasetsController.initUi(t)}}})}(),function(){"use strict";MyOD.module("ErrorModule",function(e,t,n,a){e.View=a.ItemView.extend({getTemplate:function(){var e,t=this.model.get("errorCode");switch(t){case 404:e=JST["error/templates/404"];break;default:e=JST["error/templates/500"]}return e}})})}(),function(){"use strict";MyOD.module("ErrorModule",function(e,t,n,a){e.Controller=a.Controller.extend({initUi:function(a){var o=new n.Model({errorCode:a.errorCode}),r=new e.View({model:o});t.appLayout.getRegion("main").show(r)}})})}(),function(){"use strict";MyOD.module("ErrorModule",function(e,t,n){e.Router=n.Marionette.AppRouter.extend({appRoutes:{404:"error404",500:"error500"}}),e.addInitializer(function(){new e.Router({controller:e.API})}),e.API={initController:function(){this.errorController||(this.errorController=new e.Controller)},error404:function(){this.initController(),this.errorController.initUi({errorCode:404})},error500:function(){this.initController(),this.errorController.initUi({errorCode:500})}}})}(),$(function(){"use strict";MyOD.start()});