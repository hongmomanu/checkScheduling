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

            me.getOnlineData();

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

    getOnlineData:function(){

        var me=this;

        var store=this.getOnlinelist().getStore();
        //testobj=store;
        var sortno= 0;
        if(store.data.items.length>0){

        }else{
            sortno=0;
        }

        var successFunc = function (response, action) {
            var res=JSON.parse(response.responseText);
            if(!me.isplaying)me.playlist=[];
            if(res.length>0){



                if(me.isplaying){
                    me.playlist=me.playlist.concat(res);
                }else{
                    me.playlist=res;
                    me.isplaying=true;
                    //Ext.Msg.alert(12);
                    me.makevoiceanddisplay(store,0,me);
                }

            }

            //console.log(res);
            /*for(var i=0;i<res.length;i++){
                //console.log(res[i]);
                /!*if()
                store.add(res[i]);
                me.playlist.push(res[i]);*!/
            }*/
            //if(res.length>0&&!me.isplaying)me.playvoice();
            //store.addData(res);

        };
        var failFunc = function (response, action) {
            Ext.Msg.alert('获取数据失败', '服务器连接异常，请稍后再试', Ext.emptyFn);

        };
        var url = "getbigscreendata";
        var params = {
            sortno:sortno
        };
        CommonUtil.ajaxSend(params, url, successFunc, failFunc, 'GET');

    },
    makevoiceanddisplay:function(store,index,me){
        //var me=this;
         //Ext.Msg.alert("1");
        //var data =me.playlist;
        if(me.playlist.length-1>=index){

            var item=me.playlist[index];

            var indexnum=index;
            if(item.times>=2)return;
            //Ext.Msg.alert("2");

            if(item.times==undefined){
                if(store.data.items.length==9){
                    store.removeAt(0);
                }

                store.add(item);
                item.times=1;
            }
            else {
                item.times=item.times+1;
            }
            if(item.times==2){
                indexnum=indexnum+1;
            }


            var text="请"+item.showno+item.patname+" 到"+item.roomno+"号机房门口等候检查";

            me.playvoice(text,store,indexnum,me.makevoiceanddisplay,me);
        }else{
            me.isplaying=false;
        }



    },
    playvoice:function(text,store,index,callback,me){
        var voiceurl=localStorage.serverurl+'audio/alert.mp3';
        var tipvoice=new Audio(voiceurl);
        tipvoice.addEventListener('ended',function(){

            TTS.speak({
                text: text,
                locale: 'zh-CN'/*,
                 rate: 0.75*/
            }, function(){
                callback(store,index,me)
            }, function (reason) {
                Ext.Msg.alert('fail',reason);
            });


        });
        tipvoice.play();
        //var me=this;



    },

    initRender: function () {

        //this.playvoice();
        this.websocketInit();
        this.getOnlineData();




    }

});