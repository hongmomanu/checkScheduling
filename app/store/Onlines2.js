Ext.define('checkScheduling.store.Onlines2', {
    extend: 'Ext.data.Store',
    config: {
        model: 'checkScheduling.model.Online2',
        autoLoad: false
        //sorters: '_id',
        /*grouper: {
            groupFn: function(record) {
                return record.get('userinfo').sectionname;
            }
        },*/

    }
});
