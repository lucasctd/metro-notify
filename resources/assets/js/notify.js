function notNull(obj){
	return (obj !== undefined && typeof obj != 'undefined' && obj !== null);
}

function Notify(){
    var notify = {
        width: 300,
        height: 120,
        CONFIRM_WIDTH: 900,
        CONFIRM_MIN_WIDTH: 300,
        TYPE_INFO: 1, //depraceted, will be removed soon
        TYPE_WARNING: 2, //depraceted, will be removed soon
        TYPE_ERROR: 3, //depraceted, will be removed soon
        INFO: 1,
        WARNING: 2,
        ERROR: 3,
        LEFT: 0,
        RIGHT: 1,
        POS_LEFT: 0,//depraceted, will be removed soon
        POS_RIGHT: 1,//depraceted, will be removed soon
        RIGHT_QUEUE: [],
        LEFT_QUEUE: [],
        show: function (title, message, options){
            var element = null, container = null;
            if(!notNull(options)) {
                options = {};
            }
            if(!notNull(options.position)){
                options.position = this.RIGHT;
            }
            if(!notNull(options.type)){
                options.type = this.INFO;
            }
            var result = this.build(title, message, options.position, options.time);
            element = result.element;
            container = result.container;
            if(options.position == this.RIGHT){
                $(element).find(".closeNotify").css("left","10px");
                $(element).addClass("notifyRightRadius");
                $(element).css({'display':'block'}).animate({'left':'-=300px'}, 700);
                this.RIGHT_QUEUE.push(container);
            }else{//this.LEFT
                $(element).find(".closeNotify").css("left","265px");
                $(element).addClass("notifyLeftRadius");
                $(element).css({'display':'block'}).animate({'left':'+=280px'}, 700);
                this.LEFT_QUEUE.push(container);
            }
            switch (Number(options.type)) {
                case notify.INFO:
                    $(element).css("background-color", "#1B58B8");
                    break;
                case notify.WARNING:
                    $(element).css({"background-color": "#EEB422"});
                    break;
                case notify.ERROR:
                    $(element).css("background-color", "#CD3333");
                    break;
            }
            $(window).resize(function() {
                notify.reposition();
            });
        },
        reposition: function(){
            for(var x = 0; x < notify.RIGHT_QUEUE.length; x++){
                $(notify.RIGHT_QUEUE[x]).css({left: (window.innerWidth - notify.width) + "px"});
            }
        },
        build: function(title, message, position, time){
            var element = null, container = null, index = null, eventName = null, id = null;
            if(position == this.RIGHT){
                index = this.RIGHT_QUEUE.length;
                id = new Date().getTime();
                $("body").append('<div id="notifyRContainer'+id+'" class="_notifyContainer" style="left:'+(window.innerWidth - this.width)+'px; top:'+(index === 0 ? 5 : index*this.height + 8 * index)+'px;"/>');
                $('#notifyRContainer'+id).append('<div id="notify_R'+id+'" class="_notify" />');
                element = "#notify_R"+id;
                container = '#notifyRContainer'+id;
            }else{//it is LEFT
                index = this.LEFT_QUEUE.length;
                id = new Date().getTime();
                $("body").append('<div id="notifyLContainer'+id+'" class="_notifyContainer" style="left:0px; top:'+(index === 0 ? 5 : index*this.height + 8 * index)+'px;"/>');
                $('#notifyLContainer'+id).append('<div id="notify_L'+id+'" class="_notify" style="left: -100%;"/>');
                element = "#notify_L"+id;
                container = '#notifyLContainer'+id;
            }
            $(element).append("<div id='notifyTextBox' class='notifyTextBox'> <p id='notifyTitle' class='notifyTitle bold ft12 txtcenter'></p> "+
                "<p id='notifyMessage' class='txtjustify notifyMessage ft11' style='z-index:499;'></p> </div>");
            $(element).append("<div id='closeNotify' style='z-index:500;' class='closeNotify handCursor' title='Close' alt='Close'/>");
            $(element).find(".notifyTitle").text(title);
            $(element).find(".notifyMessage").html(message);
            $(element).find(".notifyTextBox").scrollTop(0);
            eventName = element.substring(1)+"_closeNotifyEvent";
            $(element).find("#closeNotify").on("click", function(){
                var def = $.Deferred();
                $(document).trigger(eventName, [ position, element, container] );
            });
            this.closeListener(eventName);
            if(time && time > 0){
                time*=1000;
                var def = $.Deferred();
                setTimeout(function (){$(document).trigger(eventName, [ position, element, container] );}, time);
            }
            return {element: element, container: container};
        },
        closeListener: function(eventName){
            $(document).on(eventName, function (e, position, element, container){
                var ind = null;
                if(position == notify.RIGHT){
                    $(element).animate({'left':'+=320px'}, 500, function (){
                        ind =  notify.RIGHT_QUEUE.indexOf(container);
                        notify.RIGHT_QUEUE.splice(ind, 1);
                        notify.updateOthersPosition(notify.RIGHT_QUEUE);
                        $(container).remove();
                        $(element).remove();
                    });
                }else{
                    $(element).animate({'left':'-=320px'}, 500, function (){
                        ind = notify.LEFT_QUEUE.indexOf(container);
                        notify.LEFT_QUEUE.splice(ind, 1);
                        notify.updateOthersPosition(notify.LEFT_QUEUE);
                        $(container).remove();
                        $(element).remove();
                    });
                }
            });
        },
        updateOthersPosition: function(queue){
            for(var x = 0; x< queue.length; x++){
                $(queue[x]).animate({"top": (x === 0 ? 5 : x*this.height + 8 * x)}, 500);
            }
        },
        confirmDialog: function (title, message, options){
            var confirmId = null;
            if(!notNull(options)){
                options = {};
            }
            if(!$("#metroUIConfirmD").length){
                $("body").append("<div id='metroUIConfirmD' class='notiConfirmDialog displayNone'></div>");
                $("body").append("<div id='metroUIConfirmModal' class='notiConfirmDialogModal displayNone'></div>");
            }else{
                $("#metroUIConfirmD").fadeIn("fast");
            }
            confirmId = $("#metroUIConfirmD");
            confirmId.empty();
            confirmId.append("<h1></h1> <div class='notiTxtConfirmation'><p></p></div>");
            confirmId.find("h1").html(title);
            confirmId.find("p").html(message);
            if(notNull(options.buttons)){
                $(options.buttons).each(function(i, e) {
                    confirmId.append("<button id='"+e.id+"' class='notiButton'>"+e.value+"</button>");
                    $("#"+e.id).on("click", function () {
                        if(e.callback !== undefined && e.callback !== null){
                            e.callback();
                        }
                        if(e.hide){
                            notify.confirmDialogHide();
                        }
                    });
                });
            }else{
                confirmId.append("<button id='notiBtCancel' class='notiButton'>Cancel</button>");
                confirmId.append("<button id='notiBtOK' class='notiButton'>OK</button>");
                $("#notiBtOK").on("click", function () {
                    if(options.callback !== undefined){
                        options.callback(true);
                    }
                    notify.confirmDialogHide();
                });
                $("#notiBtCancel").on("click", function () {
                    if(options.callback !== undefined){
                        options.callback(false);
                    }
                    notify.confirmDialogHide();
                });
            }
            $(window).resize(function (){
                notify.repositionConfirmDialog(confirmId);
            });
            this.repositionConfirmDialog(confirmId);
            if(options.modal !== false){
                $("#metroUIConfirmModal").fadeIn("fast");
            }
            confirmId.fadeIn("fast");
        },
        repositionConfirmDialog: function (confirmId){
            var left = window.innerWidth / 2 - confirmId.width() / 2;
            var top = window.innerHeight / 2 - confirmId.height() / 2;
            if(window.innerWidth < notify.CONFIRM_WIDTH && window.innerWidth > notify.CONFIRM_MIN_WIDTH){
                confirmId.css({width: window.innerWidth + "px"});
            }
            confirmId.css({top: top + "px", left: left + "px"});
        },
        confirmDialogHide: function (){
            $("#metroUIConfirmD").fadeOut("slow");
            $("#metroUIConfirmModal").fadeOut("slow");
        }
    };
    return notify;
}

//adding CommonJS Support
module.exports = Notify;
