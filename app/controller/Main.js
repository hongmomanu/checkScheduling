/**
 * Created by jack on 5/25/15.
 */
/**
 * Created by jack on 14-11-18.
 * main Controller used by Terminal app
 */
Ext.define('checkScheduling.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'Main',
            'Online',
            'PassedNum'
        ],
        requires: [

            'Ext.Toolbar',
            'Ext.field.Text',
            'Ext.data.Store',
            'Ext.dataview.List'
        ],
        models: [

            'Online',
            'PassedNum'


        ],
        stores: [

            'Onlines',
            'PassedNums'


        ],
        control: {
            nav: {
                initialize: 'initRender'

            }

        },
        refs: {

            nav: 'main',
            onlinelist:'onlinelist',
            passednum:'passednum',
            tippanel:'main #tip'

        }
    },


    initRender: function () {






    }

});