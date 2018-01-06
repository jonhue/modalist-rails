(function($) {
    var Modalist = new function(options) {

        var defaults = {
            iziModal: {}
        };
        options = $.extend( defaults, options );

        this.modal = $('#modalist');
        this.iziModal = $(Modalist.modal).iziModal(options.iziModal);

        $('.modalist--trigger').unbind('click');
        $('.modalist--trigger').click(function(event) {

            event.preventDefault();

            var event = jQuery.Event('modalist:click'),
                url = $(this).data('modalist-url') || $(this).attr('href'),
                form = $(this).data('modalist-form') || false,
                fullScreen = $(this).data('modalist-full-screen');

            event.target = $(this);
            event.data = { url: url };
            $(document).trigger(event);

            Modalist.reset();
            Modalist.fullScreen(fullScreen);
            Modalist.load( url, form );

        });

        this.open = function(options) {

            var defaults = {
                url: null,
                form: false,
                fullScreen: false
            };
            options = $.extend( defaults, options );

            Modalist.reset();
            Modalist.fullScreen(options.fullScreen);
            Modalist.load( options.url, options.form );

        };

        this.close = function() {
            $(Modalist.modal).iziModal('close');
        };

        this.reset = function() {
            $(Modalist.modal).iziModal('setTransitionIn', 'comingIn');
            $(Modalist.modal).iziModal('setTransitionOut', 'comingOut');
            $(Modalist.modal).data('full-screen', false);
            $(Modalist.modal).iziModal('setTop', 'auto');
            $(Modalist.modal).iziModal('setBottom', 'auto');
        };

        this.fullScreen = function(fullScreen) {
            if ( fullScreen == 'true' || ( fullScreen == 'mobile' && $(window).width() <= 800 ) ) {
                $(Modalist.modal).iziModal('setTransitionIn', 'fadeInRight');
                $(Modalist.modal).iziModal('setTransitionOut', 'fadeOutRight');
                $(Modalist.modal).data('full-screen', true);
            };
        };

        this.load = function( url, options ) {

            var defaults = {
                form: false
            };
            options = $.extend( defaults, options );

            $(document).trigger('modalist:request-start');

            if (options.form) {
                $.ajax({
                    url: $(options.form).attr('action'),
                    type: 'GET',
                    data : $(options.form).serialize(),
                    success: function(data) {
                        $(document).trigger('modalist:request-end');
                        Modalist.data(data);
                    }
                });
            } else {
                $.get( url, function(data) {
                    $(document).trigger('modalist:request-end');
                    Modalist.data(data);
                });
            };

        };

        this.data = function(data) {

            $(document).trigger('modalist:before-render');
            $(Modalist.modal).find('.iziModal-content').html(data);
            $(document).trigger('modal:render');

            $(Modalist.modal).iziModal('open');
            if ( $(Modalist.modal).height() + 60 > $(window).height() ) {
                $(Modalist.modal).iziModal('setTop', 30);
                $(Modalist.modal).iziModal('setBottom', 30);
            };
            $(document).trigger('modalist:load');

        };

    };
})(jQuery);
