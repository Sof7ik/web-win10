const errorMessageElem = document.getElementById('error-message');

function login(event) 
{
    event.preventDefault();
    let username = document.getElementById('username').textContent;
    let password = document.getElementById('user-password').value.trim();

    let formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    fetch('./../php/loginInWin.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(unjsoned => {
        if (unjsoned !== null)
        {
            window.location.href = `./../index.html?id=${unjsoned.userId}`;
        }
        else
        {
            errorMessageElem.textContent = 'Введен неправильный пароль';
        }
    })
}

async function getUsers() {
    return await fetch('./../php/getAllUsers.php');
} 

async function renderUsers () {
    await getUsers().then(res => res.json())
    .then(users => {
        const userlist = document.querySelector('ul.user-list');
        users.forEach(user => {
            userlist.insertAdjacentHTML('beforeend',
            `
            <li>
                <div class="user-list-person-wrapper">
                    <div class="person-image">
                        <img class="person-image" src="./icons/bootScreen/person.png" alt="person-avatar">
                    </div>
                    <span>${user[0]}</span>
                </div>
            </li>
            `)
        })
        let lastPass = '';
        document.querySelectorAll('ul.user-list li').forEach(item => {
            console.log(item);
            item.addEventListener('click', (event) => {
                if (event.currentTarget.childNodes[1].childNodes[3].textContent !== document.getElementById('username').textContent)
                {
                    errorMessageElem.textContent = '';
                }
                document.getElementById('username').textContent = event.currentTarget.childNodes[1].childNodes[3].textContent;
                document.getElementById('user-password').value = '';
            })
        })
    })
}

renderUsers();

document.getElementById('login-btn').addEventListener('click', login);