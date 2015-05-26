Ext.define('checkScheduling.view.Online', {
    extend: 'Ext.List',
    //alias: 'widget.doctors',
    xtype:'onlinelist',
    //cls: 'x-contacts',
    config: {
        //title: '医生圈',
        //cls: 'x-contacts',
        variableHeights: true,
        itemId:'onlinelist',

        //refreshHeightOnUpdate :false,
        scrollToTopOnRefresh :true,
        //grouped:true,
        //indexBar:true,
        store: 'Onlines',

        listeners: {
            painted: function(){

                this.fireEvent('viewshow', this);
            }
        },

        items: [


        ],

        itemTpl: [
            '<div class="headshot">',
            '请{showno}{patname} 到{roomno}号机房门口等候检查',
            '</div>'
        ].join('')
    }
});