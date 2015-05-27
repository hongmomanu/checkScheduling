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
                padding:10,
                items:[

                    {
                        flex:1,
                        layout:'fit',
                        //style: 'border-style:solid;',
                        //style: 'background-color: #5E99CC;border-right-style:solid;',
                        items:[
                            {
                                xtype : 'toolbar',
                                docked: 'top',
                                title: '叫 号 列 表',
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
                                xtype:'onlinelist'
                            }


                        ]


                    },
                    {
                        flex:1,
                        layout:'fit',
                        //style: 'border-style:solid;',
                        style: 'background-color: #759E60;',
                        xtype:'panel',
                        items:[
                            {
                                xtype : 'toolbar',
                                docked: 'top',
                                title: '过 号 病 人'
                            },
                            {
                                xtype:'passednum'

                            }

                        ]


                    }

                ]
            },
            {
                flex:1,
                padding:10,
                itemId:'tip',

                //style: 'background-color:;',
                html:'<div><marquee  scrollamount=2>温馨提示：（滚动播放，内容可被修改）温馨提示：（滚动播放，内容可被修改）温馨提示：（滚动播放，内容可被修改）</marquee></div>'
            }
        ]
    }
});
