Ext.define('checkScheduling.view.Online', {
    extend: 'Ext.List',
    //extend: 'Ext.DataView',
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

        itemTpl: new Ext.XTemplate([
            '<div class="{css}">',
           // '请<a style="font-weight: 900;">{showno}{patname}</a>到<a style="font-weight: 900;">{roomname}</a>门口等候',
            '<a style="font-weight: 900;">{showno}  {[this.nameFormat(values)]}</a>  <a style="font-weight: 900;">{[this.roomFormat(values)]}</a>',
            '</div>'
        ].join(''),
            {
                roomFormat:function(values){
                    var re=/\d+/g;
                    var roomname=values.roomname;
                    var numstr=roomname.match(re);
                    if(numstr&&numstr.length>0){
                        var tempstr="&nbsp;&nbsp;";
                        var numstrsigle=numstr[0];
                        var numchange="";
                        if(numstrsigle.length==1){
                            //numchange=tempstr+numstrsigle;
                            numchange=tempstr+numstrsigle;
                            console.log(roomname.replace(numstrsigle,numchange));
                            return roomname.replace(numstrsigle,numchange)
                        }else{
                            return roomname
                        }


                    }else{
                        return roomname
                    }

                },
                nameFormat:function(values){

                var tempstr="&nbsp;";
                var repeatFun=function(str,len){
                    var result="";
                    for(var i=0;i<len;i++){
                        result+=str;
                    }
                    return result;

                };

                var leftlen=(4-values.patname.length);
                if(leftlen==2)return (repeatFun(tempstr,2)+values.patname[0]+repeatFun(tempstr,4)+values.patname[1]+repeatFun(tempstr,2));
                else if(leftlen==1)return (repeatFun(tempstr,2)+values.patname+repeatFun(tempstr,2));
                else return values.patname;
               /* var repeatFun=function(str,len){
                    var result="";
                    for(var i=0;i<len;i++){
                        result+=str;
                    }
                    return result;

                };
               /!* var str="&nbsp;&nbsp;&nbsp;&nbsp;";
                var leftlen=(4-values.patname.length);

                console.log((values.patname+str.repeat(leftlen)).length);

                return (values.patname+str.repeat(leftlen));*!/
                var tempstr="&nbsp;&nbsp;&nbsp;&nbsp;";
                var result="";
                var leftlen=(4-values.patname.length);

                if(leftlen==0)return values.patname;
                else{
                    for(var i=0;i<values.patname.length;i++){
                        result+=values.patname[i];
                        if(i<(values.patname.length-1))result+=repeatFun(tempstr,leftlen);
                    }
                    return result;
                }*/

            }}
        )
    }
});