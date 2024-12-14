import { ConnectionService } from "discord.js";
import GameAPI from "../../../../gameAPI/GameAPI";
import OverwatchAPI, { Profile } from "overwatch-api";
import SplitWithProfile from "../../../../core/strategy/SplitWithProfile";
import { OverwatchPositions, OverwatchRanks, OverwatchSplitAPI } from "./overwatch";

class OverwatchSplitWithProfile extends SplitWithProfile<Profile>{
    connectionService=ConnectionService.BattleNet

    maxPeopleNumber:number | undefined;
    game:OverwatchSplitAPI
    constructor(game:OverwatchSplitAPI){
        super()
        this.game = game
    }
    
    getProfileWithConnectionID(id:string):Promise<Profile | null>{
        const formattedTag = id.replace('#', '-');
        const platform = 'pc';
        const region = 'kr';
        
        return new Promise<Profile | null>((resolve, reject) => {
            OverwatchAPI.getProfile(platform, region, formattedTag, (err, json) => {
                if (err) {
                    // API 에러 처리
                    resolve(null); // 또는 reject(`Error fetching profile: ${err.message}`);
                } else {
                    resolve(json);
                }
            });
        }).catch(error => {
            console.error(error);
            return null;
        });
    }

    // profile:Profile, but library type is not matching
    getRankFromProfile(profile: any): {rank:OverwatchRanks} {
        // library wrong => edit number to string
        // there are no open tier
        const ranks = [
            { position: OverwatchPositions.Tank, rank: profile.competitive?.tank?.rank },
            { position: OverwatchPositions.Offense, rank: profile.competitive?.offense?.rank },
            { position: OverwatchPositions.Support, rank: profile.competitive?.support?.rank },
            { position: OverwatchPositions.Open, rank: profile.competitive?.open?.rank }
        ]

        // get highest rank
        const calcObj = ranks.reduce((obj: { rank:OverwatchRanks , score: number }, curr) => {
            const rank = this.extractRank(curr.rank)
            const calcValue = this.game.rankSystem.convertRank(rank)
            return calcValue > obj.score ? { rank: rank, score: calcValue } : obj
        }, { rank: 'Unknown', score: 0 })

        return calcObj
    }

    private extractRank(rankString?: string): OverwatchRanks {
        if (!rankString) return 'Unknown'
        const rank = rankString.split(" ")[0].split("_")[1]
        return rank as OverwatchRanks
    }
    
}

export default OverwatchSplitWithProfile