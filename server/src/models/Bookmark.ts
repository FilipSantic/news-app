import { Schema, model, Document, Types } from "mongoose";

interface IBookmark extends Document {
  user: Types.ObjectId;
  article: {
    title: string;
    category: string;
    author: string;
    url: string;
    urlToImage: string;
  };
}

const bookmarkSchema = new Schema<IBookmark>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  article: {
    title: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: false },
    url: { type: String, required: true },
    urlToImage: { type: String, required: false },
  },
});

bookmarkSchema.index({ user: 1 }, { unique: false });

const Bookmark = model<IBookmark>("Bookmark", bookmarkSchema);

export default Bookmark;
