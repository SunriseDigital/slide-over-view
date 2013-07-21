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

			var body = $("body");
			Rect.window.scroll(function(){
				if(!wrap.hasClass('sovHide')){
					wrap.hide();
					wrap.removeClass('sovTransition');
					wrap.addClass('sovNoTransition');
					wrap.addClass('sovHide');
					wrap.removeClass('sovAnimating');
					enableScroll();
					setTimeout(function(){
						wrap.css('transform', 'none');
					}, 0);
				}
			});
			wrap.bind('transitionend webkitTransitionEnd', function(){
				console.log('trasend');
				wrap.toggleClass('sovHide');
				if(wrap.hasClass('sovHide')){
					wrap.removeClass('sovTransition');
					wrap.addClass('sovNoTransition');
					enableScroll();
					wrap.hide();
				}

				wrap.removeClass('sovAnimating');
			});

			view.data('slideOverView', {
				toggle: function(){

					if(wrap.hasClass('sovAnimating')){
						return;
					}

					disableScroll();

					var windowRect = Rect.window.rect();

					wrap
						.width(windowRect.size.width)
						.height(windowRect.size.height);

					wrap.addClass('sovAnimating');

					if(wrap.hasClass('sovHide')){
						wrap.show();
						var startOffset = {top: windowRect.offset.top + windowRect.size.height + 1, left:0};
						wrap.offset(startOffset);

						setTimeout(function(){
							wrap.removeClass('sovNoTransition');
							wrap.addClass('sovTransition');
							setTimeout(function(){
								var targetY = windowRect.size.height + 1;
								wrap.css('transform', 'translateY(-'+ targetY +'px)');
							}, 0);
						}, 100);
					} else {
						wrap.css('transform', 'none');
					}
				}
			});
		});

    }
});

})(jQuery);