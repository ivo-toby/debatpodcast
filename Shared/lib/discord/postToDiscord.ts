import axios from 'axios';

export async function postToDiscord(type: string, message: string, content: any): Promise<boolean> {
    axios.post(process.env.PIPEDREAM_URL, {
        type,
        message,
        content,
    });
    return true;
}
