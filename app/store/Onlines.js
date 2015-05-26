Ext.define('checkScheduling.store.Onlines', {
    extend: 'Ext.data.Store',
    config: {
        model: 'checkScheduling.model.Online',
        autoLoad: true
        //sorters: '_id',
        /*grouper: {
            groupFn: function(record) {
                return record.get('userinfo').sectionname;
            }
        },*/

    }
});
