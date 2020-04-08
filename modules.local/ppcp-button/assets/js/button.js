/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/js/button.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/button.js":
/*!********************************!*\
  !*** ./resources/js/button.js ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_Renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/Renderer */ "./resources/js/modules/Renderer.js");
/* harmony import */ var _modules_SingleProductConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/SingleProductConfig */ "./resources/js/modules/SingleProductConfig.js");
/* harmony import */ var _modules_UpdateCart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/UpdateCart */ "./resources/js/modules/UpdateCart.js");
/* harmony import */ var _modules_ErrorHandler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/ErrorHandler */ "./resources/js/modules/ErrorHandler.js");
/* harmony import */ var _modules_CartConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/CartConfig */ "./resources/js/modules/CartConfig.js");






const bootstrap = () => {
    const context = PayPalCommerceGateway.context;
    const errorHandler = new _modules_ErrorHandler__WEBPACK_IMPORTED_MODULE_3__["default"]();
    const defaultConfigurator = new _modules_CartConfig__WEBPACK_IMPORTED_MODULE_4__["default"](PayPalCommerceGateway, errorHandler);
    // Configure mini cart buttons
    if (document.querySelector(PayPalCommerceGateway.button.mini_cart_wrapper)) {

        const renderer = new _modules_Renderer__WEBPACK_IMPORTED_MODULE_0__["default"](PayPalCommerceGateway.button.mini_cart_wrapper);
        renderer.render(defaultConfigurator.configuration());
    }
    jQuery(document.body).on('wc_fragments_loaded wc_fragments_refreshed', () => {
        if (!document.querySelector(PayPalCommerceGateway.button.mini_cart_wrapper)) {
            return;
        }
        const renderer = new _modules_Renderer__WEBPACK_IMPORTED_MODULE_0__["default"](PayPalCommerceGateway.button.mini_cart_wrapper);
        renderer.render(defaultConfigurator.configuration());
    });

    // Configure checkout buttons
    jQuery(document.body).on('updated_checkout', () => {
        if (document.querySelector(PayPalCommerceGateway.button.cancel_wrapper)) {
            return;
        }

        const renderer = new _modules_Renderer__WEBPACK_IMPORTED_MODULE_0__["default"](PayPalCommerceGateway.button.order_button_wrapper);
        renderer.render(defaultConfigurator.configuration());

        jQuery(document.body).trigger('payment_method_selected');
    });
    jQuery(document.body).on('payment_method_selected', () => {
        // TODO: replace this dirty check, possible create a separate context config
        const currentPaymentMethod = jQuery('input[name="payment_method"]:checked').val();

        if (currentPaymentMethod !== 'ppcp-gateway') {
            jQuery(PayPalCommerceGateway.button.order_button_wrapper).hide();
            jQuery('#place_order').show();
        } else {
            jQuery(PayPalCommerceGateway.button.order_button_wrapper).show();
            jQuery('#place_order').hide();
        }
    });

    // Configure context buttons
    if (!document.querySelector(PayPalCommerceGateway.button.wrapper)) {
        return;
    }
    const renderer = new _modules_Renderer__WEBPACK_IMPORTED_MODULE_0__["default"](PayPalCommerceGateway.button.wrapper);
    let configurator = null;
    if (context === 'product') {
        if (!document.querySelector('form.cart')) {
            return;
        }
        const updateCart = new _modules_UpdateCart__WEBPACK_IMPORTED_MODULE_2__["default"](PayPalCommerceGateway.ajax.change_cart.endpoint, PayPalCommerceGateway.ajax.change_cart.nonce);
        configurator = new _modules_SingleProductConfig__WEBPACK_IMPORTED_MODULE_1__["default"](PayPalCommerceGateway, updateCart, renderer.showButtons.bind(renderer), renderer.hideButtons.bind(renderer), document.querySelector('form.cart'), errorHandler);
    }
    if (context === 'cart') {
        configurator = defaultConfigurator;

        jQuery(document.body).on('updated_cart_totals updated_checkout', () => {
            renderer.render(configurator.configuration());
        });
    }
    if (!configurator) {
        console.error('No context for button found.');
        return;
    }

    renderer.render(configurator.configuration());
};
document.addEventListener('DOMContentLoaded', () => {

    if (!typeof PayPalCommerceGateway) {
        console.error('PayPal button could not be configured.');
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('src', PayPalCommerceGateway.button.url);
    script.addEventListener('load', event => {
        bootstrap();
    });
    document.body.append(script);
});

/***/ }),

/***/ "./resources/js/modules/ButtonsToggleListener.js":
/*!*******************************************************!*\
  !*** ./resources/js/modules/ButtonsToggleListener.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * When you can't add something to the cart, the PayPal buttons should not show.
 * Therefore we listen for changes on the add to cart button and show/hide the buttons accordingly.
 */

class ButtonsToggleListener {
    constructor(element, showCallback, hideCallback) {
        this.element = element;
        this.showCallback = showCallback;
        this.hideCallback = hideCallback;
        this.observer = null;
    }

    init() {
        const config = { attributes: true };
        const callback = () => {
            if (this.element.classList.contains('disabled')) {
                this.hideCallback();
                return;
            }
            this.showCallback();
        };
        this.observer = new MutationObserver(callback);
        this.observer.observe(this.element, config);
    }

    disconnect() {
        this.observer.disconnect();
    }
}

/* harmony default export */ __webpack_exports__["default"] = (ButtonsToggleListener);

/***/ }),

/***/ "./resources/js/modules/CartConfig.js":
/*!********************************************!*\
  !*** ./resources/js/modules/CartConfig.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _onApprove__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./onApprove */ "./resources/js/modules/onApprove.js");


class CartConfig {

    constructor(config, errorHandler) {
        this.config = config;
        this.errorHandler = errorHandler;
    }

    configuration() {

        const createOrder = (data, actions) => {
            return fetch(this.config.ajax.create_order.endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    nonce: this.config.ajax.create_order.nonce,
                    purchase_units: []
                })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                if (!data.success) {
                    //Todo: Error handling
                    return;
                }
                return data.data.id;
            });
        };
        return {
            createOrder,
            onApprove: Object(_onApprove__WEBPACK_IMPORTED_MODULE_0__["default"])(this),
            onError: error => {
                this.errorHandler.message(error);
            }
        };
    }
}

/* harmony default export */ __webpack_exports__["default"] = (CartConfig);

/***/ }),

/***/ "./resources/js/modules/ErrorHandler.js":
/*!**********************************************!*\
  !*** ./resources/js/modules/ErrorHandler.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class ErrorHandler {

    constructor() {
        this.wrapper = document.querySelector('.woocommerce-notices-wrapper');
    }

    message(text) {
        this.wrapper.classList.add('woocommerce-error');
        this.wrapper.innerText = this.sanitize(text);
    }

    sanitize(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    clear() {
        if (!this.wrapper.classList.contains('woocommerce-error')) {
            return;
        }
        this.wrapper.classList.remove('woocommerce-error');
        this.wrapper.innerText = '';
    }
}

/* harmony default export */ __webpack_exports__["default"] = (ErrorHandler);

/***/ }),

/***/ "./resources/js/modules/Product.js":
/*!*****************************************!*\
  !*** ./resources/js/modules/Product.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Product {

    constructor(id, quantity, variations) {
        this.id = id;
        this.quantity = quantity;
        this.variations = variations;
    }

    data() {
        return {
            id: this.id,
            quantity: this.quantity,
            variations: this.variations
        };
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Product);

/***/ }),

/***/ "./resources/js/modules/Renderer.js":
/*!******************************************!*\
  !*** ./resources/js/modules/Renderer.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Renderer {

    constructor(wrapper) {
        this.wrapper = wrapper;
    }

    render(buttonConfig) {

        paypal.Buttons(buttonConfig).render(this.wrapper);
    }

    hideButtons() {
        document.querySelector(this.wrapper).style.display = 'none';
    }

    showButtons() {
        document.querySelector(this.wrapper).style.display = 'block';
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Renderer);

/***/ }),

/***/ "./resources/js/modules/SingleProductConfig.js":
/*!*****************************************************!*\
  !*** ./resources/js/modules/SingleProductConfig.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ButtonsToggleListener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ButtonsToggleListener */ "./resources/js/modules/ButtonsToggleListener.js");
/* harmony import */ var _Product__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Product */ "./resources/js/modules/Product.js");
/* harmony import */ var _onApprove__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./onApprove */ "./resources/js/modules/onApprove.js");



class SingleProductConfig {

    constructor(config, updateCart, showButtonCallback, hideButtonCallback, formElement, errorHandler) {
        this.config = config;
        this.updateCart = updateCart;
        this.showButtonCallback = showButtonCallback;
        this.hideButtonCallback = hideButtonCallback;
        this.formElement = formElement;
        this.errorHandler = errorHandler;
    }

    configuration() {

        if (this.hasVariations()) {
            const observer = new _ButtonsToggleListener__WEBPACK_IMPORTED_MODULE_0__["default"](this.formElement.querySelector('.single_add_to_cart_button'), this.showButtonCallback, this.hideButtonCallback);
            observer.init();
        }

        return {
            createOrder: this.createOrder(),
            onApprove: Object(_onApprove__WEBPACK_IMPORTED_MODULE_2__["default"])(this),
            onError: error => {
                this.errorHandler.message(error);
            }
        };
    }

    createOrder() {
        var getProducts = null;
        if (!this.isGroupedProduct()) {
            getProducts = () => {
                const id = document.querySelector('[name="add-to-cart"]').value;
                const qty = document.querySelector('[name="quantity"]').value;
                const variations = this.variations();
                return [new _Product__WEBPACK_IMPORTED_MODULE_1__["default"](id, qty, variations)];
            };
        } else {
            getProducts = () => {
                const products = [];
                this.formElement.querySelectorAll('input[type="number"]').forEach(element => {
                    if (!element.value) {
                        return;
                    }
                    const elementName = element.getAttribute('name').match(/quantity\[([\d]*)\]/);
                    if (elementName.length !== 2) {
                        return;
                    }
                    const id = parseInt(elementName[1]);
                    const quantity = parseInt(element.value);
                    products.push(new _Product__WEBPACK_IMPORTED_MODULE_1__["default"](id, quantity, null));
                });
                return products;
            };
        }
        const createOrder = (data, actions) => {
            this.errorHandler.clear();

            const onResolve = purchase_units => {
                return fetch(this.config.ajax.create_order.endpoint, {
                    method: 'POST',
                    body: JSON.stringify({
                        nonce: this.config.ajax.create_order.nonce,
                        purchase_units
                    })
                }).then(function (res) {
                    return res.json();
                }).then(function (data) {
                    if (!data.success) {
                        //Todo: Error handling
                        return;
                    }
                    return data.data.id;
                });
            };

            const promise = this.updateCart.update(onResolve, getProducts());
            return promise;
        };
        return createOrder;
    }

    variations() {

        if (!this.hasVariations()) {
            return null;
        }
        const attributes = [...this.formElement.querySelectorAll("[name^='attribute_']")].map(element => {
            return {
                value: element.value,
                name: element.name
            };
        });
        return attributes;
    }

    hasVariations() {
        return this.formElement.classList.contains('variations_form');
    }

    isGroupedProduct() {
        return this.formElement.classList.contains('grouped_form');
    }
}
/* harmony default export */ __webpack_exports__["default"] = (SingleProductConfig);

/***/ }),

/***/ "./resources/js/modules/UpdateCart.js":
/*!********************************************!*\
  !*** ./resources/js/modules/UpdateCart.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Product__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Product */ "./resources/js/modules/Product.js");

class UpdateCart {

    constructor(endpoint, nonce) {
        this.endpoint = endpoint;
        this.nonce = nonce;
    }

    /**
     *
     * @param onResolve
     * @param {Product[]} products
     * @returns {Promise<unknown>}
     */
    update(onResolve, products) {
        return new Promise((resolve, reject) => {
            fetch(this.endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    nonce: this.nonce,
                    products
                })
            }).then(result => {
                return result.json();
            }).then(result => {
                if (!result.success) {
                    reject(result.data);
                    return;
                }

                const resolved = onResolve(result.data);
                resolve(resolved);
            });
        });
    }
}

/* harmony default export */ __webpack_exports__["default"] = (UpdateCart);

/***/ }),

/***/ "./resources/js/modules/onApprove.js":
/*!*******************************************!*\
  !*** ./resources/js/modules/onApprove.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const onApprove = context => {
    return (data, actions) => {
        return fetch(context.config.ajax.approve_order.endpoint, {
            method: 'POST',
            body: JSON.stringify({
                nonce: context.config.ajax.approve_order.nonce,
                order_id: data.orderID
            })
        }).then(res => {
            return res.json();
        }).then(data => {
            if (!data.success) {
                //Todo: Error handling
                return;
            }
            location.href = context.config.redirect;
        });
    };
};

/* harmony default export */ __webpack_exports__["default"] = (onApprove);

/***/ })

/******/ });
//# sourceMappingURL=button.js.map