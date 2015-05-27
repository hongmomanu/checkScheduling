/*公共类*/

Ext.define('CommonUtil', {
    statics: {
        loadmask:null,
        /*为Ext.Viewport添加一个消息提示组件*/
        addMessage: function () {
            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                cls: 'message',
                transparent: true,
                indicator: false
            });
            this.hideMessage();
        },
        /*显示一个消息提示*/
        showMessage: function (mes, autoHide) {
            var me = this, message = this.getMessage();
            message.setMessage(mes);
            message.show();
            //是否自动关闭提示
            if (autoHide) {
                setTimeout(function () {
                    message.hide();
                },
                500);
            }
        },

        /*隐藏消息提示*/
        hideMessage: function () {
            this.getMessage().hide();
        },
        //消息组件
        getMessage: function () {
            return Ext.Viewport.getMasked();
        },
        //验证模型
        valid: function (model, from) {
            var tmpModel = Ext.create(model),
            me = this,
            errors, valid;
            from.updateRecord(tmpModel);
            errors = tmpModel.validate();
            valid = errors.isValid();
            if (!valid) {
                errors.each(function (err) {
                    me.showMessage(err.getMessage(), true);
                    return;
                });
            }
            return valid;
        },
        soapCommon:function(url,funcname,xmlns,fields,successFunc,failFunc){
            var str_head='<?xml version="1.0" encoding="utf-8"?>'+
                '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'
                +'<soap12:Body>';

            var funcname_head='<'+funcname+ ' xmlns="'+xmlns+(fields.length==0?'"/>':'">');

            var content_str='';

            for(var i=0;i<fields.length;i++ ){
                content_str+='<'+fields[i].name+'>'+fields[i].value+'</'+fields[i].name+'>';
            }


            var funcname_tail=(fields.length==0?'':'</'+funcname+'>');


            var str_tail='</soap12:Body></soap12:Envelope>';


            var content=str_head+funcname_head+content_str+funcname_tail+str_tail;


            var item={};

            item.url=url;


            item.content=content;
            //Ext.Msg.alert("提示信息","2");

            this.ajaxSend(item, 'hospital/sendsoap', successFunc, failFunc, "post");


        },
        csape_all_xmlstr:function (content) {
            return content.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        },


        ajaxSend: function (params, url, sucFun, failFunc, method) {
            var me = this;
            /*if(!me.loadmask)me.loadmask=new Ext.LoadMask(Ext.getBody(), {msg:"加载中..."});
            me.loadmask.show();*/
            Ext.Ajax.request({
                url: localStorage.serverurl + url,
                method: method,
                timeout: 5000,//default 5000 milliseconds
                params: params,
                success: sucFun,
                failure: failFunc/*,
                callback:function(){
                    me.loadmask.hide();
                }*/
            });

        }
    }
});