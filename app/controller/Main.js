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
            'PassedNum'


        ],
        stores: [

            'Onlines',
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
            passednum:'passednum',
            tippanel:'main #tip',
            settingbtn:'main #settingbtn'

        }
    },


    showSettingForm:function(item){
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
            height: 120,

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


            console.log(data);

            me.getOnlineData(me);
            me.getPassedData();

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
            if((scrollheight-(bodyheight*0.9-60))>=me.scrollinit){

                me.scrollinit=me.scrollinit+(bodyheight*0.9-90);
                listscroll.scrollTo(0,me.scrollinit);

            }else{
                me.scrollinit=0;
                listscroll.scrollToTop();
            }



        }, 5000)

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
                    console.log("hahah");
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
    makevoiceanddisplay:function(store,index,me){
        //console.log(1)
        /*var a=Ext.select('.flash');
        a.removeCls('flash');*/
        if(store.data.items.length>0){
            var num=store.data.items.length-1;
            var raw=store.data.items[num].raw;
            raw.css='noflash';
            store.data.items[num].set(raw);
            me.removePassed(store.data.items[num],num);

        }
        if(me.playlist.length-1>=index){
            var item=me.playlist[index];

            item.css='flash';
            store.add(item);
            var text="请"+item.showno+item.patname+" 到"+item.roomno+"号机房门口等候检查";

            me.playvoice(text,store,index,me.makevoiceanddisplay,me);
        }else{
            me.isplaying=false;
            me.playlist=[];
            /*navigator.speech.removeEventListener("SpeakCompleted",function(){});
            navigator.speech.stopSpeaking();*/
        }



    },
    speaktimes:0,

    playvoice:function(text,store,index,callback,me){

        //callback(store,index,me);

            var voiceurl=localStorage.serverurl+'audio/alert.wav';
            var tipvoice=new Audio(voiceurl);


            tipvoice.addEventListener('ended',function(){
                me.speaktimes++;
                try{
                    navigator.speech.startSpeaking( text , {voice_name: 'xiaoyan'} );
                }catch (e){}
                finally{
                    setTimeout(function(){
                        if(me.speaktimes==2){
                            me.speaktimes=0;
                            callback(store,index+1,me);
                        }else{
                            tipvoice.play()
                        }
                    },7000)
                }




            });
            tipvoice.play();


    },

    initRender: function () {



        //navigator.speech.startSpeaking( "社保卡", {voice_name: 'xiaoyan'} );
        this.websocketInit();
        this.getOnlineData(this);
        this.getPassedData();
        this.autoscrollshow();




    }

});