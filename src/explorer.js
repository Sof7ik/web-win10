//подмена картинок в проводнике
export const swapExplorerArrows = () => {
    document.querySelector('img.left-arrow').addEventListener('mouseover', (event) => {
        document.querySelector('img.left-arrow').setAttribute('src', './icons/programm-icons/to-arrow blue.png');
    })
    document.querySelector('img.left-arrow').addEventListener('mouseout', (event) => {
        document.querySelector('img.left-arrow').setAttribute('src', './icons/programm-icons/to-arrow white.png');
    })
}