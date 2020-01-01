/**
 * sticky
 * @param {string} [options.parent] 親の要素のクラス名
 * @param {string} [options.child] 子の要素のクラス名
 * @param {number} [options.interval] 間
 *
 * @example
 *    <div style={position: 'relative'} class="parent">
 *        <div style={position: 'absolute', top: 0} class="child">
 *           // ここの部分がコンテンツ
 *        </div>
 *    </div>
 */

class Sticky {
  constructor (opt) {
    const { parent, child, interval } = opt;

    this.$$sections = this.makeArray(document.querySelectorAll(parent));

    this.child = child;
    this.sectionsOpt = [];
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    this.while = interval || 0;
    this.time = Date.now();
  }

  init () {
    this.$$sections.forEach((r, i) => {
      const result = {
        top: this.offsetTop(r),
        bottom: this.offsetTop(r) + r.clientHeight,
        el: r,
        child: r.querySelector(this.child)
      };

      this.sectionsOpt[i] = result;
    });
    this.onListener();
  }

  onListener () {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll);
  }

  // スクロールイベント
  onScroll () {
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.onSicky();
  }

  // 追従の処理
  onSicky () {
    this.sectionsOpt.forEach(r => {
      const $$parent = r.el;
      const $$child = r.child;

      const isStart = $$parent.classList.contains('start');
      const isEnd = $$parent.classList.contains('end');

      if (r.top <= this.scrollTop + this.while && r.bottom >= this.scrollTop) {
        if (isStart) {
          $$parent.classList.remove('start');
        } else if (isEnd) {
          $$parent.classList.remove('end');
        }

        $$child.style.width = `${$$parent.clientWidth}px`;

        const bottom = $$parent.clientHeight - $$child.clientHeight;
        const scrollBottom = this.scrollTop + $$child.clientHeight;

        if (r.bottom - this.while <= scrollBottom) {
          $$child.style.position = 'absolute';
          $$child.style.top = `${bottom}px`;
        } else {
          $$child.style.position = 'fixed';
          $$child.style.top = `${this.while}px`;
        }
      } else if (r.top > this.scrollTop) {
        if (!isStart) {
          $$parent.classList.add('start');
          $$child.style.position = 'absolute';
          $$child.style.width = '100%';
          $$child.style.top = '0px';
        }
      } else if (r.bottom < this.scrollTop) {
        if (!isEnd) {
          const bottom = $$parent.clientHeight - $$child.clientHeight;

          $$parent.classList.add('end');
          $$child.style.position = 'absolute';
          $$child.style.width = '100%';
          $$child.style.top = `${bottom}px`;
        }
      }
    });
  }

  // リサイズの処理
  onResize () {
    const onProcess = () => {
      this.resetVal();
      this.onSicky();
    };

    this.throttle(onProcess, 1000);
  }

  // 要素の値をリセット
  resetVal () {
    this.$$sections.forEach((r, i) => {
      this.sectionsOpt[i].top = this.offsetTop(r);
      this.sectionsOpt[i].bottom = this.offsetTop(r) + r.clientHeight;
    });
  }

  /**
   * domの高さを取得
   * @param {HTMLElement} el dom
   * @returns {number} 高さの値
   */
  offsetTop (el) {
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const myTop = rect.top + scrollTop;

    return myTop;
  }

  /**
   * 間引き
   * @param {Function} func 間引きしたい処理
   * @param {number} duration 間引きの間隔
   */
  throttle (func, duration = 1000) {
    duration = duration / 60;

    const onResult = () => {
      if (this.time + duration - Date.now() < 0) {
        this.time = new Date().getTime();
        func();
      }
    };

    return onResult();
  }

  /**
   * @param {NodeListOf<HTMLElement>} obj NodeListの配列
   * @returns {Array<HTMLElement>} domが入った配列
   */
  makeArray (obj) {
    const array = [];
    for (let i = 0, num = obj.length; i < num; i++) {
      array[i] = obj[i];
    }
    return array;
  }
}

export default Sticky;
