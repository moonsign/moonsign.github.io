var _tb_to = -1;
var _tb_io = -1;
var _mv_to = -1;

var $tb;
var _currentlyHovered = null;
// var onTarget = false;

// $(document).ready(function () {
//     makeNiceHoverT({
//         targetClasses: ['nice-hover-t'],
//         roundCorner: true,
//     });
// });

function makeNiceHoverT(_conf) {
    _conf = _conf || {};
    let _cont = _conf.container || 'body';
    let _targetClasses = _conf.targetClasses || ['.nice-hover-t'];
    let _hiding = function () {
        if ($tb) {
            $tb.removeClass('on-target stay').addClass('hiding');
        }
        _currentlyHovered = null;
    }
    let _borderWidth = _conf.borderWidth == undefined ? 3 : parseInt(_conf.borderWidth);
    let _borderDis = _conf.borderDis == undefined ? 4 : parseInt(_conf.borderDis);
    // 0:false, 1:true(default), 2:auto
    let _roundCorner = 2;
    let _overrideRadius = null;
    if (typeof _conf.roundCorner === 'number') {
        _overrideRadius = _conf.roundCorner;
    } else if (typeof _conf.roundCorner === 'boolean') {
        _roundCorner = _conf.roundCorner ? 1 : 0;
    };
    $el = $(_cont);
    $el.on({
        'mouseover': function (e) {
            // clearTimeout(_mv_to);
            // _mv_to = setTimeout(() => {

            // }, 50);
            clearTimeout(_tb_to);
            let $target = $(e.target);
            // console.log(e.target);
            let _isTarget = false;
            for (let i = 0; i < _targetClasses.length; i++) {
                if ($target.is(_targetClasses[i])) {
                    _isTarget = true;
                    break;
                } else {
                    let _parent = $target.parents(_targetClasses[i]);
                    if (_parent.length > 0) {
                        $target = _parent;
                        _isTarget = true;
                        break;
                    }
                }
            }
            if (!_isTarget) {
                _hiding();
                return;
            }
            if ($target[0] === _currentlyHovered) {
                return;
            }
            _currentlyHovered = $target[0];
            let _borderRadius = _overrideRadius != null ? _overrideRadius : $target.css('border-radius');
            $tb = $('#target-border');
            if ($tb.length == 0) {
                let _html = '<div id="target-border">';
                ['top left', 'top right', 'bottom left', 'bottom right'].forEach(function (_pos) {
                    _html += '<div class="border ' + _pos + '">'
                    _html += '<div class="mask"><div class="cut-out"></div></div>';
                    _html += '<div class="mask shadow"><div class="cut-out"></div></div>';
                    _html += '</div>';
                });
                ['top center', 'left center', 'bottom center', 'right center'].forEach(function (_pos) {
                    _html += '<div class="border ' + _pos + '"></div>';
                });
                _html += '</div>';
                $('body').append(_html);
                $tb = $('#target-border');
            }
            $tb.removeClass('hiding high wide');
            $tb.css({
                '--tb-border-width': _borderWidth + 'px',
                '--tb-border-dis': _borderDis + 'px',
            });
            let _rect = $target[0].getBoundingClientRect();
            if (_rect.height >= 400 || _rect.width >= 400) {
                if (_rect.width >= _rect.height * 1.5) {
                    $tb.addClass('wide');
                } else if (_rect.height >= _rect.width * 1.5) {
                    $tb.addClass('high');
                }
                if (_rect.height >= 500 || _rect.width >= 500) {
                    $tb.addClass('wide high');
                }
            }
            let _top = _rect.top;
            let _left = _rect.left;
            let _width = _rect.width;
            let _height = _rect.height;
            let _tbSize = Math.sqrt(_width * _width + _height * _height) * 0.06;
            _tbSize = _tbSize < 12 ? 12 : (_tbSize > 30 ? 30 : _tbSize);
            let _borderRadiusStyle = 0;
            if (_roundCorner == 1 || _roundCorner == 2 && parseFloat(_borderRadius) != 0) {
                _borderRadiusStyle = '';
                if (parseFloat(_borderRadius) != 0) {
                    _tbSize = _tbSize * 1.1;
                }
            }
            $tb.css({
                'top': _top,
                'left': _left,
                'width': _width,
                'height': _height,
                '--tb-border-radius': _borderRadius,
                '--tb-border-radius-inner': _borderRadiusStyle,
                '--tb-border-radius-outter': _borderRadiusStyle,
                '--tb-border-rect-size': _tbSize
            }).addClass('on-target');
        },
        'mouseleave': function (e) {
            clearTimeout(_tb_to);
            _hiding();
        },
        'mousemove': function (e) {
            if (!$tb || $tb.length == 0) {
                return;
            }
            $tb.removeClass('stay animation');
            clearInterval(_tb_io);
            clearTimeout(_tb_to);
            _tb_to = setTimeout(() => {
                if (!$tb.hasClass('on-target')) {
                    return;
                }
                $tb.addClass('stay');
                let _duration = parseInt($tb.css('--tb-anima-duration'));
                _tb_io = setInterval(() => {
                    $tb.toggleClass('animation')
                }, _duration);
            }, 2000);
        }
    });
}