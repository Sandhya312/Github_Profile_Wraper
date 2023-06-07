
let user = {};
let userName;
let sidebar = document.getElementById('sidebar');
let mainMenu = document.getElementById('mainMenu');
let overview = document.getElementById('overview');
let repos = [];


// repo analytics
let RepoAnalytics = document.getElementById('RepoAnalytics');
let language_store = {};
let language_store_total = 0;
let language_percentage_store = {};
let num_language = 0;
let num_language_store = {};

if (localStorage.getItem('user_name')) {
    userName = localStorage.getItem('user_name');
} else {
    userName = 'sandhya312';
}

async function Load_User() {
    try {
        await fetch(`https://api.github.com/users/${userName}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Not Found")
                }
            })
            .then(data => {
                user = data;
                sidebar.innerHTML = `
        <div class="profile-info">
        <img src=${user.avatar_url} alt="Profile Image" class="profile-image">
        <h2>${user.name}</h2>
      <a target="_blank" href=${user.html_url}>@${user.login}</a>
      </div>
      <nav class="sidebar-nav">
        <div class="basic-info">
          <div class=" count-div repo-count">
              <p>${user.public_repos}</p>
              <p> Repositories</p>
          </div>
          <div class=" count-div followers-count">
              <p>${user.followers}</p>
              <p>Followers</p>
          </div>
          <div class="count-div followings-count">
              <p>${user.following}</p>
              <p>Following</p>
          </div>
      
        </div>
        <div class="user-info">
          <div class="company">
              <i class='bx bxs-briefcase-alt-2'></i> <p>${user.company}</p>
          </div>
          <div class="joining-date-div">
              <i class='bx bx-calendar'></i> <p>${user.created_at}</p>
          </div>
        </div>
      </nav>
        `
            })
    }
    catch (err) {
        console.log(err);
    }
}

async function Fetch_repos() {
    try {
        await fetch(`https://api.github.com/users/${userName}/repos`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Not Found")
                }
            })
            .then(data => {
                repos = data;

                repos.forEach(repo => {
                    mainMenu.innerHTML += `
            <div class="repo-card" >
            <div class="repo-name">
              <i class="bx bx-folder-open"></i>
              <a target="_blank" href=${repo.html_url}>${repo.name}</a>
            </div>
          
            <div class="repo-footer">
              <div class="footer-left">
                <div class="repo-language">
                  <span class="circle"></span>
                  <p>${repo.language}</p>
                </div>
                <div class="repo-stars">
                  <i class="bx bxs-star"></i>
                  <p>${repo.stargazers_count}</p>
                </div>
                <div class="repo-forks">
                  <i class="bx bx-git-repo-forked"></i>
                  <p>${repo.forks_count}</p>
                </div>
              </div>
              <div class="footer-right">
                <div class="repo-size">
                  <p>${repo.size} KB</p>
                </div>
              </div>
            </div>
          </div>
    
            `
                })

            })
    }
    catch (err) {
        console.log(err);
    }
// sorting 
// Get references to the necessary elements
const sortSelect = document.getElementById('sortSelect');
const repoCards = Array.from(mainMenu.getElementsByClassName('repo-card'));

// Add event listener to the select element
sortSelect.addEventListener('change', () => {
  const selectedValue = sortSelect.value;
  let sortedRepoCards;

  // Sort the repo cards array based on the selected value
  if (selectedValue === 'stars') {
    sortedRepoCards = repoCards.sort((a, b) => {

        const aStars = parseInt(a.querySelector('.repo-stars p').textContent);
        const bStars = parseInt(b.querySelector('.repo-stars p').textContent);

        return bStars - aStars;
    });
  } else if (selectedValue === 'forks') {
    sortedRepoCards = repoCards.sort((a, b) => {
      const aForks = parseInt(a.querySelector('.repo-forks p').textContent);
      const bForks = parseInt(b.querySelector('.repo-forks p').textContent);
 
      return bForks - aForks;
    });

  } else if (selectedValue === 'size') {
    sortedRepoCards = repoCards.sort((a, b) => {
      const aSize = parseInt(a.querySelector('.repo-size p').textContent);
      const bSize = parseInt(b.querySelector('.repo-size p').textContent);

      return bSize - aSize;
    });

  }

  // Remove existing repo cards from the DOM
  repoCards.forEach((card) => card.remove());

  // Append the sorted repo cards back to the DOM
  sortedRepoCards.forEach((card) => mainMenu.appendChild(card));
});


}

async function Repo_Analytics_Repos(labels, datas, usedLang_labels, usedLang_data, topLang_labels, topLang_data) {
    try {
        await fetch(`https://api.github.com/users/${userName}/repos`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Not Found")
                }
            })
            .then(data => {
                repos = data;
            })
        for (let repo of repos) {
            await fetch(repo.languages_url)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('repos is not found');
                    }
                })
                .then(data => {
                    for (let language in data) {
                        if (!language_store[language]) {
                            language_store[language] = data[language];
                        } else {
                            language_store[language] += data[language];
                        }
                        if (!num_language_store[language]) {
                            num_language_store[language] = 1;
                        } else {
                            num_language_store[language] += 1;
                        }
                        num_language++;
                    }
                    if (repo.stargazers_count > 20) {
                        labels.push(repo.name);
                        datas.push(Math.max(repo.stargazers_count));
                    }
                })
        }
        for (let language in num_language_store) {
            if (num_language_store[language] > 1) {
                topLang_labels.push(language);
                topLang_data.push(num_language_store[language]);
            }
        }
        for (let elem in language_store) {
            language_store_total += language_store[elem];
        }
        for (let language in language_store) {
            let percentage_language = (language_store[language] / language_store_total) * 100;
            if (percentage_language >= 1) {
                language_percentage_store[language] = (language_store[language] / language_store_total) * 100;
                usedLang_labels.push(language);
                usedLang_data.push(Math.ceil(percentage_language));
            }

        }
    }
    catch (err) {
        console.log(err);
    }
};

function changeComponent(component_str) {
    if (component_str === 'OverViewComVue') {
        overview.classList.remove('d-none');
        RepoAnalytics.classList.add('d-none');
    } else {
        overview.classList.add('d-none');
        RepoAnalytics.classList.remove('d-none');
    }
}

async function chartDraw() {
    const ctx = document.getElementById("myChart");
    const usedLang = document.getElementById("usedLang");
    const topLang = document.getElementById("topLang");
    let labels = [];
    let datas = [];
    let usedLang_labels = [];
    let usedLang_data = [];
    let topLang_labels = [];
    let topLang_data = [];
    await Repo_Analytics_Repos(labels, datas, usedLang_labels, usedLang_data, topLang_labels, topLang_data);
   
    new Chart(usedLang, {
        type: 'polarArea',
        data: {
            labels: usedLang_labels,
            datasets: [{
                label: 'My First Dataset',
                data: usedLang_data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 205, 86)',
                    'rgb(201, 203, 207)',
                    'rgb(54, 162, 235)'
                ]
            }]
        },

    });

    new Chart(topLang, {
        type: 'doughnut',
        data: {
            labels: topLang_labels,
            datasets: [{
                label: 'My First Dataset',
                data: topLang_data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 96)',
                    'rgb(255, 99, 142)',
                    'rgb(54, 162, 145)',
                    'rgb(255, 305, 86)'
                ],
                hoverOffset: 4
            }]
        },

    });

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Most starred repos",
                    data: datas,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

Load_User();
Fetch_repos();
chartDraw();


