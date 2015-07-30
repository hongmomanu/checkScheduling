Ext.define('checkScheduling.view.Online2', {
    extend: 'Ext.List',
    //extend: 'Ext.DataView',
    //alias: 'widget.doctors',
    xtype:'onlinelist2',
    //cls: 'x-contacts',
    config: {

        variableHeights: true,
        itemId:'onlinelist2',
        emptyText: '<div>无相关内容</div>',


        //refreshHeightOnUpdate :false,
        scrollToTopOnRefresh :true,
        //grouped:true,
        //indexBar:true,
        store: 'Onlines2',

        /*listeners: {
            painted: function(){

                this.fireEvent('viewshow', this);
            }
        },*/

        /*items: [


        ],*/

        itemTpl: [
            '<div class="{css}">',
            //'请<a style="font-weight: 900;">{showno}{patname}</a>到<a style="font-weight: 900;">{roomname}</a>门口等候',
            '<a style="font-weight: 900;">{showno}{patname}</a> <a style="font-weight: 900;">{roomname}</a>',
            '</div>'
        ].join('')
    }
});