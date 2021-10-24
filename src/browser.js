export const URLHandler = () =>
{
    const url = document.querySelector('.browser-search');
    
    url.addEventListener('keyup', (e) =>
    {
        function renderUrl(url)
        {
            //рендер iframe и вставляем ссылку в "адресную строку"
            document.querySelector('.browser-iframe').src = url;
            e.target.value = url;
        }

        let isWWWW = false;

        if (e.key === 'Enter')
        {
            let urlArray = [];
            let urlValue = e.target.value;

            console.log('urlValue: ', urlValue);

            urlArray = urlValue.split('://');
            console.log('urlArray до преобразования адреса: ', urlArray);
            

            if(urlArray[0] !== 'https')
            {
                if (urlArray[0] !== 'http')
                {
                    urlArray = urlValue.split('.');
                }

                if (urlArray.includes('www'))
                {
                    urlArray.splice(urlArray.indexOf('www'), 1);
                }

                //чтобы адрес начинался с https://
                urlArray.unshift('https://');

                //чтобы домен был .(ru)
                urlArray[urlArray.length - 1] = `.${urlArray[urlArray.length - 1]}`;

                if (urlArray.length > 3)
                {
                    for (let i=1; i < urlArray.length - 2; i++)
                    {
                        urlArray[i] = `${urlArray[i]}.`;
                    }
                }

                let newUrl = urlArray.join('');

                renderUrl(newUrl)
            } else if(urlArray[0] === 'https://')
            {
                renderUrl(urlValue);
            }

            console.log('urlArray после преобразования адреса: ', urlArray);
        }
    })
}