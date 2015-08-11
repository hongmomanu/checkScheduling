/**
 * Created by jack on 5/25/15.
 */
/**
 * Created by jack on 14-11-18.
 * main Controller used by Terminal app
 */
Ext.define('checkScheduling.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'Main',
            'Online',
            'Online2',
            'PassedNum'
        ],
        requires: [

            'Ext.Toolbar',
            'Ext.field.Text',
            'Ext.data.Store',
            'Ext.dataview.List'
        ],
        models: [

            'Online',
            'Online2',
            'PassedNum'


        ],
        stores: [

            'Onlines',
            'Onlines2',
            'PassedNums'


        ],
        control: {
            nav: {
                initialize: 'initRender'

            },
            settingbtn:{
                tap:'showSettingForm'
            }

        },
        refs: {

            nav: 'main',
            onlinelist:'onlinelist',
            onlinelist2:'onlinelist2',
            passednum:'passednum',
            tippanel:'main #tip',
            settingbtn:'main #settingbtn'

        }
    },


    showSettingForm:function(item){
        var me=this;
        var overlay = Ext.Viewport.add({
            xtype: 'panel',
            // We give it a left and top property to make it floating by default
            left: 0,
            top: 0,

            // Make it modal so you can click the mask to hide the overlay
            modal: true,
            hideOnMaskTap: true,

            // Make it hidden by default
            hidden: true,

            // Set the width and height of the panel
            width: 350,
            height: 280,

            // Here we specify the #id of the element we created in `index.html`
            //contentEl: 'content',

            // Style the content and make it scrollable
            styleHtmlContent: true,
            scrollable: true,
            layout:'fit',

            // Insert a title docked at the top with a title
            items: [
                {
                    //docked: 'top',
                    xtype: 'formpanel',
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'serverurl',
                            value:localStorage.serverurl,
                            label: 'serverurl'
                        },
                        {
                            xtype: 'textfield',
                            name: 'area',
                            //hidden:true,
                            value:localStorage.area,
                            label: 'roomno'
                        },
                        {
                            xtype: 'button',
                            margin:15,
                            width:'90%',

                            text: '确定',
                            ui:'confirm',
                            handler:function(btn){
                                var form=btn.up('formpanel');
                                var formdata=form.getValues();
                                localStorage.serverurl=formdata.serverurl;
                                localStorage.area=formdata.area;
                                overlay.hide();
                                window.location.reload();

                            },
                            itemId: 'save'
                        },
                        {
                            xtype: 'button',
                            margin:15,
                            width:'90%',

                            text: '更新',
                            ui:'confirm',
                            handler:function(btn){
                                me.installbigscreen();

                            }
                        }
                    ],
                    title: 'Overlay Title'
                }
            ]
        });

        overlay.showBy(item);


    },

    maketip:function(){
        var str='<div><marquee  scrollamount=2>'+localStorage.tip+'</marquee></div>';
        this.getTippanel().setHtml(str);
    },
    websocketInit:function(){
        testobj=this;

        var url=localStorage.serverurl;
        var area=localStorage.area;
        if(!url||url==""){
            Ext.Msg.alert('提示','服务地址为空');
            return ;
        }
        if(!area||area==""){
            Ext.Msg.alert('提示','诊区为空');
            return ;
        }
        //url=url?"ws://"+url.split("://")[1].split(":")[0]+":3001/":"ws://localhost:3001/";
        url=url.replace(/(:\d+)/g,":3001");
        url=url.replace("http","ws");
        this.socket = new WebSocket(url);
        var me=this;


        this.socket.onmessage = function(event) {
            //alert(1111);
            //console.log(data);
            var data=JSON.parse(event.data);

            //console.log(data);
            //Ext.Msg.alert("1111");

            if(data.type==1){
                if(localStorage.area==data.roomno){
                    /*var content=data.content;
                    var str='<div><marquee  scrollamount=2>'+content+'</marquee></div>';
                    me.getTippanel().setHtml(str);
                    localStorage.tip=content;*/

                }
            }else if(data.type==0){
                //me.getOnlineData(me);
               // me.getPassedData();
                //console.log(data);
                me.getFireDataNew(data.data);
                /*if(data.area== localStorage.area){

                    /!*me.getOnlineDataUpdate(data.sortcode);
                    me.getPassedDataUpdate(data.sortcode);
                    me.getFinishData(data.sortcode);*!/
                    me.getFireData(data.sortcode);

                    //me.getNewestStatus();

                }*/

            }else if(data.type==3){
                localStorage.totaltimes=data.totaltimes;
            }else if(data.type==4){
                localStorage.showlines=data.showlines;
            }else if(data.type==5){
                //console.log(data);
                if(data.area== localStorage.area){
                    if(data.sptype==0){
                        //console.log(0);
                        localStorage.speed=data.speed;
                    }else if(data.sptype==1){
                        //console.log(1);
                        localStorage.speed1=data.speed;
                    }else if(data.sptype==2){
                        //console.log(2);
                        localStorage.speed2=data.speed;
                    }

                }

            }else if(data.type==6){
                //localStorage.speed=data.speed;
                window.location.reload();
            }else if(data.type==8){
                //localStorage.speed=data.speed;
                //window.location.reload();
                //console.log(data);
                if(data.num==localStorage.area){
                    me.cleardata();
                }

            }



        };
        this.socket.onclose = function(event) {

            //console.log(121212);
            var d = new Ext.util.DelayedTask(function(){
                me.websocketInit();
            });
            d.delay(5000);
        };

        this.socket.onopen = function() {

            me.socket.send(JSON.stringify({
                type:"mainscreen",
                content: localStorage.area
            }));
        };

    },

    isplaying:false,

    playlist:[],
    scrollinit:0,
    space:30,
    autoscrollshow:function(){
        var me=this;
        var listscroll=me.getPassednum().getScrollable().getScroller();

        testobj=me.getNav().down('#passedtitle');


        //var titleHeight=me.getNav().down('#passedtitle').getEl().getHeight();
        //var neweststatusHeight=me.getNav().down('#neweststatus').getEl().getHeight();
        //var totalHeight=me.getPassednum().up('panel');

        setInterval(function(){
            var scrollheight=listscroll.getSize().y;
            //var bodyheight=Ext.getBody().getHeight();
            var passedHeight=me.getPassednum().element.getHeight();
            //console.log("scrollheight:" +scrollheight);
            //console.log("bodyheight:" +passedHeight);

            //if((scrollheight-(bodyheight*0.9-40))>=me.scrollinit){//40
            if((scrollheight-passedHeight)>me.scrollinit){//40

                me.scrollinit=me.scrollinit+(passedHeight-50);//90
                listscroll.scrollTo(0,me.scrollinit);

            }else{
                me.scrollinit=0;
                listscroll.scrollToTop();
            }

        }, 5000)

    },
    cleardata:function(){
        var store1=this.getOnlinelist().getStore();
        var store2=this.getOnlinelist2().getStore();
        var store3=this.getPassednum().getStore();
        store1.removeAll();
        store2.removeAll();
        store3.removeAll();

    },
    autoscrollData:function(store,list){
        /*var me=this;
        var listscroll=list.getScrollable().getScroller();
        var scrollheight=listscroll.getSize().y;
        var bodyheight=Ext.getBody().getHeight();
        console.log(scrollheight);
        if((scrollheight-(bodyheight*0.9-69))>=0){

            store.removeAt(0);

        }*/
        if(store.data.items.length>=(parseInt(localStorage.showlines)+1)){
            store.removeAt(0);
        }

    },
    callingindex:0,
    getFireDataNew:function(data){
        //console.log("#_");
        //console.log(data);
        var me=this;
        for(var i=0;i<data.length;i++){
            if(data[i].stateflag=='fn'){

                me.removeFinishData(data[i]);

            }else if(data[i].stateflag=='la'){

                var store=me.getPassednum().getStore();
                store.add(data[i]);
                me.removeFinishData(data[i]);


            }else if(data[i].stateflag=='rd'){

                me.makeColor(data);
                var store=me.getOnlinelist().getStore();
                if(data.length>0){
                    me.playlist=me.playlist.concat(data);
                    if(!me.isplaying){
                        me.isplaying=true;
                        me.makevoiceanddisplay(store,me.callingindex,me);
                    }


                }




            }else if(data[i].stateflag=='it'){
                me.makeColor(data);
            }

        }

    },
    getFireData:function(sortcode){
        var me=this;
        //var store=this.getPassednum().getStore();
        var successFunc = function (response, action) {
            var res=JSON.parse(response.responseText);
            for(var i=0;i<res.length;i++){
                if(res[i].stateflag=='fn'){

                    me.removeFinishData(res[i]);

                }else if(res[i].stateflag=='la'){

                    var store=me.getPassednum().getStore();
                    store.add(res[i]);
                    me.removeFinishData(res[i]);


                }else if(res[i].stateflag=='rd'){

                    me.makeColor(res);
                    var store=me.getOnlinelist().getStore();
                    if(res.length>0){
                        me.playlist=me.playlist.concat(res);
                        if(!me.isplaying){
                            me.isplaying=true;
                            me.makevoiceanddisplay(store,me.callingindex,me);
                        }


                    }

                    /*if(!me.isplaying)me.playlist=[];

                    if(res.length>0){
                        if(me.isplaying){
                            me.playlist=me.playlist.concat(res);
                        }else{
                            me.playlist=res;
                            me.isplaying=true;
                            me.makevoiceanddisplay(store,0,me);
                        }
                    }*/


                }else if(res[i].stateflag=='it'){
                    me.makeColor(res);
                }
                //me.getNewestStatusByItem(res[i]);
            }


        };
        var failFunc = function (response, action) {
            //Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getdatabysortcode";
        var params = {
            sortcode:sortcode
        };
        CommonUtil.ajaxSend(params, url, successFunc, failFunc, 'GET');

    },
    getNewestStatusByItem:function(item){
        if(item.stateflag=='rd'){






        }
        /*else if(item.stateflag=='la'){


        }else if(item.stateflag=='ca'){


        }*/


    },
    neweststatusItem:null,
    getNewestStatus:function(){
        var me=this;
        if(!me.neweststatusItem){
            me.neweststatusItem=this.getNav().down('#neweststatus');
            Ext.get('neweststatusmardiv').setWidth(me.neweststatusItem.element.getWidth()-15);
        }
        //var item=this.getNav().down('#neweststatus');

        var colors=["red","skyblue","yellow","darksalmon","darkorange","#d88a6a"];
        var successFunc = function (response, action) {
            var res=JSON.parse(response.responseText);
            var html='';
            //Ext.get('neweststatusmardiv').setWidth(item.element.getWidth()-15);
            //var html='<div style="width:'+(item.element.getWidth()-15)+'px;" ><marquee width="100%" style="width: 100%;"   scrollamount=2>';
            for(var i=0;i<res.length;i++){
                html+='<a style="color:'+colors[1]+'">'+res[i].name+'</a>:已叫到 '+'<a style="color:'+colors[1]+'">'+res[i].value+'</a> &nbsp;&nbsp;&nbsp;&nbsp;';
                //if(i%2==1)html+='<br>'
                //if(i==3)break;
            }
            Ext.get('neweststatusmar').setHtml(html);
            //html+='</marquee></div>';
            //item.setHtml(html);
            //item.setTitle(html);

        };
        var failFunc = function (response, action) {
            //Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getnewestwaitingstatus";
        var params = {
            area:localStorage.area
        };
        CommonUtil.ajaxSend(params, url, successFunc, failFunc, 'GET');
    },
    getPassedDataUpdate:function(sortcode){

        var me=this;
        var store=this.getPassednum().getStore();
        var successFunc = function (response, action) {
            var res=JSON.parse(response.responseText);
            for(var i=0;i<res.length;i++){
                store.add(res[i]);
            }


        };
        var failFunc = function (response, action) {
            //Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getbigscreenpasseddataupdate";
        var params = {
            sortcode:sortcode
        };
        CommonUtil.ajaxSend(params, url, successFunc, failFunc, 'GET');

    },
    getPassedData:function(){

        var me=this;
        var store=this.getPassednum().getStore();
        var linenos= 0;
        if(store.data.items.length>0){

            linenos=store.data.items[store.data.items.length-1].get('linenos');
        }else{
            linenos=0;
        }
        var successFunc = function (response, action) {
            var res=JSON.parse(response.responseText);
            for(var i=0;i<res.length;i++){
                store.add(res[i]);
            }


        };
        var failFunc = function (response, action) {
            //Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getbigscreenpasseddata";
        var params = {
            linenos:linenos,
            area:localStorage.area
        };
        CommonUtil.ajaxSend(params, url, successFunc, failFunc, 'GET');

    },
    makeColor:function(res){
        var store=this.getPassednum().getStore();
        var data=store.data.items;

        for(var j=0;j<res.length;j++){
            for(var i=0;i<data.length;i++){
                if(res[j].sortcode==data[i].get('sortcode')){
                    var raw=data[i].raw;
                    raw.css=true;
                    data[i].set(raw);
                }

            }

        }


    },
    removePassed:function(item){
        var store=this.getPassednum().getStore();
        var data=store.data.items;


        for(var i=0;i<data.length;i++){
            if(item.get('sortcode')==data[i].get('sortcode')){
                store.removeAt(i);
            }

        }



    },
    getOnlineData:function(me){

       // var me=this;

        var store=me.getOnlinelist().getStore();

        var linenos= 0;
        if(store.data.items.length>0){

            linenos=store.data.items[store.data.items.length-1].get('linenos');
        }else{
            linenos=0;
        }

        var successFunc = function (response, action) {
            var res=JSON.parse(response.responseText);
            me.makeColor(res);

            if(res.length>0){
                me.isplaying=true;
                me.playlist=me.playlist.concat(res);
                me.makevoiceanddisplay(store,me.callingindex,me);

            }

           /* if(!me.isplaying)me.playlist=[];

            if(res.length>0){
                if(me.isplaying){
                    me.playlist=me.playlist.concat(res);
                }else{
                    me.playlist=res;
                    me.isplaying=true;
                    me.makevoiceanddisplay(store,0,me);
                }

            }*/



        };
        var failFunc = function (response, action) {
            //Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getbigscreendata";
        var params = {
            linenos:linenos,
            area:localStorage.area

        };
        CommonUtil.ajaxSend(params, url, successFunc, failFunc, 'GET');

    },
    removeFinishData:function(item){
        var store1=this.getOnlinelist().getStore();
        var store2=this.getOnlinelist2().getStore();
        var data1=store1.data.items;
        var data2=store2.data.items;

        var delete_arr1=[];
        var delete_arr2=[];

        Ext.each(data1,function(onedata,index){
            if(item.sortcode==onedata.get('sortcode')) delete_arr1.push(onedata);
        })
        Ext.each(data2,function(onedata,index){
            if(item.sortcode==onedata.get('sortcode'))delete_arr2.push(onedata);
        });

        store1.remove(delete_arr1);
        store2.remove(delete_arr2);

        /*Ext.each(delete_arr1,function(onedata){
            store1.remove(delete_arr1);
        });
        Ext.each(delete_arr2,function(onedata){
            store2.remove(delete_arr2);
        });*/



       // while()
       /* var len1=data1.length;
        var len2=data2.length;
        for(var m=(data1.length-1);m<len1;m--){
            if(item.sortcode==data1[m].get('sortcode')){
                store1.removeAt(m);
            }
        }
        for(var n=0;n<data2.length;n++){
            if(item.sortcode==data2.get('sortcode')){
                //alert(2);
                store2.removeAt(n);
            }

        }*/
    },
    getFinishData:function(sortcode){
        var me=this;
        //var store=me.getOnlinelist().getStore();
        var successFunc = function (response, action) {
            var res=JSON.parse(response.responseText);
            for(var i=0;i<res.length;i++){
                me.removeFinishData(res[i]);
            }

        };
        var failFunc = function (response, action) {
            //Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getdatabysortcodeandtype";
        var params = {
            sortcode:sortcode,
            type:'fn'
        };
        CommonUtil.ajaxSend(params, url, successFunc, failFunc, 'GET');

    },
    getOnlineDataUpdate:function(sortcode){

       var me=this;

        var store=me.getOnlinelist().getStore();


        var successFunc = function (response, action) {
            var res=JSON.parse(response.responseText);
            me.makeColor(res);

            if(!me.isplaying)me.playlist=[];

            if(res.length>0){
                if(me.isplaying){
                    me.playlist=me.playlist.concat(res);
                }else{
                    me.playlist=res;
                    me.isplaying=true;
                    me.makevoiceanddisplay(store,0,me);
                }

            }



        };
        var failFunc = function (response, action) {
            //Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getbigscreendataupdate";
        var params = {
            sortcode:sortcode
        };
        CommonUtil.ajaxSend(params, url, successFunc, failFunc, 'GET');

    },
    makevoiceanddisplay:function(store,index,me){
        me.callingindex=index;


        var list1=me.getOnlinelist();
        var list2=me.getOnlinelist2();
        var list=null;



        try{
            if((me.playlist.length-1)>=index){
                var item=me.playlist[index];
                var showno=item.showno;
                if(showno[showno.length-1]%2==0){
                    store=list2.getStore();
                    list=list2;
                }else{
                    store=list1.getStore();
                    list=list1;
                }
            }
        }catch(e){
            store=list1.getStore();
            list=list1;
        }
        finally{

        }



        //console.log(1)
        /*var a=Ext.select('.flash');
        a.removeCls('flash');*/
        if(list1.getStore().data.items.length>0){
            var num=list1.getStore().data.items.length-1;
            var raw=list1.getStore().data.items[num].raw;
            raw.css='noflash';
            list1.getStore().data.items[num].set(raw);
            me.removePassed(list1.getStore().data.items[num],num);

        }
        if(list2.getStore().data.items.length>0){
            var num=list2.getStore().data.items.length-1;
            var raw=list2.getStore().data.items[num].raw;
            raw.css='noflash';
            list2.getStore().data.items[num].set(raw);
            me.removePassed(list2.getStore().data.items[num],num);

        }
        if((me.playlist.length-1)>=index){

            var item=me.playlist[index];

            item.css='flash';
            store.add(item);
            me.getNewestStatus();
            me.autoscrollData(store,list);
            //var text="请 "+item.showno+item.patname+" 到"+item.roomname+"机房门口等候检查";
            var text=["请 "+item.showno,item.patname," 到"+item.roomname+"机房门口等候检查"];


            me.playvoice(text,store,index,me.makevoiceanddisplay,me);
        }else{
            me.isplaying=false;
            /*me.isplaying=false;
            me.playlist=[];*/
            /*navigator.speech.removeEventListener("SpeakCompleted",function(){});
            navigator.speech.stopSpeaking();*/
        }



    },
    speaktimes:0,

    totaltimes:2,

    installbigscreen:function(){
        this.installapk(localStorage.serverurl+"app/bigscreen.apk");

    },

    installapk:function(url){

        Ext.Viewport.mask({ xtype: 'loadmask',
            message: "下载中..." });

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,gotFS , function(){});
        function gotFS(fileSystem) {

            fileSystem.root.getFile("check.apk", {create: true, exclusive: false}, gotFileEntry,  function(){

            });

            function gotFileEntry(fileEntry) {


                var fileTransfer = new FileTransfer();
                var uri = encodeURI(url);

                fileTransfer.download(
                    uri,
                    fileEntry.toInternalURL(),
                    function(entry) {
                        //console.log("download complete: " + entry.fullPath);
                        Ext.Viewport.unmask();

                        //Ext.Msg.alert("succ",entry.fullPath);
                        cordova.plugins.fileOpener2.open(
                            fileEntry.toInternalURL(),
                            'application/vnd.android.package-archive'
                        );
                        navigator.app.exitApp();




                    },
                    function(error) {
                        Ext.Msg.alert("失败","程序下载失败"+error.code);
                        Ext.Viewport.unmask();
                        //Ext.Msg.alert("失败","程序下载失败");

                    },
                    false,
                    {
                        headers: {
                            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        }
                    }
                );




            }

        }

    },

    playvoice:function(text,store,index,callback,me){

        //callback(store,index,me);


        //me.tipvoice.play();
        setTimeout(function(){
            me.speaktimes++;
            try{
                //navigator.speech.startSpeaking( text , {voice_name: 'xiaoyan',speed: localStorage.speed} );
                navigator.speech.startSpeaking( text[0] , {voice_name: 'xiaoyan',speed: localStorage.speed} );
                setTimeout(function(){
                    navigator.speech.startSpeaking( text[1]+'.'+text[1] , {voice_name: 'xiaoyan',speed: localStorage.speed1} );

                },2000);
                /*setTimeout(function(){
                    navigator.speech.startSpeaking( text[1] , {voice_name: 'xiaoyan',speed: localStorage.speed1} );
                },4500);*/

                setTimeout(function(){
                    navigator.speech.startSpeaking( text[2] , {voice_name: 'xiaoyan',speed: localStorage.speed2} );
                },(function(str){
                    if(!str||str=="")return 6000;
                    else if(str.length==2)return 5400;
                    else if(str.length==3)return 6400;
                    else if(str.length==4)return 6800;
                    else return 6000;
                }(text[1])));


            }catch (e){}
            finally{
                setTimeout(function(){
                    if(me.speaktimes>=localStorage.totaltimes){
                        me.speaktimes=0;
                        delete me.playlist[index];
                        callback(store,index+1,me);
                    }else{
                        //tipvoice.removeEventListener('ended',voiceEnd,false);
                        me.playvoice(text,store,index,callback,me)
                    }
                },9000);
            };

        },500);



    },

    initRender: function () {
        //alert("update");
        var me=this;
        mytestobj=me;
        document.addEventListener("deviceready", function(){

            try{
                cordova.plugins.autoStart.enable();
                navigator.speech.startSpeaking( "", {voice_name: 'xiaoyan'} );
            }catch(e){

            }finally{
                /*if(!me.tipvoice){
                    var voiceurl=localStorage.serverurl+'audio/alert.wav';
                    me.tipvoice=new Audio(voiceurl);
                }*/
                if(!localStorage.totaltimes)localStorage.totaltimes=2;
                if(!localStorage.showlines)localStorage.showlines=7;
                if(!localStorage.speed)localStorage.speed=30;
                if(!localStorage.speed1)localStorage.speed1=5;
                if(!localStorage.speed2)localStorage.speed2=40;
                if(!localStorage.tip)localStorage.tip='温馨提示：（滚动播放，内容可被修改）';
                me.websocketInit();
                me.getOnlineData(me);
                me.getPassedData();
                me.autoscrollshow();
                //me.maketip();
                me.getNewestStatus();
            }


        }, false);


    }

});