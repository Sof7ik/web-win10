import { deleteContextMenus } from './context-menu';
import { Program, DesktopItem } from './Classes';

let fileId, userId;

export function getUserInfo (url) {
    // console.log(url);
    //long function

    // const allParams = url.split('?');
    // const params = allParams[1].split('&');
    // let paramsObject = {};
    // let tempArray = [];
    // params.forEach((param, index) => {
    //     tempArray[index] = [...param.split('=')];
    // })
    // tempArray.forEach(param => {
    //     paramsObject[param[0]] = param[1];
    // })
    // console.log('long functioon result');
    // console.log(paramsObject);

    //short function
    // let paramsObject1 = {};
    //
    // const params1 = url.split('?')[1].split('&');
    //
    // params1.forEach(param => {
    //     paramsObject1[param.split('=')[0]] = param.split('=')[1];
    // })
    //
    // // console.log('short function result');
    // // console.log(paramsObject1);
    // console.log('paramsObject1', paramsObject1);
    // return paramsObject1;

    // const urlParams = new URLSearchParams(window.location.href);
    // console.log(urlParams.getAll())
}

export async function getUserConfig(id)
{
    const config = JSON.parse(localStorage.getItem("userConfig"));

    if (!config) return;

    const mainElem = document.querySelector('main');

    // ставим фон рабочего стола
    if (config.desktopBg.type === "color") {
        mainElem.style.backgroundImage = "";
        mainElem.style.backgroundColor = config.desktopBg.value;
    }
    else if (data.desktopBg.type === "image") {
        mainElem.style.backgroundImage = `url("${config.desktopBg.value}")`;
        mainElem.style.backgroundColor = "";
        mainElem.style.backgroundSize = config.desktopBg.fill || "cover";
    }
    else {
        mainElem.style.backgroundColor = "red";
    }
}

//функция выделения "файлов" при клике
export const makeFileActive = (event) => {
    let target = event.target.parentElement;

    if (target.tagName === "DIV" && target.classList.contains('desktop-item')) {
        clearActiveElements();
        target.classList.toggle('active');
    }

    if(target.tagName === "MAIN" || target.tagName === "BODY") {
        clearActiveElements();
    }
}

//убираем выделение с файла
export const clearActiveElements = () => {
    let activeItems = document.querySelectorAll('div.active');
    activeItems.forEach((item) => {
        item.classList.remove('active');
    })
    deleteContextMenus();
}

export const renderFiles = async (userId) => {
    if (userId) {
        const response = await fetch(`/server/files?userId=${userId}`);

        const files = await response.json();

        if (response.status >= 200 && response.status < 300) {
            files.forEach(file => {
                new DesktopItem(file._id.$oid).create(file.name, file.type);
                // TODO повесить контекстные меню на файлы
            });
        }
        else {
            console.error(files);
        }
    }
}

//проверяем, на что кликнули - ярлык, папка, текстовый документ
export const checkFileTypeOnDBLClick = async (event) => {
    const target = event.target.parentElement;
    const fileName = target.lastElementChild.textContent;

    if (target.classList.contains('bin')) {
        console.log('bin');
        //new Program('bin').openBin('bin');
    }

    if (target.classList.contains('txt')) {
        fileId = target.dataset.idfile;

        const response = await fetch(`/server/files?id=${fileId}`);
        const file = await response.json();
        if (response.status >= 200 && response.status < 300) {
            console.log(file);
            new Program('notepad').openTxt(file.name, 'notepad', file.content);
        }
        else {
            console.error(file);
        }
    }

    if (target.classList.contains('folder')) {
        new Program('explorer').openFolder(fileName, 'explorer');
    }

    if (target.classList.contains('shortcut')) {
        new Program('browser').openBrowser('https://forum.auto.ru', 'browser');
    }

    if (target.classList.contains('desktop-settings'))
    {
        new Program('settings').openSettings('settings');
    }
}

// получаем ID пользователя из localStorage после авторизации
userId = localStorage.getItem("userId");
if (userId) {
    getUserConfig(userId);
}