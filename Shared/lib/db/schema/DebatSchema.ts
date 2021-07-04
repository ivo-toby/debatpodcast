import { Schema } from 'mongoose';

export interface Person {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    title: string;
}

export interface Event {
    eventStart: Date;
    eventType: string;
    person: Person;
}

export interface Video {
    url: string;
    vodUrl: string;
    audioUrl: string;
    imageUrl: string;
}

export interface DebatCategory {
    id: string;
    name: string;
}

export interface Debat {
    locationName: string;
    duration: number; // parse time to int
    id: string;
    meetingId: string;
    chairman: Person; // map current.chairmanId to person object
    events: Event[];
    locationId: string;
    name: string;
    debateType: string;
    debateDate: string;
    startsAt: Date;
    endsAt: Date;
    startedAt: Date;
    endedAt: Date;
    categories: DebatCategory[];
    introduction: string;
    politicianIds: Person[]; // map id's to person objects
    video: Video;
}

export const DebatSchema = new Schema<Debat>({
    locationName: { type: String, required: true },
    duration: { type: Number, required: true },
    id: { type: String, required: true },
    meetingId: { type: String, required: true },
    chairman: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        title: { type: String, required: false }
    },
    events: [{
        eventStart: { type: Date, required: true },
        eventType: { type: String, required: false },
        person: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            firstName: { type: String, required: false },
            lastName: { type: String, required: false },
            title: { type: String, required: false }
        }
    }],
    locationId: { type: String, required: false },
    name: { type: String, required: true },
    debateType: { type: String, required: true },
    debateDate: { type: Date, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    categories: [{
        id: { type: String, required: true },
        name: { type: String, required: true }
    }];
    introduction: { type: String, required: false },
    politicianIds: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        title: { type: String, required: false }
    }],
    video: {
        url: { type: String, required: true },
        vodUrl: { type: String, required: true },
        audioUrl: { type: String, required: true },
        imageUrl: { type: String, required: true }
    }
});