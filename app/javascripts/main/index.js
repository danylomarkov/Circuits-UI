import {IndexView} from './indexView.js';

$(() => {
    if($('body').hasClass('index')) {
        var indexView = new IndexView();
        indexView.render();
    }
});
