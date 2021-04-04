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
