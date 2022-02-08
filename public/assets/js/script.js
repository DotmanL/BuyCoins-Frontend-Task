const imgValue = document.querySelector('.profile-image')
const username = document.querySelector('.name')
const gitusername = document.querySelector('.git-username')
const followersValue = document.querySelector('.followers')
const gituser = document.querySelector('.git-user')
const gitUserImage = document.querySelector('.git-user-img')
const smallGitImage = document.querySelector('.small-img')
const followingValue = document.querySelector('.following')
const starredValue = document.querySelector('.starred')
const locationValue = document.querySelector('.location')
const emailValue = document.querySelector('.email')
const websiteValue = document.querySelector('.website')
const twitterValue = document.querySelector('.twitter')
const mobileTcount = document.querySelector('.tc')
const repositoriesDiv = document.querySelector('.repositories')
const repositoriesTotalValue = document.querySelector('.repositories-total')
const tabProfileImage = document.querySelector('.tab-profile-image')
const tabUsername = document.querySelector('.tab-username')

const profileQuery = {
	query: ` 	query {
  viewer {
 avatarUrl
 name
 login
 followers(first: 10) {
   totalCount
 }
 following(first: 10) {
   totalCount
 }
 starredRepositories(first:40) {
   totalCount
 }
 location
 email
 websiteUrl
 twitterUsername
}
}`,
}

const repositoryQuery = {
	query: ` query {
repositoryOwner(login: "DotmanL") {
  repositories(first: 20  orderBy: {field: UPDATED_AT, direction: DESC} ) {
    nodes {
      name
      description
      url
      stargazerCount
      pushedAt
      primaryLanguage {
        name
      }
    }
    totalCount
  }
}
}
`,
}

const timeSince = (date) => {
	if (typeof date !== 'object') {
		date = new Date(date)
	}

	var seconds = Math.floor((new Date() - date) / 1000)

	var interval = Math.floor(seconds / 31536000)
	if (interval >= 1) {
		var options = { month: 'short', day: 'numeric', year: 'numeric' }
		const fineDate = new Intl.DateTimeFormat('dd-mm', options).format(date)
		intervalType = 'on' + ' ' + fineDate
	} else {
		interval = Math.floor(seconds / 2592000)
		if (interval >= 1) {
			var options = { month: 'short', day: 'numeric' }
			const fineDate = new Intl.DateTimeFormat('dd-mm', options).format(date)
			intervalType = 'on' + ' ' + fineDate
		} else {
			interval = Math.floor(seconds / 86400)
			if (interval >= 1) {
				intervalType = interval + ' ' + 'days ago'
			} else {
				interval = Math.floor(seconds / 3600)
				if (interval >= 1) {
					intervalType = interval + ' ' + 'hours ago'
				} else {
					interval = Math.floor(seconds / 60)
					if (interval >= 1) {
						intervalType = interval + ' ' + 'minutes ago'
					} else {
						interval = seconds
						intervalType = interval + ' ' + 'seconds ago'
					}
				}
			}
		}
	}

	if (interval === 0) {
		intervalType += 's'
	}

	return intervalType
}

window.addEventListener('DOMContentLoaded', () => {
	const userProfile = fetch('../../../.netlify/functions/token-hider', {
		method: 'POST',
		body: JSON.stringify(profileQuery),
	}).then((profileData) => profileData.json())

	userProfile.then((profileData) => {
		Object.keys(profileData).forEach((key) => {
			let values = profileData[key]
			const {
				avatarUrl,
				email,
				followers,
				following,
				starredRepositories,
				location,
				login,
				name,
				twitterUsername,
				websiteUrl,
			} = values.viewer

			imgValue.src = avatarUrl
			username.textContent = name
			smallGitImage.src = avatarUrl
			gitusername.textContent = login
			followersValue.textContent = followers.totalCount
			followingValue.textContent = following.totalCount
			gituser.textContent = login
			gitUserImage.src = avatarUrl
			starredValue.textContent = starredRepositories.totalCount
			locationValue.textContent = location
			emailValue.href = `mailto:${email}`
			emailValue.textContent = email
			websiteValue.textContent = websiteUrl
			websiteValue.href = `https://${websiteUrl}`
			twitterValue.textContent = twitterUsername
			twitterValue.href = `https://twitter.com/${twitterUsername}`
			tabProfileImage.src = avatarUrl
			tabUsername.textContent = login
		})
	})

	const userRepository = fetch('../../../.netlify/functions/token-hider', {
		method: 'POST',
		body: JSON.stringify(repositoryQuery),
	})
		.then((repoData) => repoData.json())
		.catch((error) => {
			console.error('Error:', error.message)
		})

	userRepository.then((repoData) => {
		Object.keys(repoData).forEach((key) => {
			let repoOwners = repoData[key]

			Object.keys(repoOwners).forEach((key) => {
				let repositories = repoOwners[key]

				Object.values(repositories).forEach((key) => {
					let repototal = key

					repositoriesTotalValue.textContent = repototal.totalCount
					mobileTcount.textContent = repototal.totalCount
				})

				Object.keys(repositories).forEach((key) => {
					let repos = repositories[key]

					let repoValues = repos.nodes.map((repo) => {
						const { name, description, url, primaryLanguage, stargazerCount, pushedAt } = repo

						const period = timeSince(pushedAt)

						const language = primaryLanguage.name

						return `
	          <div class="repository-container">
	          <div class="repodetails-container" >
						<div class="repo-details">
								<div class="repo-main">
	             <a href=${url} class="repo-name"> ${name} </a>
							 <h4 class="repo-description"> ${description}</h4>
							 </div>
							 <div class="repo-star">
							 <button class="star-toggle-btn">
							 <div class=${stargazerCount === 0 ? 'stargazer-whiteicon' : 'stargazer-darkicon'}></div>
							 <h4 class="stargazer-label">${stargazerCount === 0 ? 'Star' : 'Unstar'}</h4>
							 </button>
							</div>
							 </div>
	             <div class="repo-counts">
	             <div class="language-container">
								 <div class=
								 ${
										(language === 'JavaScript' && 'language-icon') ||
										(language === 'CSS' && 'language-icon-css') ||
										(language === 'HTML' && 'language-icon-html') ||
										(language === 'TypeScript' && 'language-icon-typescript')
									}
								 ></div>
	               <h4 class="language">${primaryLanguage.name}</h4>
	               <div class="stargazer-icon"> </div>
	               <h4 class="stargazer-count">${stargazerCount}</h4>
	               <h4 class="updated"> Updated ${period}</h4>
	               </div>
	          </div>
	       
	      
	         </div>
					</div>
					
				
					`
					})

					repoValues = repoValues.join('')

					repositoriesDiv.innerHTML = repoValues
				})
			})
		})
	})
})
