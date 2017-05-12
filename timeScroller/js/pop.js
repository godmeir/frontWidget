/*************************************************************************************************/
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

	'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

	function classReg( className ) {
		return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;

	if ( 'classList' in document.documentElement ) {
		hasClass = function( elem, c ) {
			return elem.classList.contains( c );
		};
		addClass = function( elem, c ) {
			elem.classList.add( c );
		};
		removeClass = function( elem, c ) {
			elem.classList.remove( c );
		};
	}
	else {
		hasClass = function( elem, c ) {
			return classReg( c ).test( elem.className );
		};
		addClass = function( elem, c ) {
			if ( !hasClass( elem, c ) ) {
				elem.className = elem.className + ' ' + c;
			}
		};
		removeClass = function( elem, c ) {
			elem.className = elem.className.replace( classReg( c ), ' ' );
		};
	}

	function toggleClass( elem, c ) {
		var fn = hasClass( elem, c ) ? removeClass : addClass;
		fn( elem, c );
	}

	var classie = {
		// full names
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		// short names
		has: hasClass,
		add: addClass,
		remove: removeClass,
		toggle: toggleClass
	};

// transport
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( classie );
	} else {
		// browser global
		window.classie = classie;
	}

})( window );   

(function() {
	var triggerBttn = document.getElementById( 'trigger-overlay' ),
		overlay = document.querySelector( 'div.overlay' ),
		closeBttn = overlay.querySelector( 'div.overlay-close' ),

		triggerBttnSEC = document.getElementById( 'triggerSEC-overlay' ),
		overlaySEC = document.querySelector( 'div.overlaySEC' ),
		closeBttnSEC = overlaySEC.querySelector( 'div.overlaySEC-close' ),

		triggerBttnThr = document.getElementById( 'triggerThr-overlay' ),
		overlayThr = document.querySelector( 'div.overlayThr' ),
		closeBttnThr = overlayThr.querySelector( 'div.overlayThr-close' );

		triggerBttn.tag = 1;
		triggerBttnSEC.tag = 2;
		triggerBttnThr.tag = 3;

	transEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'msTransition': 'MSTransitionEnd',
		'transition': 'transitionend'
	},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = { transitions : Modernizr.csstransitions };

	function toggleOverlay() {
		if (this.tag == 1) {
				if( !classie.has( overlay, 'close' ) ) {
					classie.add( overlay, 'open' );
					$("#mask").show();
				}
		} else if(this.tag == 2) {
			if( !classie.has( overlaySEC, 'close' ) ) {
				classie.add( overlaySEC, 'open' );
				
				$("#mask").show();
			}
		} else if(this.tag == 3) {
			if( !classie.has( overlayThr, 'close' ) ) {
				classie.add( overlayThr, 'open' );
				
				$("#mask").show();
			}
		} else {
			if( classie.has( overlay, 'open' ) ) {
				classie.remove( overlay, 'open' );
				classie.add( overlay, 'close' );
				
				var onEndTransitionFn = function( ev ) {
					if( support.transitions ) {
						if( ev.propertyName !== 'visibility' ) return;
						this.removeEventListener( transEndEventName, onEndTransitionFn );
					}
					classie.remove( overlay, 'close' );
				};
				if( support.transitions ) {
					overlay.addEventListener( transEndEventName, onEndTransitionFn );
				}
				else {
					onEndTransitionFn();
				}
				$("#mask").hide();
			}
			if( classie.has( overlaySEC, 'open' ) ) {
				
				classie.remove( overlaySEC, 'open' );
				classie.add( overlaySEC, 'close' );
				
				var onEndTransitionFn = function( ev ) {
					if( support.transitions ) {
						if( ev.propertyName !== 'visibility' ) return;
						this.removeEventListener( transEndEventName, onEndTransitionFn );
					}
					
					classie.remove( overlaySEC, 'close' );
				};
				if( support.transitions ) {
					overlaySEC.addEventListener( transEndEventName, onEndTransitionFn );
				}
				else {
					onEndTransitionFn();
				}
				$("#mask").hide();
			}
			if( classie.has( overlayThr, 'open' ) ) {
				classie.remove( overlayThr, 'open' );
				classie.add( overlayThr, 'close' );
				
				var onEndTransitionFn = function( ev ) {
					if( support.transitions ) {
						if( ev.propertyName !== 'visibility' ) return;
						this.removeEventListener( transEndEventName, onEndTransitionFn );
					}
					classie.remove( overlayThr, 'close' );
				};
				if( support.transitions ) {
					overlayThr.addEventListener( transEndEventName, onEndTransitionFn );
				}
				else {
					onEndTransitionFn();
				}
				$("#mask").hide();
			}
		}
		
	}

	triggerBttn.addEventListener( 'click', toggleOverlay );
	closeBttn.addEventListener( 'click', toggleOverlay );
	triggerBttnSEC.addEventListener( 'click', toggleOverlay );
	closeBttnSEC.addEventListener( 'click', toggleOverlay );
	triggerBttnThr.addEventListener( 'click', toggleOverlay );
	closeBttnThr.addEventListener( 'click', toggleOverlay );

	var mask=document.getElementById( 'mask' );
	mask.addEventListener( 'click', toggleOverlay );
    mask.addEventListener('touchmove',toggleOverlay);
})();


