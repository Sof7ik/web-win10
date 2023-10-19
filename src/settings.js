import {getUserInfo, getUserConfig} from './desktop';
import desktopBg1 from "/assets/desktop-bg/desktop-bg-1.jpg";
import desktopBg2 from "/assets/desktop-bg/desktop-bg-2.jpg";
import desktopBg3 from "/assets/desktop-bg/desktop-bg-3.jpg";

let colors = [
    '#ff8c00', 
    '#e81123', 
    '#d13438', 
    '#c30052', 
    '#bf0077',
    '#9a0089',
    '#881798',
    '#744da9',
    '#10893e',
    '#107c10',
    '#018574',
    '#2d7d9a',
    '#0063b1',
    '#6b69d6',
    '#8e8cd8',
    '#8764b8',
    '#038387',
    '#486860',
    '#525e54',
    '#7e735f',
    '#4c4a48',
    '#515c6b',
    '#4a5459'
];

let photos = [
    desktopBg1, desktopBg2, desktopBg3,
];

// class DesktopPhoto
// {
//     constructor(index) {
//         this.elem = document.createElement('div');
//         this.elem.dataset.number = index;
//     }
//
//     createPhoto(imageUrl) {
//         this.elem.classList.add('desktop-photo');
//         this.elem.backgroundImage = `url(${imageUrl})`
//     }
//
//     createColor(color)
//     {
//         this.elem.classList.add('desktop-photo');
//         this.elem.backgroundColor = color
//     }
//
//     render() {
//         const renderTo_Elem = document.querySelector('.choosen');
//     }
// }

// сохранение фона рабочего стола для пользователя
async function saveBgToDb (bgToSave) {
    let config = new FormData();

    //если не цвет, узнаем имя картинки
    if (bgToSave.split('/')[2] !== undefined)
    {
        bgToSave = bgToSave.split('/')[2].slice(0, bgToSave.split('/')[2].indexOf('"'));
    }

    config.append('bg', bgToSave);
    config.append('idUser', getUserInfo(window.location.href).id);

    await fetch(`./../php/saveConfig.php`, {
        method: 'POST',
        body: config
    })
        .then(res => res.json())
        .then(text => {
            console.log(text);
            getUserConfig(getUserInfo(window.location.href).id);
        })
}

// вывод блока для выбора фотографии в качестве фона рабочего стола
export function renderPhotoChooseBlock() {
    let html = `
        <div class="choose-photo__wrapper" id="choose-photo">
            <p class="choose-photo__title">Выберите фото</p>
            
            <div class="desktop-photos">`;

photos.forEach((photoSrc, index) => {
    html += `
        <div class="desktop-photo" data-number="${index}">
            <img src="${photoSrc}" alt="desktop-bg-${index}" class="desktop-photo__image">
        </div>`;
})

    html += `</div>
            
            <form enctype="multipart/form-data" action="" method="POST" class="settings__choose-photo-form">
                <input type="hidden" name="MAX_FILE_SIZE" value="30000" />  
                <input type="file" id="select-desktop-image" name="bgImage">
                <label class="select-desktop-image-label" for="select-desktop-image">Обзор</label>
            </form>
        </div>

        <h3 class="choose-pos">Choose position</h3>
        <select id="select-contain-type">
            <option data-position="contain">Contain</option>
            <option data-position="Cover">Cover</option>
            <option data-position="100%">100%</option>
            <option  data-position="background-repeat">background-repeat</option>
        </select>
    `;

    return html;
}

export const ChangeDesktopBgType = () =>
{
    const settingsApplicationContainer = document.querySelector(".application.settings");

    //сам селект
    const selectBgDesktop = settingsApplicationContainer.querySelector('#select-bg-type');

    //при изменении
    selectBgDesktop.addEventListener('change', (event) =>
    {
        // проверяем, какой <option> выбран
        let value = event.target.options.selectedIndex;

        // блок с заголовком и цветами/фотографиями
        let dynamicArea = document.querySelector('.application.settings .background-dynamic-area');
        
        switch (value) {
            case 0: //value = 0 - фотки
                dynamicArea.innerHTML = renderPhotoChooseBlock();
                break;
            
            case 1: //value = 1 - сплошной цвет
                choosen.innerHTML = 
                `
                <h3 id="choose-color">Choose a color</h3>
                <div class="desktop-colors"></div>`;
                
                colors.forEach(element => {     //создаем дивы
                    document.querySelector('.desktop-colors').insertAdjacentHTML('beforeend', 
                    `
                    <div class="desktop-color"></div>
                    `)
                });

                document.querySelectorAll('div.desktop-color').forEach( (item, index) => {  //закрашиваем дивы цветами из массива
                    item.style.backgroundColor = colors[index];
                    item.dataset.num = index;
                })
                document.querySelector('h3.choose-pos').style.display = 'none'; //скрваем нижний блок
                document.getElementById('select-contain-type').style.display = 'none'; //скрваем нижний блок
                break;

            case 2:
                console.log('value =', 2);
                break;

            default:
                break;
        }
        
    });
}

const changeBg = () =>
{
    let newBg;
    if(document.getElementById('choose-photo')) {
        newBg = document.querySelector('.desktop-photo-active img').src;
        // document.querySelector('main').style.backgroundColor = '';
        // document.querySelector('main').style.backgroundImage = newBg;
    }

    if(document.getElementById('choose-color')) {
        newBg = document.querySelector('div.desktop-color-active').style.backgroundColor;
        // document.querySelector('main').style.backgroundImage = 'none';
        // document.querySelector('main').style.backgroundColor = newBg;
    }

    // saveBgToDb(newBg);
}

const clearCurrentColor = (elem) =>
{
    if(elem.classList.contains('desktop-color'))
    {
        let allCurrentColors = document.querySelectorAll('div.desktop-color-active');
        allCurrentColors.forEach( (item) =>
        {
            item.classList.remove('desktop-color-active');
            item.innerHTML = ``;
        })

        elem.classList.add('desktop-color-active')
        elem.innerHTML = `<div class="current-color">✓</div>`;
    }
    if(elem.classList.contains('desktop-photo'))
    {
        let allCurrentColors = document.querySelectorAll('div.desktop-photo-active');
        allCurrentColors.forEach( (item) =>
        {
            item.classList.remove('desktop-photo-active');
        })
        elem.classList.add('desktop-photo-active')
    }
}

export const SelectNewColor = () =>
{
    document.querySelector('.application.settings .background-dynamic-area')
        .addEventListener('click', event => {
        if(document.getElementById('choose-photo')) {
            console.log('Выбор фото');

            if (event.target.dataset.number || event.target.closest(".desktop-photo").dataset.number)
            {
                console.log(event.target.dataset.number);
                event.target.classList.add('desktop-photo-active');
                clearCurrentColor(event.target);
            }
        }

        if(document.getElementById('choose-color'))
        {
            console.log('Выбор цвета');
            if (event.target.dataset.num)
            {
                console.log(event.target.dataset.num);
                event.target.insertAdjacentHTML('afterbegin', `
                <div class="current-color">✓</div>
                `);
                event.target.classList.add('desktop-color-active');
                clearCurrentColor(event.target);
            }
        }
        changeBg();
    })
}

export function imageHandler()
{
    document.getElementById('select-desktop-image').addEventListener('input', (event) => {
        console.log('1');
    })
}
