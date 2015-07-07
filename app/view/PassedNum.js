Ext.define('checkScheduling.view.PassedNum', {
    extend: 'Ext.DataView',
    xtype:'passednum',
    requires: [

    ],

    config: {
        store: 'PassedNums',
        itemId:'passednum',
        emptyText: '<div>无相关内容</div>',
        cls:'columnlist3',
        itemTpl: [
            '<div class="',
            '<tpl if="css">',
            'removepassed',
            '<tpl else>',
            'passedcommon',
            '</tpl>',
            '" >',
            //'<div style="padding:4px;vertical-align: middle;text-align: center;display: inline-block;width: 30px;height: 30px;border: 1px solid red;border-radius: 15px;background-color: dodgerblue;">{num}</div>',
            '<div class="description" style="padding:4px;display: inline-block;text-align: center;vertical-align: middle;">{showno}</div><br>',
            '<div class="description" style="padding:4px;display: inline-block;text-align: center;vertical-align: middle;">{patname}</div>',
            '</div>'
        ].join("")
    }
});