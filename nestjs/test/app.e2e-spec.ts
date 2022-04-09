import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { access, appendFile } from "fs";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { AuthDto } from "../types/authDto";
import { LoginDto } from "../types/loginDto";

// Describe block
describe('App e2e', function () {
  // Set variable before beforeAll so it's accessible outside the scope
  let app: INestApplication;

  // we'll store PrismaService here
  let prisma: PrismaService;

  // beforeAll function defining a module before anything happens, and then compile()
  beforeAll( async function () {
    const moduleRef = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile();

    // Creating the Nest application
    app = moduleRef.createNestApplication();

    // Applying necessary configuration.
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));

    // Bootstrap app copy
    await app.init();
    // Start server
    await app.listen(3333);
  
    // Assign service to prisma and run cleanDb()
    prisma = app.get(PrismaService);
    prisma.cleanDb();

    // Set base URL
    pactum.request.setBaseUrl('http://localhost:3333');
  } );

  // Define what happens after all, close app.
  afterAll(function ()
  {
    app.close();
  });

  // AuthDto we'll use for testing
  let dto: AuthDto = {
    email: "email@email.com",
    password: "pass",
    nickname: "nick"
  }

  let loginDto: LoginDto = {
    email: "email@email.com",
    password: "pass",
  }

  describe('Auth', function () {

    describe('Signup', function () {
      it('Should sign up', function () {
        return (pactum.spec().post('/auth/signup',).withBody(dto).expectStatus(201));
      });
    })

    describe('Signin', function () {
      it('Should log in', function () {
        return (pactum.spec().post('/auth/signin',).withBody(dto).expectStatus(201).stores('userToken', 'access_token'));
      });
    })

    describe('Get Homepage', function () {
      it('Should get() homepage', function () {
        return (pactum.spec().get('/home',).withHeaders({
          Authorization: 'Bearer $S{userToken}',
        }).expectStatus(200).inspect());
      });
    })

  })
})