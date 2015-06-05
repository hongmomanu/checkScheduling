Ext.define('checkScheduling.view.Online2', {
    extend: 'Ext.List',
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
            '请{showno}{patname} 到{roomname}号机房门口等候检查',
            '</div>'
        ].join('')
    }
});