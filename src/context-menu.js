const mainElement = document.querySelector('main');

import {clearActiveElements, makeFileActive, renderFiles, getUserInfo} from './desktop';
import {DesktopItem, Program} from "./Classes";

//скрытие контекстного меню
export const deleteContextMenus = () =>
{
    let allContexts = document.querySelectorAll('div.context-menu');
    allContexts.forEach( (item) => {
        item.remove();
    })
    if(!(document.querySelector('.newFile') === null)){
        document.querySelector('.newFile').remove();
    }
}

// функция проверки правильности свойств файла (название, тип)
// принимает в себя тип файла из data-атрибута, сгенерированное в замисимости от типа имя файла
// проверяет, пустое ли имя файла, в правильном ли типе (должен быть Int > 0) пришел тип файла
// возвращает сгенерированный объект FormData для отправки с помощью AJAX.
const prepareFileInfo = (fileType, fileName) =>
{
    let formData = new FormData();

    console.log('fileType', fileType);
    console.log('fileType', fileName);

    if (fileName.trim() !== '') 
    {
        formData.append('name', fileName);
    } else {
        throw new Error('Пустое имя файла!')
    }

    formData.append('type', fileType);

    // TODO добавлять ID пользователя при добавлении файла

    // TODO реализовать гостевую учетную запись

    return formData;
}

/*
функция добавления файла в БД.
Принимает в себя имя файла, и тип файла, которые отдает на проверку функции, описанной выше, 
в поле data получает от неё { FormData }
*/
const insertFileToDb = async (fileTypeToPrepare, fileNameToPpepare) => {
    const response = await fetch("/server/files", {
        method: "POST",
        body: prepareFileInfo(fileTypeToPrepare, fileNameToPpepare),
    })
    const data = await response.text();

    if (response.status >= 200 && response.status < 300) {
        console.log(data)
    }
    else {
        console.error(data);
    }

    renderFiles();
}

export const makeFileContextMenu = (event) => {
    event.preventDefault();

    let newFileContextMenu = document.createElement('div');
    newFileContextMenu.classList.add('context-menu');
    newFileContextMenu.insertAdjacentHTML('afterbegin',
    `
        <ul class="context-menu-item first">
            <li><p class="context-item" style="font-weight: bold;">Открыть</p></li>
        </ul>
            
        <ul class="context-menu-item second">
            <li><p class="context-item">Закрепить на панели задач</p></li>
        </ul>
        
        <ul class="context-menu-item third">
            <li><p class="context-item delete">Удалить</p></li>
            <li><p class="context-item rename">Переименовать</p></li>
        </ul>
    `);

    newFileContextMenu.style.top = `${event.clientY}px`;
    newFileContextMenu.style.left = `${event.clientX}px`;

    deleteContextMenus();
    clearActiveElements();
    makeFileActive(event);

    mainElement.prepend(newFileContextMenu);
}

//открытие контекстного меню
export const makeDesktopContextMenu = (event) =>
{
    //чтобы на файлы тыкая не появлялась контекстая менюшка раюочего стола
    if (
        event.target.classList.contains('desktop-item') ||
        event.target.tagName === 'IMG' ||
        event.target.tagName === 'SPAN'
    ) {
        return;
    }

    let bool = false;
    event.stopPropagation();
    event.preventDefault();
    
    let newDiv = document.createElement('div');
    newDiv.classList.add('context-menu')
    newDiv.insertAdjacentHTML('afterbegin',
    `
    <ul class="context-menu-item first">
        <li><p class="context-item view">View</p></li>
        <li><p class="context-item sort">Sort by</p></li>
        <li><p class="context-item refresh">Refresh</p></li>
    </ul>
    
    <ul class="context-menu-item second">
        <li><p class="context-item paste">Paste</p></li>
        <li><p class="context-item paste-shortcut">Paste shortcut</p></li>
    </ul>

    
    <ul class="context-menu-item third">
        <p class="context-item new">New</p>
    </ul>

    <p class="context-item personalize">Personalize</p>
    `)
    
    newDiv.style.top = `${event.clientY}px`;
    newDiv.style.left = `${event.clientX}px`;

    deleteContextMenus();
    clearActiveElements();
    makeFileActive(event);
    
    mainElement.prepend(newDiv);

    function generateNewFile() {
        //счетчик файлов
        function counterFunc (counter) {
            let innerCounter = counter;
            return function () {
                return ++innerCounter;
            }
        }

        const folderCounter = counterFunc(0);
        const txtCounter = counterFunc(0);

        document.querySelectorAll('div.newFile span.new-desktop-item')
        .forEach(button => {
            button.addEventListener('click', (e) => {
                let fileType = e.currentTarget.dataset.dbtype;
                let fileName = '', tempFileId = 0;

                switch (fileType) {
                    case 'txt':
                        tempFileId = txtCounter();
                        fileName = `Новый текстовый документ ${tempFileId}`;

                        new DesktopItem("").create(fileName, "txt", true);
                        break;

                    case 'folder':
                        tempFileId = folderCounter();
                        fileName = `Новая папка ${tempFileId}`;
                        break;
                    default:
                        break;
                }

                // insertFileToDb(fileType, fileName);
            })
        })
    }

    //добавляет подменю в пункт "Новый" ""
    function createNewFile()
    {
        let newFile = document.createElement('div');
        newFile.classList.add('newFile');
        newFile.insertAdjacentHTML('afterbegin', 
        `
            <span class="new-desktop-item txt" data-dbtype="txt">Текстовый документ</span>
            <span class="new-desktop-item folder" data-dbtype="folder">Папка</span>
        `);

        newFile.style.top = `${event.clientY + 153}px`;
        newFile.style.left = `${event.clientX + 300}px`;

        mainElement.prepend(newFile);

        function contextMenu(event){
            // console.log('1');
            // console.log(event.target);
            if(!(document.querySelector('.newFile') === null)){
                removeNewFile();
            }
            document.querySelector('.context-menu').removeEventListener('mouseover', contextMenu);

        }

        generateNewFile();

        if (bool === false)
        {
            document.querySelector('p.new').addEventListener('mouseleave', () => {  //выход мыши с "New"
                document.querySelector('.context-menu').addEventListener('mouseover', contextMenu) //добавляем событие наведения на контекстное меню
            })
            bool = true;
        }

    }

    function showNewFile(){
        document.querySelector('p.new').addEventListener('mouseover', () => {
            createNewFile();
        })
    }

    function removeNewFile(){
        document.querySelector('.newFile').remove();
    }

    showNewFile();
}
