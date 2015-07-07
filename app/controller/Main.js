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
            height: 180,

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
                            name: 'roomno',
                            hidden:true,
                            value:localStorage.roomno,
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
                                //localStorage.roomno=formdata.roomno;
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
    websocketInit:function(){
        testobj=this;

        var url=localStorage.serverurl;
        //var roomno=localStorage.roomno;
        if(!url||url==""){
            Ext.Msg.alert('提示','服务地址为空');
            return ;
        }
        /*if(!roomno||roomno==""){
            Ext.Msg.alert('提示','房间号为空');
            return ;
        }*/
        //url=url?"ws://"+url.split("://")[1].split(":")[0]+":3001/":"ws://localhost:3001/";
        url=url.replace(/(:\d+)/g,":3001");
        url=url.replace("http","ws");
        this.socket = new WebSocket(url);
        var me=this;


        this.socket.onmessage = function(event) {
            //alert(1111);
            var data=JSON.parse(event.data);

            //Ext.Msg.alert("1111");

            if(data.type==1){
                if(localStorage.roomno==data.roomno){
                    var content=data.content;
                    var str='<div><marquee  scrollamount=2>'+content+'</marquee></div>';
                    me.getTippanel().setHtml(str);

                }
            }else if(data.type==0){
                //me.getOnlineData(me);
               // me.getPassedData();
                console.log(data);
                me.getOnlineDataUpdate(data.sortcode);
                me.getPassedDataUpdate(data.sortcode);
            }else if(data.type==3){
                localStorage.totaltimes=data.totaltimes;
            }else if(data.type==4){
                localStorage.showlines=data.showlines;
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
                content: '121'
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
        setInterval(function(){
            var scrollheight=listscroll.getSize().y;
            var bodyheight=Ext.getBody().getHeight();
            if((scrollheight-(bodyheight*0.9-40))>=me.scrollinit){//60

                me.scrollinit=me.scrollinit+(bodyheight*0.9-90);
                listscroll.scrollTo(0,me.scrollinit);

            }else{
                me.scrollinit=0;
                listscroll.scrollToTop();
            }



        }, 5000)

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
            Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

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
            Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getbigscreenpasseddata";
        var params = {
            linenos:linenos
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
            Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getbigscreendata";
        var params = {
            linenos:linenos
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
            Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getbigscreendataupdate";
        var params = {
            sortcode:sortcode
        };
        CommonUtil.ajaxSend(params, url, successFunc, failFunc, 'GET');

    },
    makevoiceanddisplay:function(store,index,me){
        var list1=me.getOnlinelist();
        var list2=me.getOnlinelist2();
        var list=null;
        try{
            if(me.playlist.length-1>=index){
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
        if(me.playlist.length-1>=index){
            var item=me.playlist[index];

            item.css='flash';
            store.add(item);
            me.autoscrollData(store,list);
            var text="请"+item.showno+item.patname+" 到"+item.roomname+"号机房门口等候检查";

            me.playvoice(text,store,index,me.makevoiceanddisplay,me);
        }else{
            me.isplaying=false;
            me.playlist=[];
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
            if(!this.tipvoice){
                var voiceurl=localStorage.serverurl+'audio/alert.wav';
                this.tipvoice=new Audio(voiceurl);
            }

        this.tipvoice.play();
        setTimeout(function(){
            me.speaktimes++;
            try{
                navigator.speech.startSpeaking( text , {voice_name: 'xiaoyan'} );
            }catch (e){}
            finally{
                setTimeout(function(){
                    if(me.speaktimes>=localStorage.totaltimes){
                        me.speaktimes=0;
                        callback(store,index+1,me);
                    }else{
                        //tipvoice.removeEventListener('ended',voiceEnd,false);
                        me.playvoice(text,store,index,callback,me)
                    }
                },7000);
            };

        },4000);



    },

    initRender: function () {


        try{
            navigator.speech.startSpeaking( "", {voice_name: 'xiaoyan'} );
        }catch(e){

        }finally{
            if(!localStorage.totaltimes)localStorage.totaltimes=2;
            if(!localStorage.showlines)localStorage.showlines=7;
            this.websocketInit();
            this.getOnlineData(this);
            this.getPassedData();
            this.autoscrollshow();
        }





    }

});