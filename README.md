# Draft Punks

_Fantasy Football featuring Premier League_ 

## Inspiration
Fantasy Leagues are widespread in North America, Asia and Europe, but are ran inefficiently in web2 platforms: incentives are broken & minimal player interaction observed. Our inspiration is to fix that by running the games onchain, infusing web3 functionality to elevate the game experience

## What it does
Players can register in tournaments and compete against each other by picking their dream squad that will net the most points in a given season (or part of the season).

Player statistics for each game are evaluated as points for each football player, which amounts to players' squad score on each gameweek. We post player points onchain at the end of each gameweek. At the end of the tournament, the player(s) that have amassed the most points win part of the prizepool.

Any player can create their own tournament, granting them a % of the prize pool as rewards!

Squad picks are minted as dynamic NFTs, and can be traded mid-season, effectively passing ownership of tournament entry.

## How we built it
We're using Chainlink Automation + Functions to bring the off-chain data we need onchain.
Using SportsMonks API & Premiership API to fetch that data, and package them efficiently on our own backend.
Frontend is written on React.
We have integrated with Web3Auth + ZeroDev for Account Abstraction MPC wallets with social login, and sponsored transactions to offer seamless UX and security.

## Challenges we ran into
had a hard time with frontend, being rusty on that part of development. took way more time than it should! Also, didn't have the time to write a proper indexer unfortunately :(

## Accomplishments that we're proud of
bringing onchain data for ~750 players proved tricky with the data limits with Functions. We chained Functions fulfill request with recursive calls to make new requests, to trigger consequent updates to data until all stats are updated.

## What's next for Draft Punks
We're planning to add more features both on the UX side (onramp, integrated NFT marketplace, more statistics) as well as additional game options (tournament modes, more sports, add e-sports) and release it on Avalanche C-chain
