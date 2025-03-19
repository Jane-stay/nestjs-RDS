import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { encryptPassword } from 'src/utils/password-util';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    //   const user = this.userRepository.create(createUserDto);
    //   await this.userRepository.save(user);
    //   const { password, ...rest } = user;
    //   return rest;

    // async signUp(signUpDto: SignUpDto): Promise<ResponseUserDto> {
    //     signUpDto.password = (await encryptPassword(signUpDto.password)).toString();
    //     return await this.usersService.createUser(signUpDto);
    //   }
    if(event.entity.password){
            
    event.entity.password = (await encryptPassword(event.entity.password)).toString();
  }}
}
