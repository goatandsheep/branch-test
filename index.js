const { chromium } = require('playwright');

/**
 * @param {String} slashDateString starts with a date MM/dd/YYYY
 */
async function slashDateParser(slashDateString, todayTime) {
    const slashDate = slashDateString.split(' ')[0]
    // I don't usually comment this much but because this seems overcomplicated
    // it doesn't read second fractions
    return new Date(`${slashDate} ${todayTime.split('.')[0]}`)
}

/**
 * @typedef {Object} Candidate
 */

/**
 * @typedef {Object[]} Race
 * @property {Candidate[]} candidates who have qualified for the race
 */
/**
 * @param {String} [electionISO] ISO format YYYY-MM-dd
 * @returns {Race[]}
 */
async function scrapeCandidates(electionISO) {
    const todayDate = new Date()
    /**
     * @type {Date}
     */
    let electionDate = todayDate
    // This matches the time otherwise it is 1 day behind for last 5 hours
    // of the day. There is still the assumption this is being run in
    // Eastern timezone as Georgia is in ET
    const todayTime = todayDate.toISOString().split('T')[1]
    if (electionISO) {
        electionDate = new Date(electionISO + todayTime)
    }
    const electionYear = electionDate.getFullYear()

    // TODO: most recent past election
    // TODO: use this year, but then check list
    const scrapeUrl = 'https://elections.sos.ga.gov/GAElection/CandidateDetails'
    const launchOptions = {
        // proxy: {
        //     server: '123.123.123.123:80',
        // },
        headless: false
    }
    const browser = await chromium.launch(launchOptions);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(scrapeUrl);
    await page.waitForTimeout(5000);

    const yearElement = page.locator('#nbElecYear')

    yearElement.selectOption(`${electionYear}`)
    await page.waitForTimeout(1000); // wait for 1 seconds
    let electionEl = page.locator('#id_election')
    let recentElection
    for (const option of await electionEl.getByRole('option').all()) {
        const optionText = await option.innerHTML()
        if (optionText.indexOf('--') !== 0) {
            let optionDate = await slashDateParser(optionText, todayTime)
            if (optionDate <= electionDate && (!recentElection || optionDate >= recentElection)) {
                recentElection = optionText
                // console.log('varl')
                // console.log(await option.inputValue())
            }
        }
    }

    if (!recentElection) {
        // try previous year
        yearElement.selectOption(electionYear - 1)
        await page.waitForTimeout(1000); // wait for 1 seconds
        electionEl = page.locator('#id_election')
        for (const option of await electionEl.getByRole('option').all()) {
            const optionText = await option.innerHTML()
            if (optionText.indexOf('--') !== 0) {
                let optionDate = await slashDateParser(optionText, todayTime)
                if (!recentElection || optionDate >= recentElection) {
                    recentElection = optionText
                    // console.log(await option.inputValue())
                }
            }
        }
    }
    electionEl.selectOption({label: recentElection})
    await page.waitForTimeout(1000); // wait for 1 seconds

    const submitButton = page.locator('.homeBox > a')
    submitButton.click()
    await page.waitForTimeout(2000); // wait for 2 seconds


    await browser.close();
    // 3. It should pull up the candidate list for the election date given, or the most recent election date if none
    // was given.
    // 4. It should take these candidates / races and turn them into a JSON object. You do not have to do any
    // standardization or cleaning of the data fields.
    return []
}

module.exports = {
    scrapeCandidates
}