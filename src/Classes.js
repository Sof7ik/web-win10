import { clearActiveElements } from './desktop';

import {
    ChangeDesktopBgType,
    SelectNewColor
} from './settings';

import { swapExplorerArrows } from './explorer';
import { URLHandler } from './browser';

export class DesktopItem
{
    constructor(id)
    {
        this.el = document.createElement('div');
        this.el.classList.add('desktop-item');
        this.el.dataset.idfile = id;
    }
   
    create(text, what) {
        this.img = document.createElement('img');
        this.img.setAttribute('alt', 'image');
        this.img.classList.add('file-image');

        this.txt = document.createElement('span');
        this.txt.classList.add('file-name');
        this.txt.innerText = text

        this.el.insertAdjacentElement('beforeend', this.img);
        this.el.insertAdjacentElement('beforeend', this.txt);
        
        if (what == 'folder')
        {
            this.el.classList.add('folder');
            this.img.setAttribute('src', '../icons/desktop-icons/folder.png');
            this.img.classList.add('folder');
            
            
        } else if (what == 'txt') {
            this.el.classList.add('txt');
            this.img.setAttribute('src', '../icons/desktop-icons/txt.png');
            this.img.classList.add('txt');
        }

        document.querySelector('.desktop-wrapper').insertAdjacentElement('beforeend', this.el);
    }
}

export class Program
{
    //what MUST BE like "explorer", "notepad", "browser", "settings" so like classes in CSS
    constructor(what)
    {
        this.Zindex = 2;
        this.element = document.createElement('div');
        this.element.classList.add(what, 'activeProg');
        this.element.style.zIndex = this.zIndex;
        this.zIndex++;
    }

    //создаем передвижение программ
    dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.querySelector('div.left-programm-title')) {
            /* if present, the header is where you move the DIV from:*/
            document.querySelector('div.left-programm-title').onmousedown = dragMouseDown;
        }
        else
        {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }
    
        function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        }
    
        function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    
        function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        }
    }

    openTxt(fileName, what, msg = '', isNew = 0)
    {
        let aboutMeValue = '';

        msg === null ? aboutMeValue = '' : aboutMeValue = msg;

        // aboutMeValue = `Привет, я учусь в Щелковской шараге на 3 курсе на web-разраба. Вроде как фулл стэк, но даже код для этого проекта я частично Ctrl+C — Ctrl+V...`;

        this.element.dataset.isNew = isNew === 1 ? '1' : '0';

        this.element.insertAdjacentHTML('afterbegin', `
            <div class="title">
                <div class="left-programm-title">
                    <img class="programm-icon" src="./icons/programm-icons/notepad.png" alt="icon">
                    <span class="programm-title">${fileName} — Notepad</span>
                </div>

                <div class="right-programm-title">
                    <span class="programm-change-size semi-close" style="color: #000;">—</span>
                    <img class="programm-change-size full-window" src="./icons/programm-icons/full-window.png" alt="full-window" style="color: transparent;">
                    <!-- <img class="programm-change-size close" src="./icons/programm-icons/close.png" alt="close"> -->
                    <span class="programm-change-size close" style="color: #000;">×</span>
                </div>
            </div>
            
            <nav class="notepad-nav">
                <a class="notepad-navigation-item file">File  
                    <ul class="lists-wrapper">
                        <li>
                            <ul>
                                <li><span class="notepad-menu-item">Создать</span></li>
                                <li><span class="notepad-menu-item">Открыть</span></li>
                                <li><span class="active_nav_item notepad-menu-item" id="notepad-save-document">Сохранить</span></li>
                                <li><span class="active_nav_item notepad-menu-item" id="notepad-saveAs-document">Сохранить как...</span></li>
                            </ul>
                        </li>
                        <li>
                            <ul>
                                <li><span>Параметры страницы</span></li>
                                <li><span>Печать</span></li>
                            </ul>
                            
                        </li>
                        <li>
                            <ul>
                                <li><span>Выход</span></li>
                            </ul>
                        </li>
                    </ul>
                    
                </a>
                <a class="notepad-navigation-item">Edit</a>
                <a class="notepad-navigation-item">Format</a>
                <a class="notepad-navigation-item">View</a>
                <a class="notepad-navigation-item">HELP</a>
            </nav>

            <div class="notepad-text">
                <textarea name="notepad-message" id="" class="notepad-textarea" resize>${aboutMeValue}</textarea>
            </div>
        `); 
        this.giveAllFuncs(what);
    }

    openFolder(fileName, what)
    {
        this.element.insertAdjacentHTML('afterbegin', `
            <div class="title">
                <div class="left-programm-title left-explorer-title">
                    <img class="explorer-icon" src="./icons/programm-icons/explorer.png" alt="logo">
                    <span class="programm-title">${fileName}</span>
                </div>
                    
                <div class="right-programm-title right-explorer-title">
                    <span class="programm-change-size semi-close">—</span>
                    <img class="programm-change-size full-window" src="./icons/programm-icons/full-window.png" alt="full-window">
                    <!-- <img class="programm-change-size close" src="./icons/programm-icons/close.png" alt="close"> -->
                    <span class="programm-change-size close">×</span>
                </div>
            </div>
            <nav class="explorer-nav">
                <a class="explorer-navigation-item active-explorer-navigation-item">File</a>
                <a class="explorer-navigation-item">Home</a>
                <a class="explorer-navigation-item">Share</a>
                <a class="explorer-navigation-item">View</a>
            </nav>
            <div class="search">
                <div class="arrows">
                    <img src="./icons/programm-icons/to-arrow.png" alt="left arrow" class="left-arrow search-arrow">
                    <img src="./icons/programm-icons/to-arrow.png" alt="right arrow" class="right-arrow search-arrow">
                    <img src="./icons/programm-icons/to-arrow white.png" alt="up arrow" class="up-arrow search-arrow">
                </div>
                <input type="text" name="search" class="main-search-input">
                <input type="text" name="second-search" class="second-search-input" placeholder="Search: Desktop">
            </div>

            <div class="main-content">
                <aside class="left-list">
                    <ul>
                        <li class="list">Desktop
                            <ul class="inner-ul">
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                                <li class="list">Быстрый доступ</li>
                            </ul>
                        </li>        
                    </ul>
                </aside>
                <section class="explorer-content-wrapper">
                    <div class="desktop-item bin">
                        <img class="bin" src="./icons/desktop-icons/bin.png" alt="Bin">
                        <span class="file-name">Корзина</span>
                    </div>

                    <div class="desktop-item folder">
                        <img class="folder" src="./icons/desktop-icons/folder.png" alt="Folder">
                        <span class="file-name">Новая папка</span>
                    </div>

                    <div class="desktop-item txt">
                        <img class="txt" src="./icons/desktop-icons/txt.png" alt="Txt-file">
                        <span class="file-name">aboutMe.txt</span>
                    </div>

                    <div class="desktop-item shortcut">
                        <img class="shortcut" src="./icons/desktop-icons/txt.png" alt="shortcut">
                        <span class="file-name">Имя ярлыка</span>
                    </div>
                </section>
            </div>

            <div class="explorer-footer">
                <p class="explorer-footer-element-count">Элементов: 29</p>
            </div>
        `); 
        this.giveAllFuncs(what);
        swapExplorerArrows();
    }

    openBrowser(link = 'https://vk.com/im', what)
    {
        this.element.insertAdjacentHTML('afterbegin', `
            <div class="browser-title">
                <div class="left-programm-title left-browser-title">
                    <div class="browser-tab">
                        <p class="tab-name">${link}</p>
                    </div>
                </div>
                    
                <div class="right-programm-title right-browser-title">
                    <span class="programm-change-size semi-close">—</span>
                    <img class="programm-change-size full-window" src="./icons/programm-icons/full-window.png" alt="full-window">
                    <!-- <img class="programm-change-size close" src="./icons/programm-icons/close.png" alt="close"> -->
                    <span class="programm-change-size close">×</span>
                </div>
            </div>
            <div class="browser-navigate">
                <div class="buttons">
                    <img src="./icons/programm-icons/to-arrow.png" alt="left arrow" class="left-arrow search-arrow">
                    <img src="./icons/programm-icons/to-arrow.png" alt="right arrow" class="right-arrow search-arrow">
                    <img src="./icons/programm-icons/redo.png" alt="redo" class="up-arrow search-arrow">
                </div>
                <div class="browser-search">
                    <input type="text" name="" class="browser-search" placeholder="Введите поисковой запрос в Google или укажите URL" value=${link}>
                </div>
                <div class="addons">
                    <div class="addon" data-addon-id="1"></div>
                    <div class="addon" data-addon-id="2"></div>
                    <div class="addon" data-addon-id="3"></div>
                    <div class="addon" data-addon-id="4"></div>
                </div>
            </div>
            <div class="main">
                <iframe src="${link}" class="browser-iframe"></iframe>
            </div>
            <div class="browser-footer">
                <p>Привет я хром</p>
            </div>
        `);
        this.giveAllFuncs(what);
        URLHandler();
    }

    openBin(what)
    {
        console.log('From function:', "Bin opened");
        this.giveAllFuncs(what);
    }

    openSettings(what)
    {
        this.element.style.height = '100vh';
        this.element.style.width = '100vw';
        this.element.insertAdjacentHTML('afterbegin',
        `
        <aside class="left">
                <div class="left-title">
                    <div class="left-programm-title">
                        <span class="settings-title">Parametrs</span>
                    </div>
                </div>

                <div class="first-setting-div">

                    <div class="setting-item" style="margin-bottom: 10px;">
                        <p class="setting-item home">Home</p>
                    </div>

                    <form class="setting-search">
                        <input type="text" placeholder="Search for parametr" class="search-input-text">
                        <input type="submit" class="search-btn" value="">
                    </form>
                    
                    <p class="parametr-name">Personalize</p>

                </div>
                
                <ul class="all-settings">
                    <li>
                        <div class="setting-item">
                            <p class="setting-item desktop-bg">Desktop background</<p>
                        </div>
                    </li>

                    <li>
                        <div class="setting-item">
                            <p class="setting-item desktop-bg">Colors</<p>
                        </div>
                    </li>

                    <li>
                        <div class="setting-item">
                            <p class="setting-item desktop-bg">Login screen</<p>
                        </div>
                    </li>

                    <li>
                        <div class="setting-item">
                            <p class="setting-item desktop-bg">Themes</<p>
                        </div>
                    </li>

                    <li>
                        <div class="setting-item">
                            <p class="setting-item desktop-bg">Fonts</p>
                        </div>
                    </li>
                </ul> 
            </aside>

            <aside class="right">
                <div class="right-programm-title right-settings-title"> 
                    <span class="programm-change-size semi-close">—</span>
                    <img class="programm-change-size full-window" src="./icons/programm-icons/full-window.png" alt="full-window">
                    <!-- <img class="programm-change-size close" src="./icons/programm-icons/close.png" alt="close"> -->
                    <span class="programm-change-size close">×</span>
                </div>

                <h1 class="right-aside-title">Desktop background</h1>

                <img class="desktop-bg-example" src="./settings/desktop-bg-example-1.png" alt="">

                <h3>Background</h3>
                <select id="select-bg-type">
                    <option></option>
                    <option>Photo</option>
                    <option>Color</option>
                    <option>Slides</option>
                </select>

                <div class="choosen">
                    <form enctype="multipart/form-data" action="./php/files.php" method="POST">
                        <input type="hidden" name="MAX_FILE_SIZE" value="30000" />
                        <input type="file" id="select-desktop-image" name="bgImage">
                        <label class="select-desktop-image-label" for="select-desktop-image">Обзор</label>

                        <input type="submit">
                    </form>
                </div>

                <h3 class="choose-pos">Choose position</h3>
                <select id="select-contain-type">
                    <option data-position="contain">Contain</option>
                    <option data-position="Cover">Cover</option>
                    <option data-position="100%">100%</option>
                    <option  data-position="background-repeat">background-repeat</option>
                </select>
                
            </aside>
        `)
        this.giveAllFuncs(what);
        ChangeDesktopBgType();
        SelectNewColor();
        document.querySelector('input.search-btn').addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Searching...');
        })
    }

    //закрытие программы
    closeProgramm (event) 
    {
        event.target.parentElement.parentElement.parentElement.remove();
    }

    //развёртывание на полный экран
    fullWindow (event) 
    {
        let parentElement = event.target.parentElement.parentElement.parentElement;
        if (parentElement.style.height == '100vh' && parentElement.style.width == '100vw')
        {
            console.log("parentElement.style.height == '100vh' && parentElement.style.width == '100vw'");
            parentElement.style.top = '7%';
            parentElement.style.left = '14%';
            parentElement.style.height = '50%';
            parentElement.style.width = '60%';
        } else {
            console.log("parentElement.style.height !== '100vh' && parentElement.style.width !== '100vw'");
            parentElement.style.top = '0px';
            parentElement.style.left = '0px';
            parentElement.style.height = '100vh';
            parentElement.style.width = '100vw';
        }
    }

    //сворачивание окна
    semiCloseWindow (event)
    {
        let parentElement = event.target.parentElement.parentElement.parentElement;
        parentElement.style.opacity = 0.3;
    }
    
    giveAllFuncs(what)
    {
        const mainElement = document.querySelector('main');
        mainElement.insertAdjacentElement('afterbegin', this.element);
        this.dragElement(document.querySelector(`div.${what}`));
        clearActiveElements();
        document.querySelector('span.close').addEventListener('click', this.closeProgramm);
        document.querySelector('img.full-window').addEventListener('click', this.fullWindow);
        document.querySelector('span.semi-close').addEventListener('click', this.semiCloseWindow);
    }
}

// document.getElementById('createFolder').addEventListener('click', () => {
//     new DesktopItem().create('Новая папка', 'folder');
// })

// document.getElementById('createText').addEventListener('click', () => {
//     new DesktopItem().create('Новая текстовый файл', 'txt');
// })