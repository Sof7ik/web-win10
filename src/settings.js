import {getUserInfo, getUserConfig} from './desktop';

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
    '../desktop-bg/DSC01142.JPG',
    '../desktop-bg/ken_roczen_suzuki_2015.jpg',
    '../desktop-bg/pepega.jpg',
]

class DesktopPhoto
{
    constructor(index) {
        this.elem = document.createElement('div');
        this.elem.dataset.number = index;
    }

    createPhoto(imageUrl) {
        this.elem.classList.add('desktop-photo');
        this.elem.backgroundImage = `url(${imageUrl})`
    }

    createColor(color)
    {
        this.elem.classList.add('desktop-photo');
        this.elem.backgroundColor = color
    }

    render() {
        const renderTo_Elem = document.querySelector('.choosen');
    }
}

export const ChangeDesktopBgType = () =>
{
    const selectBgDesktop = document.getElementById('select-bg-type'); //сам селект
    selectBgDesktop.addEventListener('change', (event) =>       //при изменении
    {
        let value = event.target.options.selectedIndex;             //чекаем, какой <option> выбран
        let choosen = document.querySelector('.choosen');           // блок с заголовком и цветами/фотографиями
        
        switch (value) {
            case 1: //value = 0 - фотки
                choosen.innerHTML = 
                `<h3 id="choose-photo">Choose a photo</h3>
                <div class="desktop-photos"></div>
                <form enctype="multipart/form-data" action="./php/files.php" method="POST">
                    <input type="hidden" name="MAX_FILE_SIZE" value="30000" />
                    <input type="file" id="select-desktop-image" name="bgImage">
                    <label class="select-desktop-image-label" for="select-desktop-image">Обзор</label>

                    <input type="submit">
                </form>
                `
                document.querySelector('h3.choose-pos').style.display = 'block';
                document.getElementById('select-contain-type').style.display = 'block';

                photos.forEach(() => {
                    document.querySelector('.desktop-photos').insertAdjacentHTML('beforeend',
                    `<div class="desktop-photo"></div>`
                )})

                document.querySelectorAll('div.desktop-photo').forEach((element, index) => {
                    console.log(index);
                    element.style.backgroundImage = `url(${photos[index]})`;
                    element.dataset.number = index;
                });
                break;
            
            case 2: //value = 1 - сплошной цвет                                             
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

            case 3:
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
    if(document.getElementById('choose-photo'))
    {
        newBg = document.querySelector('div.desktop-photo-active').style.backgroundImage;
        // document.querySelector('main').style.backgroundColor = '';
        // document.querySelector('main').style.backgroundImage = newBg;
    }

    if(document.getElementById('choose-color'))
    {
        newBg = document.querySelector('div.desktop-color-active').style.backgroundColor;
        // document.querySelector('main').style.backgroundImage = 'none';
        // document.querySelector('main').style.backgroundColor = newBg;
    }

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

    saveBgToDb(newBg);
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
    document.querySelector('.choosen').addEventListener('click', (event) => {

        if(document.getElementById('choose-photo'))
        {
            console.log('Выбор фото');
            if (event.target.dataset.number)
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
