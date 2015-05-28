Ext.define('checkScheduling.view.Online', {
    extend: 'Ext.List',
    //alias: 'widget.doctors',
    xtype:'onlinelist',
    //cls: 'x-contacts',
    config: {

        variableHeights: true,
        itemId:'onlinelist',
        emptyText: '<div>无相关内容</div>',


        //refreshHeightOnUpdate :false,
        scrollToTopOnRefresh :true,
        //grouped:true,
        //indexBar:true,
        store: 'Onlines',

        /*listeners: {
            painted: function(){

                this.fireEvent('viewshow', this);
            }
        },*/

        /*items: [


        ],*/

        itemTpl: [
            '<div class="{css}">',
            '请{showno}{patname} 到{roomno}号机房门口等候检查',
            '</div>'
        ].join('')
    }
});