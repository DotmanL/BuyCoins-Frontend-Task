const imgValue = document.querySelector('.profile-image')
const username = document.querySelector('.name')
const gitusername = document.querySelector('.git-username')
const followersValue = document.querySelector('.followers')
const gituser = document.querySelector('.git-user')
const gitUserImage = document.querySelector('.git-user-img')
const followingValue = document.querySelector('.following')
const starredValue = document.querySelector('.starred')
const locationValue = document.querySelector('.location')
const emailValue = document.querySelector('.email')
const websiteValue = document.querySelector('.website')
const twitterValue = document.querySelector('.twitter')
const mobileTcount = document.querySelector('.tc')
const repositoriesDiv = document.querySelector('.repositories')
const repositoriesTotalValue = document.querySelector('.repositories-total')

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
      updatedAt
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
	var intervalType

	var interval = Math.floor(seconds / 31536000)
	if (interval >= 1) {
		intervalType = 'year'
	} else {
		interval = Math.floor(seconds / 2592000)
		if (interval >= 1) {
			intervalType = 'month'
		} else {
			interval = Math.floor(seconds / 86400)
			if (interval >= 1) {
				intervalType = 'day'
			} else {
				interval = Math.floor(seconds / 3600)
				if (interval >= 1) {
					intervalType = 'hour'
				} else {
					interval = Math.floor(seconds / 60)
					if (interval >= 1) {
						intervalType = 'minute'
					} else {
						interval = seconds
						intervalType = 'second'
					}
				}
			}
		}
	}

	if (interval > 1 || interval === 0) {
		intervalType += 's'
	}

	return interval + ' ' + intervalType
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
						const { name, description, url, primaryLanguage, stargazerCount, updatedAt } = repo

						const period = timeSince(updatedAt)

						return `
	          <div class="repository-container">
	          <div class="repodetails-container" >
	          <div class="repo-details">
	             <a href=${url} class="repo-name"> ${name} </a>
	             <h4 class="repo-description"> ${description}</h4>
	             <div class="repo-counts">
	             <div class="language-container">
	               <div class="language-bar"> </div>
	               <h4 class="language">${primaryLanguage.name}</h4>
	               <div class="stargazer-icon"> </div>
	               <h4 class="stargazer-count">${stargazerCount}</h4>
	               <h4 class="updated"> Updated ${period} ago </h4>
	               </div>
	          </div>
	        </div>
	        <div class="repo-star">
	        <button class="star-toggle-btn">
	        <div class="stargazer-darkicon"></div>
	        <h4>Star</h4>
	        </button>
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
