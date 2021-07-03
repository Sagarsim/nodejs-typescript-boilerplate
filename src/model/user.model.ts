import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique} from "typeorm";
import { Length, IsNotEmpty, IsEmail } from "class-validator";
import log from "../logger";
import bcrypt from "bcrypt"
import config from "config"
@Entity()
@Unique(["email"])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column("text")
    @IsNotEmpty()
    @Length(10, 20, {message: "password must be longer than or equal to 10 charactersqdasda"})
    password: string;

    @Column("datetime", {default: () =>"CURRENT_TIMESTAMP"})
    createdAt: Date;

    @Column("datetime", {default: null})
    modifiedAt: Date;

    @BeforeInsert()
    async beforeInsert(){
        let user = this;
        const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));
        const hash = await bcrypt.hashSync(user.password, salt);
        this.password = hash
    }
    comparePassword(candidatePassword: string) : Promise<boolean> {
        const user = this
        return bcrypt.compare(candidatePassword, user.password).catch((e) => false)
    }
}
