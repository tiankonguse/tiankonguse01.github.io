define(function (require) {
    var $ = require('lib/jquery'),
        controller = require('controller/c_map'),
        model = require('model/m_map');

    //A fabricated API to show interaction of
    //common and specific pieces.
    controller.setModel(model);
    $(function () {
        controller.render(lib.getBody());
    });
});
