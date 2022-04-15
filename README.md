# To run project locally with db on docker

1. Run `make local-dependencies`
1. Run `make local-backend`
2. In another terminal run `make local-frontend`

```text
localhost:3001 = frontend
localhost:3000 = backend
```

# To run project on docker container (Must fix)

1. Run `make`


# Table of Contents
1. [Setting up the first App](#set-up)
2. [Look into files generated](#files)
3. [Decorators](#decorators)
4. [Modules](#modules)
5. [Controllers/Providers](#controllers-providers)
6. [Create modules, controllers, providers/services from nest cli](#nest-cli)
7. [Create database models with PRISMA](#models-prisma)
8. [ConfigModule](#config-module)
9. [Using PrismaClient and accessing the database](#using-prismaclient)
10. [Custom data transfer objects](#custom-dto)
11. [Nestjs class validator](#class-validator)
12. [Login logic and securing password](#login-segure-password)
13. [Authentification, sessions and Json web tokens](#authentification)
14. [Strategy](#strategy)
15. [Guards](#guards)
16. [Specific status codes](#specific-status-codes)
17. [e2e testing](#e2e)
18. [dotenv-cli](#dotenv-cli)
19. [NPM script hooks](#npm-script-hooks)
20. [Automating DB deletion through prisma](#prisma-db-cleanup)
21. [e2e testing using Pactum](#e2e-pactum)







<a name="set-up"></a>
# Setting up the first App
In the terminal go to wherever you want to store your project and 
```bash
nest new [PROJECT-NAME]
```

choose a package manager of your choice, then `cd` into the newly generated directory, the next command runs the serves

```bash
npm run start
```

For development mode, the command is
```bash
npm run start:dev
```

For more in depth documentation: [nestjs website documentation](https://docs.nestjs.com/)




<a name="files"></a>
# Overview files generated
**node_modules** just refers to all the dependencies needed by npm.

**package.json** manages all of the dependencies. 

**src folder** contains all the source files we'll work on

**test folder** is for writing your own end-to-end tests.

**.prettierrc** is for code formatting

**nest-cli** controls the nest command line interface, you can change the source folder, language used, etc.

**nodemon** is a config file tool used by nestjs to launch the node server and reloads automatically when a change is detected.

When introducing a new feature to an app, it's best practice to separate all the files related to this feature in a folder within the srcs folder.

Also, notice whenever you start a server a `dist` folder is created, this will contain all the compiled typescript files in its javascript form, you don't really have to worry about this but it's good to know in case something ever translates incorrectly (This should actually never happen otherwise nestjs wouldn't be so popular).





<a name="decorators"></a>
# Decorators
Decorators are a new type of javascript syntax, it's not a  nestjs feature, it's a tool introduced in javascript2015. Nestjs makes use of this new syntax which seems confusing at first, but it's just another way of wrapping a function within a function. Javascript already allowed us to do something like 

```javascript
function (stuff)
{
	// "Decoration" here
	return (function ()
	{
		// Do something.
	)
}
```

It just adds additional properties to a function.

#### A list of custom nestjs decorators [here.](https://docs.nestjs.com/custom-decorators)






<a name="modules"></a>
# Modules
Modules are explained [here](https://docs.nestjs.com/modules), generally we'll have an App module that can import other modules, and these modules are separated by feature. At first it seems like it's an over-complication but if separated into feature modules, it makes code much more maintainable and less prone to errors.

The whole point of modules is to organize code, each module can have sub-modules imported.
Let's create the most basic module in a folder corresponding to the feature within `src`

src/auth/auth.module.ts
```typescript
import { Module } from '@nestjs/common';

@Module({

})

export class authModule
{
    
}
```

A simple module has been created now and now we need to import it to the main app Module by importing the document, and adding it to the imports section. *imports section is just the name given by nestjs to let us know where to import modules, it has nothing to do with javascript's import function which we also need to have access to our new module*

src/app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { authModule } from './auth/auth.module';

@Module({
  imports: [authModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

To test it works you can `npm start:dev` in the terminal to launch the script in package.json

The application's entry point is `src/main.ts` and we can see how our main App module is instantiated and a server is created that listens on port 3000 by default

If we want nestjs to create a module with all the necessary boilerplate code for us we run 
```bash
nest g module [MODULE_NAME]
```

This will automatically add the  module to the main AppModule, the newly created module will specify which "controllers and services" you implement, we're basically splitting the process of routing in three, the modules for organizational purposes, the controllers, for redirection, and then providers for service/business code.








<a name="controllers-providers"></a>
# Controllers and Providers
In our controllers we'll use our @Controller decorator on our controller Class, and within this Class
we use `@Get()` and `@Post()` decorators on top of methods that will return a call to another method  within our our providers class... we could pass this function call some data or even process the whole request within the same method, but that defeats the purpose of nestjs, we want to return calls from our services class methods, and let the methods in services do the heavy lifting.

Remember when we add Controllers and Services to our main App Module, we don't need to add anything to our main app controller and service, we need to handle the specific post/get routes in the feature's own controller and service and be wise with the naming convention, in the end we're linking all our modules into one to build the app.

If we build a nestjs app that simply does the following 

+ takes us to the default nodejs homepage
+ takes us to a "auth page" at `localhost:3000/auth`
+ accepts a Post request at `localhost/auth/signup`
+ accepts a Post request at `localhost:3000/auth/signin`

Our controllers and services would look like this:

/src/app.controller.ts
```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}

```

/src/auth/auth.controller.ts
```typescript
import { Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    authProvider: AuthService;
    constructor(authProvider: AuthService)
    {
        this.authProvider = authProvider;
    }

    @Get()
    authHome()
    {
        return (this.authProvider.getAuth());
    }

    @Post('signup')
    signup()
    {
        return ('Signed up');
    }

    @Post('signin')
    signin()
    {
        return ('Signed IN!');
    }
}
```

src/auth/auth.service.ts
```typescript
import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService{
    getAuth(): string
    {
        return 'Welcome to Auth';
    }
}
```

Notice in our `@Get()` request to `localhost:3000/auth`:  we're returning a call to a method within the provider class. This is for the purpose of demonstrating, for the other two `@Post()` requests we return a string directly. Typically, post requests expect json as a response for testing this simple API, I recommend [Postman](https://www.postman.com/) for testing your get/post requests, it's a powerful and free tool.





<a name="nest-cli"></a>
# Nest command line interface
Run script for module: `nest g module [MODULE_NAME]`

Run script for controller: `nest g controller [CONTROLLER_NAME]`

Run script for provider: `nest g controller [PROVIDER_NAME]`






<a name="models-prisma"></a>
# Create database models with PRISMA
Database interactions can get complicated which is why ORMs are used, PRISMA is a very nice one.

First `cd` into your project directory and perform `npm install prisma --save-dev && npx prisma init`

A new folder will be generated along with a .env file where the URL of the database will be placed.

In the new prisma folder we'll find the schema.prisma file where we'll write any models we'll need

```text
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  email String @unique
  hash String

  firstName String?
  lastName String?
}
```

First the name of the table, then the type of data it will store, the prisma has a list of built in custom types that can be auto generated for you, such as `DateTime`, you can specify if you want it to be an optional field, example in first and last name, and we feed the @default decorator a function to give it a default value.

After we've set all our needed models, edit the .env file and set the database information accordingly, then run `npx prisma migrate dev`

We can also use `npx prisma migrate deploy` and it won't prompt us for a name and restores database.

`npx prisma studio` is also a nice tool to visualize database tables live.





<a name="config-module"></a>
# Config module

We may need information to connect to the database or other information that may vary and would be convenient to extract from a configuration file such as the `.env` generated. We can use a module for that.

`npm npm i --save @nestjs/config`

and import the module called ConfigModule from @nestjs/config into the imports of the main App module with the required configuration to make it available in every module.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { authModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  // Importing authModule and PrismaModule into the main app, so anything these modules export we're allowed to use directly.
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), authModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

and we pass a ConfigService class object to the constructor of any service class in order to access the module's getter functions to extract configuration variables from the .env file. Remember to add `@Injectable()` if injecting any module classes to the constructor

Example for prisma database configuration: 
src/prisma/prisma.service.ts
```typscript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private config: ConfigService)
    {
        super({
            datasources: {
                db: {
                    url: config.get('DATABSE_URL'),
                },
            },
        });
    }
}
```






<a name="using-prismaclient"></a>
# Using PrismaClient and accessing database
Now that we've correctly set up the PrismaService which extends from prisma client, we can import the database models into the AuthService and perform some logic with that.

In case we receive information along with a post request for example, we need to catch it with the @Body decorator within the parameters of the function in the controller/router, and pass those values to the business logic in the provider.

src/auth.controller.ts
```ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService)
    {
        this.authService = authService;
    }

    @Post('signin')
    signin(@Body() dto: any)
    {
        console.log('Gonna log dto');
        console.log(
            {
                dto: dto,
            }
        );
        console.log('Logged dto');
        return (this.authService.signin());
    }
}
```







<a name="custom-dto"></a>
# Custom data transfer objects
The example above works fine but we're expecting any type as a dto, that isn't good practice in typescript and we should make a custom dto type.

auth.dto.ts
```ts
//import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto
{
    //@IsEmail()
    //@IsNotEmpty()
    email: string;
    //@IsString()
    //@IsNotEmpty()
    hash: string;
}
```

src/auth.controller.ts
```ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../../../types/authDto'

@Controller('auth')
export class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService)
    {
        this.authService = authService;
    }

    @Post('signin')
    signin(@Body() dto: AuthDto)
    {
        console.log('Gonna log dto');
        console.log(
            {
                dto: dto,
            }
        );
        console.log('Logged dto');
        return (this.authService.signin());
    }
}
```







<a name="class-validator"></a>
# Nestjs Class validator
The example above is working but nestjs provides some parameters to automatically do some checking for commonly used types. For example to check if a string is an email etc, we can add these decorators in our dto and it will catch errors in case of any.

To use nestjs validation in your project run

```bash
npm i --save class-validator class-transformer
```

Before anything works though we need to configure the app to allow pipe validation throughout the project, open up the main.ts where the app is boostrapped and add this:

src/main.ts
```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ServerModule } from './server.module';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
	app.enableCors();
  app.useGlobalPipes(new ValidationPipe ());
  await app.listen(3000);
}
bootstrap();
```

*Notice:*  the `app.enableCors();` line is to allow our app to accept requests from different domains.

Now let's add some validation do our dto:
```ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto
{
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}
```

Now nestjs will check if our fields are valid and return an error if they're not, and of course you should handle this in the front end.

We can also add configuration information to the pipe validator to make our app more secure, for example we can make it so that a user cannot inject values besides the one established by the defined dto by adding the whitelist configuration.

src/main.ts
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe ({
    whitelist: true,
  }));
  await app.listen(3000);
}
bootstrap();
```








<a name="login-secure-password"></a>
# Login logic and securing the password
Let's create some signup logic, and some login logic and secure our passwords in the process but we'll be passing the dto to our service function which will perform all of the magic.

src/auth/auth.controller.ts
```ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../../types/authDto'

@Controller('auth')
export class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService)
    {
        this.authService = authService;
    }

    @Post('signin')
    signin(@Body() dto: AuthDto)
    {
        return (this.authService.signin(dto));
    }

    @Post('signup')
    signup(@Body() dto: AuthDto)
    {
        return (this.authService.signup(dto));
    }
}
```

Now we'll use argon2 to hash and securely store our passwords

```bash
npm install argon2
```

We'll make a signup(dto: AuthDto) function in our auth service that will 

+ Be async because prismaService does some fetching and placing in the db and argon does some fetching too.
+ Generate hash from the password
+ Save the user in the db
+ Return the saved user for now

src/auth/auth.service.ts
```ts
// INSIDE service class!
async signup(dto: AuthDto)
    {
        // Hash password
        const hash = await argon.hash(dto.password);

        // Save user in db
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash: hash,
            },
        })


        return (
            {
                user: user,
            }
            );
    }
```

Create a user with Postman or any other similar software, you'll receive the used as the body!

Since we set our email to be unique in the prisma schema, it will throw an error if the email you tried to sign up with is not unique. Make sure to catch any errors and define the behavior to check whether the error comes from prisma, the documentation provides us with codes and ways to check.

```ts
try {
// ... CODE WHERE WE TRY TO CREATE USER 
}
catch(error)
{
	if (error instanceof PrismaClientKnownRequestError
	{
		if (error.code === 'P2002')
		{
			throw new ForbiddenException("Email is taken.");
		}
	}
]
```

Now time for the sign-in logic

We have to 

+ Make the function async because prisma and argon fetch stuff.
+ Find user by email.
+ If the user doesn't exist, throw an exception
+ Compare password
+ If it's wrong throw another exception
+ Send back the user for now

```ts
// ... INSIDE service class
    async signin(dto: AuthDto)
    {
        // Try to find by email with prisma.user.findUnique
        const user: any = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        // Returns null if user is not found

        // Check if user is found
        if (!user)
        {
            throw new ForbiddenException('Invalid email');
        }
        else
        {
            // Compare passwords through hash using argon.verify, it accepts the hash and password
            const hashVerify: any =  await argon.verify(user.hash, dto.password);
            // Returns null if comparing failed

            //Checks if comparison failed
            if (!hashVerify)
            {
                throw new ForbiddenException('Invalid password');
            }
            else
            {
                // Send back the user for now
                return (user);
            }
        }
    }
```








<a name="authentification"></a>
# Authentification, sessions & json web tokens
After setting up basic authentification we need to allow the user to log in only once in a while. Sessions is one technique to achieve that, the other one is using json web tokens. JWT is what we'll use, the user provides a user-password pair, we return a JWT which will act as its `passport` to navigate the website

`npm install --save @nestjs/jwt passport-jwt && npm install --save-dev @types/passport-jwt`

and add these dependencies to the imports of the auth module like this:

```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
	})],
  providers: [AuthService],
  controllers: [AuthController]
})

export class authModule
{
    
}
```

and pass it as a dependency injection to the service class constructor.

```typescript
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private prisma: PrismaService;
    private jwt: JwtService;
    constructor(prisma: PrismaService, jwt: JwtService){
        this.prisma = prisma;
        this.jwt = jwt;
    }

    async signup(dto: AuthDto)
    {.......
		...............
		......................
}
```


Create an async signToken() method within the auth service class that sets the configuration for our jwt functions and returns a promise generic of type object with an access_token string `{ access_token: string }`, it will accept the user's id and email as parameters, we'll add those as claims to our token, and we can add as many claims as we want.

```typescript
async signToken(userId: number, email: string):Promise<{ access_token: string }>
    {
        // Create a payload object, sub is standard for jwt, we'll use ID, and our own claim (email)
        const payload = {
            sub: userId,
            email
        }

        // Grab secret string from environment
        const secret: string = this.config.get('SECRET');

        // Generate token using our payload object through jwt.signAsync
        // Function accepts the payload object and an object with the required secret key, and the expiration time of the token
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });

        // Return as an object that contains an access_token string.
        return ({
            access_token: token
        });
    }
```

Now modify the sign in and sign up functions so that they return they call and return the value of the signToken function.





<a name="strategy"></a>
# Strategy
Now we're returning an object with the access token, but say we want to visit a restricted page, we need to set up some logic that allows the user to include the token we made in the header of the requests under authorization. (`Bearer [token]`) ..

The logic that verifies that the authorization Bearer is correct is called a strategy.

It's basically a class that we'll import, create a folder in the auth module called strategy and make a baron export, with a file called `jwt.strategy.ts` 

Make a class called JwtStrategy which extends from the passport strategy from nestjs/passport , it accepts Strategy which comes from passport-jwt, and call the super constructor within the constructor with an object and some settings that'll basically state; where to extract the token from (the header->authorization), sets ignore expiration to false, sets the secret defined in the environment.. We'll need to make the class injectable and inject the ConfigService in order to obtain the secret.

Finally you should define  validate(payload) method within the class that performs some additional validation and returns the payload, we'll just log the payload.

src/auth/strategy/jwt.strategy.ts
```ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private config: ConfigService)
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('SECRET'),
        })
    }
		validate(payload: any)
    {
        console.log(payload);
        return (payload);
    }
}
```

Make sure to set the newly created strategy class as a provider for the auth module.

The strategy has been configured and can now be used to check user tokens, create a new route to protect it with our strategy.

```bash
nest g module example
nest g controller example
nest g service example
```

src/example/example.controller.ts
```ts
import { Controller, Get, Body } from '@nestjs/common';
import { ExampleService } from './example.service';

@Controller('example')
export class ExampleController {

    constructor(private exampleService: ExampleService)
    {

    }

    @Get()
    example (@Body() info: any)
    {
        return (this.exampleService.example(info));
    }
}
```

For now `this.exampleService.example(info)` will just log the info and return a string.

In order to make our app check for the token using the jwt passport strategy we need to use [@UseGuards() decorators](https://docs.nestjs.com/guards). 







<a name="guards"></a>
# Guards
A guard is a decorator that will stand in front of our route and will allow or not allow access to the route, using a provided strategy to check for legitimate access. 

It's possible to make your own custom guards but for the current case nestjs provides an auth guard that works and serves perfectly, it's included in `@nestjs/passport`.

Add the `UseGuard()` above the Get() route. and within the decorator parameter, we'll use AuthGuard([name  of strategy])

src/example/example.controller.ts
```ts
import { Controller, Get, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExampleService } from './example.service';

@Controller('example')
export class ExampleController {

    constructor(private exampleService: ExampleService)
    {

    }

		// We specify we want to use the 'jwt' strategy
    @UseGuards(AuthGuard('jwt'))
    @Get()
    example (@Body() info: any)
    {
        return (this.exampleService.example(info));
    }
}
```

Notice the string we pass to AuthGuard() as a parameter, it says jwt, the name of our strategy. 
When we created our strategy class by extending from nestjs' PassportStrategy, it automatically sets the name to jwt, but can change it and set it to be named however we'd like by providing a string as a second argument when extending, I'll leave it as jwt but I'll explicitly name it in the JwtStrategy class to make it more clear. This is of course all available in the documentation,.

src/auth/strategy/jwt.strategy.ts
```ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private config: ConfigService)
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('SECRET'),
        })
    }

    validate(payload: any)
    {
        console.log(payload);
        return (payload);
    }
}
```

Now if we request a get() on website:port/example we'll get a 401 error; unauthorized.

If we obtain a valid token however, and manually insert it in the header of the request under Authorization as `Bearer [token]`, we'll be able to access the page.

Great, now to collect any useful information about the user, you must perform the needed logic in the strategy validate() method, anything you return from that function, gets added to the user request.

Since our validate only returns the payload, we have access to the claims in the payload, id and email.

src/example/example.controller.ts
```ts
import { Controller, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExampleService } from './example.service';

@Controller('example')
export class ExampleController {

    constructor(private exampleService: ExampleService)
    {

    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    example (@Req() request: any)
    {
        console.log(request.user);
        return (JSON.stringify(request.user));
    }
}
```






<a name="custom-decorators"></a>
# Custom decorators
The example above is the simplest way of showing how nestjs works, but it's not good practice to use that those Express decorators because it's error prone, a better way of extracting information from the request is to follow [this guide on the nestjs website](https://docs.nestjs.com/custom-decorators) to create a custom decorator that will call a nestjs function specially for that.

Create a folder in the auth folder since it's related, called `decorator` make an index.ts and GetUser.decorator.ts, apply the baron export and let's modify the code from the nestjs website in the GetUser.decorator.ts.

src/auth/decorator/GetUser.decorator.ts
```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return user;
  },
);
```

src/example/example.controller.ts
```ts
import { Controller, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { ExampleService } from './example.service';
import { User } from '@prisma/client';

@Controller('example')
export class ExampleController {

    constructor(private exampleService: ExampleService)
    {

    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    example (@GetUser() user: User)
    {
        console.log(user);
        return (JSON.stringify(user));
    }
}
```

This achieves the same behavior but is safer, also notice we specify that our newly created decorator `GetUser()` returns a User type, this type is generated automatically by Prisma when we're creating database models, and is accessible from `@prisma/client`, another reason to love Prisma.

We can also tweak the custom decorator to allow for the whole object to be returned or a specific key inside the object type.

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data)
    {
        return (request.user[data]);
    }
    return request.user;
  },
);
```


Now `@GetUser() wholeUser: User, @GetUser('email'): email: string` passed as arguments provide the User object and a string with the email of the user because it exists within the object.






<a name="specific-status-codes"></a>
# Specific status codes
In case an app gained access to a route, we may want to define which status code it should return.
Nestjs makes it easy, just add `@HttpCode(HttpStatus.OK)` above the request to set the status code to 200. You can type in the number but that's error-prone

```text
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLYHINTS = 103,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED = 421,
    UNPROCESSABLE_ENTITY = 422,
    FAILED_DEPENDENCY = 424,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505
```








<a name="e2e"></a>
# End 2 end testing

The first thing we need to do is set up a database for e2e tests but before that, clean up our app.e2e-spec.ts file located in the test folder of our project.

Let's make a describe block (from Jest, a library for JS testing included in nestjs), kill the server, it doesn't need to be running.

project-directory/test/app.e2e-spec.ts
```ts

describe('App e2e', function () {
  it.todo('Passed')
})
```

Now run a script included by nestjs. 

```bash
npm run test:e2e
```

If we run the script we see some output and it supposedly passed a test, because we didn't define any.

First we need to create a module that basically copies our main app module and sets it ready

```ts
import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";

describe('App e2e', function () {
  beforeAll( async function () {
    const moduleRef = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile()
  } );
  it.todo('Passed')
})
```

And in order to make these tests run automatically any time a change is detected, add `--watch --no-cache` to the e2e testing script; `"test:e2e": "jest --watch --no-cache --config ./test/jest-e2e.json"`

So far what has happened is we have cloned our main app module, but we need to create an app from it just like we do in the main.ts, we also have to configure everything as close as possible to our app. 

```ts
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { appendFile } from "fs";
import { AppModule } from "../src/app.module";

// Describe block
describe('App e2e', function () {
  // Set variable before beforeAll so it's accessible outside the scope
  let app: INestApplication;

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

  } );

  // Define what happens after all, close app.
  afterAll(function ()
  {
    app.close();
  });

  it.todo('Passed');
})
```

Now let's setup a separate database for testing and all the related scripts.

docker-compose.yml
```yml
version: '3.8'

services:

  testdb:
    image: postgres:14.2
    ports:
      - 5435:5432
    container_name: testdb
    environment:
      - POSTGRES_USER=user123
      - POSTGRES_PASSWORD=pass123
      - POSTGRES_DB=nestdb
    networks:
      - app_default
    restart: always

networks:

  app_default:
    driver: bridge
```

Now let's add these scripts to package.json to automatically restart and restore our test database.

```json
		"prisma:test:deploy": "prisma migrate deploy",
    "db:test:rm": "docker-compose -f ../db_docker/docker-compose.yml rm -s -f -v testdb",
    "db:test:up": "docker-compose -f ../db_docker/docker-compose.yml up -d testdb",
    "db:test:restart": "npm run db:test:rm && npm run db:test:up && sleep 1 && npm run prisma:test:deploy",
```

Now there's one issue with what we just did, whenever prisma:test:deploy runs, prisma will try to grab the environment variable with the DATABASE_URL from the `.env` file, and inside that file, we've explicitly specified the main database url we're using.

<a name="dotenv-cli"></a>
Ideally we'd like to create a new environment file called `.env.test` and grab values from there whenever running tests and for that we need **dotenv-cli**

```bash
npm install dotenv-cli
```

And now we need to prefix the prisma script with `dotenv -e [env-file] -- `

```json
"prisma:test:deploy": "dotenv -e .env.test -- prisma migrate deploy",
```

but also, the e2e test script, so nestjs knows it should use that environment

```json
"test:e2e": "dotenv -e .env.test -- jest --watch --no-cache --config ./test/jest-e2e.json"
```

<a name="npm-script-hooks"></a>

Add a hook to the test:e2e script that resets the test database

```json
    "pretest:e2e": "npm run db:test:restart",
    "test:e2e": "dotenv -e .env.test -- jest --watch --no-cache --config ./test/jest-e2e.json"
```

*Remember* to prefix ` npx prisma studio` with `dotenv -e .env.test -- ` to force the correct environment file in case you want to visualize the test database.




<a name="prisma-db-cleanup"></a>
# Automating DB deletion through prisma
When executing e2e tests, there may be instances in which we don't want to completely restart the docker container but we might need to clean the database while we're testing. We'll need to add another method to a PrismaService class called `cleanDb()` and specify what it should do.

```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private config: ConfigService)
    {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                },
            },
        });
    }

    cleanDb()
    {
        this.user.deleteMany();
				this.other.deleteMany();
    }
}
```

The code above works, remember prisma creates objects from the models we provide which is why we can access `this.user` but sometimes we might need for things to be deleted in a certain order to avoid errors, and although we specify that user should be deleted first, the prisma class our service extends from might do some optimizations and change the order, so we need to use the `$transaction` identifier prisma provides.

```ts
cleanDb()
    {
        return this.$transaction([
            this.user.deleteMany(),
						this.other.deleteMany();
        ]);
    }
```

Now if we want access to the PrismaService module, we just have to declare a variable and assign it the service through our created app copy.

```ts
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { appendFile } from "fs";
import { PrismaService } from "src/prisma/prisma.service";
import { AppModule } from "../src/app.module";

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
  
    // Assign service to prisma and run cleanDb()
    prisma = app.get(PrismaService);
    prisma.cleanDb();
  } );

  // Define what happens after all, close app.
  afterAll(function ()
  {
    app.close();
  });

  it.todo('Passed');
})
```


Now we can set up the structure of our tests after the afterAll() block..

```ts
describe('Auth', function () {

    describe('Signup', function () {
      it.todo('Should sign up');
    })

    describe('Signin', function () {
      it.todo('Should sign in')
    })

  })
```



<a name="e2e-pactum"></a>
# e2e testing using Pactum
PactumJS is a very easy to use library for testing API's. 

To install it into our project

```bash
npm install pactum
```

Pactum is a library that requests data from a server, so far we copied the module but we didn't start the server, we must start it after we call app.init() in the beforeAll() block

```ts
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
  } );
```

Now `import * as pactum from 'pactum';` and add some actual tests to our structure after the afterAll() block

```ts
  // AuthDto we'll use for testing
  let dto: AuthDto = {
    email: "email@email.com",
    password: "pass"
  }

  describe('Auth', function () {

    describe('Signup', function () {
      it('Should sign up', function () {
        return (pactum.spec().post('http://localhost:3333/auth/signup',).withBody(dto).expectStatus(201));
      });
    })

    describe('Signin', function () {
      it('Should sign up', function () {
        return (pactum.spec().post('http://localhost:3333/auth/signin',).withBody(dto).expectStatus(201));
      });
    })

  })
```

We can make this code a bit less verbose by setting the base url in the beforeAll() block

```ts
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { appendFile } from "fs";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { AuthDto } from "../types/authDto";

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
    password: "pass"
  }

  describe('Auth', function () {

    describe('Signup', function () {
      it('Should sign up', function () {
        return (pactum.spec().post('/auth/signup',).withBody(dto).expectStatus(201));
      });
    })

    describe('Signin', function () {
      it('Should sign up', function () {
        return (pactum.spec().post('/auth/signin',).withBody(dto).expectStatus(201));
      });
    })

  })
})
```

It would be nice to see the response in case of an error, or for any reason. we can use the .inspect() after the request to view the response in the terminal

```ts
  describe('Auth', function () {

    describe('Signup', function () {
      it('Should sign up', function () {
        return (pactum.spec().post('/auth/signup',).withBody(dto).expectStatus(201).inspect());
      });
    })

    describe('Signin', function () {
      it('Should sign up', function () {
        return (pactum.spec().post('/auth/signin',).withBody(dto).expectStatus(201).inspect());
      });
    })

  })
```

Now, say we want to store a piece of the response inside a variable, we don't need to declare a variable and set it there, pactum provides a functionality for storing something from the response into a variable and allows you to use it later in another test using `stores()`

```ts
  // AuthDto we'll use for testing
  let dto: AuthDto = {
    email: "email@email.com",
    password: "pass"
  }

  describe('Auth', function () {

    describe('Signup', function () {
      it('Should sign up', function () {
        return (pactum.spec().post('/auth/signup',).withBody(dto).expectStatus(201));
      });
    })

    describe('Signin', function () {
      it('Should sign up', function () {
        return (pactum.spec().post('/auth/signin',).withBody(dto).expectStatus(201).stores('userToken', 'access_token'));
      });
    })

  })
```

This now stores the access_token received from the last request into a variable we named userToken, in order to access this variable in the test we need to use a special notation: `$S{userToken}`