import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Register, ForgotPasswordModel, LoginModel, FinaliseModel, LoginSubmitModel } from '../models/app.user.model';
import { BaseService } from './app.base.service';

@Injectable()
export class AuthService extends BaseService {
    login(loginSubmit: LoginSubmitModel) {
        return this.http.post<LoginModel>(this.environmentSettings.apiBaseUrl + "/login?username=" + loginSubmit.userid + "&password=" + loginSubmit.password, {});
    }

    private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn,'second');

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }          

    register(registerModel: Register) {
        registerModel.isTermOfService = true;
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/register", registerModel, { responseType: 'text' as 'json' });
    }

    forgotPassword(forgotPasswordModel: ForgotPasswordModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/forgotpassword", forgotPasswordModel);
    }

    logout() {
        localStorage.removeItem("token");
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }    

    confirmEmail(token: string, userid: string) {
        return this.http.get<any>(this.environmentSettings.apiBaseUrl + `/confirmEmail/?token=${token}&userid=${userid}`, { responseType: 'text' as 'json' });
    }

    createPassword(finalise: FinaliseModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/createPassword", finalise, { responseType: 'text' as 'json' });
    }

}