export interface Player {
    player_id: string;
    player_status: 'visitor' | 'player';
    user_name: string;
    email: string;
    is_email_verified: boolean;
    photo_url?: string;
}

export function CreatePlayer(playerId: string, userName?: string, email?: string, emailVerified?: boolean, photoUrl?: string): Player {
    return {
        player_id: playerId,
        player_status: 'visitor',
        user_name: userName || '',
        email: email || '',
        is_email_verified: emailVerified || false,
        photo_url: photoUrl,
    }
}
