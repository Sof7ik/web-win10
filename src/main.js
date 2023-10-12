import { makeFileActive, checkFileTypeOnDBLClick, renderFiles} from './desktop';
import { setDate, swapWinLogo } from './footer';
import { makeDesktopContextMenu, makeFileContextMenu } from './context-menu'; 

// let value, allAudio; //тута мы будем громкость менять

const mainElement = document.querySelector('main');

//каждую минуту перевыводим время и дату
setInterval(() =>{
    setDate();
}, 1000);

setDate();

// на правый клик вешаем создание кастомного контекстного меню
document.querySelector("main").addEventListener("contextmenu", makeDesktopContextMenu);

renderFiles();

mainElement.addEventListener('click', makeFileActive);
mainElement.addEventListener('dblclick', checkFileTypeOnDBLClick);

swapWinLogo();