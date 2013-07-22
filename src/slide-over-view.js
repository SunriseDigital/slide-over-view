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
				wrap.toggleClass('sovHide');
				if(wrap.hasClass('sovHide')){
					disableTransition(wrap);
					wrap.hide();
				} else {

					op.body.css('visibility', 'hidden');
					wrap.data('sovPrevOffset', wrap.offset());

					disableTransition(wrap, function(){
						op.body.hide().css('visibility', 'visible');
						wrap.offset({top:0, left:0});
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

						op.body.css('visibility', 'hidden').show();

						if(prevOffset){
							moveTo(wrap, prevOffset, function(){
								window.scrollTo(0, wrap.data('sovWindowRect').offset.top);
								op.body.css('visibility', 'visible');
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
