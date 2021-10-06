/** @jsx createElement */
const HTML_TAGS = {
  a: {
    name: 'a',
    attributes: {
      download: 'download',
      href: 'href',
      hrefLang: 'hreflang',
      ping: 'ping',
      referrerPolicy: 'referrerpolicy',
      rel: 'rel',
      target: 'target',
      type: 'type'
    }
  },
  abbr: 'abbr',
  address: 'address',
  area: 'area',
  article: 'article',
  aside: 'aside',
  audio: {
    name: 'audio',
    attributes: {
      autoPlay: 'autoplay',
      autoBuffer: 'autobuffer',
      buffered: 'buffered',
      controls: 'controls',
      loop: 'loop',
      muted: 'muted',
      played: 'played',
      preload: 'preload',
      src: 'src',
      volume: 'volume'
    }
  },
  blockquote: 'blockquote',
  b: 'b',
  base: 'base',
  bdi: 'bdi',
  bdo: 'bdo',
  br: 'br',
  button: {
    name: 'button',
    attributes: {
      autoFocus: 'autofocus',
      disabled: 'disabled',
      form: 'form',
      formAction: 'formaction',
      formMethod: 'formmethod',
      formType: 'formtype',
      formValidate: 'formvalidate',
      formTarget: 'formtarget',
      type: 'type',
      value: 'value'
    }
  },
  canvas: {
    name: 'canvas',
    attributes: {
      height: 'height',
      width: 'width'
    }
  },
  caption: 'caption',
  cite: 'cite',
  code: 'code',
  col: 'col',
  colgroup: 'colgroup',
  data: {
    name: 'data',
    attributes: {
      value: 'value'
    }
  },
  datalist: 'datalist',
  dfn: 'dfn',
  div: 'div',
  dd: 'dd',
  del: 'del',
  details: {
    name: 'details',
    attributes: {
      open: 'open'
    }
  },
  dl: 'dl',
  dt: 'dt',
  em: 'em',
  embed: {
    name: 'embed',
    attributes: {
      height: 'height',
      src: 'src',
      type: 'type',
      width: 'width'
    }
  },
  fieldset: {
    name: 'fieldset',
    attributes: {
      disabled: 'disabled',
      form: 'form',
      name: 'name'
    }
  },
  figcaption: 'figcaption',
  figure: 'figure',
  footer: 'footer',
  form: {
    name: 'form',
    attributes: {
      acceptCharset: 'accept-charset',
      action: 'action',
      autocomplete: 'autocomplete',
      enctype: 'enctype',
      method: 'method',
      name: 'name',
      noValidate: 'novalidate',
      target: 'target'
    }
  },
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  head: 'head',
  header: 'header',
  hgroup: 'hgroup',
  hr: 'hr',
  i: 'i',
  input: {
    name: 'input',
    attributes: {
      accept: 'accept',
      autoFocus: 'autofocus',
      autoComplete: 'autocomplete',
      checked: 'checked',
      disabled: 'disabled',
      form: 'form',
      formAction: 'formaction',
      formMethod: 'formmethod',
      formType: 'formtype',
      formValidate: 'formvalidate',
      formTarget: 'formtarget',
      height: 'height',
      list: 'list',
      max: 'max',
      maxLength: 'maxlength',
      min: 'min',
      minLength: 'minlength',
      multiple: 'multiple',
      name: 'name',
      placeholder: 'placeholder',
      readOnly: 'readonly',
      required: 'required',
      size: 'size',
      src: 'src',
      step: 'step',
      type: 'type',
      value: 'value',
      width: 'width'
    }
  },
  img: {
    name: 'img',
    attributes: {
      alt: 'alt',
      crossOrigin: 'crossorigin',
      height: 'height',
      isMap: 'ismap',
      longDesc: 'longdesc',
      referrerPolicy: 'referrerpolicy',
      sizes: 'sizes',
      src: 'src',
      srcset: 'srcset',
      width: 'width',
      useMap: 'usemap'
    }
  },
  ins: 'ins',
  kbd: 'kbd',
  label: {
    name: 'label',
    attributes: {
      htmlFor: 'for'
    }
  },
  legend: 'legend',
  li: 'li',
  link: 'link',
  main: 'main',
  map: {
    name: 'map',
    attributes: {
      name: 'name'
    }
  },
  mark: 'mark',
  meta: 'meta',
  meter: {
    name: 'meter',
    attributes: {
      form: 'form',
      high: 'high',
      low: 'low',
      min: 'min',
      max: 'max',
      optimum: 'optimum',
      value: 'value'
    }
  },
  nav: 'nav',
  ol: 'ol',
  object: {
    name: 'object',
    attributes: {
      form: 'form',
      height: 'height',
      name: 'name',
      type: 'type',
      typeMustmatch: 'typemustmatch',
      useMap: 'usemap',
      width: 'width'
    }
  },
  optgroup: {
    name: 'optgroup',
    attributes: {
      disabled: 'disabled',
      label: 'label'
    }
  },
  option: {
    name: 'option',
    attributes: {
      disabled: 'disabled',
      label: 'label',
      selected: 'selected',
      value: 'value'
    }
  },
  output: {
    name: 'output',
    attributes: {
      htmlFor: 'for',
      form: 'form',
      name: 'name'
    }
  },
  p: 'p',
  param: {
    name: 'param',
    attributes: {
      name: 'name',
      value: 'value'
    }
  },
  pre: 'pre',
  progress: {
    name: 'progress',
    attributes: {
      max: 'max',
      value: 'value'
    }
  },
  rp: 'rp',
  rt: 'rt',
  rtc: 'rtc',
  ruby: 'ruby',
  s: 's',
  samp: 'samp',
  section: 'section',
  select: {
    name: 'select',
    attributes: {
      autoFocus: 'autofocus',
      disabled: 'disabled',
      form: 'form',
      multiple: 'multiple',
      name: 'name',
      required: 'required',
      size: 'size'
    }
  },
  small: 'small',
  source: {
    name: 'source',
    attributes: {
      media: 'media',
      sizes: 'sizes',
      src: 'src',
      srcset: 'srcset',
      type: 'type'
    }
  },
  span: 'span',
  strong: 'strong',
  style: 'style',
  sub: 'sub',
  sup: 'sup',
  table: 'table',
  tbody: 'tbody',
  th: 'th',
  thead: 'thead',
  textarea: {
    name: 'textarea',
    attributes: {
      autoComplete: 'autocomplete',
      autoFocus: 'autofocus',
      cols: 'cols',
      disabled: 'disabled',
      form: 'form',
      maxLength: 'maxlength',
      minLength: 'minlength',
      name: 'name',
      placeholder: 'placeholder',
      readOnly: 'readonly',
      required: 'required',
      rows: 'rows',
      selectionDirection: 'selectionDirection',
      wrap: 'wrap'
    }
  },
  td: 'td',
  tfoot: 'tfoot',
  tr: 'tr',
  track: {
    name: 'track',
    attributes: {
      htmlDefault: 'default',
      kind: 'kind',
      label: 'label',
      src: 'src',
      srclang: 'srclang'
    }
  },
  time: 'time',
  title: 'title',
  u: 'u',
  ul: 'ul',
  video: {
    name: 'video',
    attributes: {
      autoPlay: 'autoplay',
      buffered: 'buffered',
      controls: 'controls',
      crossOrigin: 'crossorigin',
      height: 'height',
      loop: 'loop',
      muted: 'muted',
      played: 'played',
      poster: 'poster',
      preload: 'preload',
      src: 'src',
      width: 'width'
    }
  }
}
const GLOBAL_ATTRIBUTES = {
  accessKey: 'accesskey',
  className: 'class',
  contentEditable: 'contenteditable',
  contextMenu: 'contextmenu',
  dir: 'dir',
  draggable: 'draggable',
  dropZone: 'dropzone',
  hidden: 'hidden',
  id: 'id',
  itemId: 'itemid',
  itemProp: 'itemprop',
  itemRef: 'itemref',
  itemScope: 'itemscope',
  itemType: 'itemtype',
  lang: 'lang',
  spellCheck: 'spellcheck',
  tabIndex: 'tabindex',
  title: 'title',
  translate: 'translate'
}
const EVENT_HANDLERS = {
  onClick: 'click',
  onFocus: 'focus',
  onBlur: 'blur',
  onChange: 'change',
  onSubmit: 'submit',
  onInput: 'input',
  onResize: 'resize',
  onScroll: 'scroll',
  onWheel: 'mousewheel',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
  onMouseMove: 'mousemove',
  onMouseEnter: 'mouseenter',
  onMouseOver: 'mouseover',
  onMouseOut: 'mouseout',
  onMouseLeave: 'mouseleave',
  onTouchStart: 'touchstart',
  onTouchEnd: 'touchend',
  onTouchCancel: 'touchcancel',
  onContextMenu: 'Ccntextmenu',
  onDoubleClick: 'dblclick',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onDragEnter: 'dragenter',
  onDragExit: 'dragexit',
  onDragLeave: 'dragleave',
  onDragOver: 'dragover',
  onDragStart: 'Dragstart',
  onDrop: 'drop',
  onLoad: 'load',
  onCopy: 'copy',
  onCut: 'cut',
  onPaste: 'paste',
  onCompositionEnd: 'compositionend',
  onCompositionStart: 'compositionstart',
  onCompositionUpdate: 'compositionupdate',
  onKeyDown: 'keydown',
  onKeyPress: 'keypress',
  onKeyUp: 'keyup',
  onAbort: 'Abort',
  onCanPlay: 'canplay',
  onCanPlayThrough: 'canplaythrough',
  onDurationChange: 'durationchange',
  onEmptied: 'emptied',
  onEncrypted: 'encrypted ',
  onEnded: 'ended',
  onError: 'error',
  onLoadedData: 'loadeddata',
  onLoadedMetadata: 'loadedmetadata',
  onLoadStart: 'Loadstart',
  onPause: 'pause',
  onPlay: 'play ',
  onPlaying: 'playing',
  onProgress: 'progress',
  onRateChange: 'ratechange',
  onSeeked: 'seeked',
  onSeeking: 'seeking',
  onStalled: 'stalled',
  onSuspend: 'suspend ',
  onTimeUpdate: 'timeupdate',
  onVolumeChange: 'volumechange',
  onWaiting: 'waiting',
  onAnimationStart: 'animationstart',
  onAnimationEnd: 'animationend',
  onAnimationIteration: 'animationiteration',
  onTransitionEnd: 'transitionend'
}
function createElement (tagName, props = {}, ...childNodes) {
  if (props === null) {
    props = {}
  }
  const tag = HTML_TAGS[tagName]
  const object = typeof tag === 'object'
  const localAttrs = object ? tag.attributes || {} : {}
  const attrs = Object.assign({}, GLOBAL_ATTRIBUTES, localAttrs)
  const tagType = object ? tag.name : tag
  const el = document.createElement(tagType)
  Object.keys(props).forEach(prop => {
    if (prop in attrs) {
      el.setAttribute(attrs[prop], props[prop])
    }
    if (prop in EVENT_HANDLERS) {
      el.addEventListener(EVENT_HANDLERS[prop], props[prop])
    }
  })
  if ('style' in props) {
    const styles = props.style
    Object.keys(styles).forEach(prop => {
      const value = styles[prop]
      if (typeof value === 'number') {
        el.style[prop] = `${value}px`
      } else if (typeof value === 'string') {
        el.style[prop] = value
      } else {
        throw new Error(`Expected "number" or "string" but received "${typeof value}"`)
      }
    })
  }
  childNodes.forEach(childNode => {
    if (typeof childNode === 'object') {
      el.appendChild(childNode)
    } else if (typeof childNode === 'string') {
      el.appendChild(document.createTextNode(childNode))
    } else {
      if (childNode !== false) {
        throw new Error(`Expected "object" or "string" but received "${typeof value}"`)
      }
    }
  })
  return el
}

let renderAction
function render (component, containerDom) {
  renderAction = function () {
    index = 0
    const child = containerDom.children[0]
    const newChild = component()
    if (child) {
      containerDom.replaceChild(newChild, child)
    } else {
      containerDom.appendChild(newChild)
    }
  }
  renderAction()
}

const _state = []
let index = 0
function useState (initialValue) {
  const currentIndex = index
  _state[currentIndex] = _state[currentIndex] === undefined ? initialValue : _state[currentIndex]
  const setState = newValue => {
    if (newValue !== _state[currentIndex]) {
      _state[currentIndex] = newValue
      renderAction()
    }
  }
  index += 1
  return [_state[currentIndex], setState]
}

window.React = {
  createElement,
  render,
  useState
}
