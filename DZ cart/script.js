let cartId = "cart";

let localAdapter = {

    saveCart: function (object) {
        let stringified = JSON.stringify(object);
        localStorage.setItem(cartId, stringified);
        return true;
    },

    getCart: function () {
        return JSON.parse(localStorage.getItem(cartId));
    },

    clearCart: function () {
        localStorage.removeItem(cartId);
    }
};

let ajaxAdapter = {

    saveCart: function (object) {
        let stringified = JSON.stringify(object);
    },

    getCart: function () {
        return JSON.parse(data);
    },

    clearCart: function () {
    }
};

let storage = localAdapter;

let helpers = {

    getHtml: function (id) {
        return document.getElementById(id).innerHTML;
    },

    setHtml: function (id, html) {
        document.getElementById(id).innerHTML = html;
        return true;
    },

    itemData: function (object) {

        let count = object.querySelector(".count"),
            patt = new RegExp("^[1-9]([0-9]+)?$");
        count.value = (patt.test(count.value) === true) ? parseInt(count.value) : 1;

        let item = {
            name: object.getAttribute('data-name'),
            price: object.getAttribute('data-price'),
            id: object.getAttribute('data-id'),
            count: count.value,
            total: parseInt(object.getAttribute('data-price')) * parseInt(count.value)
        };

        return item;
    },

    updateCart: function () {

        let items = cart.getItems(),
           contains = this.getHtml('cartT'),
            compiled = _.template( contains, {
                items: items
            });
        this.setHtml('cartItems', compiled);
        this.updateTotal();
    },

    emptyCart: function () {
        this.setHtml('cartItems', '<p>Your cart is empty</p>');
        this.updateTotal();
    },

    updateTotal: function () {
        this.setHtml('totalPrice', cart.total + '$');
    }

};

let cart = {

    count: 0,
    total: 0,
    items: [],
    getItems: function () {
        return this.items;
    },

    setItems: function (items) {
        this.items = items;
        for (let i = 0; i < this.items.length; i++) {
            let _item = this.items[i];
            this.total += _item.total;
        }
    },

    clearItems: function () {
        this.items = [];
        this.total = 0;
        storage.clearCart();
       helpers.emptyCart();
    },

    addItem: function (item) {
        if (this.containsItem(item.id) === false) {
            this.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                count: item.count,
                total: item.price * item.count
            });
            storage.saveCart(this.items);
        }
        else {
            this.updateItem(item);
        }

        this.total += item.price * item.count;
        this.count += item.count;
        helpers.updateCart();
    },

    containsItem: function (id) {
        if (this.items === undefined) {
            return false;
        }
        for (let i = 0; i < this.items.length; i++) {

            let _item = this.items[i];

            if (id == _item.id) {
                return true;
            }
        }

        return false;
    },

    updateItem: function (object) {

        for (let i = 0; i < this.items.length; i++) {

            let _item = this.items[i];

            if (object.id === _item.id) {

                _item.count = parseInt(object.count) + parseInt(_item.count);
                _item.total = parseInt(object.total) + parseInt(_item.total);
                this.items[i] = _item;
                storage.saveCart(this.items);
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {

    if (storage.getCart()) {
        cart.setItems(storage.getCart());
        helpers.updateCart();
    }
    else {
        helpers.emptyCart();
    }

    let products = document.querySelectorAll('.product button');
    [].forEach.call(products, function (product) {
        product.addEventListener('click', function (e) {
            let item = helpers.itemData(this.parentNode);
            cart.addItem(item);
        });
    });

    document.querySelector('#clear').addEventListener('click', function (e) {
        cart.clearItems();
    });
});