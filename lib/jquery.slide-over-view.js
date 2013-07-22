/*! slide-over-view 2013-07-22 13:57 */
;(function($){
"use strict";

window.Rect = function(width, height, top, left){
    if(top === undefined)
    {
        top = 0;
    }

    if(left === undefined)
    {
        left = 0;
    }

    this.size = {width: width, height: height};
    this.offset = {top: top, left: left};
};

//static
Rect.window = $(window);
Rect.document = $(document);

//instance member
Rect.prototype.center = function(){
    return {top: this.offset.top + this.size.height / 2, left: this.offset.left + this.size.width / 2};
};

Rect.prototype.contains = function(rect){
    return (
        rect.offset.top >= this.offset.top &&
        rect.offset.left >= this.offset.left &&
        (rect.offset.top + rect.size.height) <= (this.offset.top + this.size.height) &&
        (rect.offset.left + rect.size.width) <= (this.offset.left + this.size.width)
    );
};

Rect.prototype.intersects = function(rect){
    var startLeft = Math.max(this.offset.left, rect.offset.left);
    var startTop = Math.max(this.offset.top, rect.offset.top);
    var endLeft = Math.min(this.offset.left + this.size.width, rect.offset.left + rect.size.width);
    var endTop = Math.min(this.offset.top + this.size.height, rect.offset.top + rect.size.height);

    var width = endLeft - startLeft;
    var height = endTop - startTop;
    if (width > 0 && height > 0) {
        return new Rect(width, height, startTop, startLeft);
    } else {
        return false;
    }
};

Rect.prototype.equals = function(rect){
    return (
        rect.offset.top === this.offset.top &&
        rect.offset.left === this.offset.left &&
        rect.size.height === this.size.height &&
        rect.size.width === this.size.width
    );
};

$.fn.extend({
    rect: function(rect){
        if(rect !== undefined) //setter
        {
            return this.each(function(){
                var elem = $(this);
                elem.offset(rect.offset);
                elem.outerWidth(rect.size.width);
                elem.outerHeight(rect.size.height);
            });
        }
        else
        {
            if($.isWindow(this.get(0))) //is window
            {
                return new Rect(window.innerWidth, window.innerHeight, Rect.window.scrollTop(), Rect.window.scrollLeft());
            }
            else
            {
                var offset = this.offset();
                if(offset) //is normal element
                {
                    return new Rect(this.outerWidth(), this.outerHeight(), offset.top, offset.left);
                }
                else //is document
                {
                    var height = Math.max(
                        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
                        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
                        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
                    );

                    var width = Math.max(
                        Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                        Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
                        Math.max(document.body.clientWidth, document.documentElement.clientWidth)
                    );

                    return new Rect(width, height);
                }
            }
        }
    },
    center: function(offset){
        if(offset !== undefined) //setter
        {
            return this.each(function(){
                var elem = $(this);
                var newOffset = {top:offset.top - elem.outerHeight() / 2, left:offset.left - elem.outerWidth() / 2};
                elem.offset(newOffset);
            });
        }
        else
        {
            return this.rect().center();
        }
    }
});

})(jQuery);
;(function($){
"use strict";

function disableScroll(){
	var body = $('body');

	body.css('overflow', 'hidden');

	body.bind('touchmove', function(e){
		e.preventDefault();
		return false;
	});
}

function enableScroll(){
	var body = $('body');

	body.css('overflow', 'auto');

	body.unbind('touchmove');
}

function disableTransition(elem, callback){
	elem.removeClass('sovTransition');
	elem.addClass('sovNoTransition');
	if(callback){
		setTimeout(callback, 0);
	}
}

function enableTransition(elem, callback){
	elem.removeClass('sovNoTransition');
	elem.addClass('sovTransition');
	if(callback){
		setTimeout(callback, 0);
	}
}

function moveTo(elem, offset, callback){
	elem.offset(offset);
	if(callback){
		setTimeout(callback, 10);
	}
}

$.fn.extend({
    slideOverView: function(options){
		return this.each(function(){
			var view = $(this);
			var op = $.extend({}, options);

			var wrap = $('<div class="sovWrapper sovHide sovNoTransition"></div>')
				.appendTo('body')
				.hide()
				;

			view
				.appendTo(wrap)
				.width('100%')
				;

			wrap.bind('transitionend webkitTransitionEnd', function(){
				console.log('trasend');
				wrap.toggleClass('sovHide');
				if(wrap.hasClass('sovHide')){
					disableTransition(wrap);
					wrap.hide();
				} else {
					wrap.data('sovPrevOffset', wrap.offset());

					disableTransition(wrap, function(){
						op.body.hide();
						wrap.offset({top:0, left:0});
						//Rect.window.scrollTop(0);
						window.scrollTo(0,1);
					});
				}

				wrap.removeClass('sovAnimating');
			});

			view.data('slideOverView', {
				toggle: function(){

					if(wrap.hasClass('sovAnimating')){
						return;
					}

					wrap.width('100%');
					wrap.addClass('sovAnimating');

					if(wrap.hasClass('sovHide')){
						var windowRect = Rect.window.rect();

						wrap
							.height(windowRect.size.height)
							.data('sovWindowRect', windowRect)
							.show();

						var startOffset = {top: windowRect.offset.top + windowRect.size.height + 1, left:0};
						moveTo(wrap, startOffset, function(){
							enableTransition(wrap, function(){
								var targetY = windowRect.size.height + 1;
								wrap.css('transform', 'translateY(-'+ targetY +'px)');
							});
						});
					} else {
						var prevOffset = wrap.data('sovPrevOffset');

						op.body.show();

						if(prevOffset){
							moveTo(wrap, prevOffset, function(){
								Rect.window.scrollTop(wrap.data('sovWindowRect').offset.top);
								enableTransition(wrap, function(){
									wrap.css('transform', 'none');
								});
							});
						}
					}
				}
			});
		});

    }
});

})(jQuery);