;(function($){
"use strict";

$.fn.extend({
    slideOverView: function(options){
		return this.each(function(){
			var view = $(this);
			var op = $.extend({}, options);

			var wrap = $('<div class="slideOverView"></div>')
				.appendTo('body')
				.hide()
				.css({
					position : 'absolute',
					overflow: 'auto',
					transitionProperty: 'top',
					transitionDelay: 0,
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
			var duration = '1s';
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

					if(view.hasClass('sovHide')){
						wrap.css('transition-duration', 0);
						setTimeout(function(){
							wrap.css('top', windowRect.offset.top + windowRect.size.height + 1 +'px');
							wrap.show();
							wrap.css('transition-duration', duration);
							setTimeout(function(){
								wrap.css('top', windowRect.offset.top + "px");
							}, 0);
						}, 0);
					} else {
						op.body.show();
						wrap.css('top', windowRect.offset.top + windowRect.size.height + 1 +'px');
					}
				}
			});
		});

    }
});

})(jQuery);