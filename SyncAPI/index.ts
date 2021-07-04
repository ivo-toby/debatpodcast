import { AzureFunction, Context } from '@azure/functions';
import mongoose from 'mongoose';

const timerTrigger: AzureFunction = async (context: Context, myTimer: any): Promise<void> => {
    const timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        console.log('TIME PAST DUE');

        const connection = await mongoose.connect(process.env.MONGO_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        const Schema = mongoose.Schema;

        const BlogPostSchema = new Schema({
            author: String,
            title: String,
            body: String,
            date: Date
        });

        const BlogModel = mongoose.model('Blog', BlogPostSchema);
        const blog = new BlogModel({
            author: 'ivo',
            title: 'BlogPost',
            body: '<h1>Blogpost</h1><p>paragraph</p>',
            date: new Date()
        });
        try {
            const result = await blog.save();
            console.log(result)
        } catch (error) {
            console.error(error)
        }

    }
    context.log('Timer trigger function ran!', timeStamp);
};
export default timerTrigger;
