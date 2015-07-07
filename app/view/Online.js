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
            '请<a style="font-weight: 900;">{showno}{patname}</a>到<a style="font-weight: 900;">{roomname}</a>号门口等候',
            '</div>'
        ].join('')
    }
});