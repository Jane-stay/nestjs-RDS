import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';

@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>) {
    const postRepository = event.manager.getRepository(Post);

    await postRepository.increment(
      { id: event.entity.post.id },
      'commentCount',
      1,
    );
  }

  async afterRemove(event: RemoveEvent<Comment>) {
    const postRepository = event.manager.getRepository(Post);
    const commentRepository = event.manager.getRepository(Comment);

    // const count = await commentRepository
    //   .createQueryBuilder('c')
    //   .where('c.id = :id', { id: event.entity?.id })
    //   .orWhere('c.parentId = :id', { id: event.entity?.id })
    //   .getCount();

    // await postRepository.decrement(
    //   { id: event.entity?.post.id }, //removeComment service에서 post relation으로 가져와야함함
    //   'commentCount',
    //   count,
    // );  이 코드는 beforeRemove 일 때

    const count = 1 + (event.entity?.replies?.length || 0);
    await postRepository.decrement(
        { id: event.entity?.post.id }, //removeComment service에서 post relation으로 가져와야함
        'commentCount',
        count,
      );  // 서비스에서 relations: ['replies'] 추가해야함
  }
}
