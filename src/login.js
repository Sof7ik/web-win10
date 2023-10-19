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

function loginGuest() {
    const userConfig = {
        "id": -1,
        "desktopBg": {
            type: "color",
            "value": "#000",
        },
        login: "",
        password: ""
    }
    localStorage.setItem("userConfig", JSON.stringify(userConfig));

    window.location.href = "/index.html";
}

function changeCredentials(event) {
    console.log(event.target);

    if (!event.target.closest("li")) return;

    const accountType = event.target.closest("li").dataset.type;

    if (accountType === "guest") {
        document.querySelector(".bootScreen #username").textContent = "Гость";
        document.querySelector(".bootScreen .password-button-wrapper").classList.add("hidden");
        document.querySelector(".guest-login").classList.remove("hidden");
    }
}

// async function renderUsers () {
//     const response = await fetch('/server/users/?limit=20');
//     const users = await response.text();
//
//     console.log(users);
//
//     if (response.status >= 200 && response.status < 300) {
//         const userlist = document.querySelector('ul.user-list');
//         users.forEach(user => {
//             userlist.insertAdjacentHTML('beforeend',
//                 `
//             <li>
//                 <div class="user-list-person-wrapper">
//                     <div class="person-image">
//                         <img class="person-image" src="./icons/bootScreen/person.png" alt="person-avatar">
//                     </div>
//                     <span>${user[0]}</span>
//                 </div>
//             </li>
//             `)
//         })
//         let lastPass = '';
//         document.querySelectorAll('ul.user-list li').forEach(item => {
//             console.log(item);
//             item.addEventListener('click', (event) => {
//                 if (event.currentTarget.childNodes[1].childNodes[3].textContent !== document.getElementById('username').textContent)
//                 {
//                     errorMessageElem.textContent = '';
//                 }
//                 document.getElementById('username').textContent = event.currentTarget.childNodes[1].childNodes[3].textContent;
//                 document.getElementById('user-password').value = '';
//             })
//         })
//     }
// }

// renderUsers();

document.querySelector(".user-list").addEventListener("click", changeCredentials)
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById("login-guest").addEventListener("click", loginGuest);