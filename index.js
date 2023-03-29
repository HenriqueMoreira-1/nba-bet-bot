const puppeteer = require('puppeteer');

async function nbaBotBet() {
    const browser = await puppeteer.launch({headless: false});
    const newPage = await browser.newPage();
    await newPage.goto('https://www.nba.com/games');

    // Espera até que os elementos com os placares dos jogos sejam carregados na página
    await newPage.waitForSelector('.MatchupCardScore_p__dfNvc.GameCardMatchup_matchupScoreCard__owb6w');

    // Extrai os placares dos jogos da página
    const score = await newPage.evaluate(() => {
        const scores = [];
        const scoreElements = Array.from(document.querySelectorAll('.MatchupCardScore_p__dfNvc.GameCardMatchup_matchupScoreCard__owb6w'));
        scoreElements.forEach((el, index) => {
          const score = el.innerText;
          if (index % 2 === 0) {
            // placar do time visitante
            scores.push(score.split(' - ')[0]);
          } else {
            // placar do time da casa
            scores[scores.length - 1] += ` - ${score.split(' - ')[0]}`;
          }
        });
        return scores;
      });

    console.log(score);

    const largePointDiffGames = score.filter(score => {
        const [awayScore, homeScore] = score.split(' - ').map(Number);
        const pointDiff = Math.abs(awayScore - homeScore);
        return pointDiff >= 17;
      });
    
      console.log(largePointDiffGames);

    await browser.close();
};

nbaBotBet();