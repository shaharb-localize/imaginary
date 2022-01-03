import { getModelForClass, prop } from '@typegoose/typegoose'

class User {
    @prop()
    public name?: string;
    @prop()
    public phone?: string;
    @prop()
    public password?: string;
}

export default getModelForClass(User);