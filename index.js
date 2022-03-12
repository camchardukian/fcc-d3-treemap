document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
    if (!response.ok) {
        const errorMessage = `An error has occured: ${response.status}`
        throw new Error(errorMessage)
    }
    const data = await response.json()
    const videoGamesData = data?.children
    console.log('videoGamesData', videoGamesData)
})