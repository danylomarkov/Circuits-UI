import { APITestsView } from './APITestsView.js';
import { ElementType } from '../ElementType.js';

$(() => {
    if($('body').hasClass('api-page')) {
        var tests = [{
            elements: [{
                id: 1,
                type: ElementType.OnePortIndicator
            }, {
                id: 2,
                type: ElementType.OnePortGenerator,
                value: false
            }, {
                id: 3,
                type: ElementType.OnePortGenerator,
                value: true
            }, {
                id: 4,
                type: ElementType.NotElement
            }, {
                id: 5,
                type: ElementType.AndElement
            }],
            connections: [{
                source: {
                    id: 2,
                    port: 1
                },
                target: {
                    id: 4,
                    port: 1
                }
            }, {
                source: {
                    id: 3,
                    port: 1
                },
                target: {
                    id: 5,
                    port: 1
                }
            }, {
                source: {
                    id: 4,
                    port: 1
                },
                target: {
                    id: 5,
                    port: 2
                }
            }, {
                source: {
                    id: 5,
                    port: 1
                },
                target: {
                    id: 1,
                    port: 1
                }
            }]}, {
                elements: [],
                connections: []
            }, {
                elements: [],
                connections: []
            },
        ];

        var view = new APITestsView({testdata: tests});
        view.render();
    }
});
