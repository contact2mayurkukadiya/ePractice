import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SpecialtyModel, TaxModel, ConcessionModel, MissedReasonModel, PaymentTypeModel, TreatmentRoomModel, MarketingSourceModel, CancelReasonModel, AppointmentTypeModel, DiscountTypeModel, DocumentTypeModel, BusinessTemplateModel } from '../models/app.settings.model';
import { ProductModel } from '../models/app.product.model';
import { BaseService } from './app.base.service';
import { Observable } from 'rxjs';
import { DocTypeDataModel } from "../models/app.misc";

@Injectable()
export class SettingsService extends BaseService {
    sharedData: string;
    // ========= Specialty =========
    getAllSpecialties() {
        return this.http.get<SpecialtyModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllSpecialties");
    }

    getSpecialty(id: string) {
        return this.http.get<SpecialtyModel>(this.environmentSettings.apiBaseUrl + `/GetSpecialtyById/${id}`);
    }

    createSpecialty(specialty: SpecialtyModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateSpecialty", specialty);
    }

    updateSpecialty(specialty: SpecialtyModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateSpecialty", specialty);
    }

    // ========= Tax =========
    getAllTaxes() {
        return this.http.get<TaxModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllTaxes");
    }

    getTax(id: string) {
        return this.http.get<TaxModel>(this.environmentSettings.apiBaseUrl + `/GetTaxById/${id}`);
    }

    createTax(tax: TaxModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateTax", tax);
    }

    updateTax(tax: TaxModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateTax", tax);
    }

    // ========= Cpncession =========
    getAllConcessions() {
        return this.http.get<ConcessionModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllConcessions");
    }

    getConcession(id: string) {
        return this.http.get<ConcessionModel>(this.environmentSettings.apiBaseUrl + `/GetConcessionById/${id}`);
    }

    createConcessions(concession: ConcessionModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateConcession", concession);
    }

    updateConcessions(concession: ConcessionModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateConcession", concession);
    }

    // ========= Missed Reason =========
    getAllMissedReasons() {
        return this.http.get<MissedReasonModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllMissedReasons");
    }

    getMissedReason(id: string) {
        return this.http.get<MissedReasonModel>(this.environmentSettings.apiBaseUrl + `/GetMissedReasonById/${id}`);
    }

    createMissedReason(missedReason: MissedReasonModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateMissedReason", missedReason);
    }

    updateMissedReason(missedReason: MissedReasonModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateMissedReason", missedReason);
    }

    // ========= Payment Type =========
    getAllPaymentTypes() {
        return this.http.get<PaymentTypeModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllPayments");
    }

    getPaymentType(id: string) {
        return this.http.get<PaymentTypeModel>(this.environmentSettings.apiBaseUrl + `/GetPaymentById/${id}`);
    }

    createPaymentType(paymentType: PaymentTypeModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreatePayment", paymentType);
    }

    updatePaymentType(paymentType: PaymentTypeModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdatePayment", paymentType);
    }

    // ========= Treatment Room =========
    getAllTreatmentRooms(): Observable<TreatmentRoomModel[]> {
        return this.http.get<TreatmentRoomModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllTreatments");
    }

    getTreatmentRoom(id: string) {
        return this.http.get<TreatmentRoomModel>(this.environmentSettings.apiBaseUrl + `/GetTreatmentById/${id}`);
    }

    createTreatmentRoom(treatmentRoom: TreatmentRoomModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateTreatment", treatmentRoom);
    }

    updateTreatmentRoom(treatmentRoom: TreatmentRoomModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateTreatment", treatmentRoom);
    }

    // ========= Cancel Reason =========
    getAllCancelReasons() {
        return this.http.get<CancelReasonModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllCancelReasons");
    }

    getCancelReason(id: string) {
        return this.http.get<CancelReasonModel>(this.environmentSettings.apiBaseUrl + `/GetCancelReasonById​/${id}`);
    }

    createCancelReason(cancelReason: CancelReasonModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateCancelReason", cancelReason);
    }

    updateCancelReason(cancelReason: CancelReasonModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateCancelReason", cancelReason);
    }

    // ========= Marketing Source =========
    getAllMarketingSources() {
        return this.http.get<MarketingSourceModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllMarketingSources");
    }

    getMarketingSource(id: string) {
        return this.http.get<MarketingSourceModel>(this.environmentSettings.apiBaseUrl + `/GetMarketingSourceById/${id}`);
    }

    createMarketingSource(marketingSource: MarketingSourceModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateMarketingSource", marketingSource);
    }

    updateMarketingSource(marketingSource: MarketingSourceModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateMarketingSource", marketingSource);
    }

    // ========= Appointment Type =========
    getAllAppointmentTypes() {
        return this.http.get<AppointmentTypeModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllAppointmentTypes");
    }

    getAppointmentType(id: string) {
        return this.http.get<AppointmentTypeModel>(this.environmentSettings.apiBaseUrl + `/GetAppointmentTypeById/${id}`);
    }

    createAppointmentType(appointmentType: AppointmentTypeModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateAppointmentTypes", appointmentType);
    }

    updateAppointmentType(appointmentType: AppointmentTypeModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateAppointmentTypes", appointmentType);
    }

    // ========= Discount Type =========
    getAllDiscountTypes() {
        return this.http.get<DiscountTypeModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllDiscount");
    }

    getDiscountType(id: string) {
        return this.http.get<DiscountTypeModel>(this.environmentSettings.apiBaseUrl + `/GetDiscountById/${id}`);
    }

    createDiscountType(discountType: DiscountTypeModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateDiscount", discountType);
    }

    updateDiscountType(discountType: DiscountTypeModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateDiscount", discountType);
    }

    // ========= DocumentType Type =========
    getAllDocumentTypes() {
        return this.http.get<DocumentTypeModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllDocumentTypes");
    }

    getDocumentTypeType(id: string) {
        return this.http.get<DocumentTypeModel>(this.environmentSettings.apiBaseUrl + `/GetDocumentTypeById/${id}`);
    }

    createDocumentTypeType(documentType: DocumentTypeModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateDocumentTypes", documentType);
    }

    updateDocumentTypeType(documentType: DocumentTypeModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateDocumentTypes", documentType);
    }

    // createApplicationData(doctypeDataModel: DocTypeDataModel) {
    //     return this.http
    //         .post<any>(
    //             this.environmentSettings.apiBaseUrl + '/CreateDocumentTypes',
    //             doctypeDataModel
    //         );
    // }


    // ========= Roles =========
    getAllRoles() {
        return this.http.get<any[]>(this.environmentSettings.apiBaseUrl + "/GetAllRoles");
    }

    // ========= BussinessTemplate =========

    getAllBussinessTemplate(type: number) {
        return this.http.get<any[]>(
            this.environmentSettings.apiBaseUrl +
            `/getallbusinesstemplatesByType?type=${type}`
        );
    }
    getallbusinesstemplatesById(templateId: string) {
        return this.http.get<BusinessTemplateModel>(this.environmentSettings.apiBaseUrl + `/getallbusinesstemplatesById?templateId=${templateId}`);
    }

    createbusinesstemplate(bussinesstemplate: BusinessTemplateModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/createbusinesstemplate", bussinesstemplate);
    }

    updatebusinesstemplate(bussinesstemplate: BusinessTemplateModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/updatebusinesstemplate", bussinesstemplate);
    }
    deletebusinesstemplatesById(templateId: string) {
        return this.http.delete<any>(this.environmentSettings.apiBaseUrl + `/deletebusinesstemplatesById?templateId=${templateId}`);
    }
}