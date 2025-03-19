import { ResponsePaginationDto } from '../../../common/dto/response-pagination.dto';
import { Post } from '../entities/post.entity';

export class ResponseListAllPostDto extends ResponsePaginationDto {
  data: Post[];
}
