import { Schema, model, Document, Types } from "mongoose";

interface IBookmark extends Document {
  user: Types.ObjectId;
  articleUrl: string;
}

const bookmarkSchema = new Schema<IBookmark>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  articleUrl: { type: String, required: true },
});

bookmarkSchema.index({ user: 1, articleUrl: 1 }, { unique: true });

const Bookmark = model<IBookmark>("Bookmark", bookmarkSchema);

export default Bookmark;
