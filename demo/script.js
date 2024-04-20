import Tab from "../src/Tab.js"

const tabs = document.querySelectorAll('.tab')
const tabExpressions = Array.from(tabs).map(tab => new Tab(tab))

const promiseTab = tabExpressions.find(el => el.tab.classList.contains('tab_promise'))
const title = promiseTab.tab.previousElementSibling;
const text = title.textContent
promiseTab.options.afterOpen = (id) => {
   title.innerHTML = `${text}. <br> Сработало открытие ${++id}-го таба.`

   promiseTab.tab.dispatchEvent(new CustomEvent("onOpenTab", {
      detail: { tab: promiseTab, id },
      // Всплытие, чтобы увидеть на документе
      bubbles: true
   }));
}

document.addEventListener('onOpenTab', (e) => {
   console.log('Создание кастомного события ', e.detail);
})