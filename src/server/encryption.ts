import Cryptr from "cryptr"
import { NonRetriableError } from "inngest";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY!);

export const encrypt = (input: string) => {

    try {
        return cryptr.encrypt(input);
    } catch (error) {
        throw new NonRetriableError("A problem occured while encryption")
    }

};
export const decrypt = (input: string) => {
    try {
        return cryptr.decrypt(input);
    } catch (error) {
        throw new NonRetriableError("A problem occured while decryption")
    }
} 
