export interface Player {
    playerId: string;
    playerStatus: 'visitor' | 'player';
    userName: string;
    email: string;
    emailVerified: boolean;
    photoUrl?: string;
    savedGamesId: string[];
}

export function CreatePlayer(playerId: string, userName?: string, email?: string, emailVerified?: boolean, photoUrl?: string): Player {
    return {
        playerId: playerId,
        playerStatus: 'visitor',
        userName: userName || '',
        email: email || '',
        emailVerified: emailVerified || false,
        photoUrl: photoUrl,
        savedGamesId: []
    }
}

export interface RegionPlayerActivity {
    regionId: string;
    playerId: string;
    is_explored: boolean;
    is_colonized: boolean;
    explored_percent: number;
}