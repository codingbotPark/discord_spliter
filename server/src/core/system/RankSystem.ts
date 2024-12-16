

class RankSystem<Ranks extends Record<string, {priority:number}>>{
    
    rankKind:Ranks 
    constructor(rankKind:Ranks){
        this.rankKind = rankKind
    }


    convertRankToScore(rank:string):number {
        if (!rank) return 0
        if (!(rank in this.rankKind)) return 0
        return this.rankKind[rank].priority
    }


    splitWithRankEvenly<T extends Player>(players:T[], teamNumber:number): Array<Player[]> {

        if (teamNumber < 1 || teamNumber > players.length) {throw Error("out of range parameter")}

        const teams:Array<Player[]> = Array.from({length:teamNumber}, () => [])
        const scoredPlayers = players.map((player) => ({...player, score:this.convertRankToScore(player.rank)}))

        const sortedPlayers = scoredPlayers.toSorted((a,b) => b.score - a.score)

        for (let i = 0 ; i < sortedPlayers.length ; i += teamNumber){
            const rangedPlayers = sortedPlayers.slice(i, i + teamNumber )
            if (i % 2 == 0) rangedPlayers.reverse()

            rangedPlayers.forEach((player,idx) => {
                teams[idx].push(player)
            })
        }

        return teams
    }

}

export type Player = {userID:string ,rank:string}


export default RankSystem