define(function () {
    function controller(id) {
        this.id = id;
    }

    controller.prototype = {
        setModel: function (model) {
            this.model = model;
        },

        render: function (bodyDom) {
            bodyDom.prepend('<h1>Controller ' + this.id + ' says "' +
                      this.model.getTitle() + '"</h1>');
        }
    };

    return new controller();
});
