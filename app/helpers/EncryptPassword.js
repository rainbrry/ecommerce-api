import CryptoJS from "crypto-js";
import { passwordKey } from "#config/env";

const encryptPassword = (password) => {
	return CryptoJS.AES.encrypt(password, passwordKey);
};

const verifyPassword = (encryptPassword) => {
	return CryptoJS.AES.decrypt(encryptPassword, passwordKey).toString(
		CryptoJS.enc.Utf8
	);
};

export { encryptPassword, verifyPassword };
