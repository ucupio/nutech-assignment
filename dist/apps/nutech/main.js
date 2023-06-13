/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const imagekit_1 = __webpack_require__(6);
const users_module_1 = __webpack_require__(9);
const auth_module_1 = __webpack_require__(25);
const products_module_1 = __webpack_require__(27);
const multer = __webpack_require__(33);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const isProduction = process.env.NODE_ENV === 'production';
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(upload.single('image'), imagekit_1.ImageKitMiddleware)
            .exclude({ path: 'api/products', method: common_1.RequestMethod.GET }, 'api/products/(.*)')
            .forRoutes('products');
    }
};
AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forRoot(isProduction ? process.env.MONGODB_URL : process.env.MONGODB_URL_DEV),
            users_module_1.UserModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule
        ]
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageKitMiddleware = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @typescript-eslint/no-explicit-any */
const common_1 = __webpack_require__(2);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = __webpack_require__(7);
const axios_1 = tslib_1.__importDefault(__webpack_require__(8));
let ImageKitMiddleware = class ImageKitMiddleware {
    use(req, res, next) {
        if (!req.file) {
            next({ name: 'File required' });
        }
        else {
            console.log('masuk');
            const form = new FormData();
            const date = new Date().toLocaleDateString();
            form.append('file', req.file.buffer.toString('base64'));
            form.append('fileName', `${req.body.productname}-${date}`);
            const bufferFrom = `${process.env.PRIVATE_KEY_IMAGEKIT}:`;
            const privateKey = Buffer.from(bufferFrom).toString('base64');
            axios_1.default
                .post('https://api.imagekit.io/v1/files/upload', form, {
                headers: Object.assign(Object.assign({}, form.getHeaders()), { Authorization: `Basic ${privateKey}` }),
            })
                .then(function (response) {
                req.body.image = response.data.url;
                console.log(response.data.url);
                next();
            })
                .catch(function (error) {
                next(error);
            });
        }
    }
};
ImageKitMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ImageKitMiddleware);
exports.ImageKitMiddleware = ImageKitMiddleware;


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("form-data");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const user_service_1 = __webpack_require__(10);
const user_controller_1 = __webpack_require__(15);
const mongoose_1 = __webpack_require__(5);
const user_schema_1 = __webpack_require__(14);
const jwt_1 = __webpack_require__(19);
const hash_service_1 = __webpack_require__(12);
const auth_service_1 = __webpack_require__(20);
const jwt_strategy_1 = __webpack_require__(21);
const local_strategy_1 = __webpack_require__(23);
let UserModule = class UserModule {
};
UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema
                }]),
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
                signOptions: {
                    expiresIn: '60d'
                },
            }),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, hash_service_1.HashService, auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy],
    })
], UserModule);
exports.UserModule = UserModule;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(11);
const hash_service_1 = __webpack_require__(12);
const user_schema_1 = __webpack_require__(14);
let UserService = class UserService {
    constructor(userModel, hashService) {
        this.userModel = userModel;
        this.hashService = hashService;
    }
    getUserByUsername(username) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.userModel.findOne({
                username
            })
                .exec();
        });
    }
    registerUser(createUserDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // validate DTO
            const createUser = new this.userModel(createUserDto);
            // check if user exists
            const user = yield this.getUserByUsername(createUser.username);
            if (user) {
                throw new common_1.BadRequestException();
            }
            // Hash Password
            createUser.password = yield this.hashService.hashPassword(createUser.password);
            return createUser.save();
        });
    }
};
UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof hash_service_1.HashService !== "undefined" && hash_service_1.HashService) === "function" ? _b : Object])
], UserService);
exports.UserService = UserService;


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HashService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const bcrypt = tslib_1.__importStar(__webpack_require__(13));
let HashService = class HashService {
    hashPassword(password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const saltOrRounds = 10;
            return yield bcrypt.hash(password, saltOrRounds);
        });
    }
    comparePassword(password, hash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.compare(password, hash);
        });
    }
};
HashService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], HashService);
exports.HashService = HashService;


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(5);
let User = class User {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "username", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "password", void 0);
User = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const user_service_1 = __webpack_require__(10);
const create_user_dto_1 = __webpack_require__(16);
const passport_1 = __webpack_require__(18);
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getUserByUsername(param) {
        return this.userService.getUserByUsername(param.username);
    }
    registerUser(createUserDto) {
        return this.userService.registerUser(createUserDto);
    }
};
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('username'),
    tslib_1.__param(0, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "getUserByUsername", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "registerUser", null);
UserController = tslib_1.__decorate([
    (0, common_1.Controller)('regester'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserController);
exports.UserController = UserController;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const user_entity_1 = __webpack_require__(17);
class CreateUserDto extends user_entity_1.User {
}
exports.CreateUserDto = CreateUserDto;


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
class User {
}
exports.User = User;


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(1);
const user_service_1 = __webpack_require__(10);
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(19);
const hash_service_1 = __webpack_require__(12);
let AuthService = class AuthService {
    constructor(userService, hashService, jwtService) {
        this.userService = userService;
        this.hashService = hashService;
        this.jwtService = jwtService;
    }
    validateUser({ email, pass }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserByUsername(email);
            if (user && (yield this.hashService.comparePassword(pass, user.password))) {
                return user;
            }
            return null;
        });
    }
    login(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const payload = {
                username: user.email,
                sub: user.id
            };
            return {
                access_token: this.jwtService.sign(payload),
            };
        });
    }
};
AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, typeof (_b = typeof hash_service_1.HashService !== "undefined" && hash_service_1.HashService) === "function" ? _b : Object, typeof (_c = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _c : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(1);
const passport_jwt_1 = __webpack_require__(22);
const passport_1 = __webpack_require__(18);
const common_1 = __webpack_require__(2);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY,
        });
    }
    validate(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {
                userId: payload.sub,
                username: payload.username
            };
        });
    }
};
JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const tslib_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(20);
const passport_local_1 = __webpack_require__(24);
const passport_1 = __webpack_require__(18);
const common_1 = __webpack_require__(2);
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    validate(username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.authService.validateUser;
            if (!user) {
                throw new common_1.UnauthorizedException({
                    message: "You have entered a wrong username or password"
                });
            }
            return user;
        });
    }
};
LocalStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(20);
const auth_controller_1 = __webpack_require__(26);
const mongoose_1 = __webpack_require__(5);
const user_schema_1 = __webpack_require__(14);
const jwt_1 = __webpack_require__(19);
const user_service_1 = __webpack_require__(10);
const hash_service_1 = __webpack_require__(12);
const local_strategy_1 = __webpack_require__(23);
let AuthModule = class AuthModule {
};
AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema
                }]),
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
                signOptions: {
                    expiresIn: '60d'
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, user_service_1.UserService, local_strategy_1.LocalStrategy, hash_service_1.HashService],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(20);
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(18);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.authService.login(req.user);
        });
    }
};
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)(`/login`),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);
exports.AuthController = AuthController;


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductsModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const products_service_1 = __webpack_require__(28);
const products_controller_1 = __webpack_require__(29);
const product_entity_1 = __webpack_require__(32);
const mongoose_1 = __webpack_require__(5);
let ProductsModule = class ProductsModule {
};
ProductsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'product', schema: product_entity_1.ProductSchema }]),
        ],
        controllers: [products_controller_1.ProductsController],
        providers: [products_service_1.ProductsService],
    })
], ProductsModule);
exports.ProductsModule = ProductsModule;


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductsService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(11);
let ProductsService = class ProductsService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    create(createProductDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.productModel.create(createProductDto);
        });
    }
    findAll() {
        return this.productModel.find();
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.productModel.findById(id).exec();
        });
    }
    update(id, updateProductDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.productModel.findByIdAndUpdate(id, updateProductDto);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.productModel.findByIdAndDelete(id);
        });
    }
};
ProductsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)('product')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ProductsService);
exports.ProductsService = ProductsService;


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductsController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const products_service_1 = __webpack_require__(28);
const create_product_dto_1 = __webpack_require__(30);
const update_product_dto_1 = __webpack_require__(31);
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    findAll() {
        return this.productsService.findAll();
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
};
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_product_dto_1.CreateProductDto !== "undefined" && create_product_dto_1.CreateProductDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof update_product_dto_1.UpdateProductDto !== "undefined" && update_product_dto_1.UpdateProductDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
ProductsController = tslib_1.__decorate([
    (0, common_1.Controller)('products'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof products_service_1.ProductsService !== "undefined" && products_service_1.ProductsService) === "function" ? _a : Object])
], ProductsController);
exports.ProductsController = ProductsController;


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateProductDto = void 0;
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProductDto = void 0;
const create_product_dto_1 = __webpack_require__(30);
class UpdateProductDto extends create_product_dto_1.CreateProductDto {
}
exports.UpdateProductDto = UpdateProductDto;


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductSchema = exports.Product = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(5);
let Product = class Product {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "productname", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "category_id", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "description", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "ingredients", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "recipe", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "price", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "stock", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "active", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "image", void 0);
Product = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], Product);
exports.Product = Product;
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);


/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("multer");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        app.enableCors({
            allowedHeaders: ['content-type'],
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
            optionsSuccessStatus: 200
        });
        const port = process.env.PORT || 3000;
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map