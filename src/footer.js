//подмена картинок "Пуск"
export const swapWinLogo = () => {
    document.querySelector('div.task-panel-programm').addEventListener('mouseover', (event) => {
        document.querySelector('img.win').setAttribute('src', './icons/left-panel/win/win-blue.png');
    })
    document.querySelector('div.task-panel-programm').addEventListener('mouseout', (event) => {
        document.querySelector('img.win').setAttribute('src', './icons/left-panel/win/win-white.png');
    })
}

//функция получения и вывода времени
export const setDate = () => {
    //выводим время
    let date = new Date();
    let minutes, hours, seconds, day, month;

    //чекаем, если часов меньше 10 (однозначное число), то добавлячем 0;
    date.getMinutes() < 10 ? minutes = "0" + date.getMinutes() : minutes = date.getMinutes();

    //чекаем, если минут меньше 10 (однозначное число), то добавлячем 0;
    date.getHours() < 10 ? hours = "0" + date.getHours() : hours = date.getHours();

    date.getSeconds()+1 < 10 ? seconds = "0" + (date.getSeconds()+1) : seconds = date.getSeconds();

    //чекаем номер дня
    date.getDate() < 10 ? day = "0" + date.getDate() : day = date.getDate();

    //чекаем номер месяца. +1 потому что 0-11 месяцы считаются
    date.getMonth()+1 < 10 ? month = "0" + (date.getMonth()+1) : month = (date.getMonth()+1);

    //выводим время и дату
    document.querySelector('span.time').textContent = hours + ':' + minutes + ':' + seconds;
    document.querySelector('span.date').textContent = day + '.' + month + '.' + date.getFullYear();
}