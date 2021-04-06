export interface DebatDay {
    overview: Overview;
    categories: Category[];
    currentDate: Date;
    date: Date;
    debates: Debate[];
    documents: any[];
    liveNotifications: any[];
}

export interface Category {
    id: string;
    name: string;
    debateIds?: string[];
    slug: string;
}

export interface Debate {
    dataQuality: string;
    locationName: string;
    id: string;
    locationId: string;
    slug: string;
    name: string;
    debateType: string;
    debateDate: Date;
    startsAt: string;
    endsAt: string;
    categoryIds: string[];
    categoryNames: string[];
}

export interface Overview {
    currentDate: Date;
    days: { [key: string]: Day };
    categories: Category[];
}

export interface Day {
    locationActors: string;
    date: Date;
    day: string;
    debateCount: number;
    isCurrentDate: boolean;
    location: string;
}

export interface DebateDetails {
    dataQuality?: string;
    locationName?: string;
    duration?: string;
    id?: string;
    meetingId?: string;
    current?: Current;
    events?: Event[];
    locationId?: string;
    slug?: string;
    name?: string;
    debateType?: string;
    debateDate?: Date;
    startsAt?: string;
    endsAt?: string;
    startedAt?: string;
    endedAt?: string;
    categoryIds?: string[];
    categoryNames?: string[];
    introduction?: string;
    documentIds?: any[];
    dossierIds?: any[];
    politicianIds?: string[];
    votings?: any[];
    video?: Video;
    liveNotifications?: any[];
}

export interface Current {
    chairmanId?: string;
    suspendedSince?: string;
}

export interface Event {
    eventStart?: string;
    eventType?: EventType;
    objectId?: string;
}

export enum EventType {
    Chairman = 'chairman',
    DebateEnd = 'debate_end',
    DebatePartEnd = 'debate_part_end',
    DebatePartStart = 'debate_part_start',
    DebateStart = 'debate_start',
    Interrupter = 'interrupter',
    Speaker = 'speaker',
    SpeakerMotionPresent = 'speaker_motion_present',
    Suspended = 'suspended',
}

export interface Video {
    url?: string;
    vodUrl?: string;
    audioUrl?: string;
    imageUrl?: string;
    catchup?: Catchup;
}

export interface Catchup {
    url?: string;
    vodUrl?: string;
    audioUrl?: string;
    type?: string;
}
