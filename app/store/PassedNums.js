Ext.define('checkScheduling.store.PassedNums', {
    extend: 'Ext.data.Store',
    config: {
        model: 'checkScheduling.model.PassedNum',
        autoLoad: true
        //sorters: '_id',
        /*grouper: {
            groupFn: function(record) {
                return record.get('userinfo').sectionname;
            }
        },*/

    }
});
