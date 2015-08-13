Ext.define('checkScheduling.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        layout:'vbox',

        fullscreen: true,


        items: [
            {
                flex:9,
                layout:'hbox',
                padding:1,
                items:[

                    {

                        flex:2,
                        xtype:'panel',
                        title:'11',
                        layout:'hbox',
                        //layout:'fit',
                        items:[

                            {
                                xtype : 'toolbar',
                                docked: 'top',
                                hidden :false,
                                /*title: {
                                    title: '列&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;表'
                                    /!*docked: 'left',
                                    style: {
                                        'text-align':'left'
                                    }*!/
                                },*/
                                itemId:'neweststatus',
                                items:[
                                    {
                                        xtype:'button',
                                        docked: 'right',
                                        itemId:'settingbtn',
                                        iconCls:'settings'
                                    }
                                ]
                            },
                            {
                                flex:1,
                                layout:'fit',
                                xtype:'panel',
                                //style: 'border-style:solid;',
                                //style: 'background-color: #5E99CC;border-right-style:solid;',
                                style: 'background:red',
                                items:[
                                    /*{
                                        xtype : 'toolbar',
                                        docked: 'top',
                                        hidden :true,
                                        title: {
                                            title: '叫&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号',
                                            docked: 'right',
                                            style: {
                                                'text-align':'right'
                                            }
                                        }

                                    },*/

                                    {
                                        style: 'background-color:lightskyblue',
                                        xtype:'onlinelist'
                                    }


                                ]


                            },
                            {
                                flex:1,
                                layout:'fit',
                                xtype:'panel',
                                //style: 'border-style:solid;', background-color: lightskyblue;
                                style: 'background:red',
                                items:[
                                    /*{
                                     xtype : 'toolbar',
                                     docked: 'top',
                                     hidden :true,
                                     title: {
                                     title: '列&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;表',
                                     docked: 'left',
                                     style: {
                                     'text-align':'left'
                                     }
                                     },
                                     /!*title: '叫 号 列 表',*!/
                                     items:[
                                     {
                                     xtype:'button',
                                     docked: 'right',
                                     itemId:'settingbtn',
                                     iconCls:'settings'
                                     }
                                     ]
                                     },
                                     */
                                    {
                                        style: 'background-color:lightskyblue',
                                        xtype:'onlinelist2'
                                    }


                                ]


                            }
                        ]
                    }
                    ,

                    {
                        flex:1,
                        //layout:'vbox',
                        layout:'fit',
                        //style: 'border-style:solid;',
                        //style: 'background-color: #759E60;',
                        style: 'background-color: #759E60;',
                        xtype:'panel',
                        items:[
                            {
                                xtype : 'toolbar',
                                docked: 'top',
                                itemId:'passedtitle',
                                //title: '<a style="color: red;">过 号 病 人</a>'
                                title: '<a>请以下过号病人到登记处联系</a>'
                            },
                            {
                                xtype:'passednum'/*,
                                //flex:12
                                flex:1*/

                            }
                            /*{
                                itemId:'neweststatus',
                                style:'background-color: #759E60;',
                                html:'',
                                flex:5

                            }*/
                            /*,{

                            }*/
                            ,
                            {
                                xtype : 'toolbar',
                                docked: 'bottom'
                                //itemId:'neweststatus'/*,
                                //html:'<a style="font-size:x-large;color:darkred">请过号病人到登记处与工作人员联系</a>'
                                //title: '<div id="neweststatusmar" style="width: 100%;font-size:x-large"></div>'*/
                            }

                        ]


                    }

                ]
            },
            {
                flex:1,
                padding:1,
                //itemId:'neweststatus',
                itemId:'tip',
                //html:'<div id="neweststatusmartipdiv" style="width:100%;height:100%;font-size:xx-large;vertical-align: middle;"><marquee id="neweststatusmar"  scrollamount=2>' +

                //'</marquee></div>'

                //style: 'background-color:;',
                html:'<div></div>'
            }
        ]
    }
});
