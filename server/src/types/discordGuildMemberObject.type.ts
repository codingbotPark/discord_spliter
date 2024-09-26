import { DiscordUser } from './discordUserObject.type.ts';  // User Object 타입을 미리 정의했다고 가정

export type GuildMember = {
    user?: DiscordUser;  // User Object, 선택적 필드
    nick?: string | null;  // 길드 내의 닉네임, 선택적 필드
    avatar?: string | null;  // 길드 멤버 아바타 해시, 선택적 필드
    roles: string[];  // 역할 ID 배열
    joined_at: string;  // 사용자가 길드에 참여한 ISO8601 타임스탬프
    premium_since?: string | null;  // 사용자가 부스트한 날짜 (ISO8601 타임스탬프), 선택적 필드
    deaf: boolean;  // 서버에서 음소거 상태
    mute: boolean;  // 서버에서 마이크가 꺼진 상태
    pending?: boolean;  // 사용자가 길드 규칙 동의 대기 중인지 여부, 선택적 필드
    permissions?: string;  // 멤버의 권한, 선택적 필드 (OAuth2 관련)
    communication_disabled_until?: string | null;  // 타임아웃이 설정된 시간, 선택적 필드 (ISO8601 타임스탬프)
};

export function isHumanMember(discordUser: GuildMember): discordUser is GuildMember & { user: NonNullable<DiscordUser> } {
    return !!(discordUser.user && !discordUser.user.bot);
}