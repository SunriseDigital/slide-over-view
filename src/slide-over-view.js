;(function($){
"use strict";

$.fn.extend({
    slideOverView: function(options){
		return this.each(function(){
			var view = $(this);
			var op = $.extend({}, options);
			var duration = '700ms';

			var wrap = $('<div class="slideOverView"></div>')
				.appendTo('body')
				.hide()
				.css({
					position : 'absolute',
					overflow: 'auto',
					transitionDuration: duration,
					transitionDelay: 0,
					transitionTimingFunction: 'liner',
					left: '0',
					zIndex: '9999'
				})
				;

			view
				.appendTo(wrap)
				.addClass('sovHide')
				.width('100%')
				;

			var body = $("body");
			wrap.bind('transitionend webkitTransitionEnd', function(){
				view.toggleClass('sovHide sovShow sovAnimating');
				if(view.hasClass('sovHide')){
					wrap.hide();
				} else {
					op.body.hide();
				}
			});

			view.data('slideOverView', {
				toggle: function(){
					if(view.hasClass('sovAnimating')){
						return;
					}

					var windowRect = Rect.window.rect();

					wrap
						.width(windowRect.size.width)
						.height(windowRect.size.height);

					view.addClass('sovAnimating');

					var startY = windowRect.size.height + 1;

					if(view.hasClass('sovHide')){
						// wrap.css('transition-duration', 0);
						setTimeout(function(){
							wrap.show();
							wrap.css('top', startY + 'px');
							setTimeout(function(){
								wrap.css('transform', 'translateY(-'+ startY +'px)');
							}, 100);
						}, 0);
					} else {
						op.body.show();
						wrap.css('transform', 'none');
					}
				}
			});
		});

    }
});

})(jQuery);