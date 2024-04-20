import Slide from "./Slide.js"

export default class Tab {
   static options = {
      controlsSelector: '[data-tab-controls]',
      controlAttribute: 'data-tab-control',

      windowsSelector: '[data-tab-windows]',
      windowAttribute: 'data-tab-window',

      animation: false,
      duration: 400,

      afterOpen: (id) => { },
   }
   /**
    * Конструктор нового Экземпляра класса.
    * @param {HTMLElement} element Обертка, внутри которой находятся элементы управления и элементы с информацией.
    * @param {Object}      options Объект с опциями.
    */
   constructor(element, options) {
      this.tab = element
      this.options = { ...Tab.options, ...options }

      try {
         this.controlsWrapper = this.tab.querySelector(this.options.controlsSelector)
         this.windowsWrapper = this.tab.querySelector(this.options.windowsSelector)
         this.controls = Array.from(this.controlsWrapper.children)
         this.windows = Array.from(this.windowsWrapper.children)
      } catch {
         throw new Error('Проверьте правильность ввода данных.')
      }
      // Animation
      this.options.animation = this.tab.hasAttribute('data-tab-animation') || this.options.animation
      this.options.duration = this.options.animation ? this.tab.dataset.tabAnimation || this.options.duration : 0
      // Media
      this.media = this.tab.dataset.tabMedia

      if (this.controls.length !== this.windows.length)
         throw new Error('Количество управляющих элементов должно совпадать с окнами.')

      this.#init()
   }
   #init() {
      if (this.media)
         this.#mediaQueries()

      this.controls.forEach((control, i) => control.setAttribute(this.options.controlAttribute, i))
      const id = this.controls.findIndex(el => el.classList.contains('active'))

      this.windows.forEach((window, i) => {
         window.setAttribute('aria-hidden', i != id)
         window.setAttribute(this.options.windowAttribute, i)
         if (i == id) {
            window.classList.add('active')
            Slide.open(window, 0)
         } else {
            Slide.close(window, 0)
         }
      })

      this.tab.addEventListener('click', this.#onClick.bind(this))
      this.tab.classList.add('tab_init')
   }
   /**
    * Открытие активного и закрытие других табов.
    * @param {(number|string)} id Номер активного таба.
    */
   async setActiveTab(id) {
      if (this.tab.classList.contains('close') || !this.controls[id]) return
      this.tab.classList.add('close')
      this.#setActiveControl(id)
      await this.#setActiveWindow(id)
      this.options.afterOpen(id)
   }
   #setActiveControl(id) {
      this.controls.forEach(control => control.classList.remove('active'))
      this.controls[id].classList.add('active')
   }
   async #setActiveWindow(id) {
      this.windows.forEach((window, i) => {
         if (i != id)
            Slide.close(window, this.options.duration)
         window.setAttribute('aria-hidden', i != id)
         window.classList.remove('active')
      })
      this.windows[id].classList.add('active')

      await Slide.open(this.windows[id], this.options.duration)
      this.tab.classList.remove('close')
   }
   #onClick(e) {
      const currentControl = e.target.closest(`[${this.options.controlAttribute}]`)
      if (!currentControl || currentControl.classList.contains('active'))
         return
      const id = currentControl.getAttribute(this.options.controlAttribute)
      this.setActiveTab(id)
   }
   #mediaQueries() {
      const [type, size] = this.media.replace(/ /g, '').split(',')
      const mql = window.matchMedia(`(${type}-width: ${size})`)

      this.#tabToSpoller(mql)
      mql.addEventListener("change", this.#tabToSpoller.bind(this));
   }
   #tabToSpoller(e) {
      if (e.matches)
         this.windows.forEach((window, i) => window.before(this.controls[i]))
      else
         this.controlsWrapper.append(...this.controls)
   }
}