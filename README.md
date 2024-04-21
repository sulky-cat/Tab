# Tab

[Демо страница](https://sulky-cat.github.io/Tab/demo/)

## Содержание
- [Описание](#описание)
- [Подключение](#подключение)
- [html](#html)
- [js](#js)
- [Методы](#Методы)
- [Параметры](#параметры)
- [Примеры](#примеры)

## Описание
Укажите в объявлении js класса необходимый css-селектор для начала работы. 
Для блока, внутри которых будут элементы управления, указать `data-tab-controls` (изменяется в опциях класса); 
для блока с окнами - `data-tab-windows` (изменяется в опциях класса).
Чтобы был выбран изначально таб, указать элементу управления (кнопке) класс `active`.

Каждому элементу управления присваивается атрибут `data-tab-control`, а каждому окну - `data-tab-window`. Значение атрибута - id, по которому будет происходить связь элемента управления (кнопка) с окном. Название данных атрибутов можно поменять в опциях класса.

При переходе в спойлеры, элементы управления перемещаются в обертку окон так, чтобы за кнопкой шло его окно таба (button -> tabWindow -> button -> tabWindow -> ...).

Данный скрипт дополнительно использует два вспомогательных класса: `Slide` и `Timer`. [Подробней про них](https://github.com/sulky-cat/Helpers).

## Подключение
Класс `Tab` находится в папке `/src`. Вспомогательные классы `Timer` и `Slide` тоже находятся в папке `/src`, а также [тут](https://github.com/sulky-cat/Helpers).

Подключение без модульности:
```html
<script src="Timer.js"></script>
<script src="Slide.js"></script>
<script src="Tab.js"></script>
```
Подключение с модулями (уже написано в файлах):
*HTML*
```html
<script type="module" src="script.js">
   import Tab from "Tab.js"
</script>
```
*JS (Tab.js)*
```js
import Slide from "./Slide.js"
```
*JS (Slide.js)*
```js
import Timer from "./Timer.js";
```

## HTML
```html
<div class="tab" data-tab-animation="300" data-tab-media="max,900px">
   <div data-tab-controls>
      <button type="button" class="active">1</button>
      <button type="button">2</button>
      <button type="button">3</button>
   </div>
   <div data-tab-windows>
      <section><h2>Секция №1</h2></section>
      <section><h2>Секция №2</h2></section>
      <section><h2>Секция №3</h2></section>
   </div>
</div>
``` 
Атрибуты для таба (элемент с классом `tab`): 
* `data-tab-animation` - указать для анимации. Также можно изменить время выполнения анимации, указав в данном атрибуте время в ms. По умолчанию 500 ms;
* `data-tab-media` - медиазапрос для перехода табов в спойлеры. Первое значение - `min` или `max`, второе - ширина экрана с указанием единицы измерения. 
Например: 
`data-tab-media="max,900px"` - табы станут спойлерами на ширинах экрана от 900px и меньше,
`data-tab-media="min,900px"` - табы станут спойлерами на ширинах экрана от 900px и больше.

## JS
Инициализация:
```js
const tab = new Tab(document.querySelectorAll('.tab', {
   animation: true,
}))
``` 

### Настройки
* `controlsSelector` - указание селектора, по которому будет поиск обертки элементов управления. По умолчанию `'[data-tab-controls]'`;
* `controlAttribute` - атрибут, который будет присваиваться каждому элементу управления с необходимым id. По умолчанию `'data-tab-control'`;
* `windowsSelector` - указание селектора, по которому будет поиск обертки окон. По умолчанию `'[data-tab-windows]'`;
* `windowAttribute` - атрибут, который будет присваиваться каждому окну с необходимым id. По умолчанию `'data-tab-window'`;
* `animation` - включение анимации при переключении окон табов. По умолчанию `false`;
* `duration` - время открытия окон табов при включенной анимации. По умолчанию `400`;
* `afterOpen` - функция, которая выполнится сразу после открытия активного окна таба. По умолчанию пустая функция `(id) => {}`.

## Методы
* `tab.setActiveTab(id)` - открытие определенного окна таба по указанному id. Метод возвращает промис [см. пример №4](https://sulky-cat.github.io/Tab/demo/#ex_4).

```js
tab.setActiveTab(2)
.then(id => {
   alert(id)
})
```
```js
async function func(){
   await tab.setActiveTab(2)
   alert(id)
}
func()
```
```js
await tab.setActiveTab(2)
alert(id)
```

## Параметры
* `tab.controls` - элементы управления;
* `tab.controlsWrapper` - обертка элементов управления;
* `tab.windows` - окна (элементы);
* `tab.windowsWrapper` - обертка окон;
* `tab.tab` - таб (родительский элемент);
* `tab.options` - опции;
* `tab.media` - значение, которое указано в `data-tab-media`.

## Примеры
Пример использования с работой промисов. 
HTML
```html
<div class="tab" data-tab-animation>
   <div data-tab-controls>
      <button type="button" class="active">1</button>
      <button type="button">2</button>
      <button type="button">3</button>
   </div>
   <div data-tab-windows>
      <section><h2>Секция №1</h2></section>
      <section><h2>Секция №2</h2></section>
      <section><h2>Секция №3</h2></section>
   </div>
</div>
```
JS
```js
const tabElement = document.querySelectorAll('.tab')
const tab = new Tab(tabElement)

tab.afterOpen = (id) => {
   // Создание кастомного события
   promiseTab.tab.dispatchEvent(new CustomEvent("onOpenTab", {
      detail: { tab: promiseTab, id },
      // Всплытие, чтобы увидеть на документе
      bubbles: true
   }));
}

document.addEventListener('onOpenTab', (e) => {
   console.log('Создание кастомного события', e.detail);
})
```
Функцию `afterOpen` можно было указать при объявлении класса, например: 
```js
const tabElement = document.querySelectorAll('.tab')
const tab = new Tab(tabElement, {
   afterOpen: (id) => {
      alert(id)
   }
})
```
