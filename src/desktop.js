let fileId;
let userId = null;

import { deleteContextMenus, makeDesktopContextMenu, makeFileContextMenu } from './context-menu';
import { Program, DesktopItem } from './Classes';

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
    try {
        const response = await fetch(`./../php/getConfig.php?id=${id}`);
        const data = await response.json();

        if (response.status < 200 && response.status >= 300) {
            // TODO error

            return;
        }

        if (data !== null)
        {
            //фото или цвет ?
            //разбиваем строку по '.' (отделяем расширение файла от названия)
            let image = data.bg.split('.');

            //если это картинка, то элементов в массиве будет 2
            //если цвет, то один
            if (image.length > 1)
            {
                document.querySelector('main').style.backgroundImage = `url('./desktop-bg/${data.bg}')`;
            } else
            {
                document.querySelector('main').style.backgroundImage = '';
                document.querySelector('main').style.backgroundColor = data.bg;
            }
        }
        else
        {
            console.warn('bg is null')
        }
    } catch(e) {
        console.error(e);
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

const getFilesFromDB = async (userId) => {
    // return await fetch(`../php/getfiles.php?id=${getUserInfo(window.location.href).id}`);
    return await fetch(`../php/getfiles.php?id=${userId}`);
}

export const renderFiles = async () => {
    if (!userId) return;

    await getFilesFromDB()
    .then(res => res.json())
    .then(items => {
        items.forEach(file => {
            new DesktopItem(file.fileId).create(file.filename, file.type_name);
        });
    })
    .finally(
        () => 
        document.querySelectorAll('div.desktop-item').forEach(item => item.addEventListener('contextmenu', makeFileContextMenu))
    )
    .catch(error => console.error(error))
}

//проверяем, на что кликнули - ярлык, папка, текстовый документ
export const checkFileTypeOnDBLClick = (event) => {
    const target = event.target.parentElement;
    const fileName = target.lastElementChild.textContent;

    if (target.classList.contains('bin')) {
        console.log('bin');
        //new Program('bin').openBin('bin');
    }

    if (target.classList.contains('txt')) {
        fileId = target.dataset.idfile;
        console.log('fileId', fileId);
        // console.log('fileId - 3', fileId - 3);
        new Program('notepad').openTxt(fileName, 'notepad', filesFromDatabase[fileId-3].file_msg);
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

    // getFilesFromDB()
    // .then(res => {
    //     return res.json();
    // })
    // .then(filesFromDatabase => {
    //     let target = event.target.parentElement;
    //     let fileName = target.lastElementChild.textContent;
    //
    // })
}

// получаем ID пользователя из localStorage после авторизации
userId = localStorage.getItem("userId");
if (userId) {
    getUserConfig(userId);
}