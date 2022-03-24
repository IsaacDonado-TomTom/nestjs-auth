# Table of Contents
1. [Setting up the first App](#set-up)
2. [Look into files generated](#files)
3. [Decorators](#decorators)
4. [Modules](#modules)
5. [Controllers/Providers](#controllers-providers)
6. [Create modules, controllers, providers/services from nest cli](#nest-cli)
7. [Create database models with PRISMA](#models-prisma)
8. [Authentification, sessions and Json web tokens](#authentification)







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






<a name="authentification"></a>
# Authentification, sessions & json web tokens
After setting up basic authentification we need to allow the user to log in only once in a while. Sessions is one technique to achieve that, the other one is using json web tokens. JWT is the way we're headed. 

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
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService],
  controllers: [AuthController]
})

export class authModule
{
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
