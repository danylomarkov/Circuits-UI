import {IndexView} from './IndexView.js';

$(() => {
    if($('body').hasClass('index')) {
        var indexView = new IndexView();
        indexView.render();
    }
});
