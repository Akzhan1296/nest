export class CreateComment {
  constructor(
    private _userId,
    private _userLogin,
    private _content,
    private _addedAt,
    private _postId,
  ) {}
}
