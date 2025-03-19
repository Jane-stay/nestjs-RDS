import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from './payload.interface';
import { sign } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    const { password, ...rest } = user;
    return rest;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('유저가 없습니다.');
    return user;
  }

  // async create(createUserDto: CreateUserDto) {
  //   const { email, password, name } = createUserDto;

  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const user = this.userRepository.create({
  //     email,
  //     password: hashedPassword,
  //     name,
  //   });
  //   return await this.userRepository.save(user);
  // }

  // async login(loginUserDto: LoginUserDto) {
  //   const { email, password } = loginUserDto;
  //   const user = await this.userRepository.findOne({ where: { email } });

  //   if (!user || !(await bcrypt.compare(password, user.password))) {
  //     throw new UnauthorizedException('입력하신 정보가가 일치하지 않습니다');
  //   }
  //   const payload = { id: user.id }; //뭘 넣어도 상관없으나 고유한 값 넣기
  //   const token = this.jwtService.sign(payload, { secret: 'secretKey' }); //inject 해주고, sign 사용하면

  //   return { message: '로그인 성공', token };
  // }

  // async checkJwtToken(token: string): Promise<PayloadInterface> {
  //   try {
  //     const decoded = this.jwtService.decode(token);
  //     return decoded;
  //   } catch (error) {
  //     throw new UnauthorizedException('유효하지 않은 토큰입니다');
  //   }
  // }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
